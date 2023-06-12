import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QrService {
  private size = 150;

  public static formatUrl(data: string, size: number)
  {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  }

  downloadQrFromData(data: string, filename: string)
  {
    var url = QrService.formatUrl(data, this.size);
    var link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
}
