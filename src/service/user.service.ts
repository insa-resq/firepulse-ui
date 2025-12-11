import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {}

  setUser(user: UserModel) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  get currentUser(): UserModel | null {
    return this.userSubject.value;
  }

  hasRight(right: string): boolean {
    return this.userSubject.value?.rights.includes(right) ?? false;
  }


}
