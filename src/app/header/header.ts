import {Component, ElementRef, HostListener} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
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
      this.userIcon = `/assets/icons/${user.role}.svg`;
    }
  }

  getInitials(user: UserModel | null): string {
    if (!user || !user.username) return 'U';
    const name = user.username.trim();
    if (!name) return 'U';
    const parts = name.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + (parts[1][0] ?? '')).toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
