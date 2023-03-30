import { AccountService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.page.html',
  styleUrls: ['./manage-organization.page.scss'],
})
export class ManageOrganizationPage implements OnInit {

  constructor(
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.accountService.getAll()
    this.accountService.getOrganization(this.accountService.user?.organizationid || 0)
  }

}
