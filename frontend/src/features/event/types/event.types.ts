export interface Event {
  id: number;
  title: string;
  description?: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxCapacity: number;
  registrationDeadline?: string;
  organizerId: number;
  departmentId?: number;
  categoryId?: number;
  budget?: number;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxCapacity: number;
  registrationDeadline?: string;
  organizerId: number;
  departmentId?: number;
  categoryId?: number;
  budget?: number;
  imageUrl?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  maxCapacity?: number;
  registrationDeadline?: string;
  budget?: number;
  imageUrl?: string;
}

export interface EventListResponse {
  success: boolean;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const EVENT_TYPES = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'social', label: 'Social' },
  { value: 'training', label: 'Training' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'networking', label: 'Networking' },
  { value: 'volunteer', label: 'Volunteer' },
];

export const EVENT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'archived', label: 'Archived' },
];

export const EVENT_TYPE_COLORS: Record<string, string> = {
  corporate: '#1976d2',
  social: '#388e3c',
  training: '#f57c00',
  conference: '#7b1fa2',
  workshop: '#c2185b',
  seminar: '#0097a7',
  networking: '#455a64',
  volunteer: '#689f38',
};

export const EVENT_STATUS_COLORS: Record<string, string> = {
  draft: '#9e9e9e',
  published: '#4caf50',
  ongoing: '#2196f3',
  completed: '#ff9800',
  cancelled: '#f44336',
  archived: '#757575',
};
