import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateCodePageRoutingModule } from './generate-code-routing.module';

import { GenerateCodePage } from './generate-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateCodePageRoutingModule
  ],
  declarations: [GenerateCodePage]
})
export class GenerateCodePageModule {}
