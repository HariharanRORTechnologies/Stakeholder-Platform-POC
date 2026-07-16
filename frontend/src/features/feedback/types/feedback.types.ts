export interface Feedback {
  id: number;
  eventId: number;
  userId: number;
  rating: number;
  title?: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: number;
  eventId: number;
  userId: number;
  title: string;
  description?: string;
  certificateUrl?: string;
  verificationCode: string;
  isVerified: boolean;
  issuedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackStats {
  totalResponses: number;
  averageRating: number;
  totalCertificatesIssued: number;
}
