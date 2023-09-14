import { LocationService } from 'src/app/services/location.service';
import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { RentService } from 'src/app/services/rent.service';
import { Observable } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPage {

  public selectedUserRentals: Observable<Rent[]>

  constructor(
    private equipmentService: EquipmentService,
    private accountService: AccountService,
    private rentService: RentService,
    private locationService: LocationService,
  ) { }

    ionViewWillEnter() {



    }


}
