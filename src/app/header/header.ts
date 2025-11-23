import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = true;

  constructor(private router: Router) {}

  toggleAuth() {
    if (this.isLoggedIn) {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }
}
