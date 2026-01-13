import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-planning-modal',
  templateUrl: './planning-modal.html',
  imports: [MatDialogModule, MatButtonModule],
  styleUrls: ['./planning-modal.css'],
})
export class PlanningModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
