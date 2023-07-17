import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TemplateService } from 'src/app/services/template.service';
import { AccountService } from 'src/app/services/user.service';
import { PopoverController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { FilterService } from './../../services/filter.service';
import { LocationService } from './../../services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  public editUser: User = new User();
  public subscription = new Subscription();
  public selectedUser?: Observable<User>;
  public checkRoleChange: number;

  constructor(
    public router: Router,
    public toastController: ToastController,
    public getSelectedUserService: FilterService,
    public accountService: AccountService,
    public locationService: LocationService,
    public templateService?: TemplateService,
    public popoverController?: PopoverController,
  ) {}

  ngOnInit() {
    this.accountService.getById(this.getSelectedUserService.data).subscribe(user => {
      this.editUser = user;
      this.checkRoleChange = this.editUser.roleid;
    });
  }

  ionViewWillLeave() {
    this.checkRoleChange = null;
    this.editUser = new User();
    this.subscription.unsubscribe();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.editUser.username + ' er redigert!',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  getRole(roleid: any) {
    if (roleid == 1) {
      return "Lånetaker";
    } else if (roleid == 2) {
      return "Utstyrsansvarlig";
    } else if (roleid == 3) {
      return "Administrator";
    } else if (roleid == 4) {
      return "Leder";
    }
    return "";
  }

  async presentRoleChangeToast() {
    console.log(this.editUser.roleid);
    const toast = await this.toastController.create({
      message: 'Bruker' + this.editUser.username + ' er redigert! Ny rolle: ' + this.getRole(Number(this.editUser.roleid)),
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async editedUser() {
    this.editUser.roleid = Number(this.editUser.roleid);
    this.accountService.updateUser(this.editUser);
    this.router.navigate(['/home']);

    if (this.checkRoleChange == this.editUser.roleid) {
      this.presentToast();
    } else if (this.checkRoleChange != this.editUser.roleid) {
      this.presentRoleChangeToast();
    }
  }
}
