import { Component, OnInit } from '@angular/core';
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
    console.log('Alert selected:', alert.id); // debug
    this.selectedAlertId = alert.id;
    console.log('selectedAlertId set to:', this.selectedAlertId); // debug
  }
}
