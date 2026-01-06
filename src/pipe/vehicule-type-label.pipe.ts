import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleTypeLabel',
  standalone: true
})
export class VehicleTypeLabelPipe implements PipeTransform {

  transform(type: string): string {
    const labels: Record<string, string> = {
      LARGE_TRUCK: 'Camion citerne',
      MEDIUM_TRUCK: 'Grande échelle',
      SMALL_TRUCK: `Véhicule d'intervention`,
      CANADAIR: 'Canadair',
      AMBULANCE: 'Ambulance',
      HELICOPTER: 'Hélicoptère',
      SMALL_BOAT: 'Petit bateau',
      LARGE_BOAT: 'Gros bateau'
    };

    return labels[type] ?? type;
  }
}
