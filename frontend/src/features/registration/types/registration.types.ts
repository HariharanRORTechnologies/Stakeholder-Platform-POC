export interface Registration {
  id: number;
  eventId: number;
  userId: number;
  status: string;
  registrationDate: string;
  approvedBy?: number;
  checkedInAt?: string;
  attendedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  total: number;
  confirmed: number;
  checkedIn: number;
  attended: number;
  noShow: number;
  cancelled: number;
}

export const REGISTRATION_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'attended', label: 'Attended' },
  { value: 'no_show', label: 'No Show' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'waitlisted', label: 'Waitlisted' },
];

export const REGISTRATION_STATUS_COLORS: Record<string, string> = {
  pending: '#ff9800',
  confirmed: '#2196f3',
  checked_in: '#9c27b0',
  attended: '#4caf50',
  no_show: '#f44336',
  cancelled: '#9e9e9e',
  waitlisted: '#ffc107',
};
