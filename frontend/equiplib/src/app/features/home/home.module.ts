import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TagModule } from 'src/app/components/tag/tag.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ZXingScannerModule,
    TagModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
