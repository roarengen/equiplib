import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {ResetPasswordComponent} from './reset-password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ]
})
export class ResetPasswordModule { }
