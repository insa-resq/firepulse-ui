import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Severity',
  standalone: true
})
export class SeverityPipe implements PipeTransform {

  transform(severity: string): string {
    const labels: Record<string, string> = {
      LOW: 'Faible',
      MEDIUM: 'Moyenne',
      HIGH: 'Élevée',
      CRITICAL: 'Critique'
    };
    

    return labels[severity] ?? severity;
  }
}
