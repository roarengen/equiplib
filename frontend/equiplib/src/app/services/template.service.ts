import { Injectable } from '@angular/core';
import {Template} from '../models/template';
import { AccountService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  public template?: Template;


  constructor(
    public accountService: AccountService,
  ) {
    this.template = accountService.template;
}
}
