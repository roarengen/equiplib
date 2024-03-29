import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { Equipment } from './../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterService } from 'src/app/services/filter.service';
import { User } from 'src/app/models/user';
import { RentService } from 'src/app/services/rent.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register-new-rental',
  templateUrl: './register-new-rental.page.html',
  styleUrls: ['./register-new-rental.page.scss'],
})
export class RegisterNewRentalPage implements OnInit, OnDestroy {
  equipmentName: string;
  equipmentDescription: string;
  equipmentTags: any;
  public selectedEquipment?: Observable<Equipment>;
  public selectUser: Observable<User[]>;
  public newRental: Rent = new Rent();
  private subscription: Subscription = new Subscription();
  public form: Form;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public getEquipmentIdService: FilterService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentalService: RentService,
    public ngZone: NgZone
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
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
      this.newRental.rentedFromDate = new Date;
      this.newRental.rentedFromUserid = this.accountService.user.id;
      this.newRental.userid = this.newRental.userid;
      this.rentalService.addRental(this.newRental).subscribe()
      console.log(this.newRental.rentedValidToDate)
      this.presentToast()
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/register-rental.svg"></img> <p>Utleie er registrert!</p></span>',
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }


  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/register-rental.svg"></img> <p>Noe gikk galt!</p></span>',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
