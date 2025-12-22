import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { Alert } from '../model/alert.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private readonly baseUrl = new URL('detection-service', environment.apiUrl).toString().replace(/\/+$/, '');
  
  constructor(private http: HttpClient) {}

  getAlerts() {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<Alert[]>(`${this.baseUrl}/fire-alerts`, { headers });
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, { status });
  }
}
