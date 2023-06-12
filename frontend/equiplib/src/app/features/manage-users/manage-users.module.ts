import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular';
import { ManageUsersPageRoutingModule } from './manage-users-routing.module';
import { ManageUsersPage } from './manage-users.page';

@NgModule({
  imports: [
    QRCodeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ManageUsersPageRoutingModule
  ],
  declarations: [ManageUsersPage]
})
export class ManageUsersPageModule {}
