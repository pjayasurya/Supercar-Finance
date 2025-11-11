# Supercar Finance Platform

A Credit Karma-style exotic car financing platform built on Google Cloud Platform (GCP). One soft-pull credit application, instant multi-lender pre-approvals, and vehicle browsing based on approval amounts.

## Project Structure

```
supercar-finance/
├── frontend/              # Next.js customer portal
├── backend/               # Node.js/Express API
├── database/              # PostgreSQL schemas & migrations
├── admin/                 # Admin dashboard (Next.js)
├── infrastructure/        # GCP Cloud Build, Cloud Run configs
├── docs/                  # BRD, architecture diagrams, API specs
└── README.md
```

## Tech Stack

- **Frontend**: Next.js 14+, React, TailwindCSS, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Cloud SQL)
- **Auth**: Firebase Auth + JWT
- **Hosting**: Google Cloud Run (serverless)
- **Storage**: Google Cloud Storage
- **Secrets**: Google Secret Manager
- **CI/CD**: Cloud Build

## Quick Start

### Prerequisites
- Node.js 18+
- Docker
- GCP Project with billing enabled
- Soft-pull credit API account (Experian, TransUnion, or Equifax)

### Development Setup

```bash
# Install dependencies
npm install

# Run frontend (port 3000)
cd frontend && npm run dev

# Run backend (port 3001) in another terminal
cd backend && npm run dev

# Run database migrations
cd database && npm run migrate
```

## Phase 1 MVP (First 60 Days)

- ✅ Customer application form (soft-pull)
- ✅ Pre-approval results page (3+ lenders)
- ✅ Basic vehicle filtering
- ✅ Lender lead export (API/email)
- ✅ Authentication & user management
- ✅ Compliance logging

## Features

- **Soft-Pull Credit Integration**: Real-time FICO Auto Score 8 and credit factors
- **Rules Engine**: Automatic lender matching based on applicant profile
- **Multi-Lender Comparison**: Show approval amounts, rates, and terms side-by-side
- **Vehicle Filtering**: Browse cars based on pre-approved loan amount
- **Lender Portal**: Receive verified leads in real-time
- **Admin Dashboard**: Manage users, lenders, dealers, and compliance
- **Audit Logging**: Full compliance trail for FCRA and SOC2

## Deployment

See [infrastructure/README.md](./infrastructure/README.md) for GCP deployment instructions.

## Security & Compliance

- FCRA-compliant credit handling
- AES-256 encryption at rest
- TLS 1.2+ in transit
- SOC2 & GDPR ready
- Role-based access control

## KPIs

- Application to pre-approval: < 60 seconds
- Approval rate: 40%+
- Lender retention: 90%+
- Target: 100 daily applications (90 days)

## Documentation

- `docs/BRD.md` - Business Requirements Document
- `docs/API.md` - Backend API specification
- `docs/DATABASE.md` - Schema and ER diagram
- `docs/ARCHITECTURE.md` - System design and GCP stack

## Team

- Frontend Developer - Next.js interface
- Backend Developer - API logic & integrations
- DevOps Engineer - GCP infrastructure
- Compliance Officer - FCRA & SOC2
- BizDev - Lender/Dealer onboarding
- PM/Founder - Product direction

## License

Proprietary - Supercar Finance Platform
