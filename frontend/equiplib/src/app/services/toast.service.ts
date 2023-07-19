import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(
        private toastController: ToastController,
    ) { }

    public async makeToast(context: string, duration: number = 4000) {
      return await this.toastController.create({
        message: context,
        duration: duration,
        position: 'bottom'
      });
    }

    public async presentToast(context: string, duration: number = 4000) {
      const toast = await this.makeToast(context, duration)
      await toast.present();
    }

}
