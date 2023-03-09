import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AccountService } from '../../../services/user.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

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

		this.loading = true;
		this.accountService.login(username, passowrd)
			.pipe(first())
			.subscribe({
				next: () => {
					// default to the set component else til will default to base url
					const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
					this.router.navigateByUrl(returnUrl);
				},
				error: error => {
					console.log(error)
					this.loading = false;
				}
			});
	}

	onSubmit() {
		if (this.form.invalid) {
			return;
		}
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

