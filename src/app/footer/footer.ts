import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {
  activeTab: 'remerciements' | 'contacts' = 'remerciements';

  constructor() {}
}