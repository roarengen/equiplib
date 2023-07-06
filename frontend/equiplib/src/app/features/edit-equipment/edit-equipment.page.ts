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
  public filteredAddedTags: any;
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

    this.locations = this.locationService.getActiveLocations(this.accountService.user.organizationid);
  }

  ngOnInit() {
    this.resetComponent()
    console.log(this.editEquipment)
  }

  ionViewWillEnter() {
    this.selectedEquipment = this.equipmentService.getEquipment(this.filterService.data);
    this.selectedEquipment.subscribe(equipment => {
      this.editEquipment = equipment;
      this.equiptags = equipment.tags.map((tag: any) => {
        return { ...tag, visible: true };
      });
    });

    this.tags = this.equipmentService.getAllTags(this.accountService.user.organizationid);
    this.tags.subscribe(tags => {
      this.filteredAddedTags = tags
        .map((tag: any) => {
          return { ...tag, visible: true };
        })
        .filter((tag: any) => {
          return !this.equiptags.some((eqTag: any) => eqTag.id === tag.id);
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
    this.equiptags = undefined; // why undefined, should't this be an empty list?
    this.filteredAddedTags = undefined;

  }

  async removeTag(tag: any, index: number) {
    this.equiptags.splice(index, 1);
    this.filteredAddedTags.push({ ...tag, visible: true });
    tag.visible = false;
  }

  async addTag(tag: any, index: number){
    this.filteredAddedTags.splice(index, 1)
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
