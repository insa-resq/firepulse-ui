import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {}

  setUser(user: User) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  hasRight(right: string): boolean {
    return this.userSubject.value?.rights.includes(right) ?? false;
  }
}
