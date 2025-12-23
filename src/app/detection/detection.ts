import { Component, OnInit, ViewChild } from '@angular/core';
import { Alerts } from './alerts/alerts';
import { Map } from './map/map';
import { DetectionService } from '../../service/detection.service';
import { Alert } from '../../model/alert.model';

@Component({
  selector: 'app-detection',
  imports: [Alerts, Map],
  templateUrl: './detection.html',
  styleUrls: ['./detection.css'],
  standalone: true
})
export class DetectionComponent implements OnInit {
  alerts: Alert[] = [];
  selectedAlertId?: number;
  @ViewChild(Alerts) alertsComponent?: Alerts;

  constructor(private detectionService: DetectionService) {}

  ngOnInit() {
    this.detectionService.getAlerts().subscribe((data) => {
      this.alerts = data;
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
