import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private readonly baseUrl = new URL('registry-service', environment.apiUrl).toString().replace(/\/+$/, '');
  
  constructor(private http: HttpClient) { }

  getStationById(id: string) {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{}>(`${this.baseUrl}/fire-stations/${id}`, { headers });
  }
}