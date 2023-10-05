import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsOnlineService {

  constructor() {

    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.isOnline = true;
      this.isOnlineSubject.next(this.isOnline);
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.isOnline = false;
      this.isOnlineSubject.next(this.isOnline);
    }));

  }


  onlineEvent!: Observable<Event>;
  offlineEvent!: Observable<Event>;
  subscriptions: Subscription[] = [];

  isOnline: boolean = navigator.onLine;
  isOnlineSubject = new BehaviorSubject<boolean>(this.isOnline);
}
