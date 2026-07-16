export interface Report {
  id: number;
  title: string;
  type: string;
  description?: string;
  generatedBy: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'generated' | 'failed';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsDashboard {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  averageAttendanceRate: number;
  topEvents: any[];
  recentActivity: any[];
}

export const REPORT_TYPES = [
  { value: 'event_summary', label: 'Event Summary' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'registrations', label: 'Registrations' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'feedback_analysis', label: 'Feedback Analysis' },
  { value: 'financial', label: 'Financial' },
  { value: 'custom', label: 'Custom' },
];

export const EXPORT_FORMATS = ['pdf', 'csv', 'excel'];
