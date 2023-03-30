import { PipesModule } from './user-filter.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageOrganizationPageRoutingModule } from './manage-organization-routing.module';

import { ManageOrganizationPage } from './manage-organization.page';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ManageOrganizationPageRoutingModule
  ],
  declarations: [ManageOrganizationPage]
})
export class ManageOrganizationPageModule {}
