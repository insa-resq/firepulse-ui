import { Component } from '@angular/core';
import {GlobalPlanningComponent} from './global-planning-component/global-planning-component';
import {IndividualPlanningComponent} from './individual-planning-component/individual-planning-component';


@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [GlobalPlanningComponent, IndividualPlanningComponent
  ],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class PlanningComponent {



}
