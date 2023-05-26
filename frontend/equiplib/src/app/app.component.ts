import { Component } from '@angular/core';
import { AccountService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Equiplib';

  constructor(private accountService: AccountService) {
}

logout() {
    this.accountService.logout();
}
}
