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
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/by_org/${orgid}`)
    }

    fetchRentsByUserId(userid: number)
    {
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/${userid}`)
    }

    fetchCurrentUserRentals() {
      return this.http.get<Rent[]>(`${environment.apiUrl}/rents/me`)
    }

    addRental(rental: Rent)
    {
        return this.http.post(`${environment.apiUrl}/rents/`, rental);
    }
}
