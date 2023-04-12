import { AlertController } from '@ionic/angular';
import { Organization } from './../../models/organization';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { RentService } from 'src/app/services/rent.service';
import { Rent } from 'src/app/models/rent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage{
  loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
  public organization?: Observable<Organization>;
  public rentals: Observable<Rent[]>;


  constructor(
    public alertController: AlertController,
    public accountService: AccountService,
    public rentService: RentService,
    private router: Router // Inject the Router service
    ) {
    this.organization = this.accountService.getOrganization(this.accountService.user.organizationid)
    this.rentals = this.rentService.fetchRentsByOrg(this.accountService.user.organizationid)
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

  onOpenQrScanner() {
    this.openQrCode = true;
  }

 scanSuccessHandler(scanValue: string) {
    this.rentals.subscribe(async rentals => {const foundRent = rentals.find(rent => rent.equipmentid === Number(scanValue))

      if (foundRent) {
        console.log(foundRent)
        this.openQrCode = false;
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
        this.openQrCode = false;
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
              handler: (data) => {
                this.router.navigate(['/registerrental'])
                alert.dismiss();
              }
            }
          ]
        });
        alert.present()

      }
    })
    return this.scanSuccessHandler
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
  }
}
