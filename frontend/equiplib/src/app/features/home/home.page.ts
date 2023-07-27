import { LocationService } from 'src/app/services/location.service';
import { Equipment, Tag } from 'src/app/models/equipment';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { AlertController, IonModal, PopoverController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { QrService } from 'src/app/services/qr.service';
import { Idownloadable } from 'src/app/models/downloadable';
import { OverlayEventDetail } from '@ionic/core/components';

class Filter {
  locationids: number[] = [];
  tagids: number[] = [];
  name: string = '';
  onlyRented: boolean = false;
}

class Downloadable implements Idownloadable {
  data: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loading: boolean = false;
  submitted: boolean = false;
  openQrCode: boolean = false;
  enterPinCode: boolean = false;
  QrCode!: string;
  equipments: Observable<Equipment[]> = of([]);
  filteredEquipments: Observable<Equipment[]>;
  locations!: Observable<Location[]>;
  tags!: Observable<Tag[]>;
  rentedEquipmentIds: number[] = [];
  isSelectedTag: boolean[] = [];
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;
  filter: Filter = new Filter();
  filteredEquipmentCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  filteredEquipmentCount$: Observable<number> = this.filteredEquipmentCountSubject.asObservable();

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    public locationService: LocationService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
    public QrService: QrService
  ) {
    this.equipments = this.equipmentService.getAllEquipment(
      this.accountService.user.organizationid
    );
    this.locations = locationService.getAllLocations(
      this.accountService.user.organizationid
    );
    this.tags = equipmentService.getAllTags(
      this.accountService.user.organizationid
    );
    this.filteredEquipments = this.equipments;
  }

  ngOnInit() {
    this.rentService
      .getCurrentActiveRentals(this.accountService.user.organizationid)
      .subscribe((rents) =>
        rents.map((rent) => this.rentedEquipmentIds.push(rent.equipmentid))
      );

    // Set the initial value of filteredEquipments
    this.filteredEquipments = this.getFilteredEquipment(this.filter);

    // Calculate and update the filtered equipment count
    this.filteredEquipments.pipe(
      map((equipments) => equipments.length)
    ).subscribe((count) => this.filteredEquipmentCountSubject.next(count));
  }

  ionViewWillEnter() {
    this.rentService
      .getCurrentActiveRentals(this.accountService.user.organizationid)
      .subscribe((rents) =>
        rents.map((rent) => this.rentedEquipmentIds.push(rent.equipmentid))
      );

    this.loading = false;
    this.loadEquipments();
  }

  @ViewChild(IonModal) modal: IonModal;

  cancel() {
    this.modal.dismiss(null, 'Avbryt');
  }

  confirm() {
    this.filteredEquipments = this.getFilteredEquipment(this.filter);
    this.modal.dismiss(this.name, 'Bekreft');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async loadEquipments() {
    const loading = await this.loadingController.create({
      cssClass: 'home-loading',
      message: 'Laster..',
      spinner: 'crescent',
      translucent: true,
    });

    try {
      await loading.present();
      this.equipments = this.equipmentService.getAllEquipment(
        this.accountService.user.organizationid
      );
      this.filteredEquipments = this.equipments;
    } finally {
      loading.dismiss();
    }
  }

  downloadAll() {
    this.equipments.subscribe((equipments) => {
      const items: Downloadable[] = equipments.map((equipment) => {
        const item = new Downloadable();
        item.data = equipment.id.toString();
        item.name = equipment.name;
        return item;
      });

      this.QrService.downloadQrAsZip(items);
    });
  }

  trackByFn(index: number, equipment: Equipment): number {
    return equipment.id;
  }

  getFilteredEquipment(filter: Filter): Observable<Equipment[]> {
    return this.equipments.pipe(
      map((equipments) => {
        // Apply filtering based on tagids
        if (filter.tagids.length > 0) {
          equipments = equipments.filter((eq) => {
            return eq.tags.some((eqtag) => filter.tagids.includes(eqtag.id));
          });
        }

        // Apply filtering based on locationids
        if (filter.locationids.length > 0) {
          equipments = equipments.filter((eq) => {
            return filter.locationids.includes(eq.locationid);
          });
        }

        // Apply filtering based on name
        if (filter.name !== '') {
          equipments = equipments.filter((equipment) => {
            return equipment.name.toLowerCase().includes(filter.name.toLowerCase());
          });
        }

        // Apply filtering based on onlyRented
        if (filter.onlyRented) {
          equipments = equipments.filter((equipment) => {
            return this.rentedEquipmentIds.includes(equipment.id);
          });
        }

        return equipments;
      })
    );
  }

  getLocationForEquipment(equipid: number, locations: Location[]): Location {
    return locations.find((item) => item.id === equipid);
  }

  handleTagFilterChange(event: any) {
    this.filter.tagids = event.target.value;
    this.onFilterChanged();
  }

  async handleLocationFilterChange(event: any) {
    this.filter.locationids = event.target.value;
    this.onFilterChanged();
    this.filteredEquipments.subscribe((equipments) => {
      this.filteredEquipmentCountSubject.next(equipments.length);
    });
  }

  handleSearchFilterChange(event: any) {
    this.filter.name = event.target.value;
    this.onFilterChanged();
  }

  async filterOnTags(tag: Tag): Promise<void> {
    const tagIndex = this.filter.tagids.indexOf(tag.id);
    if (tagIndex > -1) {
      this.filter.tagids.splice(tagIndex, 1);
    } else {
      this.filter.tagids.push(tag.id);
    }

    const tags = await this.tags.toPromise(); // Extract the value from Observable

    this.isSelectedTag = tags.map((tag: Tag) => this.filter.tagids.includes(tag.id));

    this.onFilterChanged();
  }

  async onFilterChanged() {
    this.getFilteredEquipment(this.filter).pipe(
      tap((filteredEquipments) => {
        this.filteredEquipmentCountSubject.next(filteredEquipments.length);
      })
    ).subscribe();
  }

}
