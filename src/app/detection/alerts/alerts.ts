import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DetectionService } from '../detection.service';
import { DatePipe } from '@angular/common';
import { Alert } from '../alert';

@Component({
  selector: 'app-alerts',
  imports: [DatePipe],
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css']
})
export class Alerts {
  @Input() alerts: Alert[] = [];
  @Output() statusUpdated = new EventEmitter<void>();

  constructor(private detectionService: DetectionService) {}

  updateStatus(id: number, status: string) {
    this.detectionService.updateStatus(id, status).subscribe(() => {
      this.statusUpdated.emit();
    });
  }
}