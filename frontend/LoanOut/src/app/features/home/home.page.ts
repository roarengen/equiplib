import { Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Equipment} from 'src/app/models/equipment';
import {Rent} from 'src/app/models/rent';
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
  public equipments: Observable<Equipment[]>;
  public rents: Observable<Rent[]>;
	constructor(
		public accountService: AccountService,
    public equipmentService: EquipmentService,
    public rentService: RentService,
  ) {
    this.equipments = equipmentService.fetchEquipments(accountService.user?.organizationid || 0)
    this.rents = rentService.fetchRentsByUser(accountService.user?.id || 0)
  }

  ngOnInit(): void {

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

