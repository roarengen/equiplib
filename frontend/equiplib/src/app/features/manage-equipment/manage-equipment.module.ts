import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEquipmentPageRoutingModule } from './manage-equipment-routing.module';

import { ManageEquipmentPage } from './manage-equipment.page';
import { QRCodeModule } from 'angularx-qrcode';
import { TagModule } from 'src/app/components/tag/tag.module';

@NgModule({
  imports: [
    QRCodeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ManageEquipmentPageRoutingModule,
    TagModule
  ],
  declarations: [ManageEquipmentPage]
})
export class ManageEquipmentPageModule {}
