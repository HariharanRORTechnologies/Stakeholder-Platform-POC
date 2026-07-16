# MySQL Database Setup Guide

**Stakeholder Engagement Platform**  
**Version:** 1.0  
**Date:** July 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Database Schema](#database-schema)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)

---

## Overview

This database schema implements a comprehensive MySQL 8.0+ database for the **Stakeholder Engagement Platform**. The system supports:

- User management with LDAP/AD integration
- Event lifecycle management (proposal → approval → execution → feedback)
- Role-based access control (RBAC) with 8 predefined roles
- CSR campaigns and volunteer management
- Multi-channel notifications (Email, SMS, Push)
- Approval workflows with multi-step processes
- Comprehensive audit logging (7-year retention)
- Survey and feedback collection
- Media library management

**Database Size (Year 1):** 5-10 GB  
**Estimated Growth:** ~500 MB/month  
**Max Concurrent Connections:** 500  
**Connection Pool:** 100-150

---

## Prerequisites

### System Requirements

- **MySQL Version:** 8.0+ (MySQL 8.0.26+ recommended)
- **Storage:** Minimum 20 GB free space
- **RAM:** 8-16 GB recommended for production
- **Character Set:** UTF-8MB4 support required
- **Time Zone:** System configured for Asia/Dubai (UTC+4)

### Software Requirements

```bash
# MySQL Command Line
mysql --version
# Output: mysql Ver 8.0.26 or higher

# Required privileges
- CREATE DATABASE
- CREATE TABLE
- CREATE INDEX
- ALTER TABLE
- INSERT/UPDATE/DELETE (for initial data)
```

### Network Requirements

- Port 3306 open for MySQL connections
- SSL/TLS 1.2+ for secure connections (recommended)
- Binlog replication enabled for master-slave setup

---

## Installation Steps

### Step 1: Connect to MySQL Server

```bash
# Connect as root or database administrator
mysql -u root -p -h localhost

# Or with specific credentials
mysql -u dbc_admin -p -h localhost
```

### Step 2: Execute SQL Scripts in Order

Execute the following scripts **in this exact order**:

#### 1. Create Database
```bash
mysql -u root -p < 1_CREATE_DATABASE.sql
```

**Output:**
```
Database created successfully!
Database Name: stakeholder_engagement_db
Character Set: utf8mb4
Collation: utf8mb4_unicode_ci
```

#### 2. Create Core Tables (Users, Roles, Permissions)
```bash
mysql -u root -p stakeholder_engagement_db < 2_CREATE_CORE_TABLES.sql
```

**Tables Created:**
- `departments` - Organizational structure
- `users` - User accounts with authentication
- `roles` - Role definitions
- `permissions` - Fine-grained permissions
- `role_permissions` - Role-to-permission mapping
- `user_roles` - User-to-role assignment
- `session_tokens` - JWT token management
- `user_devices` - Multi-device support

**Expected Time:** ~2-3 seconds

#### 3. Create Event Management Tables
```bash
mysql -u root -p stakeholder_engagement_db < 3_CREATE_EVENT_TABLES.sql
```

**Tables Created:**
- `event_categories` - Event classification
- `events` - Main events table
- `event_proposals` - Event proposal workflow
- `event_configurations` - Event settings
- `event_budgets` - Budget tracking
- `registrations` - Registration management
- `attendance` - Attendance tracking
- `feedback` - Event feedback/ratings
- `certificates` - Digital certificates

**Expected Time:** ~2-3 seconds

#### 4. Create Engagement & Communication Tables
```bash
mysql -u root -p stakeholder_engagement_db < 4_CREATE_ENGAGEMENT_TABLES.sql
```

**Tables Created:**
- `invitations` - Event invitations
- `surveys` - Survey management
- `survey_questions` - Survey questions
- `survey_responses` - Survey responses
- `notification_templates` - Message templates
- `notifications` - Notification queue/tracking

**Expected Time:** ~2-3 seconds

#### 5. Create CSR & Campaign Tables
```bash
mysql -u root -p stakeholder_engagement_db < 5_CREATE_CSR_TABLES.sql
```

**Tables Created:**
- `csr_campaigns` - CSR campaigns
- `csr_initiatives` - CSR initiatives
- `volunteer_assignments` - Volunteer tracking

**Expected Time:** ~1-2 seconds

#### 6. Create Audit, History & System Tables
```bash
mysql -u root -p stakeholder_engagement_db < 6_CREATE_AUDIT_AND_SYSTEM_TABLES.sql
```

**Tables Created:**
- `audit_logs` - Immutable audit trail
- `entity_history` - Entity change history
- `system_settings` - System configuration
- `media_library` - Media asset management
- `approval_workflows` - Approval workflow tracking
- `approval_steps` - Individual approval steps

**Expected Time:** ~2-3 seconds

#### 7. Create Performance Indexes
```bash
mysql -u root -p stakeholder_engagement_db < 7_CREATE_INDEXES.sql
```

**Indexes Created:** 40+ strategic indexes
- Composite indexes for multi-column searches
- Covering indexes for common queries
- Full-text search indexes
- Date-based indexes for reporting

**Expected Time:** ~10-15 seconds

#### 8. Load Initial Data
```bash
mysql -u root -p stakeholder_engagement_db < 8_INITIAL_DATA.sql
```

**Data Loaded:**
- 7 Departments
- 8 Roles with 8+ permission levels
- 30+ Permissions
- 7 Event Categories
- 5 Notification Templates
- 22 System Settings

**Expected Time:** ~5-10 seconds

### Step 3: Verify Installation

```sql
-- Connect to database
mysql -u root -p stakeholder_engagement_db

-- Check table count
SELECT COUNT(*) as total_tables FROM information_schema.tables
WHERE table_schema = 'stakeholder_engagement_db';
-- Expected: 32 tables

-- Check index count
SELECT COUNT(*) as total_indexes FROM information_schema.STATISTICS
WHERE table_schema = 'stakeholder_engagement_db';
-- Expected: 150+ indexes

-- Verify initial data
SELECT 
  (SELECT COUNT(*) FROM departments) as departments,
  (SELECT COUNT(*) FROM roles) as roles,
  (SELECT COUNT(*) FROM permissions) as permissions,
  (SELECT COUNT(*) FROM event_categories) as categories;
```

---

## Database Schema

### 32 Tables Organized in 7 Categories

#### **Core Authentication (8 tables)**
- `users` - User accounts
- `departments` - Organizational structure
- `roles` - Role definitions
- `permissions` - Permission definitions
- `role_permissions` - Role-permission mapping
- `user_roles` - User-role assignment
- `session_tokens` - JWT tokens
- `user_devices` - Device tracking

#### **Event Management (9 tables)**
- `event_categories` - Event classification
- `events` - Main events
- `event_proposals` - Event proposals
- `event_configurations` - Event settings
- `event_budgets` - Budget tracking
- `registrations` - User registrations
- `attendance` - Attendance tracking
- `feedback` - Event feedback
- `certificates` - Digital certificates

#### **Communication & Engagement (6 tables)**
- `invitations` - Event invitations
- `surveys` - Survey definitions
- `survey_questions` - Survey questions
- `survey_responses` - Survey responses
- `notification_templates` - Email/SMS templates
- `notifications` - Notification queue

#### **CSR & Campaigns (3 tables)**
- `csr_campaigns` - CSR campaigns
- `csr_initiatives` - CSR initiatives
- `volunteer_assignments` - Volunteer assignments

#### **Audit & Compliance (2 tables)**
- `audit_logs` - Immutable audit trail (7-year retention)
- `entity_history` - Entity version history

#### **System Configuration (4 tables)**
- `system_settings` - Configuration parameters
- `media_library` - Media asset management
- `approval_workflows` - Approval process tracking
- `approval_steps` - Individual approval steps

### Key Features

**Normalization:** 3NF (Third Normal Form)  
**Primary Keys:** Surrogate keys (AUTO_INCREMENT BIGINT)  
**Soft Deletes:** All transactional tables support soft delete  
**Audit Trail:** Every table has created_by, updated_by, created_at, updated_at  
**Cascading:** Foreign key cascading for data integrity  
**Encryption Ready:** Application-level encryption for PII

---

## Data Dictionary

### Common Columns (in all tables)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | BIGINT | Primary key (surrogate) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |
| `created_by` | BIGINT | User who created record |
| `updated_by` | BIGINT | User who updated record |
| `deleted_at` | DATETIME | Soft delete timestamp |

### Enums

**User Account Status:**
- `active` - Active account
- `inactive` - Inactive account
- `suspended` - Temporarily suspended
- `archived` - Archived (kept for audit)

**Event Status:**
- `draft` - Initial draft
- `proposal` - Under proposal review
- `approved` - Approved by management
- `published` - Published to stakeholders
- `active` - Currently happening
- `completed` - Finished
- `cancelled` - Cancelled

**Notification Status:**
- `pending` - Waiting to be sent
- `sent` - Sent successfully
- `delivered` - Delivered to recipient
- `failed` - Failed to send
- `bounced` - Email bounced
- `unsubscribed` - User unsubscribed

---

## Troubleshooting

### Common Issues

#### 1. "Access denied for user"
```bash
# Check MySQL user permissions
SHOW GRANTS FOR 'dbc_admin'@'localhost';

# Grant necessary privileges
GRANT ALL PRIVILEGES ON stakeholder_engagement_db.* 
  TO 'dbc_admin'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. "Table already exists"
```bash
# Drop existing database if starting fresh
DROP DATABASE stakeholder_engagement_db;

# Then re-run scripts from step 1
```

#### 3. "Foreign key constraint fails"
```bash
# Ensure parent tables exist before child tables
# Execute scripts in the correct order (1-8)

# Check foreign key constraints
SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'stakeholder_engagement_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

#### 4. "Disk space error"
```bash
# Extend MySQL data directory
# Or allocate more storage to the partition
# Monitor: SHOW VARIABLES LIKE 'datadir';
```

#### 5. "Slow initial data load"
```sql
-- Disable foreign key checks temporarily (use with caution)
SET FOREIGN_KEY_CHECKS = 0;
-- Load data...
SET FOREIGN_KEY_CHECKS = 1;

-- Or disable indexes during load
ALTER TABLE users DISABLE KEYS;
-- Load data...
ALTER TABLE users ENABLE KEYS;
```

### Validation Queries

```sql
-- Verify all tables exist
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'stakeholder_engagement_db';
-- Expected: 32

-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM roles) as roles,
  (SELECT COUNT(*) FROM permissions) as permissions,
  (SELECT COUNT(*) FROM departments) as departments;

-- Verify indexes
SELECT COUNT(*) as index_count FROM information_schema.STATISTICS
WHERE table_schema = 'stakeholder_engagement_db';
-- Expected: 150+

-- Check foreign key relationships
SELECT COUNT(*) as fk_count FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'stakeholder_engagement_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
-- Expected: 40+
```

---

## Maintenance

### Daily Tasks

```sql
-- Check database size
SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'stakeholder_engagement_db';

-- Verify no corruption
CHECK TABLE users, events, registrations;
```

### Weekly Tasks

```sql
-- Analyze table statistics
ANALYZE TABLE users;
ANALYZE TABLE events;
ANALYZE TABLE registrations;

-- Optimize tables (for InnoDB, this is mostly for file fragmentation)
OPTIMIZE TABLE audit_logs;
```

### Monthly Tasks

```sql
-- Archive old audit logs (after analysis)
-- Backup database
mysqldump -u root -p stakeholder_engagement_db > backup_$(date +%Y%m%d).sql

-- Review slow queries
SHOW PROCESSLIST;
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

### Backup Strategy

```bash
# Full backup
mysqldump -u root -p --all-databases > full_backup.sql

# Database-specific backup
mysqldump -u root -p stakeholder_engagement_db > db_backup.sql

# With binary logs (for point-in-time recovery)
mysqldump -u root -p --all-databases --master-data=2 > backup_with_binlog.sql
```

### Performance Tuning

```sql
-- Rebuild fragmented indexes
OPTIMIZE TABLE events;
OPTIMIZE TABLE registrations;

-- Analyze slow queries
EXPLAIN SELECT * FROM events WHERE event_status = 'active' AND category_id = 1;

-- Check index usage
SELECT * FROM sys.schema_unused_indexes;
```

---

## Production Deployment Checklist

- [ ] Database created in UTF-8MB4
- [ ] All 8 SQL scripts executed in order
- [ ] Initial data loaded successfully
- [ ] 32 tables verified
- [ ] 150+ indexes created
- [ ] Foreign keys validated
- [ ] Backup system configured
- [ ] Replication enabled (Master-Slave)
- [ ] SSL/TLS certificates installed
- [ ] Connection pooling configured
- [ ] Monitoring alerts set up
- [ ] SLA targets defined (99.97% uptime)

---

## Support & Documentation

For complete documentation, refer to:
- `DATABASE_DESIGN.md` - Complete data model
- `FUNCTIONAL_ARCHITECTURE.md` - Business requirements
- `TECHNICAL_ARCHITECTURE.md` - System architecture
- `DEPLOYMENT_OPERATIONS_ARCHITECTURE.md` - DevOps guidelines

---

**Database Setup Complete!** 🎉

The Stakeholder Engagement Platform database is now ready for application development and testing.

For questions or issues, contact the Enterprise Solution Architecture team.

*Last Updated: July 2026*
