import {Component, OnInit} from '@angular/core';
import {GlobalPlanningComponent} from './global-planning-component/global-planning-component';
import {IndividualPlanningComponent} from './individual-planning-component/individual-planning-component';
import {UserService} from '../../service/user.service';


@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [GlobalPlanningComponent, IndividualPlanningComponent
  ],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class PlanningComponent implements OnInit {
  hasGlobalPlanningRights = false;
  currentWeek!: number;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.hasGlobalPlanningRights =
      this.userService.hasRight('GLOBAL_PLANNING');

    this.currentWeek = this.getCurrentWeek();
  }

  getCurrentWeek(): number {
    const date = new Date();
    const startYear = new Date(date.getFullYear(), 0, 1);
    const diff = Math.floor(
      (date.getTime() - startYear.getTime()) / 86400000
    );
    return Math.ceil((diff + startYear.getDay() + 1) / 7);
  }





}
