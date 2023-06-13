import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QrService {
  private size = 150;

  public static formatUrl(data: string, size: number)
  {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  }

  downloadQrFromData(data: string, filename: string) {
  var url = QrService.formatUrl(data, this.size);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      var blob = xhr.response;
      var link: HTMLAnchorElement = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  xhr.send();
}
}
