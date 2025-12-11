import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private userService : UserService) {
  }
  login() {
    this.loggedIn.next(true);
    this.userService.setUser({
      id: 1,
      username: 'Paul Lemeilleur',
      email: 'polypol@lebest.pol',
      rights: ['GLOBAL_PLANNING'],
      role: 'Adj'
    });
  }

  logout() {
    this.loggedIn.next(false);
  }

  toggleAuth() {
    this.loggedIn.next(!this.loggedIn.value);
  }
}
