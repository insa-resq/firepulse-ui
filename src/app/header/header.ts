import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../service/AuthService";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = false;

  constructor(private router: Router, public auth : AuthService) {
    this.auth.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    }

  onClick() {
     if (this.isLoggedIn) {
          this.auth.logout();
          this.router.navigate(['/homepage']);
        } else {
          this.router.navigate(['/login']);
        }
  }
}
