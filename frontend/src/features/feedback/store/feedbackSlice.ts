import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService } from '../services/feedbackService';
import { Feedback, Certificate, FeedbackStats } from '../types/feedback.types';

interface FeedbackState {
  feedback: Feedback[];
  userCertificates: Certificate[];
  feedbackStats: FeedbackStats | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };
}

const initialState: FeedbackState = {
  feedback: [],
  userCertificates: [],
  feedbackStats: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
};

export const fetchFeedback = createAsyncThunk(
  'feedback/fetchFeedback',
  async ({ eventId, page, limit }: { eventId: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await feedbackService.getFeedback(eventId, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'feedback/submitFeedback',
  async (
    {
      eventId,
      rating,
      content,
      title,
      isAnonymous,
    }: { eventId: number; rating: number; content: string; title?: string; isAnonymous?: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await feedbackService.submitFeedback(eventId, rating, content, title, isAnonymous);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCertificates = createAsyncThunk(
  'feedback/fetchUserCertificates',
  async (_, { rejectWithValue }) => {
    try {
      return await feedbackService.getUserCertificates();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const issueCertificate = createAsyncThunk(
  'feedback/issueCertificate',
  async ({ eventId, userId, title, description }: { eventId: number; userId: number; title: string; description?: string }, { rejectWithValue }) => {
    try {
      return await feedbackService.issueCertificate(eventId, userId, title, description);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbackStats = createAsyncThunk(
  'feedback/fetchFeedbackStats',
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await feedbackService.getFeedbackStats(eventId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.feedback.unshift(action.payload.data);
        state.pagination.total += 1;
      })

      .addCase(fetchUserCertificates.fulfilled, (state, action) => {
        state.userCertificates = action.payload.data;
      })

      .addCase(issueCertificate.fulfilled, (state, action) => {
        state.userCertificates.push(action.payload.data);
      })

      .addCase(fetchFeedbackStats.fulfilled, (state, action) => {
        state.feedbackStats = action.payload.data;
      });
  },
});

export default feedbackSlice.reducer;
