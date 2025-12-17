import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserModel} from '../model/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();
  private readonly baseUrl = new URL('accounts-service', environment.apiUrl).toString().replace(/\/+$/, '');

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

  getCurrentUser(): Observable<UserModel> {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserModel>(`${this.baseUrl}/users/me`, { headers })
      .pipe( tap(user => this.setUser(user)));
  }


  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/users`);
  }

  updateEmail(email: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.baseUrl}/users/me`, { email });
  }

  // Update another user's email (admin only)
  updateUserEmail(userId: number, email: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.baseUrl}/users/${userId}`, { email });
  }

  // Update another user's station (admin only)
  updateUserStation(userId: number, stationId: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.baseUrl}/users/${userId}`, { stationId });
  }

  // Delete user (admin only)
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}
