import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterNewRentalPageRoutingModule } from './register-new-rental-routing.module';
import { RegisterNewRentalPage } from './register-new-rental.page';
import { FilterService } from 'src/app/services/filter.service';
import { TagModule } from 'src/app/components/tag/tag.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewRentalPageRoutingModule,
    ZXingScannerModule,
    TagModule
  ],
  declarations: [RegisterNewRentalPage],
  providers: [FilterService]

})
export class RegisterNewRentalPageModule {}
