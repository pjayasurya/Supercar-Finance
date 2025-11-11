# GCP Deployment Configuration

## Prerequisites

1. GCP Project with billing enabled
2. Cloud SQL instance (PostgreSQL 14+)
3. Firebase project for authentication
4. Service account with appropriate permissions

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
```

### Backend (.env)
```
NODE_ENV=production
PORT=3001
DB_HOST=cloudsql-instance.c.project-id.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=xxx
DB_NAME=supercar_finance
JWT_SECRET=xxx
CREDIT_API_KEY=xxx
CREDIT_PROVIDER=experian
FIREBASE_PROJECT_ID=xxx
GCP_PROJECT_ID=xxx
GCP_REGION=us-central1
ALLOWED_ORIGINS=https://yourdomain.com
```

## Deployment Steps

### 1. Build Docker Images

```bash
# Frontend
cd frontend
docker build -t gcr.io/PROJECT_ID/supercar-finance-frontend .
docker push gcr.io/PROJECT_ID/supercar-finance-frontend

# Backend
cd ../backend
docker build -t gcr.io/PROJECT_ID/supercar-finance-backend .
docker push gcr.io/PROJECT_ID/supercar-finance-backend
```

### 2. Deploy with Cloud Run

```bash
# Frontend
gcloud run deploy supercar-finance-frontend \
  --image gcr.io/PROJECT_ID/supercar-finance-frontend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Backend
gcloud run deploy supercar-finance-backend \
  --image gcr.io/PROJECT_ID/supercar-finance-backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars-from-file .env.backend \
  --cloud-sql-instances PROJECT_ID:us-central1:supercar-finance
```

### 3. Set up Cloud SQL Proxy

```bash
cloud_sql_proxy -instances=PROJECT_ID:us-central1:supercar-finance=tcp:5432
```

### 4. Run Migrations

```bash
npm run migrate
```

## CI/CD with Cloud Build

See `cloudbuild.yaml` for automated deployments.

## Security

- All services use VPC Service Controls
- Cloud SQL has private IP only
- Secrets stored in Secret Manager
- TLS 1.2+ enforced on all connections
- WAF rules configured in Cloud Armor

## Monitoring

- Cloud Logging: All application logs
- Cloud Monitoring: Uptime, latency, error rates
- Cloud Profiler: Performance optimization
- Cloud Trace: Distributed tracing

## Cost Optimization

- Cloud Run scales to zero when idle
- Cloud SQL with committed use discounts
- Cloud Storage lifecycle policies for old data
- Cloud Load Balancing for traffic distribution
