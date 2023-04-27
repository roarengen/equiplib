import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { EquipmentComponent } from './equipment.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  declarations: [ EquipmentComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagModule,
  ],
  exports: [EquipmentComponent]
})
export class EquipmentModule { }

