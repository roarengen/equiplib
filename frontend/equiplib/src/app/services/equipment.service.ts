import { Location } from './../models/location';
import { Equipment, Tag } from './../models/equipment';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';
import { QrService } from './qr.service';

@Injectable({ providedIn: 'root' })
export class EquipmentService {

    constructor(
        private http: CustomHttpClient,
        private qr: QrService
    ) {
    }
    getAllEquipment(orgid: number)
    {
        return this.http.get<Equipment[]>(`${environment.apiUrl}/equips/by_org/${orgid}`)
    }
    getEquipment(equipid: number)
    {
        return this.http.get<Equipment>(`${environment.apiUrl}/equips/${equipid}`)
    }
    createEquipment(equipment: Equipment)
    {
        return this.http.post(`${environment.apiUrl}/equips/`, equipment)
    }
    getAllTags(orgid: number)
    {
        return this.http.get<Tag[]>(`${environment.apiUrl}/equips/tags/`+ orgid)
    }
    updateEquip(equips: Equipment)
    {
        return this.http.put<Equipment>(`${environment.apiUrl}/equips/${equips.id}`, equips).subscribe()
    }
    addTagsToEquip(equips: Equipment, tags: [])
    {
        return this.http.patch<Equipment>(`${environment.apiUrl}/equips/${equips.id}/addtags`, tags).subscribe()
    }
    downloadEquipment(equip: Equipment)
    {
        this.qr.downloadQrFromData(equip.id.toString(), equip.name + "-qrcode.png");
    }
    downloadEquipmentById(equipid: number)
    {
        this.qr.downloadQrFromData(equipid.toString(), "qrcode.png");
    }


}
