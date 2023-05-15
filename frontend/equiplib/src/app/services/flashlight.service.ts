import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FlashlightService {
  isFlashlightOn: boolean = false;
  isCompatible: boolean = false;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.isCompatible = true;
        this.toggleFlashlight(false);
      }
    });
  }

  toggleFlashlight(turnOn: boolean) {
    if (this.platform.is('cordova')) {
      const flashlight = (<any>window).cordova.plugins.flashlight;

      if (turnOn && !this.isFlashlightOn) {
        flashlight.switchOn();
        this.isFlashlightOn = true;
      } else if (!turnOn && this.isFlashlightOn) {
        flashlight.switchOff();
        this.isFlashlightOn = false;
      }
    }
  }
}
