import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DayPipe',
  standalone: true,
})
export class DayPipe implements PipeTransform {
  transform(day: string): string {
    const labels: Record<string, string> = {
      Monday: 'Lundi',
      Tuesday: 'Mardi',
      Wednesday: 'Mercredi',
      Thursday: 'Jeudi',
      Friday: 'Vendredi',
      Saturday: 'Samedi',
      Sunday: 'Dimanche',
    };

    return labels[day] ?? day;
  }
}
