import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footpage } from './footpage/footpage';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    Header,
    Footpage
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('resQ');
}
