import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../common';
import {AbstractComponent} from '../common/abstract.component';
import {AuthService} from '../auth/services/auth.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class Welcome extends AbstractComponent {
  loggedIn = false;
  year = new Date().getFullYear();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    this.loggedIn = this.authService.getToken() !== null;
  }

  login() {
    this.router.navigate([this.loggedIn ? '/home' : '/login']);
  }
}
