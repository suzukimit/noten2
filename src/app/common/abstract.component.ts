import {OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
export abstract class AbstractComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  ngOnInit() {}
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
