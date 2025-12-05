import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../service/AuthService";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isLoggedIn = false;

  constructor(private router: Router, public auth : AuthService) {
    this.auth.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    }

  onClick() {
     if (this.isLoggedIn) {
          this.auth.logout();
          this.router.navigate(['/homepage']).catch();
        } else {
          this.router.navigate(['/login']).catch();
        }
  }
}
