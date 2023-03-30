import { Location } from './../../models/location';
import { interval, observable, Observable, delay, take } from 'rxjs';
import { EquipmentService } from 'src/app/services/equipment.service';
import { AccountService } from 'src/app/services/user.service';
import { LocationService } from 'src/app/services/location.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { ActionSheetController } from '@ionic/angular';
import { saveAs } from 'file-saver';

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
  public qrCodeId: string = "";

  constructor(
    public locationService: LocationService,
    private http: CustomHttpClient,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    ) {
      this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
    }

    @ViewChild("qrcode", {read: ElementRef}) qrcode: ElementRef;

    ngOnInit() {
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

    async makeQrBlob()
    {
      const canvas = this.qrcode.nativeElement.querySelector('canvas');
      const dataUrl = canvas.toDataURL('image/png');
      const blob = this.dataURItoBlob(dataUrl);
      saveAs(blob, this.newEquipment.name + '-qrcode.png');
    }

    async onSubmitNewEquipment() {
      if (this.accountService.user.roleid > 1) {

      this.newEquipment.organizationid = this.accountService.organization.id
      this.equipmentService
        .createEquipment(this.newEquipment)
        .subscribe((equipment: Equipment) => this.qrCodeId = equipment.id.toString())
      }
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
              this.downloadQRCodeOption()
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

    async downloadQRCodeOption(){
      const actionSheet = await this.actionSheetCtrl.create({
        cssClass: 'validateInformation',
        header: 'Vil du laste ned QR-koden?',
        buttons: [
          {
            text: 'Ja',
            handler: () => {
              this.makeQrBlob();
              actionSheet.dismiss();
            }
          },
          {
            text: 'Nei',
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
