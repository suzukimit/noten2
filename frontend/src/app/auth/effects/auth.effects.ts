import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import {
  AuthActionTypes,
  Login,
  LoginFailure,
  LoginSuccess, Signup, SignupFailure, SignupSuccess,
} from '../actions/auth.actions';
import { Authenticate } from '../models/user';
import { AuthService } from '../services/auth.service';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    map(action => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.authService
        .login(auth)
        .pipe(
          map(user => {
            return new LoginSuccess({
              user: {
                name: '',
                token: user.body.value
              }
            })
          }),
          catchError(error => {
            return of(new LoginFailure(error))
          })
        )
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    tap((user: any) => {
      this.authService.setToken(user.payload.user.token);
      this.router.navigate(['/home'])
    })
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginRedirect),
    tap(authed => {
      this.router.navigate(['/login']);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    tap((authed) => {
      this.authService.logout().subscribe(() => {
        this.authService.removeToken();
        this.router.navigate(['/']);
      });
    })
  );

  @Effect()
  signup$ = this.actions$.pipe(
    ofType<Signup>(AuthActionTypes.Signup),
    map(action => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.authService
        .signup(auth)
        .pipe(
          map(user => new SignupSuccess()),
          catchError(error => of(new SignupFailure(error)))
        )
    )
  );

  @Effect({ dispatch: false })
  signupSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.SignupSuccess),
    tap(() => {
      this.router.navigate(['/home'])
    })
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}
