import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DetectionService } from '../../../service/detection.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Alert } from '../alert';

@Component({
  selector: 'app-alerts',
  imports: [DatePipe],
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css'],
  standalone: true
})
export class Alerts {
  @Input() alerts: Alert[] = [];
  @Output() statusUpdated = new EventEmitter<void>();

  constructor(private detectionService: DetectionService) {}

  ngOnInit() {
    // S'assurer que les dates sont des objets Date
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
}
