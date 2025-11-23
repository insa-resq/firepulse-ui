import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
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
