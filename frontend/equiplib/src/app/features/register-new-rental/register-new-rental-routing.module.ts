import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNewRentalPage } from './register-new-rental.page';

const routes: Routes = [
  {
    path: 'registerrental',
    component: RegisterNewRentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNewRentalPageRoutingModule {}
