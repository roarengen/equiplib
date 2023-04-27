import { Component, OnInit, Input } from '@angular/core';
import { Equipment, Tag } from 'src/app/models/equipment';
import { Location} from 'src/app/models/location';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent  implements OnInit {

  @Input() public equipment: Equipment;
  @Input() public location?: Location;
  @Input() public isCurrentlyAvailable: boolean;
  constructor() { }

  ngOnInit() {}

}
