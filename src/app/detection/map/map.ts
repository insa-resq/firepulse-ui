import { Component, Input, AfterViewInit, OnChanges } from '@angular/core';
import { Alert } from '../alert';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnChanges {
  @Input() alerts: Alert[] = [];

  // Leaflet objects kept as any to avoid top-level access during SSR
  L: any;
  map: any;
  markersLayer: any;

  // Garder async pour pouvoir await import()
  async ngAfterViewInit() {
    // Eviter l'exécution côté serveur
    if (typeof window === 'undefined') return;

    // Import dynamique de Leaflet uniquement côté client
    this.L = await import('leaflet');

    // Initialisations Leaflet
    this.map = this.L.map('alert-map').setView([46.8, 2.2], 6);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = this.L.layerGroup();
    this.markersLayer.addTo(this.map);

    this.plotMarkers();
  }

  ngOnChanges() {
    if (this.map) {
      this.plotMarkers();
    }
  }

  plotMarkers() {
    if (!this.markersLayer || !this.L) return;

    this.markersLayer.clearLayers();

    this.alerts.forEach(a => {
      this.L.marker([a.latitude, a.longitude])
        .bindPopup(`<b>${a.description}</b><br>Status : ${a.status}`)
        .addTo(this.markersLayer);
    });
  }
}