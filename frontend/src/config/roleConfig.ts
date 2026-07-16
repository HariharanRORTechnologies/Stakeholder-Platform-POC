import React from 'react';
import {
  AdminPanelSettings as SuperAdminIcon,
  ManageAccounts as AdminIcon,
  Groups as ManagerIcon,
  EventNote as OrganizerIcon,
  Person as EmployeeIcon,
  VolunteerActivism as VolunteerIcon,
  Mic as SpeakerIcon,
  BusinessCenter as SponsorIcon,
  PublicOutlined as ExternalUserIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'division_manager'
  | 'event_organizer'
  | 'employee'
  | 'volunteer'
  | 'speaker'
  | 'sponsor'
  | 'external_user'
  | 'customer_support';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  iconComponent: React.ComponentType<any>;
  color: string;
  darkColor: string;
  lightColor: string;
  accentColor: string;
  dashboardMetrics: string[];
  menuItems: string[];
}

export const roleConfig: Record<UserRole, RoleConfig> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access and complete control over all platform features and user management',
    iconComponent: SuperAdminIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['total_users', 'system_health', 'user_activity', 'revenue'],
    menuItems: ['dashboard', 'users', 'roles', 'permissions', 'settings', 'reports', 'analytics'],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative access to manage users, events, and platform operations',
    iconComponent: AdminIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['total_events', 'total_users', 'registrations', 'active_sessions'],
    menuItems: ['dashboard', 'events', 'users', 'registrations', 'reports', 'settings'],
  },
  division_manager: {
    id: 'division_manager',
    name: 'Division Manager',
    description: 'Oversee division-level operations, manage team members, and track performance metrics',
    iconComponent: ManagerIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['team_size', 'team_performance', 'assigned_tasks', 'team_events'],
    menuItems: ['dashboard', 'team', 'events', 'reports', 'tasks'],
  },
  event_organizer: {
    id: 'event_organizer',
    name: 'Event Organizer',
    description: 'Plan and manage events, handle registrations, and coordinate event activities',
    iconComponent: OrganizerIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['events_created', 'total_attendees', 'registrations_pending', 'upcoming_events'],
    menuItems: ['dashboard', 'events', 'registrations', 'attendees', 'feedback', 'certificates'],
  },
  employee: {
    id: 'employee',
    name: 'Employee',
    description: 'Access to company events, training materials, and personal performance tracking',
    iconComponent: EmployeeIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['my_events', 'certificates', 'training_progress', 'performance_score'],
    menuItems: ['dashboard', 'events', 'certificates', 'my_profile', 'feedback'],
  },
  volunteer: {
    id: 'volunteer',
    name: 'Volunteer',
    description: 'Join volunteer opportunities, track volunteer hours, and earn recognition badges',
    iconComponent: VolunteerIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['volunteer_hours', 'opportunities', 'badges_earned', 'activities'],
    menuItems: ['dashboard', 'opportunities', 'my_hours', 'certificates', 'community'],
  },
  speaker: {
    id: 'speaker',
    name: 'Speaker',
    description: 'Manage speaking engagements, view audience feedback, and track speaking metrics',
    iconComponent: SpeakerIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['upcoming_talks', 'audience_size', 'feedback_score', 'speaking_hours'],
    menuItems: ['dashboard', 'my_talks', 'feedback', 'audience_analytics', 'profile'],
  },
  sponsor: {
    id: 'sponsor',
    name: 'Sponsor',
    description: 'Access sponsorship opportunities, track ROI, and view event analytics',
    iconComponent: SponsorIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['active_sponsorships', 'event_reach', 'roi_metrics', 'brand_visibility'],
    menuItems: ['dashboard', 'opportunities', 'analytics', 'my_sponsorships', 'reports'],
  },
  external_user: {
    id: 'external_user',
    name: 'External User',
    description: 'Limited access to public events and communities without internal account privileges',
    iconComponent: ExternalUserIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['public_events', 'my_registrations', 'certificates', 'community_updates'],
    menuItems: ['dashboard', 'events', 'community', 'my_profile'],
  },
  customer_support: {
    id: 'customer_support',
    name: 'Customer Support',
    description: 'Handle customer inquiries, resolve issues, and maintain user satisfaction records',
    iconComponent: SupportIcon,
    color: '#16A34A',
    darkColor: '#15803D',
    lightColor: '#DCFCE7',
    accentColor: '#22C55E',
    dashboardMetrics: ['open_tickets', 'resolution_time', 'satisfaction_score', 'assigned_cases'],
    menuItems: ['dashboard', 'tickets', 'users', 'knowledge_base', 'analytics'],
  },
};

export const getAllRoles = (): RoleConfig[] => {
  return Object.values(roleConfig);
};

export const getRoleById = (id: UserRole): RoleConfig => {
  return roleConfig[id];
};

export const getRoleLabel = (id: UserRole): string => {
  return roleConfig[id].name;
};
