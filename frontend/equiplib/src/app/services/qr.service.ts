import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver'
import {Idownloadable} from '../models/downloadable';

@Injectable({ providedIn: 'root' })
export class QrService {
  public size = 150;

  public static formatUrl(data: string, size: number)
  {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  }

  public downloadQrAsZip(downloadables: Idownloadable[]) : void
  {

    const zip = new JSZip();

    const downloadPromises = downloadables.map(async item => {
      const content = await this.downloadFile(QrService.formatUrl(item.data, this.size));
      zip.file(item.name + '.png', content);
    });

    Promise.all(downloadPromises).then(() => {
      zip.generateAsync({type : 'blob'}).then((content) => {
        saveAs(content, 'qrcodes.zip')
      })
    })
  }

  private async downloadFile(url: string) : Promise<ArrayBuffer>
  {
    const r = await fetch(url);
    return await r.arrayBuffer();
  }

  public downloadQrFromData(data: string, filename: string) {
  const url = QrService.formatUrl(data, this.size);

  saveAs(url, filename)
  }
}
