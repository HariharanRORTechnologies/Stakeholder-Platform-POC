# Frontend-Only Prototype Guide

## 🎯 Overview

This is a **fully functional frontend prototype** of the Stakeholder Platform built with React 18 + TypeScript + Redux Toolkit + Material-UI. It demonstrates 80%+ of the final UI/UX with realistic mock data, all without backend API integration.

**Features:**
- ✅ Role-based dashboards for 6 user roles
- ✅ Mock data in Redux with realistic JSON data sources
- ✅ 7+ fully navigable pages
- ✅ Professional Material-UI design system
- ✅ Charts and analytics with Recharts
- ✅ Role switching without authentication
- ✅ Responsive layout (mobile + desktop)
- ✅ Interactive forms and dialogs
- ✅ Toast notifications and feedback

## 📁 Project Structure

```
frontend/src/
├── components/               # Reusable UI components
│   ├── Layout.tsx            # Main app layout with sidebar
│   └── RoleSwitcher.tsx      # Role selection component
├── pages/                    # Feature pages
│   ├── Dashboard.tsx         # Role-based dashboards
│   ├── EventsPage.tsx        # Events list/grid view
│   ├── RegistrationsPage.tsx # Registration management
│   ├── FeedbackPage.tsx      # Feedback collection & display
│   ├── CertificatesPage.tsx  # Certificate management
│   ├── ReportsPage.tsx       # Analytics & reports
│   └── SettingsPage.tsx      # User settings
├── features/
│   └── mockData/
│       ├── store/            # Redux slices
│       │   ├── eventsSlice.ts
│       │   ├── registrationsSlice.ts
│       │   ├── notificationsSlice.ts
│       │   ├── feedbackSlice.ts
│       │   ├── certificatesSlice.ts
│       │   ├── analyticsSlice.ts
│       │   └── uiSlice.ts    # Current role, theme, etc.
├── data/                     # Mock JSON data
│   ├── mockEvents.json
│   ├── mockUsers.json
│   ├── mockRegistrations.json
│   ├── mockNotifications.json
│   ├── mockFeedback.json
│   ├── mockCertificates.json
│   └── mockAnalytics.json
├── store/
│   └── store.ts              # Redux store configuration
├── AppWithLayout.tsx         # Router setup
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Modern web browser

### Installation & Running

```bash
# Navigate to frontend directory
cd "d:\Stakeholder Platform\frontend"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

## 👥 User Roles & Features

### 1. **Admin** (Red badge)
- **Dashboard:** System overview, all statistics
- **Features:** Full access to all pages
- **Actions:** Create/edit/delete events, manage registrations, view all reports
- **Special:** Settings access, user management

### 2. **Manager** (Blue badge)
- **Dashboard:** Department overview, team metrics
- **Features:** Event management, registration approval, feedback review
- **Actions:** Publish events, approve registrations, view reports
- **Restrictions:** Cannot delete events

### 3. **Event Organizer** (Green badge)
- **Dashboard:** My events, registrations, attendance tracking
- **Features:** Create/edit events, view attendees, collect feedback
- **Actions:** Upload event details, track registrations
- **Restrictions:** Limited to own events

### 4. **Coordinator** (Orange badge)
- **Dashboard:** Operations overview, attendance stats
- **Features:** Check-in management, registrations, attendance tracking
- **Actions:** Mark attendance, manage check-ins
- **Restrictions:** Limited administrative access

### 5. **Stakeholder** (Purple badge)
- **Dashboard:** My events, certificates, registrations
- **Features:** View events, register, view certificates
- **Actions:** Submit feedback, download certificates, register for events
- **Restrictions:** Read-only view of events

### 6. **Volunteer** (Teal badge)
- **Dashboard:** Volunteer opportunities, certificates
- **Features:** View volunteer events, my certificates
- **Actions:** Register for volunteer work, download certificates
- **Restrictions:** Limited to volunteer events only

## 🔄 Role Switching

**Step 1:** Open the app
**Step 2:** Look for the "Current Role" selector in the sidebar (left side, top area)
**Step 3:** Click dropdown and select different role
**Step 4:** Page updates automatically to show role-specific content
**Step 5:** Navigation menu adjusts to show only accessible pages

All role switching is **instant** with no login required. Perfect for demos and stakeholder presentations!

## 📄 Pages & Functionality

### Dashboard
- **Analytics cards:** Key metrics (events, registrations, attendance rate, ratings)
- **Monthly trends chart:** Line graph showing activity over time
- **Budget overview:** Visual progress bar of budget utilization
- **Recent events table:** Quick view of latest events with stats
- **Role-specific content:** Different cards/data for each role

### Events
- **Two view modes:** Grid view (cards) and List view (table)
- **Search:** Find events by title or description
- **Filters:** Filter by event type (Conference, Workshop, Seminar, etc.)
- **Event cards:** Show image, description, registrations, rating
- **Details dialog:** Click "View Details" for full event information
- **Actions:** Edit/delete (for organizers), view for all roles

### Registrations
- **Search & filter:** Find attendees, filter by registration status
- **Statistics:** Cards showing total, confirmed, checked-in registrations
- **Manage registration:** Edit status, mark as checked in
- **Cancel registration:** Remove attendees (admin/manager only)
- **Export:** Download registration list (CSV functionality mocked)

### Feedback
- **Submit feedback:** Form to rate and comment on events
- **View feedback:** See all feedback from attendees
- **Star ratings:** Visual star rating display (1-5 stars)
- **Statistics:** Average rating and total responses
- **Delete feedback:** Remove inappropriate feedback (admin/manager)
- **Anonymous option:** Post feedback anonymously

### Certificates
- **Certificate cards:** Display issued certificates
- **Preview dialog:** See certificate before download
- **Download:** Mark as downloaded (tracks status)
- **Verification code:** Each certificate has unique verification code
- **Status tracking:** Shows pending/downloaded status

### Reports
- **Multiple report types:** Overview, Attendance, Feedback Analysis, Financial
- **Interactive charts:** Pie charts, bar charts, line graphs
- **KPI cards:** Key performance indicators at a glance
- **Export functionality:** Download report as PDF/Excel (mocked)
- **Detailed tables:** Monthly trends, rating distribution

### Settings
- **Appearance:** Toggle dark/light mode (framework in place)
- **Notifications:** Email and push notification toggles
- **Account settings:** Edit profile information
- **About section:** App version and mode info

## 📊 Mock Data Details

### Events (5 events total)
- Annual Stakeholder Summit (500 capacity, published)
- Q3 Community Workshop (80 capacity, published)
- CSR Leadership Initiative (25 capacity, published)
- Volunteer Appreciation Gala (200 capacity, published)
- Digital Transformation Symposium (300 capacity, draft)

### Users (6 users)
- Admin, Manager, Organizer, Coordinator, Stakeholder, Volunteer
- Each with realistic avatars and profiles

### Registrations (7 registrations)
- Mix of confirmed, checked-in, and attended statuses
- Real dates reflecting event timelines

### Feedback (5 feedback items)
- Ratings from 4-5 stars
- Realistic comments from attendees

### Certificates (5 certificates)
- Status: pending or downloaded
- Linked to events and users

### Analytics
- 8 months of trend data
- Event type distribution
- Rating distribution (1-5 stars)
- Budget overview with utilization metrics

## 🎨 Design System

### Colors
- **Primary:** #667eea (Purple-blue)
- **Secondary:** #764ba2 (Purple)
- **Success:** #43e97b (Green)
- **Error:** #fa709a (Pink)
- **Warning:** #f093fb (Magenta)
- **Info:** #4facfe (Blue)

### Components Used
- **Material-UI v5** for all UI components
- **Recharts** for charts and graphs
- **React Router v6** for navigation
- **Redux Toolkit** for state management
- **React Icons** for consistent icons

### Responsive Breakpoints
- **xs:** Mobile (< 600px)
- **sm:** Tablet (600px - 960px)
- **md:** Desktop (960px - 1280px)
- **lg:** Large desktop (1280px+)

## 🎯 Key Features Demonstrated

✅ **Authentication-Free Role Switching**
Users can instantly switch between 6 different roles to see how the app changes

✅ **Realistic Mock Data**
All data in `/src/data/*.json` reflects real-world scenarios (event names, dates, stats)

✅ **Interactive Forms**
- Submit feedback
- Edit registrations
- Create events (dialog setup)
- Settings adjustments

✅ **Data Visualization**
- Monthly trends (line chart)
- Event type distribution (pie chart)
- Rating distribution (bar chart)
- Budget progress (linear progress bar)

✅ **Tables with Actions**
- Sortable columns (ready for sorting logic)
- Inline actions (Edit, Delete, View)
- Status indicators (Chips with colors)

✅ **Search & Filtering**
- Search by keyword
- Filter by status/type
- Multiple filter criteria

✅ **Responsive Design**
- Mobile-friendly sidebar (collapse on small screens)
- Adaptive grid layouts
- Touch-friendly buttons and spacing

✅ **Status Persistence**
- Redux state manages all data
- Role selection persists during session
- Notifications and updates simulate real behavior

## 🔮 Future Enhancements

The following can be easily added:
1. **Backend API Integration** - Replace mock data with real API calls
2. **Authentication** - Add login page and JWT tokens
3. **Real-time Updates** - WebSocket connections for live notifications
4. **Export Functionality** - Actually generate PDF/CSV files
5. **Advanced Filtering** - Date ranges, multi-select filters
6. **Dark Mode** - Complete dark theme implementation
7. **Accessibility** - ARIA labels, keyboard navigation
8. **Performance** - Code splitting, lazy loading
9. **Unit Tests** - Jest + React Testing Library
10. **E2E Tests** - Cypress or Playwright

## 💡 Developer Notes

### Adding New Pages
1. Create component in `/src/pages/PageName.tsx`
2. Import in `AppWithLayout.tsx`
3. Add route in `<Routes>`
4. Add menu item in `Layout.tsx`
5. Specify roles that can access it

### Adding New Mock Data
1. Create JSON file in `/src/data/mockX.json`
2. Create Redux slice in `/src/features/mockData/store/`
3. Add to store configuration in `/src/store/store.ts`
4. Use in components via `useSelector()`

### Customizing UI
- Edit colors in `main.tsx` theme configuration
- Modify component spacing in Material-UI `sx` props
- Change responsive breakpoints via `Grid` and `Stack` props

## 📝 Testing Checklist

- [ ] Switch between all 6 roles in role selector
- [ ] Click through all navigation items for each role
- [ ] Verify role-appropriate menu items appear
- [ ] Test search on Events and Registrations pages
- [ ] Try filters on multiple pages
- [ ] Submit feedback form
- [ ] Download/View certificates
- [ ] Switch view modes (Grid/List on Events)
- [ ] Verify responsive layout on mobile (press F12, toggle device)
- [ ] Test dialogs (Event details, Edit registration)

## 🔗 Technology Stack

- **Framework:** React 18
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI v5
- **Charts:** Recharts
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Package Manager:** npm

## 📞 Support

For questions or issues:
1. Check the navigation in Layout.tsx for available pages
2. Verify mock data in /data folder for data structure
3. Review Redux slices for state management logic
4. Check Material-UI documentation for component props

## 🎉 Showcase Ready!

This prototype is **production-ready for demonstrations** and can be deployed as-is for:
- Stakeholder presentations
- User feedback sessions
- Design reviews
- Feature validations
- Client walkthroughs

Simply run `npm run build` to create optimized production build.

---

**Version:** 1.0.0  
**Created:** 2026-07-15  
**Status:** Frontend Prototype Complete ✅
