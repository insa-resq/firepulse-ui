import { Component, OnInit } from '@angular/core';
import { RegistryService } from '../../../service/registry.service';
import { UserService } from '../../../service/user.service';
import { UserModel } from '../../../model/user.model';
import { FormsModule } from '@angular/forms';
import { StationModel } from '../../../model/station.model';

@Component({
  selector: 'app-user-manager',
  imports: [FormsModule],
  templateUrl: './user-manager.html',
  styleUrl: '../administration.css',
})
export class UserManager implements OnInit {
  users: UserModel[] = [];
  isLoading = false;
  message = '';
  messageSuccess = false;
  stationNames: { [stationId: string]: string } = {};
  loadingStations: Set<string> = new Set();
  editingUserId: number | null = null;
  editEmail = '';
  editStationId = '';

  // Filtrage et recherche
  searchEmail = '';
  filterStation = '';
  filterRole = '';
  availableStations: Set<string> = new Set();

  stations: StationModel[] = [];

  constructor(
    private userService: UserService,
    private registryService: RegistryService,
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.registryService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations;
      },
      error: (error) => {
        console.error('Error loading stations:', error);
      },
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        // Collecter toutes les stations uniques
        this.availableStations.clear();
        users.forEach((user) => {
          if (user.stationId) {
            this.availableStations.add(user.stationId);
            this.loadStationName(user.stationId);
          }
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.message = 'Erreur lors du chargement des utilisateurs';
        this.messageSuccess = false;
        this.isLoading = false;
      },
    });
  }

  loadStationName(stationId: string) {
    const station = this.stations.find((s) => s.id === stationId);
    if (station) {
      this.stationNames[stationId] = station.name;
    } else {
      this.stationNames[stationId] = 'Inconnue';
    }
  }

  startEdit(user: UserModel) {
    this.editingUserId = user.id;
    this.editEmail = user.email;
    this.editStationId = user.stationId;
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editEmail = '';
    this.editStationId = '';
  }

  updateUser(user: UserModel) {
    if (this.editEmail === user.email && this.editStationId === user.stationId) {
      this.cancelEdit();
      return;
    }

    const updates: any = {};
    if (this.editEmail !== user.email) {
      updates.email = this.editEmail;
    }
    if (this.editStationId !== user.stationId) {
      updates.stationId = this.editStationId;
    }

    this.userService.updateUserEmail(user.id, this.editEmail).subscribe({
      next: () => {
        if (updates.stationId) {
          this.userService.updateUserStation(user.id, this.editStationId).subscribe({
            next: () => {
              this.loadUsers();
              this.message = `Utilisateur ${this.editEmail} mis à jour avec succès`;
              this.messageSuccess = true;
              this.cancelEdit();
              setTimeout(() => (this.message = ''), 3000);
            },
            error: (error) => {
              console.error('Error updating station:', error);
              this.message = 'Erreur lors de la mise à jour de la caserne';
              this.messageSuccess = false;
              setTimeout(() => (this.message = ''), 3000);
            },
          });
        } else {
          this.loadUsers();
          this.message = `Utilisateur ${this.editEmail} mis à jour avec succès`;
          this.messageSuccess = true;
          this.cancelEdit();
          setTimeout(() => (this.message = ''), 3000);
        }
      },
      error: (error) => {
        console.error('Error updating email:', error);
        this.message = "Erreur lors de la mise à jour de l'email";
        this.messageSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      },
    });
  }

  deleteUser(user: UserModel) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.message = `Utilisateur ${user.email} supprimé avec succès`;
        this.messageSuccess = true;
        setTimeout(() => (this.message = ''), 3000);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.message = "Erreur lors de la suppression de l'utilisateur";
        this.messageSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      },
    });
  }

  getRoleName(role: string): string {
    const roleMap: { [key: string]: string } = {
      ADMIN: 'Administrateur',
      ALERT_MONITOR: "Moniteur d'alerte",
      PLANNING_MANAGER: 'Gestionnaire de planning',
      FIREFIGHTER: 'Pompier',
    };
    return roleMap[role] || role;
  }

  // Filtrer les utilisateurs selon la recherche et le filtre
  getFilteredUsers(): UserModel[] {
    return this.users.filter((user) => {
      const matchEmail = user.email.toLowerCase().includes(this.searchEmail.toLowerCase());
      const matchStation = !this.filterStation || user.stationId === this.filterStation;
      const matchRole = !this.filterRole || user.role === this.filterRole;
      return matchEmail && matchStation && matchRole;
    });
  }

  // Réinitialiser les filtres
  resetFilters() {
    this.searchEmail = '';
    this.filterStation = '';
    this.filterRole = '';
  }

  // Obtenir les stations triées pour le select
  getSortedStations(): string[] {
    return Array.from(this.availableStations).sort((a, b) => {
      const nameA = this.stationNames[a] || a;
      const nameB = this.stationNames[b] || b;
      return nameA.localeCompare(nameB);
    });
  }
}
