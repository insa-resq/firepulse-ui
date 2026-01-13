import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TabletComponent } from '../../tablet/tablet';
import { AsyncPipe, NgClass } from '@angular/common';
import { interval, Observable, switchMap, takeWhile } from 'rxjs';
import { InventoryItem } from '../../../model/inventoryItem.model';
import { VehicleTypeLabelPipe } from '../../../pipe/vehicule-type-label.pipe';
import { PlanningService } from '../../../service/planning.service';
import { PlanningComponent } from '../planning';
import { UserService } from '../../../service/user.service';
import { PlanningModalComponent } from '../planning-modal/planning-modal';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-global-planning-component',
  imports: [TabletComponent, NgClass, VehicleTypeLabelPipe, AsyncPipe, MatDialogModule],
  templateUrl: './global-planning-component.html',
  styleUrl: './global-planning-component.css',
  standalone: true,
})
export class GlobalPlanningComponent implements OnInit {
  private year = new Date().getFullYear();
  private stationId: string = '';
  private planningId: string = '';

  isLoadingGenerate = false;

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  firefighters = [{ name: 'Dupont' }, { name: 'Martin' }, { name: 'Bernard' }];

  @Input() nbWeek!: number;
  @Input() inventory!: Observable<InventoryItem[]>;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  availability = [
    { week: 50, firefighter: 'Dupont', day: 'Lundi', status: 'available' },
    { week: 50, firefighter: 'Dupont', day: 'Samedi', status: 'on-call' },
    { week: 50, firefighter: 'Martin', day: 'Mardi', status: 'unavailable' },
    { week: 50, firefighter: 'Bernard', day: 'Dimanche', status: 'available' },

    { week: 51, firefighter: 'Dupont', day: 'Lundi', status: 'unavailable' },
    { week: 51, firefighter: 'Martin', day: 'Vendredi', status: 'on-call' },
  ];

  constructor(
    private planningService: PlanningService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stationId = this.userService.getUserStationId();
    this.planningService
      .getPlanningByStationId(this.stationId, this.nbWeek, this.year)
      .subscribe((planning) => {
        this.planningId = planning.length > 0 ? planning[0].id : '';
      });
  }

  getAvailibility(pompier: string, jour: string): string {
    const dispo = this.availability.find(
      (d) => d.week === this.nbWeek && d.firefighter === pompier && d.day === jour
    );

    return dispo ? dispo.status : '';
  }

  generatePlanning() {
    this.isLoadingGenerate = true;

    const request$ = this.planningId
      ? this.planningService.regeneratePlanning(this.planningId)
      : this.planningService.generatePlanningForWeek(this.stationId, this.nbWeek, this.year);

    request$.subscribe({
      next: (planning: any) => {
        const planningId = planning.id;
        this.pollPlanningStatus(planningId);
      },
      error: () => {
        this.dialog.open(PlanningModalComponent, {
          data: {
            success: false,
            message: this.planningId
              ? 'Une erreur est survenue lors de la régénération du planning.'
              : 'Une erreur est survenue lors de la génération du planning.',
          },
        });
        this.isLoadingGenerate = false;
      },
    });
  }

  pollPlanningStatus(planningId: string) {
    const polling$ = interval(3000).pipe(
      switchMap(() => this.planningService.getPlanningStatus(planningId)),
      takeWhile((status: any) => status !== 'FINALIZED', true)
    );

    polling$.subscribe({
      next: (status: any) => {
        if (status === 'FINALIZED') {
          this.dialog.open(PlanningModalComponent, {
            data: {
              success: true,
              message: 'Le planning a bien été généré.',
            },
          });
          this.isLoadingGenerate = false;
        }
      },
      error: () => {
        this.dialog.open(PlanningModalComponent, {
          data: {
            success: false,
            message: 'Erreur lors de la vérification du status du planning.',
          },
        });
        this.isLoadingGenerate = false;
      },
    });
  }
}
