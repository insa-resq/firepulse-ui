import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DetectionService } from '../../../service/detection.service';
import { DatePipe } from '@angular/common';
import { Alert } from '../../../model/alert.model';

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
  @ViewChild('alertsContainer') alertsContainer?: ElementRef<HTMLDivElement>;

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
    this.alertSelected.emit(alert);
  }

  scrollToAlert(alertId: number) {
    if (!this.alertsContainer) return;

    const alertElement = this.alertsContainer.nativeElement.querySelector(
      `.alert-card[data-alert-id="${alertId}"]`
    );

    if (alertElement) {
      alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'NEW':
        return 'Nouveau';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'RESOLVED':
        return 'Résolu';
      case 'DISMISSED':
        return 'Ignoré';
      default:
        return status;
    }
  }

  translateSeverity(severity: string): string {
    switch (severity) {
      case 'LOW':
        return 'Faible';
      case 'MEDIUM':
        return 'Moyenne';
      case 'HIGH':
        return 'Élevée';
      case 'CRITICAL':
        return 'Critique';
      default:
        return severity;
    }
  }
}
