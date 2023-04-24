import { AccountService } from './../../services/user.service';
import { RentService } from './../../services/rent.service';
import { Component, OnInit } from '@angular/core';
import { Rent } from 'src/app/models/rent';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  public rentals: Observable<Rent[]>;
  public notCompatibleFlashlight: boolean = false;
  public torch: boolean = false;
  constructor(
  public alertController: AlertController,
  private rentService: RentService,
  private accountService: AccountService,
  private router: Router
  )
  {
    this.rentals = this.rentService.fetchRentsByOrg(this.accountService.user.organizationid)
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
    this.rentals.subscribe(async rentals => {const foundRent = rentals.find(rent => rent.equipmentid === Number(scanValue))
      if (foundRent) {
        const alert = await this.alertController.create({
          cssClass: '',
          header: 'Vil du returnere utleien eller endre lokasjonen på utstyret?',
          buttons: [
            {
              text: 'Endre lokasjon',
              handler: () => {
                alert.dismiss();

              }
            }, {
              text: 'Returner',
              handler: () => {
                this.router.navigate(['/returnrental', { state:  {foundRent} }]);
                alert.dismiss();
              }
            }
          ]
        });
        alert.present()
      }

      else {
        const alert = await this.alertController.create({
          cssClass: '',
          header: 'Vil du registrere ny utleie eller endre lokasjonen på utstyret?',
          buttons: [
            {
              text: 'Endre lokasjon',
              handler: () => {
                alert.dismiss()
              }
            }, {
              text: 'Registrer',
              handler: () => {
                this.router.navigate(['/registerrental'])
                alert.dismiss();
              }
            }
          ]
        });
        alert.present()

      }
    })
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
  }

}
