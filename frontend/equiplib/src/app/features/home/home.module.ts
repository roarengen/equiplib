import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TagModule } from 'src/app/components/tag/tag.module';
import { EquipmentModule } from 'src/app/components/equipment/equipment.module';
import { DownloadQrModule } from 'src/app/components/download-qr/download-qr.module';
import { CountUpModule } from 'ngx-countup';

@NgModule({
  imports: [
    CountUpModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ZXingScannerModule,
    TagModule,
    EquipmentModule,
    DownloadQrModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
