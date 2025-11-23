# Development Environment Setup

## Running the Application

### Start Both Services (Recommended)

From the project root, run:

```bash
npm run dev
```

This starts both frontend and backend concurrently with hot-reload:
- **Frontend**: http://localhost:3000 (Next.js dev server with fast refresh)
- **Backend**: http://localhost:3001 (Node + ts-node with experimental ESM support)

The script uses `cross-env` to ensure PORT environment variables are set correctly on all platforms (macOS, Linux, Windows).

### Start Services Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev --prefix frontend
```
Runs on: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# or
PORT=3001 npm run dev
```
Runs on: http://localhost:3001

### Verify Services are Running

Health checks:
```bash
# Backend health
curl http://localhost:3001/health

# Frontend (should return HTML)
curl http://localhost:3000/
```

Expected responses:
- Backend: `{"status":"ok","timestamp":"..."}`
- Frontend: `<!DOCTYPE html>...`

### Troubleshooting: Port Already in Use

If you see "address already in use" errors:

**macOS/Linux:**
```bash
# Kill processes on ports 3000 and 3001
lsof -i :3000 | awk 'NR>1 {print $2}' | xargs kill -9 || true
lsof -i :3001 | awk 'NR>1 {print $2}' | xargs kill -9 || true

# Then restart
npm run dev
```

**Windows (PowerShell):**
```powershell
# Kill processes on ports 3000 and 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000,3001).OwningProcess | Stop-Process -Force -ErrorAction SilentlyContinue

# Then restart
npm run dev
```

---

## Quick Start

### Prerequisites

- Node.js 18.x LTS
- PostgreSQL 14+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/supercar-finance.git
cd supercar-finance
```

### 2. Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 3. Set Up Environment Variables

#### Frontend (.env.local)

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

#### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=supercar_finance
JWT_SECRET=dev-secret-key-change-in-production
CREDIT_API_KEY=your_credit_api_key
CREDIT_PROVIDER=experian
FIREBASE_PROJECT_ID=your-project-id
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Database Setup

#### Start PostgreSQL

**Option A: Using Docker**
```bash
docker run --name supercar-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=supercar_finance \
  -p 5432:5432 \
  -d postgres:14
```

**Option B: Using Local PostgreSQL**
```bash
createdb supercar_finance
```

#### Run Migrations

```bash
npm run migrate
```

This will:
- Create all tables (users, applications, pre_approvals, vehicles, lenders, audit_logs)
- Set up indexes for performance
- Initialize with test lender data

### 5. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or run separately in different terminals:
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

**Frontend**: http://localhost:3000
**Backend**: http://localhost:3001

### 6. Access the Application

1. Open http://localhost:3000 in your browser
2. Click "Start Application"
3. Fill out the form (use test data below)
4. See pre-approval results instantly

#### Test Data

```
First Name: John
Last Name: Doe
Email: john@example.com
Phone: 5551234567
SSN: 123456789
DOB: 01/15/1990
Address: 123 Main St
City: Los Angeles
State: CA
ZIP: 90001
Annual Income: 150000
Employment: Employed
Down Payment: 50000
Loan Amount: 200000
Loan Term: 60 months
```

## Development Workflow

### Running Linter & Type Check

```bash
npm run lint
npm run typecheck
```

### Running Tests

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test
```

### Database Migrations

```bash
# Create migration
npm run db:create-migration -- "migration_name"

# Run pending migrations
npm run migrate

# Rollback last migration
npm run db:rollback
```

### Code Formatting

```bash
npm run format
```

## Docker Development

```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Debugging

### Frontend (Next.js)

- Browser DevTools: http://localhost:3000 (React Dev Tools)
- VS Code: Debugger for Chrome extension

### Backend (Node.js)

```bash
# Enable debug logs
DEBUG=* npm run dev

# VS Code debugger
# Add to launch.json and press F5
```

### Database

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost -d supercar_finance

# View tables
\dt

# View schema
\d applications
```

## Common Issues

### Database Connection Refused

```bash
# Check PostgreSQL is running
psql -U postgres -h localhost

# Check env variables
cat backend/.env
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Node Modules Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `supercar_finance` |
| `JWT_SECRET` | JWT signing secret | `dev-secret-key` |
| `CREDIT_API_KEY` | Credit bureau API key | `xxx` |
| `NODE_ENV` | Environment | `development` |

## Next Steps

1. Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
2. Check [API.md](./docs/API.md) for API endpoints
3. Review [DATABASE.md](./database/README.md) for schema details
4. Explore test data in backend fixtures

## Support

For issues or questions:
1. Check GitHub Issues
2. Review error logs in console
3. Enable debug mode with `DEBUG=*`
4. Contact the development team

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [GCP Docs](https://cloud.google.com/docs)
