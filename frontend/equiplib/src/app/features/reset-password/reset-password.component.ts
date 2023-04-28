import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AccountService} from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {

  public token?: string;
  public new_password?: string;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.token = params['token'])
  }

  submitNewPassword() {
    this.accountService.changePassword(this.new_password, this.token)
  }
}
