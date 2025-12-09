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

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  dateActuelle = new Date();
  numeroSemaine!: number;

  disponibilites = [
    { semaine: 50, jour: 'Lundi', statut: 'dispo' },
    { semaine: 50, jour: 'Mardi', statut: 'astreinte' },
    { semaine: 50, jour: 'Mercredi', statut: 'dispo' },
    { semaine: 50, jour: 'Jeudi', statut: 'indispo' },
    { semaine: 50, jour: 'Vendredi', statut: 'dispo' },
    { semaine: 50, jour: 'Samedi', statut: 'astreinte' },
    { semaine: 50, jour: 'Dimanche', statut: 'indispo' },

    { semaine: 51, jour: 'Lundi', statut: 'indispo' },
    { semaine: 51, jour: 'Vendredi', statut: 'astreinte' },
  ];

  ngOnInit() {
    this.updateNumeroSemaine();
  }

  updateNumeroSemaine() {
    const date = new Date(this.dateActuelle);
    const debutAnnee = new Date(date.getFullYear(), 0, 1);
    const diff = Math.floor(
      (date.getTime() - debutAnnee.getTime()) / 86400000
    );
    this.numeroSemaine = Math.ceil((diff + debutAnnee.getDay() + 1) / 7);
  }

  semainePrecedente() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() - 7);
    this.updateNumeroSemaine();
  }

  semaineSuivante() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() + 7);
    this.updateNumeroSemaine();
  }

  getStatut(jour: string): string {
    const dispo = this.disponibilites.find(
      d => d.semaine === this.numeroSemaine && d.jour === jour
    );
    return dispo ? dispo.statut : '';
  }


}
