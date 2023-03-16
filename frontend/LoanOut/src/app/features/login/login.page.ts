import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
	constructor(
		private alertController: AlertController,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private http: CustomHttpClient
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			username: [''],
			password: ['', Validators.required]
		});
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
						organization => this.accountService.organization = organization
					)
					this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl' || '/home'])
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
		console.log(scanValue)
		this.enterPinCode = true;
		this.QrCode = scanValue;
		console.log(scanValue)
		return this.scanSuccessHandler
	}

	scanErrorHandler(scanError: any) {
		console.log(scanError)
	}

	async presentAlert() {
		const alert = await this.alertController.create({
			header: 'Skriv inn din PIN kode',
			buttons: [
				{
					text: 'Logg inn',
					handler: (alertData) => {
						this.pin = alertData.inputField
						this.onSubmitQrCode()
					}
				}],
			inputs: [
				{
					name: 'inputField',
					type: 'number',
					placeholder: 'PIN',
					min: 1,
					max: 4,
				},
			],
		});
		await alert.present();
	}

}

