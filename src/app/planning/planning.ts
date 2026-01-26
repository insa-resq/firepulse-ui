import { Component, OnInit } from '@angular/core';
import { GlobalPlanningComponent } from './global-planning-component/global-planning-component';
import { IndividualPlanningComponent } from './individual-planning-component/individual-planning-component';
import { UserService } from '../../service/user.service';
import { PlanningService } from '../../service/planning.service';
import { AsyncPipe } from '@angular/common';
import { InventoryItem } from '../../model/inventoryItem.model';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { InventoryAvailability } from '../../model/inventoryAvailability.model';
import { VehicleInventory } from '../../model/vehicleInventory.model';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [GlobalPlanningComponent, IndividualPlanningComponent],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class PlanningComponent implements OnInit {
  hasGlobalPlanningRights = false;
  currentWeek!: number;

  currentDate = new Date();

  inventory$!: Observable<InventoryItem[]>;
  vehicleAvailability$!: Observable<InventoryAvailability[]>;
  vehicleInventory$!: Observable<VehicleInventory[]>;

  constructor(
    private userService: UserService,
    private planningService: PlanningService,
  ) {}

  ngOnInit() {
    this.hasGlobalPlanningRights =
      this.userService.hasRight('ADMIN') || this.userService.hasRight('PLANNING_MANAGER');

    this.currentWeek = this.getCurrentWeek(this.currentDate);

    if (this.hasGlobalPlanningRights) {
      const stationId = this.userService.getUserStationId();
      this.inventory$ = this.planningService.getInventory(stationId);
      this.vehicleAvailability$ = this.inventory$.pipe(
        map((items) => items.map((item) => item.id)),
        switchMap((vehicleIds) =>
          this.planningService.getVehicleAvailability(vehicleIds, this.getCurrentWeekday()),
        ),
      );

      this.vehicleInventory$ = combineLatest([this.inventory$, this.vehicleAvailability$]).pipe(
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
  }

  getCurrentWeek(date: Date): number {
    const startYear = new Date(date.getFullYear(), 0, 1);
    const diff = Math.floor((date.getTime() - startYear.getTime()) / 86400000);
    return Math.ceil((diff + startYear.getDay() + 1) / 7) - 1;
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.currentWeek = this.getCurrentWeek(this.currentDate);
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.currentWeek = this.getCurrentWeek(this.currentDate);
  }

  private getCurrentWeekday(): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    return days[new Date().getDay()];
  }
}
