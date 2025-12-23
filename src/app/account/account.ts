import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserModel } from '../../model/user.model';
import { RegistryService } from '../../service/registry.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountComponent implements OnInit {
  currentUser: UserModel | null = null;
  users: UserModel[] = [];
  isAdmin = false;
  stationName?: string;

  // Own email update
  newEmail = '';
  isUpdating = false;
  updateMessage = '';
  updateSuccess = false;

  // Admin actions
  userEdits: { [userId: number]: { email: string; stationId: string } } = {};
  adminMessage = '';
  adminSuccess = false;

  constructor(private userService: UserService, private registryService: RegistryService) {}

  ngOnInit() {
    // Get current user
    this.userService.user$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.userService.isAdmin();
      if (user) {
        this.newEmail = user.email;
      }
    });

    // If admin, load all users
    if (this.isAdmin) {
      this.loadUsers();
    }

    if (this.currentUser?.stationId) {
      this.loadStationName(this.currentUser.stationId);
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        // Initialize edit objects for each user
        users.forEach(user => {
          this.userEdits[user.id] = {
            email: user.email,
            stationId: user.stationId
          };
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.adminMessage = 'Erreur lors du chargement des utilisateurs';
        this.adminSuccess = false;
      }
    });
  }

  updateMyEmail() {
    if (!this.newEmail || this.newEmail === this.currentUser?.email) {
      return;
    }

    this.isUpdating = true;
    this.updateMessage = '';

    this.userService.updateEmail(this.newEmail).subscribe({
      next: (updatedUser) => {
        this.userService.setUser(updatedUser);
        this.updateMessage = 'Email mis à jour avec succès';
        this.updateSuccess = true;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating email:', error);
        this.updateMessage = 'Erreur lors de la mise à jour de l\'email';
        this.updateSuccess = false;
        this.isUpdating = false;
      }
    });
  }

  updateOtherUserEmail(user: UserModel) {
    const newEmail = this.userEdits[user.id].email;
    if (!newEmail || newEmail === user.email) {
      return;
    }

    this.userService.updateUserEmail(user.id, newEmail).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.adminMessage = `Email de ${updatedUser.email} mis à jour avec succès`;
        this.adminSuccess = true;
        setTimeout(() => this.adminMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user email:', error);
        this.adminMessage = 'Erreur lors de la mise à jour de l\'email';
        this.adminSuccess = false;
        setTimeout(() => this.adminMessage = '', 3000);
      }
    });
  }

  updateOtherUserStation(user: UserModel) {
    const newStationId = this.userEdits[user.id].stationId;
    if (!newStationId || newStationId === user.stationId) {
      return;
    }

    this.userService.updateUserStation(user.id, newStationId).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.adminMessage = `Station de ${updatedUser.email} mise à jour avec succès`;
        this.adminSuccess = true;
        setTimeout(() => this.adminMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user station:', error);
        this.adminMessage = 'Erreur lors de la mise à jour de la station';
        this.adminSuccess = false;
        setTimeout(() => this.adminMessage = '', 3000);
      }
    });
  }

  deleteOtherUser(user: UserModel) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.adminMessage = `Utilisateur ${user.email} supprimé avec succès`;
        this.adminSuccess = true;
        setTimeout(() => this.adminMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.adminMessage = 'Erreur lors de la suppression de l\'utilisateur';
        this.adminSuccess = false;
        setTimeout(() => this.adminMessage = '', 3000);
      }
    });
  }

  loadStationName(stationId: string) {
    this.registryService.getStationById(stationId).subscribe({
      next: (station: any) => {
        this.stationName = station?.name || 'Station inconnue';
      },
      error: () => {
        this.stationName = 'Station inconnue';
      }
    });
  }

  getRoleName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'ALERT_MONITOR': 'Moniteur d\'alerte',
      'PLANNING_MANAGER': 'Gestionnaire de planning',
      'FIREFIGHTER': 'Pompier'
    };
    return roleMap[role] || role;
  }
}

