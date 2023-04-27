import { Component, OnInit, Input } from '@angular/core';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Location} from 'src/app/models/location';
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
  constructor(accountService: AccountService) {
    this.other1name = accountService.template?.equipOther1 || null
    this.other2name = accountService.template?.equipOther2 || null
    this.other3name = accountService.template?.equipOther3 || null
   }

  ngOnInit() {}

}
