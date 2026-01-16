import { Injectable } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { PlanningService } from './planning.service';

@Injectable({
  providedIn: 'root',
})
export class PlanningGenerationService {
  private readonly STORAGE_GENERATING = 'planningGenerating';
  private readonly STORAGE_PLANNING_ID = 'planningId';

  private stopPolling$ = new Subject<void>();

  constructor(private planningService: PlanningService) {}

  savePlanningInProgress(planningId: string): void {
    localStorage.setItem(this.STORAGE_GENERATING, 'true');
    localStorage.setItem(this.STORAGE_PLANNING_ID, planningId);
  }

  getPlanningInProgress(): string | null {
    const isGenerating = localStorage.getItem(this.STORAGE_GENERATING);
    const planningId = localStorage.getItem(this.STORAGE_PLANNING_ID);

    if (isGenerating === 'true' && planningId) {
      return planningId;
    }
    return null;
  }

  clearPlanningInProgress(): void {
    localStorage.removeItem(this.STORAGE_GENERATING);
    localStorage.removeItem(this.STORAGE_PLANNING_ID);
    this.stopPolling$.next();
  }

  pollPlanningStatus(planningId: string): Observable<string> {
    return interval(3000).pipe(
      takeUntil(this.stopPolling$),
      switchMap(() => this.planningService.getPlanningStatus(planningId)),
      takeWhile((status: string) => status !== 'FINALIZED', true)
    );
  }
}
