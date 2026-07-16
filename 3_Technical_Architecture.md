# Stakeholder Engagement Platform - Technical Architecture

## Document Information
- **Document Title:** Technical Architecture & System Design
- **Version:** 1.0
- **Date:** July 2026
- **Classification:** Enterprise Architecture Documentation
- **Audience:** Technical Leadership, Architects, Development Teams

---

## 1. Introduction

### 1.1 Purpose
This document describes the technical architecture of the Stakeholder Engagement Platform, including system design patterns, technology stack rationale, infrastructure blueprint, API architecture, and integration patterns. It provides the detailed technical roadmap for implementation teams.

### 1.2 Scope
- Overall system architecture and design patterns
- Technology stack decisions and justifications
- Infrastructure and deployment architecture
- API and integration design
- Security architecture (detailed in separate document)
- Data architecture (detailed in separate document)

---

## 2. System Architecture Overview

### 2.1 Layered Architecture Pattern

The platform follows a **4-tier layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│       CLIENT LAYER (Presentation)       │
│  (React Web, Mobile, Admin Dashboards)  │
└──────────────┬──────────────────────────┘
               │ HTTPS/WSS
┌──────────────▼──────────────────────────┐
│     API GATEWAY LAYER                   │
│  (API routing, rate limiting, auth)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   APPLICATION LOGIC LAYER               │
│  (Business logic, workflows, services)  │
│  (Express.js + Node.js microservices)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      DATA ACCESS LAYER                  │
│  (DAO, repositories, data validation)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    PERSISTENCE & INTEGRATION LAYER      │
│  (MySQL, File Storage, External APIs)   │
└─────────────────────────────────────────┘
```

### 2.2 Architectural Principles

1. **Layering Principle**
   - Each layer has specific responsibilities
   - Layers communicate only through interfaces
   - Lower layers are never aware of upper layers

2. **Single Responsibility Principle**
   - Each service/component has one reason to change
   - Clear separation between business logic and infrastructure

3. **Dependency Inversion**
   - High-level modules don't depend on low-level details
   - Both depend on abstractions (interfaces)

4. **API-First Design**
   - All business capabilities exposed via well-defined APIs
   - Frontend and backend developed independently
   - Enables future mobile app, external integrations

5. **Event-Driven Architecture (Optional Asynchronous Patterns)**
   - Some workflows use publish-subscribe for loose coupling
   - Notification system uses event-driven model
   - Enables scalable, asynchronous processing

---

## 3. Technology Stack Detailed Design

### 3.1 Frontend Architecture

#### 3.1.1 Core Technologies
- **React 18+** - UI framework with hooks-based component architecture
- **Vite** - Build tool for rapid development and optimized production builds
- **TypeScript** - Static typing for improved developer experience and code quality
- **Redux Toolkit** - State management for complex application state
- **React Router v6+** - Client-side routing and navigation
- **Material-UI v5+** - Enterprise component library with accessibility built-in

#### 3.1.2 Supporting Libraries
- **Axios** - HTTP client for API communication with request/response interceptors
- **Formik + Yup** - Form handling and validation
- **React Query** - Server state management and caching
- **Recharts or Chart.js** - Data visualization for dashboards and analytics
- **date-fns** - Date manipulation and formatting
- **i18next** - Internationalization (Arabic/English) with RTL support

#### 3.1.3 Frontend Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (headers, footers)
│   │   ├── events/          # Event-related components
│   │   ├── users/           # User management components
│   │   └── analytics/       # Dashboard and analytics components
│   ├── pages/               # Page-level components (route targets)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer (axios wrappers)
│   ├── store/               # Redux store, slices, selectors
│   │   ├── slices/
│   │   ├── middleware/
│   │   └── store.js
│   ├── utils/               # Utility functions and helpers
│   ├── types/               # TypeScript type definitions
│   ├── locales/             # i18n translation files (ar.json, en.json)
│   ├── styles/              # Global styles, theme configuration
│   └── App.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

#### 3.1.4 State Management Strategy
- **Redux Toolkit for global state** - User context, authentication, app settings
- **React Query for server state** - Event data, user registrations, API responses
- **Local component state** - Form inputs, UI toggles, transient states
- **Session storage** - Temporary data across page refreshes during session

#### 3.1.5 API Communication Pattern

```typescript
// Service layer abstraction
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle token expiry, refresh token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 3.1.6 Performance Optimization Strategies
- **Code splitting** by route using React.lazy() and Suspense
- **Image optimization** - lazy loading, responsive images, WebP format
- **Bundle analysis** - Regular monitoring with Vite/Webpack analyzer
- **Caching strategy** - HTTP cache headers, service worker for offline support
- **Virtual scrolling** - For large lists (event registrations, user lists)

### 3.2 Backend Architecture

#### 3.2.1 Core Technologies
- **Node.js v18+ LTS** - JavaScript runtime with modern ES6+ features
- **Express.js v4+** - Minimalist web framework for routing and middleware
- **TypeScript** - Static typing for backend reliability and developer experience
- **PostgreSQL or MySQL 8+** - Primary relational database
- **Redis** - Caching layer and session store (optional but recommended)

#### 3.2.2 Backend Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers, route logic
│   │   ├── eventController.ts
│   │   ├── userController.ts
│   │   ├── analyticsController.ts
│   │   └── csrController.ts
│   ├── services/            # Business logic layer
│   │   ├── eventService.ts
│   │   ├── userService.ts
│   │   ├── notificationService.ts
│   │   └── analyticsService.ts
│   ├── models/              # Data models, database layer
│   │   ├── Event.ts
│   │   ├── User.ts
│   │   ├── Registration.ts
│   │   └── Feedback.ts
│   ├── routes/              # Express route definitions
│   │   ├── eventRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── authRoutes.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── logging.ts
│   │   ├── rateLimiting.ts
│   │   └── cors.ts
│   ├── utils/               # Utility functions
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── encryption.ts
│   │   └── emailSender.ts
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   ├── server.ts
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/               # TypeScript interfaces and types
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   └── ApiResponse.ts
│   └── app.ts               # Express app setup
├── tests/                   # Unit and integration tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── migrations/              # Database migration scripts
├── seeds/                   # Database seed data
├── .env.example             # Environment variable template
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

#### 3.2.3 Request-Response Flow

```
HTTP Request
    ↓
CORS Middleware (validate origin, headers)
    ↓
Auth Middleware (verify JWT token, extract user context)
    ↓
Input Validation Middleware (request body, query params)
    ↓
Route Handler (Controller)
    ↓
Business Logic (Service layer)
    ↓
Data Access (Model/Repository)
    ↓
Database Query
    ↓
Response Generation (format, serialize)
    ↓
Error Handling Middleware (if error occurred)
    ↓
HTTP Response (JSON)
```

#### 3.2.4 Service Layer Pattern

```typescript
// src/services/eventService.ts
export class EventService {
  async createEvent(eventData: CreateEventDTO): Promise<Event> {
    // Validate event data
    // Check budget approval authority
    // Create event record
    // Audit log entry
    // Trigger notification
    return event;
  }

  async updateEvent(eventId: string, updates: UpdateEventDTO): Promise<Event> {
    // Verify event not past modification deadline
    // Validate changes
    // Update event
    // Trigger approval workflow if needed
    return updatedEvent;
  }

  async registerUser(eventId: string, userId: string, formData: any): Promise<Registration> {
    // Validate registration deadline
    // Check capacity
    // Check duplicate registration
    // Create registration
    // Send confirmation email
    return registration;
  }

  // ... other service methods
}
```

#### 3.2.5 Error Handling Strategy

```typescript
// src/middleware/errorHandler.ts
interface ApiError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;
}

class CustomError extends Error implements ApiError {
  constructor(
    public statusCode: number,
    message: string,
    public errorCode: string,
    public details?: any
  ) {
    super(message);
  }
}

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
});
```

#### 3.2.6 Middleware Stack

| Middleware | Purpose | Example |
|-----------|---------|---------|
| **CORS** | Cross-origin request validation | Allow specified frontend origin |
| **Helmet** | Security headers | X-Frame-Options, CSP, HSTS |
| **Request Logging** | Request/response tracking | Winston/Pino logger |
| **Body Parser** | Parse JSON/form request bodies | express.json() |
| **Auth Validation** | JWT verification, user context | verify token, extract claims |
| **Input Validation** | Request body/param validation | express-validator or Joi |
| **Rate Limiting** | DDoS protection, API abuse prevention | express-rate-limit |
| **Request ID** | Distributed tracing | Unique request ID for logs |
| **Error Handler** | Global error handling | Catch and format errors |

### 3.3 Database Technology

#### 3.3.1 Database Selection: MySQL 8.0+

**Why MySQL:**
- ✓ Requirement specified in RFP
- ✓ Mature RDBMS with strong transaction support
- ✓ Excellent performance for structured data
- ✓ Strong security features (SSL, user permissions)
- ✓ Proven enterprise deployment at scale
- ✓ Good backup and recovery capabilities

#### 3.3.2 Database Architecture

```
┌─────────────────────────────────────────┐
│      Application Layer (Node.js)        │
└──────────────┬──────────────────────────┘
               │ JDBC/MySQL Driver
┌──────────────▼──────────────────────────┐
│      Connection Pool (min 5, max 20)    │
│  (Reuses connections, reduces overhead) │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴───────┐
        │              │
    PRIMARY       REPLICA/SLAVE
    (Read/Write)  (Read-only)
    - UTF8MB4     - Backup
    - InnoDB      - Analytics
    - Replication
```

#### 3.3.3 Connection Pool Configuration

```javascript
// src/config/database.ts
const pool = mysql.createPool({
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
});
```

#### 3.3.4 Indexing Strategy

**Primary Key Indexes** (automatic)
- User ID, Event ID, Registration ID, etc.

**Composite Indexes** (for common queries)
- `(event_id, registration_status)` - Queries by event and registration status
- `(user_id, event_id, check_in_timestamp)` - Attendance tracking
- `(created_date, event_id)` - Historical queries

**Full-Text Indexes** (for search)
- Event name, description, user name

**Performance Indexes**
- Foreign keys for JOIN queries
- Status fields used in WHERE clauses
- Date ranges used in queries

#### 3.3.5 Backup & Recovery Strategy

**Backup Frequency**
- Full backups: Daily (off-peak hours, e.g., 2 AM)
- Incremental backups: Every 6 hours
- Transaction logs: Real-time continuous archiving

**Backup Storage**
- Local backup: MORO data center (primary site)
- Remote backup: Separate geographic location
- Retention: Minimum 30-day rolling window

**Recovery Point Objective (RPO)
- Target: <1 hour of data loss
- Implementation: Combined full + incremental + transaction log backups

**Recovery Time Objective (RTO)**
- Target: <4 hours to full restore
- Testing: Monthly restore drills to verify

#### 3.3.6 High Availability Configuration

```
┌──────────────────────────────────────────┐
│   Master Database (Primary writes)       │
│   - InnoDB replication engine enabled    │
│   - Binary logging enabled               │
│   - max_connections = 200                │
└──────────┬───────────────────────────────┘
           │
           │ Binary log replication
           │ (real-time)
           ▼
┌──────────────────────────────────────────┐
│   Slave Database (Read replicas)         │
│   - read_only = ON                       │
│   - Handles reporting queries            │
│   - Replication lag monitoring           │
└──────────────────────────────────────────┘

Failover Strategy:
- Automated detection of master failure
- Promotion of slave to master (manual or automatic)
- Application connection pool failover
- Notification to operations team
```

### 3.4 Authentication & Authorization

#### 3.4.1 JWT Token Architecture

```typescript
// Token structure
interface JWTPayload {
  sub: string;              // User ID (subject)
  email: string;
  name: string;
  roles: string[];          // Array of role names
  permissions: string[];    // Flattened permissions
  scope: string;           // API scope
  iat: number;             // Issued at
  exp: number;             // Expiration (15 minutes)
  refreshTokenId?: string; // Link to refresh token
}

// Token issuance
const token = jwt.sign(
  {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    permissions: user.permissions,
  },
  process.env.JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: '15m',
    issuer: 'dewa-sep',
    audience: 'dewa-sep-app',
  }
);
```

#### 3.4.2 Token Refresh Pattern

```
Initial Login:
┌──────────────┐
│ Credentials  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Validate credentials against AD/LDAP    │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Issue pair of tokens:                   │
│  - Access token (15 min lifetime)        │
│  - Refresh token (7 days lifetime)       │
│  - Store refresh token in DB with ID    │
└──────────┬───────────────────────────────┘
           │
           ▼
Client stores both tokens

Upon token expiry:
┌──────────────┐
│ Access token │─→ EXPIRED
│ Refresh token│
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Validate refresh token                  │
│  - Check signature                       │
│  - Check expiration                      │
│  - Check revocation status in DB         │
└──────────┬───────────────────────────────┘
           │
           ▼ (if valid)
┌──────────────────────────────────────────┐
│  Issue new access token                  │
│  (Refresh token may be renewed)          │
└──────────┬───────────────────────────────┘
           │
           ▼
Return new access token
```

#### 3.4.3 RBAC Implementation

```typescript
interface Role {
  id: string;
  name: string; // 'admin', 'event_owner', 'employee', etc.
  permissions: Permission[];
  description: string;
}

interface Permission {
  id: string;
  resource: string;     // 'event', 'user', 'csr_campaign', etc.
  action: string;       // 'create', 'read', 'update', 'delete', 'approve'
  scope: string;        // 'own_division', 'all_divisions', 'self', 'all'
}

// Runtime permission check
const canCreateEvent = (user: User, division: Division) => {
  if (user.hasRole('admin')) return true;
  if (user.hasRole('event_owner')) {
    return user.permissions.some(p =>
      p.resource === 'event' && 
      p.action === 'create' && 
      (p.scope === 'all_divisions' || p.scope === division.id)
    );
  }
  return false;
};

// Middleware-level enforcement
app.post('/api/events', 
  requireRole('event_owner'),
  requirePermission('event', 'create'),
  eventController.create
);
```

#### 3.4.4 DEWA Active Directory Integration

```
DEWA Application
    │
    ├─ First login: LDAP authentication against DEWA AD
    │  (Validate username/password)
    │
    ├─ Retrieve user attributes from AD:
    │  - Full name, email, phone
    │  - Department, manager, cost center
    │  - Group memberships
    │
    ├─ Auto-create/update user record in application DB
    │
    ├─ Map AD groups to application roles:
    │  - AD "Event Managers" → "event_owner" role
    │  - AD "Admins" → "admin" role
    │  - All employees → "employee" role
    │
    └─ Issue JWT tokens for subsequent requests

Daily Sync:
- Background job syncs AD changes to application DB
- New employees auto-created
- Terminated employees marked inactive
- Department changes updated
- Group/role changes reflected
```

### 3.5 Caching Strategy

#### 3.5.1 Multi-Level Caching

```
┌─────────────────────────────┐
│     Client-Side Caching     │
│  - Browser cache headers    │
│  - Service worker (offline) │
│  - IndexedDB for large data │
└─────────────┬───────────────┘
              │ HTTP requests
┌─────────────▼───────────────┐
│    CDN (if applicable)      │
│  - Static assets caching    │
│  - Geographic distribution  │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│   Redis Cache Layer         │
│  - Session store            │
│  - Rate limiting counters   │
│  - Recently accessed data   │
│  - Aggregate calculations   │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│   Application Servers       │
│  - In-memory caching        │
│  - Computed values          │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│    MySQL Database           │
│  - Source of truth          │
└─────────────────────────────┘
```

#### 3.5.2 Cache Invalidation Strategy

**Time-Based Expiration (TTL)**
```javascript
// Cache event data for 5 minutes
redis.setex(`event:${eventId}`, 300, JSON.stringify(event));

// User data cached for 1 hour
redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
```

**Event-Based Invalidation**
```typescript
// When event is updated, invalidate related caches
async updateEvent(eventId: string, data: any) {
  const event = await eventModel.update(eventId, data);
  
  // Invalidate caches
  await redis.del(`event:${eventId}`);
  await redis.del(`event:${eventId}:registrations`);
  await redis.del(`events:list`); // List cache affected
  
  // Publish cache invalidation event
  await eventEmitter.emit('event:updated', { eventId });
  
  return event;
}
```

**Pattern-Based Invalidation**
```javascript
// Invalidate all caches matching a pattern
await redis.eval(`
  local keys = redis.call('keys', ARGV[1])
  for i=1,#keys do
    redis.call('del', keys[i])
  end
`, 0, 'event:*:registrations');
```

### 3.6 File Storage Architecture

#### 3.6.1 Phase 1: Local File System Storage

```
/data/
├── events/
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── event_001_materials/
│   │   │   ├── event_001_photos/
│   │   │   └── event_001_recordings/
│   │   └── 02/
│   └── ...
├── users/
│   ├── avatars/
│   └── documents/
├── csrinitiatives/
│   ├── evidence/
│   └── documents/
├── reports/
│   ├── daily/
│   ├── monthly/
│   └── annual/
└── backups/
    ├── daily/
    └── archive/
```

**Storage Characteristics:**
- Organized by type and date for easy cleanup
- File access via application API only (not direct filesystem)
- Symlinks or object references for versioning
- Local disk space monitoring and alerts

#### 3.6.2 Phase 2: Azure Blob Storage Migration

```typescript
// File service abstraction (adapter pattern)
interface FileStorageService {
  upload(path: string, content: Buffer, metadata: any): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getUrl(path: string, expiryMinutes: number): Promise<string>;
}

class LocalFileStorage implements FileStorageService {
  // Phase 1: Local filesystem implementation
}

class AzureBlobStorage implements FileStorageService {
  // Phase 2: Azure Blob Storage implementation
  // No application code changes required - same interface
}

// Application uses interface, not concrete implementation
const fileStorage: FileStorageService = 
  process.env.STORAGE_TYPE === 'azure' 
    ? new AzureBlobStorage() 
    : new LocalFileStorage();

// Usage (identical in both phases)
const fileUrl = await fileStorage.upload(
  'events/2024/01/event_001_photo.jpg',
  imageBuffer,
  { eventId: 'evt_001', contentType: 'image/jpeg' }
);
```

**Azure Benefits for Phase 2:**
- Unlimited scalability (no disk space constraints)
- Geo-redundancy and durability
- Built-in versioning and snapshots
- Signed URLs for secure temporary access
- CDN integration for fast delivery
- Compliance features (encryption, retention policies)

### 3.7 API Architecture

#### 3.7.1 RESTful API Principles

**Base URL:** `https://api.dewa-sep.local/v1`

**Resource-Based Design:**
```
Events:
  GET    /api/v1/events              # List events
  POST   /api/v1/events              # Create event
  GET    /api/v1/events/:id          # Get event details
  PUT    /api/v1/events/:id          # Update event
  DELETE /api/v1/events/:id          # Cancel event

Event Registrations:
  GET    /api/v1/events/:id/registrations
  POST   /api/v1/events/:id/registrations
  PUT    /api/v1/events/:id/registrations/:registrationId

Event Feedback:
  POST   /api/v1/events/:id/feedback
  GET    /api/v1/events/:id/feedback
  GET    /api/v1/events/:id/analytics
```

#### 3.7.2 API Request/Response Format

**Request:**
```json
POST /api/v1/events

Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGc...
  Accept-Language: ar-AE
  X-Request-ID: req_123456789

Body:
{
  "name": "Technology Showcase",
  "description": "...",
  "eventType": "workshop",
  "startDate": "2026-08-15T09:00:00Z",
  "endDate": "2026-08-15T17:00:00Z",
  "maxParticipants": 500,
  "budget": {
    "venue": 50000,
    "catering": 25000,
    "av": 15000,
    "other": 10000
  }
}
```

**Successful Response:**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "evt_abc123",
    "name": "Technology Showcase",
    "status": "draft",
    "createdAt": "2026-07-14T10:30:00Z",
    "createdBy": "user_xyz"
  },
  "meta": {
    "requestId": "req_123456789",
    "timestamp": "2026-07-14T10:30:00Z"
  }
}
```

**Error Response:**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "errors": [
    {
      "field": "maxParticipants",
      "message": "Must be greater than 0",
      "code": "POSITIVE_NUMBER_REQUIRED"
    }
  ],
  "meta": {
    "requestId": "req_123456789",
    "timestamp": "2026-07-14T10:30:00Z"
  }
}
```

#### 3.7.3 API Versioning Strategy

- **URL Path Versioning:** `/api/v1/`, `/api/v2/` etc.
- **Backward Compatibility:** Maintain v1 API for minimum 12 months after v2 release
- **Deprecation Path:** 
  1. Release new API version
  2. Announce deprecation (3 months notice)
  3. Disable in staging/QA (2 months before removal)
  4. Remove from production

#### 3.7.4 Rate Limiting

```typescript
// Rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // Requests per window
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => req.user?.role === 'admin', // Exempt admins
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      errorCode: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      retryAfter: 60, // seconds
    });
  },
});

// Apply to specific routes
app.post('/api/v1/events', limiter, eventController.create);

// Stricter limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
});

app.post('/api/v1/auth/login', authLimiter, authController.login);
```

### 3.8 Monitoring & Observability

#### 3.8.1 Logging Architecture

```typescript
// Structured logging with Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sep-api' },
  transports: [
    // Write errors to separate file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Write all logs to combined file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Usage
logger.info('Event created', {
  eventId: 'evt_abc123',
  userId: 'user_xyz',
  budget: 100000,
});

logger.error('Database connection failed', {
  error: err,
  host: dbHost,
  port: dbPort,
});
```

#### 3.8.2 Metrics & Monitoring

**Application Metrics (Prometheus):**
- Request count by endpoint, method, status
- Request latency (p50, p95, p99)
- Database query duration
- Cache hit/miss rates
- Active user sessions
- Event registration rates
- Error rates by type

**Infrastructure Metrics:**
- CPU usage per server
- Memory usage per process
- Disk I/O and available space
- Network bandwidth in/out
- Database connections (used/available)
- Redis memory usage

**Business Metrics:**
- Events created this period
- Event registration rates
- Attendance rates
- User satisfaction scores
- CSR campaign completion rates

**Alerting Rules:**
```
Alert if:
- Error rate > 1% for 5 minutes
- P95 response time > 5 seconds for 10 minutes
- Database replication lag > 30 seconds
- Disk usage > 80%
- Memory usage > 85%
- Event registration failures > 10 in 1 hour
```

#### 3.8.3 Distributed Tracing

```typescript
// Add request ID and trace context to all logs
app.use((req, res, next) => {
  req.id = req.get('x-request-id') || uuidv4();
  req.traceContext = {
    requestId: req.id,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    timestamp: new Date(),
  };
  
  // Log request
  logger.info('Incoming request', {
    ...req.traceContext,
    query: req.query,
  });
  
  // Log response
  res.on('finish', () => {
    logger.info('Request completed', {
      ...req.traceContext,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.traceContext.timestamp,
    });
  });
  
  next();
});

// Services include trace context in downstream calls
async function createEvent(eventData, traceContext) {
  logger.info('Creating event', { ...traceContext, eventData });
  const event = await eventModel.create(eventData);
  logger.info('Event created successfully', { ...traceContext, eventId: event.id });
  return event;
}
```

---

## 4. Deployment Architecture

### 4.1 Infrastructure Overview

```
┌────────────────────────────────────────────────────────┐
│           DEWA Corporate Network (MORO Data Center)    │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Load Balancer / WAF                │ │
│  │  - HTTPS/TLS termination                        │ │
│  │  - DDoS protection                              │ │
│  │  - Request filtering                            │ │
│  └──────────────┬─────────────────────────────────┘ │
│                 │                                    │
│    ┌────────────┼────────────┐                      │
│    │            │            │                      │
│  ┌─▼──┐      ┌─▼──┐      ┌─▼──┐                    │
│  │ API│      │ API│      │ API│                    │
│  │ 1  │      │ 2  │      │ 3  │  (3 instances)    │
│  └─┬──┘      └─┬──┘      └─┬──┘                    │
│    │            │            │                      │
│    └────────────┼────────────┘                      │
│                 │                                    │
│  ┌──────────────▼────────────────────────────────┐ │
│  │      Cache Layer (Redis)                     │ │
│  │  - Session store                             │ │
│  │  - Rate limiting                             │ │
│  │  - Cached data                               │ │
│  └──────────────┬────────────────────────────────┘ │
│                 │                                    │
│  ┌──────────────▼────────────────────────────────┐ │
│  │    Primary Database (MySQL Master)           │ │
│  │  - Write operations                          │ │
│  │  - Transactions                              │ │
│  │  - Replication log                           │ │
│  └──────────────┬────────────────────────────────┘ │
│                 │                                    │
│    ┌────────────▼────────────┐                     │
│    │                         │                     │
│  ┌─▼──────────────┐   ┌─────▼──────────┐          │
│  │ Replica DB 1   │   │  Replica DB 2  │          │
│  │ (Read-only)    │   │ (Read-only)    │          │
│  └────────────────┘   └────────────────┘          │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │      File Storage (NFS or SAN)              │ │
│  │  - Event materials                          │ │
│  │  - User documents                           │ │
│  │  - Backup storage                           │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │    External Integrations                    │ │
│  │  - DEWA AD/LDAP                             │ │
│  │  - Email gateway (Exchange)                 │ │
│  │  - SMS gateway                              │ │
│  │  - Future: SAP, Teams, SharePoint, etc.    │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘

                    ↑
                   HTTPS
                    ↓

┌─────────────────────────────────────────┐
│      Client Applications                │
│  ├─ Web Browser (React SPA)              │
│  ├─ Mobile App (iOS/Android)             │
│  └─ Admin Dashboards                    │
└─────────────────────────────────────────┘
```

### 4.2 Environment Configuration

**Development Environment:**
- Single server (or developer laptops)
- H2 in-memory database or local MySQL
- No replication
- Simplified caching
- Debug logging enabled

**QA/Staging Environment:**
- Identical to production (3 API servers, replicated DB)
- Test data mirrors production
- Limited concurrency testing (500 users max)
- Security scanning enabled
- Performance baseline testing

**Production Environment:**
- HA configuration (3 API servers)
- Master-slave MySQL replication
- Redis cache layer
- Professional backup strategy
- Production-grade monitoring
- Load balancing with failover

### 4.3 Deployment Process

```
Code Commit
    ↓
CI/CD Pipeline Triggered
    ├─ Build Docker images
    ├─ Run unit tests
    ├─ Run integration tests
    ├─ Security scanning (SAST)
    ├─ Code quality checks
    └─ Build artifacts
    ↓
Deployment to QA
    ├─ Run smoke tests
    ├─ Run integration tests in QA environment
    ├─ Performance testing
    └─ Security testing (penetration, DAST)
    ↓
Manual Approval (Release Manager)
    ↓
Blue-Green Deployment to Production
    ├─ Deploy to "Green" environment (new version)
    ├─ Run smoke tests against green
    ├─ Switch load balancer to green
    ├─ Monitor for errors (5-10 minutes)
    └─ Cleanup old "blue" environment
    ↓
Production Go-Live
    ↓
Post-Deployment Monitoring
    ├─ Monitor error rates
    ├─ Monitor performance metrics
    ├─ Monitor business metrics
    └─ Alert on anomalies
```

### 4.4 Scaling Strategy

**Horizontal Scaling:**
- Add API server instances when CPU > 70% for 10 minutes
- Remove instances when CPU < 30% for 20 minutes
- Maintain minimum 2 instances, maximum 10 instances
- Connection pooling for database connections

**Vertical Scaling:**
- Database: Upgrade to larger VM if disk usage > 80% or memory >85%
- Cache: Redis cluster with sharding if data size > 100GB
- File storage: Expand NAS or migrate to cloud storage

**Database Scaling:**
- Read replicas for analytics and reporting queries
- Potential sharding if data size exceeds 1TB (future consideration)
- Query optimization to reduce database load

---

## 5. Technology Integration Points

### 5.1 Active Directory / LDAP Integration

```
┌─────────────────────────────────────────┐
│  DEWA Active Directory                  │
│  - User identities                      │
│  - Group memberships                    │
│  - Department hierarchy                 │
└──────────────┬──────────────────────────┘
               │
               │ LDAP protocol (port 389 or 636 for LDAPS)
               │
┌──────────────▼──────────────────────────┐
│  Application Server                     │
│  - Authentication: LDAP bind on login   │
│  - Sync job: Daily group sync           │
│  - Mapping: AD groups → App roles       │
└─────────────────────────────────────────┘
```

### 5.2 Email Integration (MS Exchange)

```
Application Server
    │
    ├─ SMTP (port 587, with TLS)
    │  └─ Transactional emails (registrations, confirmations)
    │
    ├─ EWS (Exchange Web Services)
    │  └─ Calendar integration (optional, future)
    │
    └─ Exchange mailbox (service account)
       └─ Bounce handling, delivery reports

Notification Service:
- Email queuing and retry logic
- Bounce/failure handling
- Template rendering (Handlebars)
- Attachment support (PDFs, certificates)
```

### 5.3 SMS Gateway Integration

```
┌──────────────────────────────────────┐
│  Notification Service                │
│  - Event registration confirmations  │
│  - Event day reminders               │
│  - Critical announcements            │
└──────────────┬───────────────────────┘
               │
               │ HTTPS API
               │
┌──────────────▼───────────────────────┐
│  DEWA SMS Gateway                    │
│  - Validates phone numbers           │
│  - Enqueues SMS for delivery         │
│  - Delivery reports                  │
│  - Balances/quotas management        │
└──────────────────────────────────────┘
```

### 5.4 Future Integration: Microsoft 365

```
Teams Integration:
├─ Create Teams channels for events
├─ Post announcements and updates
├─ Link Teams meeting to virtual events
└─ Export team rosters to registrations

SharePoint Integration:
├─ Store event documents and materials
├─ Version control for event planning docs
├─ Collaboration on proposal documents
└─ Document retention per policy

Outlook Integration:
├─ Create calendar events
├─ Send meeting invitations
└─ Track RSVP responses
```

---

## 6. Non-Functional Requirements Support

### 6.1 Performance: <2 Second Response Time

**Strategy:**
1. **API Response Times:**
   - List endpoints: <500ms (with caching)
   - Get single resource: <300ms
   - Create/update: <800ms (including DB commit)

2. **Database Query Optimization:**
   - Proper indexing (covered in Data Architecture)
   - Query result limit and pagination
   - Avoid N+1 queries (use JOIN, eager loading)
   - Query timeout: 30 seconds

3. **Caching Strategy:**
   - Cache static data (roles, permissions) for 1 hour
   - Cache event lists for 5 minutes
   - Cache user profile for 1 hour
   - Cache registration counts for 1 minute

4. **Frontend Performance:**
   - Code splitting by route
   - Lazy loading of images
   - Service worker caching of static assets
   - Compress API responses with gzip

**Performance Testing:**
- Load test with 2000 concurrent users
- Ramp-up: 50 users per second
- Test duration: 10 minutes sustained load
- Success criteria: p95 response time <2s, error rate <0.1%

### 6.2 Availability: 99.9% Uptime (99.97% target)

**99.9% = ~9 hours downtime/year = ~45 minutes/month**
**99.97% = ~2.6 hours downtime/year = ~13 minutes/month**

**Strategy:**
1. **Infrastructure Redundancy:**
   - 3 API servers (2 for redundancy, 1 for capacity)
   - Load balancer with automatic failover
   - Database master-slave replication
   - Cache cluster for session persistence

2. **Deployment Safety:**
   - Blue-green deployment (zero-downtime)
   - Canary releases (1% traffic to new version)
   - Quick rollback capability (<5 minutes)
   - Feature flags for gradual rollout

3. **Monitoring & Alerting:**
   - Monitor error rates, response times, resource utilization
   - Alert on anomalies (automatic escalation)
   - On-call rotation for critical alerts
   - Runbooks for common issues

4. **Disaster Recovery:**
   - Automated daily backups with testing
   - Geographic redundancy (backup in different location)
   - RTO: 4 hours (restore full system)
   - RPO: 1 hour (max data loss)

### 6.3 Security: ISR v2, ISO 27001 Compliance

**Key Controls:**
- Encryption: AES-256 at rest, TLS 1.2+ in transit
- Authentication: JWT tokens, AD integration, MFA for admins
- Authorization: RBAC with granular permissions
- Audit logging: All actions logged with user/timestamp
- Input validation: Sanitize all inputs to prevent injection attacks
- Output encoding: Prevent XSS attacks
- CSRF protection: Token-based CSRF prevention

**Security Testing:**
- Penetration testing (annual)
- Vulnerability scanning (quarterly)
- Code security review (per release)
- Dependency scanning (continuous)

### 6.4 Scalability: 2000 Concurrent Users

**Load Distribution:**
- 2000 users / 3 servers = ~667 users per server
- Node.js single-threaded, but event-driven (handles concurrency well)
- Connection pool: 20 DB connections per server = 60 total
- Redis connection pool ensures no bottleneck

**Scaling Triggers:**
- Add API server if average CPU > 70% for 10 minutes
- Remove server if average CPU < 30% for 20 minutes
- Auto-scale based on metrics, max 10 servers

**Database Scaling:**
- Read replicas for analytics and reporting queries
- Connection pooling limits: 200 total (20 per server × 10 servers)
- Query optimization to reduce per-query load

---

## 7. Development Standards

### 7.1 Code Quality Standards

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

**Linting (ESLint):**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-types": "error"
  }
}
```

**Testing Standards:**
- Unit test coverage: >80%
- Integration test coverage: >60%
- Critical paths: 100% covered
- Test framework: Jest
- E2E testing: Cypress or Playwright

### 7.2 Code Organization Best Practices

- **DRY (Don't Repeat Yourself):** Extract common logic to utilities/services
- **SOLID Principles:** Apply throughout codebase
- **Clear Naming:** Descriptive variable/function names
- **Small Functions:** Single responsibility, <50 lines
- **Comments Only When Necessary:** Code should be self-documenting

---

## 8. Summary

This Technical Architecture document provides the detailed technical blueprint for implementing the Stakeholder Engagement Platform. Key highlights:

1. **4-tier layered architecture** with clear separation of concerns
2. **Modern technology stack** (React, Node.js, Express, MySQL, Redis)
3. **Scalable design** supporting 2000 concurrent users with <2 second response times
4. **Enterprise-grade security** with JWT, RBAC, encryption, and audit logging
5. **High availability** through redundancy and failover mechanisms
6. **Comprehensive monitoring** with structured logging, metrics, and alerting
7. **Future-ready** with abstraction layers enabling cloud migration, integration expansion

The architecture balances simplicity with enterprise requirements, providing a solid foundation for a 9-month implementation and years of operational success.

---

*End of Technical Architecture Document*
