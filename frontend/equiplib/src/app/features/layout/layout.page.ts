import { Organization } from './../../models/organization';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage{
  loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
  public organization?: Observable<Organization>;

  constructor(public accountService: AccountService) {
    this.organization = this.accountService.getOrganization(this.accountService.user?.organizationid)

  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  onOpenQrScanner() {
    this.openQrCode = true;
  }

  scanSuccessHandler(scanValue: string) {
    console.log(scanValue)
    this.enterPinCode = true;
    this.QrCode = scanValue;
    console.log(scanValue)
    return this.scanSuccessHandler
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
  }
}
