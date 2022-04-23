import { OnDestroy, OnInit, Directive } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
@Directive()
export abstract class AbstractComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  ngOnInit() {}
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
