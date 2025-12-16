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
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'polypol@lebest.pol',
      role: 'ADMIN',
      avatarUrl: '',
      stationId: ''
    });
  }

  logout() {
    this.loggedIn.next(false);
  }

  toggleAuth() {
    this.loggedIn.next(!this.loggedIn.value);
  }
}
