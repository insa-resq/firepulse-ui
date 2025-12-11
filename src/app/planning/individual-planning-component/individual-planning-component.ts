import {Component, OnInit} from '@angular/core';
import {TabletComponent} from '../../tablet/tablet';

@Component({
  selector: 'app-individual-planning-component',
  imports: [
    TabletComponent
  ],
  templateUrl: './individual-planning-component.html',
  styleUrl: './individual-planning-component.css',
})
export class IndividualPlanningComponent implements OnInit{

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  currentDate = new Date();
  nbWeek!: number;

  avaibility = [
    { week: 50, day: 'Lundi', status: 'available' },
    { week: 50, day: 'Mardi', status: 'on-call' },
    { week: 50, day: 'Mercredi', status: 'available' },
    { week: 50, day: 'Jeudi', status: 'unavailable' },
    { week: 50, day: 'Vendredi', status: 'available' },
    { week: 50, day: 'Samedi', status: 'on-call' },
    { week: 50, day: 'Dimanche', status: 'unavailable' },

    { week: 51, day: 'Lundi', status: 'unavailable' },
    { week: 51, day: 'Vendredi', status: 'on-call' },
  ];

  ngOnInit() {
    this.updateNbWeek();
  }

  updateNbWeek() {
    const date = new Date(this.currentDate);
    const startYear = new Date(date.getFullYear(), 0, 1);
    const diff = Math.floor(
      (date.getTime() - startYear.getTime()) / 86400000
    );
    this.nbWeek = Math.ceil((diff + startYear.getDay() + 1) / 7);
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateNbWeek();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateNbWeek();
  }

  getStatus(day: string): string {
    const available = this.avaibility.find(
      d => d.week === this.nbWeek && d.day === day
    );
    return available ? available.status : '';
  }


}
