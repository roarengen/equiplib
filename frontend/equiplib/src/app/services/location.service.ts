import { Location } from './../models/location';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';

@Injectable({ providedIn: 'root' })
export class LocationService  {
    constructor(
        private http: CustomHttpClient
    ) {
    }
    getAllLocations(orgid: number)
    {
        return this.http.get<Location[]>(`${environment.apiUrl}/location/by_org/${orgid}`)
    }

    getActiveLocations(orgid: number)
    {
        return this.http.get<Location[]>(`${environment.apiUrl}/location/by_org/${orgid}/active`)
    }

    getLocation(locid: number)
    {
        return this.http.get<Location>(`${environment.apiUrl}/location/${locid}`)
    }

    addLocation(location: Location)
    {
        return this.http.post(`${environment.apiUrl}/location/`, location)
    }

    disableLocation(location: Location)
    {
        return this.http.get(`${environment.apiUrl}/location/${location.id}/disable`)
    }

    enableLocation(location: Location)
    {
        return this.http.get(`${environment.apiUrl}/location/${location.id}/enable`)
    }
}
