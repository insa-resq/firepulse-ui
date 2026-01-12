import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Status',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  transform(status: string): string {
    const labels: Record<string, string> = {
      NEW: 'Nouveau',
      IN_PROGRESS: 'En cours',
      RESOLVED: 'Résolu',
      DISMISSED: 'Ignoré'
    };
    

    return labels[status] ?? status;
  }
}
