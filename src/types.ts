export type ResourceType = 'room' | 'equipment' | 'vehicle';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  spec: string;
  tag: string;
  location: string;
  capacity?: string;
  image?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'in_use' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  resourceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  purpose: string;
  status: ReservationStatus;
  notes?: string;
  attendees?: number;
  createdAt?: string;
}

export type ViewState =
  | 'dashboard'
  | 'booking'
  | 'my_reservations'
  | 'success'
  | 'conflict'
  | 'return'
  | 'edit';
