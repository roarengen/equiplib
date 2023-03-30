import { ManageOrganizationPage } from './features/manage-organization/manage-organization.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './features/login/login.page';
import { HomePage } from './features/home/home.page';
import { AuthGuard } from './helpers/auth/auth.guard';
import { AdminGuard } from './helpers/auth/admin.guard';
import { ManageEquipmentPage } from './features/manage-equipment/manage-equipment.page';
import { ManageUsersPage } from './features/manage-users/manage-users.page';
import { LayoutPage } from './features/layout/layout.page';
import { RegisterNewRentalPage } from './features/register-new-rental/register-new-rental.page';

const routes: Routes = [

  {
    component: LayoutPage,
    path:'',
    children: [
      { path: 'manageequipment', component: ManageEquipmentPage, canActivate: [AdminGuard]},
      { path: 'manageusers', component: ManageUsersPage},
      { path: 'manageorganization', component: ManageOrganizationPage},
      { path: 'home', component: HomePage, },
      { path: 'registerrental', component: RegisterNewRentalPage, },
    ]
  },
  { path: 'login', component: LoginPage},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
