import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrScannerLoginPage } from './qr-scanner-login.page';

const routes: Routes = [
  {
    path: 'qrscannerlogin',
    component: QrScannerLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrScannerLoginPageRoutingModule {}
