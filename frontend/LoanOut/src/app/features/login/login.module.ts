import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LoginPageRoutingModule } from './login-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [LoginPage]
})
export class HomePageModule {}
