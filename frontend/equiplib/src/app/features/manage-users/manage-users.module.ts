import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    ManageUsersPageRoutingModule
  ],
  declarations: [ManageUsersPage]
})
export class ManageUsersPageModule {}
