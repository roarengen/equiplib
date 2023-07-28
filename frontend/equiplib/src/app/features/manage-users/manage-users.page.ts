import { AccountService } from './../../services/user.service';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { createUser, User} from 'src/app/models/user';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {
  public setDownloadQR: boolean = true;
  public hasSubmittedNewUser: boolean = false;
  public newUser: createUser = new createUser();
  public qrCodeUsername: string = "";
  form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.maxLength(40)]],
      lastname: ['', [Validators.required, Validators.maxLength(40)]],
      username: ['', [Validators.required, Validators.maxLength(40)]],
      postalcode: ['', [Validators.required, Validators.maxLength(40)]],
      membershipId: ['', [Validators.required, Validators.maxLength(40)]],
      city: ['', [Validators.required, Validators.maxLength(40)]],
      phone: [''],
      dateOfBirth: [''],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(4), Validators.maxLength(6), Validators.pattern('^[0-9]+$')]],
      roleid: ['', [Validators.required]]
    })

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private cdRef: ChangeDetectorRef,
    private accountService: AccountService,
    private actionSheetCtrl: ActionSheetController,
    private qrService: QrService,
    private router: Router
  ) {}

  ngOnInit() {
  }

    async presentToast() {
      const toast = await this.toastController.create({
        message: 'Ny bruker er registrert',
        duration: 4000,
        position: 'bottom'
      });

      await toast.present();
    }

    async presentErrorToast() {
      const toast = await this.toastController.create({
        message: '<img src="../../../assets/icons/warning-icon.svg"> <p>Noe gikk galt med å registrere brukeren.</p>',
        duration: 4000,
        position: 'bottom'
      });

      await toast.present();
    }

  async validateInformation(){
    this.qrCodeUsername = this.newUser.username
    console.log(this.qrCodeUsername)
    if (this.setDownloadQR) {
      console.log(this.qrCodeUsername)
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sjekk at feltene stemmer',
      cssClass: 'styled',
      buttons: [
        {
          cssClass: 'action-sheet-button proceed',
          text: 'Riktig, last ned QR',
          handler: () => {
            this.hasSubmittedNewUser = true;
            this.onSubmitNewUser();
            actionSheet.dismiss();
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

  async onSubmitNewUser() {

    if (this.accountService.user.roleid < 1) return

    this.cdRef.detectChanges();
    this.qrService.downloadQrFromData(this.newUser.username, 'qrcode.png')

    this.newUser.organizationid = this.accountService.user.organizationid
    this.newUser.roleid = this.newUser.roleid;

    this.accountService.register(this.newUser).subscribe({
      next: (response: User) => {
        this.presentToast()
        this.router.navigate(['/home'])
      },
      error: (error) => {
        console.error('error occured:', error)
        this.presentErrorToast()
      }
    }
    )
  }


}
