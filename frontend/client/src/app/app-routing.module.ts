import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/account/login/login.component';
import { HomeComponent } from './features/home';
import { AuthGuard } from './helpers/auth.guard';

const accountModule = () => import('./features/account/account.module').then(x => x.AccountModule)
const usersModule = () => import('./features/users/users.module').then(x => x.UsersModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: 'users', loadChildren: usersModule },


  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
