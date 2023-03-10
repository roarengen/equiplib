import { Organization } from './../models/organization';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user'

@Injectable({ providedIn: 'root' })
export class AccountService {
    singleEvent$: BehaviorSubject<Event> | undefined;
    private userSubject: BehaviorSubject<User>;
    private organizationSubject: BehaviorSubject<Organization>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.organizationSubject = new BehaviorSubject<Organization>(JSON.parse(localStorage.getItem('organization')!))
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username: any, password:any) {
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                console.log(user)
                this.userSubject.next(user);
                return user;
            }));
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

    update(id:any, params:any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    getOrganization(organizationid: number) {
      return this.http.get<Organization>(`${environment.apiUrl}/orgs/${organizationid}`)
          .pipe(map(organization => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('organization', JSON.stringify(organization));
              console.log(organization)
              this.organizationSubject.next(organization);
              return organization;
          }));
  }
}
