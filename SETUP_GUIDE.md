# Stakeholder Platform - Setup Guide

Complete step-by-step guide to get the enterprise platform running locally.

## Step 1: Prerequisites Check

Verify you have the required software:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check MySQL is running
mysql --version
```

**Install if missing:**
- Node.js: https://nodejs.org/en/ (LTS version)
- MySQL: https://dev.mysql.com/downloads/mysql/

## Step 2: Database Setup

### Option A: Using MySQL Command Line

```bash
# 1. Start MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE stakeholder_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Use the database
USE stakeholder_platform;

# 4. Import schema
SOURCE "D:\Stakeholder Platform\backend\src\database\schema.sql";

# 5. Verify tables were created
SHOW TABLES;

# Should display:
# +---------------------------+
# | Tables_in_stakeholder_platform |
# +---------------------------+
# | audit_logs                |
# | attendance                |
# | certificates              |
# | events                    |
# | feedback                  |
# | notifications             |
# | permissions               |
# | registrations             |
# | reports                   |
# | role_permissions          |
# | roles                     |
# | user_roles                |
# | users                     |
# +---------------------------+

# 6. Exit MySQL
EXIT;
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to File → Open SQL Script
4. Select: `D:\Stakeholder Platform\backend\src\database\schema.sql`
5. Execute the script

## Step 3: Environment Configuration

### Backend Configuration

```bash
# Navigate to backend
cd "D:\Stakeholder Platform\backend"

# Copy environment template
copy .env.example .env

# Edit .env file with your settings
```

**Key settings to configure in `backend/.env`:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stakeholder_platform

# Server
PORT=3000
NODE_ENV=development

# JWT (Generate secure secrets)
JWT_SECRET=your-super-secret-key-min-32-chars-long
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars-long

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**Generate secure JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Configuration (Optional)

```bash
cd "D:\Stakeholder Platform\frontend"
copy .env.example .env
```

Default frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Step 4: Install Dependencies

### Install All at Once

```bash
cd "D:\Stakeholder Platform"
npm run install:all
```

### Or Install Separately

```bash
# Backend dependencies
cd "D:\Stakeholder Platform\backend"
npm install

# Frontend dependencies
cd "D:\Stakeholder Platform\frontend"
npm install
```

**Expected duration:** 5-10 minutes (first time)

## Step 5: Seed Initial Data (Optional)

Create default admin user and permissions:

```bash
cd "D:\Stakeholder Platform\backend"

# This will seed:
# - Default admin user (admin@example.com / password123)
# - 10 role levels (Admin, Manager, Organizer, etc.)
# - 20+ permissions (users.create, events.read, etc.)
npm run db:seed
```

## Step 6: Start Development Servers

### Option A: Run Both Simultaneously

```bash
cd "D:\Stakeholder Platform"
npm run dev
```

This starts:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### Option B: Run in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd "D:\Stakeholder Platform"
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
cd "D:\Stakeholder Platform"
npm run dev:frontend
```

### Expected Output:

**Backend:**
```
  ✔ Server running on http://localhost:3000
  ✔ Database connected
  ✔ Routes loaded
  ✔ Middleware initialized
```

**Frontend:**
```
  VITE v5.0.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 7: Verify Installation

### Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2026-07-14T14:30:00Z",
#   "uptime": 15.234
# }
```

### Test Frontend Access

Open browser and navigate to: **http://localhost:5173**

You should see the login page.

### Test Login

Use the default credentials (if seeded):
- **Email:** admin@example.com
- **Password:** password123

## Step 8: Project Structure Verification

Verify key files exist:

```
✓ D:\Stakeholder Platform\package.json
✓ D:\Stakeholder Platform\backend\package.json
✓ D:\Stakeholder Platform\backend\src\app.ts
✓ D:\Stakeholder Platform\backend\src\server.ts
✓ D:\Stakeholder Platform\backend\src\database\schema.sql
✓ D:\Stakeholder Platform\frontend\package.json
✓ D:\Stakeholder Platform\frontend\src\main.tsx
✓ D:\Stakeholder Platform\frontend\src\App.tsx
```

## Troubleshooting

### npm install fails

**Problem:** `npm ERR! code ENOENT`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

### MySQL Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
```bash
# Ensure MySQL is running
# On Windows:
# 1. Open Services (services.msc)
# 2. Find "MySQL80" (or similar)
# 3. Ensure it's running
# 4. Right-click → Start if needed

# Or restart MySQL:
net stop MySQL80
net start MySQL80
```

### Database Already Exists

**Problem:** `Error: ER_DB_CREATE_EXISTS`

**Solution:**
```bash
# Drop existing database
mysql -u root -p -e "DROP DATABASE stakeholder_platform;"

# Create fresh
mysql -u root -p < "backend/src/database/schema.sql"
```

### Port Already in Use

**Problem:** `Error: EADDRINUSE: address already in use :::3000`

**Solution:**

Option 1: Kill process using port
```bash
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

Option 2: Change port in `backend/.env`
```env
PORT=3001
```

### Frontend Can't Connect to Backend

**Problem:** CORS error in browser console

**Solution:**
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check `backend/.env` CORS_ORIGIN includes frontend URL
3. Restart backend after CORS changes

## Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `backend/src/`
   - Dev server automatically reloads (tsx watch)
   - Test with API client (Postman, Insomnia, curl)

2. **Frontend Changes:**
   - Edit files in `frontend/src/`
   - Dev server automatically reloads (Vite)
   - Changes appear immediately in browser

### File Structure for Development

```
Work on features by folder:

Backend:
- backend/src/models/           → Add data models
- backend/src/repositories/     → Add data access
- backend/src/services/         → Add business logic
- backend/src/controllers/      → Add HTTP handlers
- backend/src/api/v1/routes/   → Add routes

Frontend:
- frontend/src/features/        → Add feature modules
- frontend/src/store/           → Redux store
- frontend/src/components/      → Shared components
- frontend/src/pages/           → Page components
```

## Common Commands

```bash
# Development
npm run dev              # Start both servers
npm run dev:backend     # Start backend only
npm run dev:frontend    # Start frontend only

# Building
npm run build           # Build both
npm run build:backend   # Build backend only
npm run build:frontend  # Build frontend only

# Testing
npm run test            # Run all tests
npm run test:backend    # Backend tests
npm run test:frontend   # Frontend tests

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed data

# Linting
npm run lint            # Lint all code
```

## IDE Setup

### VS Code Recommended Extensions

```
- ES7+ React/Redux/React-Native snippets
- Thunder Client (API testing)
- MySQL
- Prettier - Code formatter
- ESLint
- TypeScript Vue Plugin
```

### Useful VS Code Settings

In `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Next Steps After Setup

1. ✅ **Verify Installation** - Run health checks
2. 📖 **Review Documentation** - Read README.md
3. 🔍 **Explore API** - Test endpoints with Postman
4. 🎨 **Customize UI** - Update Material-UI theme
5. 🗄️ **Seed Data** - Create test events, users
6. ✍️ **Add Features** - Start development
7. 🧪 **Write Tests** - Add test coverage
8. 🚀 **Deploy** - Prepare for production

## Getting Help

1. **Check logs:**
   ```bash
   # Backend logs
   cat backend/logs/app.log
   
   # Browser console (Frontend)
   F12 → Console tab
   ```

2. **Debug mode:**
   ```bash
   # Enable debug logging in backend/.env
   LOG_LEVEL=debug
   
   # Restart server
   npm run dev:backend
   ```

3. **API Documentation:**
   - See API Endpoints section in README.md
   - Test with Postman/Insomnia
   - Check src/api/v1/routes/ for endpoint definitions

## Performance Tips

1. **Use Redux DevTools:** Install browser extension for state debugging
2. **Enable Code Splitting:** Frontend Vite already handles this
3. **Database Indexes:** Schema includes performance indexes
4. **Caching:** Consider adding Redis for session/cache

## Security Notes

⚠️ **For Development Only!**

- Never use default passwords in production
- Change JWT secrets before deploying
- Use strong database passwords
- Enable HTTPS in production
- Configure proper CORS origins
- Set NODE_ENV=production for production

---

**Happy developing! 🚀**

For issues or questions, refer to README.md or check the documentation in each module.
