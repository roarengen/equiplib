import { AccountService } from './../../services/user.service';
import { RentService } from './../../services/rent.service';
import { Component, OnInit } from '@angular/core';
import { Rent } from 'src/app/models/rent';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { FilterEquipmentService } from 'src/app/services/filter-equipment.service';
import { FlashlightService } from 'src/app/services/flashlight.service';


@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  public rentals: Observable<Rent[]>;
  public equipmentList: Observable<Equipment[]>;
  public notCompatibleFlashlight: boolean = false;
  public toggleTorch: boolean = false;
  public scannerIsEnabled: boolean = true;

  constructor(
  public flashlightService: FlashlightService,
  public filterEquipmentService: FilterEquipmentService,
  public alertController: AlertController,
  private equipmentService: EquipmentService,
  private rentService: RentService,
  private accountService: AccountService,
  private router: Router,
  private toastController: ToastController
  )
  {

    this.rentals = this.rentService.fetchRentsByOrg(this.accountService.user.organizationid)
    this.equipmentList = this.equipmentService.getAllEquipment(this.accountService.user.organizationid)
  }

  toggleFlashlight() {
    if(this.flashlightService.isCompatible) {
      this.flashlightService.toggleFlashlight(!this.flashlightService.isFlashlightOn);
    }
    else
    {
      this.presentFlashlightToast();
    }
  }

  ngOnInit() {
    this.scannerIsEnabled = true;
  }

  async scanSuccessHandler(scanValue: string) {
    this.scannerIsEnabled = false;
    this.rentals.subscribe(async rentals => {
      const foundRent = rentals.find(rent => rent.equipmentid === Number(scanValue));
      this.equipmentList.subscribe(async checkEquip => {
        const foundEquip = checkEquip.find(equip => equip.id === Number(scanValue));

        if (foundRent && !this.scannerIsEnabled) {
          this.filterEquipmentService.data = scanValue;
          const alert = await this.alertController.create({
            header: 'Vil du returnere utleien?',
            buttons: [
              {
                text: 'Nei',
                handler: () => {
                  alert.dismiss();
                  this.scannerIsEnabled = true;
                }
              },
              {
                text: 'Returner',
                handler: () => {
                  this.router.navigate(['/returnrental']);
                  alert.dismiss();
                }
              }
            ]
          });
          alert.present();
        } else if (!foundRent && foundEquip) {
          this.filterEquipmentService.data = scanValue;
          const alert = await this.alertController.create({
            header: 'Vil du registrere ny utleie eller endre lokasjonen på utstyret?',
            buttons: [
              {
                text: 'Endre lokasjon',
                handler: () => {
                  alert.dismiss();
                }
              },
              {
                text: 'Registrer',
                handler: () => {
                  this.router.navigate(['/registerrental']);
                  alert.dismiss();
                }
              }
            ]
          });
          alert.present();
        }

        else {
          this.presentToast()
        }
      });
    });
  }

  scanErrorHandler(scanError: any) {
    this.presentToast()
  }

  async presentFlashlightToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/warning-icon.svg"></img> <p>Kunne ikke aktivere lykt</p></span>',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/warning-icon.svg"></img> <p>Skan mislykket!</p></span>',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

}
