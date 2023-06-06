import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditEquipmentPage } from './edit-equipment.page';
import { EditEquipmentPageRoutingModule } from './edit-equipment-routing.module';
import { TagModule } from 'src/app/components/tag/tag.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEquipmentPageRoutingModule,
    TagModule
  ],
  declarations: [EditEquipmentPage]
})
export class EditEquipmentPageModule {}
