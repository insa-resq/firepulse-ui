import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private readonly baseUrlPlanning = new URL('planning-service', environment.apiUrl)
    .toString()
    .replace(/\/+$/, '');
  private readonly baseUrlRegistry = new URL('registry-service', environment.apiUrl)
    .toString()
    .replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('token');

  getPlanningByStationId(stationId: string, week: number, year: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<any[]>(
      `${this.baseUrlPlanning}/plannings?stationId=${stationId}&weekNumber=${week}&year=${year}`,
      { headers }
    );
  }

  generatePlanningForWeek(stationId: string, week: number, year: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${this.baseUrlPlanning}/plannings`,
      { stationId, weekNumber: week, year },
      { headers }
    );
  }

  regeneratePlanning(planningId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${this.baseUrlPlanning}/plannings/${planningId}/regenerate`,
      {},
      { headers }
    );
  }

  getPlanningStatus(planningId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .get<any>(`${this.baseUrlPlanning}/plannings/${planningId}`, { headers })
      .pipe(map((response) => response.status));
  }

  getInventory(stationId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<any[]>(`${this.baseUrlRegistry}/vehicles?stationId=${stationId}`, {
      headers,
    });
  }

  getShiftAssignmentsForIndividual(firefighterId: string, planningId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<any[]>(
      `${this.baseUrlPlanning}/shift-assignments?firefighterId=${firefighterId}&planningId=${planningId}`,
      { headers }
    );
  }
}
