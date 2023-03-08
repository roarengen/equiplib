import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './features/account/login/login.page';
import { HomePage } from './features/home/home.page';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },


  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
