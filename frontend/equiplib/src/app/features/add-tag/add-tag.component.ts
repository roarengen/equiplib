import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern("/^[A-Za-z]+$/"), Validators.maxLength(30)]],
    tagcolor: ['', [Validators.required, , Validators.pattern("/^[A-Za-z]+$/")]],
  })

  presetcolors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'] //TODO find high-quality colors
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public toastController: ToastController,
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
        active: true,
      }).subscribe()
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `Ny tag er opprettet`,
      duration: 3000,
      position: 'top',
      animated: true,
    });
    await toast.present();
  }
  submit()
  {
    if (this.newTag.color == undefined)
    {
      return;
    }
    this.onSubmitNewTag()
    this.presentToast()
    this.router.navigate(['/manageorganization']);

  }
}
