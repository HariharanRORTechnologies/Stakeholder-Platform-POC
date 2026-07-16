import { createSlice } from '@reduxjs/toolkit';
import mockAnalyticsData from '../../../data/mockAnalytics.json';

interface Analytics {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalRegistrations: number;
  totalAttendees: number;
  averageAttendanceRate: number;
  avgEventRating: number;
  totalBudget: number;
  budgetUtilized: number;
}

interface MonthlyTrend {
  month: string;
  events: number;
  registrations: number;
  attendance: number;
}

interface Distribution {
  type?: string;
  rating?: number;
  count: number;
  percentage: number;
}

interface AnalyticsState {
  eventAnalytics: Analytics;
  monthlyTrends: MonthlyTrend[];
  eventTypeDistribution: Distribution[];
  ratingDistribution: Distribution[];
}

const initialState: AnalyticsState = {
  eventAnalytics: mockAnalyticsData.eventAnalytics,
  monthlyTrends: mockAnalyticsData.monthlyTrends,
  eventTypeDistribution: mockAnalyticsData.eventTypeDistribution,
  ratingDistribution: mockAnalyticsData.ratingDistribution,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;
