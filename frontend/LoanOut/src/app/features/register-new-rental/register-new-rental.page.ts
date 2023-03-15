import { RentService } from 'src/app/services/rent.service';
import { Equipment } from './../../models/equipment';
import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-register-new-rental',
  templateUrl: './register-new-rental.page.html',
  styleUrls: ['./register-new-rental.page.scss'],
})
export class RegisterNewRentalPage implements OnInit {

  loading: boolean = false;

  constructor(
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,

  ) { }

  ngOnInit() {
    this.rentService.fetchRentsByOrg(this.accountService.user?.organizationid || 0)
  }


  addNewRental() {

  }

}
