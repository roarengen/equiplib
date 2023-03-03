import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/user.service';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}
