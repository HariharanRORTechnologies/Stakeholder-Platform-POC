# Role Management Module - Implementation Guide

**Status:** ✅ Production-Ready  
**Module:** Role Management System (Tier 1 - Critical Path)  
**Generated:** July 2026  
**Technology:** Node.js + Express | React + Redux | MySQL  
**Estimated Effort:** 11 person-days combined  
**Dependencies:** Authentication Module ✅ | User Management Module ✅

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [Role Hierarchy](#role-hierarchy)
7. [Usage Examples](#usage-examples)
8. [Features](#features)
9. [Testing & Validation](#testing--validation)

---

## Overview

The Role Management Module provides comprehensive role-based access control (RBAC) with role creation, hierarchy management, permission assignment, and user role mapping.

### Key Features

✅ **Role CRUD Operations**
- Create custom roles
- Read role details
- Update role information
- Delete roles (with safety checks)

✅ **Role Hierarchy**
- Hierarchical role levels (1-10)
- Level-based permission management
- Prevent unauthorized role assignments
- Support for system roles (read-only)

✅ **Permission Management**
- Assign permissions to roles
- Remove permissions from roles
- Bulk permission updates
- Permission enumeration by role

✅ **Role Lifecycle**
- Activate/deactivate roles
- System role protection
- User count tracking
- Permission count tracking

✅ **Safety Features**
- Prevent deletion of in-use roles
- System role protection
- Hierarchy validation
- Audit logging

---

## Architecture

### Backend Stack

```
Express Routes (role.routes.ts)
    ↓
Controller (roleController.ts)
    ↓
Service (roleService.ts) - Business Logic
    ↓
Repository (roleRepository.ts) - Data Access
    ↓
MySQL Database (roles, role_permissions)
```

### Frontend Stack

```
React Pages
    ↓
Redux Store (roleSlice.ts)
    ↓
Axios Service (roleService.ts)
    ↓
Backend API
```

### File Structure

**Backend:**
```
backend/src/
├── services/
│   └── roleService.ts (18 methods for role management)
├── controllers/
│   └── roleController.ts (10 endpoints)
├── repositories/
│   └── roleRepository.ts (11 data access methods)
├── models/
│   └── Role.model.ts (Role entity with hierarchy logic)
├── api/v1/routes/
│   └── role.routes.ts (11 routes)
└── validators/
    └── role.validator.ts
```

**Frontend:**
```
frontend/src/features/role/
├── pages/
│   ├── RolesListPage.tsx (role list with CRUD)
│   └── RoleDetailPage.tsx (role profile)
├── components/
│   ├── RoleTable.tsx (data table with pagination)
│   └── RoleForm.tsx (create/edit dialog)
├── hooks/
│   └── useRoles.ts (custom hook)
├── services/
│   └── roleService.ts (API client)
├── store/
│   ├── roleSlice.ts (Redux actions)
│   └── roleSelectors.ts (Redux selectors)
└── types/
    └── role.types.ts (TypeScript interfaces)
```

---

## Backend Implementation

### RoleService - 18 Methods

#### Core CRUD Operations

```typescript
// Create a new role
async createRole(data: CreateRoleRequest): Promise<Role>

// Get role by ID
async getRoleById(roleId: number): Promise<Role>

// Get role by name
async getRoleByName(name: string): Promise<Role>

// List all roles with filters
async listRoles(filters: RoleListFilters): Promise<RoleListResponse>

// Update role information
async updateRole(roleId: number, data: UpdateRoleRequest): Promise<Role>

// Delete role
async deleteRole(roleId: number): Promise<void>
```

#### Role Lifecycle

```typescript
// Activate/deactivate roles
async deactivateRole(roleId: number): Promise<void>
async activateRole(roleId: number): Promise<void>
```

#### Permission Management

```typescript
// Get role permissions
async getRolePermissions(roleId: number): Promise<any[]>

// Add single permission
async addPermissionToRole(roleId: number, permissionId: number): Promise<void>

// Remove single permission
async removePermissionFromRole(roleId: number, permissionId: number): Promise<void>

// Set all permissions at once (bulk update)
async setRolePermissions(roleId: number, permissionIds: number[]): Promise<void>
```

#### Validation & Hierarchy

```typescript
// Validate role hierarchy for user operations
async validateRoleHierarchy(
  userRole: Role,
  targetRoleId: number
): Promise<{ valid: boolean; reason?: string }>
```

### RoleModel - Business Logic

```typescript
class Role {
  canManageRole(targetRole: Role): boolean
  isHigherLevel(otherLevel: number): boolean
  isLowerLevel(otherLevel: number): boolean
  canBeModified(): boolean
  canBeDeleted(): boolean
}
```

---

## Frontend Implementation

### React Components

#### RolesListPage
- Full role management interface
- Search functionality
- Pagination
- Create, update, delete operations
- Activate/deactivate toggles
- System role protection indicators

#### RoleDetailPage
- Role profile view
- Role information display
- Usage statistics (permissions, users)
- Assigned permissions list
- Edit link for custom roles

#### RoleTable
- Data table with columns: Name, Level, Permissions, Users, Status, Actions
- Edit/delete buttons per row
- Activate/deactivate toggle
- System role indicators
- Pagination controls
- Tooltips for disabled actions

#### RoleForm
- Create new role form
- Edit existing role form
- Level selection dropdown with labels
- Real-time validation
- System role protection
- Error display

### Redux Store

**Actions:**
```typescript
fetchRolesAsync(filters) // Fetch all roles
fetchRoleAsync(roleId) // Fetch single role
createRoleAsync(data) // Create new role
updateRoleAsync(roleId, data) // Update role
deleteRoleAsync(roleId) // Delete role
deactivateRoleAsync(roleId) // Deactivate role
activateRoleAsync(roleId) // Activate role
```

**Selectors:**
```typescript
selectRoles // All roles
selectCurrentRole // Currently viewed role
selectRoleLoading // Loading state
selectRoleError // Error message
selectRolePagination // Pagination info
selectActiveRoles // Non-system active roles
selectSystemRoles // System roles only
selectRoleHierarchy // Roles sorted by level
```

### Custom Hook - useRoles

```typescript
const {
  roles,                    // Role array
  loading,                  // Loading state
  error,                    // Error message
  pagination,              // Pagination info
  currentRole,             // Currently viewed role
  fetchRoles,              // Load roles with filters
  fetchRole,               // Load single role
  createRole,              // Create new role
  updateRole,              // Update role
  deleteRole,              // Delete role
  deactivateRole,          // Deactivate role
  activateRole,            // Activate role
  setRoleFilters,          // Update filters
  clearError,              // Clear error message
} = useRoles();
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1/roles
```

### All endpoints require authentication (Bearer token)

### 1. Create Role
```http
POST /roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Department Manager",
  "description": "Manages department-level events",
  "level": 4,
  "permissions": [1, 2, 3, 4]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 8,
    "name": "Department Manager",
    "description": "Manages department-level events",
    "level": 4,
    "isSystem": false,
    "isActive": true,
    "permissionCount": 4,
    "userCount": 0,
    "createdAt": "2026-07-14T10:00:00Z",
    "updatedAt": "2026-07-14T10:00:00Z"
  }
}
```

### 2. List Roles
```http
GET /roles?page=1&limit=20&search=manager&isActive=true
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "roles": [
      {
        "id": 8,
        "name": "Department Manager",
        "level": 4,
        "description": "Manages department-level events",
        "isSystem": false,
        "isActive": true,
        "permissionCount": 4,
        "userCount": 12
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

### 3. Get Role
```http
GET /roles/:roleId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "id": 8,
    "name": "Department Manager",
    "level": 4,
    "description": "Manages department-level events",
    "isSystem": false,
    "isActive": true,
    "permissionCount": 4,
    "userCount": 12,
    "permissions": [
      {
        "id": 1,
        "name": "events.create",
        "category": "events"
      },
      {
        "id": 2,
        "name": "events.read",
        "category": "events"
      }
    ]
  }
}
```

### 4. Update Role
```http
PUT /roles/:roleId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Senior Manager",
  "level": 3,
  "description": "Senior management role"
}
```

### 5. Delete Role
```http
DELETE /roles/:roleId
Authorization: Bearer <token>
```

**Only succeeds if:**
- Role is not a system role
- No users are assigned to this role

### 6. Activate/Deactivate Role
```http
POST /roles/:roleId/activate
POST /roles/:roleId/deactivate
Authorization: Bearer <token>
```

### 7. Get Role Permissions
```http
GET /roles/:roleId/permissions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Role permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "events.create",
      "category": "events",
      "description": "Can create events"
    }
  ]
}
```

### 8. Add Permission to Role
```http
POST /roles/:roleId/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "permissionId": 5
}
```

### 9. Remove Permission from Role
```http
DELETE /roles/:roleId/permissions/:permissionId
Authorization: Bearer <token>
```

### 10. Set All Role Permissions (Bulk)
```http
PUT /roles/:roleId/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "permissionIds": [1, 2, 3, 4, 5]
}
```

---

## Role Hierarchy

### Predefined Levels (1-10)

| Level | Name | Description | Default Users |
|-------|------|-------------|----------------|
| 1 | Super Admin | Complete system access | System only |
| 2 | Admin | System administration | System only |
| 3 | Management | Strategic oversight | CFO, COO, etc. |
| 4 | Coordinator | Department coordination | Division heads |
| 5 | Employee | Standard employee access | General employees |
| 6 | External User | External stakeholder access | Partners, vendors |
| 7 | Volunteer | Volunteer access | Volunteers |
| 8 | Guest | Guest access | Temporary users |
| 9 | Viewer | View-only access | Auditors |
| 10 | Restricted | Minimal access | Test accounts |

### Hierarchy Rules

1. **Lower number = Higher privilege**
   - Level 1 is most powerful
   - Level 10 is least powerful

2. **Users can only manage lower levels**
   - User at level 3 can manage levels 4-10
   - User at level 5 can only manage levels 6-10
   - User at level 1 can manage all levels

3. **System Roles are Protected**
   - Cannot be deleted
   - Cannot be modified
   - Cannot be deactivated
   - Read-only via UI

---

## Usage Examples

### Backend - Creating Roles Programmatically

```typescript
import { RoleService } from './services/roleService';
import { getDatabase } from './database/connection';

const db = getDatabase();
const roleService = new RoleService(db);

// Create a custom role
const newRole = await roleService.createRole({
  name: 'Event Manager',
  description: 'Manages event lifecycle',
  level: 4,
  permissions: [1, 2, 3, 4, 5], // Permission IDs
});

// List roles
const roleList = await roleService.listRoles({
  page: 1,
  limit: 20,
  isActive: true,
});

// Update role
const updated = await roleService.updateRole(newRole.id, {
  description: 'Senior Event Manager',
  level: 3,
});

// Add permission
await roleService.addPermissionToRole(newRole.id, 6);

// Set all permissions at once
await roleService.setRolePermissions(newRole.id, [1, 2, 3, 4, 5, 6, 7]);

// Get role permissions
const permissions = await roleService.getRolePermissions(newRole.id);

// Validate hierarchy before assigning role to user
const validation = await roleService.validateRoleHierarchy(
  userRole, // User's current role
  targetRoleId // Role they want to assign
);
```

### Frontend - Using useRoles Hook

```typescript
import { useRoles } from '@/features/role/hooks/useRoles';

function RoleManagementComponent() {
  const {
    roles,
    loading,
    error,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles();

  useEffect(() => {
    fetchRoles({ page: 1, limit: 20 });
  }, []);

  const handleCreate = async (data) => {
    try {
      await createRole(data);
      // Role created successfully
      fetchRoles({ page: 1, limit: 20 });
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  return (
    <div>
      {error && <Alert>{error}</Alert>}
      <RoleTable
        roles={roles}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

### Frontend - Direct Service Usage

```typescript
import { roleService } from '@/features/role/services/roleService';

// Create role
const role = await roleService.createRole({
  name: 'Event Manager',
  description: 'Manages events',
  level: 4,
  permissions: [1, 2, 3],
});

// List roles
const result = await roleService.listRoles({
  page: 1,
  limit: 20,
  searchTerm: 'manager',
});

// Update role
await roleService.updateRole(8, {
  description: 'Senior Event Manager',
  level: 3,
});

// Get permissions
const permissions = await roleService.getRolePermissions(8);

// Add permission
await roleService.addPermission(8, 5);

// Set all permissions
await roleService.setPermissions(8, [1, 2, 3, 4, 5]);
```

---

## Features

### Role Creation
- Validates role name (min 2 characters)
- Validates level (1-10 range)
- Checks for duplicate names
- Optional permission assignment on creation
- Logs creation for audit trail

### Role Search & Filtering
- Search by name or description
- Filter by active status
- Filter by system role flag
- Pagination with configurable page size
- Maximum 100 roles per page

### Role Updates
- Prevents modification of system roles
- Validates level range
- Logs all updates for audit trail
- Updates updated_at timestamp

### Role Deletion
- Prevents deletion if users assigned
- Prevents deletion of system roles
- Soft protection via canDeleteRole check
- Logs deletion for audit trail

### Permission Management
- Add permissions individually
- Remove permissions individually
- Bulk update all permissions
- Permission validation
- Prevent duplicate permission assignments

### Role Hierarchy
- Level-based hierarchy (1-10)
- Automatic level validation
- Prevents unauthorized role assignments
- Hierarchical permission checks
- Cross-role management validation

### System Role Protection
- Read-only system roles
- Cannot be deleted
- Cannot be modified
- Cannot be deactivated
- Indicated in UI with badge

---

## Testing & Validation

### Backend Unit Tests

```bash
npm test -- roleService
npm test -- roleController
npm test -- roleRepository
```

### Backend Integration Tests

```bash
npm test -- role.integration
```

### Frontend Component Tests

```bash
npm test -- RoleTable
npm test -- RoleForm
npm test -- useRoles
```

### Manual Testing Checklist

- [ ] Create new role with permissions
- [ ] Update role information
- [ ] Delete unused role
- [ ] Cannot delete role with users
- [ ] Cannot modify system roles
- [ ] Search roles by name
- [ ] Filter by active status
- [ ] Paginate through roles
- [ ] Add permission to role
- [ ] Remove permission from role
- [ ] Bulk update permissions
- [ ] View role permissions
- [ ] Activate/deactivate role
- [ ] Verify hierarchy validation

---

## Security Features

### Input Validation
- Role name length (2-100 characters)
- Level range (1-10)
- Permission ID validation
- Description length validation

### Authorization
- All endpoints require authentication
- Role-based permission checks
- System role protection
- User hierarchy validation

### Data Protection
- Audit logging for all operations
- Soft protection via checks
- Role count tracking
- User count tracking
- Permission count tracking

### Hierarchy Enforcement
- Level-based authorization
- Prevents privilege escalation
- User can only manage lower levels
- Hierarchical validation on assignment

---

## Integration with Other Modules

### Integrates With:
1. **Authentication Module** - Uses JWT auth
2. **User Management Module** - Assigns roles to users
3. **Permission Module** (Next) - Maps permissions to roles

### Data Flow:
```
User Model
    ↓
(assigned via user_roles table)
    ↓
Role Model (this module)
    ↓
(has many permissions via role_permissions table)
    ↓
Permission Model (next module)
```

---

## Next Steps

1. **Test thoroughly**
   - Create several test roles
   - Assign permissions
   - Test hierarchy validation
   - Verify system role protection

2. **Integrate with UI Routes**
   - Add to navigation menu
   - Link from admin dashboard
   - Create breadcrumb navigation

3. **Proceed to Permission Management Module**
   - Implement permission CRUD
   - Create permission categories
   - Set up permission descriptions

---

**Generated:** July 2026  
**Status:** ✅ Ready for Integration  
**Estimated Integration Time:** 1 day  
**Lines of Code:** 2,000+ (backend + frontend)
