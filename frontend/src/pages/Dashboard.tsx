import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { DivisionManagerDashboard } from './dashboards/DivisionManagerDashboard';
import { EventOrganizerDashboard } from './dashboards/EventOrganizerDashboard';
import { EmployeeDashboard } from './dashboards/EmployeeDashboard';
import { VolunteerDashboard } from './dashboards/VolunteerDashboard';
import { SpeakerDashboard } from './dashboards/SpeakerDashboard';
import { SponsorDashboard } from './dashboards/SponsorDashboard';
import { ExternalUserDashboard } from './dashboards/ExternalUserDashboard';
import { CustomerSupportDashboard } from './dashboards/CustomerSupportDashboard';

export function Dashboard() {
  const currentRole = useSelector((state: RootState) => state.ui.currentRole);

  // Route to appropriate dashboard based on role
  switch (currentRole) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'division_manager':
      return <DivisionManagerDashboard />;
    case 'event_organizer':
      return <EventOrganizerDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    case 'speaker':
      return <SpeakerDashboard />;
    case 'sponsor':
      return <SponsorDashboard />;
    case 'external_user':
      return <ExternalUserDashboard />;
    case 'customer_support':
      return <CustomerSupportDashboard />;
    // Fallback for other roles
    default:
      return <EmployeeDashboard />;
  }
}
