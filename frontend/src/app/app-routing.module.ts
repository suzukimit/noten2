import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Welcome} from './welcome/welcome.component';
import {Home} from './home/home.component';
import {PhraseComponent} from './phrase/components/phrase/phrase.component';
import {Login} from './auth/components/login/login.component';
import {AuthGuard} from './auth/services/auth-guard.service';
import {SignupComponent} from './auth/components/signup/signup.component';
import { SettingComponent } from './setting/setting.component';
import {OthersComponent} from './setting/others/others.component';
import {UserInfoComponent} from './setting/user-info/user-info.component';

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
    path: 'settings',
    component: SettingComponent,
    children: [
      {
        path: '', redirectTo: 'info', pathMatch: 'full'
      },
      {
        path: 'info', component: UserInfoComponent
      },
      {
        path: 'others', component: OthersComponent
      }
    ],
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
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
