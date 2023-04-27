import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagComponent } from './tag.component';

@NgModule({
  declarations: [ TagComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [TagComponent]
})
export class TagModule { }

