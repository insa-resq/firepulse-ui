import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabletComponent } from '../../tablet/tablet';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { InventoryItem } from '../../../model/inventoryItem.model';
import { VehicleTypeLabelPipe } from '../../../pipe/vehicule-type-label.pipe';
import { UserService } from '../../../service/user.service';
import { PlanningService } from '../../../service/planning.service';

@Component({
  selector: 'app-individual-planning-component',
  standalone: true,
  imports: [TabletComponent, AsyncPipe, VehicleTypeLabelPipe],
  templateUrl: './individual-planning-component.html',
  styleUrl: './individual-planning-component.css',
})
export class IndividualPlanningComponent {
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  stationId!: string;
  planningId!: string;
  year: number = new Date().getFullYear();

  @Input() nbWeek!: number;
  @Input() inventory!: Observable<InventoryItem[]>;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  avaibility = [
    { week: 50, day: 'Lundi', status: 'available' },
    { week: 50, day: 'Mardi', status: 'on-call' },
    { week: 50, day: 'Mercredi', status: 'available' },
    { week: 50, day: 'Jeudi', status: 'unavailable' },
    { week: 50, day: 'Vendredi', status: 'available' },
    { week: 50, day: 'Samedi', status: 'on-call' },
    { week: 50, day: 'Dimanche', status: 'unavailable' },

    { week: 51, day: 'Lundi', status: 'unavailable' },
    { week: 51, day: 'Vendredi', status: 'on-call' },
  ];

  constructor(private userService: UserService, private planningService: PlanningService) {}

  ngOnInit(): void {
    this.stationId = this.userService.getUserStationId();

    this.planningService
      .getPlanningByStationId(this.stationId, this.nbWeek, this.year)
      .subscribe((planning) => {
        this.planningId = planning.length > 0 ? planning[0].id : '';
      });
  }

  getStatus(day: string): string {
    const available = this.avaibility.find((d) => d.week === this.nbWeek && d.day === day);
    return available ? available.status : '';
  }
}
