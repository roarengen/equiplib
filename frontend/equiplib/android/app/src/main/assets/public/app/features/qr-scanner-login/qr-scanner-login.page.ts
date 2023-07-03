import { AccountService } from '../../services/user.service';
import { RentService } from '../../services/rent.service';
import { Component, OnInit } from '@angular/core';
import { Rent } from 'src/app/models/rent';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { FilterService } from 'src/app/services/filter.service';
import { FlashlightService } from 'src/app/services/flashlight.service';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';


@Component({
  selector: 'app-qr-login-scanner',
  templateUrl: './qr-scanner-login.page.html',
  styleUrls: ['./qr-scanner-login.page.scss'],
})

export class QrScannerLoginPage implements OnInit {
  submitted: boolean = false;
  openQrCode: boolean = false;
  enterPinCode: boolean = false;
	QrCode!: string;
	pin!: string;
  invalidCredentials: boolean = false;
  public rentals: Observable<Rent[]>;
  public equipmentList: Observable<Equipment[]>;
  public notCompatibleFlashlight: boolean = false;
  public toggleTorch: boolean = false;
  public scannerIsEnabled: boolean = true;


  constructor(

  public flashlightService: FlashlightService,
  public FilterService: FilterService,
  public alertController: AlertController,
  private equipmentService: EquipmentService,
  private rentService: RentService,
  private accountService: AccountService,
  private router: Router,
  private toastController: ToastController,
  private http: CustomHttpClient

  )
  {}

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

  ionViewWillEnter() {
    this.enterPinCode = false;
    this.QrCode = '';
    this.pin = '';
    this.invalidCredentials = false;
  }

  scanSuccessHandler(scanValue: string) {
    this.QrCode = scanValue;
    this.presentAlertPrompt()
	}

  scanErrorHandler(scanError: any) {
    this.presentErrorToast()
  }


  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'pinLogin',
      header: 'PIN',
      inputs: [
        {
          name: 'pin',
          type: 'text',
          placeholder: 'Skriv inn din PIN-kode',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.openQrCode = false;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.pin = data.pin
            this.login( this.QrCode, this.pin)
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  login(username: string, password: string) {
    this.submitted = true;
    this.accountService.login(username, password)
      .subscribe({
        next: login => {
					this.accountService.user = login.user
          this.http.token = login.token
					this.accountService.getOrganization(login.user.organizationid).subscribe(
						organization =>{ this.accountService.organization = organization
            }
					)
					this.accountService.getTemplate(login.user.organizationid).subscribe(
						template => { this.accountService.template = template}
					)
					this.router.navigateByUrl('home')
				},
        error: () => {
          this.invalidCredentials = true;
        }
      });
  }


  async presentFlashlightToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/warning-icon.svg"></img> <p>Kunne ikke aktivere lykt</p></span>',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: '<span><img src="../../../assets/icons/warning-icon.svg"></img> <p>Skan mislykket!</p></span>',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

}
