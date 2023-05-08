import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { Equipment, Tag } from './../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterEquipmentService } from 'src/app/services/filter-equipment.service';
import { User } from 'src/app/models/user';
import { RentService } from 'src/app/services/rent.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register-new-rental',
  templateUrl: './register-new-rental.page.html',
  styleUrls: ['./register-new-rental.page.scss'],
})
export class RegisterNewRentalPage implements OnInit, OnDestroy {
  form!: FormGroup;
  equipmentName: string;
  equipmentDescription: string;
  equipmentTags: any;
  public selectedEquipment?: Observable<Equipment>;
  public selectUser: Observable<User[]>;
  public newRental: Rent = new Rent();
  private subscription: Subscription = new Subscription();

  constructor(
    private toastController: ToastController,
    public getEquipmentIdService: FilterEquipmentService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService
  ) {}

  ngOnInit() {
    this.selectUser = this.accountService.getAll();
    this.selectedEquipment = this.equipmentService.getEquipment(Number(this.getEquipmentIdService.data));
    this.subscription = this.selectedEquipment.subscribe(equipment => {
    this.newRental.equipmentid = equipment.id;
    this.newRental.rentedFromLocation = equipment.locationid;
    this.equipmentName = equipment.name;
    this.equipmentDescription = equipment.description;
    this.equipmentTags = equipment.tags;
    });
  }

  onSubmitNewRental() {
    if (this.accountService.user.roleid > 1) {
      this.newRental.userid = this.accountService.user.id;
      this.rentalService.addRental(this.newRental)
      this.presentToast()
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Utleie registrert!',
      duration: 2000,
      position: 'top'
    });

    await toast.present();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
