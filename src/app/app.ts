import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { LoginComponent } from "./login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    Header,
    Footer, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('resQ');
}
