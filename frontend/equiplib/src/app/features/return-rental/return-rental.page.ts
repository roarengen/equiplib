import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { Equipment } from '../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterService } from 'src/app/services/filter.service';
import { User } from 'src/app/models/user';
import { RentService } from 'src/app/services/rent.service';
import { ToastController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { Location } from './../../models/location';
import {Router} from '@angular/router';

@Component({
  selector: 'app-return-rental',
  templateUrl: './return-rental.page.html',
  styleUrls: ['./return-rental.page.scss'],
})
export class ReturnRentalPage implements OnInit, OnDestroy {
  equipmentName: string;
  equipmentDescription: string;
  equipmentTags: any;
  setLocationId: number;
  public locations: Observable<Location[]>;
  public selectedEquipment?: Observable<Equipment>;
  public selectUser: User = new User();
  public selectedRental: Rent = new Rent();
  private subscription: Subscription = new Subscription();

  form = this.formBuilder.group({
    returnlocation: ['', [Validators.required]],
  })

  constructor(
    private toastController: ToastController,
    private router: Router,
    public formBuilder: FormBuilder,
    public locationService: LocationService,
    public getEquipmentIdService: FilterService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService,

  ) {
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.accountService.getById(this.getEquipmentIdService.data.userid).subscribe(selectedUser =>
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
    this.rentalService.returnRental(
      {
        rentid: this.selectedRental.id,
        locationid: this.setLocationId,
        userid: this.selectUser.id,
        returndate: new Date,
      }
    ).subscribe({
      next: () => this.presentToast().then(() => this.router.navigateByUrl('home')),
      error: (err) => {console.log(err);this.presentErrorToast().then(() => this.router.navigateByUrl('home'))}}
    )
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Utstyret er returnert.',
      duration: 2000,
      position: 'top'
    });

    await toast.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Noe gikk galt! Utstyr ble ikke returnert.',
      duration: 5000,
      position: 'top',
    });

    await toast.present();

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
