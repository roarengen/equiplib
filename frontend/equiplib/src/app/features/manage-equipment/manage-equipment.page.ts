import { Location } from './../../models/location';
import { Observable} from 'rxjs';
import { EquipmentService } from 'src/app/services/equipment.service';
import { AccountService } from 'src/app/services/user.service';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { FormBuilder, Validators  } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import { Router } from '@angular/router';
import { QrService } from 'src/app/services/qr.service';

@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.page.html',
  styleUrls: ['./manage-equipment.page.scss'],
})
export class ManageEquipmentPage implements OnInit {
  public locations: Observable<Location[]>;
  confirmationPopup: boolean = false;
  public newEquipment: Equipment = new Equipment();
  form = this.formBuilder.group({
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        model: ['', [Validators.required]],
        brand: ['', [Validators.required]],
        serialnumber: ['', [Validators.required]],
        locationid: ['', [Validators.required]],
        other1: [''],
        other2: [''],
        other3: [''],
        comment: [''],
      })

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public locationService: LocationService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    private actionSheetCtrl: ActionSheetController,
    public templateService: TemplateService,
    public qrService: QrService,
    public router: Router,
    ) {
      this.locations = this.locationService.getActiveLocations(this.accountService.user.organizationid);
    }

    ngOnInit() {
    }

    async downloadQR(id: string)
    {
      this.qrService.downloadQrFromData(id, this.newEquipment.name +'-qrcode.png')
    }

    async presentToast() {
      const toast = await this.toastController.create({
        message: 'Nytt utstyr registrert!',
        duration: 4000,
        position: 'bottom'
      });

      await toast.present();
    }

    async onSubmitNewEquipment(downloadQR: boolean = false) {
      if (this.accountService.user.roleid > 1) {

      this.newEquipment.organizationid = this.accountService.organization.id
      this.equipmentService
        .createEquipment(this.newEquipment)
        .subscribe({
          next: (equipment: Equipment) => {
            if (downloadQR) this.downloadQR(equipment.id.toString())
          },
          error: error => { console.error(error) }
        })
      }
    }

    async validateInformation(){
      const actionSheet = await this.actionSheetCtrl.create({
        cssClass: 'styled',
        header: 'Sjekk at feltene stemmer',
        buttons: [
          {

            cssClass: 'action-sheet-button proceed',
            text: 'Riktig',
            handler: () => {
              actionSheet.dismiss();
              this.downloadQRCodeOption()
            }
          },
          {
            cssClass: 'action-sheet-button dismiss',
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

    async downloadQRCodeOption(){
      const actionSheet = await this.actionSheetCtrl.create({
        cssClass: 'styled',
        header: 'Vil du laste ned QR-koden?',
        buttons: [
          {
            cssClass: 'action-sheet-button proceed',
            text: 'Ja',
            handler: () => {
              this.onSubmitNewEquipment(true);
              this.presentToast();
              actionSheet.dismiss();
              this.router.navigate(['/home']);
            }
          },
          {
            cssClass: 'action-sheet-button dismiss',
            text: 'Nei',
            handler: () => {
              this.onSubmitNewEquipment();
              this.presentToast();
              actionSheet.dismiss();
              this.router.navigate(['/home']);
            }
          },
          {
            cssClass: 'action-sheet-button dismiss',
            text: 'Kanseller registrering',
            handler: () => {
              actionSheet.dismiss();
            }
          }
        ]
      });
      await actionSheet.present();
    }
}
