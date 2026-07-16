# Enterprise Folder Structure - Stakeholder Engagement Platform

**Technology Stack:** React 18+ | Node.js 18+ LTS | MySQL 8.0+  
**Environments:** Development | Testing | Production  
**Status:** Enterprise-Grade Architecture  
**Date:** July 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Directory Tree](#directory-tree)
3. [Detailed Folder Explanations](#detailed-folder-explanations)
4. [File Naming Conventions](#file-naming-conventions)
5. [Environment Configuration](#environment-configuration)
6. [Best Practices](#best-practices)

---

## Overview

This folder structure follows enterprise standards and best practices for:
- **Scalability** - Supports 10+ developers on parallel features
- **Maintainability** - Clear separation of concerns
- **DevOps** - Multi-environment deployment
- **Testing** - Comprehensive test coverage (>80%)
- **Documentation** - Self-documenting code organization
- **CI/CD** - Automated testing and deployment pipelines

---

## Directory Tree

```
stakeholder-engagement-platform/
├── frontend/                              # React 18+ Frontend Application
│   ├── public/                            # Static assets (public)
│   │   ├── index.html                     # Main HTML entry point
│   │   ├── favicon.ico                    # Application favicon
│   │   ├── manifest.json                  # PWA manifest
│   │   ├── robots.txt                     # SEO robots file
│   │   └── assets/                        # Static assets
│   │       ├── images/                    # PNG, JPG, SVG images
│   │       ├── icons/                     # Icon files
│   │       ├── fonts/                     # Web fonts
│   │       └── docs/                      # Static documentation
│   │
│   ├── src/                               # Source code
│   │   ├── index.tsx                      # React entry point
│   │   ├── App.tsx                        # Root component
│   │   ├── App.css                        # Global styles
│   │   │
│   │   ├── config/                        # Configuration files
│   │   │   ├── constants.ts               # Application constants
│   │   │   ├── api.config.ts              # API endpoints configuration
│   │   │   ├── theme.config.ts            # Material-UI theme configuration
│   │   │   ├── routes.config.ts           # Route configuration
│   │   │   └── env.config.ts              # Environment configuration
│   │   │
│   │   ├── pages/                         # Page components (route-based)
│   │   │   ├── HomePage.tsx               # Home page
│   │   │   ├── LoginPage.tsx              # Login page
│   │   │   ├── DashboardPage.tsx          # Dashboard
│   │   │   ├── EventsPage.tsx             # Events listing
│   │   │   ├── EventDetailPage.tsx        # Event details
│   │   │   ├── EventCreatePage.tsx        # Event creation
│   │   │   ├── CSRPage.tsx                # CSR management
│   │   │   ├── RegistrationPage.tsx       # Registration management
│   │   │   ├── FeedbackPage.tsx           # Feedback/surveys
│   │   │   ├── ReportsPage.tsx            # Reports & analytics
│   │   │   ├── AdminPage.tsx              # Admin panel
│   │   │   ├── NotFoundPage.tsx           # 404 page
│   │   │   ├── ErrorPage.tsx              # Error page
│   │   │   └── index.ts                   # Page exports
│   │   │
│   │   ├── components/                    # Reusable components
│   │   │   ├── Layout/                    # Layout components
│   │   │   │   ├── MainLayout.tsx         # Main layout wrapper
│   │   │   │   ├── Header.tsx             # Header/navbar
│   │   │   │   ├── Sidebar.tsx            # Sidebar navigation
│   │   │   │   ├── Footer.tsx             # Footer component
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   ├── Common/                    # Common reusable components
│   │   │   │   ├── Button.tsx             # Reusable button
│   │   │   │   ├── Modal.tsx              # Modal dialog
│   │   │   │   ├── Spinner.tsx            # Loading spinner
│   │   │   │   ├── Alert.tsx              # Alert component
│   │   │   │   ├── Badge.tsx              # Badge component
│   │   │   │   ├── Card.tsx               # Card component
│   │   │   │   ├── Pagination.tsx         # Pagination component
│   │   │   │   ├── EmptyState.tsx         # Empty state component
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   ├── Forms/                     # Form components
│   │   │   │   ├── LoginForm.tsx          # Login form
│   │   │   │   ├── EventForm.tsx          # Event creation/edit form
│   │   │   │   ├── CSRForm.tsx            # CSR campaign form
│   │   │   │   ├── RegistrationForm.tsx   # Registration form
│   │   │   │   ├── FeedbackForm.tsx       # Feedback form
│   │   │   │   ├── SurveyForm.tsx         # Survey form
│   │   │   │   ├── FormField.tsx          # Reusable form field
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   ├── Events/                    # Event-specific components
│   │   │   │   ├── EventCard.tsx          # Event card component
│   │   │   │   ├── EventList.tsx          # Events list view
│   │   │   │   ├── EventDetails.tsx       # Event details view
│   │   │   │   ├── EventFilter.tsx        # Event filtering
│   │   │   │   ├── EventSearch.tsx        # Event search
│   │   │   │   ├── EventCalendar.tsx      # Event calendar view
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   ├── Dashboard/                 # Dashboard components
│   │   │   │   ├── DashboardWidget.tsx    # Dashboard widget
│   │   │   │   ├── StatCard.tsx           # Statistics card
│   │   │   │   ├── Chart.tsx              # Chart component
│   │   │   │   ├── MetricsPanel.tsx       # Metrics panel
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   ├── Admin/                     # Admin components
│   │   │   │   ├── UserManagement.tsx     # User management
│   │   │   │   ├── RoleManagement.tsx     # Role management
│   │   │   │   ├── SettingsPanel.tsx      # Settings panel
│   │   │   │   ├── AuditLogs.tsx          # Audit logs viewer
│   │   │   │   └── index.ts               # Component exports
│   │   │   │
│   │   │   └── index.ts                   # All component exports
│   │   │
│   │   ├── hooks/                         # Custom React hooks
│   │   │   ├── useAuth.ts                 # Authentication hook
│   │   │   ├── useFetch.ts                # Data fetching hook
│   │   │   ├── useApi.ts                  # API call hook
│   │   │   ├── useForm.ts                 # Form handling hook
│   │   │   ├── useLocalStorage.ts         # Local storage hook
│   │   │   ├── useDebounce.ts             # Debounce hook
│   │   │   ├── useTheme.ts                # Theme hook
│   │   │   ├── usePagination.ts           # Pagination hook
│   │   │   └── index.ts                   # Hook exports
│   │   │
│   │   ├── services/                      # API services & business logic
│   │   │   ├── api/                       # API client configuration
│   │   │   │   ├── client.ts              # Axios/HTTP client
│   │   │   │   ├── interceptors.ts        # Request/response interceptors
│   │   │   │   └── errorHandler.ts        # Error handling logic
│   │   │   │
│   │   │   ├── auth/                      # Authentication services
│   │   │   │   ├── authService.ts         # Auth API calls
│   │   │   │   ├── tokenService.ts        # Token management
│   │   │   │   └── ldapService.ts         # LDAP integration
│   │   │   │
│   │   │   ├── events/                    # Event services
│   │   │   │   ├── eventService.ts        # Event API calls
│   │   │   │   ├── eventProposalService.ts
│   │   │   │   ├── registrationService.ts # Registration API calls
│   │   │   │   └── feedbackService.ts     # Feedback API calls
│   │   │   │
│   │   │   ├── csr/                       # CSR services
│   │   │   │   ├── csrService.ts          # CSR campaign API calls
│   │   │   │   └── volunteerService.ts    # Volunteer API calls
│   │   │   │
│   │   │   ├── notifications/             # Notification services
│   │   │   │   └── notificationService.ts # Notification API calls
│   │   │   │
│   │   │   ├── user/                      # User services
│   │   │   │   ├── userService.ts         # User API calls
│   │   │   │   └── profileService.ts      # Profile management
│   │   │   │
│   │   │   ├── admin/                     # Admin services
│   │   │   │   ├── adminService.ts        # Admin API calls
│   │   │   │   └── auditService.ts        # Audit log API calls
│   │   │   │
│   │   │   └── index.ts                   # Service exports
│   │   │
│   │   ├── store/                         # State management (Redux Toolkit)
│   │   │   ├── index.ts                   # Store configuration
│   │   │   ├── rootReducer.ts             # Root reducer
│   │   │   │
│   │   │   ├── slices/                    # Redux slices
│   │   │   │   ├── authSlice.ts           # Auth state
│   │   │   │   ├── userSlice.ts           # User state
│   │   │   │   ├── eventSlice.ts          # Event state
│   │   │   │   ├── csrSlice.ts            # CSR state
│   │   │   │   ├── uiSlice.ts             # UI state
│   │   │   │   ├── notificationSlice.ts   # Notification state
│   │   │   │   └── index.ts               # Slice exports
│   │   │   │
│   │   │   ├── selectors/                 # Redux selectors
│   │   │   │   ├── authSelectors.ts       # Auth selectors
│   │   │   │   ├── eventSelectors.ts      # Event selectors
│   │   │   │   ├── userSelectors.ts       # User selectors
│   │   │   │   └── index.ts               # Selector exports
│   │   │   │
│   │   │   └── middleware/                # Custom Redux middleware
│   │   │       └── logger.ts              # Logger middleware
│   │   │
│   │   ├── styles/                        # Global styles
│   │   │   ├── globals.css                # Global CSS
│   │   │   ├── variables.css              # CSS variables
│   │   │   ├── breakpoints.css            # Responsive breakpoints
│   │   │   └── animations.css             # Animations
│   │   │
│   │   ├── utils/                         # Utility functions
│   │   │   ├── formatters.ts              # Data formatters
│   │   │   ├── validators.ts              # Input validators
│   │   │   ├── dateUtils.ts               # Date utilities
│   │   │   ├── stringUtils.ts             # String utilities
│   │   │   ├── storageUtils.ts            # Storage utilities
│   │   │   ├── errorUtils.ts              # Error handling
│   │   │   ├── apiUtils.ts                # API utilities
│   │   │   └── index.ts                   # Utility exports
│   │   │
│   │   ├── constants/                     # Application constants
│   │   │   ├── apiEndpoints.ts            # API endpoint URLs
│   │   │   ├── messages.ts                # Error & success messages
│   │   │   ├── eventStatus.ts             # Event status constants
│   │   │   ├── userRoles.ts               # User role constants
│   │   │   └── index.ts                   # Constant exports
│   │   │
│   │   ├── types/                         # TypeScript type definitions
│   │   │   ├── index.ts                   # Type re-exports
│   │   │   ├── auth.types.ts              # Auth types
│   │   │   ├── user.types.ts              # User types
│   │   │   ├── event.types.ts             # Event types
│   │   │   ├── csr.types.ts               # CSR types
│   │   │   ├── common.types.ts            # Common types
│   │   │   └── api.types.ts               # API response types
│   │   │
│   │   ├── i18n/                          # Internationalization
│   │   │   ├── i18n.config.ts             # i18n configuration
│   │   │   ├── locales/                   # Translation files
│   │   │   │   ├── en.json                # English translations
│   │   │   │   └── ar.json                # Arabic translations
│   │   │   └── hooks/                     # i18n hooks
│   │   │
│   │   └── App.test.tsx                   # App component tests
│   │
│   ├── __tests__/                         # Test files (parallel with src)
│   │   ├── unit/                          # Unit tests
│   │   │   ├── components/                # Component unit tests
│   │   │   ├── services/                  # Service unit tests
│   │   │   ├── utils/                     # Utility function tests
│   │   │   └── hooks/                     # Hook tests
│   │   │
│   │   ├── integration/                   # Integration tests
│   │   │   ├── auth.integration.test.ts   # Auth flow tests
│   │   │   ├── events.integration.test.ts # Event flow tests
│   │   │   └── api.integration.test.ts    # API integration tests
│   │   │
│   │   ├── e2e/                           # End-to-end tests (Cypress/Playwright)
│   │   │   ├── auth.e2e.test.ts           # Auth E2E tests
│   │   │   ├── events.e2e.test.ts         # Events E2E tests
│   │   │   ├── registration.e2e.test.ts   # Registration E2E tests
│   │   │   └── admin.e2e.test.ts          # Admin E2E tests
│   │   │
│   │   └── performance/                   # Performance tests
│   │       └── lighthouse.test.ts         # Lighthouse performance tests
│   │
│   ├── .env.example                       # Example environment variables
│   ├── .env.development                   # Dev environment variables
│   ├── .env.testing                       # Testing environment variables
│   ├── .env.production                    # Production environment variables
│   ├── .eslintrc.json                     # ESLint configuration
│   ├── .prettierrc                        # Prettier code formatting
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── vite.config.ts                     # Vite build configuration
│   ├── jest.config.js                     # Jest test configuration
│   ├── package.json                       # Dependencies and scripts
│   ├── package-lock.json                  # Lock file for npm
│   ├── README.md                          # Frontend README
│   └── .gitignore                         # Git ignore patterns
│
├── backend/                               # Node.js Backend Application
│   ├── src/                               # Source code
│   │   ├── index.ts                       # Application entry point
│   │   ├── app.ts                         # Express app configuration
│   │   │
│   │   ├── config/                        # Configuration files
│   │   │   ├── database.config.ts         # MySQL configuration
│   │   │   ├── server.config.ts           # Server configuration
│   │   │   ├── auth.config.ts             # Authentication configuration
│   │   │   ├── cors.config.ts             # CORS configuration
│   │   │   ├── env.config.ts              # Environment variables
│   │   │   ├── logger.config.ts           # Logger configuration
│   │   │   └── constants.ts               # Application constants
│   │   │
│   │   ├── routes/                        # API routes
│   │   │   ├── auth.routes.ts             # Authentication routes
│   │   │   ├── user.routes.ts             # User management routes
│   │   │   ├── event.routes.ts            # Event management routes
│   │   │   ├── registration.routes.ts     # Registration routes
│   │   │   ├── feedback.routes.ts         # Feedback routes
│   │   │   ├── csr.routes.ts              # CSR routes
│   │   │   ├── notification.routes.ts     # Notification routes
│   │   │   ├── approval.routes.ts         # Approval workflow routes
│   │   │   ├── admin.routes.ts            # Admin routes
│   │   │   ├── health.routes.ts           # Health check routes
│   │   │   └── index.ts                   # Route aggregation
│   │   │
│   │   ├── controllers/                   # Request handlers
│   │   │   ├── authController.ts          # Auth request handler
│   │   │   ├── userController.ts          # User request handler
│   │   │   ├── eventController.ts         # Event request handler
│   │   │   ├── registrationController.ts  # Registration request handler
│   │   │   ├── feedbackController.ts      # Feedback request handler
│   │   │   ├── csrController.ts           # CSR request handler
│   │   │   ├── notificationController.ts  # Notification request handler
│   │   │   ├── approvalController.ts      # Approval request handler
│   │   │   ├── adminController.ts         # Admin request handler
│   │   │   └── index.ts                   # Controller exports
│   │   │
│   │   ├── services/                      # Business logic
│   │   │   ├── authService.ts             # Auth business logic
│   │   │   ├── userService.ts             # User service
│   │   │   ├── eventService.ts            # Event service
│   │   │   ├── registrationService.ts     # Registration service
│   │   │   ├── feedbackService.ts         # Feedback service
│   │   │   ├── csrService.ts              # CSR service
│   │   │   ├── notificationService.ts     # Notification service
│   │   │   ├── approvalService.ts         # Approval service
│   │   │   ├── emailService.ts            # Email service
│   │   │   ├── smsService.ts              # SMS service
│   │   │   ├── reportService.ts           # Report generation
│   │   │   └── index.ts                   # Service exports
│   │   │
│   │   ├── repositories/                  # Database access layer (DAL)
│   │   │   ├── baseRepository.ts          # Base repository class
│   │   │   ├── userRepository.ts          # User repository
│   │   │   ├── eventRepository.ts         # Event repository
│   │   │   ├── registrationRepository.ts  # Registration repository
│   │   │   ├── feedbackRepository.ts      # Feedback repository
│   │   │   ├── csrRepository.ts           # CSR repository
│   │   │   ├── approvalRepository.ts      # Approval repository
│   │   │   ├── auditRepository.ts         # Audit log repository
│   │   │   └── index.ts                   # Repository exports
│   │   │
│   │   ├── models/                        # Data models & ORM entities
│   │   │   ├── User.model.ts              # User model
│   │   │   ├── Event.model.ts             # Event model
│   │   │   ├── Registration.model.ts      # Registration model
│   │   │   ├── Feedback.model.ts          # Feedback model
│   │   │   ├── CSR.model.ts               # CSR model
│   │   │   ├── Notification.model.ts      # Notification model
│   │   │   ├── AuditLog.model.ts          # Audit log model
│   │   │   └── index.ts                   # Model exports
│   │   │
│   │   ├── middleware/                    # Express middleware
│   │   │   ├── auth.middleware.ts         # Authentication middleware
│   │   │   ├── authorization.middleware.ts # Authorization middleware
│   │   │   ├── errorHandler.middleware.ts # Global error handler
│   │   │   ├── requestLogger.middleware.ts # Request logging
│   │   │   ├── rateLimiter.middleware.ts  # Rate limiting
│   │   │   ├── cors.middleware.ts         # CORS middleware
│   │   │   ├── validation.middleware.ts   # Input validation
│   │   │   └── index.ts                   # Middleware exports
│   │   │
│   │   ├── validators/                    # Input validation schemas
│   │   │   ├── auth.validator.ts          # Auth validation
│   │   │   ├── user.validator.ts          # User validation
│   │   │   ├── event.validator.ts         # Event validation
│   │   │   ├── registration.validator.ts  # Registration validation
│   │   │   ├── feedback.validator.ts      # Feedback validation
│   │   │   ├── common.validator.ts        # Common validation rules
│   │   │   └── index.ts                   # Validator exports
│   │   │
│   │   ├── utils/                         # Utility functions
│   │   │   ├── logger.ts                  # Logging utility
│   │   │   ├── errorHandler.ts            # Error handling
│   │   │   ├── dateUtils.ts               # Date utilities
│   │   │   ├── stringUtils.ts             # String utilities
│   │   │   ├── fileUtils.ts               # File handling
│   │   │   ├── emailUtils.ts              # Email utilities
│   │   │   ├── cryptoUtils.ts             # Encryption utilities
│   │   │   └── index.ts                   # Utility exports
│   │   │
│   │   ├── types/                         # TypeScript types
│   │   │   ├── index.ts                   # Type exports
│   │   │   ├── auth.types.ts              # Auth types
│   │   │   ├── user.types.ts              # User types
│   │   │   ├── event.types.ts             # Event types
│   │   │   ├── api.types.ts               # API response types
│   │   │   ├── express.types.ts           # Express extension types
│   │   │   └── database.types.ts          # Database types
│   │   │
│   │   ├── constants/                     # Constants
│   │   │   ├── httpStatus.ts              # HTTP status codes
│   │   │   ├── errorMessages.ts           # Error messages
│   │   │   ├── successMessages.ts         # Success messages
│   │   │   ├── eventStatus.ts             # Event status enum
│   │   │   ├── userRoles.ts               # User role enum
│   │   │   └── index.ts                   # Constant exports
│   │   │
│   │   ├── integrations/                  # External integrations
│   │   │   ├── email/                     # Email service
│   │   │   │   ├── emailProvider.ts       # Email provider
│   │   │   │   └── emailTemplates.ts      # Email templates
│   │   │   │
│   │   │   ├── sms/                       # SMS service
│   │   │   │   └── smsProvider.ts         # SMS provider
│   │   │   │
│   │   │   ├── ldap/                      # LDAP integration
│   │   │   │   ├── ldapClient.ts          # LDAP client
│   │   │   │   └── ldapSync.ts            # LDAP sync logic
│   │   │   │
│   │   │   ├── notifications/             # Push notifications
│   │   │   │   └── fcmService.ts          # Firebase Cloud Messaging
│   │   │   │
│   │   │   └── index.ts                   # Integration exports
│   │   │
│   │   ├── events/                        # Event emitters & listeners
│   │   │   ├── eventEmitter.ts            # Central event emitter
│   │   │   ├── eventListeners.ts          # Event listeners
│   │   │   └── index.ts                   # Event exports
│   │   │
│   │   ├── jobs/                          # Background jobs (Bull/Agenda)
│   │   │   ├── emailJob.ts                # Email sending job
│   │   │   ├── notificationJob.ts         # Notification job
│   │   │   ├── reportGenerationJob.ts     # Report generation
│   │   │   ├── dataCleanupJob.ts          # Cleanup job
│   │   │   └── index.ts                   # Job exports
│   │   │
│   │   ├── migrations/                    # Database migrations
│   │   │   ├── 001_initial_schema.ts      # Initial schema
│   │   │   ├── 002_add_fields.ts          # Add new fields
│   │   │   └── index.ts                   # Migration runner
│   │   │
│   │   ├── seeds/                         # Database seeding
│   │   │   ├── seedRoles.ts               # Seed roles
│   │   │   ├── seedPermissions.ts         # Seed permissions
│   │   │   ├── seedCategories.ts          # Seed categories
│   │   │   └── index.ts                   # Seed runner
│   │   │
│   │   └── errors/                        # Custom error classes
│   │       ├── AppError.ts                # Base app error
│   │       ├── ValidationError.ts         # Validation error
│   │       ├── AuthenticationError.ts     # Auth error
│   │       ├── AuthorizationError.ts      # Authorization error
│   │       └── index.ts                   # Error exports
│   │
│   ├── __tests__/                         # Test files
│   │   ├── unit/                          # Unit tests
│   │   │   ├── services/                  # Service tests
│   │   │   ├── controllers/               # Controller tests
│   │   │   ├── repositories/              # Repository tests
│   │   │   ├── utils/                     # Utility tests
│   │   │   └── validators/                # Validator tests
│   │   │
│   │   ├── integration/                   # Integration tests
│   │   │   ├── auth.integration.test.ts   # Auth flow tests
│   │   │   ├── events.integration.test.ts # Event API tests
│   │   │   ├── registration.integration.test.ts
│   │   │   ├── database.integration.test.ts
│   │   │   └── api.integration.test.ts    # Full API tests
│   │   │
│   │   ├── e2e/                           # End-to-end tests
│   │   │   ├── auth.e2e.test.ts           # Auth E2E tests
│   │   │   ├── events.e2e.test.ts         # Events E2E tests
│   │   │   ├── workflow.e2e.test.ts       # Workflow E2E tests
│   │   │   └── api.e2e.test.ts            # API E2E tests
│   │   │
│   │   ├── fixtures/                      # Test fixtures & mock data
│   │   │   ├── users.fixture.ts           # User test data
│   │   │   ├── events.fixture.ts          # Event test data
│   │   │   └── responses.fixture.ts       # Response mocks
│   │   │
│   │   └── mocks/                         # Mocks & stubs
│   │       ├── database.mock.ts           # Database mock
│   │       ├── services.mock.ts           # Service mocks
│   │       └── external.mock.ts           # External API mocks
│   │
│   ├── .env.example                       # Example environment file
│   ├── .env.development                   # Dev environment variables
│   ├── .env.testing                       # Testing environment variables
│   ├── .env.production                    # Production environment variables
│   ├── .eslintrc.json                     # ESLint configuration
│   ├── .prettierrc                        # Prettier configuration
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── jest.config.js                     # Jest configuration
│   ├── package.json                       # Dependencies and scripts
│   ├── package-lock.json                  # Lock file
│   ├── README.md                          # Backend README
│   └── .gitignore                         # Git ignore patterns
│
├── database/                              # Database schemas & migrations
│   ├── migrations/                        # SQL migration scripts
│   │   ├── 001_create_database.sql        # Database creation
│   │   ├── 002_create_core_tables.sql     # Core tables
│   │   ├── 003_create_event_tables.sql    # Event tables
│   │   ├── 004_create_indexes.sql         # Indexes
│   │   └── 005_initial_data.sql           # Reference data
│   │
│   ├── seeds/                             # Database seed scripts
│   │   ├── seed_roles.sql                 # Seed roles
│   │   ├── seed_permissions.sql           # Seed permissions
│   │   ├── seed_categories.sql            # Seed categories
│   │   └── seed_settings.sql              # Seed settings
│   │
│   ├── scripts/                           # Database scripts
│   │   ├── backup.sh                      # Backup script
│   │   ├── restore.sh                     # Restore script
│   │   ├── reset.sh                       # Reset database
│   │   ├── migrate.sh                     # Run migrations
│   │   └── seed.sh                        # Seed database
│   │
│   └── schema/                            # Schema documentation
│       ├── DATABASE_DESIGN.md             # Complete data model
│       ├── ERD.md                         # Entity relationship diagrams
│       └── schema.sql                     # Complete schema dump
│
├── infrastructure/                        # Infrastructure & DevOps
│   ├── docker/                            # Docker configuration
│   │   ├── Dockerfile.frontend            # Frontend Dockerfile
│   │   ├── Dockerfile.backend             # Backend Dockerfile
│   │   ├── Dockerfile.mysql               # MySQL Dockerfile
│   │   ├── docker-compose.yml             # Local dev compose
│   │   ├── docker-compose.prod.yml        # Production compose
│   │   └── .dockerignore                  # Docker ignore
│   │
│   ├── kubernetes/                        # Kubernetes manifests
│   │   ├── frontend/                      # Frontend K8s manifests
│   │   │   ├── deployment.yml             # Frontend deployment
│   │   │   ├── service.yml                # Frontend service
│   │   │   └── ingress.yml                # Ingress configuration
│   │   │
│   │   ├── backend/                       # Backend K8s manifests
│   │   │   ├── deployment.yml             # Backend deployment
│   │   │   ├── service.yml                # Backend service
│   │   │   ├── configmap.yml              # ConfigMaps
│   │   │   └── secrets.yml                # Secrets (template)
│   │   │
│   │   ├── database/                      # Database K8s manifests
│   │   │   ├── statefulset.yml            # MySQL StatefulSet
│   │   │   ├── service.yml                # Database service
│   │   │   ├── pvc.yml                    # Persistent volumes
│   │   │   └── configmap.yml              # MySQL config
│   │   │
│   │   └── monitoring/                    # Monitoring manifests
│   │       ├── prometheus.yml             # Prometheus config
│   │       └── grafana.yml                # Grafana dashboards
│   │
│   ├── terraform/                         # Infrastructure as Code (AWS/Azure)
│   │   ├── main.tf                        # Main Terraform config
│   │   ├── variables.tf                   # Variable definitions
│   │   ├── outputs.tf                     # Outputs
│   │   │
│   │   ├── modules/                       # Reusable modules
│   │   │   ├── vpc/                       # VPC module
│   │   │   ├── rds/                       # RDS module
│   │   │   ├── ecs/                       # ECS module
│   │   │   └── monitoring/                # Monitoring module
│   │   │
│   │   └── environments/                  # Environment configs
│   │       ├── dev.tfvars                 # Dev variables
│   │       ├── staging.tfvars             # Staging variables
│   │       └── prod.tfvars                # Production variables
│   │
│   ├── scripts/                           # Infrastructure scripts
│   │   ├── deploy.sh                      # Deployment script
│   │   ├── backup.sh                      # Backup script
│   │   ├── rollback.sh                    # Rollback script
│   │   ├── health-check.sh                # Health check
│   │   └── monitoring-setup.sh             # Monitoring setup
│   │
│   ├── nginx/                             # Nginx configuration
│   │   ├── nginx.conf                     # Main config
│   │   ├── ssl.conf                       # SSL configuration
│   │   ├── cache.conf                     # Cache configuration
│   │   └── locations.conf                 # Location blocks
│   │
│   └── github/                            # GitHub configuration
│       └── workflows/                     # GitHub Actions
│           ├── ci.yml                     # CI pipeline
│           ├── cd.yml                     # CD pipeline
│           ├── test.yml                   # Test pipeline
│           ├── security.yml               # Security scanning
│           └── performance.yml            # Performance testing
│
├── config/                                # Shared configuration
│   ├── development.yml                    # Dev config
│   ├── testing.yml                        # Testing config
│   ├── production.yml                     # Production config
│   └── logging.yml                        # Logging config
│
├── docs/                                  # Documentation
│   ├── README.md                          # Main documentation
│   ├── ARCHITECTURE.md                    # Architecture overview
│   ├── API.md                             # API documentation
│   ├── DATABASE.md                        # Database documentation
│   ├── DEPLOYMENT.md                      # Deployment guide
│   ├── CONTRIBUTING.md                    # Contribution guidelines
│   ├── TESTING.md                         # Testing guide
│   ├── SECURITY.md                        # Security guidelines
│   │
│   ├── setup/                             # Setup guides
│   │   ├── INSTALLATION.md                # Installation guide
│   │   ├── ENVIRONMENT_SETUP.md           # Environment setup
│   │   ├── DATABASE_SETUP.md              # Database setup
│   │   └── IDE_SETUP.md                   # IDE configuration
│   │
│   ├── guides/                            # Technical guides
│   │   ├── DEVELOPMENT.md                 # Development guide
│   │   ├── DEBUGGING.md                   # Debugging guide
│   │   ├── PERFORMANCE.md                 # Performance guide
│   │   ├── CI_CD.md                       # CI/CD guide
│   │   └── TROUBLESHOOTING.md             # Troubleshooting
│   │
│   └── api/                               # API documentation
│       ├── authentication.md              # Auth API docs
│       ├── events.md                      # Events API docs
│       ├── users.md                       # Users API docs
│       ├── csr.md                         # CSR API docs
│       └── openapi.json                   # OpenAPI specification
│
├── scripts/                               # Root-level scripts
│   ├── install.sh                         # Install script
│   ├── setup.sh                           # Setup script
│   ├── dev.sh                             # Dev startup
│   ├── test.sh                            # Run tests
│   ├── build.sh                           # Build script
│   ├── deploy.sh                          # Deploy script
│   ├── lint.sh                            # Lint script
│   └── format.sh                          # Format script
│
├── .github/                               # GitHub configuration
│   ├── ISSUE_TEMPLATE/                    # Issue templates
│   │   ├── bug.md                         # Bug report template
│   │   ├── feature.md                     # Feature request template
│   │   └── question.md                    # Question template
│   │
│   └── PULL_REQUEST_TEMPLATE.md           # PR template
│
├── .gitignore                             # Git ignore patterns
├── .env.example                           # Example env file
├── .env.development                       # Dev environment
├── .env.testing                           # Testing environment
├── .env.production                        # Production environment
├── .npmrc                                 # NPM configuration
├── .prettierrc                            # Prettier config
├── .editorconfig                          # Editor config
├── FOLDER_STRUCTURE.md                    # This file
├── README.md                              # Project README
├── LICENSE                                # License file
├── CHANGELOG.md                           # Change log
├── CONTRIBUTING.md                        # Contribution guide
└── package.json                           # Root package.json (monorepo)
```

---

## Detailed Folder Explanations

### 1. FRONTEND (`/frontend`)

The React 18+ frontend application using Vite for fast development.

#### `/frontend/public`
- **Purpose:** Static assets served directly without processing
- **Contents:**
  - `index.html` - Main HTML template
  - `favicon.ico` - Browser tab icon
  - `manifest.json` - PWA configuration
  - `/assets` - Images, icons, fonts

#### `/frontend/src/config`
- **Purpose:** Centralized application configuration
- **Key Files:**
  - `api.config.ts` - API endpoint URLs (environment-specific)
  - `theme.config.ts` - Material-UI theme customization
  - `routes.config.ts` - Route definitions
  - `env.config.ts` - Environment variable loading

#### `/frontend/src/pages`
- **Purpose:** Page-level components mapped to routes
- **Convention:** One component per page/route
- **Examples:**
  - `EventsPage.tsx` - Events listing page
  - `EventDetailPage.tsx` - Event detail view
  - `DashboardPage.tsx` - Dashboard view

#### `/frontend/src/components`
- **Purpose:** Reusable UI components
- **Organization:**
  - `/Layout` - Layout wrapper components
  - `/Common` - Generic reusable components
  - `/Forms` - Form components
  - `/Events` - Event-specific components
  - `/Dashboard` - Dashboard widgets
  - `/Admin` - Admin panel components

#### `/frontend/src/hooks`
- **Purpose:** Custom React hooks for reusable logic
- **Examples:**
  - `useAuth.ts` - Authentication state & methods
  - `useFetch.ts` - Data fetching with caching
  - `useForm.ts` - Form state management

#### `/frontend/src/services`
- **Purpose:** API communication & business logic
- **Structure:**
  - `/api` - Axios client & interceptors
  - `/auth` - Authentication service
  - `/events` - Event API service
  - `/csr` - CSR API service

#### `/frontend/src/store`
- **Purpose:** Redux Toolkit state management
- **Structure:**
  - `/slices` - Redux slices (state + actions)
  - `/selectors` - Redux selectors for efficient state access
  - `rootReducer.ts` - Combine all reducers

#### `/frontend/__tests__`
- **Purpose:** Test files parallel to src structure
- **Categories:**
  - `/unit` - Component & utility tests
  - `/integration` - Flow & feature tests
  - `/e2e` - End-to-end user journey tests

---

### 2. BACKEND (`/backend`)

The Node.js + Express backend API server.

#### `/backend/src/routes`
- **Purpose:** Express route definitions
- **Convention:** One route file per resource
- **Example:**
  ```typescript
  // event.routes.ts
  router.get('/events');           // List
  router.post('/events');          // Create
  router.get('/events/:id');       // Read
  router.put('/events/:id');       // Update
  router.delete('/events/:id');    // Delete
  ```

#### `/backend/src/controllers`
- **Purpose:** HTTP request handlers
- **Responsibility:**
  - Parse request data
  - Call services
  - Format response
  - Handle errors
- **Pattern:** One controller per resource

#### `/backend/src/services`
- **Purpose:** Business logic layer
- **Responsibility:**
  - Implement business rules
  - Coordinate repositories
  - Call external services
  - Data transformation

#### `/backend/src/repositories`
- **Purpose:** Data Access Layer (DAL)
- **Responsibility:**
  - Database queries
  - Query optimization
  - Data mapping
- **Pattern:** Active Repository pattern

#### `/backend/src/models`
- **Purpose:** Data models (ORM entities)
- **Tools:** Sequelize, TypeORM, or Knex.js
- **Contains:** Table definitions, relationships, validations

#### `/backend/src/middleware`
- **Purpose:** Express middleware functions
- **Examples:**
  - `auth.middleware.ts` - JWT verification
  - `authorization.middleware.ts` - Role-based access
  - `errorHandler.middleware.ts` - Global error handling
  - `validation.middleware.ts` - Input validation

#### `/backend/src/validators`
- **Purpose:** Input validation schemas
- **Tool:** Joi or Yup
- **Examples:**
  - `auth.validator.ts` - Login/register validation
  - `event.validator.ts` - Event creation validation

#### `/backend/src/integrations`
- **Purpose:** External service integrations
- **Examples:**
  - `/email` - Email service (SendGrid, SMTP)
  - `/sms` - SMS service (Twilio)
  - `/ldap` - LDAP/AD integration
  - `/notifications` - Push notifications (FCM)

#### `/backend/src/jobs`
- **Purpose:** Background job processing
- **Tool:** Bull Queue or Agenda
- **Examples:**
  - `emailJob.ts` - Send queued emails
  - `notificationJob.ts` - Send notifications
  - `reportGenerationJob.ts` - Generate reports

#### `/backend/src/migrations`
- **Purpose:** Database schema migrations
- **Convention:** Numbered files (001_, 002_, etc.)
- **Tools:** Knex migrations or TypeORM migrations

#### `/backend/src/seeds`
- **Purpose:** Populate database with initial data
- **Examples:**
  - Roles, permissions, categories
  - System settings, templates

#### `/backend/__tests__`
- **Purpose:** Test files (parallel structure to src)
- **Categories:**
  - `/unit` - Service, repository, utility tests
  - `/integration` - API endpoint tests
  - `/e2e` - Full workflow tests

---

### 3. DATABASE (`/database`)

Database schemas, migrations, and scripts.

#### `/database/migrations`
- **Purpose:** SQL migration scripts
- **Convention:** Numbered, versioned files
- **Examples:**
  - `001_create_database.sql` - Initial setup
  - `002_create_core_tables.sql` - Core tables
  - `003_create_indexes.sql` - Performance indexes

#### `/database/seeds`
- **Purpose:** Initial data population
- **Examples:**
  - `seed_roles.sql` - Seed 8 predefined roles
  - `seed_permissions.sql` - Seed 30+ permissions
  - `seed_categories.sql` - Seed event categories

#### `/database/scripts`
- **Purpose:** Operational scripts
- **Examples:**
  - `backup.sh` - Daily backup
  - `restore.sh` - Restore from backup
  - `migrate.sh` - Run migrations

---

### 4. INFRASTRUCTURE (`/infrastructure`)

DevOps and infrastructure configuration.

#### `/infrastructure/docker`
- **Purpose:** Docker containerization
- **Files:**
  - `docker-compose.yml` - Local development
  - `docker-compose.prod.yml` - Production compose
  - `Dockerfile.frontend` - React container
  - `Dockerfile.backend` - Node.js container
  - `Dockerfile.mysql` - MySQL container

#### `/infrastructure/kubernetes`
- **Purpose:** Kubernetes orchestration
- **Structure:**
  - `/frontend` - Frontend K8s manifests
  - `/backend` - Backend K8s manifests
  - `/database` - Database K8s manifests
  - `/monitoring` - Prometheus/Grafana configs

#### `/infrastructure/terraform`
- **Purpose:** Infrastructure as Code (IaC)
- **Supports:** AWS, Azure, GCP
- **Structure:**
  - `/modules` - Reusable modules (VPC, RDS, ECS)
  - `/environments` - Environment-specific vars (dev, staging, prod)

#### `/infrastructure/nginx`
- **Purpose:** Reverse proxy configuration
- **Files:**
  - `nginx.conf` - Main configuration
  - `ssl.conf` - SSL/TLS setup
  - `cache.conf` - Caching rules
  - `locations.conf` - URL location rules

#### `/infrastructure/github/workflows`
- **Purpose:** CI/CD pipelines (GitHub Actions)
- **Workflows:**
  - `ci.yml` - Continuous Integration (lint, test)
  - `cd.yml` - Continuous Deployment
  - `security.yml` - Security scanning
  - `performance.yml` - Performance testing

---

### 5. DOCUMENTATION (`/docs`)

Project documentation and guides.

#### `/docs/setup`
- Installation and environment setup guides
- Database setup instructions
- IDE configuration

#### `/docs/guides`
- Development guidelines
- Debugging procedures
- Performance optimization
- CI/CD pipeline guide

#### `/docs/api`
- API endpoint documentation
- Authentication flow
- OpenAPI/Swagger specification

---

### 6. SCRIPTS (`/scripts`)

Root-level automation scripts.

- `install.sh` - Initialize project
- `setup.sh` - Environment setup
- `dev.sh` - Start development servers
- `test.sh` - Run all tests
- `build.sh` - Production build
- `deploy.sh` - Deploy to production

---

## File Naming Conventions

### TypeScript/JavaScript

```
// Components (PascalCase + .tsx)
EventCard.tsx
UserProfile.tsx
DashboardWidget.tsx

// Services (camelCase + Service + .ts)
authService.ts
eventService.ts
notificationService.ts

// Utilities (camelCase + Utils + .ts)
dateUtils.ts
stringUtils.ts
formatUtils.ts

// Hooks (camelCase + use prefix + .ts)
useAuth.ts
useFetch.ts
useForm.ts

// Types (camelCase + .types + .ts)
event.types.ts
user.types.ts
api.types.ts

// Tests (.test.ts or .spec.ts)
auth.service.test.ts
EventCard.test.tsx
utils.spec.ts

// Constants (UPPER_SNAKE_CASE + .ts)
API_ENDPOINTS.ts
HTTP_STATUS.ts
USER_ROLES.ts
```

### SQL

```
// Migrations (numbered, descriptive)
001_create_database.sql
002_create_core_tables.sql
003_create_event_tables.sql

// Seeds (verb + table)
seed_roles.sql
seed_permissions.sql
seed_categories.sql
```

### Docker/K8s

```
Dockerfile.service-name          // Dockerfile
deployment.yml                   // K8s deployment
service.yml                      // K8s service
configmap.yml                    // ConfigMaps
secrets.yml                      // Secrets
```

---

## Environment Configuration

### `.env` Files Location

```
root/
├── .env.example          # Template for all environments
├── .env.development      # Dev environment secrets
├── .env.testing          # Testing environment secrets
└── .env.production       # Production environment secrets (not in repo)

frontend/
├── .env.development      # Dev config
├── .env.testing          # Testing config
└── .env.production       # Production config

backend/
├── .env.development      # Dev config
├── .env.testing          # Testing config
└── .env.production       # Production config
```

### Environment Variables

```bash
# .env.example (template)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Stakeholder Engagement Platform
REACT_APP_LOG_LEVEL=info

# Backend
NODE_ENV=development
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your-secret-key
MAIL_FROM=noreply@dewa.gov.ae
LOG_LEVEL=debug
```

---

## Best Practices

### 1. **Monorepo Structure**
```
/frontend   - Separate npm project
/backend    - Separate npm project
/database   - Shared schema
/infrastructure - Shared config
```

### 2. **Code Organization**
- **By Feature:** Group related files together
- **By Layer:** Separate concerns (routes, controllers, services, repositories)
- **DRY Principle:** Extract common code to shared utilities

### 3. **Testing Strategy**
```
Unit Tests:        70% (utilities, validators)
Integration Tests: 20% (API endpoints, workflows)
E2E Tests:         10% (critical user journeys)
```

### 4. **Database Migrations**
- Version all schema changes
- Test migrations locally
- Keep migrations backward compatible
- Never delete migration files

### 5. **Environment Management**
```
Development   → localhost, verbose logging, hot reload
Testing       → test DB, fixtures, mocks
Staging       → production-like, full testing
Production    → optimized, security-hardened, monitored
```

### 6. **Documentation**
- README in each major folder
- JSDoc comments for complex functions
- Inline comments for "why", not "what"
- Keep docs synchronized with code

### 7. **Git Structure**
```
.github/
├── PULL_REQUEST_TEMPLATE.md    # PR guidelines
└── ISSUE_TEMPLATE/
    ├── bug.md                  # Bug report template
    ├── feature.md              # Feature request
    └── question.md             # Question template
```

### 8. **CI/CD Pipeline**
```
Git Push
  ↓
Lint & Format (ESLint, Prettier)
  ↓
Unit Tests (Jest)
  ↓
Integration Tests
  ↓
Security Scan (SAST, dependency check)
  ↓
Build Docker images
  ↓
E2E Tests (Cypress/Playwright)
  ↓
Deploy to Staging
  ↓
Smoke Tests
  ↓
Deploy to Production
```

---

## Quick Reference

### Frontend Commands
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run test         # Run unit tests
npm run test:e2e     # E2E tests
npm run lint         # Lint code
npm run format       # Format code
```

### Backend Commands
```bash
npm run dev          # Start dev server (nodemon)
npm run build        # TypeScript compilation
npm run test         # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm start            # Production start
```

### Database Commands
```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed data
npm run db:reset     # Reset database
npm run db:backup    # Backup database
```

### Docker Commands
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # View logs
docker-compose exec mysql mysql   # Access MySQL
```

---

## File Size Guidelines

| Type | Max Size | Action |
|------|----------|--------|
| Component | 300 lines | Split into smaller components |
| Service | 400 lines | Extract utility functions |
| Utility | 200 lines | Split by responsibility |
| Test | 500 lines | Use helper functions |
| File | 500 lines | Generally refactor |

---

## Summary

This enterprise structure supports:

✅ **Team Collaboration** - Clear organization for 10+ developers  
✅ **Scalability** - Easy to add new features and modules  
✅ **Maintainability** - Logical folder hierarchy  
✅ **Testing** - Parallel test structure for all code  
✅ **DevOps** - Complete infrastructure as code  
✅ **Documentation** - Self-documenting through organization  
✅ **CI/CD** - Automated pipelines for all environments  
✅ **Environments** - Dev, testing, staging, production separation  

---

**Folder Structure Complete!** 🎉

This structure is production-ready and follows industry best practices.

*Last Updated: July 2026*
