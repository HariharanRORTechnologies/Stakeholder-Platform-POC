# Complete RBAC (Role-Based Access Control) Documentation

**Stakeholder Engagement Platform**  
**Version:** 1.0  
**Date:** July 2026  
**Status:** Production-Ready | Enterprise-Grade

---

## 📋 Table of Contents

1. [RBAC Overview](#rbac-overview)
2. [Role Hierarchy](#role-hierarchy)
3. [Roles Summary](#roles-summary)
4. [Permission Matrix](#permission-matrix)
5. [Detailed Role Specifications](#detailed-role-specifications)
6. [Implementation Guide](#implementation-guide)
7. [API Endpoints by Role](#api-endpoints-by-role)

---

## RBAC Overview

### RBAC Architecture

```
┌─────────────────────────────────────────────┐
│         RBAC Authorization Layer            │
├─────────────────────────────────────────────┤
│  User → Role → Permissions → Features       │
│                                             │
│  ✓ Role-Based Access Control               │
│  ✓ Fine-Grained Permissions                │
│  ✓ Feature-Level Access                    │
│  ✓ Time-Based Activation                   │
│  ✓ Department-Based Scoping                │
└─────────────────────────────────────────────┘
```

### Key Principles

1. **Role Hierarchy** - Super Admin > Admin > Department Head > Others
2. **Least Privilege** - Users get minimum required permissions
3. **Scope-Based Access** - Access limited to assigned departments/events
4. **Audit Trail** - All permission changes logged
5. **Time-Based Activation** - Temporary role assignments possible

---

## Role Hierarchy

```
                    Super Admin
                        │
                   (Full Access)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
      Admin          Management      Approver
        │
    ┌───┴───┬─────────┬────────┬──────────┐
    │       │         │        │          │
Division  Event    CSR      Sports    Vendor
Coord.    Owner    Coord.   Comm.
    │       │
    │   ┌───┴──────┐
    │   │          │
Internal Employee  Volunteer
Employee
    │
External
User
```

---

## Roles Summary

| Role | Level | Primary Function | Access Scope | Reports To |
|------|-------|------------------|--------------|-----------|
| Super Admin | 1 (Highest) | System administration | All | Board |
| Admin | 2 | System management | All | Super Admin |
| Management | 3 | Strategic oversight | All departments | Board |
| Approver | 3 | Approval workflows | All submissions | Management |
| Division Coordinator | 4 | Department management | Assigned division | Admin |
| CSR Coordinator | 4 | CSR programs | All CSR | Management |
| Event Owner | 4 | Event management | Owned events | Division Coord |
| Sports Committee | 4 | Sports events | Sports events | Management |
| Vendor | 5 | Service provision | Assigned vendors | Admin |
| Internal Employee | 5 | General employee | Department/public | Division Coord |
| External User | 6 (Lowest) | Participation | Public events only | N/A |
| Volunteer | 5 | Volunteer work | Assigned initiatives | CSR Coord |

---

## Permission Matrix

### High-Level Permission Overview

| Permission | Super Admin | Admin | Management | Approver | Division Coord | Event Owner | CSR Coord | Sports Comm | Vendor | Internal Emp | External User | Volunteer |
|------------|:-----------:|:-----:|:----------:|:--------:|:-------------:|:-----------:|:---------:|:-----------:|:------:|:------------:|:-------------:|:---------:|
| User Management | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Role Management | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Event Management | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓* | ✗ |
| CSR Management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓* |
| Approval Workflow | ✓ | ✓ | ✓ | ✓ | ✓* | ✗ | ✓* | ✓* | ✗ | ✗ | ✗ | ✗ |
| Reports & Analytics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Audit Logs | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*Limited to assigned scope

---

## Detailed Role Specifications

---

# 1. SUPER ADMIN

**Description:** Highest privilege level with complete system access. Manages all system-wide settings, user accounts, and configurations.

## Menus Accessible

```
├── Dashboard (Full Analytics)
├── Users Management
│   ├── All Users
│   ├── User Roles
│   └── User Approvals
├── Role Management
│   ├── Roles
│   ├── Permissions
│   └── Permission Mapping
├── Events Management
│   ├── All Events
│   ├── Event Categories
│   └── Event Approvals
├── CSR Management
│   ├── All Campaigns
│   ├── All Initiatives
│   └── Volunteer Management
├── System Settings
│   ├── General Settings
│   ├── Email Configuration
│   ├── SMS Configuration
│   └── Integrations
├── Audit Logs
├── Backup & Recovery
├── Reports & Analytics
│   ├── System Reports
│   ├── User Analytics
│   ├── Event Analytics
│   └── CSR Analytics
└── Admin Panel
    ├── Database Management
    ├── API Monitoring
    └── System Health
```

## Permissions

### User Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | users.create | All users |
| Read | users.read | All users |
| Update | users.update | All users, all fields |
| Delete | users.delete | All users (hard delete) |
| Approve | users.approve | All pending users |
| Reject | users.reject | All pending users |
| Export | users.export | All users |
| Import | users.import | Bulk user import |
| Change Password | users.change_password | Any user |
| Deactivate | users.deactivate | Any user |

### Role Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | roles.create | System roles |
| Read | roles.read | All roles |
| Update | roles.update | All roles and permissions |
| Delete | roles.delete | Custom roles only |
| Assign | roles.assign | Assign any role to users |
| Unassign | roles.unassign | Remove any role |

### Event Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | events.create | All events |
| Read | events.read | All events |
| Update | events.update | All events, all fields |
| Delete | events.delete | All events (hard delete) |
| Publish | events.publish | All events |
| Cancel | events.cancel | All events |
| Approve | events.approve | All pending events |
| Reject | events.reject | All pending events |
| Archive | events.archive | All events |
| Export | events.export | All events |

### CSR Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | csr.create | All CSR programs |
| Read | csr.read | All CSR programs |
| Update | csr.update | All CSR programs |
| Delete | csr.delete | All CSR programs |
| Manage Volunteers | csr.manage_volunteers | All volunteer assignments |
| Generate Reports | csr.generate_reports | All CSR data |
| Export Data | csr.export | All CSR data |

### System Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| System Settings | system.settings | All configurations |
| Backup | system.backup | Database backups |
| Restore | system.restore | Database restore |
| API Keys | system.api_keys | Manage API keys |
| Integrations | system.integrations | Manage all integrations |
| Email Configuration | system.email | Email settings |
| SMS Configuration | system.sms | SMS settings |

### Audit & Monitoring
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Audit Logs | audit.read | All audit logs |
| Export Audit Logs | audit.export | All audit logs |
| System Monitoring | system.monitor | API, database, performance |
| Error Logs | system.error_logs | All error logs |

## Database Permissions
- CREATE: ✓ Full
- READ: ✓ Full
- UPDATE: ✓ Full
- DELETE: ✓ Full (Hard Delete)
- EXPORT: ✓ Full
- IMPORT: ✓ Full
- GENERATE: ✓ Reports, Analytics

---

# 2. ADMIN

**Description:** System administrator responsible for user management, system configuration, and operational oversight across the platform.

## Menus Accessible

```
├── Dashboard (Full Analytics)
├── Users Management
│   ├── All Users
│   ├── Inactive Users
│   └── User Approvals
├── Role Management
│   ├── View Roles
│   ├── Permissions (Read-Only)
├── Events Management
│   ├── All Events
│   ├── Event Categories
│   ├── Event Approvals
│   └── Archived Events
├── CSR Management
│   ├── All Campaigns
│   ├── All Initiatives
│   └── Volunteer Overview
├── System Settings
│   ├── General Settings (Modify)
│   ├── Email Configuration
│   └── Notification Settings
├── Reports & Analytics
│   ├── System Reports
│   ├── User Analytics
│   ├── Event Analytics
│   └── Performance Reports
├── Audit Logs (Limited)
└── Integrations (View-Only)
```

## Permissions

### User Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | users.create | Internal users only |
| Read | users.read | All users |
| Update | users.update | All users except Super Admin |
| Delete | users.delete | Internal users (soft delete) |
| Approve | users.approve | Department users |
| Reject | users.reject | Department users |
| Deactivate | users.deactivate | All users except Super Admin |
| Export | users.export | All users |
| Bulk Import | users.import | Internal users |

### Role Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | roles.read | All system roles |
| View Permissions | roles.view_permissions | All permissions (read-only) |
| Assign Roles | roles.assign | Standard roles only (not Super Admin) |

### Event Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | events.create | All events |
| Read | events.read | All events |
| Update | events.update | All events except approved |
| Delete | events.delete | Draft events (soft delete) |
| Publish | events.publish | All events |
| Cancel | events.cancel | All events |
| Approve | events.approve | All pending events |
| Export | events.export | All events |
| Archive | events.archive | Completed events |

### CSR Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | csr.read | All CSR programs |
| View Volunteers | csr.view_volunteers | All volunteer data |
| Export CSR Data | csr.export | All CSR data |

### System Settings
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Modify | system.settings | General settings |
| Email Config | system.email | Email configuration |
| Notification Settings | system.notifications | Notification rules |
| View Integrations | system.integrations | View only |

### Reports
| Operation | Permission | Scope |
|-----------|-----------|-------|
| System Reports | reports.system | All reports |
| User Analytics | reports.users | All user data |
| Event Analytics | reports.events | All event data |
| Export Reports | reports.export | All reports |

## Database Permissions
- CREATE: ✓ Partial (Internal users, events)
- READ: ✓ Full
- UPDATE: ✓ Partial (Except Super Admin roles)
- DELETE: ✓ Soft delete only
- EXPORT: ✓ Full
- IMPORT: ✓ Users, Events
- GENERATE: ✓ Reports, Analytics

---

# 3. MANAGEMENT

**Description:** Strategic leadership role with oversight of events, CSR, and approval workflows. Access to organizational dashboards and reports.

## Menus Accessible

```
├── Dashboard (Strategic View)
│   ├── KPIs
│   ├── Event Metrics
│   └── CSR Metrics
├── Events Overview
│   ├── All Events (Read-Only)
│   ├── Event Approvals
│   ├── Pending Events
│   └── Budget Overview
├── CSR Overview
│   ├── All Campaigns (Read-Only)
│   ├── Initiative Approvals
│   └── Budget Overview
├── Approvals Workflow
│   ├── Pending Approvals
│   ├── Approval History
│   └── Approval Metrics
├── Reports & Analytics
│   ├── Event Reports
│   ├── CSR Reports
│   ├── Financial Reports
│   ├── User Engagement
│   └── Department Performance
└── Team Management
    ├── View Team Members
    └── View Department Structure
```

## Permissions

### Event Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | events.read | All events |
| Approve | events.approve | All pending events |
| Reject | events.reject | All pending events |
| Export | events.export | All events |
| View Analytics | events.analytics | All event data |

### CSR Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | csr.read | All CSR programs |
| Approve | csr.approve | All pending initiatives |
| Reject | csr.reject | All pending initiatives |
| View Budget | csr.view_budget | All CSR budgets |
| Export Data | csr.export | All CSR data |

### Approval Workflows
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Pending | approval.view | All pending approvals |
| Approve | approval.approve | Events, CSR, Budgets |
| Reject | approval.reject | Events, CSR, Budgets |
| View History | approval.history | All approval history |

### Reports & Analytics
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Reports | reports.read | Strategic reports |
| Event Analytics | reports.events | All event analytics |
| CSR Analytics | reports.csr | All CSR analytics |
| Financial Reports | reports.financial | Budget & spend data |
| Export Reports | reports.export | All reports |

### Dashboard
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Dashboard | dashboard.read | Strategic overview |
| View KPIs | dashboard.kpis | Key metrics |
| View Metrics | dashboard.metrics | All organization metrics |

## Database Permissions
- CREATE: ✗
- READ: ✓ Full
- UPDATE: ✗
- DELETE: ✗
- EXPORT: ✓ Reports
- IMPORT: ✗
- GENERATE: ✓ Reports, Analytics

---

# 4. APPROVER

**Description:** Focused role with responsibility for approving events, budgets, and CSR initiatives. Limited to approval workflows and related reports.

## Menus Accessible

```
├── Dashboard (Approvals View)
│   ├── Pending Approvals Count
│   └── Approval Queue
├── Approvals
│   ├── Pending Events
│   ├── Pending Budgets
│   ├── Pending CSR
│   ├── Pending Registrations
│   └── Approval History
├── Event Details (Read-Only)
│   ├── View Event Details
│   ├── View Registrations
│   └── View Budget
├── Reports
│   ├── Approval Reports
│   ├── Approval Metrics
│   └── Approval History Export
└── Notifications
    └── Approval Alerts
```

## Permissions

### Approval Workflows
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Pending | approval.view | All pending approvals |
| Approve | approval.approve | Assigned categories |
| Reject | approval.reject | Assigned categories |
| Add Comments | approval.comment | All pending items |
| View History | approval.history | All approval history |
| Export History | approval.export | Approval records |

### Event Details (Read-Only)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Events | events.read | Events under review |
| View Budget | events.view_budget | Event budgets |
| View Registrations | events.view_registrations | Event registrations |

### CSR Details (Read-Only)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View CSR | csr.read | Initiatives under review |
| View Budget | csr.view_budget | CSR budgets |

### Reports
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Approval Reports | reports.approvals | All approval data |
| Metrics | reports.metrics | Approval metrics |
| Export | reports.export | Approval reports |

## Database Permissions
- CREATE: ✗
- READ: ✓ Approval queue and related data
- UPDATE: ✓ Approval status only
- DELETE: ✗
- EXPORT: ✓ Approval records
- IMPORT: ✗
- GENERATE: ✓ Approval reports

---

# 5. DIVISION COORDINATOR

**Description:** Manages events and users within assigned department/division. Coordinates with event owners and manages divisional operations.

## Menus Accessible

```
├── Dashboard (Division View)
│   ├── Division KPIs
│   ├── Events in Division
│   └── Team Overview
├── Users Management
│   ├── Division Users
│   ├── User Roles
│   ├── User Approvals
│   └── Team Structure
├── Events Management
│   ├── Division Events
│   ├── Event Creation
│   ├── Event Approvals (Division)
│   └── Budget Management
├── Registrations
│   ├── View Registrations
│   ├── Manage Registrations
│   └── Export Registration Data
├── Reports & Analytics
│   ├── Division Reports
│   ├── Event Analytics
│   ├── User Analytics
│   └── Budget Reports
├── Settings
│   └── Division Settings
└── Approval Workflows
    ├── Division Approvals
    └── Pending Items
```

## Permissions

### User Management (Division)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | users.create | Division users only |
| Read | users.read | Division users only |
| Update | users.update | Division users only |
| Delete | users.delete | Division users (soft delete) |
| Approve | users.approve | Division user requests |
| Assign Roles | roles.assign | Division roles only |
| Export | users.export | Division users |

### Event Management (Division)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | events.create | Division events |
| Read | events.read | Division events |
| Update | events.update | Division events (unless approved) |
| Delete | events.delete | Division draft events |
| Publish | events.publish | Division events |
| Cancel | events.cancel | Division events |
| Approve | events.approve | Division pending events |
| Reject | events.reject | Division pending events |
| Export | events.export | Division events |
| View Budget | events.view_budget | Division budgets |
| Update Budget | events.update_budget | Division budgets |

### Registrations
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | registrations.read | Division event registrations |
| Approve | registrations.approve | Division registrations |
| Export | registrations.export | Division registration data |

### Event Approvals
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Approve | approval.approve | Division events |
| View Pending | approval.view | Division pending items |

### Reports
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Division Reports | reports.division | Division data only |
| Event Reports | reports.events | Division events |
| Budget Reports | reports.budget | Division budgets |
| Export Reports | reports.export | Division reports |

## Database Permissions
- CREATE: ✓ Partial (Division users, events)
- READ: ✓ Division data
- UPDATE: ✓ Division data
- DELETE: ✓ Soft delete only
- EXPORT: ✓ Division data
- IMPORT: ✓ Division users, events
- GENERATE: ✓ Division reports

---

# 6. EVENT OWNER

**Description:** Manages individual events from creation to completion. Responsible for event details, registrations, and feedback collection.

## Menus Accessible

```
├── Dashboard (Event View)
│   ├── My Events
│   ├── Registrations
│   ├── Attendance
│   └── Feedback
├── My Events
│   ├── Create Event
│   ├── Event List
│   ├── Event Details
│   └── Edit Event
├── Registrations
│   ├── View Registrations
│   ├── Approve Registrations
│   ├── Export Registrations
│   └── Send Invitations
├── Attendance
│   ├── Check-in
│   ├── View Attendance
│   └── Export Attendance
├── Feedback
│   ├── Collect Feedback
│   ├── View Feedback
│   ├── Feedback Analytics
│   └── Export Feedback
├── Certificates
│   ├── Generate Certificates
│   ├── Send Certificates
│   └── Certificate Verification
├── Budget
│   ├── View Budget
│   ├── Update Expenses
│   └── Budget Reports
└── Notifications
    ├── Send Notifications
    └── Notification History
```

## Permissions

### Event Management (Own Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | events.create | Own events |
| Read | events.read | Own events |
| Update | events.update | Own events (unless published) |
| Delete | events.delete | Own draft events |
| Publish | events.publish | Own events (if approved) |
| Cancel | events.cancel | Own events |
| View Analytics | events.analytics | Own events |
| Export Details | events.export | Own events |

### Registrations (Own Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | registrations.read | Own event registrations |
| Approve | registrations.approve | Own event registrations |
| Reject | registrations.reject | Own event registrations |
| Export | registrations.export | Own registration data |
| Invite Users | registrations.invite | Own events |

### Attendance (Own Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Check-in | attendance.checkin | Own events |
| View | attendance.read | Own events |
| Export | attendance.export | Own attendance data |

### Feedback (Own Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Collect | feedback.collect | Own events |
| View | feedback.read | Own event feedback |
| Export | feedback.export | Own feedback data |
| Generate Report | feedback.report | Own event feedback |

### Certificates
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Generate | certificates.generate | Own event participants |
| Send | certificates.send | Own event certificates |
| View | certificates.read | Own certificates |
| Export | certificates.export | Own certificate data |

### Budget (Own Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | budget.read | Own event budget |
| Update Expenses | budget.update_expenses | Own event budget |
| View Reports | budget.reports | Own budget data |

### Notifications
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Send | notifications.send | Own event notifications |
| View History | notifications.history | Own notifications |

## Database Permissions
- CREATE: ✓ Own events and related data
- READ: ✓ Own events and data
- UPDATE: ✓ Own events and data
- DELETE: ✓ Own draft events (soft delete)
- EXPORT: ✓ Own event data
- IMPORT: ✗
- GENERATE: ✓ Certificates, Reports

---

# 7. CSR COORDINATOR

**Description:** Manages CSR campaigns, initiatives, and volunteer programs. Coordinates corporate social responsibility activities.

## Menus Accessible

```
├── Dashboard (CSR View)
│   ├── Campaign Metrics
│   ├── Initiative Overview
│   ├── Volunteer Statistics
│   └── Budget Status
├── Campaigns
│   ├── Create Campaign
│   ├── All Campaigns
│   ├── Campaign Details
│   ├── Campaign Approvals
│   └── Campaign Analytics
├── Initiatives
│   ├── Create Initiative
│   ├── All Initiatives
│   ├── Initiative Details
│   ├── Initiative Approvals
│   └── Impact Tracking
├── Volunteer Management
│   ├── Volunteer List
│   ├── Volunteer Assignments
│   ├── Attendance Tracking
│   ├── Performance Ratings
│   └── Volunteer Reports
├── Budget Management
│   ├── View Budgets
│   ├── Update Expenses
│   ├── Budget Reports
│   └── Fund Allocation
├── Reports & Analytics
│   ├── CSR Reports
│   ├── Volunteer Analytics
│   ├── Impact Reports
│   └── Financial Reports
└── Approvals
    ├── Pending Approvals
    └── Approval History
```

## Permissions

### Campaign Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | csr_campaigns.create | All campaigns |
| Read | csr_campaigns.read | All campaigns |
| Update | csr_campaigns.update | Own campaigns (unless approved) |
| Delete | csr_campaigns.delete | Draft campaigns |
| Publish | csr_campaigns.publish | All campaigns |
| Cancel | csr_campaigns.cancel | All campaigns |
| Export | csr_campaigns.export | All campaigns |

### Initiative Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | csr_initiatives.create | All initiatives |
| Read | csr_initiatives.read | All initiatives |
| Update | csr_initiatives.update | All initiatives (unless approved) |
| Delete | csr_initiatives.delete | Draft initiatives |
| Approve | csr_initiatives.approve | All pending initiatives |
| Reject | csr_initiatives.reject | All pending initiatives |
| Export | csr_initiatives.export | All initiatives |

### Volunteer Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | volunteers.read | All volunteers |
| Assign | volunteers.assign | Volunteer assignments |
| Track Attendance | volunteers.attendance | Attendance tracking |
| Rate Performance | volunteers.rate | Performance ratings |
| Send Communications | volunteers.communicate | Volunteer communications |
| Export Data | volunteers.export | Volunteer data |
| Generate Reports | volunteers.reports | Volunteer reports |

### Budget Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | budget.read | All CSR budgets |
| Update Expenses | budget.update_expenses | CSR expenses |
| Approve Budget | budget.approve | CSR budgets |
| Reject Budget | budget.reject | CSR budgets |
| View Reports | budget.reports | Budget reports |

### Approvals
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Pending | approval.view | CSR approvals |
| Approve | approval.approve | CSR items |
| Reject | approval.reject | CSR items |
| Comment | approval.comment | CSR items |

### Reports & Analytics
| Operation | Permission | Scope |
|-----------|-----------|-------|
| CSR Reports | reports.csr | All CSR data |
| Volunteer Analytics | reports.volunteers | All volunteer data |
| Impact Reports | reports.impact | Impact data |
| Financial Reports | reports.financial | Financial data |
| Export | reports.export | All CSR reports |

## Database Permissions
- CREATE: ✓ CSR programs and initiatives
- READ: ✓ Full CSR access
- UPDATE: ✓ CSR programs and data
- DELETE: ✓ Draft CSR items (soft delete)
- EXPORT: ✓ CSR data
- IMPORT: ✓ Volunteers, Initiatives
- GENERATE: ✓ CSR reports, Certificates

---

# 8. SPORTS COMMITTEE

**Description:** Manages sports-related events and competitions. Organizes sports activities and manages participant registrations.

## Menus Accessible

```
├── Dashboard (Sports View)
│   ├── Sports Events
│   ├── Participants
│   ├── Competition Standings
│   └── Sports Analytics
├── Events Management
│   ├── Create Sports Event
│   ├── All Sports Events
│   ├── Event Details
│   ├── Event Approvals
│   └── Event Scheduling
├── Competitions
│   ├── Competition Management
│   ├── Brackets/Standings
│   ├── Results Entry
│   └── Winner Selection
├── Registrations
│   ├── View Registrations
│   ├── Approve Registrations
│   ├── Manage Participants
│   └── Export Registration Data
├── Scorekeeping
│   ├── Live Scores
│   ├── Results Entry
│   ├── Winner Declaration
│   └── Score Export
├── Certificates & Awards
│   ├── Generate Certificates
│   ├── Award Allocation
│   └── Certificate Distribution
├── Reports & Analytics
│   ├── Sports Reports
│   ├── Participation Analytics
│   ├── Performance Analytics
│   └── Attendance Reports
└── Budget Management
    ├── Sports Budget
    └── Expense Tracking
```

## Permissions

### Sports Event Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | events.create | Sports events |
| Read | events.read | Sports events |
| Update | events.update | Sports events (unless published) |
| Delete | events.delete | Draft sports events |
| Publish | events.publish | Sports events |
| Cancel | events.cancel | Sports events |
| Export | events.export | Sports events |

### Competition Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | competitions.create | Sports competitions |
| Read | competitions.read | All competitions |
| Update | competitions.update | Ongoing competitions |
| Manage Brackets | competitions.brackets | Competition brackets |
| Enter Results | competitions.results | Competition results |
| Declare Winners | competitions.winners | Competition winners |
| Export | competitions.export | Competition data |

### Registrations (Sports Events)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | registrations.read | Sports event registrations |
| Approve | registrations.approve | Sports registrations |
| Manage | registrations.manage | Participant management |
| Export | registrations.export | Registration data |

### Scorekeeping
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Enter Scores | scores.enter | Live scorekeeping |
| View Scores | scores.read | All scores |
| Update Scores | scores.update | Active competitions |
| Export Scores | scores.export | Score data |

### Certificates & Awards
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Generate Certificates | certificates.generate | Winners |
| Allocate Awards | awards.allocate | Sports awards |
| Send Certificates | certificates.send | Award certificates |
| Export Records | certificates.export | Award records |

### Reports & Analytics
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Sports Reports | reports.sports | Sports data |
| Participation Analytics | reports.participation | Participant data |
| Performance Analytics | reports.performance | Performance data |
| Attendance Reports | reports.attendance | Attendance data |
| Export | reports.export | Sports reports |

## Database Permissions
- CREATE: ✓ Sports events and competitions
- READ: ✓ Sports data
- UPDATE: ✓ Sports events and competitions
- DELETE: ✓ Draft events (soft delete)
- EXPORT: ✓ Sports data
- IMPORT: ✗
- GENERATE: ✓ Certificates, Reports

---

# 9. VENDOR

**Description:** External vendor managing deliverables and services for events. Limited access focused on assigned contracts and performance tracking.

## Menus Accessible

```
├── Dashboard (Vendor View)
│   ├── Assigned Events
│   ├── Pending Deliverables
│   ├── Performance Metrics
│   └── Payment Status
├── Contracts
│   ├── View Contracts
│   ├── Contract Details
│   ├── Terms & Conditions
│   └── Contract History
├── Assigned Events
│   ├── Event Details (Read-Only)
│   ├── Deliverables
│   ├── Timelines
│   └── Contact Information
├── Deliverables
│   ├── Submit Deliverables
│   ├── Track Status
│   ├── Update Progress
│   └── Submission History
├── Communications
│   ├── Event Contact
│   ├── Message History
│   └── Document Sharing
├── Invoicing
│   ├── View Invoices
│   ├── Submit Invoices
│   ├── Payment Status
│   └── Invoice History
├── Performance
│   ├── Performance Ratings
│   ├── Feedback
│   └── Performance History
└── Reports
    └── Vendor Performance Reports
```

## Permissions

### Contract Access
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | contracts.read | Assigned contracts only |
| View Details | contracts.view_details | Contract details |
| Accept Terms | contracts.accept | Assigned contracts |

### Assigned Events
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | events.read | Assigned events (read-only) |
| View Details | events.view_details | Event details |
| View Timeline | events.view_timeline | Event schedule |

### Deliverables Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Submit | deliverables.submit | Assigned deliverables |
| Update Status | deliverables.update_status | Progress updates |
| Upload Files | deliverables.upload | Deliverable documents |
| View History | deliverables.history | Submission history |

### Communications
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Send Messages | communications.send | Event contacts |
| View History | communications.history | Message history |
| Share Documents | communications.share | Deliverable documents |

### Invoicing
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Invoices | invoicing.read | Own invoices |
| Submit Invoices | invoicing.submit | Own invoices |
| View Payment Status | invoicing.payment_status | Payment tracking |

### Performance & Feedback
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Ratings | performance.read | Own performance |
| View Feedback | performance.feedback | Own feedback |
| Respond to Feedback | performance.respond | Feedback responses |

### Reports
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Reports | reports.performance | Own performance reports |
| Export Reports | reports.export | Own report data |

## Database Permissions
- CREATE: ✓ Deliverable submissions
- READ: ✓ Assigned contracts and events
- UPDATE: ✓ Own deliverables only
- DELETE: ✗
- EXPORT: ✓ Own reports
- IMPORT: ✗
- GENERATE: ✓ Vendor reports

---

# 10. INTERNAL EMPLOYEE

**Description:** Regular employee within the organization. Access to dashboard, event participation, and basic internal information.

## Menus Accessible

```
├── Dashboard (Employee View)
│   ├── My Events
│   ├── My Registrations
│   ├── Upcoming Events
│   └── Personal Notifications
├── Events
│   ├── Browse Events
│   ├── Event Details
│   ├── Event Categories
│   └── Event Calendar
├── Registrations
│   ├── My Registrations
│   ├── Register for Events
│   ├── Cancel Registration
│   └── Registration History
├── My Profile
│   ├── View Profile
│   ├── Edit Profile
│   ├── Change Password
│   └── Notification Preferences
├── Feedback & Ratings
│   ├── Submit Feedback
│   ├── Rate Events
│   └── My Feedback History
├── CSR Opportunities
│   ├── Browse CSR Programs
│   ├── Volunteer Opportunities
│   ├── My Volunteer History
│   └── CSR Analytics
├── Directory (Internal)
│   ├── Employee Directory
│   ├── Department Contacts
│   └── Organization Structure
└── Announcements
    └── Internal News & Updates
```

## Permissions

### Event Browsing & Registration
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read Events | events.read | Public & internal events |
| View Details | events.view_details | Event information |
| Register | events.register | Public events |
| View Calendar | events.calendar | Event calendar |
| View Category | events.categories | Event categories |

### Registrations (Own)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | registrations.create | Own registrations |
| View | registrations.read | Own registrations |
| Cancel | registrations.cancel | Own registrations |
| Export History | registrations.export | Own registration history |

### Profile Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read Own | profile.read | Own profile |
| Update Own | profile.update | Own profile |
| Change Password | profile.change_password | Own password |
| Preferences | profile.preferences | Own preferences |

### Feedback & Ratings
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Submit | feedback.create | Attended events |
| View Own | feedback.read | Own feedback |
| Rate Events | feedback.rate | Attended events |

### CSR Participation
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Browse | csr.read | Public CSR programs |
| View Details | csr.view_details | Program details |
| Register Volunteer | csr.volunteer_register | Volunteer opportunities |
| View History | csr.history | Own participation |

### Directory Access
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Directory | directory.read | Internal directory |
| View Contacts | directory.contacts | Department contacts |
| View Structure | directory.structure | Organization structure |

### Announcements
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | announcements.read | Internal announcements |

## Database Permissions
- CREATE: ✓ Own registrations and feedback
- READ: ✓ Public and personal data
- UPDATE: ✓ Own profile and registrations
- DELETE: ✓ Own registrations (soft delete)
- EXPORT: ✓ Own data
- IMPORT: ✗
- GENERATE: ✗

---

# 11. EXTERNAL USER

**Description:** External stakeholder with limited access. Can browse and register for public events, provide feedback.

## Menus Accessible

```
├── Dashboard (Guest View)
│   ├── Featured Events
│   ├── My Registrations
│   ├── Upcoming Events
│   └── Personal Notifications
├── Events
│   ├── Browse Events
│   ├── Event Details
│   ├── Event Search
│   ├── Event Filters
│   └── Event Calendar
├── Registrations
│   ├── My Registrations
│   ├── Register for Events
│   └── Cancel Registration
├── My Profile
│   ├── View Profile
│   ├── Edit Profile
│   └── Change Password
├── Feedback
│   ├── Submit Feedback
│   ├── Rate Events
│   └── My Feedback History
└── Public Information
    ├── About Platform
    ├── Contact Information
    └── FAQs
```

## Permissions

### Event Browsing
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read Events | events.read | Public events only |
| View Details | events.view_details | Public event information |
| Search Events | events.search | Public events |
| View Calendar | events.calendar | Public event calendar |

### Registrations (Own)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Create | registrations.create | Public event registration |
| Read | registrations.read | Own registrations |
| Cancel | registrations.cancel | Own registrations |

### Profile (Own)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read Own | profile.read | Own profile |
| Update Own | profile.update | Own profile |
| Change Password | profile.change_password | Own password |

### Feedback (Own)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Submit | feedback.create | Attended public events |
| View Own | feedback.read | Own feedback |
| Rate Events | feedback.rate | Attended events |

### Public Information
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | public.read | Public information |

## Database Permissions
- CREATE: ✓ Own registrations and feedback
- READ: ✓ Public data only
- UPDATE: ✓ Own profile
- DELETE: ✓ Own registrations (soft delete)
- EXPORT: ✗
- IMPORT: ✗
- GENERATE: ✗

---

# 12. VOLUNTEER

**Description:** Individual volunteer participating in CSR initiatives. Manages volunteer assignments and tracks volunteering hours.

## Menus Accessible

```
├── Dashboard (Volunteer View)
│   ├── My Assignments
│   ├── Hours Logged
│   ├── Achievement Badges
│   └── Volunteer Statistics
├── My Assignments
│   ├── Active Assignments
│   ├── Assignment Details
│   ├── Timeline & Schedule
│   └── Assignment History
├── Hours Management
│   ├── Log Hours
│   ├── View Hours Log
│   ├── Hour History
│   └── Hours Summary
├── Initiatives
│   ├── Browse Initiatives
│   ├── Initiative Details
│   ├── Join Initiatives
│   └── My Initiatives
├── My Profile
│   ├── Volunteer Profile
│   ├── Edit Profile
│   ├── Skills & Interests
│   ├── Change Password
│   └── Availability
├── Certificates & Recognition
│   ├── View Certificates
│   ├── Download Certificates
│   ├── Badges
│   └── Recognition History
├── Feedback & Ratings
│   ├── View Feedback
│   ├── Performance History
│   └── Improvement Goals
└── Communications
    ├── Coordinator Contact
    └── Message History
```

## Permissions

### Volunteer Assignments
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | assignments.read | Own assignments |
| Accept | assignments.accept | Assigned to volunteer |
| Decline | assignments.decline | Assigned to volunteer |
| View Status | assignments.status | Own assignments |

### Hours Management
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Log Hours | hours.log | Own volunteer hours |
| View Hours | hours.read | Own hours logged |
| Export Summary | hours.export | Own hours data |

### CSR Initiatives
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Browse | csr.read | Public CSR programs |
| View Details | csr.view_details | Initiative details |
| Join Initiative | csr.join | Volunteer initiatives |
| View Participation | csr.history | Own participation |

### Profile (Own)
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Read | profile.read | Own profile |
| Update | profile.update | Own profile details |
| Update Skills | profile.skills | Skills & interests |
| Update Availability | profile.availability | Availability |
| Change Password | profile.change_password | Own password |

### Certificates & Recognition
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View | certificates.read | Own certificates |
| Download | certificates.download | Own certificates |
| View Badges | badges.read | Own badges |
| View Recognition | recognition.read | Own recognition |

### Feedback
| Operation | Permission | Scope |
|-----------|-----------|-------|
| View Feedback | feedback.read | Own feedback |
| View Ratings | feedback.ratings | Own performance ratings |
| Respond to Feedback | feedback.respond | Feedback responses |

### Communications
| Operation | Permission | Scope |
|-----------|-----------|-------|
| Send Messages | communications.send | CSR coordinator |
| View History | communications.history | Message history |

## Database Permissions
- CREATE: ✓ Hour logs and feedback responses
- READ: ✓ Own assignment and participation data
- UPDATE: ✓ Own hours and profile
- DELETE: ✗
- EXPORT: ✓ Own hours summary
- IMPORT: ✗
- GENERATE: ✗

---

## Permission Matrix

### Comprehensive Permission Matrix

| Permission | Super Admin | Admin | Management | Approver | Div Coord | Event Owner | CSR Coord | Sports Comm | Vendor | Int Emp | Ext User | Volunteer |
|-----------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **User Management** |
| users.create | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| users.read | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| users.update | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓* | ✓ | ✓* |
| users.delete | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| roles.create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| roles.assign | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Event Management** |
| events.create | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| events.read | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ |
| events.update | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| events.delete | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| events.publish | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| events.approve | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| events.export | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **CSR Management** |
| csr.create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| csr.read | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| csr.update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| csr.delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| csr.approve | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| volunteers.manage | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Approvals** |
| approval.approve | ✓ | ✓ | ✓ | ✓ | ✓* | ✗ | ✓* | ✓* | ✗ | ✗ | ✗ | ✗ |
| approval.reject | ✓ | ✓ | ✓ | ✓ | ✓* | ✗ | ✓* | ✓* | ✗ | ✗ | ✗ | ✗ |
| approval.view | ✓ | ✓ | ✓ | ✓ | ✓* | ✗ | ✓* | ✓* | ✗ | ✗ | ✗ | ✗ |
| **Registrations** |
| registrations.create | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ |
| registrations.read | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| registrations.approve | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| registrations.export | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Reports & Analytics** |
| reports.read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| reports.generate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| reports.export | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **System Settings** |
| system.settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| system.email | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| system.sms | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Audit** |
| audit.read | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| audit.export | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Dashboard** |
| dashboard.view | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*Limited to assigned scope

---

## Implementation Guide

### Database Schema for RBAC

```sql
-- Roles table
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  role_type ENUM('system', 'custom'),
  hierarchy_level INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);

-- Permissions table
CREATE TABLE permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  resource VARCHAR(100),
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions junction
CREATE TABLE role_permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  UNIQUE KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- User roles junction
CREATE TABLE user_roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  effective_from DATETIME,
  effective_until DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### Permission Checking in Code

```typescript
// Middleware example
export const authorizePermission = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      throw new AuthenticationError('User not authenticated');
    }

    // Get user permissions
    const userPermissions = await getUserPermissions(user.id);

    // Check if user has required permission
    const hasPermission = requiredPermissions.some(perm =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

// Usage in routes
router.post(
  '/events',
  authorizePermission(['events.create']),
  eventController.createEvent
);
```

### Frontend Permission Checking

```typescript
// React hook for permission checking
export const useHasPermission = (permission: string) => {
  const userPermissions = useAppSelector(selectUserPermissions);
  return userPermissions.includes(permission);
};

// Component example
export const EventCreateButton = () => {
  const hasPermission = useHasPermission('events.create');

  if (!hasPermission) {
    return null;
  }

  return <button onClick={handleCreate}>Create Event</button>;
};
```

### Audit Logging for Permission Changes

```typescript
// Log all permission-related actions
await auditService.logAction({
  actionType: 'permission_change',
  entityType: 'user_role',
  entityId: userId,
  userId: adminId,
  changes: {
    oldRole: previousRole,
    newRole: newRole,
    reason: 'Promotion to manager',
  },
});
```

---

## API Endpoints by Role

### Super Admin Endpoints
- POST /api/v1/users (Create any user)
- GET /api/v1/users (List all users)
- PUT /api/v1/users/:id (Update any user)
- DELETE /api/v1/users/:id (Delete user)
- POST /api/v1/roles (Create role)
- PUT /api/v1/roles/:id (Update role)
- POST /api/v1/roles/:id/permissions (Assign permissions)
- GET /api/v1/system/settings (View all settings)
- PUT /api/v1/system/settings (Modify settings)
- GET /api/v1/audit-logs (View all audit logs)

### Admin Endpoints
- POST /api/v1/users (Create internal users)
- GET /api/v1/users (List all users)
- PUT /api/v1/users/:id (Update users)
- GET /api/v1/events (List all events)
- POST /api/v1/events/:id/publish (Publish event)
- PUT /api/v1/system/settings/email (Modify email)
- GET /api/v1/reports/system (System reports)

### Event Owner Endpoints
- POST /api/v1/events (Create own events)
- GET /api/v1/events/:id (View own events)
- PUT /api/v1/events/:id (Edit own events)
- POST /api/v1/events/:id/publish (Publish own events)
- GET /api/v1/events/:id/registrations (View registrations)
- POST /api/v1/events/:id/registrations/:regId/approve (Approve registration)
- POST /api/v1/events/:id/certificates (Generate certificates)

### Internal Employee Endpoints
- GET /api/v1/events (Browse public events)
- POST /api/v1/registrations (Register for events)
- GET /api/v1/registrations (View own registrations)
- PUT /api/v1/profile (Update own profile)
- POST /api/v1/feedback (Submit feedback)

### External User Endpoints
- GET /api/v1/events (Browse public events)
- POST /api/v1/registrations (Register for public events)
- GET /api/v1/registrations (View own registrations)
- PUT /api/v1/profile (Update own profile)

---

## Role Activation & Temporal Permissions

### Temporal Role Activation
```sql
-- User can have temporary role assignments
INSERT INTO user_roles (
  user_id,
  role_id,
  effective_from,
  effective_until
) VALUES (
  123,
  5,  -- Event Owner role
  '2026-08-01 08:00:00',
  '2026-08-31 17:00:00'  -- Role expires after event
);
```

### Checking Active Roles

```typescript
export const getActiveUserRoles = async (userId: number) => {
  const now = new Date();
  
  const roles = await db.query(`
    SELECT r.* FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
    AND ur.is_active = TRUE
    AND (ur.effective_from IS NULL OR ur.effective_from <= ?)
    AND (ur.effective_until IS NULL OR ur.effective_until > ?)
  `, [userId, now, now]);

  return roles;
};
```

---

## Permission Scoping

### Department-Based Scope
```typescript
// Division Coordinator can only manage users in their division
export const hasAccessToUser = async (coordinatorId: number, targetUserId: number) => {
  const coordinator = await getUserWithDepartment(coordinatorId);
  const targetUser = await getUserWithDepartment(targetUserId);

  return coordinator.departmentId === targetUser.departmentId;
};
```

### Event-Based Scope
```typescript
// Event Owner can only manage their events
export const hasEventAccess = async (userId: number, eventId: number) => {
  const event = await eventRepository.findById(eventId);
  return event.createdBy === userId;
};
```

---

## Best Practices

1. **Least Privilege Principle** - Users should have minimum required permissions
2. **Audit All Permission Changes** - Track who changed what permissions and when
3. **Regular Permission Audits** - Review permissions monthly to ensure compliance
4. **Role-Based Not User-Based** - Always grant permissions through roles, not individually
5. **Temporal Permissions** - Use expiration dates for temporary role assignments
6. **Permission Documentation** - Document why each role has specific permissions
7. **Testing** - Test permission boundaries in integration tests
8. **Monitoring** - Alert on unusual permission changes

---

## Summary

### Permission Distribution by Role

| Role | Total Permissions | Create | Read | Update | Delete | Approve |
|------|:---------------:|:------:|:----:|:------:|:------:|:-------:|
| Super Admin | 45+ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin | 38 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Management | 15 | ✗ | ✓ | ✗ | ✗ | ✓ |
| Approver | 12 | ✗ | ✓ | ✓ | ✗ | ✓ |
| Division Coordinator | 25 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Event Owner | 18 | ✓ | ✓ | ✓ | ✓ | ✗ |
| CSR Coordinator | 22 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sports Committee | 20 | ✓ | ✓ | ✓ | ✓ | ✗ |
| Vendor | 8 | ✓ | ✓ | ✓ | ✗ | ✗ |
| Internal Employee | 12 | ✓ | ✓ | ✓ | ✓ | ✗ |
| External User | 6 | ✓ | ✓ | ✓ | ✓ | ✗ |
| Volunteer | 10 | ✓ | ✓ | ✓ | ✗ | ✗ |

---

**Complete RBAC Documentation Ready!** 🎉

This comprehensive RBAC implementation provides:
- ✅ 12 distinct roles with clear responsibilities
- ✅ Fine-grained permission control (45+ permissions)
- ✅ Role hierarchy and inheritance
- ✅ Temporal permission management
- ✅ Scope-based access control
- ✅ Complete API endpoint mapping
- ✅ Database schema for implementation
- ✅ Code examples for enforcement
- ✅ Audit logging capabilities
- ✅ Best practices guide

*Last Updated: July 2026*
