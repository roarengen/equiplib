import { Component, OnInit} from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { User } from 'src/app/models/user';
import { EquipmentService } from 'src/app/services/equipment.service';
import { AccountService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit {
	loading: boolean = false;
	submitted: boolean = false;
	openQrCode: boolean = false;
	enterPinCode: boolean = false;
	QrCode!: string;
	pin!: string;
  equipments!: Equipment[];
	constructor(
		public accountService: AccountService,
    public equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
    this.equipmentService.getEquipments(this.accountService.user?.organizationid || 0).subscribe(equips => {
      this.equipments = equips
    })
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

