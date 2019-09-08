import { Injectable } from '@angular/core';

import { Authenticate, User } from '../models/user';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  protected httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    observe: 'response' as 'body',
  };

  constructor(private http: HttpClient) { }

  login({ username, password }: Authenticate): Observable<any> {
    const body = {username: username, password: password};
    return this.http.post<Authenticate>(`${this.baseUrl}/login`, body, this.httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post<Authenticate>(`${this.baseUrl}/logout`, '', this.httpOptions);
  }

  setToken(token: any) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  //TODO userにPOSTしているだけなので、UserServiceが担うべきな気がしなくもない
  signup({ username, password }: Authenticate): Observable<any> {
    const body = { email: username, password: password };
    return this.http.post<Authenticate>(`${this.baseUrl}/signup`, body, this.httpOptions);
  }
}
