import { Organization } from './../../models/organization';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loading: boolean = false;
  submitted: boolean = false;
  openQrCode: boolean = false;
  enterPinCode: boolean = false;
  QrCode!: string;
  organization!: Organization;

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(){
    let org_json = localStorage.getItem('organization')
    if (org_json)
      this.organization = JSON.parse(org_json);
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

}

