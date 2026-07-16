import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockNotificationsData from '../../../data/mockNotifications.json';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  relatedEventId: number | null;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: mockNotificationsData.notifications as Notification[],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(n => (n.isRead = true));
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
  },
});

export const { markAsRead, markAllAsRead, addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
