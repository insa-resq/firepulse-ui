import {Component, OnInit} from '@angular/core';
import {GlobalPlanningComponent} from './global-planning-component/global-planning-component';
import {IndividualPlanningComponent} from './individual-planning-component/individual-planning-component';
import {UserService} from '../../service/user.service';
import {PlanningService} from '../../service/planning.service';
import {AsyncPipe} from '@angular/common';
import {InventoryItem} from '../../model/inventoryItem.model';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [GlobalPlanningComponent, IndividualPlanningComponent, AsyncPipe
  ],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class PlanningComponent implements OnInit {
  hasGlobalPlanningRights = false;
  currentWeek!: number;

  currentDate = new Date();

  inventory$!: Observable<InventoryItem[]>;

  constructor(
    private userService: UserService,
    private planningService: PlanningService
  ) {}

  ngOnInit() {
    this.hasGlobalPlanningRights =
      this.userService.hasRight('ADMIN') ||
      this.userService.hasRight('PLANNING_MANAGER');

    this.currentWeek = this.getCurrentWeek(this.currentDate) ;

    const stationId = this.userService.getUserStationId();
    this.inventory$ = this.planningService.getInventory(stationId);
  }

  getCurrentWeek(date : Date): number {
    const startYear = new Date(date.getFullYear(), 0, 1);
    const diff = Math.floor(
      (date.getTime() - startYear.getTime()) / 86400000
    );
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



}
