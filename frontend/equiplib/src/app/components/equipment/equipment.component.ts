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
  @Input() public isCurrentlyAvailable: boolean;

  public other1name?: string
  public other2name?: string
  public other3name?: string
  public idk: Observable<Rent>
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

  returnRental() {
    this.idk = this.rentService.fetchRentByEquipmentId(this.equipment.id);

    this.idk.subscribe(w => {
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

  ngOnInit() {}

}
