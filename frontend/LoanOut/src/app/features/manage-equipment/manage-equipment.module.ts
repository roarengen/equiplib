import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEquipmentPageRoutingModule } from './manage-equipment-routing.module';

import { ManageEquipmentPage } from './manage-equipment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageEquipmentPageRoutingModule
  ],
  declarations: [ManageEquipmentPage]
})
export class ManageEquipmentPageModule {}
