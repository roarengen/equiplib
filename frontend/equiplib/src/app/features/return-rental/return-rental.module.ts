import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnRentalPageRoutingModule } from './return-rental-routing.module';

import { ReturnRentalPage } from './return-rental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnRentalPageRoutingModule
  ],
  declarations: [ReturnRentalPage]
})
export class ReturnRentalPageModule {}
