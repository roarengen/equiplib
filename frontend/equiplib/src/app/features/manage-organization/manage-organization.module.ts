import { EditButtonModule } from './../../components/edit-button/edit-button.module';
import { PipesModule } from './user-filter.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManageOrganizationPageRoutingModule } from './manage-organization-routing.module';
import { ManageOrganizationPage } from './manage-organization.page';
import { TagModule } from 'src/app/components/tag/tag.module';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ManageOrganizationPageRoutingModule,
    TagModule,
    EditButtonModule
  ],
  declarations: [ManageOrganizationPage]
})
export class ManageOrganizationPageModule {}
