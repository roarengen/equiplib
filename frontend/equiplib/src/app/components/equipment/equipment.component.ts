import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Equipment } from 'src/app/models/equipment';
import { Location} from 'src/app/models/location';
import { Rent } from 'src/app/models/rent';
import { FilterService } from 'src/app/services/filter.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent  implements OnInit {

  @Input() public equipment: Equipment;
  @Input() public location?: Location;
  @Input() public rent?: Rent;
  @Input() public isCurrentlyAvailable: boolean;
  public timeUntilExpired: number;
  public isExpiredReturnDate: Boolean;
  public isCloseReturnDate: Boolean;
  public showAllTags: Boolean;

  public other1name?: string
  public other2name?: string
  public other3name?: string
  public currentDate: Date = new Date();
  public fetchrent: Observable<Rent>
  constructor(
    public router: Router,
    public accountService: AccountService,
    public rentService: RentService,
    public filterRentalService: FilterService,
    ) {

    this.other1name = accountService.template?.equipOther1 || null
    this.other2name = accountService.template?.equipOther2 || null
    this.other3name = accountService.template?.equipOther3 || null
  }


  ngOnInit() {
    this.checkRentalStatus();
  }


  checkRentalStatus() {
    if (!this.isCurrentlyAvailable) {
    this.fetchrent = this.rentService.fetchRentByEquipmentId(this.equipment.id);
    this.fetchrent.subscribe(w => {
      const validToDate = new Date(w.rentedValidToDate);
      if (validToDate < this.currentDate && w.rentedValidToDate != null) {
          this.isExpiredReturnDate = true;
      }
      this.timeUntilExpired = Math.round(Math.abs(this.currentDate.getTime() - validToDate.getTime()) / 36e5)
      if (this.currentDate < validToDate && this.timeUntilExpired < 48 && w.rentedValidToDate != null) {
        this.isCloseReturnDate = true;
      }
    }
    )
  }
  }

  returnRental() {
    this.fetchrent = this.rentService.fetchRentByEquipmentId(this.equipment.id);
    this.fetchrent.subscribe(w => {
      this.filterRentalService.data = w;
      console.log(this.filterRentalService.data);
      this.router.navigate(['/returnrental']);
    });
  }

  registerRental() {
    const selectedEquipmentId = this.equipment.id;
    this.filterRentalService.data = selectedEquipmentId;
    this.router.navigate(['/registerrental'])
  }

  showTags() {
    this.showAllTags = true;
  }
}
