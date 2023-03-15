import { Location } from './../models/location';
import { Equipment } from './../models/equipment';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';

@Injectable({ providedIn: 'root' })
export class EquipmentService {

    constructor(
        private http: CustomHttpClient
    ) {
    }
    getAllEquipment(orgid: number)
    {
        return this.http.get<Equipment[]>(`${environment.apiUrl}/equips/by_org/${orgid}`)
    }

    getAllLocations(orgid: number)
    {
        return this.http.get<Location[]>(`${environment.apiUrl}/locations/${orgid}`)
    }

    getEquipment(equipid: number)
    {
        return this.http.get<Equipment>(`${environment.apiUrl}/equip/${equipid}`)
    }

    addEquipment(equipment: Equipment)
    {
      return this.http.post(`${environment.apiUrl}/equip`, equipment);
    }
}
