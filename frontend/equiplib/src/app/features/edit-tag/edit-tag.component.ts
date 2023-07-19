import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {CustomHttpClient} from 'src/app/helpers/auth/http-client';
import {Tag} from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipment.service';
import {AccountService} from 'src/app/services/user.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss'],
})
export class EditTagComponent implements OnInit {

  public newTag = this.equipmentService.editTag ?? new Tag();
  public presetcolors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'] //TODO find high-quality colors

  constructor(
    public router: Router,
    public toastController: ToastController,
    private http: CustomHttpClient,
    private accountService: AccountService,
    private equipmentService: EquipmentService
  ) { }

  ngOnInit() {}

  onSubmit()
  {
    this.equipmentService.patchTag(this.newTag).subscribe(
      {next: (val) => {
        this.presentToast()
        this.router.navigate(['/manageorganization']);
      },
      error: (err) => {
        console.error(err)
      }
    }
    )
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `tag er oppdatert`,
      duration: 3000,
      position: 'top',
      animated: true,
    });
    await toast.present();
  }
}
