import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditEquipmentPage } from './edit-equipment.page';
import { EditEquipmentPageRoutingModule } from './edit-equipment-routing.module';
import { TagModule } from 'src/app/components/tag/tag.module';
import { DownloadQrModule } from 'src/app/components/download-qr/download-qr.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditEquipmentPageRoutingModule,
    TagModule,
    DownloadQrModule
  ],
  declarations: [EditEquipmentPage]
})
export class EditEquipmentPageModule {}
