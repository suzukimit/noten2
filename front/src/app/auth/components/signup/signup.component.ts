import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '../../reducers';
import {Authenticate} from '../../models/user';
import {FormControl, FormGroup} from '@angular/forms';
import * as AuthActions from '../../actions/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @Output() submitted = new EventEmitter<Authenticate>();
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    passwordConfirm: new FormControl(''),
  });

  constructor(
    private store: Store<fromAuth.State>
  ) {}

  ngOnInit(): void {
  }

  submit() {
    if (this.form.valid) {
      this.store.dispatch(new AuthActions.Signup(this.form.value));
    }
  }
}
