import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { StationModel } from '../model/station.model';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private readonly baseUrl = new URL('registry-service', environment.apiUrl).toString().replace(/\/+$/, '');

  constructor(private http: HttpClient) { }

  getStations() {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<StationModel[]>(`${this.baseUrl}/fire-stations`, {headers});
  }


  deleteStation(id: string) {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/fire-stations/${id}`, {headers});
  }


  getStationById(id: string) {
    const token = localStorage.getItem('token'); // Récupération du token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<StationModel>(`${this.baseUrl}/fire-stations/${id}`, {headers});
  }
}
