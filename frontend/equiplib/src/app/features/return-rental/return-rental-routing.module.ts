import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnRentalPage } from './return-rental.page';

const routes: Routes = [
  {
    path: 'returnrental',
    component: ReturnRentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnRentalPageRoutingModule {}
