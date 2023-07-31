import { LocationService } from 'src/app/services/location.service';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Observable, map } from 'rxjs';
import { Component, OnInit, ViewChild} from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { AlertController, IonModal, PopoverController } from '@ionic/angular'
import { LoadingController } from '@ionic/angular';
import {QrService} from 'src/app/services/qr.service';
import {Idownloadable} from 'src/app/models/downloadable';

class Filter {
  tagids: number[] = [];
  locationids: number[] = [];
  name: string = "";
  showRented: boolean = true;
  showAvailable: boolean = true;
  showActive: boolean = true;
  showDeactivated: boolean = true;

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
  equipments: Observable<Equipment[]>
  filteredEquipments: Observable<Equipment[]>
  locations!: Observable<Location[]>
  tags!: Observable<Tag[]>
  rentedEquipmentIds: number[] = [];
  isSelectedTag: boolean[] = [];

  filter: Filter = new Filter();

	constructor(
    private loadingController: LoadingController,
    public locationService: LocationService,
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
    public QrService: QrService,
  ) {
    this.equipments = this.equipmentService.getAllEquipment(this.accountService.user.organizationid)
    this.locations = locationService.getAllLocations(this.accountService.user.organizationid)
    this.tags = equipmentService.getAllTags(this.accountService.user.organizationid)
    this.filteredEquipments = this.equipments
  }

  ngOnInit() {
    this.rentService.getCurrentActiveRentals(this.accountService.user.organizationid).subscribe(rents=>rents.map(rent => this.rentedEquipmentIds.push(rent.equipmentid)))
    this.onFilterChanged();
  }

  ionViewWillEnter() {
    this.loading = false;
    this.loadEquipments()
  }

  async loadEquipments() {
    const loading = await this.loadingController.create({
      cssClass: 'home-loading',
      message: 'Laster..',
      spinner: 'crescent',
      translucent: true
    });

    try {
      await loading.present();
      this.equipments = this.equipmentService.getAllEquipment(this.accountService.user.organizationid);
      this.filteredEquipments = this.equipments;
    } finally {
      loading.dismiss();
    }
  }

  downloadAll() {
    this.equipments.subscribe(equipments => {
      const items: Downloadable[] = equipments.map(equipment => {
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

  toggleBooleanProperty(propertyName: string) {
      this[propertyName] = !this[propertyName];
    }

    getFilteredEquipment(filter: Filter): Observable<Equipment[]> {
      return this.equipments.pipe(
        map(equipments => {
          return equipments.filter(equipment => {
            const isTagMatched = filter.tagids.length === 0 || equipment.tags.some(tag => filter.tagids.includes(tag.id));
            const isLocationMatched = filter.locationids.length === 0 || filter.locationids.includes(equipment.locationid);
            const isNameMatched = filter.name === '' || equipment.name.toLowerCase().includes(filter.name.toLowerCase());
            const isStatusMatched = filter.showAvailable || filter.showRented ? (filter.showAvailable && !this.rentedEquipmentIds.includes(equipment.id)) || (filter.showRented && this.rentedEquipmentIds.includes(equipment.id)) : true;
            return isTagMatched && isLocationMatched && isNameMatched && isStatusMatched;
          });
        })
      );
    }


  getLocationForEquipment(equipid: number, locations: Location[]): Location {
    return locations.find(item => item.id === equipid);
  }

  handleTagFilterChange(event: any)
  {
      this.filter.tagids = event.target.value
      this.onFilterChanged()
  }

  handleSearchFilterChange(event: any)
  {
      this.filter.name = event.target.value
      this.onFilterChanged()
  }

  handleLocationFilterChange(event: any) {
    this.filter.locationids = event.target.value;
    console.log(this.filter.locationids)
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

    this.isSelectedTag = tags.map((tag: Tag) =>
      this.filter.tagids.includes(tag.id)
    );

    this.onFilterChanged();
  }

  onFilterChanged()
  {
    this.filteredEquipments = this.getFilteredEquipment(this.filter)
  }


  @ViewChild(IonModal) modal: IonModal;

  cancel() {
    this.modal.dismiss(null, 'Avbryt');
  }

  confirm() {
    console.log(this.filter.showAvailable)
    this.onFilterChanged()

    this.modal.dismiss(null, 'Bekreft');
  }

}
