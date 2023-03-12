import { Rent } from './../models/rent';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RentService {

    constructor(
        private http: HttpClient
    ) {
    }
    fetchRentsByOrg(orgid: number)
    {
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/by_org/${orgid}`)
    }
    fetchRentsByUser(userid: number)
    {
        return this.http.get<Rent[]>(`${environment.apiUrl}/rents/${userid}`)
    }
}
