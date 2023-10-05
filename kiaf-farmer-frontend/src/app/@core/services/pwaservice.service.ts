import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
@Injectable()
export class PwaService {
  promptEvent :any;
  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log(event)
      this.promptEvent = event;
    });
    swUpdate.available.subscribe(event => {
      if (confirm('Update PWA')) {
        window.location.reload();
      }
    });
  }
}