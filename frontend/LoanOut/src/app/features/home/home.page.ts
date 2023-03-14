import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { RentService } from 'src/app/services/rent.service';
import { AccountService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
	pin!: string;
	constructor(
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
  ) {
  }

  ngOnInit() {

    this.equipmentService.fetchEquipments(this.accountService.user?.organizationid || 0)

    this.rentService.fetchRentsByOrg(this.accountService.user?.organizationid || 0)
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

