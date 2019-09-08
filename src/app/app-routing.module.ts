import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Welcome} from './welcome/welcome.component';
import {Home} from './home/home.component';
import {PhraseComponent} from './phrase/components/phrase/phrase.component';
import {Login} from './auth/components/login/login.component';
import {AuthGuard} from './auth/services/auth-guard.service';
import {SignupComponent} from './auth/components/signup/signup.component';

const appRoutes: Routes = [
  {
    path: '',
    component: Welcome
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'home',
    component: Home,
    children: [
      {
        path: ':id', component: PhraseComponent
      }
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
