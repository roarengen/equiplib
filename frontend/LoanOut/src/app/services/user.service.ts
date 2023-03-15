import { Organization } from './../models/organization';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user'
import { Router } from '@angular/router';
import { LoginResponse } from '../models/loginresponse';

@Injectable({ providedIn: 'root' })
export class AccountService {
    singleEvent$: BehaviorSubject<Event> | undefined;
    public user!: User;
    public organization?: Organization;
    public token: string = ""

    constructor(

        private router: Router,
        private http: HttpClient

    ) {
    }

    login(username: any, password:any) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, { username, password })
    }

    logout() {
        console.log("Logged out!")
        localStorage.clear();
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
                if (this.user !== undefined && id == this.user.id) {
                    // update local storage
                    const user = { ...this.user, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                }
                return x;
            }));
    }

    getOrganization(organizationid: number) {
        return this.http.get<Organization>(`${environment.apiUrl}/orgs/${organizationid}`)

    }
}
