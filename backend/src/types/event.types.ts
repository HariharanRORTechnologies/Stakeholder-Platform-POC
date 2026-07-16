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

export interface EventResponse {
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

export interface EventListResponse {
  success: boolean;
  data: EventResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface EventDetailResponse {
  success: boolean;
  data: EventResponse;
}
