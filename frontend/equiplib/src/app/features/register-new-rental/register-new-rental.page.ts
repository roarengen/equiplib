import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { Equipment } from './../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FilterEquipmentService } from 'src/app/services/filter-equipment.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register-new-rental',
  templateUrl: './register-new-rental.page.html',
  styleUrls: ['./register-new-rental.page.scss'],
})
export class RegisterNewRentalPage implements OnInit, OnDestroy {
  foundEquipId: string;
  form!: FormGroup;
  public selectedEquipment: Observable<Equipment>;
  public selectUser: Observable<User[]>;
  public newRental: Rent = new Rent();
  private subscription: Subscription = new Subscription(); // add this property

  constructor(
    public getEquipmentIdService: FilterEquipmentService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
  ) {}

  ngOnInit() {
    this.selectUser = this.accountService.getAll();
    this.foundEquipId = this.getEquipmentIdService.data
    this.selectedEquipment = this.equipmentService.getEquipment(Number(this.foundEquipId));
    this.subscription = this.selectedEquipment.subscribe(equipment => {
    this.newRental.equipmentid = equipment.id;
    this.newRental.rentedFromLocation = equipment.locationid;
    });
  }

  addNewRental() {
    // implement this method if needed
  }

  onSubmitNewRental() {
    if (this.accountService.user.roleid > 1) {
      this.newRental.userid = this.accountService.user.id;

    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
