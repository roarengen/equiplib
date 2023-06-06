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
import {AddTagComponent} from './features/add-tag/add-tag.component';
import { ReturnRentalPage } from './features/return-rental/return-rental.page';
import { QrScannerPage } from './features/qr-scanner/qr-scanner.page';
import {ResetPasswordComponent} from './features/reset-password/reset-password.component';
import { EditEquipmentPage } from './features/edit-equipment/edit-equipment.page';
import { EditUserPage } from './features/edit-user/edit-user.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'manageequipment', component: ManageEquipmentPage, canActivate: [AdminGuard]},
      { path: 'manageusers', component: ManageUsersPage},
      { path: 'editequipment', component: EditEquipmentPage},
      { path: 'edituser', component: EditUserPage},
      { path: 'addtag', component: AddTagComponent},
      { path: 'manageorganization', component: ManageOrganizationPage},
      { path: 'home', component: HomePage, },
      { path: 'registerrental', component: RegisterNewRentalPage, },
      { path: 'returnrental', component: ReturnRentalPage, },
    ]
  },
  { path: 'qrscanner', component: QrScannerPage},
  { path: 'login', component: LoginPage},
  { path: 'reset-password', component: ResetPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
