# Complete ReactJS Architecture - Stakeholder Engagement Platform

**Technology Stack:** React 18+ | Vite | Redux Toolkit | React Router | Material-UI | TypeScript  
**Status:** Production-Ready | Enterprise-Grade  
**Date:** July 2026

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Technologies](#core-technologies)
4. [State Management](#state-management)
5. [Routing Architecture](#routing-architecture)
6. [API Integration](#api-integration)
7. [Component Architecture](#component-architecture)
8. [Theme Management](#theme-management)
9. [Environment Configuration](#environment-configuration)
10. [Authentication & Authorization](#authentication--authorization)
11. [Performance Optimization](#performance-optimization)
12. [Best Practices](#best-practices)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
│                      (Vite + TSX)                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐         ┌────▼─────┐      ┌─────▼──┐
    │ Pages  │         │Components│      │ Hooks  │
    │ Layer  │         │  Layer   │      │ Layer  │
    └────────┘         └──────────┘      └────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
    ┌───────────────────────▼───────────────────────┐
    │          Redux Toolkit Store                  │
    │  (Slices, Selectors, Middleware, Actions)   │
    └───────────────────────┬───────────────────────┘
                            │
    ┌───────────────────────▼───────────────────────┐
    │          Services Layer (Axios)              │
    │  (API Calls, Interceptors, Error Handling)   │
    └───────────────────────┬───────────────────────┘
                            │
    ┌───────────────────────▼───────────────────────┐
    │          Backend API (Node.js)               │
    │      (REST Endpoints, Controllers)           │
    └──────────────────────────────────────────────┘
```

---

## Project Structure

### Complete Feature-Based Folder Structure

```
frontend/
├── src/
│   ├── index.tsx                          # React entry point
│   ├── App.tsx                            # Root component
│   ├── App.test.tsx                       # Root tests
│   ├── vite-env.d.ts                      # Vite type definitions
│   │
│   ├── config/                            # Configuration files
│   │   ├── constants.ts                   # App constants
│   │   ├── api.config.ts                  # API configuration
│   │   ├── theme.config.ts                # Theme configuration
│   │   ├── routes.config.ts               # Routes configuration
│   │   ├── env.config.ts                  # Environment config
│   │   └── permissions.config.ts          # Permission mappings
│   │
│   ├── features/                          # Feature-based modules
│   │   │
│   │   ├── auth/                          # Authentication feature
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── LoginPage.test.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── AuthGuard.tsx
│   │   │   │   └── RoleBasedRoute.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useLogout.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── authService.ts
│   │   │   │   └── tokenService.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── authSelectors.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   └── authUtils.ts
│   │   │   │
│   │   │   └── index.ts                   # Feature exports
│   │   │
│   │   ├── events/                        # Events feature
│   │   │   ├── pages/
│   │   │   │   ├── EventsListPage.tsx
│   │   │   │   ├── EventDetailPage.tsx
│   │   │   │   ├── EventCreatePage.tsx
│   │   │   │   ├── EventEditPage.tsx
│   │   │   │   └── EventsListPage.test.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── EventList.tsx
│   │   │   │   ├── EventForm.tsx
│   │   │   │   ├── EventFilter.tsx
│   │   │   │   ├── EventSearch.tsx
│   │   │   │   ├── EventCalendar.tsx
│   │   │   │   └── EventCard.test.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useEvents.ts
│   │   │   │   ├── useEventFilters.ts
│   │   │   │   ├── usePaginatedEvents.ts
│   │   │   │   └── useEventForm.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── eventService.ts
│   │   │   │   ├── registrationService.ts
│   │   │   │   └── feedbackService.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── eventSlice.ts
│   │   │   │   ├── eventSelectors.ts
│   │   │   │   ├── registrationSlice.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── eventFormatters.ts
│   │   │   │   ├── eventValidators.ts
│   │   │   │   └── eventHelpers.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── csr/                           # CSR feature
│   │   │   ├── pages/
│   │   │   │   ├── CSRDashboardPage.tsx
│   │   │   │   ├── CampaignsPage.tsx
│   │   │   │   ├── InitiativesPage.tsx
│   │   │   │   ├── VolunteerPage.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CampaignCard.tsx
│   │   │   │   ├── CampaignForm.tsx
│   │   │   │   ├── InitiativeList.tsx
│   │   │   │   ├── VolunteerAssignment.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useCampaigns.ts
│   │   │   │   ├── useInitiatives.ts
│   │   │   │   └── useVolunteers.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── csrService.ts
│   │   │   │   └── volunteerService.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── csrSlice.ts
│   │   │   │   ├── csrSelectors.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/                     # Dashboard feature
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── DashboardPage.test.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── Chart.tsx
│   │   │   │   ├── MetricsPanel.tsx
│   │   │   │   ├── UpcomingEvents.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardData.ts
│   │   │   │   ├── useMetrics.ts
│   │   │   │   └── useChartData.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── dashboardService.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── dashboardSlice.ts
│   │   │   │   ├── dashboardSelectors.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/                         # Admin feature
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   ├── RolesPage.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   ├── AuditLogsPage.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── UserTable.tsx
│   │   │   │   ├── RoleForm.tsx
│   │   │   │   ├── PermissionMatrix.tsx
│   │   │   │   ├── SettingsPanel.tsx
│   │   │   │   ├── AuditLogViewer.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useUsers.ts
│   │   │   │   ├── useRoles.ts
│   │   │   │   └── useAuditLogs.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── adminService.ts
│   │   │   │   └── auditService.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── adminSlice.ts
│   │   │   │   ├── adminSelectors.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── common/                        # Common/Shared feature
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── Sidebar.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── MainLayout.tsx
│   │       │   ├── NotificationCenter.tsx
│   │       │   ├── LanguageSwitcher.tsx
│   │       │   ├── ThemeSwitcher.tsx
│   │       │   └── index.ts
│   │       │
│   │       ├── hooks/
│   │       │   ├── useNotifications.ts
│   │       │   ├── useLanguage.ts
│   │       │   └── useTheme.ts
│   │       │
│   │       ├── services/
│   │       │   └── notificationService.ts
│   │       │
│   │       ├── store/
│   │       │   ├── uiSlice.ts
│   │       │   ├── uiSelectors.ts
│   │       │   ├── notificationSlice.ts
│   │       │   └── types.ts
│   │       │
│   │       └── index.ts
│   │
│   ├── shared/                            # Truly shared code
│   │   ├── components/                    # Generic reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.module.css
│   │   │   │
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Card.module.css
│   │   │   │
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── Modal.module.css
│   │   │   │
│   │   │   ├── Form/
│   │   │   │   ├── TextField.tsx
│   │   │   │   ├── SelectField.tsx
│   │   │   │   ├── CheckboxField.tsx
│   │   │   │   ├── DateField.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   │
│   │   │   ├── Table/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   └── Table.module.css
│   │   │   │
│   │   │   ├── Loading/
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── PageLoader.tsx
│   │   │   │
│   │   │   ├── Alert/
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Alert.module.css
│   │   │   │
│   │   │   ├── Navigation/
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── Stepper.tsx
│   │   │   │
│   │   │   └── index.ts                   # Component exports
│   │   │
│   │   ├── hooks/                         # Global reusable hooks
│   │   │   ├── useApi.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useWindowSize.ts
│   │   │   ├── usePrevious.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── client.ts              # Axios instance
│   │   │   │   ├── interceptors.ts        # Request/response interceptors
│   │   │   │   ├── errorHandler.ts        # Error handling
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   ├── localStorage.ts
│   │   │   │   ├── sessionStorage.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                         # Global utilities
│   │   │   ├── formatters.ts              # Format functions
│   │   │   ├── validators.ts              # Validation functions
│   │   │   ├── dateUtils.ts               # Date utilities
│   │   │   ├── stringUtils.ts             # String utilities
│   │   │   ├── arrayUtils.ts              # Array utilities
│   │   │   ├── objectUtils.ts             # Object utilities
│   │   │   ├── errorUtils.ts              # Error utilities
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                         # Global types
│   │   │   ├── common.types.ts
│   │   │   ├── api.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/                     # Global constants
│   │   │   ├── httpStatus.ts
│   │   │   ├── errorMessages.ts
│   │   │   ├── apiEndpoints.ts
│   │   │   ├── userRoles.ts
│   │   │   ├── permissions.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── store/                             # Redux store (root)
│   │   ├── index.ts                       # Store configuration
│   │   ├── rootReducer.ts                 # Root reducer
│   │   ├── hooks.ts                       # Typed hooks (useAppDispatch, useAppSelector)
│   │   └── middleware/
│   │       ├── logger.ts
│   │       ├── errorHandler.ts
│   │       └── index.ts
│   │
│   ├── styles/                            # Global styles
│   │   ├── globals.css
│   │   ├── variables.css                  # CSS variables
│   │   ├── breakpoints.css                # Responsive breakpoints
│   │   ├── animations.css
│   │   └── theme.css
│   │
│   ├── i18n/                              # Internationalization
│   │   ├── i18n.config.ts                 # i18n configuration
│   │   ├── locales/
│   │   │   ├── en.json                    # English translations
│   │   │   └── ar.json                    # Arabic translations
│   │   └── hooks/
│   │       ├── useTranslation.ts
│   │       └── useLanguage.ts
│   │
│   ├── routes/                            # Route definitions
│   │   ├── routes.tsx                     # Main routes
│   │   ├── PrivateRoute.tsx               # Private route wrapper
│   │   ├── RoleBasedRoute.tsx             # Role-based route
│   │   ├── PermissionRoute.tsx            # Permission-based route
│   │   └── routeConfig.ts                 # Route configuration
│   │
│   ├── theme/                             # Theme configuration
│   │   ├── theme.ts                       # Theme factory
│   │   ├── lightTheme.ts                  # Light theme
│   │   ├── darkTheme.ts                   # Dark theme
│   │   ├── colors.ts                      # Color palette
│   │   └── typography.ts                  # Typography config
│   │
│   └── index.css                          # Root styles
│
├── public/                                # Static assets
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── assets/
│       ├── images/
│       ├── icons/
│       ├── fonts/
│       └── docs/
│
├── __tests__/                             # Test root
│   ├── unit/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── components/
│   │
│   ├── integration/
│   │   ├── auth.integration.test.ts
│   │   ├── events.integration.test.ts
│   │   └── api.integration.test.ts
│   │
│   ├── e2e/
│   │   ├── auth.e2e.test.ts
│   │   ├── events.e2e.test.ts
│   │   └── workflow.e2e.test.ts
│   │
│   ├── fixtures/
│   │   ├── users.fixture.ts
│   │   ├── events.fixture.ts
│   │   └── responses.fixture.ts
│   │
│   └── mocks/
│       ├── handlers.ts
│       └── server.ts
│
├── .env.example                           # Environment template
├── .env.development                       # Dev environment
├── .env.testing                           # Testing environment
├── .env.production                        # Production environment
├── .eslintrc.json                         # ESLint config
├── .prettierrc                            # Prettier config
├── tsconfig.json                          # TypeScript config
├── vite.config.ts                         # Vite config
├── jest.config.js                         # Jest config
├── vitest.config.ts                       # Vitest config (optional)
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

## Core Technologies

### 1. Vite Configuration

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@constants': path.resolve(__dirname, './src/shared/constants'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@mui/material', '@mui/icons-material'],
          'state': ['@reduxjs/toolkit', 'react-redux'],
          'http': ['axios'],
        },
      },
    },
  },
})
```

---

## State Management

### Redux Toolkit Setup

**store/index.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import rootReducer from './rootReducer'
import { logger } from './middleware/logger'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuthData'],
        ignoredPaths: ['auth.user'],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

**store/rootReducer.ts**
```typescript
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@features/auth/store/authSlice'
import eventReducer from '@features/events/store/eventSlice'
import csrReducer from '@features/csr/store/csrSlice'
import uiReducer from '@features/common/store/uiSlice'
import notificationReducer from '@features/common/store/notificationSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventReducer,
  csr: csrReducer,
  ui: uiReducer,
  notifications: notificationReducer,
})

export default rootReducer
```

### Redux Slice Example

**features/auth/store/authSlice.ts**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@features/auth/services/authService'
import { AuthState, LoginCredentials, User } from './types'

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })

    // Get Current User
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
```

### Redux Selectors

**features/auth/store/authSelectors.ts**
```typescript
import { RootState } from '@store'

export const selectAuthState = (state: RootState) => state.auth

export const selectUser = (state: RootState) => state.auth.user

export const selectIsAuthenticated = (state: RootState) => 
  state.auth.isAuthenticated

export const selectAuthToken = (state: RootState) => state.auth.token

export const selectAuthLoading = (state: RootState) => state.auth.isLoading

export const selectAuthError = (state: RootState) => state.auth.error

export const selectUserRole = (state: RootState) => state.auth.user?.role

export const selectUserPermissions = (state: RootState) => 
  state.auth.user?.permissions || []

export const selectHasPermission = (permission: string) => 
  (state: RootState) => {
    const permissions = state.auth.user?.permissions || []
    return permissions.includes(permission)
  }

export const selectHasAnyRole = (roles: string[]) =>
  (state: RootState) => {
    const userRole = state.auth.user?.role
    return roles.includes(userRole!)
  }
```

---

## Routing Architecture

### Private Route

**routes/PrivateRoute.tsx**
```typescript
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@store'
import { selectIsAuthenticated, selectAuthLoading } from '@features/auth/store/authSelectors'
import { PageLoader } from '@shared/components'

interface PrivateRouteProps {
  children: React.ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)

  if (isLoading) {
    return <PageLoader />
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  )
}
```

### Role-Based Route

**routes/RoleBasedRoute.tsx**
```typescript
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@store'
import { selectUserRole } from '@features/auth/store/authSelectors'
import { PrivateRoute } from './PrivateRoute'

interface RoleBasedRouteProps {
  children: React.ReactNode
  requiredRoles: string[]
  fallback?: string
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRoles,
  fallback = '/dashboard',
}) => {
  const userRole = useAppSelector(selectUserRole)

  return (
    <PrivateRoute>
      {userRole && requiredRoles.includes(userRole) ? (
        <>{children}</>
      ) : (
        <Navigate to={fallback} replace />
      )}
    </PrivateRoute>
  )
}
```

### Permission-Based Route

**routes/PermissionRoute.tsx**
```typescript
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@store'
import { selectUserPermissions } from '@features/auth/store/authSelectors'
import { PrivateRoute } from './PrivateRoute'

interface PermissionRouteProps {
  children: React.ReactNode
  requiredPermissions: string[]
  requireAll?: boolean // true = all permissions, false = any permission
  fallback?: string
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  requiredPermissions,
  requireAll = false,
  fallback = '/dashboard',
}) => {
  const userPermissions = useAppSelector(selectUserPermissions)

  const hasPermission = requireAll
    ? requiredPermissions.every((perm) => userPermissions.includes(perm))
    : requiredPermissions.some((perm) => userPermissions.includes(perm))

  return (
    <PrivateRoute>
      {hasPermission ? (
        <>{children}</>
      ) : (
        <Navigate to={fallback} replace />
      )}
    </PrivateRoute>
  )
}
```

### Routes Configuration

**routes/routes.tsx**
```typescript
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { MainLayout } from '@features/common/components'
import { PrivateRoute } from './PrivateRoute'
import { RoleBasedRoute } from './RoleBasedRoute'
import { PermissionRoute } from './PermissionRoute'

// Auth pages (Lazy loaded)
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'))

// Dashboard (Lazy loaded)
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'))

// Events (Lazy loaded)
const EventsListPage = lazy(() => import('@features/events/pages/EventsListPage'))
const EventDetailPage = lazy(() => import('@features/events/pages/EventDetailPage'))
const EventCreatePage = lazy(() => import('@features/events/pages/EventCreatePage'))

// CSR (Lazy loaded)
const CSRDashboardPage = lazy(() => import('@features/csr/pages/CSRDashboardPage'))
const CampaignsPage = lazy(() => import('@features/csr/pages/CampaignsPage'))

// Admin (Lazy loaded)
const AdminDashboardPage = lazy(() => import('@features/admin/pages/AdminDashboardPage'))
const UsersPage = lazy(() => import('@features/admin/pages/UsersPage'))
const RolesPage = lazy(() => import('@features/admin/pages/RolesPage'))

// Error pages
const NotFoundPage = () => <div>404 - Page Not Found</div>

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },

      // Protected routes
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },

      // Events routes
      {
        path: 'events',
        element: (
          <PermissionRoute requiredPermissions={['events.read']}>
            <EventsListPage />
          </PermissionRoute>
        ),
      },
      {
        path: 'events/:id',
        element: (
          <PermissionRoute requiredPermissions={['events.read']}>
            <EventDetailPage />
          </PermissionRoute>
        ),
      },
      {
        path: 'events/create',
        element: (
          <PermissionRoute requiredPermissions={['events.create']}>
            <EventCreatePage />
          </PermissionRoute>
        ),
      },

      // CSR routes (Role-based)
      {
        path: 'csr',
        element: (
          <RoleBasedRoute requiredRoles={['csr_manager', 'admin']}>
            <CSRDashboardPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'csr/campaigns',
        element: (
          <RoleBasedRoute requiredRoles={['csr_manager', 'admin']}>
            <CampaignsPage />
          </RoleBasedRoute>
        ),
      },

      // Admin routes
      {
        path: 'admin',
        element: (
          <RoleBasedRoute requiredRoles={['admin', 'super_admin']}>
            <AdminDashboardPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <PermissionRoute requiredPermissions={['users.read']}>
            <UsersPage />
          </PermissionRoute>
        ),
      },
      {
        path: 'admin/roles',
        element: (
          <PermissionRoute requiredPermissions={['roles.read']}>
            <RolesPage />
          </PermissionRoute>
        ),
      },

      // 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
```

---

## API Integration

### Axios Client Setup

**shared/services/api/client.ts**
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios'
import { store } from '@store'
import { logoutUser } from '@features/auth/store/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        localStorage.setItem('accessToken', response.data.token)
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`
        return client(originalRequest)
      } catch (refreshError) {
        store.dispatch(logoutUser())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden')
    }

    return Promise.reject(error)
  }
)

export default client
```

### Service Example

**features/events/services/eventService.ts**
```typescript
import client from '@shared/services/api/client'
import { Event, EventCreateDTO, EventUpdateDTO, PaginatedResponse } from '../store/types'

export const eventService = {
  // List events with pagination and filters
  async listEvents(params: {
    page?: number
    limit?: number
    categoryId?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Event>> {
    const { data } = await client.get('/events', { params })
    return data
  },

  // Get event by ID
  async getEventById(id: number): Promise<Event> {
    const { data } = await client.get(`/events/${id}`)
    return data
  },

  // Create event
  async createEvent(event: EventCreateDTO): Promise<Event> {
    const { data } = await client.post('/events', event)
    return data
  },

  // Update event
  async updateEvent(id: number, event: EventUpdateDTO): Promise<Event> {
    const { data } = await client.put(`/events/${id}`, event)
    return data
  },

  // Delete event
  async deleteEvent(id: number): Promise<void> {
    await client.delete(`/events/${id}`)
  },

  // Publish event
  async publishEvent(id: number): Promise<Event> {
    const { data } = await client.post(`/events/${id}/publish`, {})
    return data
  },

  // Cancel event
  async cancelEvent(id: number, reason: string): Promise<Event> {
    const { data } = await client.post(`/events/${id}/cancel`, { reason })
    return data
  },
}
```

---

## Component Architecture

### Reusable Component Example

**shared/components/Button/Button.tsx**
```typescript
import React from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material'
import styles from './Button.module.css'

interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean
  loadingText?: string
}

export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      disabled={disabled || isLoading}
      className={styles.button}
    >
      {isLoading ? (
        <>
          <CircularProgress size={20} sx={{ marginRight: 1 }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </MuiButton>
  )
}
```

### Feature Component with Redux

**features/events/pages/EventsListPage.tsx**
```typescript
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store'
import { fetchEvents } from '../store/eventSlice'
import {
  selectEvents,
  selectEventsLoading,
  selectEventsError,
} from '../store/eventSelectors'
import { EventList } from '../components/EventList'
import { EventFilter } from '../components/EventFilter'
import { PageLoader, Alert } from '@shared/components'
import { Container, Box, Pagination } from '@mui/material'

export default function EventsListPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector(selectEvents)
  const isLoading = useAppSelector(selectEventsLoading)
  const error = useAppSelector(selectEventsError)

  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    categoryId: undefined,
    status: undefined,
    search: '',
  })

  useEffect(() => {
    dispatch(
      fetchEvents({
        page,
        limit: 10,
        ...filters,
      })
    )
  }, [dispatch, page, filters])

  if (isLoading) return <PageLoader />
  if (error) return <Alert severity="error" message={error} />

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <EventFilter onFilterChange={setFilters} />
        <EventList events={events} />
        <Pagination count={10} page={page} onChange={(_, value) => setPage(value)} />
      </Box>
    </Container>
  )
}
```

---

## Theme Management

### Theme Configuration

**theme/theme.ts**
```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles'
import { colors } from './colors'
import { typography } from './typography'

export const baseThemeOptions: ThemeOptions = {
  typography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
}

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    ...baseThemeOptions,
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: colors.light.primary,
              light: colors.light.primaryLight,
              dark: colors.light.primaryDark,
            },
            secondary: {
              main: colors.light.secondary,
            },
            background: {
              default: colors.light.background,
              paper: colors.light.paper,
            },
          }
        : {
            primary: {
              main: colors.dark.primary,
              light: colors.dark.primaryLight,
              dark: colors.dark.primaryDark,
            },
            secondary: {
              main: colors.dark.secondary,
            },
            background: {
              default: colors.dark.background,
              paper: colors.dark.paper,
            },
          }),
    },
  })
}
```

### Theme Context & Hook

**shared/hooks/useTheme.ts**
```typescript
import { useContext, createContext, useState, useCallback, useEffect } from 'react'

interface ThemeContextType {
  mode: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark') => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const useThemeProvider = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme-mode')
    return (stored as 'light' | 'dark') || 'light'
  })

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }, [])

  const setTheme = useCallback((newMode: 'light' | 'dark') => {
    setMode(newMode)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  return { mode, toggleTheme, setTheme }
}
```

---

## Environment Configuration

### Environment Variables

**.env.example**
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=accessToken
VITE_AUTH_REFRESH_TOKEN_KEY=refreshToken

# Application
VITE_APP_NAME=Stakeholder Engagement Platform
VITE_APP_VERSION=1.0.0
VITE_APP_TIMEZONE=Asia/Dubai

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
VITE_SENTRY_DSN=

# Logging
VITE_LOG_LEVEL=info

# Environment
VITE_ENVIRONMENT=development
```

**src/config/env.config.ts**
```typescript
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[`VITE_${key}`]
  if (!value && !defaultValue) {
    console.warn(`Environment variable VITE_${key} is not defined`)
    return defaultValue || ''
  }
  return value || defaultValue || ''
}

export const envConfig = {
  // API
  apiUrl: getEnvVariable('API_URL', 'http://localhost:3001/api'),
  apiTimeout: parseInt(getEnvVariable('API_TIMEOUT', '30000')),

  // Auth
  authTokenKey: getEnvVariable('AUTH_TOKEN_KEY', 'accessToken'),
  authRefreshTokenKey: getEnvVariable('AUTH_REFRESH_TOKEN_KEY', 'refreshToken'),

  // App
  appName: getEnvVariable('APP_NAME', 'Stakeholder Engagement Platform'),
  appVersion: getEnvVariable('APP_VERSION', '1.0.0'),
  appTimezone: getEnvVariable('APP_TIMEZONE', 'Asia/Dubai'),

  // Features
  enableAnalytics: getEnvVariable('ENABLE_ANALYTICS', 'false') === 'true',
  enableSentry: getEnvVariable('ENABLE_SENTRY', 'false') === 'true',
  sentryDsn: getEnvVariable('SENTRY_DSN'),

  // Logging
  logLevel: getEnvVariable('LOG_LEVEL', 'info'),

  // Environment
  environment: getEnvVariable('ENVIRONMENT', 'development'),
  isDevelopment: getEnvVariable('ENVIRONMENT', 'development') === 'development',
  isProduction: getEnvVariable('ENVIRONMENT', 'development') === 'production',
}
```

---

## Authentication & Authorization

### Custom Auth Hook

**features/auth/hooks/useAuth.ts**
```typescript
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store'
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  clearError,
} from '../store/authSlice'
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserPermissions,
  selectUserRole,
} from '../store/authSelectors'
import { LoginCredentials } from '../store/types'

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const permissions = useAppSelector(selectUserPermissions)
  const role = useAppSelector(selectUserRole)

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials))
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    return dispatch(logoutUser())
  }, [dispatch])

  const getCurrentUserData = useCallback(async () => {
    return dispatch(getCurrentUser())
  }, [dispatch])

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (permissionList: string[]) =>
      permissionList.some((perm) => permissions.includes(perm)),
    [permissions]
  )

  const hasAllPermissions = useCallback(
    (permissionList: string[]) =>
      permissionList.every((perm) => permissions.includes(perm)),
    [permissions]
  )

  const hasRole = useCallback(
    (roleList: string[]) => roleList.includes(role || ''),
    [role]
  )

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    permissions,
    role,

    // Actions
    login,
    logout,
    getCurrentUserData,
    clearError: () => dispatch(clearError()),

    // Helpers
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  }
}
```

### Permission-Based Menu

**features/common/components/Sidebar.tsx**
```typescript
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import { useAuth } from '@features/auth/hooks/useAuth'
import { selectUserPermissions } from '@features/auth/store/authSelectors'
import { useAppSelector } from '@store'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventIcon from '@mui/icons-material/Event'
import AdminIcon from '@mui/icons-material/AdminPanelSettings'

interface MenuItem {
  label: string
  path?: string
  icon?: React.ReactNode
  requiredPermission?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    requiredPermission: 'dashboard.read',
  },
  {
    label: 'Events',
    icon: <EventIcon />,
    requiredPermission: 'events.read',
    children: [
      { label: 'List Events', path: '/events', requiredPermission: 'events.read' },
      {
        label: 'Create Event',
        path: '/events/create',
        requiredPermission: 'events.create',
      },
    ],
  },
  {
    label: 'Admin',
    icon: <AdminIcon />,
    requiredPermission: 'admin.access',
    children: [
      { label: 'Users', path: '/admin/users', requiredPermission: 'users.read' },
      { label: 'Roles', path: '/admin/roles', requiredPermission: 'roles.read' },
      {
        label: 'Settings',
        path: '/admin/settings',
        requiredPermission: 'admin.settings',
      },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const permissions = useAppSelector(selectUserPermissions)

  const visibleMenuItems = useMemo(() => {
    return menuItems
      .filter((item) => !item.requiredPermission || permissions.includes(item.requiredPermission))
      .map((item) => ({
        ...item,
        children: item.children?.filter(
          (child) => !child.requiredPermission || permissions.includes(child.requiredPermission)
        ),
      }))
  }, [permissions])

  return (
    <List>
      {visibleMenuItems.map((item) => (
        <div key={item.label}>
          <ListItem
            button
            onClick={() => item.path && navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {item.children && item.children.length > 0 && <ExpandMore />}
          </ListItem>
          {item.children && item.children.length > 0 && (
            <Collapse in={true} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItem
                    key={child.label}
                    button
                    sx={{ pl: 4 }}
                    onClick={() => child.path && navigate(child.path)}
                  >
                    <ListItemText primary={child.label} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </div>
      ))}
    </List>
  )
}
```

---

## Performance Optimization

### Lazy Loading

**routes/routes.tsx (Already shown above with lazy imports)**
```typescript
import { lazy, Suspense } from 'react'
import { PageLoader } from '@shared/components'

// Lazy load pages
const EventsListPage = lazy(() => import('@features/events/pages/EventsListPage'))
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'))

// Wrap with Suspense
const routes = [
  {
    path: '/events',
    element: (
      <Suspense fallback={<PageLoader />}>
        <EventsListPage />
      </Suspense>
    ),
  },
]
```

### Code Splitting with Routes

**vite.config.ts (Already shown above)**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui': ['@mui/material', '@mui/icons-material'],
        'state': ['@reduxjs/toolkit', 'react-redux'],
        'http': ['axios'],
      },
    },
  },
},
```

### Memoization & useMemo

**features/events/components/EventList.tsx**
```typescript
import { useMemo } from 'react'
import { Event } from '../store/types'
import { EventCard } from './EventCard'
import { Grid } from '@mui/material'

interface EventListProps {
  events: Event[]
  onEventClick?: (event: Event) => void
}

export const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  // Memoize sorted/filtered events
  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
  }, [events])

  return (
    <Grid container spacing={3}>
      {sortedEvents.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <EventCard event={event} onClick={() => onEventClick?.(event)} />
        </Grid>
      ))}
    </Grid>
  )
}
```

---

## Best Practices

### 1. **TypeScript Usage**
- Always define types for props and state
- Use interfaces for component props
- Export types from feature types file

### 2. **Redux Best Practices**
- Use slices for modular state
- Create selectors for state queries
- Use async thunks for API calls
- Keep reducers pure

### 3. **Component Design**
- Keep components focused and single-purpose
- Use feature-based folder structure
- Extract reusable logic into hooks
- Prefer composition over inheritance

### 4. **Performance**
- Lazy load routes and heavy components
- Use React.memo for expensive components
- Memoize callbacks and computed values
- Implement pagination for large lists

### 5. **Error Handling**
- Create custom error boundaries
- Handle API errors consistently
- Show user-friendly error messages

### 6. **Testing**
- Write unit tests for utilities
- Test components in isolation
- Mock API responses
- Test user interactions

### 7. **Code Organization**
- Keep files small (< 300 lines)
- One component per file
- Group related functionality
- Clear naming conventions

---

## File Examples

### Complete Login Flow

**features/auth/pages/LoginPage.tsx**
```typescript
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Paper, Box, Typography } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from '../components/LoginForm'
import { LoginCredentials } from '../store/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, isLoading, error } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from)
    }
  }, [isAuthenticated, navigate, location])

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await login(credentials)
    if (!result.payload?.token) {
      // Error is handled by Redux
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign In
          </Typography>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
        </Paper>
      </Box>
    </Container>
  )
}
```

**features/auth/components/LoginForm.tsx**
```typescript
import { useForm, Controller } from 'react-hook-form'
import { TextField, Box, Alert } from '@mui/material'
import { Button } from '@shared/components'
import { LoginCredentials } from '../store/types'

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const { handleSubmit, control, formState: { errors } } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          isLoading={isLoading}
          loadingText="Signing in..."
        >
          Sign In
        </Button>
      </Box>
    </form>
  )
}
```

---

## Summary

This React architecture provides:

✅ **Modern Stack** - React 18, Vite, TypeScript  
✅ **State Management** - Redux Toolkit with best practices  
✅ **Routing** - Private, role-based, and permission-based routes  
✅ **Performance** - Code splitting, lazy loading, memoization  
✅ **Scalability** - Feature-based folder structure  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Testing** - Unit, integration, and E2E test structure  
✅ **Accessibility** - Material-UI built-in a11y  
✅ **Theme** - Light/dark mode support  
✅ **Environment** - Multi-environment configuration  

**Production-Ready Architecture Complete!** 🎉

*Last Updated: July 2026*
