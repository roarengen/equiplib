import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './features/login/login.page';
import { HomePage } from './features/home/home.page';
import { AuthGuard } from './helpers/auth/auth.guard';
import { AdminGuard } from './helpers/auth/admin.guard';

const routes: Routes = [
  { path: '', component: HomePage, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPage,  },


  { path: '**', redirectTo: '' },
  {
    path: 'register-new-rental',
    loadChildren: () => import('./features/register-new-rental/register-new-rental.module').then( m => m.RegisterNewRentalPageModule), canActivate:[AdminGuard]
  },
  {
    path: 'return-rental',
    loadChildren: () => import('./features/return-rental/return-rental.module').then( m => m.ReturnRentalPageModule)
  },
  {
    path: 'manage-users',
    loadChildren: () => import('./features/manage-users/manage-users.module').then( m => m.ManageUsersPageModule)
  },
  {
    path: 'manage-equipment',
    loadChildren: () => import('./features/manage-equipment/manage-equipment.module').then( m => m.ManageEquipmentPageModule)
  },
  {
    path: 'manage-organization',
    loadChildren: () => import('./features/manage-organization/manage-organization.module').then( m => m.ManageOrganizationPageModule)
  },
  {
    path: 'generate-code',
    loadChildren: () => import('./features/generate-code/generate-code.module').then( m => m.GenerateCodePageModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
