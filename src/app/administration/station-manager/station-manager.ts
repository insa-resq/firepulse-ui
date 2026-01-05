import { Component } from '@angular/core';
import { StationModel } from '../../../model/station.model';
import { RegistryService } from '../../../service/registry.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-station-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './station-manager.html',
  styleUrls: ['../administration.css'],
})
export class StationManager {

  stations: StationModel[] = [];
  filteredStations: StationModel[] = [];

  filterSeverity = '';
  filterStatus = '';
  isLoading = true;
  deletingIds = new Set<string>();

  constructor(private registryService: RegistryService) {
  }
  ngOnInit() {
    this.loadStations();
  }

  loadStations() {
    this.isLoading = true;
    this.registryService.getStations().subscribe((stations: StationModel[]) => {
      this.stations = stations;
      this.filteredStations = stations;
      this.isLoading = false;
    });
  }

  deleteStation(station: StationModel) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la casernes ${station.name} ?`)) {
      return;
    }
    if (this.deletingIds.has(station.id)) {
      return;
    }

    this.deletingIds.add(station.id);
    this.registryService.deleteStation(station.id).subscribe({
      next: () => {
        this.stations = this.stations.filter(s => s.id !== station.id);
        this.filteredStations = this.filteredStations.filter(s => s.id !== station.id);
        this.deletingIds.delete(station.id);
      },
      error: () => {
        this.deletingIds.delete(station.id);
      },
    });
  }
}
