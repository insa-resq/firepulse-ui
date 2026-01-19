export interface ShiftAssignment {
  weekday: string;
  shiftType: 'ON_SHIFT' | 'OFF_SHIFT' | 'AVAILABLE';
  firefighter: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
