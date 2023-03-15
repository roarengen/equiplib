import { Location } from './../models/location';
import { Rent } from './../models/rent';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';

@Injectable({ providedIn: 'root' })
export class LocationService {
    constructor(
        private http: CustomHttpClient
    ) {
    }
    getAllLocations(orgid: number)
    {
        return this.http.get<Location[]>(`${environment.apiUrl}/location/by_org/${orgid}`)
    }

}
