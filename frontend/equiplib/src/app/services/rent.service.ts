import { Rent } from './../models/rent';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';

@Injectable({ providedIn: 'root' })
export class RentService {

    public rents!: Rent[];
    constructor(
        private http: CustomHttpClient
    ) {
    }
    fetchRentsByOrg(orgid: number)
    {
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/by_org/${orgid}`).subscribe(rent => this.rents = rent)
    }
    fetchRentsByUser(userid: number)
    {
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/${userid}`).subscribe(rent => this.rents = rent)
    }
}
