import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QrService {
  private size = 150;

  public static format_url(data: string, size: number)
  {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  }

  download_qr_from_data(data: string, filename: string)
  {
    var url = QrService.format_url(data, this.size);
    var link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
}
