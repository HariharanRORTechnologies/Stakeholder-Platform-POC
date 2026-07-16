import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from '../services/reportService';
import { Report, AnalyticsDashboard } from '../types/report.types';

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  dashboard: AnalyticsDashboard | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };
}

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
  dashboard: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
};

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await reportService.getReports(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'reports/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getDashboard();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (
    { type, eventIds, startDate, endDate }: { type: string; eventIds?: number[]; startDate?: string; endDate?: string },
    { rejectWithValue }
  ) => {
    try {
      return await reportService.generateReport(type, eventIds, startDate, endDate);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportReport = createAsyncThunk(
  'reports/exportReport',
  async ({ id, format }: { id: number; format: string }, { rejectWithValue }) => {
    try {
      return await reportService.exportReport(id, format);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload.data;
      })

      .addCase(generateReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload.data);
      })

      .addCase(exportReport.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export default reportSlice.reducer;
