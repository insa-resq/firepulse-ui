import { Component, EventEmitter, Input, type OnDestroy, OnInit, Output } from '@angular/core';
import type { InventoryItem } from '../../../model/inventoryItem.model';
import { TabletComponent } from '../../tablet/tablet';
import { AsyncPipe, NgClass } from '@angular/common';
import { combineLatest, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { VehicleTypeLabelPipe } from '../../../pipe/vehicule-type-label.pipe';
import { PlanningService } from '../../../service/planning.service';
import { UserService } from '../../../service/user.service';
import { PlanningModalComponent } from '../planning-modal/planning-modal';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanningGenerationService } from '../../../service/planning-generation.service';
import { DayPipe } from '../../../pipe/day.pipe';
import { ShiftAssignment } from '../../../model/shift-assignment.model';
import { VehicleInventory } from '../../../model/vehicleInventory.model';

@Component({
  selector: 'app-global-planning-component',
  imports: [TabletComponent, NgClass, VehicleTypeLabelPipe, AsyncPipe, MatDialogModule, DayPipe],
  templateUrl: './global-planning-component.html',
  styleUrl: './global-planning-component.css',
  standalone: true,
})
export class GlobalPlanningComponent implements OnInit, OnDestroy {
  private pollingSub?: Subscription;

  private year = new Date().getFullYear();
  private stationId: string = '';
  private planningId: string = '';

  isLoadingGenerate = false;

  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  shiftsIndex: Record<string, ShiftAssignment> = {};

  firefighters: { name: string; id: string }[] = [];
  inventory$!: Observable<InventoryItem[]>;
  vehicleInventory$!: Observable<VehicleInventory[]>;

  @Input() nbWeek!: number;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  
  constructor(
    private planningService: PlanningService,
    private userService: UserService,
    private dialog: MatDialog,
    private planningGenerationService: PlanningGenerationService,
  ) {}

  ngOnInit(): void {
    const planningId = this.planningGenerationService.getPlanningInProgress();

    if (planningId) {
      this.isLoadingGenerate = true;
      this.startPolling(planningId);
    }

    this.stationId = this.userService.getUserStationId();
    
    this.planningService
      .getPlanningByStationId(this.stationId, this.nbWeek, this.year)
      .pipe(
        tap((planning) => {
          this.planningId = planning.length > 0 ? planning[0].id : '';
        }),
        switchMap(() => this.planningService.getShiftAssignmentsForGlobal(this.planningId)),
      )
      .subscribe((assignments) => {
        this.buildShiftsIndex(assignments);
        this.buildFirefighters(assignments);
      });
    
    this.inventory$ = this.planningService.getInventory(this.stationId);
    
    this.fetchVehiclesInventories();
  }

  private buildFirefighters(assignments: ShiftAssignment[]): void {
    const unique = new Map<string, string>();

    assignments.forEach((a) => {
      const name = a.firefighter.firstName + ' ' + a.firefighter.lastName;
      const id = a.firefighter.id;
      unique.set(id, name);
    });

    this.firefighters = Array.from(unique).map(([id, name]) => ({ name, id }));
  }

  private buildShiftsIndex(assignments: ShiftAssignment[]): void {
    this.shiftsIndex = assignments.reduce(
      (acc, a) => {
        const key = `${a.firefighter.id}_${a.weekday}`;
        acc[key] = a;
        return acc;
      },
      {} as Record<string, ShiftAssignment>,
    );
  }

  getAvailibility(pompier: string, day: string): string {
    const key = `${pompier}_${day}`;
    const shift = this.shiftsIndex[key];

    return shift?.shiftType ?? 'AVAILABLE';
  }

  generatePlanning(): void {
    this.isLoadingGenerate = true;

    const request$ = this.planningId
      ? this.planningService.regeneratePlanning(this.planningId)
      : this.planningService.generatePlanningForWeek(this.stationId, this.nbWeek, this.year);

    request$.subscribe({
      next: (planning: any) => {
        const planningId = planning.id;
        this.planningGenerationService.savePlanningInProgress(planningId);

        this.startPolling(planningId);
      },
      error: () => {
        this.showError(
          this.planningId
            ? 'Une erreur est survenue lors de la régénération du planning.'
            : 'Une erreur est survenue lors de la génération du planning.',
        );
      },
    });
  }

  private startPolling(planningId: string): void {
    this.pollingSub?.unsubscribe();

    this.pollingSub = this.planningGenerationService.pollPlanningStatus(planningId).subscribe({
      next: (status: string) => {
        if (status === 'FINALIZED') {
          this.pollingSub?.unsubscribe();
          
          this.dialog.open(PlanningModalComponent, {
            data: {
              success: true,
              message: 'Le planning a bien été généré.',
            },
          });

          this.isLoadingGenerate = false;
          this.planningGenerationService.clearPlanningInProgress();
          
          this.planningService
            .getShiftAssignmentsForGlobal(this.planningId)
            .subscribe((assignments) => {
              this.buildShiftsIndex(assignments);
              this.buildFirefighters(assignments);
            });
          
          this.fetchVehiclesInventories();
        }
      },
      error: () => {
        this.showError('Erreur lors de la vérification du status du planning.');
      },
    });
  }
  
  private fetchVehiclesInventories() {
    const currentWeekday = this.getCurrentWeekday();
    
    const vehicleAvailability = this.inventory$.pipe(
        map((items) => items.map((item) => item.id)),
        switchMap((vehicleIds) =>
            this.planningService.getVehicleAvailability(vehicleIds, currentWeekday),
        ),
    );
    
    this.vehicleInventory$ = combineLatest([this.inventory$, vehicleAvailability]).pipe(
        map(([inventory, availability]) =>
            inventory.map((item) => {
              const avail = availability.find((a) => a.vehicleId === item.id);
              
              return {
                id: item.id,
                vehicleId: item.id,
                type: item.type,
                totalCount: item.totalCount,
                bookedCount: avail?.bookedCount ?? 0,
                availableCount: avail?.availableCount ?? 0,
              };
            }),
        ),
    );
  }

  private showError(message: string): void {
    this.dialog.open(PlanningModalComponent, {
      data: {
        success: false,
        message,
      },
    });

    this.isLoadingGenerate = false;
    this.planningGenerationService.clearPlanningInProgress();
  }
  
  private getCurrentWeekday(): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    
    return days[new Date().getDay()];
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}
