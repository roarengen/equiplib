import { AccountService } from './../../services/user.service';
import { RentService } from './../../services/rent.service';
import { Component, OnInit } from '@angular/core';
import { Rent } from 'src/app/models/rent';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { FilterEquipmentService } from 'src/app/services/filter-equipment.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  public rentals: Observable<Rent[]>;
  public equipmentList: Observable<Equipment[]>;
  public notCompatibleFlashlight: boolean = false;
  public torch: boolean = false;
  constructor(
  public filterEquipmentService: FilterEquipmentService,
  public alertController: AlertController,
  private equipmentService: EquipmentService,
  private rentService: RentService,
  private accountService: AccountService,
  private router: Router
  )
  {

    this.rentals = this.rentService.fetchRentsByOrg(this.accountService.user.organizationid)
    this.equipmentList = this.equipmentService.getAllEquipment(this.accountService.user.organizationid)
  }

  ngOnInit() {
  }

  onTorchCompatible(torchCompatability: boolean) {
    if (torchCompatability) {
      this.notCompatibleFlashlight = false;
    }
  }

  activateTorch(event: any) {
    if (event.checked) {
      this.torch = true;
    }
    else{this.torch = false}
  }

  scanSuccessHandler(scanValue: string) {
    this.rentals.subscribe(async rentals => {
      const foundRent = rentals.find(rent => rent.equipmentid === Number(scanValue))
      this.filterEquipmentService.data = scanValue;
      if (foundRent) {
        const alert = await this.alertController.create({
          header: 'Vil du returnere utleien eller endre lokasjonen på utstyret?',
          buttons: [
            {
              cssClass: '--ion-color-primary-contrast',
              text: 'Endre lokasjon',
              handler: () => {
                alert.dismiss();
              }
            },
            {
              cssClass: '--ion-color-primary-contrast',
              text: 'Returner',
              handler: () => {
                this.router.navigate(['/returnrental']);
                alert.dismiss();
              }
            }
          ]
        });
        alert.present()
      } else {
        this.equipmentList.subscribe(async checkEquip => {
          const foundEquip = checkEquip.find(equip => equip.id === Number(scanValue))
          const alert = await this.alertController.create({
            cssClass: 'buttonCss',
            header: 'Vil du registrere ny utleie eller endre lokasjonen på utstyret?',
            buttons: [
              {
                text: 'Endre lokasjon',
                handler: () => {
                  alert.dismiss()
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
        });
      }
    });
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
  }

}
