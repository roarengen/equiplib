import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { LayoutComponent } from './account-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        ZXingScannerModule,
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
    ]
})
export class AccountModule { }
