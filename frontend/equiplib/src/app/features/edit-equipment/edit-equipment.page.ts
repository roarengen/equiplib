import { LocationService } from './../../services/location.service';
import { EquipmentService } from './../../services/equipment.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Equipment, Tag } from 'src/app/models/equipment';
import { TemplateService } from 'src/app/services/template.service';
import { AccountService } from 'src/app/services/user.service';
import { Location } from 'src/app/models/location';
import { PopoverController, ToastController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.page.html',
  styleUrls: ['./edit-equipment.page.scss'],
})
export class EditEquipmentPage implements OnInit, OnDestroy {

  public editEquipment: Equipment = new Equipment();
  public subscription = new Subscription();
  public locations: Observable<Location[]>;
  public tags!: Observable<Tag[]>
  public selectedEquipment?: Observable<Equipment>;
  public equiptags: any;

  constructor(
  public router: Router,
  public toastController: ToastController,
  public filterService: FilterService,
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
    this.resetComponent();
  }

  ionViewWillEnter() {
    this.selectedEquipment = this.equipmentService.getEquipment(this.filterService.data);
    this.selectedEquipment.subscribe(equipment => {
      this.editEquipment = equipment;
      console.log("EDIT EQUIPMENT:")
      console.log(equipment)
      this.equiptags = equipment.tags.map((tag: any) => {
        return {...tag, visible: true};
      });
    });
  }

  ionViewWillLeave() {
    this.resetComponent();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private resetComponent(): void {
    this.editEquipment = new Equipment();
    this.subscription.unsubscribe();
    this.selectedEquipment = undefined;
    this.equiptags = undefined;
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
    this.equipmentService.addTagsToEquip(this.editEquipment, this.equiptags.map((tag: any) => tag.id))
    this.presentToast()
    this.router.navigate(['/home']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.editEquipment.name + ' er redigert!',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
