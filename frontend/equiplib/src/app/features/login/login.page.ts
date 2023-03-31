import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { CustomHttpClient } from 'src/app/helpers/auth/http-client';
import { AccountService } from 'src/app/services/user.service';

@Component({
	templateUrl: './login.page.html',
	styleUrls: ['./login.component.scss']
})
export class LoginPage implements OnInit {
	form!: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
	pin!: string;

  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

	constructor(
    private actionSheetCtrl: ActionSheetController,
		private alertController: AlertController,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private http: CustomHttpClient
	) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			username: [''],
			password: ['', Validators.required]
		});
      this.router.events.subscribe(e => {
        if (e instanceof ActivationStart && e.snapshot.outlet === "login")
          this.outlet.deactivate();
      })
	}

	get f() { return this.form.controls; }

	login(username: string, password: string)
	{
		this.submitted = true;
		this.accountService.login(username, password)
			.subscribe(
				login => {
					this.accountService.user = login.user
          this.http.token = login.token
					this.accountService.getOrganization(login.user.organizationid).subscribe(
						organization =>{ this.accountService.organization = organization
            }
					)
					this.router.navigateByUrl('home')
				})

		this.loading = true;
	}

	onSubmit() {
		this.login(this.f['username'].value, this.f['password'].value)

	}

	onSubmitQrCode() {
		this.login(this.QrCode, this.pin)
	}

	onOpenQrScanner() {
		this.openQrCode = true;
	}

	scanSuccessHandler(scanValue: string) {
    this.QrCode = scanValue;
    this.presentAlertPrompt()
	}

	scanErrorHandler(scanError: any) {
    console.log(scanError)
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
            console.log(data)
            console.log(data.pin)
            this.pin = data.pin
            this.login( this.QrCode, this.pin)
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

}

