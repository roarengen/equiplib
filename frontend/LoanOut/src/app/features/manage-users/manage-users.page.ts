import { AccountService } from './../../services/user.service';
import { CustomHttpClient } from './../../helpers/auth/http-client';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { createUser} from 'src/app/models/user';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {

  public newUser: createUser = new createUser();

  constructor(
    private http: CustomHttpClient,
    private accountService: AccountService,
    private actionSheetCtrl: ActionSheetController
  ) { }

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
    this.newUser.organizationid = this.accountService.user.organizationid
    this.newUser.roleid = 1

    this.http.post(`${environment.apiUrl}/users/`, this.newUser).subscribe()
  }
}
