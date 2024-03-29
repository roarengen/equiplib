import { User } from './../../models/user';
import { Organization } from './../../models/organization';
import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToggleCustomEvent, ToastController } from '@ionic/angular';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { environment } from 'src/environments/environment';
import { Observable, first, firstValueFrom } from 'rxjs';
import { Location } from './../../models/location';
import { LocationService } from 'src/app/services/location.service';
import {Tag} from 'src/app/models/equipment';
import {EquipmentService} from 'src/app/services/equipment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';

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

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(70)]],
    number: ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
    email: ['', [Validators.email, Validators.maxLength(60)]],
    phone: ['', [Validators.required, Validators.maxLength(40),Validators.pattern("^[0-9]*$")]],
    city: ['', [Validators.maxLength(40)]],
    postalcode: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]],
  })

  constructor(
    private formBuilder: FormBuilder,
		private alertController: AlertController,
    public locationService: LocationService,
    private http: CustomHttpClient,
    public accountService: AccountService,
    private equipmentService: EquipmentService,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.accountService.getOrganization(this.accountService.user?.organizationid || 0).subscribe( x =>
      {this.changesOrganization = x})
    this.allUsers = this.accountService.getAll()
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
    this.tags = this.equipmentService.getAllTags(this.accountService.user.organizationid)
  }

  ngOnInit() {
    this.accountService.getAll()
    this.accountService.getOrganization(this.accountService.user?.organizationid || 0).subscribe( x =>
      {this.changesOrganization = x})
  }

  ionViewWillEnter() {
    this.allUsers = this.accountService.getAll()
    this.tags = this.equipmentService.getAllTags(this.accountService.user.organizationid)
    this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
  }

  onSubmitOrganizationChanges() {
    if (this.accountService.user.roleid === 4) {
      this.accountService.updateOrganization(this.changesOrganization).subscribe({
        next: () => {
          this.presentToast()
          this.accountService.logout()
				},
        error: () => {
          this.presentErrorToast()
        }
      });
  }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Endringer lagret, du må logge inn på nytt.',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Noe gikk galt!',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async validateInformation(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Kontroller dine endringer',
      cssClass: 'styled',
      buttons: [
        {
          cssClass: 'action-sheet-button proceed',
          text: 'Utfør endringer',
          handler: () => {
            this.hasEditedOrganization = true;
            this.onSubmitOrganizationChanges();
            actionSheet.dismiss();
          }
        },
        {
          text: 'Rediger videre',
          cssClass: 'action-sheet-button dismiss',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  toggleLocationActive(event: Event, location: Location){
    const ev = event as ToggleCustomEvent;
    const checked = ev.detail.checked;

    checked ? this.locationService.enableLocation(location).subscribe() : this.locationService.disableLocation(location).subscribe();
  }

  async onCreateNewLocation() {
    if (this.accountService.user.roleid > 3) {
      this.location.organizationid = this.accountService.user.organizationid;
      this.location.active = true;
      this.http.post(`${environment.apiUrl}/location/`, this.location).subscribe()
    }
  }

  async editTag(tag: Tag) {
    if (this.accountService.user.roleid <= 3) return;

    this.equipmentService.editTag = tag;
    this.router.navigateByUrl('/edittag');
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'LocationRegistration',
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
