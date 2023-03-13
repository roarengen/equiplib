import { Organization } from './../models/organization';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user'
import { Equipment } from '../models/equipment';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
    singleEvent$: BehaviorSubject<Event> | undefined;
    private equipmentSubject: BehaviorSubject<Equipment[]>;
    public equipments: Equipment[];

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
      this.equipmentSubject = new BehaviorSubject<Equipment[]>(JSON.parse(localStorage.getItem('equipment')!));
      this.equipments = new Array<Equipment>();
    }

    getEquipments(organizationid: number) {
      return this.http.get<Equipment[]>(`${environment.apiUrl}/equips/by_org/${organizationid}`)
      .subscribe(equipments =>
        this.equipments = equipments
        )


    }

}
