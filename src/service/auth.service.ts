import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = new URL('accounts-service', environment.apiUrl).toString().replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(
        `${this.baseUrl}/auth/login`,
        { email, password }
      );
  }

  restoreSession() {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/users/me`, { headers }).pipe(
      catchError(() => {
        localStorage.removeItem('token');
        return of(false);
      })
    );
  }

}
