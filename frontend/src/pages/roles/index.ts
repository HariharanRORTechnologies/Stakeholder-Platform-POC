// Super Admin Pages (5 pages)
export { SystemHealth } from './superAdmin/SystemHealth';
export { UserManagement } from './superAdmin/UserManagement';
export { AuditLogs } from './superAdmin/AuditLogs';
export { SystemSettings } from './superAdmin/SystemSettings';
export { DatabaseHealth } from './superAdmin/DatabaseHealth';

// Admin Pages (4 pages)
export { EventManagement } from './admin/EventManagement';
export { ApprovalQueue } from './admin/ApprovalQueue';
export { Reports } from './admin/Reports';
export { RolePermissions } from './admin/RolePermissions';

// Division Manager Pages (3 pages)
export { TeamManagement } from './divisionManager/TeamManagement';
export { BudgetTracking } from './divisionManager/BudgetTracking';
export { DivisionEvents } from './divisionManager/DivisionEvents';

// Event Organizer Pages (2 pages)
export { RegistrationManagement } from './eventOrganizer/RegistrationManagement';
export { AttendanceTracking } from './eventOrganizer/AttendanceTracking';

// Employee Pages (1 page)
export { MyEvents } from './employee/MyEvents';

// Volunteer Pages (1 page)
export { Opportunities } from './volunteer/Opportunities';

// Speaker Pages (1 page)
export { MyEngagements } from './speaker/MyEngagements';

// Sponsor Pages (1 page)
export { Sponsorships } from './sponsor/Sponsorships';

// External User Pages (1 page)
export { MyRegistrations } from './externalUser/MyRegistrations';

// Customer Support Pages (1 page)
export { TicketManagement } from './customerSupport/TicketManagement';

// Utility exports
export { THEME, KPICard, CommonTable, CommonModal, renderStatusChip } from './roleUtils';
