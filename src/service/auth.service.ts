import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';

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
}
