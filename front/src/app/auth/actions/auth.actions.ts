import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export enum AuthActionTypes {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  LoginRedirect = '[Auth] Login Redirect',
  Signup = '[Auth] Signup',
  SignupSuccess = '[Auth] Signup Success',
  SignupFailure = '[Auth] Signup Failure',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;
  constructor(public payload: any) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class Signup implements Action {
  readonly type = AuthActionTypes.Signup;

  constructor(public payload: Authenticate) {}
}

export class SignupSuccess implements Action {
  readonly type = AuthActionTypes.SignupSuccess;
}

export class SignupFailure implements Action {
  readonly type = AuthActionTypes.SignupFailure;
  constructor(public payload: any) {}
}

export type AuthActionsUnion =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout
  | Signup
  | SignupSuccess
  | SignupFailure;
