import { HttpClient } from '@angular/common/http';
import { Location } from './../../models/location';
import { Observable } from 'rxjs';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Organization } from './../../models/organization';
import { AccountService } from 'src/app/services/user.service';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { environment } from 'src/environments/environment';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.page.html',
  styleUrls: ['./manage-equipment.page.scss'],
})
export class ManageEquipmentPage implements OnInit{
  public locations: Observable<Location[]>;
  form!: FormGroup;
  confirmationPopup: boolean = false;
  public newEquipment: Equipment = new Equipment();

  constructor(
    public locationService: LocationService,
    private http: CustomHttpClient,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController
    ) {
      this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
    }

    ngOnInit() {
    }

    onSubmitNewEquipment() {
      this.newEquipment.organizationid = this.accountService.organization.id
      this.equipmentService.createEquipment(this.newEquipment).subscribe()
    }
    async validateInformation(){
      const actionSheet = await this.actionSheetCtrl.create({
        cssClass: 'validateInformation',
        header: 'Sjekk at feltene stemmer',
        buttons: [
          {
            text: 'Riktig',
            handler: () => {
              this.onSubmitNewEquipment();
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
}
