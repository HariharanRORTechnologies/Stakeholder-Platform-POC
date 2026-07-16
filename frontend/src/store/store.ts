import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import userReducer from '../features/user/store/userSlice';
import roleReducer from '../features/role/store/roleSlice';
import permissionReducer from '../features/permission/store/permissionSlice';
import eventReducer from '../features/event/store/eventSlice';
import registrationReducer from '../features/registration/store/registrationSlice';
import notificationReducer from '../features/notification/store/notificationSlice';
import reportReducer from '../features/report/store/reportSlice';
import feedbackReducer from '../features/feedback/store/feedbackSlice';
import mockEventsReducer from '../features/mockData/store/eventsSlice';
import mockRegistrationsReducer from '../features/mockData/store/registrationsSlice';
import mockNotificationsReducer from '../features/mockData/store/notificationsSlice';
import mockFeedbackReducer from '../features/mockData/store/feedbackSlice';
import mockCertificatesReducer from '../features/mockData/store/certificatesSlice';
import mockAnalyticsReducer from '../features/mockData/store/analyticsSlice';
import uiReducer from '../features/mockData/store/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    events: eventReducer,
    registrations: registrationReducer,
    notifications: notificationReducer,
    reports: reportReducer,
    feedback: feedbackReducer,
    mockEvents: mockEventsReducer,
    mockRegistrations: mockRegistrationsReducer,
    mockNotifications: mockNotificationsReducer,
    mockFeedback: mockFeedbackReducer,
    mockCertificates: mockCertificatesReducer,
    mockAnalytics: mockAnalyticsReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['auth', 'users', 'roles', 'permissions'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
