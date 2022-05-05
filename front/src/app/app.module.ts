import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {Welcome} from './welcome/welcome.component';
import {Home} from './home/home.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PhrasesComponent} from './phrase/components/phrases/phrases.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PhraseService} from './phrase/services/phrase.service';
import {PhraseComponent} from './phrase/components/phrase/phrase.component';
import {AbstractService} from './common/abstract.service';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {PhraseEffects} from './phrase/effects/phrase.effect';
import {phraseReducer} from './phrase/reducers/phrase.reducer';
import {notebookReducer} from './notebook/reducers/notebook.reducer';
import {NotebookEffects} from './notebook/effects/notebook.effect';
import {NotebookService} from './notebook/services/notebook.service';
import {Login} from './auth/components/login/login.component';
import {routerReducer, StoreRouterConnectingModule, DefaultRouterStateSerializer} from '@ngrx/router-store';
import {AuthGuard} from './auth/services/auth-guard.service';
import {AuthService} from './auth/services/auth.service';
import {reducers} from './auth/reducers/index';
import {AuthEffects} from './auth/effects/auth.effects';
import {NotebooksComponent} from './notebook/components/notebooks/notebooks.component';
import {HttpErrorInterceptor} from './common/http.error.interceptor';
import {SignupComponent} from './auth/components/signup/signup.component';
import {FormGroupComponent} from './common/form-group/form.group.component';
import {TokenInterceptor} from './common/token.interceptor';
import * as fromFindPhrase from './phrase/reducers/find-phrase.reducer';
import {FindPhraseEffects} from './phrase/effects/find-phrase.effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from './common/modal/modal.component';
import { ToastComponent } from './common/toast/component/toast.component';
import { SettingComponent } from './setting/setting.component';
import { UserInfoComponent } from './setting/user-info/user-info.component';
import { OthersComponent } from './setting/others/others.component';


@NgModule({
  declarations: [
    AppComponent,
    Welcome,
    Home,
    PhraseComponent,
    PhrasesComponent,
    NotebooksComponent,
    Login,
    SignupComponent,
    FormGroupComponent,
    ToastComponent,
    SettingComponent,
    UserInfoComponent,
    OthersComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    StoreModule.forRoot({
      phrase: phraseReducer,
      findPhrase: fromFindPhrase.reducer,
      notebook: notebookReducer,
      router: routerReducer,
    }, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    StoreModule.forFeature(
      'auth', reducers
    ),
    EffectsModule.forRoot([
      PhraseEffects,
      FindPhraseEffects,
      NotebookEffects,
    ]),
    EffectsModule.forFeature([
      AuthEffects,
    ]),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer,
      stateKey: 'router',
    }),
    FontAwesomeModule,

  ],
  providers: [
    AbstractService,
    PhraseService,
    NotebookService,
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  entryComponents: [
    NotebooksComponent,
    ModalComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
