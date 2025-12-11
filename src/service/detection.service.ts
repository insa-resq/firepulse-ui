import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Alert } from '../app/detection/alert';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private readonly baseUrl = new URL('detection-service', environment.apiUrl).toString();
  
  constructor(private http: HttpClient) {}

  getAlerts() {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts`);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, { status });
  }
}
