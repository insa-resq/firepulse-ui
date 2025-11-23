import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabletComponent} from "../tablet/tablet";

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

  onSubmit() {
    if (!this.email || !this.password) {
      console.warn('Email ou mot de passe manquant');
      return;
    }

    // Simplicité : log dans la console
    console.log('Tentative de connexion...');
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Placeholder future connexion API
    // this.authService.login(this.email, this.password).subscribe(...)
  }
}
