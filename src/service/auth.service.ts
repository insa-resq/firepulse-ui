import { Injectable } from '@angular/core';
import {BehaviorSubject, switchMap, tap} from 'rxjs';
import {UserService} from './user.service';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = new URL('accounts-service', environment.apiUrl).toString().replace(/\/+$/, '');
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private userService : UserService, private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(
        `${this.baseUrl}/auth/login`,
        { email, password }
      )
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        }),

        switchMap(() => this.userService.getCurrentUser()),

        tap(() => this.loggedIn.next(true))
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.userService.clearUser();
    this.loggedIn.next(false);
  }
}
