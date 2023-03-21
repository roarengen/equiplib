import { AccountService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)  {
    const user = this.accountService.user;

    if (user.roleid > 1) {
      return true;
    }

    this.router.navigate(['login'], { queryParams: { returnUrl: state.url}})
    return false
  }

}
