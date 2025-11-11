# Business Requirements Document (BRD)
## Supercar Finance Platform

### Executive Summary

The goal is to build a platform that lets users complete one soft-pull credit application, instantly see pre-approvals from multiple lenders, and browse supercars filtered by their approved amount. The system will automate exotic car financing from pre-qualification to lender connection with real-time results, creating a Credit Karma-style experience for luxury auto loans.

### Core Objectives

1. Build a soft-pull, multi-lender comparison engine
2. Integrate exotic and high-end lenders (loan range $80K–$500K)
3. Allow users to apply once, see instant pre-approvals, and pick their lender or car
4. Provide lenders and dealers with high-quality, ready-to-fund leads

### User Stories

#### End-User (Customer)
- Fill out one quick app and instantly see lender options
- View approval amounts, rates, and terms in real time
- Browse available cars based on pre-approval
- Avoid credit damage (soft pull only)
- Experience a fast, clean, trustworthy interface

#### Lender
- Receive verified pre-qualified leads
- Get loan apps directly into their CRM or via secure API/email
- Filter applicants automatically by underwriting rules

#### Dealer
- Have inventory displayed to only qualified buyers
- Get notified when a buyer selects one of their cars

### Functional Requirements

- Soft-pull credit API integration (Experian Connect, TransUnion, or Equifax)
- Must show FICO Auto Score 8 and key factors
- Rules engine that matches applicant data with each lender's criteria
- Pre-approval result page showing lenders, limits, and terms
- Vehicle filter system updated by approved loan amount and down payment slider
- Lender export system for sending user info via API, webhook, or secure email
- Admin dashboard for internal management
- Logging system recording every action for compliance

### Technical Architecture (GCP Stack)

- **Frontend**: Next.js 14+ hosted on Cloud Run
- **Backend API**: Node.js/Express hosted on Cloud Run
- **Database**: Cloud SQL using PostgreSQL
- **File Storage**: Google Cloud Storage
- **Authentication**: Firebase Auth for user sign-ins and OAuth2
- **Secrets Management**: Secret Manager for API keys and credentials
- **Credit Bureau Integration**: Experian or TransUnion soft-pull API
- **Dealer Inventory Integration**: Manual CSV upload or live API sync
- **Notifications**: Twilio or SendGrid through Cloud Functions
- **Monitoring**: Cloud Logging and Cloud Monitoring
- **CI/CD Pipeline**: Cloud Build and Cloud Deploy

### Security and Compliance

- Encrypt all data at rest (AES-256) and in transit (TLS 1.2+)
- Maintain FCRA compliance for credit handling and disclosures
- Implement logging and access control for SOC2 and GDPR readiness
- Keep all data within US regions (us-central1 or us-east1)
- Use strict role-based access for admins, lenders, and dealers

### Non-Functional Requirements

- Response time under 2 seconds per API call
- System uptime target of 99.9%
- Serverless scaling via Cloud Run for cost efficiency
- Data retention for 24 months, manual deletion on request
- Analytics tracking for funnel conversion and lender performance

### Project Phases

**Phase 1 – MVP (60 days)**
- Basic front-end, soft-pull integration, and three lender connections

**Phase 2 – Dealer Portal (30 days)**
- Add vehicle filtering, inventory sync, and CRM integration

**Phase 3 – Automation & AI (60 days)**
- Add auto-matching of lenders using behavioral and credit pattern data

**Phase 4 – Scale & Monetize (Ongoing)**
- Introduce premium lender placements, lead bidding, and white-label licensing

### KPIs (Key Metrics)

- Under 60 seconds from application to pre-approval
- 40% or higher approval rate
- 90% lender retention rate
- $150–$500 average revenue per approved user
- 100 daily applications goal in first 90 days

### Team Roles

- **Frontend Developer**: Build Next.js interface and UX
- **Backend Developer**: Manage API logic, credit integrations, and data flow
- **DevOps Engineer**: Set up and maintain GCP environment
- **Compliance Officer**: Ensure FCRA and SOC2 standards
- **BizDev**: Onboard lenders and dealers
- **Founder/PM**: Oversee product direction, funding, and testing

### Success Criteria

- MVP deployed and tested by Day 60
- 3+ active lenders by Day 90
- 100+ daily applications by Day 90
- Zero compliance violations
- 99.9% system uptime
- Sub-2 second API response times
