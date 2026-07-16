export enum ReportType {
  EVENT_SUMMARY = 'event_summary',
  ATTENDANCE = 'attendance',
  REGISTRATIONS = 'registrations',
  ENGAGEMENT = 'engagement',
  FEEDBACK_ANALYSIS = 'feedback_analysis',
  FINANCIAL = 'financial',
  CUSTOM = 'custom',
}

export class Report {
  id: number;
  title: string;
  type: ReportType;
  description?: string;
  generatedBy: number;
  startDate: Date;
  endDate: Date;
  eventIds?: number[];
  filters?: Record<string, any>;
  data?: Record<string, any>;
  fileUrl?: string;
  status: 'pending' | 'generated' | 'failed';
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Report> = {}) {
    Object.assign(this, data);
  }
}

export interface EventAnalytics {
  eventId: number;
  eventTitle: string;
  totalRegistrations: number;
  totalAttendance: number;
  attendanceRate: number;
  avgEngagementScore: number;
  totalFeedbackResponses: number;
  feedbackAvgRating: number;
  budgetUtilized: number;
  budgetAllocated: number;
}

export interface AnalyticsDashboard {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  averageAttendanceRate: number;
  topEvents: EventAnalytics[];
  recentActivity: any[];
}
