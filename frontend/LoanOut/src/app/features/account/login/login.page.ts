import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AccountService } from '../../../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  enterPinCode: boolean = false
  QrCode!: string;

  constructor(
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

onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.accountService.login(this.f['username'].value, this.f['password'].value)
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


onSubmitQrCode() {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.accountService.login(this.QrCode, this.f['password'].value)
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

  scanSuccessHandler(scanValue: string) {
    this.enterPinCode = true;
    this.QrCode = scanValue;
    console.log(scanValue)
    return this.scanSuccessHandler
  }

  scanErrorHandler(scanError: any) {
    console.log(scanError)
  }
}

