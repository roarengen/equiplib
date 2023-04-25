import { User } from './../../models/user';
import { Organization } from './../../models/organization';
import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Location } from './../../models/location';
import { LocationService } from 'src/app/services/location.service';
import {Tag} from 'src/app/models/equipment';
import {EquipmentService} from 'src/app/services/equipment.service';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.page.html',
  styleUrls: ['./manage-organization.page.scss'],
})
export class ManageOrganizationPage implements OnInit {
  public hasEditedOrganization: boolean = false;
  public changesOrganization =  new Organization();
  public allUsers: Observable<User[]>;
  public locations: Observable<Location[]>;
  public location: Location = new Location();
  public tags: Observable<Tag[]>;

  constructor(
		private alertController: AlertController,
    public locationService: LocationService,
    private http: CustomHttpClient,
    public accountService: AccountService,
    private equipmentService: EquipmentService,
    private actionSheetCtrl: ActionSheetController,
  ) {
    this.allUsers = this.accountService.getAll()
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
    this.tags = this.equipmentService.getAllTags(this.accountService.user.organizationid)

  }

  ngOnInit() {
    this.accountService.getAll()
    this.accountService.getOrganization(this.accountService.user?.organizationid || 0)
  }

  onSubmitOrganizationChanges() {
    if (this.accountService.user.roleid = 4) {
      this.http.put(`${environment.apiUrl}/users/`, this.changesOrganization).subscribe()
    }
  }

  async validateInformation(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Kontroller dine endringer',
      cssClass: 'validateInformation',
      buttons: [
        {
          text: 'Utfør endringer',
          handler: () => {
            this.hasEditedOrganization = true;
            this.onSubmitOrganizationChanges();
            actionSheet.dismiss();
          }
        },
        {
          text: 'Rediger videre',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async onCreateNewLocation() {
    if (this.accountService.user.roleid > 3) {
      this.location.organizationid = this.accountService.user.organizationid;
      this.location.active = true;
      this.http.post(`${environment.apiUrl}/location/`, this.location).subscribe()
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'LocationRegistration ',
      header: 'Legg til lokasjon',
      inputs: [
        {
          name: 'locationName',
          type: 'text',
          placeholder: 'Navn på lokasjon',
        },

        {
          name: 'description',
          type: 'text',
          placeholder: 'Beskrivelse',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Opprett',
          handler: (data) => {
            this.location.name = data.locationName;
            this.location.description = data.description;
            this.onCreateNewLocation();
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }


}
