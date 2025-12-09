import { Component, Input, AfterViewInit, OnChanges } from '@angular/core';
import { Alert } from '../alert';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true
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

    // Fix pour les icônes Leaflet avec Vite/Angular
    delete (this.L.Icon.Default.prototype as any)._getIconUrl;
    this.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Initialisations Leaflet
    this.map = this.L.map('alert-map', { maxBounds: [[41, -5], [51.5, 9]], maxBoundsViscosity: 1.0 }).setView([46.8, 2.2], 6);

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
      // Définir la couleur selon le status
      const color = this.getColorByStatus(a.status);
      
      // Créer une icône personnalisée (divIcon avec HTML/CSS)
      const customIcon = this.L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [5, 5],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      this.L.marker([a.latitude, a.longitude], { icon: customIcon })
        .bindPopup(`<b>${a.description}</b><br>Status : ${a.status}`)
        .addTo(this.markersLayer);
    });
  }

  // Helper : couleur selon status
  getColorByStatus(status: string): string {
    const statusColors: { [key: string]: string } = {
      'New': '#ff4444',        // rouge
      'In Progress': '#ff9800', // orange
      'Resolved': '#4caf50',   // vert
      'Dismissed': '#9e9e9e'      // gris
    };
    return statusColors[status] || '#2196f3'; // bleu par défaut
  }
}
