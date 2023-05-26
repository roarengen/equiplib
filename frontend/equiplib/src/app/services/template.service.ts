import { Injectable } from '@angular/core';
import { AccountService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  public other1name?: string;
  public other2name?: string;
  public other3name?: string;


  constructor(
    public accountService: AccountService,
  ) {
    this.other1name = accountService.template?.equipOther1;
    this.other2name = accountService.template?.equipOther2;
    this.other3name = accountService.template?.equipOther3;
}
}
