import { HttpClient } from '@angular/common/http';
import { Location } from './../../models/location';
import { Observable } from 'rxjs';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Organization } from './../../models/organization';
import { AccountService } from 'src/app/services/user.service';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.page.html',
  styleUrls: ['./manage-equipment.page.scss'],
})
export class ManageEquipmentPage implements OnInit{
  public locations: Observable<Location[]>;
  form!: FormGroup;
  confirmationPopup: boolean = false;
  public name: string;
  public model: string;
  public description: string;
  public type: string;
  public serialnumber: string;
  public setlocation: number;
  public active: boolean = true;
  public newEquipment: Equipment;

  constructor(
    public locationService: LocationService,
    public accountService: AccountService,
    public equipmentService: EquipmentService,
    private formBuilder: FormBuilder,

    ) {
      this.locations = this.locationService.getAllLocations(this.accountService.user.organizationid)
    }

    ngOnInit() {

    }

  onSubmitNewEquipment() {
    this.newEquipment.name = this.name
    this.newEquipment.model = this.model
    this.newEquipment.description = this.description
    this.newEquipment.type = this.type
    this.newEquipment.serialnumber = this.serialnumber
    this.newEquipment.locationid = this.setlocation
    this.newEquipment.active = this.active

    console.log(this.newEquipment)
  }



  testloc(loc: any) {
    console.log(loc)
  }
}
