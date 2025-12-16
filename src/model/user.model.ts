export interface UserModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  role: 'ADMIN' | 'ALERT_MONITOR' | 'PLANNING_MANAGER' | 'FIREFIGHTER';
  avatarUrl: string;
  stationId: string;
}
