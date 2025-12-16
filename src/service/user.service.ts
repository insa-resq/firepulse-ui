import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
    return this.userSubject.value?.role.includes(right) ?? false;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }

  // Get all users (admin only)
  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/users`);
  }

  // Update own email
  updateEmail(email: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/users/me`, { email });
  }

  // Update another user's email (admin only)
  updateUserEmail(userId: number, email: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/users/${userId}`, { email });
  }

  // Update another user's station (admin only)
  updateUserStation(userId: number, stationId: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/users/${userId}`, { stationId });
  }

  // Delete user (admin only)
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }
}
