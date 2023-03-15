import { Location } from './../models/location';
import { Rent } from './../models/rent';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
    constructor(
        private http: HttpClient
    ) {
    }
    getAllLocations(orgid: number)
    {
        return this.http.get<Location[]>(`${environment.apiUrl}/location/by_org/${orgid}`)
    }

}
