import { LocationService } from './../../services/location.service';
import { EquipmentService } from './../../services/equipment.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Equipment, Tag } from 'src/app/models/equipment';
import { TemplateService } from 'src/app/services/template.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.page.html',
  styleUrls: ['./edit-equipment.page.scss'],
})
export class EditEquipmentPage implements OnInit {

  public editEquipment: Equipment = new Equipment();
  public subscription = new Subscription();
  public locations: Observable<Location[]>;
  public tags!: Observable<Tag[]>
  public selectedEquipment?: Observable<Equipment>;
  public equiptags: any;

  constructor(
  public accountService: AccountService,
  public locationService: LocationService,
  public equipmentService?: EquipmentService,
  public templateService?: TemplateService,
  public popoverController?: PopoverController,
  ) {

    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid);
    this.tags = equipmentService.getAllTags(this.accountService.user.organizationid);
  }
  ngOnInit() {
    this.selectedEquipment = this.equipmentService.getEquipment(Number(1));
    this.selectedEquipment.subscribe(equipment => {
    this.editEquipment = equipment;
    this.equiptags = equipment.tags.map((tag: any) => {
      return {...tag, visible: true};
    })
  })
  }

  async removeTag(tag: any, index: number) {
    this.equiptags.splice(index, 1);
    tag.visible = false;
  }

  async addTag(tag: any){
    this.equiptags.push({ ...tag, visible: true });
    await this.popoverController.dismiss();
  }

  async editEquips() {
    this.editEquipment.tags = this.equiptags;
    this.equipmentService.updateEquip(this.editEquipment)
  }

  selectedNewTag() {}
}
