import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlanningService {

  private readonly baseUrl = new URL('planning-service', environment.apiUrl).toString().replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  getPlanning(week: number) {
    return this.http.get<any[]>(`${this.baseUrl}?week=${week}`);
  }
}
