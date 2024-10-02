import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Authenticate} from '../../models/user';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '../../reducers';
import * as AuthActions from '../../actions/auth.actions';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class Login {
  pending$ = this.store.pipe(select(fromAuth.getLoginPagePending));
  error$ = this.store.pipe(select(fromAuth.getLoginPageError));
  afterSignup$ = this.store.pipe(select(fromAuth.getLoginPageAfterSignup));

  constructor(
    private store: Store<fromAuth.State>
  ) {}

  @Output() submitted = new EventEmitter<Authenticate>();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.store.dispatch(new AuthActions.Login(this.form.value));
    }
  }
}
