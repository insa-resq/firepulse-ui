import { Component, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Alert } from '../../../model/alert.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true,
  imports: [],
})
export class Map implements AfterViewInit, OnChanges {
  @Input() alerts: Alert[] = [];
  @Input() selectedAlertId?: number;
  @Output() alertSelected = new EventEmitter<Alert>();

  @Input() station?: { latitude: number; longitude: number; name?: string };

  // Leaflet objects kept as any to avoid top-level access during SSR
  private map!: L.Map;
  markersLayer: any;
  markersById = new globalThis.Map<number, any>();

  stationLayer: any;
  stationMarker?: any;

  // Garder async pour pouvoir await import()
  async ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('alert-map', { maxBoundsViscosity: 0.8 });
    this.map.setView([46.2, 2.2], 6);
    L.tileLayer(baseMapURl, {
      maxZoom: 19,
    }).addTo(this.map);

    this.markersLayer = L.layerGroup();
    this.markersLayer.addTo(this.map);

    this.stationLayer = L.layerGroup();
    this.stationLayer.addTo(this.map);

    this.plotMarkers();
    this.plotStation();
  }

  ngOnChanges() {
    if (this.map) {
      this.plotMarkers();
      this.focusSelected();
      this.plotStation();
    }
  }

  plotMarkers() {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();
    this.markersById.clear();

    this.alerts.forEach((a) => {
      const color = this.getColorByStatus(a.status);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([a.latitude, a.longitude], { icon: customIcon })
        .bindPopup(`<b>${a.description}</b><br>Status : ${this.translateStatus(a.status)}`)
        .on('click', () => {
          this.alertSelected.emit(a);
        })
        .addTo(this.markersLayer);

      this.markersById.set(a.id, marker);
    });
  }

  plotStation() {
    if (!this.station || !this.stationLayer) return;

    this.stationLayer.clearLayers();

    const stationIcon = L.divIcon({
      className: 'station-marker',
      html: `
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="home"
          width="20px"
          height="20px"
          fill="#898d90ff"
          aria-hidden="true">
          <path d="M946.5 505L560.1 118.8c-25.9-25.9-68.3-25.9-94.2 0L79.5 505c-12.5 12.5-3.7 33.9 14 33.9H160v320c0 17.7 14.3 32 32 32h192V704h256v186h192c17.7 0 32-14.3 32-32V538.9h66.5c17.7 0 26.5-21.4 14-33.9z"/>
        </svg>
    `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    this.stationMarker = L.marker([this.station.latitude, this.station.longitude], {
      icon: stationIcon,
    })
      .bindPopup(`<b>Station</b><br>${this.station.name ?? ''}`)
      .addTo(this.stationLayer);
  }

  private focusSelected() {
    if (!this.selectedAlertId) return;
    const marker = this.markersById.get(this.selectedAlertId);
    if (marker) {
      marker.openPopup();
      this.map.setView(marker.getLatLng(), Math.max(this.map.getZoom(), 9), { animate: true });
    }
  }

  // Helper : couleur selon status
  getColorByStatus(status: string): string {
    const statusColors: { [key: string]: string } = {
      NEW: 'var(--color-legend-new)', // rouge
      IN_PROGRESS: 'var(--color-legend-in-progress)', // orange
      RESOLVED: 'var(--color-legend-resolved)', // vert
      DISMISSED: 'var(--color-legend-dismissed)', // gris
    };
    return statusColors[status] || '#2196f3'; // bleu par défaut
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
}
