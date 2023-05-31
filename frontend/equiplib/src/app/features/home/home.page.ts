import { LocationService } from 'src/app/services/location.service';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Observable, filter, map } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { AlertController } from '@ionic/angular'
import { LoadingController } from '@ionic/angular';

class Filter {
  tagids: number[] = [];
  name: string = "";
  onlyRented: boolean = false;
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

  filter: Filter = new Filter();

	constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    public locationService: LocationService,
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
  ) {
    this.equipments = this.equipmentService.getAllEquipment(this.accountService.user.organizationid)
    this.locations = locationService.getAllLocations(this.accountService.user.organizationid)
    this.tags = equipmentService.getAllTags(this.accountService.user.organizationid)
    this.filteredEquipments = this.equipments
  }

  ngOnInit() {
    this.rentService.getCurrentActiveRentals(this.accountService.user.organizationid).subscribe(rents=>rents.map(rent => this.rentedEquipmentIds.push(rent.id)))
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

  getFilteredEquipment(filter: Filter): Observable<Equipment[]> {
    let filteredEquipments = this.equipments;

    if (filter.tagids.length > 0) {
      filteredEquipments = filteredEquipments.pipe(
        map(equipments => equipments.filter(eq => {
          return eq.tags.some(eqtag => filter.tagids.includes(eqtag.id));
        }))
      );
    }

    if (filter.name !== "") {
      filteredEquipments = filteredEquipments.pipe(
        map(equipments => equipments.filter(equipment => {
          return equipment.name.toLowerCase().includes(filter.name.toLowerCase());
        }))
      );
    }

    if (filter.onlyRented) {
      filteredEquipments = filteredEquipments.pipe(
        map(equipments => equipments.filter(equipment => {
          return this.rentedEquipmentIds.includes(equipment.id);
        }))
      );
    }

    return filteredEquipments;
  }

  getLocationForEquipment(equipid: number, locations: Location[]): Location {
    return locations.find(item => item.id === equipid);
  }

  onOpenQrScanner() {
    this.openQrCode = true;
  }

  scanSuccessHandler(scanValue: string) {
    console.log(scanValue)
    this.enterPinCode = true;
    this.QrCode = scanValue;
    console.log(scanValue)
    return this.scanSuccessHandler
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
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

  filterOnTags(tag: Tag): void {
    const tagIndex = this.filter.tagids.indexOf(tag.id);
    if (tagIndex > -1) {
      this.filter.tagids.splice(tagIndex, 1); // Remove tag from the filter
    } else {
      this.filter.tagids.push(tag.id); // Add tag to the filter
    }
    this.onFilterChanged();
  }

  onFilterChanged()
  {
    this.filteredEquipments = this.getFilteredEquipment(this.filter)
  }

  openFilter() {
    this.openFilterAlert()
  }

  openTagFilter() {

  }

  async openFilterAlert() {
    const alert = await this.alertController.create({
      cssClass: 'pinLogin',
      header: 'Filtrering',
      inputs: [
        {
          name: 'toggle',
          type: 'checkbox',
          label: 'Toggle',
          value: true,
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }, {
          text: 'Ok',
          handler: (data) => {
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
}

