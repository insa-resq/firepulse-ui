export interface VehicleInventory {
  id: string;
  vehicleId: string;
  type: string;
  totalCount: number;
  bookedCount: number;
  availableCount: number;
}
