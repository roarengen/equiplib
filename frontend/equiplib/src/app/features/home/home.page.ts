import { LocationService } from 'src/app/services/location.service';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Observable, map } from 'rxjs';
import { Component, OnInit, ViewChild} from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { IonModal, ToastController } from '@ionic/angular'
import { LoadingController } from '@ionic/angular';
import {QrService} from 'src/app/services/qr.service';
import {Idownloadable} from 'src/app/models/downloadable';

class Filter {
  tagids: number[] = [];
  locationids: number[] = [];
  locationNames: string[] = [];
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
  idk = undefined;
	loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
  locationNames: string[] = [];
  rentedEquipmentIds: number[] = [];
  filter: Filter = new Filter();
  isSelectedTag: boolean[] = [];
  filteredEquipmentsCount: number;
  countAnimationState: 'previous' | 'current' = 'current';
  equipments: Observable<Equipment[]>
  filteredEquipments: Observable<Equipment[]>
  locations!: Observable<Location[]>
  tags!: Observable<Tag[]>

	constructor(
    public locationService: LocationService,
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
    public QrService: QrService,
    private loadingController: LoadingController,
    private toastController: ToastController
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
    this.rentedEquipmentIds = [];
    this.loading = false;
    this.rentService.getCurrentActiveRentals(this.accountService.user.organizationid).subscribe(rents=>rents.map(rent => this.rentedEquipmentIds.push(rent.equipmentid)))
    this.onFilterChanged();
    this.loadEquipments()
  }

  @ViewChild(IonModal) modal: IonModal;

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

      this.equipments = this.equipments.pipe(
        map(equipments => {
          return equipments.sort((a, b) => a.name.localeCompare(b.name));
        })
      );

      this.filteredEquipments = this.equipments;
    } finally {
      loading.dismiss();
    }
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.equipments = this.equipmentService.getAllEquipment(this.accountService.user.organizationid);
      event.target.complete();
    }, 2000);
  }

  downloadAll() {
    this.filteredEquipments.subscribe(equipments => {
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
          const filteredEquipments = equipments.filter(equipment => {
            const isTagMatched = filter.tagids.length === 0 || equipment.tags.some(tag => filter.tagids.includes(tag.id));
            const isLocationMatched = filter.locationids.length === 0 || filter.locationids.includes(equipment.locationid);
            const isNameMatched = filter.name === '' || equipment.name.toLowerCase().includes(filter.name.toLowerCase());
            const isStatusMatched = filter.showAvailable || filter.showRented ? (filter.showAvailable && !this.rentedEquipmentIds.includes(equipment.id)) || (filter.showRented && this.rentedEquipmentIds.includes(equipment.id)) : true;
            const isActiveMatched = filter.showActive || filter.showDeactivated ? (filter.showActive && equipment.active) || (filter.showDeactivated && !equipment.active) : true;
            return isTagMatched && isLocationMatched && isNameMatched && isStatusMatched && isActiveMatched;
          });
          return filteredEquipments.sort((a, b) => a.name.localeCompare(b.name));
        })
      );
    }

  getLocationForEquipment(equipid: number, locations: Location[]): Location {
    return locations.find(item => item.id === equipid);
  }

  handleSearchFilterChange(event: any)
  {
      this.filter.name = event.target.value
      this.onFilterChanged()
  }

  getLocationName(locationId: number, locations: Location[]): string {
    const location = locations.find((loc: Location) => loc.id === locationId);
    return location ? location.name : '';
  }

  compareWith(o1, o2) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  handleLocationFilterChange(event: any) {
    const selectedLocations = event.target.value;
    this.filter.locationids = selectedLocations.map((location: Location) => location.id);
    this.filter.locationNames = selectedLocations.map((location: Location) => location.name);
    this.onFilterChanged()

  }

  async filterOnTags(tag: Tag): Promise<void> {
    const tagIndex = this.filter.tagids.indexOf(tag.id);
    if (tagIndex > -1) {
      this.filter.tagids.splice(tagIndex, 1);
    } else {
      this.filter.tagids.push(tag.id);
    }

    const tags = await this.tags.toPromise();

    this.isSelectedTag = tags.map((tag: Tag) =>
      this.filter.tagids.includes(tag.id)
    );
    this.onFilterChanged()
  }

  onFilterChanged()
  {
    this.filteredEquipments = this.getFilteredEquipment(this.filter)
    this.filteredEquipments.subscribe(equipments => this.filteredEquipmentsCount = equipments.length);
  }

  async presentFilterResetToast() {
    const toast = await this.toastController.create({
      message: 'Filtre tilbakestilt',
      duration: 2000,
      position: 'top'
    });

    await toast.present();
  }

  resetFilters()
  {
    this.filter = new Filter();
    this.filteredEquipments = this.equipments
    this.modal.dismiss(null, 'Bekreft');
    this.presentFilterResetToast()
  }

  cancel() {
    this.modal.dismiss(null, 'Avbryt');
  }

  confirm() {
    this.modal.dismiss(null, 'Bekreft');
  }

}
