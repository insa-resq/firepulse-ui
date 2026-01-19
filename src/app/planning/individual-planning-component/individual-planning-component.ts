import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabletComponent } from '../../tablet/tablet';
import { AsyncPipe } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';
import { InventoryItem } from '../../../model/inventoryItem.model';
import { VehicleTypeLabelPipe } from '../../../pipe/vehicule-type-label.pipe';
import { UserService } from '../../../service/user.service';
import { PlanningService } from '../../../service/planning.service';
import { RegistryService } from '../../../service/registry.service';
import { DayPipe } from '../../../pipe/day.pipe';

@Component({
  selector: 'app-individual-planning-component',
  standalone: true,
  imports: [TabletComponent, AsyncPipe, VehicleTypeLabelPipe, DayPipe],
  templateUrl: './individual-planning-component.html',
  styleUrl: './individual-planning-component.css',
})
export class IndividualPlanningComponent {
  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  stationId!: string;
  planningId!: string;
  year: number = new Date().getFullYear();

  firefighterId!: string;

  shiftsByDay: Record<string, any> = {};

  @Input() nbWeek!: number;
  @Input() inventory!: Observable<InventoryItem[]>;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private planningService: PlanningService,
    private registryService: RegistryService
  ) {}

  ngOnInit(): void {
    this.stationId = this.userService.getUserStationId();

    this.userService
      .getCurrentUser()
      .pipe(
        switchMap((user) => this.registryService.getFirefighterId(user.id.toString())),
        tap((firefighterId) => {
          this.firefighterId = firefighterId;
        }),
        switchMap(() =>
          this.planningService.getPlanningByStationId(this.stationId, this.nbWeek, this.year).pipe(
            tap((planning) => {
              this.planningId = planning.length > 0 ? planning[0].id : '';
            })
          )
        ),
        switchMap(() =>
          this.planningService.getShiftAssignmentsForIndividual(this.firefighterId, this.planningId)
        )
      )
      .subscribe((shifts) => {
        this.buildShiftsIndex(shifts);
      });
  }

  buildShiftsIndex(shifts: any[]): void {
    this.shiftsByDay = shifts.reduce((acc, shift) => {
      acc[shift.weekday] = shift;
      return acc;
    }, {} as Record<string, any>);
  }

  getStatus(day: string): string {
    const shift = this.shiftsByDay[day];

    if (!shift) {
      return 'AVAILABLE';
    }

    return shift.shiftType;
  }
}
