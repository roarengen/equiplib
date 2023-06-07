import { FilterService } from './../../services/filter.service';
import { LocationService } from './../../services/location.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TemplateService } from 'src/app/services/template.service';
import { AccountService } from 'src/app/services/user.service';
import { PopoverController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  form!: FormGroup;
  public editUser: User = new User();
  public subscription = new Subscription();
  public selectedUser?: Observable<User>;

  constructor(
  public router: Router,
  private formBuilder: FormBuilder,
  public toastController: ToastController,
  public getSelectedUserService: FilterService,
  public accountService: AccountService,
  public locationService: LocationService,
  public templateService?: TemplateService,
  public popoverController?: PopoverController,
  ) {}
  ngOnInit() {

    this.accountService.getById(this.getSelectedUserService.data).subscribe(User => {
      this.editUser = User;

      console.log(this.editUser)

    this.form = this.formBuilder.group({
      firstname: ['', Validators.required, Validators.maxLength(40)],
      lastname: ['', Validators.required,Validators.maxLength(40)],
      username: ['', Validators.required, Validators.maxLength(40)],
      phonenumber: ['', Validators.required, Validators.maxLength(40), Validators.pattern('^[0-9]+$')],
      email: ['', Validators.email],
    })
  })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.editUser.username + ' er redigert!',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async editedUser() {
    this.accountService.updateUser(this.editUser)
    this.presentToast()
    this.router.navigate(['/home']);

  }

}
