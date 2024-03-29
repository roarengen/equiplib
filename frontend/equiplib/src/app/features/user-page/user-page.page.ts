import { LocationService } from 'src/app/services/location.service';
import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { RentService } from 'src/app/services/rent.service';
import { Observable } from 'rxjs';
import { Rent } from 'src/app/models/rent';
import { EquipmentService } from 'src/app/services/equipment.service';
import { User } from 'src/app/models/user';
import { Equipment } from 'src/app/models/equipment';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPage {

  public selectedUserRentals: Observable<Rent[]>
  public selectedUserRentalIds: [];
  public selectedRentalsEquipmentInfo: Observable<Equipment[]>;
  public selectedUser = new User()

  constructor(
    private equipmentService: EquipmentService,
    public accountService: AccountService,
    private rentService: RentService,
    private locationService: LocationService,
  ) { }

    ionViewWillEnter() {
      this.selectedUserRentals = this.rentService.fetchRentsByUserId(this.accountService.user.id)
      this.selectedUserRentals.subscribe(rentals => {
        const equipIds = rentals.map(rental => rental.equipmentid)
        this.selectedRentalsEquipmentInfo = this.equipmentService.getMultipleEquipment(equipIds)
        console.log(this.selectedRentalsEquipmentInfo)
      })
    }
}
