import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private reloadTrigger = new BehaviorSubject<boolean>(false);
  reload$ = this.reloadTrigger.asObservable();

  triggerReload() {
    this.reloadTrigger.next(true);
  }

  resetReload() {
    this.reloadTrigger.next(false);
  }
}