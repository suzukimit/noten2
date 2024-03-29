import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import * as fromAuth from '../reducers/index';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromAuth.State>,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.authService.getToken()) {
      this.store.dispatch(new AuthActions.LoginRedirect());
      return false;
    }
    return true;
  }

  // canActivate(): Observable<boolean> {
  //   return this.store.pipe(
  //     select(fromAuth.getLoggedIn),
  //     map(authed => {
  //       if (!authed) {
  //         this.store.dispatch(new AuthActions.LoginRedirect());
  //         return false;
  //       }
  //
  //       return true;
  //     }),
  //     take(1)
  //   );
  // }
}
