import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EquipmentComponent } from './equipment.component';
import { TagModule } from '../tag/tag.module';
import { EditButtonModule } from '../edit-button/edit-button.module';

@NgModule({
  declarations: [ EquipmentComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagModule,
    EditButtonModule,
  ],
  exports: [EquipmentComponent]
})
export class EquipmentModule { }

