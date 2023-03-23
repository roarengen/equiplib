import { AccountService } from './../../services/user.service';
import { CustomHttpClient } from './../../helpers/auth/http-client';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createUser} from 'src/app/models/user';
import { SafeUrl } from '@angular/platform-browser';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {
  public hasSubmittedNewUser: boolean = false;
  public newUser: createUser = new createUser();
  public qrCodeUsername: string = "";
  public qrCodeDownloadLink: SafeUrl;
  public link: string;
  qrcElement: any;
  constructor(
    private http: CustomHttpClient,
    private accountService: AccountService,
    private actionSheetCtrl: ActionSheetController

  ) {
    this.qrCodeUsername = '';
  }

  @ViewChild("qrcode", {static : true}) qrcode: ManageUsersPage;


  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  dlDataUrlBin(){
    this.link = this.qrcode.qrcElement.nativeElement.firstChild.src
  }

  ngOnInit() {
  }

  async validateInformation(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sjekk at feltene stemmer',
      cssClass: 'validateInformation',
      buttons: [
        {
          text: 'Riktig',
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
  onSubmitNewUser() {
    this.qrCodeUsername = this.newUser.username
    this.newUser.organizationid = this.accountService.user.organizationid
    this.newUser.roleid = 1 // We need to solve security around role selection.
    this.http.post(`${environment.apiUrl}/users/`, this.newUser).subscribe()
  }
}
