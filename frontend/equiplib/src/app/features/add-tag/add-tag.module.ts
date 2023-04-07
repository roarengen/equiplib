import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AddTagComponent} from './add-tag.component';

@NgModule({
  declarations: [AddTagComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class AddTagModule { }
