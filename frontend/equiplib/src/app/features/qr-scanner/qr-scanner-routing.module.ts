import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrScannerPage } from './qr-scanner.page';

const routes: Routes = [
  {
    path: 'qrscanner',
    component: QrScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrScannerPageRoutingModule {}
