import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [LayoutPage]
})
export class LayoutPageModule {}
