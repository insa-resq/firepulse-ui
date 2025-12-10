import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DetectionService } from '../../../service/detection.service';
import { DatePipe } from '@angular/common';
import { Alert } from '../alert';

@Component({
  selector: 'app-alerts',
  imports: [DatePipe],
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css'],
  standalone: true
})
export class Alerts implements OnInit {
  @Input() alerts: Alert[] = [];
  @Input() selectedAlertId?: number;
  @Output() statusUpdated = new EventEmitter<void>();
  @Output() alertSelected = new EventEmitter<Alert>();

  constructor(private detectionService: DetectionService) {}

  ngOnInit() {
    this.alerts = this.alerts.map(alert => ({
      ...alert,
      createdAt: new Date(alert.createdAt),
      updatedAt: new Date(alert.updatedAt)
    }));
  }

  updateStatus(id: number, status: string) {
    this.detectionService.updateStatus(id, status).subscribe(() => {
      this.statusUpdated.emit();
    });
  }

  validateAlert(id: number) {
    this.updateStatus(id, 'Resolved');
  }

  dismissAlert(id: number) {
    this.updateStatus(id, 'DISMISSED');
  }

  selectAlert(alert: Alert) {
    console.log('Alert selected (alerts component):', alert.id); // debug
    this.alertSelected.emit(alert);
    
  }
}
