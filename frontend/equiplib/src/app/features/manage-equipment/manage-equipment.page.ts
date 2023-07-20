import { Location } from './../../models/location';
import { Observable} from 'rxjs';
import { EquipmentService } from 'src/app/services/equipment.service';
import { AccountService } from 'src/app/services/user.service';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';
import { Equipment, Tag } from 'src/app/models/equipment';
import { FormBuilder, Validators  } from '@angular/forms';
import { ActionSheetController, PopoverController, ToastController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import { Router } from '@angular/router';
import { QrService } from 'src/app/services/qr.service';
import {ToastService} from 'src/app/services/toast.service';

@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.page.html',
  styleUrls: ['./manage-equipment.page.scss'],
})
export class ManageEquipmentPage implements OnInit {
  public locations: Observable<Location[]>;
  confirmationPopup: boolean = false;
  public newEquipment: Equipment = new Equipment();
  public tags!: Observable<Tag[]>;
  public filteredAddedTags: Tag[] = [];
  public equiptags: Tag[] = [];
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
    public locationService: LocationService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    private popoverController: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    public templateService: TemplateService,
    public qrService: QrService,
    public router: Router,
    private toastService: ToastService
    ) {
      this.locations = this.locationService.getActiveLocations(this.accountService.user.organizationid);
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
      this.tags = this.equipmentService.getAllTags(this.accountService.user.organizationid);
      this.tags.subscribe(tags => {
        this.filteredAddedTags = tags
          .map((tag: any) => {
            return { ...tag, visible: true };
          })
          .filter((tag: any) => {
            return !this.equiptags.some((eqTag: any) => eqTag.id === tag.id);
          });
      });
    }

    ionViewWillLeave() {
      this.newEquipment = new Equipment();
      this.equiptags = [];
      this.filteredAddedTags = [];
    }

    async downloadQR(id: string)
    {
      this.qrService.downloadQrFromData(id, this.newEquipment.name +'-qrcode.png')
    }

    async removeTag(tag: any, index: number) {
      this.equiptags.splice(index, 1);
      this.filteredAddedTags.push({ ...tag, visible: true });
      tag.visible = false;
    }

    async addTag(tag: any, index: number){
      this.filteredAddedTags.splice(index, 1)
      this.equiptags.push({ ...tag, visible: true });
      await this.popoverController.dismiss();
    }

    async onSubmitNewEquipment(downloadQR: boolean = false) {
      console.log(this.equiptags)
      if (this.accountService.user.roleid > 1) {
      this.newEquipment.organizationid = this.accountService.organization.id
      this.equipmentService
        .createEquipment(this.newEquipment)
        .subscribe({
          next: (equipment: Equipment) => {
            if (downloadQR) this.downloadQR(equipment.id.toString())
            this.equipmentService.addTagsToEquip(equipment, this.equiptags)
            this.router.navigate(['/home']);
          },
          error: error => {
            this.toastService.presentToast('Noe gikk galt! Utstyret ble ikke riktig registrert.')
            console.error(error)
          }
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
              this.toastService.presentToast('Nytt utstyr registrert!')
              actionSheet.dismiss();
            }
          },
          {
            cssClass: 'action-sheet-button dismiss',
            text: 'Nei',
            handler: () => {
              this.onSubmitNewEquipment();
              this.toastService.presentToast('Nytt utstyr registrert!')
              actionSheet.dismiss();
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
