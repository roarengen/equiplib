import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReturnRentalPageRoutingModule } from './return-rental-routing.module';
import { ReturnRentalPage } from './return-rental.page';
import { FilterService } from 'src/app/services/filter.service';
import { TagModule } from 'src/app/components/tag/tag.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnRentalPageRoutingModule,
    ZXingScannerModule,
    TagModule
  ],
  declarations: [ReturnRentalPage],
  providers: [FilterService]

})
export class ReturnRentalPageModule {}
