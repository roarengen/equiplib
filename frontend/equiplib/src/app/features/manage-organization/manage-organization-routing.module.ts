import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageOrganizationPage } from './manage-organization.page';

const routes: Routes = [
  {
    path: '',
    component: ManageOrganizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageOrganizationPageRoutingModule {}
