import { Component, OnInit } from '@angular/core';
import {CustomHttpClient} from 'src/app/helpers/auth/http-client';
import {Tag} from 'src/app/models/equipment';
import {AccountService} from 'src/app/services/user.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss'],
})
export class AddTagComponent  implements OnInit {

  public newTag: Tag = new Tag();
  constructor(
    private http: CustomHttpClient,
    private accountService: AccountService,
  ) { }

  ngOnInit() {}

  onSubmitNewTag()
  {
    this.http.post(environment.apiUrl + "/equips/tag",
      {
        organizationid: this.accountService.organization.id,
        name: this.newTag.name,
        color: this.newTag.color,
        active: this.newTag.active,
      }).subscribe()
  }

  submit()
  {
    this.onSubmitNewTag()
  }
}
