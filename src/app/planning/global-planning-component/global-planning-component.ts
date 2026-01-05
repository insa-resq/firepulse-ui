import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TabletComponent} from '../../tablet/tablet';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-global-planning-component',
  imports: [
    TabletComponent, NgClass
  ],
  templateUrl: './global-planning-component.html',
  styleUrl: './global-planning-component.css',
  standalone: true
})
export class GlobalPlanningComponent {
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  firefighters = [
    { name: 'Dupont' },
    { name: 'Martin' },
    { name: 'Bernard' }
  ];

  @Input() nbWeek!: number;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  availability = [
    { week: 50, firefighter: 'Dupont', day: 'Lundi', status: 'available' },
    { week: 50, firefighter: 'Dupont', day: 'Samedi', status: 'on-call' },
    { week: 50, firefighter: 'Martin', day: 'Mardi', status: 'unavailable' },
    { week: 50, firefighter: 'Bernard', day: 'Dimanche', status: 'available' },

    { week: 51, firefighter: 'Dupont', day: 'Lundi', status: 'unavailable' },
    { week: 51, firefighter: 'Martin', day: 'Vendredi', status: 'on-call' }
  ];


  getAvailibility(pompier: string, jour: string): string {
    const dispo = this.availability.find(
      d => d.week === this.nbWeek &&
        d.firefighter === pompier &&
        d.day === jour
    );

    return dispo ? dispo.status : '';
  }


}
