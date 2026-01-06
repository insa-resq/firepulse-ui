import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlanningService {

  private readonly baseUrlPlanning = new URL('planning-service', environment.apiUrl).toString().replace(/\/+$/, '');
  private readonly baseUrlRegistry = new URL('registry-service', environment.apiUrl).toString().replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('token');



  getPlanning(week: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<any[]>(`${this.baseUrlPlanning}`, { headers });
  }

  getInventory(stationId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<any[]>(`${this.baseUrlRegistry}/vehicles?stationId=${stationId}`, { headers });
  }
}
