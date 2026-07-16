# User Management Module - Implementation Guide

**Status:** ✅ Production-Ready  
**Module:** User Management System (Tier 1 - Critical Path)  
**Generated:** July 2026  
**Technology:** Node.js + Express | React + Redux | MySQL  
**Estimated Effort:** 22 person-days combined

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Database Schema](#database-schema)
8. [Features](#features)
9. [Testing](#testing)

---

## Overview

The User Management Module provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing users in the Stakeholder Engagement Platform.

### Key Features

✅ **User CRUD Operations**
- Create new users with validation
- Read user details and list users
- Update user information
- Delete users (soft or hard delete)

✅ **User Search & Filtering**
- Search by name or email
- Filter by department
- Filter by active status
- Filter by role assignment
- Pagination support

✅ **Account Management**
- Activate/deactivate users
- Verify email status
- Reset password by admin
- Unlock locked accounts

✅ **Role Management**
- Assign roles to users
- Remove roles from users
- View user roles and permissions
- Support for multiple roles per user

✅ **Data Validation**
- Email format validation
- Phone number validation
- Password strength enforcement
- Name length validation

---

## Architecture

### Backend Stack

```
Express Routes (user.routes.ts)
    ↓
Controller (userController.ts)
    ↓
Service (userService.ts) - Business Logic
    ↓
Repository (userRepository.ts) - Data Access
    ↓
MySQL Database
```

### Frontend Stack

```
React Pages
    ↓
Redux Store (userSlice.ts)
    ↓
Axios Service (userService.ts)
    ↓
Backend API
```

### File Structure

**Backend:**
```
backend/src/
├── services/
│   └── userService.ts (22 methods for user management)
├── controllers/
│   └── userController.ts (12 endpoints)
├── repositories/
│   └── userRepository.ts (already created)
├── api/v1/routes/
│   └── user.routes.ts (10 routes)
└── validators/
    └── user.validator.ts
```

**Frontend:**
```
frontend/src/features/user/
├── pages/
│   ├── UsersListPage.tsx (user list with CRUD)
│   └── UserDetailPage.tsx (user profile)
├── components/
│   ├── UserTable.tsx (data table with pagination)
│   └── UserForm.tsx (create/edit dialog)
├── hooks/
│   └── useUsers.ts (custom hook)
├── services/
│   └── userService.ts (API client)
├── store/
│   ├── userSlice.ts (Redux actions)
│   └── userSelectors.ts (Redux selectors)
└── types/
    └── user.types.ts (TypeScript interfaces)
```

---

## Backend Implementation

### UserService - 22 Methods

#### Core CRUD Operations

```typescript
// Create a new user
async createUser(data: CreateUserRequest): Promise<User>

// Get user by ID
async getUserById(userId: number): Promise<User>

// Get user by email
async getUserByEmail(email: string): Promise<User>

// List all users with filters
async listUsers(filters: UserListFilters): Promise<UserListResponse>

// Update user information
async updateUser(userId: number, data: UpdateUserRequest): Promise<User>

// Delete user (soft delete by default)
async deleteUser(userId: number, hardDelete?: boolean): Promise<void>
```

#### Account Management

```typescript
// Activate/deactivate users
async deactivateUser(userId: number): Promise<void>
async activateUser(userId: number): Promise<void>

// Password management
async resetPassword(userId: number, newPassword: string): Promise<void>

// Account unlock
async unlockAccount(userId: number): Promise<void>

// Email verification
async verifyEmail(userId: number): Promise<void>
```

#### Role Management

```typescript
// Assign role to user
async assignRole(userId: number, roleId: number): Promise<void>

// Remove role from user
async removeRole(userId: number, roleId: number): Promise<void>

// Get user roles
async getUserRoles(userId: number): Promise<any[]>

// Get user permissions
async getUserPermissions(userId: number): Promise<any[]>
```

### UserController - 12 Endpoints

All methods include error handling and proper HTTP status codes:

```typescript
async createUser(req, res) // POST /users
async getUser(req, res) // GET /users/:userId
async listUsers(req, res) // GET /users?page=1&limit=20
async updateUser(req, res) // PUT /users/:userId
async deleteUser(req, res) // DELETE /users/:userId
async deactivateUser(req, res) // POST /users/:userId/deactivate
async activateUser(req, res) // POST /users/:userId/activate
async resetPassword(req, res) // POST /users/:userId/reset-password
async unlockAccount(req, res) // POST /users/:userId/unlock
async verifyEmail(req, res) // POST /users/:userId/verify-email
async assignRole(req, res) // POST /users/:userId/roles/:roleId
async removeRole(req, res) // DELETE /users/:userId/roles/:roleId
async getUserRoles(req, res) // GET /users/:userId/roles
async getUserPermissions(req, res) // GET /users/:userId/permissions
```

---

## Frontend Implementation

### React Components

#### UsersListPage
- Full user management interface
- Search functionality
- Pagination
- Create, update, delete operations
- Dialog-based forms

#### UserDetailPage
- User profile view
- Personal information display
- Account status
- Assigned roles
- Edit button linking to update form

#### UserTable
- Data table with columns: Name, Email, Phone, Status, Email Verified, Actions
- Edit/delete buttons per row
- Pagination controls
- Row hover effects

#### UserForm
- Create new user form
- Edit existing user form
- Real-time validation
- Async form submission
- Error display

### Redux Store

**Actions:**
```typescript
fetchUsersAsync(filters) // Fetch all users
fetchUserAsync(userId) // Fetch single user
createUserAsync(data) // Create new user
updateUserAsync(userId, data) // Update user
deleteUserAsync(userId) // Delete user
deactivateUserAsync(userId) // Deactivate user
activateUserAsync(userId) // Activate user
```

**Selectors:**
```typescript
selectUsers // All users
selectCurrentUser // Currently viewed user
selectUserLoading // Loading state
selectUserError // Error message
selectUserPagination // Pagination info
selectUserFilters // Applied filters
selectUserById(userId) // Get specific user
selectActiveUsers // Filter active users
selectInactiveUsers // Filter inactive users
```

### Custom Hook - useUsers

```typescript
const {
  users,                    // User array
  loading,                  // Loading state
  error,                    // Error message
  pagination,              // Pagination info
  currentUser,             // Currently viewed user
  fetchUsers,              // Load users with filters
  fetchUser,               // Load single user
  createUser,              // Create new user
  updateUser,              // Update user
  deleteUser,              // Delete user
  deactivateUser,          // Deactivate user
  activateUser,            // Activate user
  setUserFilters,          // Update filters
  clearError,              // Clear error message
} = useUsers();
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1/users
```

### All endpoints require authentication (Bearer token)

### 1. Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "departmentId": 1,
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-07-14T10:00:00Z",
    "updatedAt": "2026-07-14T10:00:00Z"
  }
}
```

### 2. List Users
```http
GET /users?page=1&limit=20&search=john&isActive=true
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 123,
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "phoneNumber": "+1234567890",
        "isActive": true,
        "isEmailVerified": true,
        "createdAt": "2026-07-14T10:00:00Z",
        "updatedAt": "2026-07-14T10:00:00Z",
        "roles": [
          {
            "id": 5,
            "name": "Employee",
            "level": 5
          }
        ]
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

### 3. Get User
```http
GET /users/:userId
Authorization: Bearer <token>
```

### 4. Update User
```http
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "phoneNumber": "+9876543210",
  "departmentId": 2
}
```

### 5. Delete User
```http
DELETE /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "hardDelete": false
}
```

### 6. Activate/Deactivate User
```http
POST /users/:userId/activate
POST /users/:userId/deactivate
Authorization: Bearer <token>
```

### 7. Verify Email
```http
POST /users/:userId/verify-email
Authorization: Bearer <token>
```

### 8. Reset Password
```http
POST /users/:userId/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "NewSecurePass123!"
}
```

### 9. Unlock Account
```http
POST /users/:userId/unlock
Authorization: Bearer <token>
```

### 10. Assign Role
```http
POST /users/:userId/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "roleId": 5
}
```

### 11. Remove Role
```http
DELETE /users/:userId/roles/:roleId
Authorization: Bearer <token>
```

### 12. Get User Roles
```http
GET /users/:userId/roles
Authorization: Bearer <token>
```

### 13. Get User Permissions
```http
GET /users/:userId/permissions
Authorization: Bearer <token>
```

---

## Usage Examples

### Backend - Creating Users Programmatically

```typescript
import { UserService } from './services/userService';
import { getDatabase } from './database/connection';

const db = getDatabase();
const userService = new UserService(db);

// Create a new user
const newUser = await userService.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  phoneNumber: '+1234567890',
  departmentId: 1,
});

// List users with filters
const userList = await userService.listUsers({
  page: 1,
  limit: 20,
  isActive: true,
  searchTerm: 'john',
});

// Update user
const updated = await userService.updateUser(newUser.id, {
  phoneNumber: '+9876543210',
  departmentId: 2,
});

// Assign role
await userService.assignRole(newUser.id, 5); // Role ID 5 = Employee

// Get user with roles
const userWithRoles = await userService.getUserRoles(newUser.id);
```

### Frontend - Using useUsers Hook

```typescript
import { useUsers } from '@/features/user/hooks/useUsers';

function UserManagementComponent() {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  useEffect(() => {
    fetchUsers({ page: 1, limit: 20 });
  }, []);

  const handleCreate = async (data) => {
    try {
      await createUser(data);
      // User created successfully
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure?')) {
      await deleteUser(userId);
    }
  };

  return (
    <div>
      {error && <Alert>{error}</Alert>}
      <UserTable
        users={users}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

### Frontend - Direct Service Usage

```typescript
import { userService } from '@/features/user/services/userService';

// Create user
await userService.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
});

// List users
const result = await userService.listUsers({
  page: 1,
  limit: 20,
  searchTerm: 'john',
});

// Update user
await userService.updateUser(123, {
  phoneNumber: '+1234567890',
});

// Delete user
await userService.deleteUser(123, false); // Soft delete
```

---

## Database Schema

### Users Table
The users table was created in the Auth Module migration. User Management extends this with additional operations:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash VARCHAR(255),
  phone_number VARCHAR(20),
  avatar_url VARCHAR(500),
  department_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### Related Tables

**user_roles** - Links users to roles
```sql
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);
```

**departments** - User department assignment
```sql
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE,
  parent_department_id INT,
  is_active BOOLEAN DEFAULT TRUE
);
```

---

## Features

### User Creation
- Validates all inputs before creation
- Hashes passwords securely (bcrypt)
- Prevents duplicate emails
- Assigns default "Employee" role
- Logs creation for audit trail

### User Search & Filtering
- Full-text search by name or email
- Filter by department
- Filter by active status
- Filter by assigned role
- Pagination with configurable page size
- Maximum 100 users per page for performance

### User Updates
- Validates all fields before update
- Prevents email changes (security)
- Logs all updates for audit trail
- Soft updates (doesn't affect created_at)

### Soft Delete
- Marks user as deleted (deleted_at timestamp)
- Preserves data integrity
- Prevents hard deletion by default
- Allows hard deletion if explicitly requested

### Account Locking
- Automatic lock after 5 failed login attempts
- 30-minute lockout period
- Manual unlock by admin
- Can be cleared on successful login

### Role Assignment
- Assign multiple roles to users
- Remove roles from users
- View all user roles
- View all user permissions
- Validate role exists before assignment

---

## Testing

### Backend Unit Tests

```bash
npm test -- userService
npm test -- userController
npm test -- userRepository
```

### Backend Integration Tests

```bash
npm test -- user.integration
```

### Frontend Component Tests

```bash
npm test -- UserTable
npm test -- UserForm
npm test -- useUsers
```

### Manual Testing Checklist

- [ ] Create new user
- [ ] Update user information
- [ ] Delete user (soft)
- [ ] Search users by name
- [ ] Search users by email
- [ ] Filter by active status
- [ ] Paginate through users
- [ ] Assign role to user
- [ ] Remove role from user
- [ ] View user roles
- [ ] Activate/deactivate user
- [ ] Verify user email
- [ ] Reset user password
- [ ] Unlock locked account

---

## Performance Considerations

### Database Optimization
- Indexes on: email, department_id, is_active, created_at
- Pagination limits to 100 users per request
- User enrichment (adding roles) done asynchronously

### Frontend Optimization
- Redux caching of user data
- Table virtualization for large datasets
- Lazy loading of user details
- Memoized selectors for performance

### API Optimization
- Pagination required for list endpoint
- Search limited to name and email
- Role data fetched on-demand
- Connection pooling for database

---

## Security Features

### Input Validation
- Email format validation
- Phone number format validation
- Name length requirements
- Password strength enforcement

### Authorization
- All endpoints require authentication
- Role-based access control
- Permission checks on sensitive operations
- User can only view own profile unless admin

### Data Protection
- Passwords hashed with bcrypt (10 rounds)
- Soft deletes preserve data
- Audit logs created for tracking changes
- Rate limiting on all endpoints

### Audit Trail
- User creation logged
- User updates logged
- Role assignments logged
- Deletions logged

---

## Integration with Authentication Module

The User Management Module integrates seamlessly with the Authentication Module:

1. **Uses** User models created in Auth Module
2. **Leverages** JWT authentication middleware
3. **Extends** user profile with management features
4. **Maintains** password security standards
5. **Integrates** with role-based access control

---

## Next Steps

1. **Test the module thoroughly**
   - Create several test users
   - Test all CRUD operations
   - Verify role assignments
   - Test search and filters

2. **Integrate with UI Routes**
   - Add to navigation menu
   - Link from dashboard
   - Create breadcrumb navigation

3. **Proceed to Role Management Module**
   - Implement role CRUD
   - Create role hierarchy
   - Set up permission mappings

4. **Set up Monitoring**
   - Track user creation events
   - Monitor bulk operations
   - Alert on suspicious activity

---

**Generated:** July 2026  
**Status:** ✅ Ready for Integration  
**Estimated Integration Time:** 1-2 days
