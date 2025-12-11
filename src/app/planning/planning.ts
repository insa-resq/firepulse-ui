import { Component } from '@angular/core';
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
export class PlanningComponent {
  hasGlobalPlanningRights: boolean;

  constructor(private userService: UserService  ) {
    this.hasGlobalPlanningRights = this.userService.hasRight('GLOBAL_PLANNING') ?? false;
  }





}
