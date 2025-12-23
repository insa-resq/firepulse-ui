import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Alert} from '../../../model/alert.model';
import {DetectionService} from '../../../service/detection.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-alert-manager',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './alert-manager.html',
  styleUrl: './alert-manager.css',
})
export class AlertManager {

  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];

  filterSeverity = '';
  filterStatus = '';
  isLoading = true;


  constructor(private detectionService: DetectionService) {
  }
  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.isLoading = true;
    this.detectionService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
      this.filteredAlerts = alerts;
      this.isLoading = false;
    });
  }

  applyFilters() {
    this.filteredAlerts = this.alerts.filter(alert =>
      (!this.filterSeverity || alert.severity === this.filterSeverity) &&
      (!this.filterStatus || alert.status === this.filterStatus)
    );
  }

  resetFilters() {
    this.filterSeverity = '';
    this.filterStatus = '';
    this.filteredAlerts = this.alerts;
  }

  deleteAlert(toDelete: Alert) {
    this.detectionService.deleteAlert(toDelete.id).subscribe(() => {
      this.alerts = this.alerts.filter(alert => alert.id !== toDelete.id);
      this.applyFilters();
    });
  }

}
