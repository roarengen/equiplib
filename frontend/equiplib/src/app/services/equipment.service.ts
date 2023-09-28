import { Location } from './../models/location';
import { Equipment, Tag } from './../models/equipment';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomHttpClient } from '../helpers/auth/http-client';
import { QrService } from './qr.service';

@Injectable({ providedIn: 'root' })
export class EquipmentService {

    public editTag?: Tag;

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

    getMultipleEquipment(equipid: Number[])
    {
        return this.http.get<Equipment[]>(`${environment.apiUrl}/equips/${equipid}`)
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
    addTagsToEquip(equips: Equipment, tags: Tag[])
    {
        return this.http.patch<Equipment>(`${environment.apiUrl}/equips/${equips.id}/addtags`, tags.map(tag => tag.id)).subscribe()
    }
    downloadEquipment(equip: Equipment)
    {
        this.qr.downloadQrFromData(equip.id.toString(), equip.name + "-qrcode.png");
    }
    downloadEquipmentById(equipid: number)
    {
        this.qr.downloadQrFromData(equipid.toString(), "qrcode.png");
    }
    disableTag(tag: Tag)
    {
        return this.http.get<Tag>(`${environment.apiUrl}/equips/tag/${tag.id}/disable`)
    }
    enableTag(tag: Tag)
    {
        return this.http.get<Tag>(`${environment.apiUrl}/equips/tag/${tag.id}/enable`)
    }
    patchTag(tag: Tag)
    {
        return this.http.patch<Tag>(`${environment.apiUrl}/equips/tag/${tag.id}`, tag)
    }
}
