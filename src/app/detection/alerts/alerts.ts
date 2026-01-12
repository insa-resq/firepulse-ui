import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DetectionService } from '../../../service/detection.service';
import { DatePipe } from '@angular/common';
import { Alert } from '../../../model/alert.model';
import { SeverityPipe } from '../../../pipe/severity.pipe';
import { StatusPipe } from '../../../pipe/status.pipe';

@Component({
  selector: 'app-alerts',
  imports: [DatePipe, SeverityPipe, StatusPipe],
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


  viewImage(imageId: string) {
    this.detectionService.getImage(imageId).subscribe((image) => {
      window.open(image.url, '_blank');
    });
  }

}
