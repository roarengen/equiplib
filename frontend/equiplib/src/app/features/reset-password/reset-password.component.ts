import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {

  public token?: string;
  constructor(private route: ActivatedRoute) {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }
}
