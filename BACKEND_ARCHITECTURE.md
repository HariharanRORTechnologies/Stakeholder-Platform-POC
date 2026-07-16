# Complete Node.js/Express Backend Architecture

**Technology Stack:** Node.js 18+ LTS | Express.js v4+ | TypeScript | MySQL 8.0+  
**Architecture Pattern:** Layered Architecture with Repository Pattern  
**Status:** Production-Ready | Enterprise-Grade  
**Date:** July 2026

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Routing & API Versioning](#routing--api-versioning)
5. [Controller Layer](#controller-layer)
6. [Service Layer](#service-layer)
7. [Repository Pattern](#repository-pattern)
8. [Middleware](#middleware)
9. [Authentication](#authentication)
10. [Authorization](#authorization)
11. [Validation](#validation)
12. [Error Handling](#error-handling)
13. [Logging](#logging)
14. [Database Integration](#database-integration)
15. [API Response Format](#api-response-format)
16. [Testing](#testing)
17. [Best Practices](#best-practices)

---

## Architecture Overview

### Layered Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                       │
│                   (React/Web/Mobile)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    HTTP Request/Response
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Express Application                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            API Routes & Versioning                  │   │
│  │         (/api/v1/*, /api/v2/*)                      │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │           Middleware Stack                          │   │
│  │  - CORS                                             │   │
│  │  - Logging                                          │   │
│  │  - Authentication (JWT)                            │   │
│  │  - Authorization (RBAC)                            │   │
│  │  - Validation                                       │   │
│  │  - Error Handler                                    │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │           Controller Layer                          │   │
│  │  - Parse requests                                   │   │
│  │  - Call services                                    │   │
│  │  - Format responses                                 │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │            Service Layer                            │   │
│  │  - Business logic                                   │   │
│  │  - Data transformation                              │   │
│  │  - External integrations                            │   │
│  │  - Orchestration                                    │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │        Repository Pattern (DAL)                     │   │
│  │  - Query building                                   │   │
│  │  - Database operations                              │   │
│  │  - Data mapping                                     │   │
│  │  - Connection pooling                               │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
└─────────────────────────────┼──────────────────────────────┘
                              │
                    Database Connection
                              │
                    ┌─────────▼─────────┐
                    │  MySQL Database   │
                    │   (32 Tables)     │
                    └───────────────────┘
```

---

## Project Structure

### Complete Folder Organization

```
backend/
├── src/
│   ├── index.ts                          # Application entry point
│   ├── app.ts                            # Express app setup
│   │
│   ├── config/                           # Configuration files
│   │   ├── database.config.ts            # MySQL configuration
│   │   ├── server.config.ts              # Server config
│   │   ├── auth.config.ts                # Auth configuration
│   │   ├── cors.config.ts                # CORS configuration
│   │   ├── env.config.ts                 # Environment variables
│   │   ├── logger.config.ts              # Logger configuration
│   │   └── constants.ts                  # App constants
│   │
│   ├── api/                              # API versioning
│   │   ├── v1/                           # Version 1 routes
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── event.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── csr.routes.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── authController.ts
│   │   │   │   ├── eventController.ts
│   │   │   │   ├── userController.ts
│   │   │   │   ├── csrController.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── validate.middleware.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── v2/                           # Version 2 routes (future)
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                      # Route aggregator
│   │
│   ├── controllers/                      # Controllers (request handlers)
│   │   ├── authController.ts             # Auth logic
│   │   ├── eventController.ts            # Event logic
│   │   ├── userController.ts             # User logic
│   │   ├── registrationController.ts     # Registration logic
│   │   ├── feedbackController.ts         # Feedback logic
│   │   ├── csrController.ts              # CSR logic
│   │   ├── notificationController.ts     # Notification logic
│   │   ├── approvalController.ts         # Approval logic
│   │   ├── adminController.ts            # Admin logic
│   │   └── index.ts                      # Controller exports
│   │
│   ├── services/                         # Business logic layer
│   │   ├── authService.ts                # Authentication service
│   │   ├── userService.ts                # User service
│   │   ├── eventService.ts               # Event service
│   │   ├── registrationService.ts        # Registration service
│   │   ├── feedbackService.ts            # Feedback service
│   │   ├── csrService.ts                 # CSR service
│   │   ├── volunteerService.ts           # Volunteer service
│   │   ├── notificationService.ts        # Notification service
│   │   ├── approvalService.ts            # Approval service
│   │   ├── emailService.ts               # Email service
│   │   ├── smsService.ts                 # SMS service
│   │   ├── reportService.ts              # Report generation
│   │   ├── auditService.ts               # Audit service
│   │   └── index.ts                      # Service exports
│   │
│   ├── repositories/                     # Data Access Layer (DAL)
│   │   ├── baseRepository.ts             # Base repository class
│   │   ├── userRepository.ts             # User DB operations
│   │   ├── eventRepository.ts            # Event DB operations
│   │   ├── registrationRepository.ts     # Registration DB ops
│   │   ├── feedbackRepository.ts         # Feedback DB ops
│   │   ├── csrRepository.ts              # CSR DB ops
│   │   ├── approvalRepository.ts         # Approval DB ops
│   │   ├── auditRepository.ts            # Audit DB ops
│   │   ├── notificationRepository.ts     # Notification DB ops
│   │   └── index.ts                      # Repository exports
│   │
│   ├── models/                           # ORM/Data models
│   │   ├── User.model.ts                 # User model
│   │   ├── Event.model.ts                # Event model
│   │   ├── Registration.model.ts         # Registration model
│   │   ├── Feedback.model.ts             # Feedback model
│   │   ├── CSR.model.ts                  # CSR model
│   │   ├── Notification.model.ts         # Notification model
│   │   ├── AuditLog.model.ts             # Audit log model
│   │   └── index.ts                      # Model exports
│   │
│   ├── middleware/                       # Express middleware
│   │   ├── auth.middleware.ts            # JWT verification
│   │   ├── authorization.middleware.ts   # Role-based access
│   │   ├── validation.middleware.ts      # Input validation
│   │   ├── errorHandler.middleware.ts    # Global error handler
│   │   ├── requestLogger.middleware.ts   # Request logging
│   │   ├── rateLimiter.middleware.ts     # Rate limiting
│   │   ├── cors.middleware.ts            # CORS setup
│   │   ├── requestTimer.middleware.ts    # Request timing
│   │   └── index.ts                      # Middleware exports
│   │
│   ├── validators/                       # Input validation schemas
│   │   ├── auth.validator.ts             # Auth validation
│   │   ├── user.validator.ts             # User validation
│   │   ├── event.validator.ts            # Event validation
│   │   ├── registration.validator.ts     # Registration validation
│   │   ├── feedback.validator.ts         # Feedback validation
│   │   ├── csr.validator.ts              # CSR validation
│   │   ├── common.validator.ts           # Common validation
│   │   └── index.ts                      # Validator exports
│   │
│   ├── utils/                            # Utility functions
│   │   ├── logger.ts                     # Logging utility
│   │   ├── errorHandler.ts               # Error handling
│   │   ├── dateUtils.ts                  # Date utilities
│   │   ├── stringUtils.ts                # String utilities
│   │   ├── fileUtils.ts                  # File handling
│   │   ├── emailUtils.ts                 # Email utilities
│   │   ├── cryptoUtils.ts                # Encryption utilities
│   │   ├── tokenUtils.ts                 # Token utilities
│   │   ├── responseFormatter.ts          # Response formatting
│   │   └── index.ts                      # Utility exports
│   │
│   ├── types/                            # TypeScript types
│   │   ├── index.ts                      # Type exports
│   │   ├── auth.types.ts                 # Auth types
│   │   ├── user.types.ts                 # User types
│   │   ├── event.types.ts                # Event types
│   │   ├── api.types.ts                  # API response types
│   │   ├── express.types.ts              # Express extension types
│   │   ├── pagination.types.ts           # Pagination types
│   │   └── database.types.ts             # Database types
│   │
│   ├── constants/                        # Constants
│   │   ├── httpStatus.ts                 # HTTP status codes
│   │   ├── errorMessages.ts              # Error messages
│   │   ├── successMessages.ts            # Success messages
│   │   ├── eventStatus.ts                # Event status enum
│   │   ├── userRoles.ts                  # User role enum
│   │   ├── permissions.ts                # Permission enum
│   │   └── index.ts                      # Constant exports
│   │
│   ├── integrations/                     # External integrations
│   │   ├── email/                        # Email service
│   │   │   ├── emailProvider.ts          # Email provider
│   │   │   └── emailTemplates.ts         # Email templates
│   │   │
│   │   ├── sms/                          # SMS service
│   │   │   └── smsProvider.ts            # SMS provider
│   │   │
│   │   ├── ldap/                         # LDAP/AD integration
│   │   │   ├── ldapClient.ts             # LDAP client
│   │   │   └── ldapSync.ts               # LDAP sync logic
│   │   │
│   │   ├── storage/                      # Cloud storage
│   │   │   └── azureBlobStorage.ts       # Azure Blob Storage
│   │   │
│   │   └── index.ts
│   │
│   ├── events/                           # Event emitters (event-driven)
│   │   ├── eventEmitter.ts               # Central event emitter
│   │   ├── eventListeners.ts             # Event listeners
│   │   └── index.ts
│   │
│   ├── jobs/                             # Background jobs
│   │   ├── emailJob.ts                   # Email sending job
│   │   ├── notificationJob.ts            # Notification job
│   │   ├── reportGenerationJob.ts        # Report generation
│   │   ├── dataCleanupJob.ts             # Cleanup job
│   │   ├── ldapSyncJob.ts                # LDAP sync job
│   │   └── index.ts
│   │
│   ├── migrations/                       # Database migrations
│   │   ├── 001_initial_schema.ts         # Initial schema
│   │   ├── 002_add_fields.ts             # Add new fields
│   │   └── index.ts                      # Migration runner
│   │
│   ├── seeds/                            # Database seeding
│   │   ├── seedRoles.ts                  # Seed roles
│   │   ├── seedPermissions.ts            # Seed permissions
│   │   ├── seedCategories.ts             # Seed categories
│   │   └── index.ts                      # Seed runner
│   │
│   ├── errors/                           # Custom error classes
│   │   ├── AppError.ts                   # Base app error
│   │   ├── ValidationError.ts            # Validation error
│   │   ├── AuthenticationError.ts        # Auth error
│   │   ├── AuthorizationError.ts         # Authorization error
│   │   ├── NotFoundError.ts              # 404 error
│   │   ├── ConflictError.ts              # Conflict error
│   │   └── index.ts                      # Error exports
│   │
│   └── database/                         # Database setup
│       ├── connection.ts                 # MySQL connection
│       ├── pool.ts                       # Connection pool
│       └── index.ts
│
├── __tests__/                            # Test files
│   ├── unit/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── integration/
│   │   ├── auth.integration.test.ts
│   │   ├── events.integration.test.ts
│   │   ├── api.integration.test.ts
│   │   └── database.integration.test.ts
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
│       ├── database.mock.ts
│       ├── services.mock.ts
│       └── external.mock.ts
│
├── .env.example                          # Environment template
├── .env.development                      # Dev environment
├── .env.testing                          # Testing environment
├── .env.production                       # Production environment
├── .eslintrc.json                        # ESLint configuration
├── .prettierrc                           # Prettier configuration
├── tsconfig.json                         # TypeScript configuration
├── jest.config.js                        # Jest test configuration
├── package.json                          # Dependencies
├── package-lock.json                     # Lock file
├── README.md                             # Backend README
└── .gitignore                            # Git ignore patterns
```

---

## Core Components

### 1. Entry Point & App Setup

**src/index.ts**
```typescript
import app from './app'
import { envConfig } from './config/env.config'
import { logger } from './utils/logger'
import { initializeDatabase } from './database'

const PORT = envConfig.port || 3001

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    logger.info('Database connection established')

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${envConfig.environment} mode`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

startServer()
```

**src/app.ts**
```typescript
import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { envConfig } from './config/env.config'
import { corsOptions, corsMiddleware } from './config/cors.config'
import { requestLoggerMiddleware } from './middleware/requestLogger.middleware'
import { authMiddleware } from './middleware/auth.middleware'
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware'
import { rateLimiterMiddleware } from './middleware/rateLimiter.middleware'
import apiRoutes from './api'

const app: Express = express()

// Trust proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())
app.use(cors(corsOptions))

// Logging
app.use(morgan('combined'))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
app.use(rateLimiterMiddleware)

// Request logging
app.use(requestLoggerMiddleware)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: envConfig.environment,
  })
})

// API routes
app.use('/api', apiRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.path,
  })
})

// Global error handler (must be last)
app.use(errorHandlerMiddleware)

export default app
```

---

## Routing & API Versioning

### API Versioning Structure

**src/api/index.ts**
```typescript
import { Router } from 'express'
import v1Routes from './v1'
import v2Routes from './v2'

const router = Router()

// API v1 routes
router.use('/v1', v1Routes)

// API v2 routes (future)
router.use('/v2', v2Routes)

// Default to v1
router.use('/', v1Routes)

export default router
```

**src/api/v1/index.ts**
```typescript
import { Router } from 'express'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import eventRoutes from './routes/event.routes'
import registrationRoutes from './routes/registration.routes'
import feedbackRoutes from './routes/feedback.routes'
import csrRoutes from './routes/csr.routes'
import notificationRoutes from './routes/notification.routes'
import approvalRoutes from './routes/approval.routes'
import adminRoutes from './routes/admin.routes'
import { authMiddleware } from './middleware/auth.middleware'

const router = Router()

// Public routes (no authentication required)
router.use('/auth', authRoutes)
router.use('/health', (req, res) => res.status(200).json({ status: 'OK' }))

// Protected routes (authentication required)
router.use(authMiddleware)

router.use('/users', userRoutes)
router.use('/events', eventRoutes)
router.use('/registrations', registrationRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/csr', csrRoutes)
router.use('/notifications', notificationRoutes)
router.use('/approvals', approvalRoutes)
router.use('/admin', adminRoutes)

export default router
```

**src/api/v1/routes/event.routes.ts**
```typescript
import { Router } from 'express'
import { eventController } from '../controllers'
import { validateRequestBody } from '../middleware/validate.middleware'
import { authorizeRole } from '@middleware/authorization.middleware'
import { eventValidator } from '@validators/event.validator'

const router = Router()

// GET /api/v1/events - List events
router.get('/', eventController.listEvents)

// GET /api/v1/events/:id - Get event details
router.get('/:id', eventController.getEvent)

// POST /api/v1/events - Create event
router.post(
  '/',
  validateRequestBody(eventValidator.createEvent),
  authorizeRole(['event_manager', 'admin']),
  eventController.createEvent
)

// PUT /api/v1/events/:id - Update event
router.put(
  '/:id',
  validateRequestBody(eventValidator.updateEvent),
  authorizeRole(['event_manager', 'admin']),
  eventController.updateEvent
)

// DELETE /api/v1/events/:id - Delete event
router.delete(
  '/:id',
  authorizeRole(['admin']),
  eventController.deleteEvent
)

// POST /api/v1/events/:id/publish - Publish event
router.post(
  '/:id/publish',
  authorizeRole(['event_manager', 'admin']),
  eventController.publishEvent
)

// POST /api/v1/events/:id/cancel - Cancel event
router.post(
  '/:id/cancel',
  validateRequestBody(eventValidator.cancelEvent),
  authorizeRole(['event_manager', 'admin']),
  eventController.cancelEvent
)

export default router
```

---

## Controller Layer

### Event Controller Example

**src/api/v1/controllers/eventController.ts**
```typescript
import { Request, Response, NextFunction } from 'express'
import { eventService } from '@services'
import { responseFormatter } from '@utils/responseFormatter'
import { AppError } from '@errors'
import { logger } from '@utils/logger'

export const eventController = {
  // List events with pagination and filters
  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, categoryId, status, search } = req.query
      const userId = req.user?.id

      logger.info('Fetching events list', { page, limit, categoryId, status })

      const events = await eventService.listEvents({
        page: Number(page),
        limit: Number(limit),
        categoryId: categoryId ? Number(categoryId) : undefined,
        status: status as string,
        search: search as string,
        userId,
      })

      res.status(200).json(
        responseFormatter.success({
          data: events.data,
          pagination: {
            page: events.page,
            limit: events.limit,
            total: events.total,
            pages: Math.ceil(events.total / events.limit),
          },
        })
      )
    } catch (error) {
      logger.error('Error fetching events', error)
      next(error)
    }
  },

  // Get event by ID
  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      logger.info('Fetching event details', { eventId: id })

      const event = await eventService.getEventById(Number(id))

      if (!event) {
        throw new AppError('Event not found', 404)
      }

      res.status(200).json(responseFormatter.success({ data: event }))
    } catch (error) {
      logger.error('Error fetching event', error)
      next(error)
    }
  },

  // Create event
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const eventData = req.body

      logger.info('Creating new event', { userId })

      const event = await eventService.createEvent(eventData, userId)

      res.status(201).json(
        responseFormatter.success(
          { data: event },
          'Event created successfully'
        )
      )
    } catch (error) {
      logger.error('Error creating event', error)
      next(error)
    }
  },

  // Update event
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const eventData = req.body

      logger.info('Updating event', { eventId: id, userId })

      const event = await eventService.updateEvent(Number(id), eventData, userId)

      res.status(200).json(
        responseFormatter.success(
          { data: event },
          'Event updated successfully'
        )
      )
    } catch (error) {
      logger.error('Error updating event', error)
      next(error)
    }
  },

  // Delete event
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      logger.info('Deleting event', { eventId: id, userId })

      await eventService.deleteEvent(Number(id), userId)

      res.status(200).json(
        responseFormatter.success(null, 'Event deleted successfully')
      )
    } catch (error) {
      logger.error('Error deleting event', error)
      next(error)
    }
  },

  // Publish event
  async publishEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      logger.info('Publishing event', { eventId: id })

      const event = await eventService.publishEvent(Number(id), userId)

      res.status(200).json(
        responseFormatter.success(
          { data: event },
          'Event published successfully'
        )
      )
    } catch (error) {
      logger.error('Error publishing event', error)
      next(error)
    }
  },

  // Cancel event
  async cancelEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { reason } = req.body
      const userId = req.user?.id

      logger.info('Cancelling event', { eventId: id, userId })

      const event = await eventService.cancelEvent(Number(id), reason, userId)

      res.status(200).json(
        responseFormatter.success(
          { data: event },
          'Event cancelled successfully'
        )
      )
    } catch (error) {
      logger.error('Error cancelling event', error)
      next(error)
    }
  },
}
```

---

## Service Layer

### Event Service Example

**src/services/eventService.ts**
```typescript
import { eventRepository } from '@repositories'
import { notificationService } from './notificationService'
import { approvalService } from './approvalService'
import { auditService } from './auditService'
import { AppError } from '@errors'
import { logger } from '@utils/logger'
import { Event, CreateEventDTO, UpdateEventDTO } from '@types'

export const eventService = {
  // List events with pagination
  async listEvents(params: {
    page: number
    limit: number
    categoryId?: number
    status?: string
    search?: string
    userId?: number
  }) {
    try {
      logger.info('Service: Listing events', params)

      const events = await eventRepository.findPaginated(
        params.page,
        params.limit,
        {
          categoryId: params.categoryId,
          status: params.status,
          search: params.search,
        }
      )

      return events
    } catch (error) {
      logger.error('Service: Error listing events', error)
      throw error
    }
  },

  // Get event by ID
  async getEventById(eventId: number): Promise<Event> {
    try {
      logger.info('Service: Fetching event', { eventId })

      const event = await eventRepository.findById(eventId)

      if (!event) {
        throw new AppError('Event not found', 404)
      }

      return event
    } catch (error) {
      logger.error('Service: Error fetching event', error)
      throw error
    }
  },

  // Create event
  async createEvent(eventData: CreateEventDTO, userId: number): Promise<Event> {
    try {
      logger.info('Service: Creating event', { userId })

      // Validate event data
      if (!eventData.title || !eventData.startDate) {
        throw new AppError('Event title and start date are required', 400)
      }

      // Check if category exists
      const category = await eventRepository.findCategoryById(eventData.categoryId)
      if (!category) {
        throw new AppError('Event category not found', 404)
      }

      // Create event
      const event = await eventRepository.create({
        ...eventData,
        createdBy: userId,
        eventStatus: 'draft',
      })

      // Log audit
      await auditService.logAction({
        actionType: 'create',
        entityType: 'event',
        entityId: event.id,
        userId,
        changes: event,
      })

      // Send notification
      await notificationService.sendEventCreatedNotification(event, userId)

      return event
    } catch (error) {
      logger.error('Service: Error creating event', error)
      throw error
    }
  },

  // Update event
  async updateEvent(
    eventId: number,
    eventData: UpdateEventDTO,
    userId: number
  ): Promise<Event> {
    try {
      logger.info('Service: Updating event', { eventId, userId })

      // Get existing event
      const existingEvent = await eventRepository.findById(eventId)
      if (!existingEvent) {
        throw new AppError('Event not found', 404)
      }

      // Check authorization
      if (
        existingEvent.createdBy !== userId &&
        !['admin', 'event_manager'].includes(req.user?.role)
      ) {
        throw new AppError('Not authorized to update this event', 403)
      }

      // Cannot update published events
      if (existingEvent.eventStatus === 'published') {
        throw new AppError('Cannot update published events', 400)
      }

      // Update event
      const updatedEvent = await eventRepository.update(eventId, eventData)

      // Log audit
      await auditService.logAction({
        actionType: 'update',
        entityType: 'event',
        entityId: eventId,
        userId,
        oldValue: existingEvent,
        newValue: updatedEvent,
        changes: eventData,
      })

      return updatedEvent
    } catch (error) {
      logger.error('Service: Error updating event', error)
      throw error
    }
  },

  // Delete event
  async deleteEvent(eventId: number, userId: number): Promise<void> {
    try {
      logger.info('Service: Deleting event', { eventId, userId })

      const event = await eventRepository.findById(eventId)
      if (!event) {
        throw new AppError('Event not found', 404)
      }

      // Only admin can delete published events
      if (
        event.eventStatus === 'published' &&
        !['admin'].includes(req.user?.role)
      ) {
        throw new AppError('Only admins can delete published events', 403)
      }

      await eventRepository.softDelete(eventId)

      // Log audit
      await auditService.logAction({
        actionType: 'delete',
        entityType: 'event',
        entityId: eventId,
        userId,
        oldValue: event,
      })
    } catch (error) {
      logger.error('Service: Error deleting event', error)
      throw error
    }
  },

  // Publish event
  async publishEvent(eventId: number, userId: number): Promise<Event> {
    try {
      logger.info('Service: Publishing event', { eventId })

      const event = await eventRepository.findById(eventId)
      if (!event) {
        throw new AppError('Event not found', 404)
      }

      // Check approval status
      const approvalWorkflow = await approvalService.getApprovalWorkflow(
        'event',
        eventId
      )

      if (!approvalWorkflow || approvalWorkflow.status !== 'approved') {
        throw new AppError('Event must be approved before publishing', 400)
      }

      // Update event status
      const updatedEvent = await eventRepository.update(eventId, {
        eventStatus: 'published',
      })

      // Send notifications to all interested users
      await notificationService.sendEventPublishedNotification(updatedEvent)

      // Log audit
      await auditService.logAction({
        actionType: 'update',
        entityType: 'event',
        entityId: eventId,
        userId,
        changes: { eventStatus: 'published' },
      })

      return updatedEvent
    } catch (error) {
      logger.error('Service: Error publishing event', error)
      throw error
    }
  },

  // Cancel event
  async cancelEvent(
    eventId: number,
    reason: string,
    userId: number
  ): Promise<Event> {
    try {
      logger.info('Service: Cancelling event', { eventId, reason })

      const event = await eventRepository.findById(eventId)
      if (!event) {
        throw new AppError('Event not found', 404)
      }

      if (event.eventStatus === 'completed') {
        throw new AppError('Cannot cancel completed events', 400)
      }

      // Update event status
      const updatedEvent = await eventRepository.update(eventId, {
        eventStatus: 'cancelled',
      })

      // Send cancellation notifications
      await notificationService.sendEventCancelledNotification(event, reason)

      // Log audit
      await auditService.logAction({
        actionType: 'update',
        entityType: 'event',
        entityId: eventId,
        userId,
        changes: { eventStatus: 'cancelled', cancellationReason: reason },
      })

      return updatedEvent
    } catch (error) {
      logger.error('Service: Error cancelling event', error)
      throw error
    }
  },
}
```

---

## Repository Pattern

### Base Repository

**src/repositories/baseRepository.ts**
```typescript
import { Connection } from 'mysql2/promise'
import { logger } from '@utils/logger'

export interface FindOptions {
  where?: Record<string, any>
  select?: string[]
  orderBy?: Record<string, 'ASC' | 'DESC'>
  limit?: number
  offset?: number
}

export class BaseRepository<T> {
  protected tableName: string
  protected connection: Connection

  constructor(tableName: string, connection: Connection) {
    this.tableName = tableName
    this.connection = connection
  }

  // Create record
  async create(data: Partial<T>): Promise<T> {
    try {
      const columns = Object.keys(data)
      const values = Object.values(data)
      const placeholders = columns.map(() => '?').join(',')

      const query = `
        INSERT INTO ${this.tableName} (${columns.join(',')}, created_at, updated_at)
        VALUES (${placeholders}, NOW(), NOW())
      `

      const [result]: any = await this.connection.execute(query, values)

      logger.debug(`Record created in ${this.tableName}`, { insertId: result.insertId })

      return this.findById(result.insertId) as Promise<T>
    } catch (error) {
      logger.error(`Error creating record in ${this.tableName}`, error)
      throw error
    }
  }

  // Find by ID
  async findById(id: number): Promise<T | null> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE id = ? AND deleted_at IS NULL
      `

      const [rows]: any = await this.connection.execute(query, [id])

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      logger.error(`Error finding record in ${this.tableName}`, error)
      throw error
    }
  }

  // Find all with options
  async findAll(options?: FindOptions): Promise<T[]> {
    try {
      let query = `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`
      const params: any[] = []

      // WHERE clause
      if (options?.where) {
        for (const [key, value] of Object.entries(options.where)) {
          query += ` AND ${key} = ?`
          params.push(value)
        }
      }

      // ORDER BY
      if (options?.orderBy) {
        const orderClauses = Object.entries(options.orderBy)
          .map(([column, direction]) => `${column} ${direction}`)
          .join(',')
        query += ` ORDER BY ${orderClauses}`
      }

      // LIMIT & OFFSET
      if (options?.limit) {
        query += ` LIMIT ?`
        params.push(options.limit)
      }
      if (options?.offset) {
        query += ` OFFSET ?`
        params.push(options.offset)
      }

      const [rows]: any = await this.connection.execute(query, params)
      return rows
    } catch (error) {
      logger.error(`Error finding records in ${this.tableName}`, error)
      throw error
    }
  }

  // Find with pagination
  async findPaginated(
    page: number = 1,
    limit: number = 10,
    where?: Record<string, any>,
    orderBy?: Record<string, 'ASC' | 'DESC'>
  ): Promise<{ data: T[]; page: number; limit: number; total: number }> {
    try {
      const offset = (page - 1) * limit

      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE deleted_at IS NULL`
      const countParams: any[] = []

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          countQuery += ` AND ${key} = ?`
          countParams.push(value)
        }
      }

      const [countResult]: any = await this.connection.execute(countQuery, countParams)
      const total = countResult[0].total

      // Get paginated data
      const data = await this.findAll({
        where,
        orderBy,
        limit,
        offset,
      })

      return { data, page, limit, total }
    } catch (error) {
      logger.error(`Error paginating records in ${this.tableName}`, error)
      throw error
    }
  }

  // Update record
  async update(id: number, data: Partial<T>): Promise<T> {
    try {
      const columns = Object.keys(data)
      const values = Object.values(data)
      const setClauses = columns.map((col) => `${col} = ?`).join(',')

      const query = `
        UPDATE ${this.tableName}
        SET ${setClauses}, updated_at = NOW()
        WHERE id = ? AND deleted_at IS NULL
      `

      await this.connection.execute(query, [...values, id])

      logger.debug(`Record updated in ${this.tableName}`, { id })

      return this.findById(id) as Promise<T>
    } catch (error) {
      logger.error(`Error updating record in ${this.tableName}`, error)
      throw error
    }
  }

  // Soft delete (set deleted_at)
  async softDelete(id: number): Promise<void> {
    try {
      const query = `
        UPDATE ${this.tableName}
        SET deleted_at = NOW()
        WHERE id = ?
      `

      await this.connection.execute(query, [id])

      logger.debug(`Record soft-deleted in ${this.tableName}`, { id })
    } catch (error) {
      logger.error(`Error soft-deleting record in ${this.tableName}`, error)
      throw error
    }
  }

  // Hard delete (permanent)
  async hardDelete(id: number): Promise<void> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = ?`
      await this.connection.execute(query, [id])

      logger.debug(`Record hard-deleted in ${this.tableName}`, { id })
    } catch (error) {
      logger.error(`Error hard-deleting record in ${this.tableName}`, error)
      throw error
    }
  }

  // Execute raw query
  async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      const [rows]: any = await this.connection.execute(sql, params)
      return rows
    } catch (error) {
      logger.error(`Error executing query in ${this.tableName}`, error)
      throw error
    }
  }
}
```

### Event Repository

**src/repositories/eventRepository.ts**
```typescript
import { Connection } from 'mysql2/promise'
import { BaseRepository } from './baseRepository'
import { Event } from '@types'
import { logger } from '@utils/logger'

export class EventRepository extends BaseRepository<Event> {
  constructor(connection: Connection) {
    super('events', connection)
  }

  // Find events by category
  async findByCategory(categoryId: number): Promise<Event[]> {
    try {
      return await this.findAll({
        where: { category_id: categoryId },
        orderBy: { start_date: 'DESC' },
      })
    } catch (error) {
      logger.error('Error finding events by category', error)
      throw error
    }
  }

  // Find upcoming events
  async findUpcoming(limit: number = 10): Promise<Event[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE start_date > NOW() 
        AND event_status = 'published'
        AND deleted_at IS NULL
        ORDER BY start_date ASC
        LIMIT ?
      `

      return await this.query(query, [limit])
    } catch (error) {
      logger.error('Error finding upcoming events', error)
      throw error
    }
  }

  // Count registrations for event
  async countRegistrations(eventId: number): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as count FROM registrations
        WHERE event_id = ? AND registration_status = 'registered'
        AND deleted_at IS NULL
      `

      const result = await this.query(query, [eventId])
      return result[0].count
    } catch (error) {
      logger.error('Error counting registrations', error)
      throw error
    }
  }

  // Search events
  async search(searchTerm: string): Promise<Event[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE (title LIKE ? OR description LIKE ?)
        AND deleted_at IS NULL
        ORDER BY start_date DESC
      `

      const searchPattern = `%${searchTerm}%`
      return await this.query(query, [searchPattern, searchPattern])
    } catch (error) {
      logger.error('Error searching events', error)
      throw error
    }
  }

  // Find by status
  async findByStatus(status: string): Promise<Event[]> {
    try {
      return await this.findAll({
        where: { event_status: status },
        orderBy: { created_at: 'DESC' },
      })
    } catch (error) {
      logger.error('Error finding events by status', error)
      throw error
    }
  }
}
```

---

## Middleware

### Authentication Middleware

**src/middleware/auth.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { envConfig } from '@config/env.config'
import { AuthenticationError } from '@errors'
import { logger } from '@utils/logger'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        role: string
        permissions: string[]
      }
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req)

    if (!token) {
      throw new AuthenticationError('No token provided')
    }

    const decoded = verifyToken(token)
    req.user = decoded

    logger.debug('User authenticated', { userId: decoded.id })

    next()
  } catch (error) {
    logger.error('Authentication error', error)
    next(new AuthenticationError('Invalid or expired token'))
  }
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}

function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret) as any
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
    }
  } catch (error) {
    throw new AuthenticationError('Invalid token')
  }
}
```

### Authorization Middleware

**src/middleware/authorization.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthorizationError } from '@errors'
import { logger } from '@utils/logger'

export const authorizeRole =
  (requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated')
      }

      const userRole = req.user.role

      if (!requiredRoles.includes(userRole)) {
        logger.warn('Authorization failed', {
          userId: req.user.id,
          userRole,
          requiredRoles,
        })
        throw new AuthorizationError(
          'You do not have permission to access this resource'
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }

export const authorizePermission =
  (requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated')
      }

      const userPermissions = req.user.permissions || []
      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm)
      )

      if (!hasPermission) {
        logger.warn('Permission denied', {
          userId: req.user.id,
          userPermissions,
          requiredPermissions,
        })
        throw new AuthorizationError('Insufficient permissions')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
```

### Validation Middleware

**src/api/v1/middleware/validate.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express'
import { Schema, ValidationError } from 'joi'
import { logger } from '@utils/logger'

export const validateRequestBody =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      })

      if (error) {
        const messages = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }))

        logger.warn('Validation error', { messages })

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages,
        })
      }

      req.body = value
      next()
    } catch (error) {
      logger.error('Validation middleware error', error)
      next(error)
    }
  }

export const validateRequestParams =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
      })

      if (error) {
        const messages = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }))

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages,
        })
      }

      req.params = value
      next()
    } catch (error) {
      logger.error('Validation middleware error', error)
      next(error)
    }
  }
```

### Error Handler Middleware

**src/middleware/errorHandler.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express'
import { AppError } from '@errors'
import { logger } from '@utils/logger'
import { responseFormatter } from '@utils/responseFormatter'

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  })

  // Handle known AppErrors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      responseFormatter.error(error.message, {
        statusCode: error.statusCode,
      })
    )
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json(
      responseFormatter.error('Validation failed', {
        statusCode: 400,
        details: (error as any).details,
      })
    )
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(
      responseFormatter.error('Invalid token', {
        statusCode: 401,
      })
    )
  }

  // Handle unknown errors
  res.status(500).json(
    responseFormatter.error('Internal server error', {
      statusCode: 500,
    })
  )
}
```

---

## Validation

### Joi Validators

**src/validators/event.validator.ts**
```typescript
import Joi from 'joi'

export const eventValidator = {
  createEvent: Joi.object({
    title: Joi.string().required().max(255).messages({
      'string.required': 'Event title is required',
      'string.max': 'Event title must not exceed 255 characters',
    }),

    description: Joi.string().required().min(10).max(5000).messages({
      'string.required': 'Event description is required',
      'string.min': 'Event description must be at least 10 characters',
    }),

    categoryId: Joi.number().required().positive().messages({
      'number.required': 'Category is required',
      'number.positive': 'Invalid category',
    }),

    startDate: Joi.date().required().greater('now').messages({
      'date.required': 'Start date is required',
      'date.greater': 'Start date must be in the future',
    }),

    endDate: Joi.date().required().greater(Joi.ref('startDate')).messages({
      'date.required': 'End date is required',
      'date.greater': 'End date must be after start date',
    }),

    location: Joi.string().required().max(255).messages({
      'string.required': 'Location is required',
    }),

    maxCapacity: Joi.number().positive().optional().messages({
      'number.positive': 'Max capacity must be positive',
    }),

    isVirtual: Joi.boolean().default(false),

    meetingLink: Joi.string().uri().optional().when('isVirtual', {
      is: true,
      then: Joi.required().messages({
        'string.required': 'Meeting link is required for virtual events',
      }),
    }),
  }),

  updateEvent: Joi.object({
    title: Joi.string().max(255).optional(),
    description: Joi.string().min(10).max(5000).optional(),
    categoryId: Joi.number().positive().optional(),
    location: Joi.string().max(255).optional(),
    maxCapacity: Joi.number().positive().optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be updated',
  }),

  cancelEvent: Joi.object({
    reason: Joi.string().required().max(500).messages({
      'string.required': 'Cancellation reason is required',
    }),
  }),
}
```

---

## Authentication

### JWT Token Service

**src/utils/tokenUtils.ts**
```typescript
import jwt from 'jsonwebtoken'
import { envConfig } from '@config/env.config'
import { logger } from './logger'

interface TokenPayload {
  sub: number // User ID
  email: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}

export const tokenUtils = {
  // Generate access token (15 minutes)
  generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    try {
      const token = jwt.sign(payload, envConfig.jwtSecret, {
        expiresIn: '15m',
        issuer: 'stakeholder-platform',
      })

      logger.debug('Access token generated', { userId: payload.sub })
      return token
    } catch (error) {
      logger.error('Error generating access token', error)
      throw error
    }
  },

  // Generate refresh token (7 days)
  generateRefreshToken(userId: number): string {
    try {
      const token = jwt.sign(
        { sub: userId },
        envConfig.refreshTokenSecret,
        {
          expiresIn: '7d',
          issuer: 'stakeholder-platform',
        }
      )

      logger.debug('Refresh token generated', { userId })
      return token
    } catch (error) {
      logger.error('Error generating refresh token', error)
      throw error
    }
  },

  // Verify token
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, envConfig.jwtSecret) as TokenPayload
      return decoded
    } catch (error) {
      logger.warn('Invalid token', { error: (error as Error).message })
      return null
    }
  },

  // Verify refresh token
  verifyRefreshToken(token: string): { sub: number } | null {
    try {
      const decoded = jwt.verify(token, envConfig.refreshTokenSecret) as {
        sub: number
      }
      return decoded
    } catch (error) {
      logger.warn('Invalid refresh token', { error: (error as Error).message })
      return null
    }
  },
}
```

### Auth Service

**src/services/authService.ts**
```typescript
import { userRepository } from '@repositories'
import { tokenUtils } from '@utils/tokenUtils'
import { cryptoUtils } from '@utils/cryptoUtils'
import { AppError, AuthenticationError } from '@errors'
import { logger } from '@utils/logger'
import { auditService } from './auditService'

export const authService = {
  async login(email: string, password: string) {
    try {
      logger.info('Login attempt', { email })

      // Find user
      const user = await userRepository.findByEmail(email)
      if (!user) {
        throw new AuthenticationError('Invalid email or password')
      }

      // Check account status
      if (user.accountStatus !== 'active') {
        throw new AuthenticationError('Account is not active')
      }

      // Verify password
      const isPasswordValid = await cryptoUtils.verifyPassword(
        password,
        user.passwordHash
      )

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password')
      }

      // Get user permissions
      const permissions = await userRepository.getUserPermissions(user.id)

      // Generate tokens
      const accessToken = tokenUtils.generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions,
      })

      const refreshToken = tokenUtils.generateRefreshToken(user.id)

      // Log audit
      await auditService.logAction({
        actionType: 'login',
        entityType: 'user',
        entityId: user.id,
        userId: user.id,
      })

      logger.info('User logged in successfully', { userId: user.id })

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          permissions,
        },
      }
    } catch (error) {
      logger.error('Login error', error)
      throw error
    }
  },

  async refreshToken(refreshToken: string) {
    try {
      logger.info('Refresh token request')

      // Verify refresh token
      const decoded = tokenUtils.verifyRefreshToken(refreshToken)
      if (!decoded) {
        throw new AuthenticationError('Invalid refresh token')
      }

      // Get user
      const user = await userRepository.findById(decoded.sub)
      if (!user || user.accountStatus !== 'active') {
        throw new AuthenticationError('User not found or inactive')
      }

      // Get permissions
      const permissions = await userRepository.getUserPermissions(user.id)

      // Generate new access token
      const newAccessToken = tokenUtils.generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions,
      })

      logger.info('Access token refreshed', { userId: user.id })

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions,
        },
      }
    } catch (error) {
      logger.error('Token refresh error', error)
      throw error
    }
  },

  async logout(userId: number) {
    try {
      logger.info('User logout', { userId })

      await auditService.logAction({
        actionType: 'logout',
        entityType: 'user',
        entityId: userId,
        userId,
      })

      return { success: true }
    } catch (error) {
      logger.error('Logout error', error)
      throw error
    }
  },
}
```

---

## Error Handling

### Custom Error Classes

**src/errors/AppError.ts**
```typescript
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)

    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}
```

---

## Logging

### Logger Utility

**src/utils/logger.ts**
```typescript
import winston, { Logger, format, transports } from 'winston'
import { envConfig } from '@config/env.config'

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    })
  })
)

export const logger: Logger = winston.createLogger({
  level: envConfig.logLevel || 'info',
  format: logFormat,
  defaultMeta: { service: 'stakeholder-platform' },
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}] ${message}`
        })
      ),
    }),

    // Error file transport
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined file transport
    new transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// Log unhandled exceptions
logger.exceptions.handle(
  new transports.File({ filename: 'logs/exceptions.log' })
)

// Log unhandled promise rejections
logger.rejections.handle(
  new transports.File({ filename: 'logs/rejections.log' })
)
```

---

## API Response Format

### Response Formatter

**src/utils/responseFormatter.ts**
```typescript
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  statusCode?: number
  timestamp?: string
  errors?: any
}

export const responseFormatter = {
  success<T>(
    data: T | null = null,
    message: string = 'Success'
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    }
  },

  error(
    message: string,
    options?: {
      statusCode?: number
      details?: any
    }
  ): ApiResponse {
    return {
      success: false,
      message,
      statusCode: options?.statusCode || 500,
      errors: options?.details,
      timestamp: new Date().toISOString(),
    }
  },

  paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): ApiResponse<T[]> & { pagination: any } {
    return {
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    }
  },
}
```

---

## Testing

### Unit Test Example

**__tests__/unit/services/event.service.test.ts**
```typescript
import { eventService } from '@services'
import { eventRepository } from '@repositories'
import { notificationService } from '@services'
import { AppError } from '@errors'

jest.mock('@repositories')
jest.mock('@services/notificationService')

describe('Event Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createEvent', () => {
    it('should create event successfully', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        startDate: new Date('2025-01-01'),
        categoryId: 1,
      }

      const createdEvent = {
        id: 1,
        ...eventData,
        createdBy: 123,
        eventStatus: 'draft',
      }

      ;(eventRepository.create as jest.Mock).mockResolvedValue(createdEvent)
      ;(notificationService.sendEventCreatedNotification as jest.Mock).mockResolvedValue(true)

      const result = await eventService.createEvent(eventData as any, 123)

      expect(result).toEqual(createdEvent)
      expect(eventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Event',
          createdBy: 123,
          eventStatus: 'draft',
        })
      )
    })

    it('should throw error if title is missing', async () => {
      const eventData = {
        description: 'Test Description',
        startDate: new Date('2025-01-01'),
        categoryId: 1,
      }

      await expect(eventService.createEvent(eventData as any, 123)).rejects.toThrow(
        AppError
      )
    })
  })
})
```

---

## Best Practices

### 1. **Layered Architecture**
- Controllers: Handle HTTP requests
- Services: Implement business logic
- Repositories: Handle data access

### 2. **Error Handling**
- Custom error classes
- Consistent error responses
- Proper HTTP status codes

### 3. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Permission-based authorization

### 4. **Logging**
- Log all important operations
- Include context in logs
- Use proper log levels

### 5. **Validation**
- Validate all inputs
- Use Joi for schema validation
- Return clear error messages

### 6. **API Versioning**
- Support multiple API versions
- Easy migration path
- Backward compatibility

### 7. **Database**
- Use repository pattern
- Connection pooling
- Soft delete support

### 8. **Testing**
- Unit tests for services
- Integration tests for APIs
- E2E tests for workflows

---

## Summary

This backend architecture provides:

✅ **Layered Architecture** - Clear separation of concerns  
✅ **Repository Pattern** - Abstracted data access  
✅ **Middleware** - Request processing pipeline  
✅ **Authentication** - JWT-based security  
✅ **Authorization** - Role-based access control  
✅ **Validation** - Input validation with Joi  
✅ **Error Handling** - Consistent error responses  
✅ **Logging** - Comprehensive logging system  
✅ **API Versioning** - Multiple API versions  
✅ **Type Safety** - Full TypeScript support  
✅ **Testability** - Easy to test components  
✅ **Scalability** - Prepared for growth  

**Production-Ready Backend Architecture Complete!** 🎉

*Last Updated: July 2026*
