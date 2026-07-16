# Stakeholder Engagement Platform - Data Architecture

## Document Information
- **Document Title:** Data Architecture & Database Design
- **Version:** 1.0
- **Date:** July 2026
- **Classification:** Enterprise Architecture Documentation
- **Audience:** Data Architects, Database Engineers, Development Teams

---

## 1. Introduction

### 1.1 Purpose
This document specifies the database design, data models, data flows, and data governance for the Stakeholder Engagement Platform. It provides detailed schema definitions, relationship diagrams, and data management strategies.

### 1.2 Design Goals
- Support all functional requirements without data redundancy
- Enable efficient querying for common use cases
- Maintain data integrity through proper relationships and constraints
- Provide audit trail for compliance and security
- Enable future analytics and reporting capabilities
- Support high concurrency (2000+ simultaneous users)

---

## 2. Data Model Overview

### 2.1 Core Entity Categories

The data model is organized into five main categories:

1. **Identity & Access Management** - Users, roles, permissions, authentication
2. **Event Management** - Events, registrations, attendance, feedback
3. **CSR & Initiatives** - CSR campaigns, initiatives, approvals, evidence
4. **Stakeholder Management** - Stakeholder profiles, engagement history, relationships
5. **System & Audit** - Audit logs, system configurations, notifications

### 2.2 Entity Relationship Diagram (High-Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                    IDENTITY & ACCESS MANAGEMENT                 │
├─────────────────────────────────────────────────────────────────┤
│  User ──┬─→ Profile                                             │
│         ├─→ Role (M:N) ──→ Permission (M:N)                     │
│         ├─→ Department                                           │
│         └─→ Session Token (M:1)                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ created_by, managed_by, approved_by
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      EVENT MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────┤
│  Event ──┬─→ EventProposal (proposal workflow)                  │
│          ├─→ EventConfiguration (settings)                      │
│          ├─→ EventBudget ──→ BudgetLineItem                     │
│          │                ──→ Expense                           │
│          ├─→ EventTeam (coordinators, volunteers)               │
│          ├─→ Venue                                              │
│          ├─→ Registration ──→ RegistrationResponse              │
│          ├─→ Invitation                                         │
│          ├─→ Attendance                                         │
│          ├─→ Feedback ──→ FeedbackResponse                      │
│          ├─→ Announcement                                       │
│          ├─→ EventMetric (pre-calculated)                       │
│          └─→ EventDocument                                      │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ owner_id, participant_id
             │
┌────────────▼────────────────────────────────────────────────────┐
│              CSR & INITIATIVE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────────┤
│  CSRCampaign ──→ CampaignContent                                │
│                 CampaignEngagement                              │
│                 CampaignAttestation                             │
│                                                                  │
│  CSRInitiative ──→ InitiativeProposal                           │
│                 ──→ ApprovalWorkflow                            │
│                 ──→ Milestone                                   │
│                 ──→ Evidence                                    │
│                 ──→ StakeholderAssignment                       │
│                 ──→ KPITracking                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ owner_id, stakeholder_id
             │
┌────────────▼────────────────────────────────────────────────────┐
│            STAKEHOLDER MANAGEMENT                                │
├─────────────────────────────────────────────────────────────────┤
│  Stakeholder ──→ StakeholderProfile                             │
│                 ├─→ EngagementHistory                           │
│                 ├─→ RelationshipManagement                      │
│                 ├─→ CommunicationLog                            │
│                 └─→ Segment                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Entity Definitions

### 3.1 Identity & Access Management

#### 3.1.1 USER Table

```sql
CREATE TABLE User (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(20),
  employeeId VARCHAR(50), -- From DEWA AD
  departmentId VARCHAR(36) FOREIGN KEY REFERENCES Department(id),
  managerId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  userType ENUM('internal', 'external') NOT NULL,
  status ENUM('active', 'inactive', 'suspended', 'terminated') NOT NULL DEFAULT 'active',
  adSyncTimestamp DATETIME, -- Last sync with Active Directory
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_employeeId (employeeId),
  INDEX idx_departmentId (departmentId),
  INDEX idx_status (status),
  INDEX idx_userType (userType)
);
```

#### 3.1.2 PROFILE Table

```sql
CREATE TABLE UserProfile (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL UNIQUE FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  bio TEXT,
  photoUrl VARCHAR(500),
  photoApprovalStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  preferredLanguage ENUM('ar', 'en') DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
  enableEmailNotifications BOOLEAN DEFAULT TRUE,
  enableSmsNotifications BOOLEAN DEFAULT FALSE,
  enablePushNotifications BOOLEAN DEFAULT TRUE,
  isProfileComplete BOOLEAN DEFAULT FALSE,
  lastProfileUpdateAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_userId (userId)
);
```

#### 3.1.3 ROLE Table

```sql
CREATE TABLE Role (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  isSystemRole BOOLEAN DEFAULT FALSE, -- Cannot be deleted
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
);

-- Example roles:
-- admin, super_admin
-- event_owner, event_coordinator
-- employee, contractor
-- external_user
-- executive, manager
```

#### 3.1.4 USER_ROLE Table (Many-to-Many)

```sql
CREATE TABLE UserRole (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  roleId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Role(id) ON DELETE CASCADE,
  assignedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assignedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  expiresAt DATETIME, -- Temporary role assignments
  
  UNIQUE KEY unique_user_role (userId, roleId),
  INDEX idx_userId (userId),
  INDEX idx_roleId (roleId),
  INDEX idx_expiresAt (expiresAt)
);
```

#### 3.1.5 PERMISSION Table

```sql
CREATE TABLE Permission (
  id VARCHAR(36) PRIMARY KEY,
  resource VARCHAR(100) NOT NULL, -- 'event', 'user', 'csr_campaign', etc.
  action VARCHAR(50) NOT NULL,     -- 'create', 'read', 'update', 'delete', 'approve'
  scope VARCHAR(100) NOT NULL,     -- 'own', 'own_division', 'all_divisions', 'all'
  description TEXT,
  isSystemPermission BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_permission (resource, action, scope),
  INDEX idx_resource (resource)
);
```

#### 3.1.6 ROLE_PERMISSION Table (Many-to-Many)

```sql
CREATE TABLE RolePermission (
  id VARCHAR(36) PRIMARY KEY,
  roleId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Role(id) ON DELETE CASCADE,
  permissionId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Permission(id) ON DELETE CASCADE,
  grantedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grantedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  UNIQUE KEY unique_role_permission (roleId, permissionId),
  INDEX idx_roleId (roleId),
  INDEX idx_permissionId (permissionId)
);
```

#### 3.1.7 SESSION_TOKEN Table

```sql
CREATE TABLE SessionToken (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  refreshTokenHash VARCHAR(255) NOT NULL,
  accessTokenHash VARCHAR(255) NOT NULL,
  issuedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accessTokenExpiresAt DATETIME NOT NULL,
  refreshTokenExpiresAt DATETIME NOT NULL,
  revokedAt DATETIME, -- NULL if active
  ipAddress VARCHAR(45),
  userAgent TEXT,
  
  INDEX idx_userId (userId),
  INDEX idx_revokedAt (revokedAt),
  INDEX idx_accessTokenExpiresAt (accessTokenExpiresAt),
  INDEX idx_refreshTokenExpiresAt (refreshTokenExpiresAt)
);
```

#### 3.1.8 DEPARTMENT Table

```sql
CREATE TABLE Department (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) UNIQUE,
  parentDepartmentId VARCHAR(36) FOREIGN KEY REFERENCES Department(id),
  description TEXT,
  headId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_code (code),
  INDEX idx_parentDepartmentId (parentDepartmentId),
  INDEX idx_headId (headId)
);
```

---

### 3.2 Event Management

#### 3.2.1 EVENT Table

```sql
CREATE TABLE Event (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  eventType ENUM('internal', 'external', 'hybrid', 'virtual') NOT NULL,
  status ENUM('draft', 'proposal', 'approved', 'active', 'completed', 'cancelled', 'archived') NOT NULL DEFAULT 'draft',
  ownerId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  departmentId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Department(id),
  
  -- Event timing
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  registrationStartDate DATETIME NOT NULL,
  registrationEndDate DATETIME NOT NULL,
  isVirtual BOOLEAN DEFAULT FALSE,
  virtualEventUrl VARCHAR(500),
  
  -- Capacity
  expectedParticipants INT,
  minParticipants INT,
  maxParticipants INT,
  actualParticipants INT,
  
  -- Audit & Lifecycle
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  closedAt DATETIME,
  closedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  -- Statistics
  registrationCount INT DEFAULT 0,
  checkInCount INT DEFAULT 0,
  noShowCount INT DEFAULT 0,
  feedbackCount INT DEFAULT 0,
  averageSatisfactionScore DECIMAL(3,2),
  
  INDEX idx_status (status),
  INDEX idx_eventType (eventType),
  INDEX idx_ownerId (ownerId),
  INDEX idx_departmentId (departmentId),
  INDEX idx_startDate (startDate),
  INDEX idx_registrationEndDate (registrationEndDate),
  INDEX idx_createdAt (createdAt),
  FULLTEXT INDEX ft_name_description (name, description)
);
```

#### 3.2.2 EVENT_PROPOSAL Table

```sql
CREATE TABLE EventProposal (
  id VARCHAR(36) PRIMARY KEY,
  eventId VARCHAR(36) FOREIGN KEY REFERENCES Event(id) ON DELETE CASCADE,
  proposerId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  status ENUM('submitted', 'approved', 'rejected', 'resubmitted') NOT NULL DEFAULT 'submitted',
  
  -- Proposal details
  objectives TEXT NOT NULL,
  targetAudience VARCHAR(500),
  budgetRequested DECIMAL(12,2),
  estimatedParticipants INT,
  
  -- Approval workflow
  submittedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approvalStartedAt DATETIME,
  approvalCompletedAt DATETIME,
  
  -- Rejection details
  rejectionReason TEXT,
  rejectionComments TEXT,
  rejectedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  rejectedAt DATETIME,
  
  INDEX idx_status (status),
  INDEX idx_eventId (eventId),
  INDEX idx_proposerId (proposerId),
  INDEX idx_submittedAt (submittedAt)
);
```

#### 3.2.3 REGISTRATION Table

```sql
CREATE TABLE Registration (
  id VARCHAR(36) PRIMARY KEY,
  eventId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Event(id) ON DELETE CASCADE,
  userId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  
  -- Registration details
  registrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('submitted', 'approved', 'rejected', 'cancelled', 'no_show', 'attended') NOT NULL DEFAULT 'submitted',
  registrationSource ENUM('web', 'mobile', 'bulk_import', 'manual') DEFAULT 'web',
  
  -- Attendee info
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20),
  department VARCHAR(100),
  companyName VARCHAR(255),
  
  -- Special needs
  hasAccessibilityNeeds BOOLEAN DEFAULT FALSE,
  accessibilityNotes TEXT,
  dietaryRestriction VARCHAR(255),
  guestCount INT DEFAULT 0,
  guestNames TEXT,
  
  -- Approval
  approvalStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approvedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  approvalDate DATETIME,
  
  -- Check-in
  checkInTime DATETIME,
  checkInMethod ENUM('qr_scan', 'manual_lookup', 'late_registration') DEFAULT 'qr_scan',
  
  -- Audit
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_registration (eventId, userId),
  INDEX idx_eventId (eventId),
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_registrationDate (registrationDate),
  INDEX idx_checkInTime (checkInTime),
  FULLTEXT INDEX ft_name_email (firstName, lastName, email)
);
```

#### 3.2.4 REGISTRATION_RESPONSE Table (Custom Form Data)

```sql
CREATE TABLE RegistrationResponse (
  id VARCHAR(36) PRIMARY KEY,
  registrationId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Registration(id) ON DELETE CASCADE,
  fieldName VARCHAR(255) NOT NULL,
  fieldValue LONGTEXT,
  fieldType VARCHAR(50), -- text, checkbox, radio, select, textarea, etc.
  
  INDEX idx_registrationId (registrationId),
  INDEX idx_fieldName (fieldName)
);
```

#### 3.2.5 ATTENDANCE Table

```sql
CREATE TABLE Attendance (
  id VARCHAR(36) PRIMARY KEY,
  eventId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Event(id) ON DELETE CASCADE,
  registrationId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Registration(id) ON DELETE CASCADE,
  userId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  checkInTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  checkOutTime DATETIME,
  duration INT, -- minutes attended
  status ENUM('checked_in', 'checked_out', 'no_show') DEFAULT 'checked_in',
  checkInLocation VARCHAR(255),
  checkInMethod ENUM('qr_scan', 'manual_lookup') DEFAULT 'qr_scan',
  
  INDEX idx_eventId (eventId),
  INDEX idx_registrationId (registrationId),
  INDEX idx_userId (userId),
  INDEX idx_checkInTime (checkInTime)
);
```

#### 3.2.6 FEEDBACK Table

```sql
CREATE TABLE Feedback (
  id VARCHAR(36) PRIMARY KEY,
  eventId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Event(id) ON DELETE CASCADE,
  registrationId VARCHAR(36) FOREIGN KEY REFERENCES Registration(id) ON DELETE SET NULL,
  userId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  feedbackDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  overallSatisfaction INT, -- 1-5
  contentQuality INT, -- 1-5
  venueRating INT, -- 1-5
  organizationRating INT, -- 1-5
  
  -- Free-form feedback
  comments LONGTEXT,
  suggestions TEXT,
  wouldAttendAgain BOOLEAN,
  recommendToOthers BOOLEAN,
  
  -- Sentiment analysis
  sentimentScore DECIMAL(3,2), -- -1 to 1
  extractedTopics VARCHAR(500), -- Comma-separated
  
  -- Admin
  submittedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isModerated BOOLEAN DEFAULT FALSE,
  moderatedAt DATETIME,
  moderatedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  moderationNotes TEXT,
  
  INDEX idx_eventId (eventId),
  INDEX idx_registrationId (registrationId),
  INDEX idx_userId (userId),
  INDEX idx_feedbackDate (feedbackDate),
  INDEX idx_overallSatisfaction (overallSatisfaction),
  FULLTEXT INDEX ft_comments (comments)
);
```

#### 3.2.7 EVENT_BUDGET Table

```sql
CREATE TABLE EventBudget (
  id VARCHAR(36) PRIMARY KEY,
  eventId VARCHAR(36) NOT NULL UNIQUE FOREIGN KEY REFERENCES Event(id) ON DELETE CASCADE,
  
  -- Budget summary
  totalBudget DECIMAL(12,2) NOT NULL,
  approvedBudget DECIMAL(12,2),
  budgetStatus ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  
  -- Approval
  submittedAt DATETIME,
  submittedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  approvedAt DATETIME,
  approvedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  rejectionReason TEXT,
  
  -- Totals
  totalActualExpenses DECIMAL(12,2) DEFAULT 0,
  variance DECIMAL(12,2), -- approved - actual
  variancePercentage DECIMAL(5,2),
  
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_eventId (eventId),
  INDEX idx_budgetStatus (budgetStatus)
);
```

#### 3.2.8 BUDGET_LINE_ITEM Table

```sql
CREATE TABLE BudgetLineItem (
  id VARCHAR(36) PRIMARY KEY,
  budgetId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES EventBudget(id) ON DELETE CASCADE,
  
  category ENUM('venue', 'catering', 'av', 'materials', 'staffing', 'contingency', 'other') NOT NULL,
  description VARCHAR(500),
  budgetedAmount DECIMAL(12,2) NOT NULL,
  actualAmount DECIMAL(12,2) DEFAULT 0,
  variance DECIMAL(12,2),
  
  INDEX idx_budgetId (budgetId),
  INDEX idx_category (category)
);
```

#### 3.2.9 EXPENSE Table

```sql
CREATE TABLE Expense (
  id VARCHAR(36) PRIMARY KEY,
  budgetId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES EventBudget(id) ON DELETE CASCADE,
  
  vendorName VARCHAR(255) NOT NULL,
  category ENUM('venue', 'catering', 'av', 'materials', 'staffing', 'contingency', 'other') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  invoiceNumber VARCHAR(100),
  invoiceDate DATE,
  invoiceDocumentUrl VARCHAR(500),
  paymentStatus ENUM('pending', 'approved', 'paid', 'cancelled') DEFAULT 'pending',
  
  -- Approval
  submittedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submittedBy VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  approvedAt DATETIME,
  approvedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  paidAt DATETIME,
  paidBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  INDEX idx_budgetId (budgetId),
  INDEX idx_paymentStatus (paymentStatus),
  INDEX idx_submittedAt (submittedAt)
);
```

---

### 3.3 CSR Management

#### 3.3.1 CSR_CAMPAIGN Table

```sql
CREATE TABLE CSRCampaign (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  objectives TEXT,
  
  -- Timeline
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  contentReleaseDate DATE,
  attestationDeadline DATE,
  
  -- Target audience
  targetAudience VARCHAR(500), -- JSON array or comma-separated
  targetCount INT,
  
  -- Status
  status ENUM('draft', 'scheduled', 'active', 'completed', 'archived') DEFAULT 'draft',
  
  -- Admin
  createdBy VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Metrics
  distributeCount INT DEFAULT 0,
  openCount INT DEFAULT 0,
  clickCount INT DEFAULT 0,
  completionCount INT DEFAULT 0,
  
  INDEX idx_status (status),
  INDEX idx_startDate (startDate),
  INDEX idx_endDate (endDate)
);
```

#### 3.3.2 CAMPAIGN_ENGAGEMENT Table

```sql
CREATE TABLE CampaignEngagement (
  id VARCHAR(36) PRIMARY KEY,
  campaignId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES CSRCampaign(id) ON DELETE CASCADE,
  userId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  
  -- Engagement tracking
  viewedAt DATETIME,
  viewDuration INT, -- seconds
  firstClickAt DATETIME,
  resourcesAccessedCount INT DEFAULT 0,
  
  -- Completion
  completedAt DATETIME,
  completionStatus ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  
  UNIQUE KEY unique_engagement (campaignId, userId),
  INDEX idx_campaignId (campaignId),
  INDEX idx_userId (userId),
  INDEX idx_completionStatus (completionStatus)
);
```

#### 3.3.3 CAMPAIGN_ATTESTATION Table

```sql
CREATE TABLE CampaignAttestation (
  id VARCHAR(36) PRIMARY KEY,
  campaignId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES CSRCampaign(id) ON DELETE CASCADE,
  userId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id) ON DELETE CASCADE,
  
  -- Attestation
  attestationText TEXT NOT NULL,
  attestationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attestationStatus ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  
  -- Verification
  verifiedAt DATETIME,
  verifiedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  UNIQUE KEY unique_attestation (campaignId, userId),
  INDEX idx_campaignId (campaignId),
  INDEX idx_userId (userId),
  INDEX idx_attestationStatus (attestationStatus)
);
```

#### 3.3.4 CSR_INITIATIVE Table

```sql
CREATE TABLE CSRInitiative (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  objectives TEXT NOT NULL,
  
  -- Expected outcomes
  expectedBeneficiaries INT,
  expectedOutcomeDescription TEXT,
  
  -- Budget
  totalBudget DECIMAL(12,2),
  
  -- Timeline
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  
  -- Status
  status ENUM('draft', 'proposal', 'approved', 'active', 'completed', 'archived') NOT NULL DEFAULT 'draft',
  
  -- Leadership
  sponsorId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  leadDepartmentId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Department(id),
  
  -- Audit
  createdBy VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_leadDepartmentId (leadDepartmentId),
  INDEX idx_startDate (startDate),
  FULLTEXT INDEX ft_name_objectives (name, objectives)
);
```

#### 3.3.5 INITIATIVE_MILESTONE Table

```sql
CREATE TABLE InitiativeMilestone (
  id VARCHAR(36) PRIMARY KEY,
  initiativeId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES CSRInitiative(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  targetDate DATE NOT NULL,
  status ENUM('pending', 'in_progress', 'completed', 'delayed', 'cancelled') DEFAULT 'pending',
  
  -- Completion
  completedAt DATE,
  completionNotes TEXT,
  
  -- Audit
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_initiativeId (initiativeId),
  INDEX idx_status (status),
  INDEX idx_targetDate (targetDate)
);
```

#### 3.3.6 INITIATIVE_EVIDENCE Table

```sql
CREATE TABLE InitiativeEvidence (
  id VARCHAR(36) PRIMARY KEY,
  initiativeId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES CSRInitiative(id) ON DELETE CASCADE,
  
  evidenceType ENUM('document', 'photo', 'video', 'report', 'attendance_record', 'other') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fileUrl VARCHAR(500) NOT NULL,
  fileName VARCHAR(255),
  fileSize INT, -- bytes
  mimeType VARCHAR(100),
  
  -- Submission
  submittedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submittedBy VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  
  -- Validation
  validationStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  validatedAt DATETIME,
  validatedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  validationNotes TEXT,
  
  INDEX idx_initiativeId (initiativeId),
  INDEX idx_validationStatus (validationStatus)
);
```

#### 3.3.7 INITIATIVE_KPI Table

```sql
CREATE TABLE InitiativeKPI (
  id VARCHAR(36) PRIMARY KEY,
  initiativeId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES CSRInitiative(id) ON DELETE CASCADE,
  
  kpiName VARCHAR(255) NOT NULL,
  description TEXT,
  expectedValue DECIMAL(15,2),
  actualValue DECIMAL(15,2),
  unit VARCHAR(50), -- 'count', 'hours', 'percentage', etc.
  
  -- Status
  status ENUM('on_track', 'at_risk', 'completed', 'exceeded') DEFAULT 'on_track',
  
  -- Audit
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_initiativeId (initiativeId),
  INDEX idx_status (status)
);
```

---

### 3.4 Approval Workflow

#### 3.4.1 APPROVAL_WORKFLOW Table

```sql
CREATE TABLE ApprovalWorkflow (
  id VARCHAR(36) PRIMARY KEY,
  entityType VARCHAR(100) NOT NULL, -- 'event_proposal', 'budget', 'initiative_proposal'
  entityId VARCHAR(36) NOT NULL,
  
  workflowType VARCHAR(100) NOT NULL, -- 'sequential', 'parallel'
  status ENUM('pending', 'in_progress', 'approved', 'rejected', 'escalated') DEFAULT 'pending',
  
  -- Timeline
  startedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME,
  
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_entityType (entityType),
  INDEX idx_entityId (entityId),
  INDEX idx_status (status),
  UNIQUE KEY unique_workflow (entityType, entityId)
);
```

#### 3.4.2 APPROVAL_STEP Table

```sql
CREATE TABLE ApprovalStep (
  id VARCHAR(36) PRIMARY KEY,
  workflowId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES ApprovalWorkflow(id) ON DELETE CASCADE,
  
  stepNumber INT NOT NULL,
  stepName VARCHAR(255),
  approverUserId VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES User(id),
  
  -- Status
  stepStatus ENUM('pending', 'approved', 'rejected', 'delegated', 'escalated') DEFAULT 'pending',
  
  -- Timeline
  assignedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewedAt DATETIME,
  deadline DATETIME,
  
  -- Decision
  decision TEXT, -- approval/rejection comments
  
  INDEX idx_workflowId (workflowId),
  INDEX idx_approverUserId (approverUserId),
  INDEX idx_stepStatus (stepStatus)
);
```

---

### 3.5 System & Audit

#### 3.5.1 AUDIT_LOG Table

```sql
CREATE TABLE AuditLog (
  id VARCHAR(36) PRIMARY KEY,
  
  -- User & context
  userId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  userName VARCHAR(255),
  
  -- Action
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'approve', 'publish'
  entityType VARCHAR(100) NOT NULL, -- 'event', 'user', 'registration', etc.
  entityId VARCHAR(36),
  
  -- Details
  description TEXT,
  oldValue LONGTEXT, -- JSON of old values
  newValue LONGTEXT, -- JSON of new values
  
  -- Context
  ipAddress VARCHAR(45),
  userAgent TEXT,
  requestId VARCHAR(255),
  
  -- Timestamp
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_userId (userId),
  INDEX idx_entityType (entityType),
  INDEX idx_entityId (entityId),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp),
  INDEX idx_requestId (requestId)
);
```

#### 3.5.2 NOTIFICATION_LOG Table

```sql
CREATE TABLE NotificationLog (
  id VARCHAR(36) PRIMARY KEY,
  
  -- Notification
  notificationType VARCHAR(100) NOT NULL, -- 'event_registration', 'approval_request'
  channel VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'in_app'
  recipient VARCHAR(255) NOT NULL,
  
  -- Content
  subject VARCHAR(255),
  body LONGTEXT,
  templateId VARCHAR(36),
  
  -- Delivery
  sentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deliveryStatus ENUM('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked') DEFAULT 'pending',
  deliveredAt DATETIME,
  
  -- Error handling
  failureReason VARCHAR(500),
  retryCount INT DEFAULT 0,
  
  -- Context
  userId VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  entityType VARCHAR(100),
  entityId VARCHAR(36),
  
  INDEX idx_channel (channel),
  INDEX idx_deliveryStatus (deliveryStatus),
  INDEX idx_userId (userId),
  INDEX idx_sentAt (sentAt),
  INDEX idx_entityType (entityType)
);
```

#### 3.5.3 SYSTEM_CONFIG Table

```sql
CREATE TABLE SystemConfig (
  id VARCHAR(36) PRIMARY KEY,
  
  configKey VARCHAR(255) NOT NULL UNIQUE,
  configValue LONGTEXT,
  valueType VARCHAR(50), -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  
  -- Versioning
  version INT,
  isActive BOOLEAN DEFAULT TRUE,
  
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updatedBy VARCHAR(36) FOREIGN KEY REFERENCES User(id),
  
  INDEX idx_configKey (configKey),
  INDEX idx_isActive (isActive)
);
```

---

## 4. Data Integrity & Constraints

### 4.1 Foreign Key Relationships

All tables with references to other tables use FOREIGN KEY constraints with appropriate ON DELETE and ON UPDATE rules:

- **ON DELETE CASCADE** - Used when child records are meaningless without parent
  - Example: Registration → Event (delete event → delete registrations)
  
- **ON DELETE SET NULL** - Used when child records can exist independently
  - Example: Feedback → Registration (delete registration → set feedback.registrationId to NULL)
  
- **ON DELETE RESTRICT** - Used when deletion is not allowed
  - Example: Event → Department (cannot delete department with active events)

### 4.2 Data Validation Constraints

- **NOT NULL constraints** on all required fields
- **UNIQUE constraints** on natural keys (email, employeeId)
- **CHECK constraints** on enum fields
- **Length constraints** on string fields
- **Numeric range constraints** on numeric fields

### 4.3 Business Rule Constraints

Implemented at database and application levels:

```sql
-- Example: Cannot register after registration deadline
-- Enforced in application with check:
-- SELECT registrationEndDate FROM Event WHERE id = ?
-- ASSERT NOW() <= registrationEndDate

-- Example: Event capacity cannot exceed venue maximum
-- Enforced in application with venue capacity lookup

-- Example: User can have only one active session per device
-- Enforced in application with unique constraint on active tokens
```

---

## 5. Indexing Strategy

### 5.1 Performance Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| Event | (status, startDate) | Composite | List active events by date |
| Registration | (eventId, status) | Composite | Get registrations by event and status |
| Registration | (userId, eventId) | Composite | Prevent duplicate registration |
| Feedback | (eventId, overallSatisfaction) | Composite | Event analytics by satisfaction |
| CSRCampaign | (status, endDate) | Composite | Active campaigns |
| User | (email, status) | Composite | User lookup during authentication |
| AuditLog | (entityType, entityId, timestamp) | Composite | Audit trail queries |

### 5.2 Search Indexes

Full-text indexes on commonly searched fields:
- Event: name, description
- Registration: firstName, lastName, email
- CSRInitiative: name, objectives
- Feedback: comments

### 5.3 Partitioning Strategy (Future)

For large tables (AuditLog, NotificationLog), implement partitioning by date:
```sql
PARTITION BY RANGE (YEAR(timestamp)) (
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

---

## 6. Data Governance

### 6.1 Data Classification

| Classification | Examples | Retention | Encryption |
|---|---|---|---|
| **Public** | Event announcements, public feedback summaries | No limit | Optional |
| **Internal** | Employee lists, department info | As needed | Recommended |
| **Confidential** | Budgets, salaries, performance data | 3 years | Required |
| **Restricted** | Personal data (PII), health info | Per law | AES-256 at rest |

### 6.2 Data Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Event data | 3 years | Historical analysis, compliance |
| User personal data | Until account deletion + 30 days | GDPR/local compliance |
| Audit logs | 7 years | Legal/compliance requirements |
| Financial records | 7 years | Tax/audit requirements |
| Session tokens | 7 days | Security, session management |
| Backup archives | 30 days rolling | Disaster recovery |

### 6.3 Data Access Controls

- **Role-based access** - Users access only data for their role and division
- **Field-level encryption** - PII encrypted in database
- **Query audit logging** - All database queries logged and monitored
- **Anonymization** - Personal data removed for analytics/non-critical uses

### 6.4 Data Quality Rules

| Rule | Validation | Consequence |
|------|-----------|-------------|
| Email uniqueness | No duplicate emails per user type | Application prevents duplicate |
| Phone format | Valid international format | Validation during profile creation |
| Date consistency | startDate < endDate | Application-level validation |
| Capacity logic | maxParticipants ≥ minParticipants | Database constraint |
| Budget reconciliation | Sum of expenses ≤ approved budget | Application-level warnings |

---

## 7. Data Migration & Initialization

### 7.1 Initial Data Loading

```
Phase 1: Infrastructure
├─ Create database schema from migration scripts
├─ Verify all constraints and indexes
└─ Initialize system configuration

Phase 2: Reference Data
├─ Load departments (from DEWA organizational structure)
├─ Load roles and permissions (predefined)
├─ Load system configuration
└─ Verify referential integrity

Phase 3: User Data
├─ Initial sync from DEWA Active Directory
├─ Create user accounts for all active employees
├─ Assign default roles based on AD groups
└─ Verify user count and department distribution

Phase 4: Historical Data (Optional)
├─ Migrate legacy event data (if available)
├─ Map old event IDs to new schema
├─ Validate data completeness
└─ Archive old system

Phase 5: Testing
├─ Run data quality validation queries
├─ Verify referential integrity
├─ Test application against real data volume
└─ Validate performance with target data size
```

### 7.2 Database Migration Framework

Using flyway or liquibase for version control:

```
migrations/
├── V001__initial_schema.sql
├── V002__add_audit_tables.sql
├── V003__add_indexes.sql
├── V004__reference_data_load.sql
├── V005__add_constraints.sql
└── V006__performance_tuning.sql

Each migration:
- Versioned with timestamp
- Idempotent (safe to re-run)
- Includes rollback procedure
- Validated before merge
- Applied in order
```

---

## 8. Performance Optimization

### 8.1 Query Optimization Guidelines

1. **Use Indexes Effectively**
   - Always filter on indexed columns
   - Avoid functions on indexed columns (prevents index usage)
   - Use composite indexes for common WHERE+ORDER BY patterns

2. **Avoid N+1 Queries**
   ```sql
   -- BAD: N+1 query problem
   SELECT * FROM events;
   FOR EACH event:
     SELECT registrations FROM registrations WHERE eventId = event.id;
   
   -- GOOD: Join or batch query
   SELECT e.*, COUNT(r.id) as registrationCount
   FROM events e
   LEFT JOIN registrations r ON e.id = r.eventId
   GROUP BY e.id;
   ```

3. **Pagination for Large Result Sets**
   ```sql
   SELECT * FROM events
   WHERE status = 'active'
   ORDER BY startDate DESC
   LIMIT 20 OFFSET 0;  -- Page 1
   ```

4. **Use Prepared Statements**
   - Prevents SQL injection
   - Improves query plan caching

### 8.2 Connection Pool Optimization

- **Pool size:** 5-20 connections per server
- **Max wait time:** 10 seconds
- **Idle timeout:** 5 minutes
- **Connection validation:** Ping every 30 seconds

### 8.3 Caching Layer (Redis)

- Cache frequently accessed data (users, roles, permissions)
- TTL: 1 hour for stable data, 5 minutes for changing data
- Invalidate on updates
- Monitor cache hit rates (target: >80%)

---

## 9. Backup & Disaster Recovery

### 9.1 Backup Strategy

**Daily Full Backups:**
- Time: 2 AM (off-peak)
- Duration: <2 hours
- Destination: Local NAS + remote cloud storage
- Retention: 30-day rolling window

**Hourly Incremental Backups:**
- Based on binary transaction log
- Local storage only
- Retention: 7 days

**Point-in-Time Recovery:**
- Binary log archiving enabled
- Retention: 14 days
- Allows recovery to any point within 14 days

### 9.2 Recovery Procedures

**Scenario: Database corruption (1 table affected)**
- Restore from most recent backup
- Apply incremental backups to reach RTO
- Verify data integrity
- Return to normal operations
- Estimated time: 30-60 minutes

**Scenario: Entire database loss (e.g., hardware failure)**
- Restore from remote backup to new hardware
- Apply incremental backups and transaction logs
- Point-in-time recovery to last known good state
- Verify all data and indexes
- Notify users of any potential data loss
- Estimated time: 2-4 hours

### 9.3 Testing & Validation

- Monthly backup restoration test
- Quarterly disaster recovery drill
- Annual comprehensive recovery testing
- Document recovery procedures and update as needed

---

## 10. Data Security

### 10.1 Encryption Strategy

**At Rest (on disk):**
- Database: Transparent Data Encryption (TDE) for sensitive tables
- Backups: AES-256 encryption
- File storage: AES-256 for sensitive documents

**In Transit (over network):**
- Database connections: TLS 1.2+ (if remote database)
- Replication: Encrypted replication connections
- Backups: Encrypted transfers to remote storage

**Field-Level Encryption:**
- User email addresses
- Phone numbers
- Personal ID numbers
- Salary/budget information

### 10.2 Access Control

**Database Users:**
- Application user (limited permissions - SELECT, INSERT, UPDATE on specific tables)
- Backup user (SELECT only, for backup operations)
- Admin user (full access, only for DBAs)
- Analytics user (SELECT only on non-sensitive data)

**Network Access:**
- Database accessible only from application servers
- No direct access from end-user machines
- VPN required for DBA access
- Connection logging and monitoring enabled

### 10.3 Audit & Compliance

- All data modifications logged to AuditLog table
- User actions traceable back to individual
- Compliance reports generated monthly
- Data access requests (GDPR) tracked and audited

---

## 11. Summary

The Data Architecture provides:

1. **Comprehensive database schema** covering all functional requirements
2. **Data integrity** through constraints, relationships, and validation rules
3. **High performance** through strategic indexing and caching
4. **Security** through encryption, access controls, and audit logging
5. **Governance** through retention policies and data classification
6. **Disaster recovery** through comprehensive backup and restore procedures
7. **Compliance** with GDPR, ISR v2, ISO 27001, and UAE data protection laws

All data entities are designed following enterprise database design patterns, enabling the platform to scale to 10,000+ users with high performance and security.

---

*End of Data Architecture Document*
