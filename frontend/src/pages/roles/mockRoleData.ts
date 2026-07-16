// Mock data for all role-specific pages

// Super Admin Mock Data
export const mockSystemHealthData = [
  { id: 1, component: 'API Server', status: 'healthy' as const, uptime: '99.9%', latency: '45ms', timestamp: '2026-07-15 10:00' },
  { id: 2, component: 'Database', status: 'healthy' as const, uptime: '99.95%', latency: '25ms', timestamp: '2026-07-15 10:00' },
  { id: 3, component: 'Cache Server', status: 'healthy' as const, uptime: '99.8%', latency: '15ms', timestamp: '2026-07-15 10:00' },
  { id: 4, component: 'Storage Service', status: 'warning' as const, uptime: '98.5%', latency: '120ms', timestamp: '2026-07-15 10:00' },
];

export const mockAuditLogsData = [
  { id: 1, user: 'john.admin@company.com', action: 'User Created', resource: 'User: Sarah Johnson', date: '2026-07-15 09:30', status: 'success' as const },
  { id: 2, user: 'jane.admin@company.com', action: 'Event Published', resource: 'Event: Annual Conference', date: '2026-07-15 09:15', status: 'success' as const },
  { id: 3, user: 'admin@system.com', action: 'Role Permission Changed', resource: 'Role: Event Organizer', date: '2026-07-15 08:45', status: 'success' as const },
  { id: 4, user: 'mike.admin@company.com', action: 'Failed Login Attempt', resource: 'User Account', date: '2026-07-15 08:20', status: 'error' as const },
  { id: 5, user: 'susan.admin@company.com', action: 'Database Backup', resource: 'Main Database', date: '2026-07-15 02:00', status: 'success' as const },
];

export const mockDatabaseHealthData = [
  { id: 1, metric: 'Database Size', value: '2.5 GB', status: 'healthy' as const, change: '+0.2 GB/week' },
  { id: 2, metric: 'Query Performance', value: '95th: 150ms', status: 'healthy' as const, change: '-5ms improvement' },
  { id: 3, metric: 'Connection Pool', value: '245/500', status: 'healthy' as const, change: 'Normal usage' },
  { id: 4, metric: 'Disk Usage', value: '78%', status: 'warning' as const, change: '+2% this week' },
  { id: 5, metric: 'Last Backup', value: '2 hours ago', status: 'healthy' as const, change: 'On schedule' },
];

// Admin Mock Data
export const mockEventManagementData = [
  { id: 1, title: 'Annual Conference 2026', date: '2026-08-15', status: 'published' as const, organizer: 'Sarah Johnson', registrations: 245 },
  { id: 2, title: 'Tech Workshop', date: '2026-07-25', status: 'draft' as const, organizer: 'Mike Davis', registrations: 0 },
  { id: 3, title: 'Networking Event', date: '2026-07-30', status: 'published' as const, organizer: 'Emma Wilson', registrations: 128 },
  { id: 4, title: 'Leadership Seminar', date: '2026-08-10', status: 'pending' as const, organizer: 'Alex Brown', registrations: 45 },
];

export const mockApprovalQueueData = [
  { id: 1, type: 'User Registration', requester: 'john.smith@email.com', date: '2026-07-15 10:30', status: 'pending' as const },
  { id: 2, type: 'Event Proposal', requester: 'sarah.johnson@email.com', date: '2026-07-15 09:45', status: 'pending' as const },
  { id: 3, type: 'Sponsor Application', requester: 'tech.corp@company.com', date: '2026-07-14 14:20', status: 'pending' as const },
  { id: 4, type: 'Budget Request', requester: 'mike.davis@email.com', date: '2026-07-14 11:00', status: 'pending' as const },
];

export const mockRolePermissionsData = [
  { id: 1, role: 'Super Admin', permissions: 'All', resourceCount: 1000, status: 'active' as const },
  { id: 2, role: 'Admin', permissions: 'Users, Events, Reports', resourceCount: 250, status: 'active' as const },
  { id: 3, role: 'Event Organizer', permissions: 'Events, Registrations, Speakers', resourceCount: 50, status: 'active' as const },
  { id: 4, role: 'Employee', permissions: 'Tasks, Calendar, Events', resourceCount: 25, status: 'active' as const },
  { id: 5, role: 'Volunteer', permissions: 'Opportunities, Hours, Shifts', resourceCount: 15, status: 'active' as const },
];

// Division Manager Mock Data
export const mockTeamManagementData = [
  { id: 1, name: 'John Smith', role: 'Team Lead', department: 'Events', joinDate: '2025-01-15', status: 'active' as const },
  { id: 2, name: 'Sarah Johnson', role: 'Event Coordinator', department: 'Events', joinDate: '2025-03-20', status: 'active' as const },
  { id: 3, name: 'Mike Davis', role: 'Support Staff', department: 'Operations', joinDate: '2025-05-10', status: 'active' as const },
  { id: 4, name: 'Emma Wilson', role: 'Event Coordinator', department: 'Events', joinDate: '2025-06-01', status: 'inactive' as const },
];

export const mockBudgetTrackingData = [
  { id: 1, category: 'Events', allocated: 50000, spent: 35000, remaining: 15000, percentage: 70 },
  { id: 2, category: 'Marketing', allocated: 25000, spent: 18000, remaining: 7000, percentage: 72 },
  { id: 3, category: 'Operations', allocated: 30000, spent: 24000, remaining: 6000, percentage: 80 },
  { id: 4, category: 'Training', allocated: 15000, spent: 8000, remaining: 7000, percentage: 53 },
];

export const mockResourceAllocationData = [
  { id: 1, eventName: 'Annual Conference', teamMembers: 8, startDate: '2026-08-15', endDate: '2026-08-17', status: 'allocated' as const },
  { id: 2, eventName: 'Tech Workshop', teamMembers: 4, startDate: '2026-07-25', endDate: '2026-07-25', status: 'pending' as const },
  { id: 3, eventName: 'Networking Event', teamMembers: 6, startDate: '2026-07-30', endDate: '2026-07-30', status: 'allocated' as const },
];

// Event Organizer Mock Data
export const mockRegistrationData = [
  { id: 1, name: 'John Smith', email: 'john@email.com', registrationDate: '2026-07-10', status: 'confirmed' as const, ticketType: 'Standard' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', registrationDate: '2026-07-12', status: 'confirmed' as const, ticketType: 'VIP' },
  { id: 3, name: 'Mike Davis', email: 'mike@email.com', registrationDate: '2026-07-14', status: 'pending' as const, ticketType: 'Standard' },
  { id: 4, name: 'Emma Wilson', email: 'emma@email.com', registrationDate: '2026-07-15', status: 'confirmed' as const, ticketType: 'Student' },
];

export const mockAttendanceData = [
  { id: 1, name: 'John Smith', checkInTime: '09:00 AM', status: 'checked-in' as const, ticketType: 'Standard' },
  { id: 2, name: 'Sarah Johnson', checkInTime: '08:45 AM', status: 'checked-in' as const, ticketType: 'VIP' },
  { id: 3, name: 'Mike Davis', checkInTime: '', status: 'no-show' as const, ticketType: 'Standard' },
  { id: 4, name: 'Emma Wilson', checkInTime: '09:15 AM', status: 'checked-in' as const, ticketType: 'Student' },
];

export const mockSpeakerData = [
  { id: 1, name: 'Dr. Jane Smith', topic: 'AI in Business', experience: '15 years', status: 'confirmed' as const, speakingTime: '10:00 AM - 11:00 AM' },
  { id: 2, name: 'Prof. John Davis', topic: 'Cloud Architecture', experience: '20 years', status: 'confirmed' as const, speakingTime: '11:15 AM - 12:15 PM' },
  { id: 3, name: 'Sarah Wilson', topic: 'Digital Marketing', experience: '10 years', status: 'pending' as const, speakingTime: 'TBD' },
];

// Employee Mock Data
export const mockEmployeeEventsData = [
  { id: 1, eventName: 'Annual Conference 2026', date: '2026-08-15', role: 'Support Staff', status: 'assigned' as const },
  { id: 2, eventName: 'Tech Workshop', date: '2026-07-25', role: 'Registration Desk', status: 'assigned' as const },
  { id: 3, eventName: 'Networking Event', date: '2026-07-30', role: 'Coordinator', status: 'completed' as const },
];

export const mockEmployeeTasksData = [
  { id: 1, title: 'Setup event registration', eventName: 'Annual Conference', dueDate: '2026-08-10', status: 'in-progress' as const, priority: 'high' as const },
  { id: 2, title: 'Prepare speaker materials', eventName: 'Tech Workshop', dueDate: '2026-07-20', status: 'completed' as const, priority: 'high' as const },
  { id: 3, title: 'Send attendee reminders', eventName: 'Networking Event', dueDate: '2026-07-28', status: 'pending' as const, priority: 'medium' as const },
];

export const mockEmployeePerformanceData = [
  { id: 1, metric: 'Events Completed', value: 12, target: 15, achievement: '80%' },
  { id: 2, metric: 'Tasks On Time', value: 28, target: 30, achievement: '93%' },
  { id: 3, metric: 'Customer Satisfaction', value: 4.5, target: 4.5, achievement: '100%' },
];

// Volunteer Mock Data
export const mockVolunteerOpportunitiesData = [
  { id: 1, title: 'Event Registration Desk', eventDate: '2026-08-15', duration: '4 hours', spots: 8, status: 'open' as const },
  { id: 2, title: 'Networking Setup & Cleanup', eventDate: '2026-07-30', duration: '6 hours', spots: 5, status: 'open' as const },
  { id: 3, title: 'Speaker Support', eventDate: '2026-07-25', duration: '2 hours', spots: 2, status: 'open' as const },
  { id: 4, title: 'Attendee Greeter', eventDate: '2026-08-10', duration: '3 hours', spots: 0, status: 'full' as const },
];

export const mockVolunteerHoursData = [
  { id: 1, eventName: 'Annual Conference', date: '2026-07-10', hours: 4, status: 'logged' as const },
  { id: 2, eventName: 'Tech Workshop', date: '2026-07-08', hours: 2, status: 'pending' as const },
  { id: 3, eventName: 'Networking Event', date: '2026-06-15', hours: 3, status: 'logged' as const },
];

export const mockVolunteerShiftsData = [
  { id: 1, eventName: 'Annual Conference 2026', date: '2026-08-15', timeSlot: '09:00 AM - 01:00 PM', role: 'Registration', status: 'scheduled' as const },
  { id: 2, eventName: 'Tech Workshop', date: '2026-07-25', timeSlot: '08:30 AM - 10:30 AM', role: 'Speaker Support', status: 'scheduled' as const },
  { id: 3, eventName: 'Networking Event', date: '2026-07-30', timeSlot: '05:00 PM - 09:00 PM', role: 'Setup & Cleanup', status: 'scheduled' as const },
];

// Speaker Mock Data
export const mockSpeakerEngagementsData = [
  { id: 1, eventName: 'Annual Conference 2026', topic: 'AI in Business', date: '2026-08-15', time: '10:00 AM', status: 'confirmed' as const },
  { id: 2, eventName: 'Tech Workshop', topic: 'Cloud Architecture', date: '2026-07-25', time: '02:00 PM', status: 'confirmed' as const },
  { id: 3, eventName: 'Industry Summit', topic: 'Digital Transformation', date: '2026-09-01', time: 'TBD', status: 'pending' as const },
];

export const mockSpeakerTopicsData = [
  { id: 1, title: 'AI in Business', category: 'Technology', duration: '60 min', level: 'Intermediate', status: 'active' as const },
  { id: 2, title: 'Cloud Architecture', category: 'Technology', duration: '45 min', level: 'Advanced', status: 'active' as const },
  { id: 3, title: 'Digital Transformation', category: 'Business', duration: '60 min', level: 'Beginner', status: 'inactive' as const },
];

export const mockAudienceFeedbackData = [
  { id: 1, eventName: 'Annual Conference', rating: 4.8, comments: 'Excellent presentation', date: '2026-07-10' },
  { id: 2, eventName: 'Tech Workshop', rating: 4.5, comments: 'Very informative', date: '2026-07-08' },
  { id: 3, eventName: 'Industry Summit', rating: 4.2, comments: 'Good content', date: '2026-06-15' },
];

// Sponsor Mock Data
export const mockSponsorshipsData = [
  { id: 1, eventName: 'Annual Conference 2026', sponsorshipLevel: 'Platinum', startDate: '2026-07-01', endDate: '2026-08-17', status: 'active' as const },
  { id: 2, eventName: 'Tech Workshop', sponsorshipLevel: 'Gold', startDate: '2026-07-15', endDate: '2026-07-25', status: 'active' as const },
  { id: 3, eventName: 'Networking Event', sponsorshipLevel: 'Silver', startDate: '2026-07-20', endDate: '2026-07-30', status: 'active' as const },
];

export const mockROITrackingData = [
  { id: 1, eventName: 'Annual Conference 2026', investment: 50000, exposure: 5000, leads: 250, roi: '450%' },
  { id: 2, eventName: 'Tech Workshop', investment: 20000, exposure: 2000, leads: 80, roi: '320%' },
  { id: 3, eventName: 'Networking Event', investment: 15000, exposure: 1500, leads: 60, roi: '280%' },
];

export const mockBrandAssetsData = [
  { id: 1, assetName: 'Company Logo', format: 'PNG, SVG', size: '2.5 MB', uploaded: '2026-01-15', status: 'approved' as const },
  { id: 2, assetName: 'Event Banner', format: 'JPG', size: '5.2 MB', uploaded: '2026-06-20', status: 'approved' as const },
  { id: 3, assetName: 'Brand Guidelines', format: 'PDF', size: '8.1 MB', uploaded: '2026-03-10', status: 'approved' as const },
];

// External User Mock Data
export const mockExternalUserRegistrationsData = [
  { id: 1, eventName: 'Annual Conference 2026', registrationDate: '2026-07-10', status: 'confirmed' as const, ticketType: 'Standard' },
  { id: 2, eventName: 'Tech Workshop', registrationDate: '2026-07-12', status: 'confirmed' as const, ticketType: 'Early Bird' },
  { id: 3, eventName: 'Networking Event', registrationDate: '2026-07-14', status: 'pending' as const, ticketType: 'Standard' },
];

export const mockExternalUserAttendanceData = [
  { id: 1, eventName: 'Tech Workshop', attendanceDate: '2026-07-08', status: 'attended' as const, duration: '4 hours' },
  { id: 2, eventName: 'Networking Event', attendanceDate: '2026-06-15', status: 'attended' as const, duration: '3 hours' },
  { id: 3, eventName: 'Industry Summit', attendanceDate: '2026-05-20', status: 'attended' as const, duration: '5 hours' },
];

export const mockCertificateData = [
  { id: 1, eventName: 'Leadership Development Program', issueDate: '2026-06-30', certificateId: 'CERT-2026-001', status: 'downloaded' as const },
  { id: 2, eventName: 'Cloud Architecture Bootcamp', issueDate: '2026-05-15', certificateId: 'CERT-2026-002', status: 'available' as const },
  { id: 3, eventName: 'Digital Marketing Masterclass', issueDate: '2026-04-10', certificateId: 'CERT-2026-003', status: 'available' as const },
];

// Customer Support Mock Data
export const mockSupportTicketsData = [
  { id: 1, ticketId: 'TKT-001', subject: 'Cannot register for event', customer: 'john@email.com', date: '2026-07-15 10:30', status: 'open' as const, priority: 'high' as const },
  { id: 2, ticketId: 'TKT-002', subject: 'Payment processing issue', customer: 'sarah@email.com', date: '2026-07-15 09:15', status: 'in-progress' as const, priority: 'high' as const },
  { id: 3, ticketId: 'TKT-003', subject: 'Forgot password', customer: 'mike@email.com', date: '2026-07-14 14:20', status: 'resolved' as const, priority: 'low' as const },
  { id: 4, ticketId: 'TKT-004', subject: 'Event details unclear', customer: 'emma@email.com', date: '2026-07-14 11:00', status: 'open' as const, priority: 'medium' as const },
];

export const mockKnowledgeBaseData = [
  { id: 1, title: 'How to Register for an Event', category: 'Getting Started', views: 1250, helpfulRating: 4.8 },
  { id: 2, title: 'Event Registration Payment Options', category: 'Payments', views: 850, helpfulRating: 4.5 },
  { id: 3, title: 'Download Your Certificate', category: 'Certificates', views: 620, helpfulRating: 4.7 },
  { id: 4, title: 'Volunteer Opportunity Guide', category: 'Volunteering', views: 430, helpfulRating: 4.6 },
];

export const mockCustomerListData = [
  { id: 1, name: 'John Smith', email: 'john@email.com', registrations: 5, joinDate: '2025-01-15', status: 'active' as const },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', registrations: 8, joinDate: '2024-11-20', status: 'active' as const },
  { id: 3, name: 'Mike Davis', email: 'mike@email.com', registrations: 3, joinDate: '2026-02-10', status: 'active' as const },
  { id: 4, name: 'Emma Wilson', email: 'emma@email.com', registrations: 2, joinDate: '2026-05-01', status: 'inactive' as const },
];

export const mockTicketReportsData = [
  { id: 1, metric: 'Open Tickets', value: 12, sla: '24 hours', status: 'on-track' as const },
  { id: 2, metric: 'Avg Resolution Time', value: '6 hours', sla: '8 hours', status: 'on-track' as const },
  { id: 3, metric: 'Customer Satisfaction', value: '4.5/5', sla: '4.0/5', status: 'exceeding' as const },
  { id: 4, metric: 'First Response Time', value: '30 minutes', sla: '1 hour', status: 'exceeding' as const },
];
