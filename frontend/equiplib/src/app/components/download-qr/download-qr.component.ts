import { Component, Input, OnInit } from '@angular/core';
import { QrService } from 'src/app/services/qr.service';

@Component({
  selector: 'download-qr',
  templateUrl: './download-qr.component.html',
  styleUrls: ['./download-qr.component.scss'],
})
export class DownloadQrComponent  implements OnInit {

  @Input() data: string;
  @Input() filename: string;
  qr_url: string;
  constructor(
    public qrService: QrService
  ) { }

  ngOnInit() {
    this.qr_url = QrService.formatUrl(this.data, this.qrService.size);
  }


  onClick()
  {
    this.qrService.downloadQrFromData(this.data, this.filename);
  }

}
