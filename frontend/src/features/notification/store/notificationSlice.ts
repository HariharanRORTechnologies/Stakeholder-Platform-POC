import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/notification.types';

interface NotificationState {
  notifications: Notification[];
  unreadNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };
}

const initialState: NotificationState = {
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnreadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadNotifications();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number, { rejectWithValue }) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.unreadNotifications = action.payload.data;
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data.count;
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.data.id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export default notificationSlice.reducer;
