import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { EditButtonComponent } from './edit-button.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  declarations: [ EditButtonComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagModule,
  ],
  exports: [EditButtonComponent]
})
export class EditButtonModule { }

