import { Component, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Alert } from '../../../model/alert.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true
})
export class Map implements AfterViewInit, OnChanges {
  @Input() alerts: Alert[] = [];
  @Input() selectedAlertId?: number;
  @Output() alertSelected = new EventEmitter<Alert>();

  // Leaflet objects kept as any to avoid top-level access during SSR
  private map!: L.Map
  markersLayer: any;
  markersById = new globalThis.Map<number, any>();

  // Garder async pour pouvoir await import()
  async ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('alert-map', { maxBounds: [[41, -5], [51.5, 9]], maxBoundsViscosity: 1.0 });
    this.map.setView([46.8, 2.2], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup();
    this.markersLayer.addTo(this.map);

    this.plotMarkers();
  }

  ngOnChanges() {
    if (this.map) {
      this.plotMarkers();
      this.focusSelected();
    }
  }

  plotMarkers() {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();
    this.markersById.clear();

    this.alerts.forEach(a => {
      const color = this.getColorByStatus(a.status);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([a.latitude, a.longitude], { icon: customIcon })
        .bindPopup(`<b>${a.description}</b><br>Status : ${a.status}`)
        .on('click', () => {
          this.alertSelected.emit(a)})
        .addTo(this.markersLayer);
      
      this.markersById.set(a.id, marker);
    });
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
      'NEW': '#ff4444',        // rouge
      'IN_PROGRESS': '#ff9800', // orange
      'RESOLVED': '#4caf50',   // vert
      'DISMISSED': '#9e9e9e'      // gris
    };
    return statusColors[status] || '#2196f3'; // bleu par défaut
  }
}
