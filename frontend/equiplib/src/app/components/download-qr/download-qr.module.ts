import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DownloadQrComponent } from './download-qr.component';

@NgModule({
  declarations: [ DownloadQrComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [DownloadQrComponent ]
})
export class DownloadQrModule { }

