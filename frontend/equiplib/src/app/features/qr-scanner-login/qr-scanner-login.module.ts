import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrScannerLoginPageRoutingModule } from './qr-scanner-login-routing.module';
import { QrScannerLoginPage } from './qr-scanner-login.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LayoutPageRoutingModule } from '../layout/layout-routing.module';
import { FilterService } from 'src/app/services/filter.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrScannerLoginPageRoutingModule,
    ZXingScannerModule,
    LayoutPageRoutingModule,
  ],
  declarations: [QrScannerLoginPage],
  providers: [FilterService]
})
export class QrScannerPageModule {}
