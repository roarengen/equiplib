import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent, returnRent } from 'src/app/models/rent';
import { Equipment } from '../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterService } from 'src/app/services/filter.service';
import { User } from 'src/app/models/user';
import { RentService } from 'src/app/services/rent.service';
import { ToastController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { Location } from './../../models/location';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-return-rental',
  templateUrl: './return-rental.page.html',
  styleUrls: ['./return-rental.page.scss'],
})
export class ReturnRentalPage implements OnInit, OnDestroy {
  form!: FormGroup;
  equipmentName: string;
  equipmentDescription: string;
  equipmentTags: any;
  setLocationId: number;
  public locations: Observable<Location[]>;
  public selectedEquipment?: Observable<Equipment>;
  public selectUser: User = new User();
  public selectedRental: Rent = new Rent();
  private subscription: Subscription = new Subscription();
  private subscribeRent: Subscription = new Subscription();

  constructor(
    public locationService: LocationService,
    private http: CustomHttpClient,
    private toastController: ToastController,
    public getEquipmentIdService: FilterService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService

  ) {
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
  }

  ngOnInit() {
      this.accountService.getById(this.getEquipmentIdService.data.userid.toString()).subscribe(selectedUser =>
        this.selectUser = selectedUser
        )
    this.selectedRental = this.getEquipmentIdService.data;
    this.selectedEquipment = this.equipmentService.getEquipment(Number(this.getEquipmentIdService.data.equipmentid));
    this.subscription = this.selectedEquipment.subscribe(equipment => {
    this.equipmentName = equipment.name;
    this.equipmentDescription = equipment.description;
    this.equipmentTags = equipment.tags;
    });
  }

  onReturnRental() {
    if (this.accountService.user.roleid > 1) {
      this.http.post(environment.apiUrl + "/rents/return",
      {
        rentid: this.selectedRental.id,
        locationid: this.setLocationId,
        userid: this.selectUser.id,
        returndate: this.selectedRental.rentedValidToDate
      }).subscribe((response: number) => {
        console.log(response)
        if (response === 200) {
          this.presentToast()
        }
        else if (response > 400) {
          this.presentErrorToast()
        }
      })
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/return-rental.svg"></img> <p>Utstyret er returnert!</p></span>',
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: ' <span><img src="../../../assets/icons/warning-icon.svg"> <p>Noe gikk galt! Utstyr ble ikke returnert.</p>',
      duration: 5000,
      position: 'top',
    });

    await toast.present();

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
