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
  isLoggedIn = true;

  constructor(private router: Router, public auth : AuthService) {
    this.auth.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    }

  toggleAuth() {
    this.auth.toggleAuth();
    this.router.navigate([this.isLoggedIn ? '/dashboard' : '/login']);
  }
}
