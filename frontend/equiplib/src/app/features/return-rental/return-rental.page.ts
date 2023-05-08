import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { Equipment, Tag } from '../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterEquipmentService } from 'src/app/services/filter-equipment.service';
import { User } from 'src/app/models/user';
import { RentService } from 'src/app/services/rent.service';
import { ToastController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { Location } from './../../models/location';

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
  public locations: Observable<Location[]>;
  public selectedEquipment?: Observable<Equipment>;
  public selectUser: User = new User();
  public selectedRental: Rent = new Rent();
  private subscription: Subscription = new Subscription();
  private subscribeRent: Subscription = new Subscription();

  constructor(
    public locationService: LocationService,
    private toastController: ToastController,
    public getEquipmentIdService: FilterEquipmentService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService

  ) {
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
  }

  ngOnInit() {
    this.subscribeRent = this.rentalService.fetchRentByEquipmentId(Number(this.getEquipmentIdService.data)).subscribe(selectedRental => {
      this.accountService.getById(selectedRental.userid.toString()).subscribe(selectedUser =>
        this.selectUser = selectedUser
        )
      this.selectedRental = selectedRental;
    })
    this.selectedEquipment = this.equipmentService.getEquipment(Number(this.getEquipmentIdService.data));
    this.subscription = this.selectedEquipment.subscribe(equipment => {
    this.equipmentName = equipment.name;
    this.equipmentDescription = equipment.description;
    this.equipmentTags = equipment.tags;
    console.log(this.selectedRental)
    });
  }

  onReturnRental() {
    if (this.accountService.user.roleid > 1) {
      this.selectedRental.rentedToDate = new Date();
      this.rentalService.returnRental(this.selectedRental)
      this.presentToast()
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Utstyret er returnert',
      duration: 5000,
      position: 'top'
    });

    await toast.present();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
