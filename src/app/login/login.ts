import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabletComponent} from "../tablet/tablet";
import { AuthService } from "../../service/auth.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
    TabletComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  errorMessage: string | null = null;
  isLoading = false;

  constructor(public auth : AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      console.warn('Email ou mot de passe manquant');
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: async ({ token }) => {
        localStorage.setItem('token', token);
        this.isLoading = false;
        await this.router.navigate(['/'], { replaceUrl: true });
        location.reload();
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (err.status === 404) {
          this.errorMessage = 'Utilisateur introuvable.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Réessayez plus tard.';
        }
      },
    });
  }

  clearError() {
    this.errorMessage = null;
  }
}
