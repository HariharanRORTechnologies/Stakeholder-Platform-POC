# Stakeholder Engagement Platform - Modules Guide

## Document Information
- **Document Title:** Complete Module Guide & Inventory
- **Version:** 1.0
- **Date:** July 2026
- **Classification:** Enterprise Documentation
- **Audience:** Technical Leadership, Development Teams, Architects

---

## Table of Contents

[Core Modules](#core-modules) | [Communication & Engagement](#communication--engagement-modules) | [Management & Operations](#management--operations-modules) | [Analytics & Intelligence](#analytics--intelligence-modules) | [User & Access Control](#user--access-control-modules) | [Advanced Features](#advanced-features-modules) | [Module Dependencies](#module-dependencies)

---

## Overview

The Stakeholder Engagement Platform consists of **31 interconnected modules** organized into 6 strategic categories. This guide provides detailed specifications for each module including purpose, features, entities, workflows, and dependencies.

---

## Core Modules

### 1. Authentication Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 0-4)

#### Purpose
Secure user authentication and session management for all platform users (internal employees, external users, administrators).

#### Key Features
- Employee login via DEWA Active Directory (LDAP)
- External user registration and password-based login
- Multi-Factor Authentication (MFA) for privileged users
- JWT token-based session management
- Refresh token rotation
- Session timeout and logout
- Password reset and change workflows
- Account lockout after failed attempts

#### Key Entities
```
- User (identity)
- SessionToken (JWT, refresh tokens)
- MFAConfiguration (TOTP, SMS)
- LoginAttempt (audit trail)
- PasswordHistory (compliance)
```

#### Main Workflows
1. **Employee Login:** LDAP authentication → User lookup/create → Token issuance
2. **External Login:** Credential validation → Token issuance
3. **MFA Challenge:** Token validation → OTP verification → Session establishment
4. **Token Refresh:** Refresh token validation → New access token → Old token invalidation

#### API Endpoints
```
POST   /api/v1/auth/login              # Employee login
POST   /api/v1/auth/register           # External user registration
POST   /api/v1/auth/logout             # Logout
POST   /api/v1/auth/refresh            # Refresh token
POST   /api/v1/auth/mfa/setup          # MFA configuration
POST   /api/v1/auth/mfa/verify         # MFA verification
POST   /api/v1/auth/password/reset     # Password reset request
POST   /api/v1/auth/password/confirm   # Password reset completion
POST   /api/v1/auth/password/change    # Password change
```

#### Database Tables
- `User`, `SessionToken`, `MFAConfiguration`, `LoginAttempt`, `PasswordHistory`, `RefreshTokenRevocation`

#### Dependencies
- Active Directory (LDAP for employee auth)
- Email service (password reset notifications)

---

### 2. User Management Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 0-4)

#### Purpose
Manage user identities, profiles, and organizational relationships across internal and external users.

#### Key Features
- AD synchronization (daily automated sync)
- User registration (internal via AD, external via self-service)
- User profile management
- Department and hierarchy management
- Membership tracking (employee, partner, volunteer, committee)
- Volunteer management (skills, availability, hours tracking)
- Guest/visitor management
- User deactivation and retention

#### Key Entities
```
- User (identity)
- UserProfile (preferences, contact info)
- Department (organizational hierarchy)
- Membership (formal relationships)
- Volunteer (skills, availability, hours)
- Guest (visitor/attendee)
```

#### Main Workflows
1. **AD Sync:** Daily job → Query AD → Compare with DB → Create/update/deactivate users
2. **External Registration:** Self-register → Email verification → Admin approval → Account activation
3. **Profile Update:** User edit → Validation → Database update → Audit log
4. **Volunteer Assignment:** Volunteer search → Skill matching → Assignment → Confirmation

#### API Endpoints
```
GET    /api/v1/users                   # List users
GET    /api/v1/users/:id               # Get user details
PUT    /api/v1/users/:id               # Update user
DELETE /api/v1/users/:id               # Deactivate user
GET    /api/v1/me                      # Get current user
PUT    /api/v1/me/profile              # Update profile
POST   /api/v1/users/register          # External user registration
POST   /api/v1/volunteers              # Register volunteer
GET    /api/v1/volunteers              # List volunteers
```

#### Database Tables
- `User`, `UserProfile`, `Department`, `Membership`, `Volunteer`, `Guest`, `ADSyncLog`

#### Dependencies
- Active Directory (user sync)
- Email service (verification emails)

---

### 3. Role Management Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 0-4)

#### Purpose
Define and manage user roles, permissions, and access control across the platform.

#### Key Features
- Predefined roles (Admin, Super Admin, Event Owner, Employee, External User, Executive, Volunteer)
- Custom role creation
- Permission matrix (Resource × Action × Scope)
- Role assignment (individual or bulk)
- Temporary role assignments (with expiry)
- AD group mapping to roles
- Scope-based permissions (own, own_division, all_divisions)
- Permission inheritance

#### Key Entities
```
- Role (role definition)
- Permission (resource × action × scope)
- RolePermission (many-to-many mapping)
- UserRole (user × role assignment)
- PermissionLog (audit trail)
```

#### Main Workflows
1. **Role Assignment:** Admin → Select user → Select role → Set expiry (if temporary) → Confirm
2. **AD Group Sync:** Daily job → Query AD groups → Map to roles → Update user roles
3. **Permission Check:** API call → Extract user roles → Lookup permissions → Allow/Deny

#### API Endpoints
```
GET    /api/v1/admin/roles             # List roles
POST   /api/v1/admin/roles             # Create role
GET    /api/v1/admin/roles/:id         # Get role details
PUT    /api/v1/admin/roles/:id         # Update role
GET    /api/v1/admin/permissions       # List permissions
POST   /api/v1/admin/users/:id/roles   # Assign role
DELETE /api/v1/admin/users/:id/roles/:roleId  # Remove role
```

#### Database Tables
- `Role`, `Permission`, `RolePermission`, `UserRole`, `PermissionLog`

#### Dependencies
- Active Directory (group mappings)

---

### 4. Permissions Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 0-4)

#### Purpose
Fine-grained access control with support for object-level and attribute-level permissions.

#### Key Features
- Resource-based permissions (Event, User, CSRCampaign, Report, etc.)
- Action-based permissions (create, read, update, delete, approve, export)
- Scope-based access (own, own_division, all_divisions)
- Attribute-based access control (ABAC) optional
- Permission inheritance from roles
- Permission audit logging
- Dynamic permission evaluation

#### Key Entities
```
- Permission (resource × action × scope)
- PermissionEvaluation (audit of permission checks)
- AttributePolicy (ABAC rules, future)
```

#### Main Workflows
1. **Permission Evaluation:** API endpoint → Extract user context → Check permissions → Return 200 or 403
2. **Permission Update:** Admin modifies role → Permissions updated → Audit logged → New permissions apply immediately

#### API Endpoints
```
GET    /api/v1/permissions             # List all permissions
GET    /api/v1/permissions/check       # Check permission for user
GET    /api/v1/users/:id/permissions   # Get user's permissions
```

#### Database Tables
- `Permission`, `RolePermission`, `PermissionEvaluation`

#### Dependencies
- Role Management (permission assignment via roles)

---

## Communication & Engagement Modules

### 5. Events Module

**Priority:** MUST (P0)  
**Phase:** Phase 1-2 (Months 2-6)

#### Purpose
Complete event lifecycle management from planning through feedback and closure.

#### Key Features
- Event creation and configuration
- Event proposal and approval workflow
- Multi-level approval chain (based on budget, type)
- Event scheduling and calendar management
- Venue management (DEWA facilities and external)
- Capacity planning and management
- Budget tracking and allocation
- Team assignment (coordinators, volunteers, speakers)
- Event timeline management
- Event status tracking (draft, proposal, approved, active, completed, cancelled, archived)
- Event cloning (duplicate past events)
- Bulk event operations

#### Key Entities
```
- Event (master event data)
- EventProposal (approval workflow)
- EventConfiguration (settings)
- EventBudget (budget tracking)
- BudgetLineItem (budget breakdown)
- Expense (cost tracking)
- EventTeam (coordinators, volunteers)
- Venue (location management)
- EventDocument (materials, plans)
```

#### Main Workflows
1. **Event Creation:** Propose → Route to approvers → Approve/Reject → Configure → Publish
2. **Event Execution:** Check-in → Real-time monitoring → Issue management → Closure
3. **Event Analytics:** Collect metrics → Calculate KPIs → Generate reports

#### API Endpoints
```
POST   /api/v1/events                  # Create event proposal
GET    /api/v1/events                  # List events
GET    /api/v1/events/:id              # Get event details
PUT    /api/v1/events/:id              # Update event
DELETE /api/v1/events/:id              # Cancel event
POST   /api/v1/events/:id/publish      # Publish event
GET    /api/v1/events/:id/analytics    # Get event analytics
GET    /api/v1/events/:id/registrations  # Get registrations
```

#### Database Tables
- `Event`, `EventProposal`, `EventConfiguration`, `EventBudget`, `BudgetLineItem`, `Expense`, `EventTeam`, `Venue`, `EventDocument`, `EventMetric`

#### Dependencies
- Authentication (user context)
- User Management (team assignment)
- Approvals Module (approval workflow)
- Budget Module (budget tracking)
- Notifications Module (event notifications)

---

### 6. Event Categories Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Classify and organize events into categories for easier discovery and filtering.

#### Key Features
- Predefined event categories (internal, external, hybrid, virtual, workshop, seminar, social, sports, etc.)
- Custom category creation
- Category descriptions and rules
- Category-specific settings (default capacity, budget range, etc.)
- Category-based filtering and discovery
- Category analytics and reporting
- Multi-category assignment (events can belong to multiple categories)

#### Key Entities
```
- EventCategory (category definition)
- EventCategoryMapping (event × category)
```

#### Main Workflows
1. **Category Assignment:** Event creation → Select one or more categories → Categories applied
2. **Category Filtering:** User browse → Select category → View filtered events

#### API Endpoints
```
GET    /api/v1/event-categories        # List categories
POST   /api/v1/event-categories        # Create category
GET    /api/v1/events?category=:id     # Filter by category
```

#### Database Tables
- `EventCategory`, `EventCategoryMapping`

#### Dependencies
- Events Module

---

### 7. Event Registration Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 2-4)

#### Purpose
Manage event registrations, invitations, and attendee information collection.

#### Key Features
- Self-service event registration (no admin required)
- Dynamic registration forms (custom fields per event)
- Duplicate registration prevention
- Waitlist management (when capacity exceeded)
- Registration approval workflow (optional)
- Registration cancellation
- Bulk registration (admin upload CSV)
- Registration data export
- Registration status tracking (submitted, approved, checked-in, no-show, attended, cancelled)
- Special needs collection (dietary, accessibility)
- Guest count and guest names
- Email confirmation and reminders

#### Key Entities
```
- Registration (attendee registration)
- RegistrationResponse (custom form responses)
- Waitlist (capacity management)
- RegistrationHistory (audit trail)
```

#### Main Workflows
1. **Registration:** User clicks Register → Fill form → Validate → Check capacity → Create record → Send confirmation
2. **Approval:** Submissions marked pending → Admin approves/rejects → Notifications sent
3. **Cancellation:** User cancels → Registration marked cancelled → Waitlist processing → Refund if applicable

#### API Endpoints
```
POST   /api/v1/events/:id/registrations  # Register for event
GET    /api/v1/events/:id/registrations  # List registrations
GET    /api/v1/registrations/:id         # Get registration details
PUT    /api/v1/registrations/:id         # Update registration
DELETE /api/v1/registrations/:id         # Cancel registration
GET    /api/v1/me/registrations          # Get my registrations
```

#### Database Tables
- `Registration`, `RegistrationResponse`, `Waitlist`, `RegistrationHistory`

#### Dependencies
- Events Module
- Notifications Module
- Email Service

---

### 8. Invitations Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Targeted invitation campaigns to drive event attendance.

#### Key Features
- Audience segmentation (department, role, previous attendees, custom lists)
- Email invitation templates
- Scheduled invitations
- Invitation tracking (sent, delivered, opened, clicked)
- Reminder sequences
- Suppression lists (opt-out, bounces, no-show)
- Personalization (recipient name, event details)
- VIP invitations with RSVP
- Invitation analytics

#### Key Entities
```
- Invitation (invitation record)
- InvitationTracking (delivery and engagement)
- InvitationTemplate (email template)
```

#### Main Workflows
1. **Invitation Campaign:** Define audience → Create template → Preview → Schedule → Send
2. **Tracking:** Monitor delivery → Track opens → Track clicks → Generate report

#### API Endpoints
```
POST   /api/v1/events/:id/invitations  # Send invitation campaign
GET    /api/v1/events/:id/invitations  # Get invitation details
GET    /api/v1/invitations/tracking    # Get invitation tracking data
```

#### Database Tables
- `Invitation`, `InvitationTracking`, `InvitationTemplate`

#### Dependencies
- Events Module
- User Management
- Email Service

---

### 9. Attendance Module

**Priority:** MUST (P0)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Track actual event attendance and verify participation.

#### Key Features
- QR code check-in (scan to check in)
- Manual check-in (search by name/email)
- Late registration at event
- No-show tracking
- Check-in time recording
- Check-in location tracking (if multi-venue)
- Real-time attendance dashboard
- Attendance verification (cross-reference with registrations)
- Attendance report generation
- Mobile check-in app

#### Key Entities
```
- Attendance (check-in record)
- CheckInRecord (detailed tracking)
```

#### Main Workflows
1. **Check-In:** QR scan → Lookup registration → Confirm identity → Record check-in → Display confirmation
2. **Verification:** Post-event → Reconcile check-ins with registrations → Generate attendance report
3. **No-Show Processing:** Event end time passed → Mark unconfirmed attendees as no-show

#### API Endpoints
```
POST   /api/v1/events/:id/check-in     # Check in attendee (QR scan)
GET    /api/v1/events/:id/attendance   # Get attendance list
GET    /api/v1/check-in                # Check-in app interface
```

#### Database Tables
- `Attendance`, `CheckInRecord`, `AttendanceMetric`

#### Dependencies
- Events Module
- Event Registration

---

### 10. Feedback Module

**Priority:** MUST (P0)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Collect and manage event feedback and general stakeholder feedback.

#### Key Features
- Post-event feedback surveys (automated)
- General feedback form (not event-specific)
- Feedback types (feedback, complaint, suggestion, appreciation)
- Rating scales (1-5 stars, NPS, satisfaction)
- Free-text feedback
- Sentiment analysis (basic: positive/neutral/negative)
- Feedback response workflow
- Feedback dashboard
- Feedback analytics and trends
- Response SLA tracking (complaints within 5 days)
- Email notifications to management

#### Key Entities
```
- Feedback (feedback record)
- FeedbackResponse (custom survey responses)
- FeedbackAnalysis (sentiment, topics)
- FeedbackSurvey (survey definition)
```

#### Main Workflows
1. **Feedback Collection:** Event ends → Send survey → User responds → Responses stored
2. **Feedback Management:** Manager reviews feedback → Responds → Marks resolved
3. **Analysis:** Aggregate feedback → Calculate metrics → Identify trends → Report

#### API Endpoints
```
POST   /api/v1/events/:id/feedback     # Submit event feedback
POST   /api/v1/feedback                # Submit general feedback
GET    /api/v1/feedback                # Get feedback list
GET    /api/v1/events/:id/feedback     # Get event feedback
GET    /api/v1/feedback/:id            # Get feedback details
PUT    /api/v1/feedback/:id/response   # Respond to feedback
```

#### Database Tables
- `Feedback`, `FeedbackResponse`, `FeedbackAnalysis`, `FeedbackSurvey`

#### Dependencies
- Events Module
- Notifications Module

---

### 11. Surveys Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Create and manage custom surveys for feedback collection beyond events.

#### Key Features
- Survey builder (drag-drop interface)
- Question types (text, rating, checkbox, radio, matrix, ranking)
- Conditional branching (show questions based on answers)
- Survey preview
- Distribution (email, link, embedded)
- Response collection
- Survey analytics
- Export responses (Excel, CSV)
- Comparison across multiple surveys
- Score calculation and weighting

#### Key Entities
```
- Survey (survey definition)
- SurveyQuestion (question definition)
- SurveyResponse (respondent response)
- SurveyAnalysis (metrics and analysis)
```

#### Main Workflows
1. **Survey Creation:** Define questions → Set branching → Preview → Publish
2. **Distribution:** Send survey link → Track responses → Close survey
3. **Analysis:** Calculate scores → Identify trends → Generate report

#### API Endpoints
```
POST   /api/v1/surveys                 # Create survey
GET    /api/v1/surveys                 # List surveys
GET    /api/v1/surveys/:id             # Get survey details
POST   /api/v1/surveys/:id/responses   # Submit survey response
GET    /api/v1/surveys/:id/analytics   # Get survey analytics
```

#### Database Tables
- `Survey`, `SurveyQuestion`, `SurveyResponse`, `SurveyAnalysis`

#### Dependencies
- None (standalone)

---

### 12. Volunteer Management Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Recruit, assign, and track volunteers across events and initiatives.

#### Key Features
- Volunteer registration and profile
- Skills and availability management
- Volunteer matching (event-based on skills)
- Assignment tracking
- Time logging (volunteer hours)
- Volunteer evaluation and feedback
- Recognition and awards
- Volunteer statistics and reporting
- Volunteer communications
- Retention and re-engagement

#### Key Entities
```
- Volunteer (volunteer profile)
- VolunteerSkill (skills and proficiency)
- VolunteerAssignment (event assignment)
- VolunteerTimeLog (hours tracking)
- VolunteerRecognition (awards, badges)
```

#### Main Workflows
1. **Registration:** Self-register as volunteer → Provide skills → Set availability
2. **Assignment:** Event owner → Search volunteers → Match by skill → Assign → Confirmation
3. **Time Tracking:** Volunteer logs hours → Approves → Event owner verifies → Recorded
4. **Recognition:** Accumulate hours/assignments → Award recognition → Issue certificate

#### API Endpoints
```
POST   /api/v1/volunteers              # Register volunteer
GET    /api/v1/volunteers              # List volunteers
PUT    /api/v1/volunteers/:id          # Update volunteer profile
POST   /api/v1/volunteers/:id/assignments  # Assign to event
POST   /api/v1/volunteers/:id/time-log # Log volunteer hours
GET    /api/v1/volunteers/:id/statistics   # Get volunteer stats
```

#### Database Tables
- `Volunteer`, `VolunteerSkill`, `VolunteerAssignment`, `VolunteerTimeLog`, `VolunteerRecognition`

#### Dependencies
- User Management
- Events Module
- Notifications Module

---

### 13. Certificates Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Generate and manage digital certificates for event attendance and achievement.

#### Key Features
- Certificate template design
- Dynamic certificate generation (personalized with names, dates)
- Certificate issuance triggers (event attendance, volunteer hours, achievement)
- PDF generation and download
- Digital certificate storage
- Certificate verification and authentication
- Recipient list management
- Batch certificate generation
- Certificate sharing (email, social media, download)

#### Key Entities
```
- CertificateTemplate (template definition)
- CertificateIssued (issued certificate)
```

#### Main Workflows
1. **Template Creation:** Design template → Add dynamic fields → Preview → Save
2. **Generation:** Trigger event → Pull recipient data → Generate certificates → Send emails
3. **Distribution:** Recipient receives email → Download PDF or view online

#### API Endpoints
```
POST   /api/v1/certificates/templates  # Create template
POST   /api/v1/certificates/generate   # Generate certificates
GET    /api/v1/certificates/:id        # Get certificate
GET    /api/v1/me/certificates         # My certificates
```

#### Database Tables
- `CertificateTemplate`, `CertificateIssued`

#### Dependencies
- Events Module
- PDF generation library

---

### 14. Sports Committee Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Manage internal and external sports events and competitions.

#### Key Features
- Internal sports event management
- External partner event integration
- Tournament bracket generation
- Team roster management
- Score tracking and results
- Leaderboard generation
- Award and recognition
- Sports statistics tracking
- Multi-organization competitions
- Sports event analytics

#### Key Entities
```
- SportsEvent (event definition)
- Team (roster and team info)
- Match (individual match)
- Score (match results)
- Leaderboard (standings)
- SportsAward (recognition)
- ExternalPartner (partner organization)
```

#### Main Workflows
1. **Event Creation:** Define sport/format → Create teams/register participants → Schedule matches
2. **Tournament Execution:** Enter scores → Update leaderboards → Track standings
3. **Closure:** Determine winners → Issue awards → Generate report

#### API Endpoints
```
POST   /api/v1/sports/events           # Create sports event
GET    /api/v1/sports/events           # List sports events
POST   /api/v1/sports/events/:id/teams # Create team
POST   /api/v1/sports/events/:id/scores # Enter score
GET    /api/v1/sports/events/:id/leaderboard  # Get standings
```

#### Database Tables
- `SportsEvent`, `Team`, `Match`, `Score`, `Leaderboard`, `SportsAward`, `ExternalPartner`

#### Dependencies
- Events Module (extends event system)
- User Management

---

### 15. Dashboard Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 5-7)

#### Purpose
Provide role-based dashboards with real-time metrics and KPIs.

#### Key Features
- Executive dashboard (system-wide KPIs)
- Manager dashboard (department metrics)
- Event owner dashboard (event-specific analytics)
- User dashboard (personal registrations, achievements)
- Real-time metric updates
- Interactive charts and visualizations
- Drill-down analytics
- Custom widgets
- Dashboard layout customization
- Export dashboard view
- Dashboard sharing

#### Key Entities
```
- Dashboard (dashboard configuration)
- DashboardWidget (widget definition)
- DashboardMetric (cached metrics)
```

#### Main Workflows
1. **Dashboard Loading:** User access dashboard → Load configuration → Fetch metrics → Display
2. **Metric Update:** Scheduled job → Calculate metrics → Store in cache → Refresh dashboards

#### API Endpoints
```
GET    /api/v1/dashboard               # Get user's dashboard
GET    /api/v1/dashboards/executive    # Get executive dashboard
GET    /api/v1/dashboards/metrics/:id  # Get specific metric
POST   /api/v1/dashboards/customize    # Customize dashboard
```

#### Database Tables
- `Dashboard`, `DashboardWidget`, `DashboardMetric`

#### Dependencies
- Analytics Module
- User Management

---

## Management & Operations Modules

### 16. CSR Module

**Priority:** MUST (P0)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Manage Corporate Social Responsibility initiatives, campaigns, and attestations.

#### Key Features
- CSR initiative planning and management
- CSR campaign management
- Campaign content distribution
- Attestation collection (compliance)
- Evidence collection (documentation)
- KPI tracking and measurement
- Multi-stakeholder approvals
- Initiative lifecycle management
- CSR reporting and metrics
- Beneficiary tracking
- Impact measurement

#### Key Entities
```
- CSRInitiative (initiative definition)
- CSRCampaign (campaign definition)
- CampaignContent (campaign materials)
- CampaignAttestation (compliance attestation)
- InitiativeMilestone (milestones)
- InitiativeEvidence (documentation)
- InitiativeKPI (outcome measurement)
```

#### Main Workflows
1. **Initiative Planning:** Propose → Route to approval → Approve → Plan milestones → Execute
2. **Campaign Launch:** Create content → Schedule distribution → Collect attestations → Report
3. **Evidence Collection:** Submit evidence → Validate → Approve → Archive

#### API Endpoints
```
POST   /api/v1/csr/initiatives         # Create initiative
GET    /api/v1/csr/initiatives         # List initiatives
POST   /api/v1/csr/campaigns           # Create campaign
GET    /api/v1/csr/campaigns           # List campaigns
POST   /api/v1/csr/campaigns/:id/attest # Submit attestation
POST   /api/v1/csr/initiatives/:id/evidence # Submit evidence
```

#### Database Tables
- `CSRInitiative`, `CSRCampaign`, `CampaignContent`, `CampaignAttestation`, `InitiativeMilestone`, `InitiativeEvidence`, `InitiativeKPI`

#### Dependencies
- Approvals Module
- Notifications Module
- User Management

---

### 17. Campaigns Module

**Priority:** MUST (P0)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Manage awareness and engagement campaigns across the organization.

#### Key Features
- Campaign creation and configuration
- Target audience segmentation
- Campaign scheduling
- Content management (HTML, images, videos)
- Multi-channel distribution (email, SMS, push, in-app)
- Campaign tracking (delivery, opens, clicks)
- Engagement metrics
- Campaign analytics
- Audience preferences management
- Suppression list management
- Campaign templates

#### Key Entities
```
- Campaign (campaign definition)
- CampaignContent (materials)
- CampaignDistribution (delivery tracking)
- CampaignEngagement (user interaction)
- CampaignTemplate (reusable templates)
```

#### Main Workflows
1. **Creation:** Design campaign → Add content → Select audience → Preview → Schedule
2. **Distribution:** Send via channels → Track delivery → Monitor engagement
3. **Analysis:** Collect metrics → Calculate KPIs → Report results

#### API Endpoints
```
POST   /api/v1/campaigns               # Create campaign
GET    /api/v1/campaigns               # List campaigns
GET    /api/v1/campaigns/:id           # Get campaign details
POST   /api/v1/campaigns/:id/send      # Send campaign
GET    /api/v1/campaigns/:id/tracking  # Get tracking data
```

#### Database Tables
- `Campaign`, `CampaignContent`, `CampaignDistribution`, `CampaignEngagement`, `CampaignTemplate`

#### Dependencies
- Notifications Module
- User Management
- Email/SMS services

---

### 18. Approvals Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 2-4)

#### Purpose
Manage multi-level approval workflows for events, budgets, initiatives, and other controlled processes.

#### Key Features
- Approval workflow templates
- Sequential and parallel approvals
- Dynamic approver assignment (based on attributes)
- Approval routing rules
- Approval notifications
- Approval comments/feedback
- Rejection handling (with resubmission)
- Escalation (auto-escalate if not approved in time)
- Approval history and audit trail
- Bulk approvals
- Approval dashboard

#### Key Entities
```
- ApprovalWorkflow (workflow template)
- ApprovalRequest (request for approval)
- ApprovalStep (individual approval step)
- ApprovalHistory (audit trail)
```

#### Main Workflows
1. **Submission:** Submit request → Route to approvers → Notify approvers
2. **Approval:** Approver reviews → Approves/Rejects → Notifies originator
3. **Escalation:** Monitor deadline → Auto-escalate if needed

#### API Endpoints
```
POST   /api/v1/approvals/submit        # Submit for approval
GET    /api/v1/approvals/pending       # Get pending approvals
POST   /api/v1/approvals/:id/approve   # Approve request
POST   /api/v1/approvals/:id/reject    # Reject request
```

#### Database Tables
- `ApprovalWorkflow`, `ApprovalRequest`, `ApprovalStep`, `ApprovalHistory`

#### Dependencies
- Role Management
- Notifications Module

---

### 19. Budget Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Track event and initiative budgets, expenses, and financial management.

#### Key Features
- Budget creation and allocation
- Budget approval workflow
- Expense tracking and submission
- Expense approval and payment
- Budget vs. actual reporting
- Variance analysis
- Budget reallocation
- Cost center management
- Payment tracking
- Vendor management
- Budget forecasting
- Financial reports

#### Key Entities
```
- Budget (budget definition)
- BudgetLineItem (line items by category)
- Expense (expense record)
- BudgetVariance (variance tracking)
- VendorPayment (payment records)
```

#### Main Workflows
1. **Budget Setup:** Define budget → Allocate to categories → Get approval
2. **Expense Submission:** Submit expense with receipt → Approvers review → Payment processed
3. **Reporting:** Track actuals vs. budget → Report variance → Analyze trends

#### API Endpoints
```
POST   /api/v1/budgets                 # Create budget
GET    /api/v1/budgets                 # List budgets
POST   /api/v1/budgets/:id/expenses    # Submit expense
GET    /api/v1/budgets/:id/analysis    # Get budget analysis
GET    /api/v1/budgets/:id/reporting   # Get budget report
```

#### Database Tables
- `Budget`, `BudgetLineItem`, `Expense`, `BudgetVariance`, `VendorPayment`

#### Dependencies
- Events Module
- CSR Module
- Approvals Module

---

### 20. Vendor Management Module

**Priority:** COULD (P2)  
**Phase:** Phase 3 (Future)

#### Purpose
Manage vendor relationships and vendor events.

#### Key Features
- Vendor registration and profiles
- Vendor categorization
- Vendor contact management
- Vendor event coordination
- Vendor performance tracking
- Vendor communication
- Vendor ratings and feedback
- Vendor historical data
- Vendor analytics

#### Key Entities
```
- Vendor (vendor profile)
- VendorCategory (vendor type)
- VendorContact (contact information)
- VendorEvent (event by vendor)
- VendorRating (performance rating)
```

#### Dependencies
- User Management
- Events Module

---

### 21. Calendar Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Provide calendar view of events and manage scheduling conflicts.

#### Key Features
- Event calendar (month, week, day view)
- Event filtering (by type, department, category)
- Conflict detection (venue double-booking)
- Calendar sharing
- Personal calendar (my registrations)
- Calendar integration (Google Calendar, Outlook)
- Calendar export (iCal format)
- Agenda view
- Timeline view

#### Key Entities
```
- CalendarEntry (calendar entry reference)
- CalendarConflict (detected conflicts)
```

#### Workflows
1. **Calendar Display:** User access calendar → Load events → Filter → Display
2. **Integration:** Export to calendar app → Sync external calendar

#### API Endpoints
```
GET    /api/v1/calendar                # Get calendar view
GET    /api/v1/calendar/conflicts      # Detect conflicts
POST   /api/v1/calendar/export         # Export calendar
```

#### Dependencies
- Events Module

---

### 22. Notifications Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 2-4)

#### Purpose
Send multi-channel notifications to users (email, SMS, push, in-app).

#### Key Features
- Email notifications (transactional, marketing)
- SMS notifications (critical alerts, reminders)
- Push notifications (web and mobile)
- In-app notifications (notification center)
- Notification templates
- Trigger-based notifications (event-driven)
- Scheduled notifications
- User preference management (channel preferences, do-not-disturb)
- Notification tracking (sent, delivered, opened)
- Bounce handling
- Retry logic (for failed deliveries)

#### Key Entities
```
- NotificationTemplate (template definition)
- NotificationTrigger (trigger rules)
- NotificationLog (delivery tracking)
- UserNotificationPreference (user preferences)
```

#### Main Workflows
1. **Trigger:** Event occurs (user registered) → Notification rule fires → Create notification
2. **Rendering:** Load template → Render with user data → Format for channel
3. **Delivery:** Send via channels → Track delivery → Log result
4. **Retry:** Failed delivery → Queue for retry → Retry with backoff

#### API Endpoints
```
POST   /api/v1/notifications/send      # Send notification
GET    /api/v1/notifications           # Get notifications (inbox)
PUT    /api/v1/notifications/:id/read  # Mark as read
PUT    /api/v1/me/notification-preferences # Update preferences
```

#### Database Tables
- `NotificationTemplate`, `NotificationTrigger`, `NotificationLog`, `UserNotificationPreference`

#### Dependencies
- Email Service (SMTP)
- SMS Service (SMS Gateway)
- Push Service (Firebase, etc.)

---

### 23. Settings Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 5-7)

#### Purpose
Manage system-wide and user-level settings and configurations.

#### Key Features
- System settings (admin configurations)
- User settings (preferences, language, timezone)
- Email template configuration
- Notification preferences
- Privacy settings
- Communication preferences
- Display preferences (theme, layout)
- API key management
- Integration configurations
- Feature toggles (enable/disable features)

#### Key Entities
```
- SystemConfig (system-level settings)
- UserSettings (user preferences)
- FeatureToggle (feature flags)
```

#### Main Workflows
1. **System Config:** Admin updates settings → Reload configuration → Apply system-wide
2. **User Settings:** User updates preferences → Save to database → Apply to user experience

#### API Endpoints
```
GET    /api/v1/admin/settings          # Get system settings
PUT    /api/v1/admin/settings          # Update system settings
GET    /api/v1/me/settings             # Get my settings
PUT    /api/v1/me/settings             # Update my settings
```

#### Database Tables
- `SystemConfig`, `UserSettings`, `FeatureToggle`

#### Dependencies
- User Management

---

### 24. Masters Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 1-2 (Months 2-6)

#### Purpose
Manage master/reference data used throughout the platform.

#### Key Features
- Event types (internal, external, hybrid, virtual)
- Event categories
- Venue master list
- Department list
- Cost centers
- Volunteer skills (predefined list)
- Award types
- CSR initiative categories
- Report categories
- Notification types
- Custom master data

#### Key Entities
```
- Master data tables (depends on type)
```

#### Workflows
1. **Management:** Admin views master list → Add/edit/delete → Changes apply system-wide
2. **Usage:** Dropdown selection in forms → Uses master data → Controlled vocabulary

#### API Endpoints
```
GET    /api/v1/masters/:type           # Get master data by type
POST   /api/v1/admin/masters/:type     # Create master record
PUT    /api/v1/admin/masters/:type/:id # Update master record
DELETE /api/v1/admin/masters/:type/:id # Delete master record
```

#### Database Tables
- `EventType`, `EventCategory`, `Venue`, `Department`, `CostCenter`, `VolunteerSkill`, `AwardType`, etc.

#### Dependencies
- None (standalone)

---

### 25. Media Library Module

**Priority:** SHOULD (P1)  
**Phase:** Phase 2 (Months 4-6)

#### Purpose
Manage digital assets (images, videos, documents) used in events and campaigns.

#### Key Features
- File upload and storage
- File organization (folders, tags)
- File metadata (title, description, author, date)
- File preview
- File versioning
- Sharing and permissions
- Usage tracking (where file is used)
- Bulk upload
- File search
- File deletion and archival
- Encryption for sensitive files

#### Key Entities
```
- MediaFile (file record)
- MediaFolder (organization)
- MediaTag (categorization)
- MediaUsage (tracking where used)
```

#### Main Workflows
1. **Upload:** Select files → Upload → Auto-thumbnail → Store metadata
2. **Organization:** Create folders → Tag files → Organize by campaign/event
3. **Usage:** Select from library → Use in event/campaign → Track usage

#### API Endpoints
```
POST   /api/v1/media/upload            # Upload file
GET    /api/v1/media                   # List files
GET    /api/v1/media/:id               # Get file details
DELETE /api/v1/media/:id               # Delete file
POST   /api/v1/media/:id/usage         # Track usage
```

#### Database Tables
- `MediaFile`, `MediaFolder`, `MediaTag`, `MediaUsage`

#### Dependencies
- File Storage (local or cloud)

---

## Analytics & Intelligence Modules

### 26. Analytics Module

**Priority:** MUST (P0)  
**Phase:** Phase 2-3 (Months 6-8)

#### Purpose
Comprehensive analytics on platform usage, engagement, and performance.

#### Key Features
- Real-time dashboard metrics
- User engagement tracking
- Event performance analytics
- Campaign effectiveness measurement
- ROI calculations
- Trend analysis
- Predictive analytics (basic)
- Data aggregation and warehousing
- Metric calculation and caching
- Performance monitoring
- System health analytics

#### Key Entities
```
- EventMetric (event-level metrics)
- UserMetric (user engagement)
- CampaignMetric (campaign performance)
- SystemMetric (system health)
```

#### Main Workflows
1. **Metric Calculation:** Scheduled job → Query data → Calculate metrics → Cache
2. **Dashboard Loading:** Load cached metrics → Display in dashboard

#### API Endpoints
```
GET    /api/v1/analytics/events        # Event analytics
GET    /api/v1/analytics/users         # User analytics
GET    /api/v1/analytics/campaigns     # Campaign analytics
GET    /api/v1/analytics/system        # System health
```

#### Database Tables
- `EventMetric`, `UserMetric`, `CampaignMetric`, `SystemMetric`

#### Dependencies
- Dashboard Module

---

### 27. Reports Module

**Priority:** MUST (P0)  
**Phase:** Phase 2 (Months 6-8)

#### Purpose
Generate custom reports and schedule automated report distribution.

#### Key Features
- Report builder (query builder interface)
- Predefined report templates
- Custom report creation
- Data export (CSV, Excel, PDF)
- Report scheduling (daily, weekly, monthly)
- Report distribution (email delivery)
- Report archive
- Report sharing
- Report templates library
- Advanced filtering and sorting
- Charts and visualizations

#### Key Entities
```
- Report (report definition)
- ReportTemplate (reusable template)
- ReportSchedule (scheduled delivery)
- ReportExecution (execution history)
```

#### Main Workflows
1. **Report Creation:** Select data source → Configure columns → Add filters → Save
2. **Scheduling:** Save report → Schedule delivery → Recipients receive email
3. **Execution:** Scheduled time → Run query → Generate report → Send email

#### API Endpoints
```
POST   /api/v1/reports                 # Create report
GET    /api/v1/reports                 # List reports
GET    /api/v1/reports/:id/execute     # Execute report
POST   /api/v1/reports/:id/schedule    # Schedule report
GET    /api/v1/reports/templates       # Get templates
```

#### Database Tables
- `Report`, `ReportTemplate`, `ReportSchedule`, `ReportExecution`

#### Dependencies
- Analytics Module

---

### 28. Audit Logs Module

**Priority:** MUST (P0)  
**Phase:** Phase 1 (Months 5-7)

#### Purpose
Maintain immutable audit trail of all system activities for compliance and security.

#### Key Features
- User action logging (create, read, update, delete)
- Access logging (who accessed what, when)
- Data change logging (before/after values)
- Approval logging
- Login/logout logging
- Error logging
- Audit search and filtering
- Audit report generation
- Immutable storage (no deletion)
- Retention policies (7-year minimum)
- Timestamp accuracy (UTC)

#### Key Entities
```
- AuditLog (audit record)
- AccessLog (access tracking)
- DataChangeLog (data modifications)
```

#### Main Workflows
1. **Logging:** Every action → Create audit log entry → Store in database
2. **Querying:** Search audit logs → Filter by user/date/action → Generate report

#### API Endpoints
```
GET    /api/v1/audit-logs              # Query audit logs
GET    /api/v1/audit-logs/:id          # Get audit entry
POST   /api/v1/audit-logs/search       # Search audit logs
GET    /api/v1/audit-logs/report       # Generate audit report
```

#### Database Tables
- `AuditLog`, `AccessLog`, `DataChangeLog`

#### Dependencies
- User Management

---

## Advanced Features Modules

### 29. AI Module

**Priority:** COULD (P2)  
**Phase:** Phase 3+ (Future, 12+ months)

#### Purpose
AI-powered features including chatbot, recommendations, and anomaly detection.

#### Key Features (Future)
- Intelligent chatbot (event questions, support)
- Recommendation engine (event recommendations)
- Anomaly detection (suspicious activities)
- Natural language processing (sentiment analysis from feedback)
- Predictive analytics (attendance prediction)
- Smart scheduling (conflict avoidance)

#### Dependencies
- Analytics Module
- Feedback Module (for sentiment analysis)

---

### 30. Chat Module

**Priority:** COULD (P2)  
**Phase:** Phase 3+ (Future)

#### Purpose
Real-time messaging for event coordinators and team collaboration.

#### Key Features (Future)
- Direct messaging (user-to-user)
- Group chat (event team collaboration)
- Channel-based messaging
- Message search and history
- File sharing in chat
- Message notifications
- Presence indicators
- Typing indicators
- Message reactions/emojis

#### Key Entities (Future)
```
- Chat (conversation)
- ChatMessage (message record)
- ChatChannel (group channel)
```

#### Dependencies
- User Management
- WebSocket support

---

### 31. Discussion Forum Module

**Priority:** COULD (P2)  
**Phase:** Phase 3+ (Future)

#### Purpose
Community discussion platform for event participants and stakeholders.

#### Key Features (Future)
- Discussion threads/topics
- Post and reply functionality
- Voting (upvote/downvote posts)
- User reputation system
- Moderation and content removal
- Search functionality
- Categorized forums
- Pinned/sticky posts
- User permissions (who can post)

#### Key Entities (Future)
```
- Forum (forum definition)
- Thread (discussion thread)
- Post (individual post)
- Vote (user vote)
- Moderation (moderation actions)
```

#### Dependencies
- User Management

---

### 32. Knowledge Base Module

**Priority:** COULD (P2)  
**Phase:** Phase 3+ (Future)

#### Purpose
Centralized repository of documentation, FAQs, and help content.

#### Key Features (Future)
- Article/document management
- Search functionality
- Category organization
- Related articles suggestions
- Article versioning
- Comments/feedback on articles
- Contributor management
- Access control (public/internal)
- Article popularity tracking
- Content expiration (archive old content)

#### Key Entities (Future)
```
- KnowledgeArticle (article content)
- KnowledgeCategory (organization)
- KnowledgeTag (tagging)
- KnowledgeComment (feedback)
```

#### Dependencies
- User Management

---

## Module Dependencies

### Dependency Map

```
┌─────────────────────────────────────────────────────┐
│         CORE DEPENDENCIES (Foundation)              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Authentication Module ← (All modules depend)       │
│         ↓                                           │
│  User Management Module ← (Role, Event, etc.)      │
│         ↓                                           │
│  Role Management + Permissions ← (Access control)  │
│                                                      │
└─────────────────────────────────────────────────────┘
                          ↑
            ┌─────────────┼─────────────┐
            │             │             │
    ┌───────▼──┐  ┌───────▼──┐  ┌──────▼────┐
    │Events    │  │CSR       │  │Dashboard  │
    │Module    │  │Module    │  │Module     │
    └─────┬────┘  └───┬──────┘  └──────┬────┘
          │           │               │
    ┌─────┴────┬──────┴──┬──────┐    │
    │           │         │      │    │
┌───▼──┐  ┌────▼─┐  ┌───▼──┐ ┌─▼────▼─┐
│Events│  │CSR   │  │Appro-│ │Analytics│
│Reg   │  │Campa-│  │vals  │ │Module   │
│Module│  │igns  │  │Module│ └────┬────┘
└───┬──┘  └──┬───┘  └──┬───┘     │
    │        │         │         │
    └────┬───┴────┬────┘         │
         │        │              │
    ┌────▼─┐  ┌──▼────┐  ┌──────▼──┐
    │Feedback│ │Notif. │  │Reports  │
    │Module  │ │Module │  │Module   │
    └────────┘ └──┬────┘  └─────────┘
                  │
          ┌───────┴────────┐
          │                │
      (Email, SMS, Push Services)
```

### Critical Dependencies Summary

| Module | Depends On | Notes |
|--------|-----------|-------|
| **All** | Authentication | Gatekeeper for all access |
| **Events** | User Mgmt, Approvals, Notifications | Event proposal → approval → execution |
| **Event Registration** | Events, Notifications | Self-service registration |
| **Attendance** | Events, Registration | Track who actually attended |
| **CSR** | Approvals, Notifications | Initiative → approval → execution |
| **Campaigns** | Notifications, User Mgmt | Distribute campaigns, track completion |
| **Approvals** | User Mgmt, Role Mgmt | Route to appropriate approvers |
| **Dashboard** | Analytics | Display calculated metrics |
| **Reports** | Analytics | Query and export data |
| **Notifications** | All | Multi-channel delivery |
| **Audit Logs** | All | Log all activities |

---

## Implementation Phases

### Phase 1 (Months 1-4): Foundation
- Authentication
- User Management
- Role & Permission Management
- Events Module (basic)
- Approvals
- Notifications (basic)
- Audit Logs

### Phase 2 (Months 4-8): Core Features
- Event Registration & Invitations
- Attendance
- Feedback & Surveys
- CSR Platform
- Campaigns
- Dashboard
- Analytics
- Reports
- Volunteer Management
- Certificates
- Calendar
- Media Library
- Sports Committee
- Budget

### Phase 3+ (Future): Advanced
- AI Module
- Chat
- Discussion Forum
- Knowledge Base
- Advanced integrations

---

*End of Modules Guide Document*
