import { LocationService } from 'src/app/services/location.service';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Observable, filter, map } from 'rxjs';
import { Component, OnInit} from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { AlertController } from '@ionic/angular';

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

  filterTagids: number[] = [];
  filtername: string;
  filterOnlyRented: boolean = false;

	constructor(
    private alertController: AlertController,
    public locationService: LocationService,
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
  ) {
    this.equipments = equipmentService.getAllEquipment(this.accountService.user.organizationid)
    this.locations = locationService.getAllLocations(this.accountService.user.organizationid)
    this.tags = equipmentService.getAllTags(this.accountService.user.organizationid)
    this.filteredEquipments = this.equipments
  }

  ngOnInit() {
    this.rentService.getCurrentActiveRentals(this.accountService.user.organizationid).subscribe(rents=>rents.map(rent => this.rentedEquipmentIds.push(rent.id)))
  }

  getFilteredEquipment(tagids: number[], name: string = "", only_rented: boolean = false): Observable<Equipment[]>
  {
    let filteredEquipments = new Observable<Equipment[]>
    filteredEquipments = tagids.length > 0 ? this.equipments.pipe(
      map(
        equipments => equipments.filter(
          eq => tagids.some(
            tagid => eq.tags.some(
              eqtag => eqtag.id == tagid))))): this.equipments
    
    filteredEquipments = name != "" ? filteredEquipments.pipe(
      map(
        equipments => equipments.filter(
          equipment => equipment.name.toLocaleLowerCase().includes(name.toLowerCase())
        )
      )
    ): filteredEquipments

    only_rented ? filteredEquipments.pipe(
      map(
        equipments => equipments.filter(
          equipment => this.rentedEquipmentIds.includes(equipment.id)
        )
      )
    ): filteredEquipments


    return filteredEquipments

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
      this.filterTagids = event.target.value
      this.onFilterChanged()
  }
  handleSearchFilterChange(event: any)
  {
      this.filtername = event.target.value
      this.onFilterChanged()
  }
  
  onFilterChanged()
  {
    this.filteredEquipments = this.getFilteredEquipment(
      this.filterTagids,
      this.filtername,
      this.filterOnlyRented
      )
  }

  openFilter() {
    this.openFilterAlert()
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
            console.log(data.filterRents)
            console.log(data)
            this.filterOnlyRented = data[0]
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
}

