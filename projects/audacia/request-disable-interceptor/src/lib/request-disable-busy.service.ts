import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class RequestDisableBusyService {
  // Observable navItem source
  private _busySource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  busy$ = this._busySource.asObservable();

  setBusySource(val: boolean) {
    this._busySource.next(val);
  }
}
