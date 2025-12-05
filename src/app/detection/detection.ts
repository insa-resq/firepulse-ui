import { Component, Input, OnInit } from '@angular/core';
import { DetectionService } from './detection.service';
import { Alerts } from "./alerts/alerts";
import { Map } from "./map/map";
import { Alert } from './alert';

@Component({
  selector: 'app-detection',
  templateUrl: './detection.html',
  styleUrls: ['./detection.css'],
  imports: [Alerts, Map],
  standalone: true
})
export class DetectionComponent implements OnInit {
  @Input() alerts: Alert[] = [];

  constructor(private detectionService: DetectionService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.detectionService.getAlerts().subscribe(data => {
      this.alerts = data;
    });
  }

  onStatusChanged() {
    this.loadAlerts();
  }
}
