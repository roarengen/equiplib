import { Equipment } from './../models/equipment';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EquipmentService {

    constructor(
        private http: HttpClient
    ) {
    }
    getEquipments(orgid: number)
    {
        return this.http.get<Equipment[]>(`${environment.apiUrl}/equips/by_org/${orgid}`)
    }
}
