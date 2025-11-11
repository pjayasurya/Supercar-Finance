# System Architecture

## Overview

Supercar Finance Platform is a serverless, microservices-based architecture deployed on Google Cloud Platform (GCP).

```
┌─────────────────────────────────────────────────────────────┐
│                        Users / Browsers                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Cloud Armor    │
                    │  (DDoS/WAF)      │
                    └──────────────────┘
                              │
                ┌─────────────┴──────────────┐
                ▼                            ▼
        ┌─────────────────────┐    ┌─────────────────────┐
        │   Cloud Run         │    │   Cloud Run         │
        │  (Next.js Frontend) │    │  (Node.js Backend)  │
        │   api.example.com   │    │ api-backend.example │
        └─────────────────────┘    └─────────────────────┘
                │                              │
                │                    ┌─────────┴────────┐
                │                    │                  │
                │                    ▼                  ▼
                │            ┌──────────────┐  ┌──────────────┐
                │            │  Cloud SQL   │  │    Secret    │
                │            │  PostgreSQL  │  │   Manager    │
                │            │   Database   │  │  (API Keys)  │
                │            └──────────────┘  └──────────────┘
                │                    │
                └────────────────────┴─────────────────────────┐
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
              ┌──────────────────┐      ┌──────────────────┐
              │ Cloud Functions  │      │ Firestore        │
              │ (Notifications)  │      │ (Caching)        │
              └──────────────────┘      └──────────────────┘
                        │
        ┌───────────────┴────────────────┐
        ▼                                ▼
    ┌────────────┐              ┌──────────────┐
    │   Twilio   │              │  SendGrid    │
    │   (SMS)    │              │  (Email)     │
    └────────────┘              └──────────────┘
```

## Components

### Frontend (Next.js on Cloud Run)
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Firebase Auth for authentication
- Deployed on Cloud Run with auto-scaling

### Backend (Node.js/Express on Cloud Run)
- Express.js REST API
- TypeScript for type safety
- PostgreSQL client for database queries
- JWT authentication
- Cloud-native logging and monitoring

### Database (Cloud SQL PostgreSQL)
- 14+ with SSL enabled
- Private IP inside VPC
- Automated backups
- Read replicas for scaling

### Authentication
- Firebase Auth for user sign-ups
- JWT tokens for API authentication
- Role-based access control (RBAC)

### Storage
- Cloud Storage for vehicle images
- Encrypted sensitive documents

### Monitoring
- Cloud Logging for application logs
- Cloud Monitoring for metrics
- Cloud Trace for distributed tracing
- Cloud Profiler for performance

### Security
- Secret Manager for credentials
- Cloud Armor for DDoS/WAF
- VPC Service Controls
- Identity-Aware Proxy (optional)

## Data Flow

1. **Application Submission**
   - User fills form on frontend
   - POST /api/credit/apply to backend
   - Soft-pull credit check (Experian/TransUnion)
   - Rules engine matches with lenders
   - Results cached in Firestore

2. **Pre-Approval Display**
   - Frontend GET /api/credit/pre-approvals/{appId}
   - Display matched lenders with offers
   - User selects lender
   - POST /api/applications/{appId}/export

3. **Vehicle Browsing**
   - GET /api/vehicles?maxPrice={approved_amount}
   - Filter by down payment slider
   - Calculate monthly payments
   - User selects vehicle

4. **Lender Connection**
   - Application exported to lender via API/email
   - Audit log recorded for compliance
   - User receives confirmation

## Deployment Pipeline

```
Git Push → Cloud Build → Docker Build → 
Push to GCR → Cloud Run Deploy → 
Smoke Tests → Go Live
```

Automated with:
- `cloudbuild.yaml` for CI/CD
- Environment-specific configurations
- Blue-green deployments for zero downtime

## Scaling Strategy

- **Frontend**: Auto-scales on CPU/memory
- **Backend**: Auto-scales on request count
- **Database**: Vertical scaling + read replicas
- **Storage**: Serverless with CDN caching

## Disaster Recovery

- Database: Daily automated backups, 30-day retention
- Firestore: Automatic geo-replication
- Cloud Run: Multi-region deployment capability
- RTO: < 1 hour, RPO: < 15 minutes

## Cost Optimization

- Cloud Run scales to zero when idle
- Cloud SQL: Committed use discounts
- Cloud Storage: Lifecycle policies
- Cloud Monitoring: Budget alerts

## Future Enhancements

- **Phase 2**: Dealer portal with inventory sync
- **Phase 3**: AI-powered lender matching
- **Phase 4**: White-label SaaS offering
- **Regional Expansion**: Multi-region deployment
