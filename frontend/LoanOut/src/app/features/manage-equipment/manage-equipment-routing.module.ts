import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageEquipmentPage } from './manage-equipment.page';

const routes: Routes = [
  {
    path: '',
    component: ManageEquipmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEquipmentPageRoutingModule {}
