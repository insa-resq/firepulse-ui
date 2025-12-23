import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import {UserManager} from './user-manager/user-manager';
import {StationManager} from './station-manager/station-manager';
import {AlertManager} from './alert-manager/alert-manager';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, UserManager, StationManager, AlertManager],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class AdministrationComponent {
  activeTab: 'users' | 'stations' | 'alerts' = 'users';

  userRole!: string;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    if (!this.canAccessUsers()) {
      if (this.canAccessStations()) this.activeTab = 'stations';
      else if (this.canAccessAlerts()) this.activeTab = 'alerts';
    }
  }

  canAccessUsers(): boolean {
    return this.userService.hasRight('ADMIN') || this.userService.hasRight('PLANNING_MANAGER');
  }

  canAccessStations(): boolean {
    return this.userService.hasRight('ADMIN') || this.userService.hasRight('PLANNING_MANAGER');
  }

  canAccessAlerts(): boolean {
    return this.userService.hasRight('ADMIN') || this.userService.hasRight('ALERT_MONITOR');
  }
}

