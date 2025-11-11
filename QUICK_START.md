# Supercar Finance - Quick Reference Guide

## Getting Started in 10 Minutes

### 1. Install & Setup (2 min)
```bash
git clone <repo> && cd supercar-finance
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Start Database (1 min)
```bash
docker run -d --name supercar-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=supercar_finance -p 5432:5432 postgres:14
npm run migrate
```

### 3. Run Servers (2 min)
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### 4. Test Application (5 min)
- Go to http://localhost:3000
- Click "Start Application"
- Fill form (any valid data)
- See instant pre-approvals

---

## Common Commands

```bash
# Development
npm run dev                 # Start frontend + backend
npm run lint               # Check code quality
npm run format             # Auto-format code

# Database
npm run migrate            # Run migrations
npm run db:seed           # Load test data

# Build & Deploy
npm run build             # Build both
npm run start             # Start production

# Docker
docker-compose up         # Start with Docker
docker-compose down       # Stop all services
```

---

## Project Layout

| Path | Purpose |
|------|---------|
| `frontend/src/app` | Next.js pages |
| `frontend/src/components` | React components |
| `frontend/src/lib/api.ts` | API client |
| `backend/src/routes` | Express endpoints |
| `backend/src/services` | Business logic |
| `backend/src/db/migrate.ts` | Database schema |
| `docs/API.md` | API documentation |
| `DEVELOPMENT.md` | Full setup guide |
| `DEPLOYMENT.md` | GCP deployment |

---

## Key Files to Know

### Frontend
- `frontend/src/app/page.tsx` - Homepage
- `frontend/src/app/apply/page.tsx` - Application form
- `frontend/src/app/pre-approvals/page.tsx` - Results page
- `frontend/src/components/CreditApplicationForm.tsx` - Form logic
- `frontend/src/store/application.ts` - State management

### Backend
- `backend/src/server.ts` - Express app setup
- `backend/src/routes/creditRoutes.ts` - Credit API endpoints
- `backend/src/services/creditService.ts` - Soft-pull logic
- `backend/src/services/lenderService.ts` - Rules engine
- `backend/src/db/migrate.ts` - Database schema

---

## User Flow

```
1. User lands on homepage (/)
   ↓
2. Clicks "Start Application" → /apply
   ↓
3. Fills 16-field form
   ↓
4. Backend: POST /api/credit/apply
   - Soft-pull credit check
   - Rules engine matching
   - Generate pre-approvals
   ↓
5. Frontend: Redirect to /pre-approvals
   ↓
6. User sees 3+ lender offers
   ↓
7. User selects lender
   ↓
8. Backend: POST /api/applications/{id}/export
   ↓
9. Frontend: Redirect to /vehicles
   ↓
10. Browse vehicles filtered by approved amount
   ↓
11. Select vehicle → Lender connection
```

---

## API Endpoints Cheat Sheet

### Credit Application
```
POST /api/credit/apply
Request: { firstName, lastName, email, phone, ssn, dob, address, city, state, zipCode, annualIncome, employmentStatus, downPayment, desiredLoanAmount, loanTerm }
Response: { id, status, ficoScore, creditFactors, preApprovalsCount }

GET /api/credit/pre-approvals/{applicationId}
Response: { approvals: [{ lenderId, lenderName, maxLoanAmount, interestRate, monthlyPayment, terms }] }

GET /api/credit/analysis/{applicationId}
Response: { ficoScore, factors: [...] }
```

### Vehicles
```
GET /api/vehicles?maxPrice=250000&sort=price_desc
Response: [{ id, make, model, year, color, price, imageUrl, ... }]

GET /api/vehicles/{vehicleId}
Response: { id, make, model, year, color, mileage, price, description, ... }
```

### Applications
```
POST /api/applications
POST /api/applications/{appId}/export
GET /api/applications/{appId}
PUT /api/applications/{appId}
```

---

## Database Tables

```sql
users (id, email, firebase_uid, phone)
applications (id, user_id, status, first_name, last_name, email, fico_score, ...)
pre_approvals (id, application_id, lender_id, max_loan_amount, interest_rate, ...)
vehicles (id, dealer_id, make, model, year, price, ...)
lenders (id, name, min_loan, max_loan, min_apr, max_apr, supported_states)
audit_logs (id, user_id, application_id, action, details, created_at)
```

---

## Environment Variables Quick Setup

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=supercar_finance
JWT_SECRET=dev-secret-key
CREDIT_API_KEY=your_api_key
CREDIT_PROVIDER=experian
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

---

## Testing Checklist

- [ ] Application form validation works
- [ ] Credit check returns FICO score
- [ ] Pre-approvals display (3+ lenders)
- [ ] Vehicle filtering by approved amount
- [ ] Lender export functionality
- [ ] Admin dashboard loads
- [ ] Database migrations run clean
- [ ] API endpoints respond < 2 seconds

---

## Deployment Checklist

- [ ] Environment variables set in GCP Secret Manager
- [ ] Cloud SQL instance created and databases migrated
- [ ] Docker images built and pushed to GCR
- [ ] Cloud Run services deployed
- [ ] Cloud Build CI/CD pipeline configured
- [ ] Monitoring and logging enabled
- [ ] SSL certificates configured
- [ ] Backup policies set

---

## Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (API testing)
- PostgreSQL
- Firebase
- Google Cloud Code

---

## Debug Tips

### Frontend not connecting to backend?
```bash
# Check NEXT_PUBLIC_BACKEND_URL in .env.local
# Ensure backend is running on port 3001
curl http://localhost:3001/health
```

### Database connection error?
```bash
# Check PostgreSQL is running
psql -U postgres -h localhost -d supercar_finance

# Check backend .env
cat backend/.env | grep DB_
```

### Credit API failing?
```bash
# Check CREDIT_API_KEY is set
echo $CREDIT_API_KEY

# Enable debug logs
DEBUG=* npm run dev
```

---

## Performance Tips

- Frontend images are optimized (AVIF/WebP)
- API responses cached where possible
- Database queries use indexes
- Cloud Run scales to zero when idle
- Tailwind CSS is purged in production

---

## Security Checklist

- ✅ SSN encrypted at rest
- ✅ HTTPS/TLS in transit
- ✅ FCRA compliance maintained
- ✅ Audit logging for all actions
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Environment secrets in Secret Manager
- ✅ No PII in logs

---

## Support Matrix

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:3000 \| xargs kill -9` |
| Node modules broken | `rm -rf node_modules && npm install` |
| DB not connecting | Check `.env` and `psql` cli |
| Build errors | Run `npm run typecheck` |
| Slow API | Check database indexes |

---

## Phase Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| MVP | 60 days | Soft-pull + 3 lenders |
| Dealer | 30 days | Vehicle sync + portal |
| AI | 60 days | Smart lender matching |
| Scale | Ongoing | Monetization |

---

## Cost Breakdown

| Service | Cost/Month |
|---------|-----------|
| Cloud Run | $150 |
| Cloud SQL | $200 |
| Cloud Storage | $20 |
| Monitoring | $30 |
| **Total** | **~$400** |

---

## Next Steps

1. ✅ **Development**: Follow `DEVELOPMENT.md` for local setup
2. ✅ **Learning**: Read `docs/API.md` for endpoints
3. ✅ **Code**: Review `frontend/src/components` and `backend/src/services`
4. ✅ **Deploy**: Follow `DEPLOYMENT.md` for GCP
5. ✅ **Integrate**: Add real credit bureau API
6. ✅ **Scale**: Add more lenders and vehicle inventory

---

**Questions? Check the full docs or ask your team lead!** 🚀
