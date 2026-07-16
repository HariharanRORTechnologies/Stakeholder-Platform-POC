export enum FeedbackStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ARCHIVED = 'archived',
}

export class Feedback {
  id: number;
  eventId: number;
  userId: number;
  rating: number;
  title?: string;
  content: string;
  status: FeedbackStatus;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data: Partial<Feedback> = {}) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return this.rating >= 1 && this.rating <= 5 && this.content.trim().length > 0;
  }
}

export class Certificate {
  id: number;
  eventId: number;
  userId: number;
  title: string;
  description?: string;
  templateUrl?: string;
  certificateUrl?: string;
  issuedDate: Date;
  verificationCode: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Certificate> = {}) {
    Object.assign(this, data);
  }

  canBeIssued(): boolean {
    return this.eventId > 0 && this.userId > 0 && this.title.length > 0;
  }
}

export interface FeedbackAggregate {
  eventId: number;
  totalResponses: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  sentimentAnalysis?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
