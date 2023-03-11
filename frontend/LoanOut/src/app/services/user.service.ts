import { Organization } from './../models/organization';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user'
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AccountService {
    singleEvent$: BehaviorSubject<Event> | undefined;
    public user?: User;
    public organization?: Organization;

    constructor(
        private router: Router,
		    private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, body was: `, error.error);
  }
  // Return an observable with a user-facing error message.
  return throwError(() => new Error('Something bad happened; please try again later.'));
}

    login(username: any, password:any) {
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { username, password })
            .pipe(
                catchError(this.handleError)
            )
            .subscribe(user=>
                {
                    this.getOrganization(user.id);
                    this.user = user;
                    this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/');
                }
            )
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
                if (this.user !== undefined && id == this.user.id) {
                    // update local storage
                    const user = { ...this.user, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                if (this.user !== undefined && id == this.user.id) {
                    this.logout();
                }
                return x;
            }));
    }

    getOrganization(organizationid: number) {
        this.http.get<Organization>(`${environment.apiUrl}/orgs/${organizationid}`).subscribe(org=>
            {
                this.organization = org
                console.log(org)
            })
        return this.organization

  }
}
