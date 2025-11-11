# Database Schema Documentation

## Tables

### Users
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email
- `firebase_uid` (VARCHAR) - Firebase authentication ID
- `phone` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Applications
- `id` (UUID) - Primary key
- `user_id` (UUID) - Reference to users
- `status` (VARCHAR) - pending, approved, declined, connected
- `first_name`, `last_name` - Applicant info
- `email`, `phone` - Contact info
- `ssn_encrypted` - Encrypted SSN
- `dob` - Date of birth
- `address`, `city`, `state`, `zip_code` - Address
- `annual_income` - Gross annual income
- `employment_status` - employed, self-employed, retired
- `down_payment`, `desired_loan_amount` - Financial info
- `loan_term` - Loan duration in months
- `fico_score` - Credit score from soft pull
- `credit_factors` (JSONB) - Credit profile factors

### PreApprovals
- `id` (UUID) - Primary key
- `application_id` (UUID) - Reference to applications
- `lender_id`, `lender_name` - Lender info
- `max_loan_amount` - Pre-approved amount
- `interest_rate` - APR
- `monthly_payment` - Estimated payment
- `terms` - Loan term in months
- `approved` (BOOLEAN) - Approval status
- `reason` - Decline reason if applicable

### Vehicles
- `id` (UUID) - Primary key
- `dealer_id` (UUID) - Reference to dealer
- `make`, `model`, `year` - Vehicle info
- `color`, `mileage`
- `price` - Listed price
- `description`, `image_url`
- `status` - available, sold, pending

### Lenders
- `id` (VARCHAR) - Primary key
- `name` - Lender name
- `min_loan`, `max_loan` - Loan range
- `min_apr`, `max_apr` - Interest rate range
- `supported_states` (TEXT[]) - Servicing states
- `api_endpoint`, `webhook_url` - Integration endpoints
- `email` - Contact email

### AuditLogs
- `id` (UUID) - Primary key
- `user_id` - User who triggered action
- `application_id` - Associated application
- `action` - Action type
- `details` (JSONB) - Event details
- `ip_address` - Source IP
- `created_at` - Timestamp

## Migrations

Run migrations with:
```bash
npm run migrate
```

This creates all tables and indexes needed for the application.

## Indexing

Indexes are created on:
- `applications.user_id`, `applications.status`
- `pre_approvals.application_id`, `pre_approvals.lender_id`
- `audit_logs.user_id`, `audit_logs.created_at`

## Security

- SSN is encrypted at rest
- All queries use parameterized statements
- Audit logging captures all state changes
- Role-based access control enforced at application level
