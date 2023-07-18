import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  constructor(
    private toastController: ToastController,
    private router: Router,
    public locationService: LocationService,
    public getEquipmentIdService: FilterService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService,

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
    if (this.accountService.user.roleid <= 1) return

    this.rentalService.returnRental(
      {
        rentid: this.selectedRental.id,
        locationid: this.setLocationId,
        userid: this.selectUser.id,
        returndate: new Date,
      }
    ).subscribe({
      next: () => this.presentToast().then(() => this.router.navigateByUrl('home')),
      error: (err) => {console.log(err);this.presentErrorToast()}}
    )
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/return-rental.svg"></img> <p>Utstyret er returnert!</p></span>',
      duration: 2000,
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
