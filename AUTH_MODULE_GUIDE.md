# Authentication Module - Implementation Guide

**Status:** ✅ Production-Ready  
**Module:** Authentication System (Tier 1 - Critical Path)  
**Generated:** July 2026  
**Technology:** Node.js + Express | React + Redux | MySQL

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Security Features](#security-features)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## Overview

The Authentication Module provides enterprise-grade user authentication, authorization, and account management for the Stakeholder Engagement Platform.

### Key Features

✅ **JWT-based Authentication**
- Access tokens (24h expiry)
- Refresh tokens (7d expiry)
- Automatic token refresh
- Token revocation

✅ **User Management**
- User registration
- Email verification
- Password management
- Account locking
- Profile management

✅ **Multi-Factor Authentication (MFA)**
- TOTP (Time-based One-Time Password)
- Backup codes
- QR code generation
- MFA setup/disable

✅ **Security**
- Password hashing (bcrypt)
- Rate limiting
- Account lockout (5 failed attempts)
- CORS protection
- Helmet security headers

✅ **Role-Based Access Control (RBAC)**
- User roles
- Permissions management
- Role hierarchy
- Dynamic permission checking

---

## Architecture

### Backend Stack

```
Express.js (HTTP Server)
    ↓
Routes (auth.routes.ts)
    ↓
Controllers (authController.ts)
    ↓
Services (authService.ts)
    ↓
Repositories (userRepository.ts)
    ↓
MySQL Database
```

### Frontend Stack

```
React Components
    ↓
Redux Store (authSlice.ts)
    ↓
Axios Service (authService.ts)
    ↓
Backend API
```

### File Structure

**Backend:**
```
backend/src/
├── config/
│   └── env.config.ts
├── database/
│   ├── connection.ts
│   └── migrations/
│       └── 001_auth_schema.sql
├── models/
│   └── User.model.ts
├── repositories/
│   ├── baseRepository.ts
│   └── userRepository.ts
├── services/
│   └── authService.ts
├── controllers/
│   └── authController.ts
├── middleware/
│   └── auth.middleware.ts
├── validators/
│   └── auth.validator.ts
├── utils/
│   ├── cryptoUtils.ts
│   ├── tokenUtils.ts
│   └── logger.ts
├── errors/
│   └── AppError.ts
├── types/
│   └── auth.types.ts
├── api/v1/
│   └── routes/
│       └── auth.routes.ts
├── app.ts
└── index.ts
```

**Frontend:**
```
frontend/src/
├── features/auth/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── store/
│   │   ├── authSlice.ts
│   │   └── authSelectors.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── index.ts
├── store/
│   └── store.ts
```

---

## Backend Setup

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update critical variables:
```env
JWT_SECRET=your-secure-random-key-min-32-chars
JWT_REFRESH_SECRET=another-secure-random-key
DB_PASSWORD=your-database-password
SMTP_PASSWORD=your-email-password
```

### 3. Database Setup

**Create database:**
```sql
CREATE DATABASE stakeholder_platform;
```

**Run migrations:**
```bash
npm run db:migrate
```

This creates tables:
- `users` - User accounts
- `roles` - User roles
- `permissions` - System permissions
- `role_permissions` - Role-permission mapping
- `user_roles` - User-role assignment
- `session_tokens` - Active tokens
- `password_reset_tokens` - Reset tokens
- `mfa_backup_codes` - MFA backup codes
- `audit_logs` - Audit trail
- `departments` - Department hierarchy

**Seed initial data:**
```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 5. Verify Installation

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-07-14T10:00:00.000Z",
  "uptime": 12.345
}
```

---

## Frontend Setup

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update API URL:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1/auth
```

### Authentication Endpoints

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

**MFA Pending Response (202):**
```json
{
  "success": false,
  "message": "MFA verification required",
  "mfaPending": true,
  "data": {
    "userId": 123
  }
}
```

#### 2. Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "departmentId": 1
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 123,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

#### 3. Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

#### 4. Verify Token
```http
GET /auth/verify
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": 123,
    "email": "user@example.com",
    "roleId": 5,
    "roleName": "Employee",
    "permissions": ["events.read", "events.create", ...]
  }
}
```

### MFA Endpoints

#### 1. Setup MFA
```http
POST /auth/mfa/setup
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "MFA setup initiated",
  "data": {
    "qrCode": "data:image/png;base64,...",
    "secret": "JBSWY3DPEBLW64TMMQ======",
    "backupCodes": ["code1", "code2", ...]
  }
}
```

#### 2. Confirm MFA
```http
POST /auth/mfa/confirm
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "token": "123456"
}
```

#### 3. Verify MFA
```http
POST /auth/mfa/verify
Content-Type: application/json

{
  "userId": 123,
  "token": "123456"
}
```

#### 4. Disable MFA
```http
POST /auth/mfa/disable
Authorization: Bearer <accessToken>
```

### Password Management

#### 1. Request Password Reset
```http
POST /auth/password/reset-request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 2. Reset Password
```http
POST /auth/password/reset
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

#### 3. Change Password
```http
POST /auth/password/change
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <accessToken>
```

---

## Usage Examples

### Backend - Using AuthService

```typescript
import { AuthService } from './services/authService';
import { getDatabase } from './database/connection';

const db = getDatabase();
const authService = new AuthService(db);

// Login
const tokenPair = await authService.login(
  { email: 'user@example.com', password: 'password' },
  '192.168.1.1'
);

// Register
const { user, tokenPair } = await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
});

// Setup MFA
const mfaSetup = await authService.setupMFA(userId);

// Verify token
const jwtPayload = await authService.verifyToken(accessToken);
```

### Frontend - Using useAuth Hook

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error,
    login, 
    logout,
    hasPermission,
    hasRole 
  } = useAuth();

  const handleLogin = async () => {
    await login({ 
      email: 'user@example.com', 
      password: 'password' 
    });
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      {hasPermission('events.create') && (
        <button>Create Event</button>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Frontend - Using AuthGuard Component

```typescript
import { AuthGuard } from '@/features/auth/components/AuthGuard';

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthGuard requiredRole="Admin">
            <AdminPage />
          </AuthGuard>
        }
      />
      <Route
        path="/events/create"
        element={
          <AuthGuard requiredPermissions="events.create">
            <CreateEventPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
```

### Frontend - Using authService Directly

```typescript
import { authService } from '@/features/auth/services/authService';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// Register
await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
});

// Setup MFA
const mfaSetup = await authService.setupMFA();

// Change password
await authService.changePassword({
  currentPassword: 'old',
  newPassword: 'new',
  confirmPassword: 'new',
});
```

---

## Security Features

### 1. Password Security

- **Hashing:** bcrypt (10 rounds)
- **Validation:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character

### 2. Token Security

- **JWT Signing:** HS256 algorithm
- **Access Token:** 24-hour expiry
- **Refresh Token:** 7-day expiry
- **Token Storage:** localStorage (frontend)
- **Token Transmission:** Authorization header

### 3. Account Security

- **Failed Login Attempts:** Lock after 5 attempts
- **Account Lockout:** 30 minutes
- **Email Verification:** Required before full access
- **Session Management:** Token-based, no server sessions

### 4. API Security

- **Rate Limiting:** 100 requests per 15 minutes
- **CORS:** Configurable origins
- **HTTPS:** Enforced in production
- **Helmet:** Security headers
- **Input Validation:** All inputs validated server-side

### 5. MFA Security

- **TOTP:** Industry-standard algorithm
- **Backup Codes:** 10 codes, single-use
- **QR Code:** Secure QR generation
- **Recovery:** Backup codes for account recovery

### 6. Data Protection

- **Passwords:** Never logged or stored in plaintext
- **Tokens:** Hashed in database
- **Audit Trail:** All auth actions logged
- **Encryption:** Sensitive data encrypted in transit

---

## Testing

### Backend Tests

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test -- --coverage
```

### Test Files Location
```
backend/src/**/__tests__/
├── authService.test.ts
├── authController.test.ts
├── userRepository.test.ts
└── cryptoUtils.test.ts
```

### Frontend Tests

```bash
# Run all tests
npm test

# UI mode
npm run test:ui

# Coverage
npm test -- --coverage
```

### Test Files Location
```
frontend/src/**/__tests__/
├── useAuth.test.ts
├── authSlice.test.ts
├── LoginForm.test.tsx
└── AuthGuard.test.tsx
```

---

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] HTTPS enabled
- [ ] JWT secrets generated (min 32 chars)
- [ ] CORS origins configured
- [ ] Rate limits adjusted
- [ ] Email service configured
- [ ] Logging service configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000

DB_HOST=prod-db-host
DB_PORT=3306
DB_USER=prod_user
DB_PASSWORD=secure-password
DB_NAME=stakeholder_platform

JWT_SECRET=very-long-secure-random-key-min-32-chars
JWT_REFRESH_SECRET=another-very-long-secure-random-key

CORS_ORIGIN=https://stakeholder-platform.com
APP_URL=https://api.stakeholder-platform.com
FRONTEND_URL=https://stakeholder-platform.com

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=sendgrid-api-key
```

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database name matches `.env`
- Confirm user credentials
- Check port (default 3306)

### JWT Errors
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### MFA Issues
- Verify TOTP secret is saved
- Check system time (TOTP is time-based)
- Backup codes only work once

### CORS Issues
- Verify CORS_ORIGIN matches frontend URL
- Check credentials flag
- Inspect browser console for details

---

## Next Steps

With the Authentication Module complete, proceed to:

1. **User Management Module** - CRUD operations for users
2. **Role Management Module** - Role creation and assignment
3. **Permission Management Module** - Fine-grained permissions
4. **Event Management Module** - Core event functionality

---

**Generated:** July 2026  
**Status:** ✅ Ready for Integration  
**Estimated Integration Time:** 2-3 days
