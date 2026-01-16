import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirefighterRank } from '../../model/firefighter.model';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { UserModel } from '../../model/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  menuOpen = false;
  userIcon = '';
  currentUser: UserModel | null = null;

  hasDetectionRights = false;
  hasPlanningRights = false;

  private readonly RANK_TO_ICON_MAP: Record<FirefighterRank, `${string}.${'png' | 'svg'}`> = {
    FIRST_CLASS: 'Sap.png',
    SECOND_CLASS: 'Sap.png',
    CORPORAL: 'Cpl.png',
    CHIEF_CORPORAL: 'Cch.png',
    SERGEANT: 'Sgt.png',
    CHIEF_SERGEANT: 'Sch.png',
    ADJUTANT: 'Adj.png',
    CHIEF_ADJUTANT: 'Adc.png',
    LIEUTENANT: 'Ltn.png',
  } as const;

  constructor(
    private router: Router,
    public auth: AuthService,
    public userService: UserService,
    public el: ElementRef
  ) {
    if (this.userService.currentUser) {
      this.currentUser = this.userService.currentUser;
      this.updateUserIcon(this.userService.currentUser);
    }

    this.userService.user$.subscribe((value) => {
      this.currentUser = value;
      this.updateUserIcon(value);
      this.hasDetectionRights =
        this.userService.hasRight('ADMIN') || this.userService.hasRight('ALERT_MONITOR');
      this.hasPlanningRights =
        this.userService.hasRight('ADMIN') ||
        this.userService.hasRight('PLANNING_MANAGER') ||
        this.userService.hasRight('FIREFIGHTER');
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.menuOpen = false;
    this.userService.clearUser();
    this.router.navigate(['/login']).catch((err) => console.error(err));
  }

  private updateUserIcon(user: UserModel | null) {
    if (user && user.role === 'FIREFIGHTER') {
      const rank = FirefighterRank.SECOND_CLASS; // Get the actual rank from the API

      const iconFile = this.RANK_TO_ICON_MAP[rank];
      this.userIcon = `/icons/${iconFile}`;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
