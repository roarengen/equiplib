import { BehaviorSubject } from 'rxjs';
import { Organization } from './../models/organization';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user'
import { LoginResponse } from '../models/loginresponse';
import { CustomHttpClient } from '../helpers/auth/http-client';


@Injectable({ providedIn: 'root' })
export class AccountService {
    singleEvent$: BehaviorSubject<Event> | undefined;
    public user!: User;
    public organization?: Organization;

    constructor(
        private router: Router,
        private http: CustomHttpClient
    ) {

    }

    login(username: any, password:any) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, { username, password })
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getOrganization(orgid: number) {
      return this.http.get<Organization>(`${environment.apiUrl}/orgs/${orgid}`);
  }
}
