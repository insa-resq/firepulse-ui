import { Component } from '@angular/core';
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
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  pompiers = [
    { nom: 'Dupont' },
    { nom: 'Martin' },
    { nom: 'Bernard' }
  ];

  dateActuelle = new Date();
  numeroSemaine!: number;

  disponibilites = [
    { semaine: 50, pompier: 'Dupont', jour: 'Lundi', statut: 'dispo' },
    { semaine: 50, pompier: 'Dupont', jour: 'Samedi', statut: 'astreinte' },
    { semaine: 50, pompier: 'Martin', jour: 'Mardi', statut: 'indispo' },
    { semaine: 50, pompier: 'Bernard', jour: 'Dimanche', statut: 'dispo' },

    { semaine: 51, pompier: 'Dupont', jour: 'Lundi', statut: 'indispo' },
    { semaine: 51, pompier: 'Martin', jour: 'Vendredi', statut: 'astreinte' }
  ];

  ngOnInit() {
    this.updateNumeroSemaine();
  }

  updateNumeroSemaine() {
    const date = new Date(this.dateActuelle);
    const debutAnnee = new Date(date.getFullYear(), 0, 1);
    const jours = Math.floor((date.getTime() - debutAnnee.getTime()) / 86400000);
    this.numeroSemaine = Math.ceil((jours + debutAnnee.getDay() + 1) / 7);
  }

  semainePrecedente() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() - 7);
    this.updateNumeroSemaine();
  }

  semaineSuivante() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() + 7);
    this.updateNumeroSemaine();
  }

  getDispo(pompier: string, jour: string): string {
    const dispo = this.disponibilites.find(
      d => d.semaine === this.numeroSemaine &&
        d.pompier === pompier &&
        d.jour === jour
    );

    return dispo ? dispo.statut : '';
  }


}
