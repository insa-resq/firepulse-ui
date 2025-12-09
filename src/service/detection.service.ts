import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private api = 'http://localhost:3000/alerts';

  constructor(private http: HttpClient) {}

  getAlerts() {
    return this.http.get<any[]>(this.api);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.api}/${id}`, { status });
  }
}