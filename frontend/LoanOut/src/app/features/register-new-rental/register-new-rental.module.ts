import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterNewRentalPageRoutingModule } from './register-new-rental-routing.module';

import { RegisterNewRentalPage } from './register-new-rental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewRentalPageRoutingModule
  ],
  declarations: [RegisterNewRentalPage]
})
export class RegisterNewRentalPageModule {}
