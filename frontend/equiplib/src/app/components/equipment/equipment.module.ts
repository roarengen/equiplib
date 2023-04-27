import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { EquipmentComponent } from './equipment.component';

@NgModule({
  declarations: [ EquipmentComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [EquipmentComponent]
})
export class EquipmentModule { }

