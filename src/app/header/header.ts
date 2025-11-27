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
    console.log("click");
    const next = this.isLoggedIn ? '/homepage' : '/login';
    this.router.navigate([next]);
    this.auth.toggleAuth();
  }
}
