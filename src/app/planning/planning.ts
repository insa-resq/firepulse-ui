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

  currentDate = new Date();

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.hasGlobalPlanningRights =
      this.userService.hasRight('GLOBAL_PLANNING');

    this.currentWeek = this.getCurrentWeek(this.currentDate) ;
    console.log(this.currentWeek);
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
