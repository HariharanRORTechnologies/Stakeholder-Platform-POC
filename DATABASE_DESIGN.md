# MySQL Database Design - Stakeholder Engagement Platform

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Enterprise Standard  
**Technology:** MySQL 8.0+ with InnoDB Storage Engine

---

## 📋 Table of Contents

1. [Database Overview](#database-overview)
2. [Design Principles](#design-principles)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Core Tables](#core-tables)
5. [Event Management Tables](#event-management-tables)
6. [User & Access Control Tables](#user--access-control-tables)
7. [Engagement & Communication Tables](#engagement--communication-tables)
8. [CSR & Campaign Tables](#csr--campaign-tables)
9. [Audit & History Tables](#audit--history-tables)
10. [System Configuration Tables](#system-configuration-tables)
11. [Indexing Strategy](#indexing-strategy)
12. [Performance Considerations](#performance-considerations)

---

## Database Overview

### Database Name
```
stakeholder_engagement_db
```

### Character Set & Collation
```
Character Set: utf8mb4 (Full UTF-8 Support)
Collation: utf8mb4_unicode_ci (Unicode Case-Insensitive)
```

### Storage Engine
```
Engine: InnoDB
Features:
- ACID Transactions
- Foreign Key Constraints
- Crash Recovery
- Row-Level Locking
```

### Database Sizing (Year 1)
```
Estimated Size: 5-10 GB
Growth Rate: ~500 MB/month
Max Concurrent Connections: 500
Connection Pool Size: 100-150
```

---

## Design Principles

### 1. Normalization Standard
- **Third Normal Form (3NF)** for transactional tables
- **Denormalization** for read-heavy analytics tables (Phase 2+)
- **Star Schema** for fact/dimension tables (Phase 2+)

### 2. Audit & Compliance
- Every table includes `created_by`, `updated_by`, `created_at`, `updated_at`
- Immutable audit logs for compliance (7-year retention)
- History tables for critical data changes
- Soft delete support via `deleted_at` field

### 3. Data Integrity
- Primary keys on all tables (surrogate keys via AUTO_INCREMENT)
- Foreign key constraints to enforce referential integrity
- Unique constraints for business identifiers
- Check constraints for domain validation

### 4. Performance
- Strategic indexing on frequently queried columns
- Covering indexes for common query patterns
- Composite indexes for multi-column searches
- Full-text indexes for text search capabilities

### 5. Security
- Encryption at rest (application level for sensitive fields)
- Row-level security via user roles and permissions
- Data masking for PII in audit logs
- Field-level encryption for financial/sensitive data

---

## Entity Relationship Diagram

### ER Diagram (Logical View)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS & ACCESS CONTROL                      │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────┐      ┌──────────────────┐
│  │     USERS        │◄─────│    DEPARTMENTS   │
│  │  (Authentication)│  1:N  │  (Organizational)│
│  └──────────────────┘      └──────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────┐      ┌──────────────────┐
│  │    PROFILES      │      │   USER_DEVICES   │
│  │   (User Info)    │◄─────│  (Multi-Device)  │
│  └──────────────────┘  1:N └──────────────────┘
│
│  ┌──────────────────┐      ┌──────────────────┐
│  │     ROLES        │◄─────│    PERMISSIONS   │
│  │  (Authorization) │  M:N  │    (Fine-grained)│
│  └──────────────────┘      └──────────────────┘
│          │
│        M : N
│          ▼
│  ┌──────────────────────────────────────┐
│  │    ROLE_PERMISSIONS (Junction)       │
│  │  - role_id FK ─► ROLES.id            │
│  │  - permission_id FK ─► PERMISSIONS.id│
│  └──────────────────────────────────────┘
│
│  ┌──────────────────┐
│  │ SESSION_TOKENS   │
│  │ (Authentication) │
│  └──────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      EVENT MANAGEMENT                               │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐    ┌──────────────────────┐
│  │  EVENT_CATEGORIES    │    │    EVENT_TYPES       │
│  │  (Classification)    │    │   (DEWA Events, etc) │
│  └──────────────────────┘    └──────────────────────┘
│          │                            │
│        1 : N                        1 : N
│          ▼                            ▼
│  ┌──────────────────────────────────────────┐
│  │         EVENTS                           │
│  │  - category_id FK                        │
│  │  - type_id FK                            │
│  │  - created_by FK ─► USERS.id             │
│  │  - status (proposal/approved/published)  │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │    EVENT_PROPOSALS                       │
│  │  - event_id FK                           │
│  │  - proposed_by FK ─► USERS.id            │
│  │  - status (draft/submitted/approved)     │
│  └──────────────────────────────────────────┘
│
│  ┌──────────────────────┐    ┌──────────────────────┐
│  │ EVENT_CONFIGURATIONS │    │  EVENT_BUDGETS       │
│  │ (Event Details)      │    │  (Financial Plan)    │
│  └──────────────────────┘    └──────────────────────┘
│          │                            │
│        1 : 1                        1 : 1
│          ▼◄───────────────────────────▼
│  ┌──────────────────────────────────────────┐
│  │         EVENTS (Primary)                 │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │      REGISTRATIONS                       │
│  │  - event_id FK                           │
│  │  - user_id FK ─► USERS.id                │
│  │  - registration_date                     │
│  │  - status (registered/attended/cancelled)│
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │       ATTENDANCE                         │
│  │  - registration_id FK                    │
│  │  - check_in_time                         │
│  │  - check_out_time                        │
│  └──────────────────────────────────────────┘
│          
│  ┌──────────────────────┐
│  │     FEEDBACK         │
│  │  - event_id FK       │
│  │  - user_id FK        │
│  │  - rating (1-5)      │
│  │  - comments          │
│  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │   CERTIFICATES       │
│  │  - event_id FK       │
│  │  - user_id FK        │
│  │  - certificate_url   │
│  └──────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  ENGAGEMENT & COMMUNICATIONS                        │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐
│  │   INVITATIONS        │
│  │  - event_id FK       │
│  │  - recipient_id FK   │
│  │  - status (pending)  │
│  └──────────────────────┘
│
│  ┌──────────────────────────────────────────┐
│  │   NOTIFICATION_TEMPLATES                 │
│  │  - type (email, sms, push)               │
│  │  - template_name                         │
│  │  - subject, body (with placeholders)     │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │      NOTIFICATIONS                       │
│  │  - template_id FK                        │
│  │  - recipient_id FK ─► USERS.id           │
│  │  - status (pending/sent/failed/bounced)  │
│  │  - sent_at, delivery_status              │
│  └──────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────┐
│  │        SURVEYS                           │
│  │  - created_by FK ─► USERS.id             │
│  │  - status (draft/active/closed)          │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │     SURVEY_QUESTIONS                     │
│  │  - survey_id FK                          │
│  │  - question_type (text/multiple/rating)  │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │    SURVEY_RESPONSES                      │
│  │  - question_id FK                        │
│  │  - respondent_id FK ─► USERS.id          │
│  │  - response_value                        │
│  └──────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────┐
│  │   DISCUSSION_FORUM_POSTS                 │
│  │  - created_by FK ─► USERS.id             │
│  │  - parent_post_id (threading)            │
│  │  - content, attachments                  │
│  └──────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CSR & CAMPAIGNS                                  │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐
│  │   CSR_CAMPAIGNS      │
│  │  - created_by FK     │
│  │  - status            │
│  └──────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │     CSR_INITIATIVES                      │
│  │  - campaign_id FK                        │
│  │  - assigned_to FK ─► USERS.id            │
│  │  - status (proposed/approved/active)     │
│  │  - budget, volunteers_needed             │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │  VOLUNTEER_ASSIGNMENTS                   │
│  │  - initiative_id FK                      │
│  │  - volunteer_id FK ─► USERS.id           │
│  │  - assignment_date, hours                │
│  │  - status (assigned/confirmed/completed) │
│  └──────────────────────────────────────────┘
│
│  ┌──────────────────────┐
│  │  AWARENESS_CAMPAIGNS │
│  │  - created_by FK     │
│  │  - status            │
│  └──────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │   CAMPAIGN_RECIPIENTS                    │
│  │  - campaign_id FK                        │
│  │  - recipient_id FK ─► USERS.id           │
│  │  - status (pending/viewed/acted)         │
│  └──────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                 APPROVALS & WORKFLOWS                               │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────────┐
│  │     APPROVAL_WORKFLOWS                   │
│  │  - workflow_type (event/csr/budget)      │
│  │  - created_by FK ─► USERS.id             │
│  │  - entity_id, entity_type                │
│  │  - status (pending/approved/rejected)    │
│  └──────────────────────────────────────────┘
│          │
│        1 : N
│          ▼
│  ┌──────────────────────────────────────────┐
│  │     APPROVAL_STEPS                       │
│  │  - workflow_id FK                        │
│  │  - step_sequence                         │
│  │  - assigned_to FK ─► USERS.id            │
│  │  - status (pending/approved/rejected)    │
│  │  - approval_date, comments               │
│  └──────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              AUDIT, HISTORY & MONITORING                            │
├─────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────────┐
│  │       AUDIT_LOGS                         │
│  │  - user_id FK ─► USERS.id                │
│  │  - action (create/read/update/delete)    │
│  │  - entity_type, entity_id                │
│  │  - old_value, new_value                  │
│  │  - timestamp (immutable, 7-year retain)  │
│  │  - ip_address, user_agent                │
│  └──────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────┐
│  │   ENTITY_HISTORY (For each entity)       │
│  │  - entity_id, entity_type                │
│  │  - change_type (created/updated/deleted) │
│  │  - changed_by FK ─► USERS.id             │
│  │  - changed_at, changes (JSON)            │
│  └──────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### 1. USERS Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Authentication
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  
  -- User Identity
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  phone_number VARCHAR(20),
  employee_id VARCHAR(50) UNIQUE,
  
  -- Organization
  department_id BIGINT,
  job_title VARCHAR(100),
  location VARCHAR(100),
  manager_id BIGINT,
  
  -- Account Status
  account_status ENUM('active', 'inactive', 'suspended', 'archived')
    DEFAULT 'active',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  email_verified_at DATETIME,
  phone_verified_at DATETIME,
  
  -- Multi-Factor Authentication
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_method ENUM('totp', 'sms', 'email') DEFAULT 'totp',
  mfa_secret VARCHAR(255),
  mfa_backup_codes JSON,
  
  -- Account Metadata
  last_login_at DATETIME,
  last_login_ip VARCHAR(50),
  failed_login_attempts INT DEFAULT 0,
  locked_until DATETIME,
  
  -- Access Control
  is_internal BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_ad_synced BOOLEAN DEFAULT TRUE,
  ad_username VARCHAR(100),
  ad_distinguished_name VARCHAR(255),
  
  -- Profile
  profile_picture_url VARCHAR(500),
  bio TEXT,
  preferences JSON,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  
  -- Indexes
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_email (email),
  UNIQUE KEY uk_employee_id (employee_id),
  KEY idx_department_id (department_id),
  KEY idx_manager_id (manager_id),
  KEY idx_account_status (account_status),
  KEY idx_created_at (created_at),
  KEY idx_deleted_at (deleted_at),
  
  -- Foreign Keys
  CONSTRAINT fk_users_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id),
  CONSTRAINT fk_users_manager
    FOREIGN KEY (manager_id)
    REFERENCES users(id),
  CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_users_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id),
    
  FULLTEXT INDEX ft_name (first_name, last_name),
  FULLTEXT INDEX ft_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Key Design Decisions:**
- Surrogate key (auto-increment BIGINT) for performance
- Natural key (username, email) as UNIQUE constraints
- Support for AD sync and MFA
- Soft delete via `deleted_at`
- Comprehensive audit trail
- Full-text indexes for search

---

### 2. ROLES Table

```sql
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Role Identity
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  role_type ENUM('system', 'custom') DEFAULT 'custom',
  
  -- Role Hierarchy
  parent_role_id BIGINT,
  hierarchy_level INT DEFAULT 0,
  
  -- Access Control
  is_active BOOLEAN DEFAULT TRUE,
  can_create_events BOOLEAN DEFAULT FALSE,
  can_approve_events BOOLEAN DEFAULT FALSE,
  can_manage_users BOOLEAN DEFAULT FALSE,
  can_manage_budgets BOOLEAN DEFAULT FALSE,
  can_manage_csr BOOLEAN DEFAULT FALSE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_name (name),
  KEY idx_parent_role_id (parent_role_id),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_roles_parent
    FOREIGN KEY (parent_role_id)
    REFERENCES roles(id),
  CONSTRAINT fk_roles_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_roles_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. PERMISSIONS Table

```sql
CREATE TABLE permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Permission Identity
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Permission Category
  category ENUM('users', 'roles', 'events', 'approvals', 'csr', 'budgets', 
                'notifications', 'reports', 'admin') DEFAULT 'admin',
  
  -- Resource & Action
  resource VARCHAR(100),
  action VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_code (code),
  KEY idx_category (category),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_permissions_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_permissions_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. ROLE_PERMISSIONS Junction Table

```sql
CREATE TABLE role_permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Foreign Keys
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  
  -- Audit Fields
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY uk_role_permission (role_id, permission_id),
  KEY idx_permission_id (permission_id),
  
  -- Foreign Keys
  CONSTRAINT fk_rp_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission
    FOREIGN KEY (permission_id)
    REFERENCES permissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. USER_ROLES Junction Table

```sql
CREATE TABLE user_roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Foreign Keys
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  
  -- Role Assignment Context
  assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by BIGINT,
  effective_from DATETIME,
  effective_until DATETIME,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY uk_user_role (user_id, role_id),
  KEY idx_role_id (role_id),
  KEY idx_is_active (is_active),
  KEY idx_effective_dates (effective_from, effective_until),
  
  -- Foreign Keys
  CONSTRAINT fk_ur_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_assigned_by
    FOREIGN KEY (assigned_by)
    REFERENCES users(id),
  CONSTRAINT fk_ur_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. SESSION_TOKENS Table

```sql
CREATE TABLE session_tokens (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Token Identity
  access_token_hash VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  
  -- User Reference
  user_id BIGINT NOT NULL,
  device_id VARCHAR(100),
  ip_address VARCHAR(50),
  user_agent TEXT,
  
  -- Token Expiration
  access_token_expires_at DATETIME NOT NULL,
  refresh_token_expires_at DATETIME NOT NULL,
  
  -- Token Status
  is_revoked BOOLEAN DEFAULT FALSE,
  revoked_at DATETIME,
  
  -- Audit Fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_access_token (access_token_hash),
  UNIQUE KEY uk_refresh_token (refresh_token_hash),
  KEY idx_user_id (user_id),
  KEY idx_access_expires (access_token_expires_at),
  KEY idx_refresh_expires (refresh_token_expires_at),
  KEY idx_is_revoked (is_revoked),
  
  -- Foreign Keys
  CONSTRAINT fk_st_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. DEPARTMENTS Table

```sql
CREATE TABLE departments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Department Identity
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Organization
  parent_department_id BIGINT,
  department_head_id BIGINT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_code (code),
  KEY idx_parent_id (parent_department_id),
  KEY idx_department_head (department_head_id),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_dept_parent
    FOREIGN KEY (parent_department_id)
    REFERENCES departments(id),
  CONSTRAINT fk_dept_head
    FOREIGN KEY (department_head_id)
    REFERENCES users(id),
  CONSTRAINT fk_dept_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_dept_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Event Management Tables

### 8. EVENT_CATEGORIES Table

```sql
CREATE TABLE event_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Category Identity
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  
  -- Category Properties
  color_code VARCHAR(7),
  parent_category_id BIGINT,
  sequence_order INT DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_code (code),
  KEY idx_parent_category (parent_category_id),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_ec_parent
    FOREIGN KEY (parent_category_id)
    REFERENCES event_categories(id),
  CONSTRAINT fk_ec_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ec_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. EVENTS Table

```sql
CREATE TABLE events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Event Identity
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  event_code VARCHAR(50) UNIQUE,
  
  -- Event Details
  category_id BIGINT NOT NULL,
  event_type ENUM('dewa_event', 'sports', 'csr', 'awareness', 'internal') 
    DEFAULT 'dewa_event',
  
  -- Scheduling
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  registration_start_date DATETIME,
  registration_end_date DATETIME,
  timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
  
  -- Location
  location VARCHAR(255),
  location_details TEXT,
  venue_id BIGINT,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link VARCHAR(500),
  
  -- Capacity
  expected_participants INT DEFAULT 0,
  max_capacity INT,
  registration_status ENUM('open', 'closed', 'waitlist') DEFAULT 'open',
  
  -- Organizer
  created_by BIGINT NOT NULL,
  assigned_to BIGINT,
  department_id BIGINT,
  
  -- Status
  event_status ENUM('draft', 'proposal', 'approved', 'published', 'active', 
                    'completed', 'cancelled') DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Media
  cover_image_url VARCHAR(500),
  agenda_url VARCHAR(500),
  
  -- Audit Fields
  created_by_user BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  
  -- Indexes
  UNIQUE KEY uk_event_code (event_code),
  KEY idx_category_id (category_id),
  KEY idx_event_type (event_type),
  KEY idx_start_date (start_date),
  KEY idx_event_status (event_status),
  KEY idx_created_by (created_by),
  KEY idx_assigned_to (assigned_to),
  KEY idx_created_at (created_at),
  KEY idx_deleted_at (deleted_at),
  FULLTEXT INDEX ft_search (title, description),
  
  -- Foreign Keys
  CONSTRAINT fk_events_category
    FOREIGN KEY (category_id)
    REFERENCES event_categories(id),
  CONSTRAINT fk_events_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_events_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES users(id),
  CONSTRAINT fk_events_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. EVENT_PROPOSALS Table

```sql
CREATE TABLE event_proposals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Proposal Identity
  event_id BIGINT NOT NULL,
  proposal_code VARCHAR(50) UNIQUE,
  
  -- Proposal Details
  proposed_by BIGINT NOT NULL,
  proposal_title VARCHAR(255),
  proposal_description LONGTEXT,
  
  -- Proposal Events
  rationale TEXT,
  expected_outcomes TEXT,
  target_audience TEXT,
  
  -- Status & Approval
  proposal_status ENUM('draft', 'submitted', 'under_review', 'approved', 
                       'rejected', 'needs_revision') DEFAULT 'draft',
  rejection_reason TEXT,
  
  -- Timeline
  submitted_date DATETIME,
  approval_date DATETIME,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_event_id (event_id),
  KEY idx_proposed_by (proposed_by),
  KEY idx_proposal_status (proposal_status),
  KEY idx_created_at (created_at),
  
  -- Foreign Keys
  CONSTRAINT fk_ep_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_ep_proposed_by
    FOREIGN KEY (proposed_by)
    REFERENCES users(id),
  CONSTRAINT fk_ep_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ep_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 11. EVENT_CONFIGURATIONS Table

```sql
CREATE TABLE event_configurations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  event_id BIGINT NOT NULL UNIQUE,
  
  -- Event Settings
  allow_walk_ins BOOLEAN DEFAULT FALSE,
  allow_guest_invitations BOOLEAN DEFAULT FALSE,
  max_guests_per_attendee INT DEFAULT 0,
  
  -- Registration Settings
  require_department_approval BOOLEAN DEFAULT FALSE,
  auto_approve_registrations BOOLEAN DEFAULT TRUE,
  send_confirmation_emails BOOLEAN DEFAULT TRUE,
  send_reminder_emails BOOLEAN DEFAULT TRUE,
  reminder_days_before INT DEFAULT 1,
  
  -- Feedback Settings
  collect_feedback BOOLEAN DEFAULT TRUE,
  feedback_questions JSON,
  
  -- Additional Requirements
  require_additional_info BOOLEAN DEFAULT FALSE,
  additional_fields JSON,
  
  -- Compliance & Attendance
  track_attendance BOOLEAN DEFAULT TRUE,
  require_attendance_confirmation BOOLEAN DEFAULT FALSE,
  certificate_template_id BIGINT,
  
  -- Media & Content
  allow_media_upload BOOLEAN DEFAULT FALSE,
  live_streaming_enabled BOOLEAN DEFAULT FALSE,
  stream_url VARCHAR(500),
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_event_id (event_id),
  
  -- Foreign Keys
  CONSTRAINT fk_ec_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_ec_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ec_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 12. EVENT_BUDGETS Table

```sql
CREATE TABLE event_budgets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  event_id BIGINT NOT NULL UNIQUE,
  
  -- Budget Allocation
  total_budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  venue_cost DECIMAL(15, 2) DEFAULT 0.00,
  catering_cost DECIMAL(15, 2) DEFAULT 0.00,
  marketing_cost DECIMAL(15, 2) DEFAULT 0.00,
  equipment_cost DECIMAL(15, 2) DEFAULT 0.00,
  transportation_cost DECIMAL(15, 2) DEFAULT 0.00,
  speaker_fees DECIMAL(15, 2) DEFAULT 0.00,
  materials_cost DECIMAL(15, 2) DEFAULT 0.00,
  contingency_budget DECIMAL(15, 2) DEFAULT 0.00,
  other_costs DECIMAL(15, 2) DEFAULT 0.00,
  
  -- Budget Status
  budget_status ENUM('draft', 'submitted', 'approved', 'finalized') 
    DEFAULT 'draft',
  approval_date DATETIME,
  
  -- Tracking
  total_spent DECIMAL(15, 2) DEFAULT 0.00,
  remaining_budget DECIMAL(15, 2) DEFAULT 0.00,
  last_reconciliation_date DATETIME,
  
  -- Currency
  currency VARCHAR(3) DEFAULT 'AED',
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_event_id (event_id),
  KEY idx_budget_status (budget_status),
  
  -- Foreign Keys
  CONSTRAINT fk_eb_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_eb_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_eb_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 13. REGISTRATIONS Table

```sql
CREATE TABLE registrations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  
  -- Registration Details
  registration_code VARCHAR(50) UNIQUE,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Registration Type
  registration_type ENUM('self', 'invited', 'admin') DEFAULT 'self',
  
  -- Status
  registration_status ENUM('registered', 'attended', 'no_show', 'cancelled', 
                          'waitlist') DEFAULT 'registered',
  
  -- Additional Info
  additional_info JSON,
  number_of_guests INT DEFAULT 0,
  special_requirements TEXT,
  dietary_restrictions VARCHAR(255),
  
  -- Approval
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_by BIGINT,
  approved_date DATETIME,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  
  -- Indexes
  UNIQUE KEY uk_event_user (event_id, user_id),
  UNIQUE KEY uk_registration_code (registration_code),
  KEY idx_event_id (event_id),
  KEY idx_user_id (user_id),
  KEY idx_registration_status (registration_status),
  KEY idx_created_at (created_at),
  KEY idx_deleted_at (deleted_at),
  
  -- Foreign Keys
  CONSTRAINT fk_reg_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES users(id),
  CONSTRAINT fk_reg_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_reg_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 14. ATTENDANCE Table

```sql
CREATE TABLE attendance (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  registration_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  
  -- Check-in/out
  check_in_time DATETIME,
  check_out_time DATETIME,
  checked_in_by BIGINT,
  
  -- Attendance Status
  attendance_status ENUM('present', 'absent', 'late', 'early_departure') 
    DEFAULT 'absent',
  attendance_duration_minutes INT,
  
  -- Additional Info
  attendance_notes TEXT,
  verification_method ENUM('qr_code', 'manual', 'rfid') DEFAULT 'qr_code',
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_registration_id (registration_id),
  KEY idx_event_id (event_id),
  KEY idx_attendance_status (attendance_status),
  KEY idx_check_in_time (check_in_time),
  
  -- Foreign Keys
  CONSTRAINT fk_att_registration
    FOREIGN KEY (registration_id)
    REFERENCES registrations(id) ON DELETE CASCADE,
  CONSTRAINT fk_att_event
    FOREIGN KEY (event_id)
    REFERENCES events(id),
  CONSTRAINT fk_att_checked_in_by
    FOREIGN KEY (checked_in_by)
    REFERENCES users(id),
  CONSTRAINT fk_att_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_att_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 15. FEEDBACK Table

```sql
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  registration_id BIGINT,
  
  -- Feedback Details
  overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
  content_quality_rating INT CHECK (content_quality_rating >= 1 AND content_quality_rating <= 5),
  venue_rating INT CHECK (venue_rating >= 1 AND venue_rating <= 5),
  organization_rating INT CHECK (organization_rating >= 1 AND organization_rating <= 5),
  
  -- Feedback Content
  positive_feedback TEXT,
  improvement_suggestions TEXT,
  would_attend_again BOOLEAN,
  recommended_topics JSON,
  
  -- Status
  feedback_status ENUM('submitted', 'reviewed', 'archived') DEFAULT 'submitted',
  reviewed_date DATETIME,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_event_id (event_id),
  KEY idx_user_id (user_id),
  KEY idx_overall_rating (overall_rating),
  KEY idx_created_at (created_at),
  
  -- Foreign Keys
  CONSTRAINT fk_feedback_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_feedback_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_feedback_registration
    FOREIGN KEY (registration_id)
    REFERENCES registrations(id),
  CONSTRAINT fk_feedback_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_feedback_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 16. CERTIFICATES Table

```sql
CREATE TABLE certificates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  registration_id BIGINT,
  
  -- Certificate Details
  certificate_code VARCHAR(100) UNIQUE NOT NULL,
  certificate_name VARCHAR(255),
  certificate_text TEXT,
  
  -- Certificate File
  certificate_file_url VARCHAR(500),
  certificate_template_id BIGINT,
  
  -- Certificate Status
  certificate_status ENUM('generated', 'sent', 'downloaded', 'expired') 
    DEFAULT 'generated',
  issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_date DATETIME,
  download_count INT DEFAULT 0,
  last_download_date DATETIME,
  
  -- Verification
  verification_code VARCHAR(100) UNIQUE,
  verification_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_certificate_code (certificate_code),
  UNIQUE KEY uk_verification_code (verification_code),
  KEY idx_event_id (event_id),
  KEY idx_user_id (user_id),
  KEY idx_certificate_status (certificate_status),
  KEY idx_issued_date (issued_date),
  
  -- Foreign Keys
  CONSTRAINT fk_cert_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_cert_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cert_registration
    FOREIGN KEY (registration_id)
    REFERENCES registrations(id),
  CONSTRAINT fk_cert_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_cert_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## User & Access Control Tables

### 17. USER_DEVICES Table

```sql
CREATE TABLE user_devices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Device Identity
  user_id BIGINT NOT NULL,
  device_id VARCHAR(200) NOT NULL UNIQUE,
  device_name VARCHAR(100),
  
  -- Device Info
  device_type ENUM('web', 'mobile_ios', 'mobile_android', 'desktop') 
    DEFAULT 'web',
  operating_system VARCHAR(100),
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  
  -- Device Location
  ip_address VARCHAR(50),
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  
  -- Device Status
  is_trusted BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity DATETIME,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_device_id (device_id),
  KEY idx_user_id (user_id),
  KEY idx_is_active (is_active),
  KEY idx_last_activity (last_activity),
  
  -- Foreign Keys
  CONSTRAINT fk_ud_user
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ud_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ud_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Engagement & Communication Tables

### 18. INVITATIONS Table

```sql
CREATE TABLE invitations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Invitation Identity
  invitation_code VARCHAR(50) UNIQUE,
  event_id BIGINT NOT NULL,
  
  -- Recipient
  recipient_id BIGINT,
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),
  
  -- Invitation Details
  invitation_type ENUM('standard', 'vip', 'speaker', 'sponsor') 
    DEFAULT 'standard',
  invited_by BIGINT NOT NULL,
  invitation_message TEXT,
  
  -- Status
  invitation_status ENUM('pending', 'accepted', 'declined', 'expired', 'revoked') 
    DEFAULT 'pending',
  response_date DATETIME,
  response_message TEXT,
  
  -- Timeline
  invitation_sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiration_date DATETIME,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_invitation_code (invitation_code),
  KEY idx_event_id (event_id),
  KEY idx_recipient_id (recipient_id),
  KEY idx_invitation_status (invitation_status),
  KEY idx_expiration_date (expiration_date),
  
  -- Foreign Keys
  CONSTRAINT fk_inv_event
    FOREIGN KEY (event_id)
    REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_recipient
    FOREIGN KEY (recipient_id)
    REFERENCES users(id),
  CONSTRAINT fk_inv_invited_by
    FOREIGN KEY (invited_by)
    REFERENCES users(id),
  CONSTRAINT fk_inv_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_inv_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 19. SURVEYS Table

```sql
CREATE TABLE surveys (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Survey Identity
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  survey_code VARCHAR(50) UNIQUE,
  
  -- Survey Context
  event_id BIGINT,
  campaign_id BIGINT,
  survey_type ENUM('event_feedback', 'engagement', 'satisfaction', 'custom') 
    DEFAULT 'custom',
  
  -- Survey Timeline
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Survey Settings
  allow_anonymous BOOLEAN DEFAULT FALSE,
  allow_multiple_responses BOOLEAN DEFAULT FALSE,
  randomize_questions BOOLEAN DEFAULT FALSE,
  show_progress_bar BOOLEAN DEFAULT TRUE,
  
  -- Status
  survey_status ENUM('draft', 'active', 'paused', 'closed', 'archived') 
    DEFAULT 'draft',
  
  -- Results
  total_responses INT DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0.00,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_survey_code (survey_code),
  KEY idx_event_id (event_id),
  KEY idx_survey_status (survey_status),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_survey_event
    FOREIGN KEY (event_id)
    REFERENCES events(id),
  CONSTRAINT fk_survey_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_survey_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 20. SURVEY_QUESTIONS Table

```sql
CREATE TABLE survey_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  survey_id BIGINT NOT NULL,
  
  -- Question Details
  question_text LONGTEXT NOT NULL,
  question_type ENUM('text', 'multiple_choice', 'rating', 'checkbox', 'ranking') 
    DEFAULT 'text',
  is_required BOOLEAN DEFAULT TRUE,
  
  -- Question Options
  options JSON,
  min_value INT,
  max_value INT,
  min_label VARCHAR(100),
  max_label VARCHAR(100),
  
  -- Question Properties
  sequence_order INT NOT NULL,
  display_logic JSON,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_survey_id (survey_id),
  KEY idx_sequence_order (sequence_order),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_sq_survey
    FOREIGN KEY (survey_id)
    REFERENCES surveys(id) ON DELETE CASCADE,
  CONSTRAINT fk_sq_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_sq_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 21. SURVEY_RESPONSES Table

```sql
CREATE TABLE survey_responses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  survey_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  respondent_id BIGINT,
  
  -- Response
  response_value LONGTEXT,
  response_numeric INT,
  response_rating INT CHECK (response_rating >= 0 AND response_rating <= 5),
  response_json JSON,
  
  -- Response Metadata
  time_spent_seconds INT,
  is_skipped BOOLEAN DEFAULT FALSE,
  
  -- Audit Fields
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_survey_id (survey_id),
  KEY idx_question_id (question_id),
  KEY idx_respondent_id (respondent_id),
  KEY idx_created_at (created_at),
  
  -- Foreign Keys
  CONSTRAINT fk_sr_survey
    FOREIGN KEY (survey_id)
    REFERENCES surveys(id) ON DELETE CASCADE,
  CONSTRAINT fk_sr_question
    FOREIGN KEY (question_id)
    REFERENCES survey_questions(id) ON DELETE CASCADE,
  CONSTRAINT fk_sr_respondent
    FOREIGN KEY (respondent_id)
    REFERENCES users(id),
  CONSTRAINT fk_sr_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 22. NOTIFICATION_TEMPLATES Table

```sql
CREATE TABLE notification_templates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Template Identity
  template_code VARCHAR(50) UNIQUE NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Template Channel
  notification_type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
  
  -- Template Content
  subject_template VARCHAR(255),
  body_template LONGTEXT NOT NULL,
  html_template LONGTEXT,
  
  -- Template Variables
  template_variables JSON,
  
  -- Template Settings
  is_active BOOLEAN DEFAULT TRUE,
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  retry_count INT DEFAULT 3,
  retry_delay_seconds INT DEFAULT 300,
  
  -- Rate Limiting
  rate_limit_per_user_per_day INT,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_template_code (template_code),
  KEY idx_notification_type (notification_type),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_nt_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_nt_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 23. NOTIFICATIONS Table

```sql
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  template_id BIGINT,
  recipient_id BIGINT NOT NULL,
  
  -- Notification Details
  notification_type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
  subject VARCHAR(255),
  body LONGTEXT NOT NULL,
  
  -- Recipient Info
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),
  recipient_fcm_token VARCHAR(500),
  
  -- Notification Status
  notification_status ENUM('pending', 'sent', 'delivered', 'failed', 'bounced', 
                          'unsubscribed') DEFAULT 'pending',
  sent_at DATETIME,
  delivered_at DATETIME,
  failed_reason TEXT,
  
  -- Retry Info
  retry_count INT DEFAULT 0,
  next_retry_at DATETIME,
  
  -- Tracking
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Links & Actions
  action_url VARCHAR(500),
  metadata JSON,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_template_id (template_id),
  KEY idx_recipient_id (recipient_id),
  KEY idx_notification_status (notification_status),
  KEY idx_notification_type (notification_type),
  KEY idx_sent_at (sent_at),
  KEY idx_is_read (is_read),
  KEY idx_created_at (created_at),
  COMPOSITE_INDEX idx_recipient_status (recipient_id, notification_status),
  
  -- Foreign Keys
  CONSTRAINT fk_notif_template
    FOREIGN KEY (template_id)
    REFERENCES notification_templates(id),
  CONSTRAINT fk_notif_recipient
    FOREIGN KEY (recipient_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_notif_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## CSR & Campaign Tables

### 24. CSR_CAMPAIGNS Table

```sql
CREATE TABLE csr_campaigns (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Campaign Identity
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  campaign_code VARCHAR(50) UNIQUE,
  
  -- Campaign Details
  campaign_type ENUM('awareness', 'engagement', 'initiative', 'volunteering') 
    DEFAULT 'awareness',
  
  -- Timeline
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  
  -- Scope
  target_audience TEXT,
  expected_reach INT DEFAULT 0,
  
  -- Campaign Status
  campaign_status ENUM('draft', 'approved', 'active', 'paused', 'completed', 
                       'cancelled') DEFAULT 'draft',
  
  -- Budget
  allocated_budget DECIMAL(15, 2) DEFAULT 0.00,
  spent_budget DECIMAL(15, 2) DEFAULT 0.00,
  
  -- Metrics
  actual_reach INT DEFAULT 0,
  engagement_count INT DEFAULT 0,
  click_through_rate DECIMAL(5, 2) DEFAULT 0.00,
  conversion_rate DECIMAL(5, 2) DEFAULT 0.00,
  
  -- Media
  cover_image_url VARCHAR(500),
  banner_url VARCHAR(500),
  
  -- Organizer
  created_by BIGINT NOT NULL,
  assigned_to BIGINT,
  
  -- Audit Fields
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_campaign_code (campaign_code),
  KEY idx_campaign_status (campaign_status),
  KEY idx_start_date (start_date),
  KEY idx_created_by (created_by),
  KEY idx_created_at (created_at),
  
  -- Foreign Keys
  CONSTRAINT fk_cc_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_cc_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES users(id),
  CONSTRAINT fk_cc_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 25. CSR_INITIATIVES Table

```sql
CREATE TABLE csr_initiatives (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Initiative Identity
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  initiative_code VARCHAR(50) UNIQUE,
  
  -- Reference
  campaign_id BIGINT NOT NULL,
  
  -- Initiative Details
  initiative_type ENUM('education', 'health', 'environment', 'community', 'other') 
    DEFAULT 'other',
  target_beneficiaries INT DEFAULT 0,
  
  -- Timeline
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  
  -- Status
  initiative_status ENUM('proposed', 'approved', 'active', 'on_hold', 'completed', 
                        'cancelled') DEFAULT 'proposed',
  
  -- Resources
  allocated_budget DECIMAL(15, 2) DEFAULT 0.00,
  spent_budget DECIMAL(15, 2) DEFAULT 0.00,
  volunteers_needed INT DEFAULT 0,
  volunteers_assigned INT DEFAULT 0,
  
  -- Metrics
  expected_impact TEXT,
  actual_impact TEXT,
  completion_percentage INT DEFAULT 0,
  
  -- Owner
  assigned_to BIGINT,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_initiative_code (initiative_code),
  KEY idx_campaign_id (campaign_id),
  KEY idx_initiative_status (initiative_status),
  KEY idx_assigned_to (assigned_to),
  KEY idx_created_at (created_at),
  
  -- Foreign Keys
  CONSTRAINT fk_ci_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES csr_campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_ci_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES users(id),
  CONSTRAINT fk_ci_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ci_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 26. VOLUNTEER_ASSIGNMENTS Table

```sql
CREATE TABLE volunteer_assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  initiative_id BIGINT NOT NULL,
  volunteer_id BIGINT NOT NULL,
  
  -- Assignment Details
  assignment_code VARCHAR(50) UNIQUE,
  assignment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by BIGINT,
  
  -- Assignment Role
  volunteer_role VARCHAR(100),
  expected_hours DECIMAL(7, 2),
  
  -- Status
  assignment_status ENUM('assigned', 'confirmed', 'in_progress', 'completed', 
                        'cancelled', 'no_show') DEFAULT 'assigned',
  
  -- Timeline
  scheduled_start_date DATETIME,
  scheduled_end_date DATETIME,
  actual_start_date DATETIME,
  actual_end_date DATETIME,
  
  -- Tracking
  actual_hours DECIMAL(7, 2),
  hours_worked DECIMAL(7, 2),
  
  -- Evaluation
  performance_rating INT CHECK (performance_rating >= 1 AND performance_rating <= 5),
  feedback TEXT,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_assignment_code (assignment_code),
  KEY idx_initiative_id (initiative_id),
  KEY idx_volunteer_id (volunteer_id),
  KEY idx_assignment_status (assignment_status),
  
  -- Foreign Keys
  CONSTRAINT fk_va_initiative
    FOREIGN KEY (initiative_id)
    REFERENCES csr_initiatives(id) ON DELETE CASCADE,
  CONSTRAINT fk_va_volunteer
    FOREIGN KEY (volunteer_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_va_assigned_by
    FOREIGN KEY (assigned_by)
    REFERENCES users(id),
  CONSTRAINT fk_va_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_va_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Audit & History Tables

### 27. AUDIT_LOGS Table

```sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- User Info
  user_id BIGINT,
  username VARCHAR(100),
  user_email VARCHAR(255),
  
  -- Action Details
  action_type ENUM('create', 'read', 'update', 'delete', 'export', 'import', 
                   'login', 'logout', 'approve', 'reject') NOT NULL,
  
  -- Entity Details
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT,
  entity_name VARCHAR(255),
  
  -- Change Details
  old_value LONGTEXT,
  new_value LONGTEXT,
  changed_fields JSON,
  
  -- Request Details
  ip_address VARCHAR(50),
  user_agent TEXT,
  request_method VARCHAR(10),
  request_url VARCHAR(500),
  request_body LONGTEXT,
  
  -- Response Details
  response_status INT,
  response_time_ms INT,
  
  -- Data Classification
  data_sensitivity ENUM('public', 'internal', 'confidential', 'restricted') 
    DEFAULT 'internal',
  
  -- Compliance
  pii_involved BOOLEAN DEFAULT FALSE,
  requires_review BOOLEAN DEFAULT FALSE,
  review_status ENUM('pending', 'reviewed', 'cleared') DEFAULT 'pending',
  
  -- Audit Fields (immutable)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes (for query performance)
  KEY idx_user_id (user_id),
  KEY idx_entity_type (entity_type),
  KEY idx_action_type (action_type),
  KEY idx_created_at (created_at),
  KEY idx_ip_address (ip_address),
  KEY idx_entity_lookup (entity_type, entity_id),
  COMPOSITE_INDEX idx_user_action (user_id, action_type, created_at),
  
  -- Foreign Key
  CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Audit Log Retention:**
- Immutable: No UPDATE/DELETE operations allowed
- Retention: 7 years for compliance
- Archival: Annual cold storage after 1 year

### 28. ENTITY_HISTORY Table

```sql
CREATE TABLE entity_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Entity Reference
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT NOT NULL,
  entity_version INT DEFAULT 1,
  
  -- Change Details
  change_type ENUM('created', 'updated', 'deleted', 'restored') 
    DEFAULT 'updated',
  changes JSON NOT NULL,
  change_summary TEXT,
  
  -- Who & When
  changed_by BIGINT,
  changed_by_username VARCHAR(100),
  
  -- Status
  is_current BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields (immutable)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_entity_type (entity_type),
  KEY idx_entity_id (entity_id),
  KEY idx_entity_version (entity_version),
  KEY idx_changed_by (changed_by),
  KEY idx_created_at (created_at),
  COMPOSITE_INDEX idx_entity_history (entity_type, entity_id, created_at DESC),
  
  -- Foreign Key
  CONSTRAINT fk_eh_changed_by
    FOREIGN KEY (changed_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## System Configuration Tables

### 29. SYSTEM_SETTINGS Table

```sql
CREATE TABLE system_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Setting Identity
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_name VARCHAR(255),
  description TEXT,
  
  -- Setting Value
  setting_value LONGTEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json', 'date') 
    DEFAULT 'string',
  
  -- Setting Properties
  setting_category ENUM('general', 'email', 'sms', 'notification', 'security', 
                        'performance', 'integration', 'compliance') 
    DEFAULT 'general',
  is_editable BOOLEAN DEFAULT TRUE,
  is_sensitive BOOLEAN DEFAULT FALSE,
  
  -- Validation
  validation_rules JSON,
  allowed_values JSON,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_setting_key (setting_key),
  KEY idx_setting_category (setting_category),
  KEY idx_is_active (is_active),
  
  -- Foreign Keys
  CONSTRAINT fk_ss_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ss_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 30. MEDIA_LIBRARY Table

```sql
CREATE TABLE media_library (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Media Identity
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  
  -- Media Details
  media_type ENUM('image', 'document', 'video', 'audio', 'archive') 
    DEFAULT 'image',
  mime_type VARCHAR(100),
  
  -- Storage
  storage_path VARCHAR(500),
  storage_url VARCHAR(500),
  storage_type ENUM('local', 'azure_blob', 's3') DEFAULT 'local',
  
  -- Media Properties
  width INT,
  height INT,
  duration_seconds INT,
  
  -- Metadata
  description TEXT,
  tags JSON,
  metadata JSON,
  
  -- Access Control
  is_public BOOLEAN DEFAULT TRUE,
  access_level ENUM('public', 'internal', 'restricted') DEFAULT 'internal',
  
  -- Related Entity
  entity_type VARCHAR(100),
  entity_id BIGINT,
  
  -- Status
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  
  -- Indexes
  KEY idx_entity_type (entity_type),
  KEY idx_entity_id (entity_id),
  KEY idx_media_type (media_type),
  KEY idx_is_public (is_public),
  KEY idx_created_by (created_by),
  KEY idx_created_at (created_at),
  KEY idx_deleted_at (deleted_at),
  
  -- Foreign Keys
  CONSTRAINT fk_ml_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_ml_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 31. APPROVAL_WORKFLOWS Table

```sql
CREATE TABLE approval_workflows (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Workflow Identity
  workflow_code VARCHAR(50) UNIQUE,
  workflow_type ENUM('event', 'budget', 'csr_initiative', 'campaign', 'vendor') 
    DEFAULT 'event',
  
  -- Entity Reference
  entity_type VARCHAR(100),
  entity_id BIGINT,
  
  -- Workflow Details
  workflow_name VARCHAR(255),
  description TEXT,
  
  -- Status & Timeline
  workflow_status ENUM('pending', 'in_progress', 'approved', 'rejected', 
                       'needs_revision', 'expired') DEFAULT 'pending',
  submitted_by BIGINT,
  submitted_date DATETIME,
  
  -- Results
  approval_date DATETIME,
  rejection_date DATETIME,
  rejection_reason TEXT,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  UNIQUE KEY uk_workflow_code (workflow_code),
  KEY idx_entity_type (entity_type),
  KEY idx_entity_id (entity_id),
  KEY idx_workflow_status (workflow_status),
  KEY idx_submitted_by (submitted_by),
  
  -- Foreign Keys
  CONSTRAINT fk_aw_submitted_by
    FOREIGN KEY (submitted_by)
    REFERENCES users(id),
  CONSTRAINT fk_aw_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_aw_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 32. APPROVAL_STEPS Table

```sql
CREATE TABLE approval_steps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  
  -- Reference
  workflow_id BIGINT NOT NULL,
  
  -- Step Details
  step_sequence INT NOT NULL,
  step_name VARCHAR(100),
  step_description TEXT,
  
  -- Approval Assignment
  assigned_to BIGINT,
  assigned_group VARCHAR(100),
  
  -- Approval Type
  approval_type ENUM('single', 'any', 'all') DEFAULT 'single',
  
  -- Status
  step_status ENUM('pending', 'approved', 'rejected', 'skipped', 'expired') 
    DEFAULT 'pending',
  
  -- Timeline
  step_due_date DATETIME,
  approval_date DATETIME,
  
  -- Approval Result
  approval_decision ENUM('approved', 'rejected', 'needs_revision') DEFAULT 'approved',
  approval_comments TEXT,
  
  -- Audit Fields
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  KEY idx_workflow_id (workflow_id),
  KEY idx_assigned_to (assigned_to),
  KEY idx_step_status (step_status),
  KEY idx_step_sequence (step_sequence),
  
  -- Foreign Keys
  CONSTRAINT fk_as_workflow
    FOREIGN KEY (workflow_id)
    REFERENCES approval_workflows(id) ON DELETE CASCADE,
  CONSTRAINT fk_as_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES users(id),
  CONSTRAINT fk_as_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id),
  CONSTRAINT fk_as_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Indexing Strategy

### Performance-Critical Indexes

```sql
-- Event Search & Filtering
CREATE INDEX idx_events_search 
ON events(category_id, event_status, start_date, is_public);

-- User Lookups
CREATE INDEX idx_users_auth 
ON users(email, account_status, deleted_at);

CREATE INDEX idx_users_org 
ON users(department_id, manager_id, is_internal);

-- Registration Tracking
CREATE INDEX idx_registrations_active 
ON registrations(event_id, registration_status, deleted_at);

-- Notification Delivery
CREATE INDEX idx_notifications_queue 
ON notifications(notification_status, sent_at, recipient_id);

-- Audit Query Optimization
CREATE INDEX idx_audit_compliance 
ON audit_logs(entity_type, action_type, created_at DESC);

CREATE INDEX idx_audit_user_timeline 
ON audit_logs(user_id, created_at DESC);

-- Session Token Cleanup
CREATE INDEX idx_session_expiry 
ON session_tokens(access_token_expires_at, refresh_token_expires_at);

-- CSR Metrics
CREATE INDEX idx_csr_metrics 
ON csr_initiatives(campaign_id, initiative_status, assigned_to);

-- Survey Analytics
CREATE INDEX idx_survey_responses_analytics 
ON survey_responses(survey_id, question_id, created_at);
```

### Full-Text Search Indexes

```sql
-- Event Search
CREATE FULLTEXT INDEX ft_events 
ON events(title, description);

-- User Search
CREATE FULLTEXT INDEX ft_users 
ON users(first_name, last_name, email);

-- Feedback Search
CREATE FULLTEXT INDEX ft_feedback 
ON feedback(positive_feedback, improvement_suggestions);

-- CSR Initiative Search
CREATE FULLTEXT INDEX ft_csr_initiatives 
ON csr_initiatives(title, description, expected_impact);
```

### Covering Indexes (for common queries)

```sql
-- User Authentication
CREATE INDEX idx_covering_user_auth 
ON users(email, password_hash, account_status, is_email_verified, mfa_enabled);

-- Event List View
CREATE INDEX idx_covering_event_list 
ON events(category_id, event_status, start_date, title, created_by);

-- Notification Inbox
CREATE INDEX idx_covering_notifications 
ON notifications(recipient_id, notification_status, is_read, created_at);
```

---

## Performance Considerations

### Connection Pooling

```
Min Pool Size: 10
Max Pool Size: 100-150
Connection Timeout: 30 seconds
Idle Connection Timeout: 900 seconds
Max Lifetime: 1800 seconds
```

### Query Performance Guidelines

**Optimal Query Response Times:**
- p50: < 100ms
- p95: < 500-1000ms
- p99: < 1-2 seconds

**Large Result Set Pagination:**
- Default page size: 20-50 records
- Max page size: 500 records
- Cursor-based pagination for large datasets

### Caching Strategy

**Database Query Cache (Redis):**
- User roles/permissions: 24 hours
- Event details: 6 hours
- System settings: 24 hours
- Category lists: 24 hours

**Cache Invalidation:**
- Manual invalidation on data updates
- TTL-based expiration
- Event-driven invalidation

### Table Maintenance

**Daily Tasks:**
- Backup (full backup every 24 hours)
- Hourly incremental backups
- Index fragmentation analysis
- Connection pool status check

**Weekly Tasks:**
- OPTIMIZE TABLE on large tables
- Analyze table statistics
- Review slow query logs
- Database growth monitoring

**Monthly Tasks:**
- Full backup verification
- Restore test from backup
- Archive old audit logs
- Review database health metrics

---

## Data Retention Policies

### Transactional Data

| Table | Retention | Archive | Comments |
|-------|-----------|---------|----------|
| AUDIT_LOGS | 7 years | Cold storage after 1 year | Compliance requirement |
| ENTITY_HISTORY | 3 years | Cold storage after 1 year | Historical tracking |
| SESSION_TOKENS | 30 days | No archive | Auto-cleanup after expiry |
| EVENTS | 3 years | Archive after 1 year | Event history |
| REGISTRATIONS | 3 years | Archive after 1 year | Attendance records |
| FEEDBACK | 2 years | Archive after 1 year | Customer satisfaction |

### Soft Delete Strategy

**Soft Delete Implementation:**
- All transactional tables have `deleted_at` DATETIME field
- Never physically delete, always soft delete
- Query filters: `WHERE deleted_at IS NULL`
- Restore capability: Set `deleted_at = NULL`
- Hard delete: After retention period expires

---

## Backup & Recovery Strategy

### Backup Schedule

```
Full Backup: Daily at 02:00 UTC
Incremental: Every 60 minutes
Point-in-time Recovery: Every 5 minutes (binary logs)
Retention: 30 days locally, 1 year off-site
```

### Disaster Recovery

**RTO (Recovery Time Objective):** < 4 hours
**RPO (Recovery Point Objective):** < 1 hour

**Backup Locations:**
- Primary: Local NAS storage
- Secondary: Azure Blob Storage (Phase 2)
- Tertiary: Off-site cold storage (quarterly)

---

## Database Security

### Access Control

- Database-level user roles (read, write, admin)
- Per-table grants
- No direct table access in production
- API-only data access

### Encryption

- AES-256 for sensitive data (application-level)
- TLS 1.2+ for data in transit
- Binary logs encryption
- Backup encryption

### Audit & Monitoring

- All DML operations logged
- Query audit trail
- Failed login attempt tracking
- Regular security assessments

---

**Document End**

*Next Steps: Use accompanying SQL scripts to create database schema, indexes, and initial data*
