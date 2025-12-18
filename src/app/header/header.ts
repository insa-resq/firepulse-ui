import {Component, ElementRef, HostListener} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirefighterRank } from '../../model/firefighter.model';
import { AuthService } from "../../service/auth.service";
import {UserService} from '../../service/user.service';
import {UserModel} from '../../model/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isLoggedIn = false;
  menuOpen = false;
  userIcon = '';

  private readonly RANK_TO_ICON_MAP: Record<FirefighterRank, `${string}.${'png' | 'svg'}`> = {
    FIRST_CLASS: 'Sap.svg',
    SECOND_CLASS: 'Sap.svg',
    CORPORAL: 'Cpl.svg',
    CHIEF_CORPORAL: 'Cch.svg',
    SERGEANT: 'Sgt.svg',
    CHIEF_SERGEANT: 'Sch.svg',
    ADJUTANT: 'Adj.svg',
    CHIEF_ADJUTANT: 'Adc.svg',
    LIEUTENANT: 'Ltn.svg',
  } as const;

  constructor(
    private router: Router,
    public auth: AuthService,
    public userService: UserService,
    public el:  ElementRef
  ) {
    this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.updateUserIcon();
    });
  }

  login() {
    this.router.navigate(['/login']).catch();
  }

  logout() {
    this.menuOpen = false;
    this.auth.logout();
    this.router.navigate(['/homepage']).catch();
  }

  private updateUserIcon() {
    const user: UserModel | null = this.userService.currentUser;

    if (user) {
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
