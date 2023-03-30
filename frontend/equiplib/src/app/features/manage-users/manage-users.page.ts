import { AccountService } from './../../services/user.service';
import { CustomHttpClient } from './../../helpers/auth/http-client';
import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createUser} from 'src/app/models/user';
import { SafeUrl } from '@angular/platform-browser';
import { ActionSheetController } from '@ionic/angular';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnChanges {
  public setDownloadQR: boolean = true;
  public hasSubmittedNewUser: boolean = false;
  public newUser: createUser = new createUser();
  public qrCodeUsername: string = "";

  constructor(
    private cdRef: ChangeDetectorRef,
    private http: CustomHttpClient,
    private accountService: AccountService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  @ViewChild("qrcode", {read: ElementRef}) qrcode: ElementRef;

    ngOnChanges(changes: SimpleChanges) {
      if (changes.qrcode) {
        console.log(this.qrcode.nativeElement.focus())
      }
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

  async validateInformation(){
    this.qrCodeUsername = this.newUser.username
    console.log(this.qrCodeUsername)
    if (this.setDownloadQR) {
      console.log(this.qrCodeUsername)
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sjekk at feltene stemmer',
      cssClass: 'validateInformation',
      buttons: [
        {
          text: 'Riktig, last ned QR',
          handler: () => {
            this.hasSubmittedNewUser = true;
            this.onSubmitNewUser();
            actionSheet.dismiss();
          }
        },
        {
          text: 'Gjør endringer',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async onSubmitNewUser() {

    if (this.accountService.user.roleid > 1) {
    this.cdRef.detectChanges();
    const qrCode = this.qrcode.nativeElement;
    const canvas = qrCode.querySelector('canvas');
    const dataUrl = canvas.toDataURL('image/png');
    const blob = this.dataURItoBlob(dataUrl);
    saveAs(blob, this.newUser.firstname + 'qrcode.png');

    this.newUser.organizationid = this.accountService.user.organizationid
    this.newUser.roleid = 1 // We need to solve security around role selection.
    this.http.post(`${environment.apiUrl}/users/`, this.newUser).subscribe()
  }
  else {
    console.log("Invalid role")
  }
  }
}
