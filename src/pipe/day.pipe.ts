import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DayPipe',
  standalone: true,
})
export class DayPipe implements PipeTransform {
  transform(day: string): string {
    const labels: Record<string, string> = {
      MONDAY: 'Lundi',
      TUESDAY: 'Mardi',
      WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi',
      FRIDAY: 'Vendredi',
      SATURDAY: 'Samedi',
      SUNDAY: 'Dimanche',
    };

    return labels[day] ?? day;
  }
}
