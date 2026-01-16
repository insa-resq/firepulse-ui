import { Component, OnInit, ViewChild } from '@angular/core';
import { Alerts } from './alerts/alerts';
import { Map } from './map/map';
import { DetectionService } from '../../service/detection.service';
import { Alert } from '../../model/alert.model';
import { RegistryService } from '../../service/registry.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-detection',
  imports: [Alerts, Map],
  templateUrl: './detection.html',
  styleUrls: ['./detection.css'],
  standalone: true,
})
export class DetectionComponent implements OnInit {
  alerts: Alert[] = [];
  selectedAlertId?: number;
  @ViewChild(Alerts) alertsComponent?: Alerts;

  station?: { latitude: number; longitude: number; name?: string };

  constructor(
    private detectionService: DetectionService,
    private userService: UserService,
    private registryService: RegistryService
  ) {}

  ngOnInit() {
    this.detectionService.getAlerts().subscribe((data) => {
      this.alerts = data;
    });
    const stationId = this.userService.getUserStationId();
    this.registryService.getStationById(stationId).subscribe((station) => {
      this.station = {
        latitude: station.latitude,
        longitude: station.longitude,
        name: station.name,
      };
    });
  }

  onStatusChanged() {
    this.detectionService.getAlerts().subscribe((data) => {
      this.alerts = data;
    });
  }

  onAlertSelected(alert: Alert) {
    this.selectedAlertId = alert.id;
    // Scroll l'alerte en vue dans la liste si elle est hors écran
    if (this.alertsComponent) {
      this.alertsComponent.scrollToAlert(alert.id);
    }
  }
}
