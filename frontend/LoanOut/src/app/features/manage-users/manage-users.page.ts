import { AccountService } from './../../services/user.service';
import { CustomHttpClient } from './../../helpers/auth/http-client';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {

  public username: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public phone: string;
  public city: string;
  public birthdate: Date;
  public validthrudate: Date;

  constructor(
    private http: CustomHttpClient,
    private accountService: AccountService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  onSubmitNewUser() {
    const data = {
      organizationid: this.accountService.user.organizationid,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      city: this.city,
      dateOfBirth: this.birthdate,
      activeFromDate: new Date(),
      activeToDate: this.validthrudate,
    }
      this.http.post(`${environment.apiUrl}/users`, data).subscribe(response => {
        console.log(response)
      })
    }
  }
