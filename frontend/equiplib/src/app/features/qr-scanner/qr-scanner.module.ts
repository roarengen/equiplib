import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrScannerPageRoutingModule } from './qr-scanner-routing.module';
import { QrScannerPage } from './qr-scanner.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LayoutPageRoutingModule } from '../layout/layout-routing.module';
import { FilterService } from 'src/app/services/filter.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrScannerPageRoutingModule,
    ZXingScannerModule,
    LayoutPageRoutingModule,
  ],
  declarations: [QrScannerPage],
  providers: [FilterService]
})
export class QrScannerPageModule {}
