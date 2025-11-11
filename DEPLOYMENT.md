# GCP Deployment Guide

## Prerequisites

- GCP Account with billing enabled
- `gcloud` CLI installed and configured
- Docker and Docker Compose installed
- PostgreSQL 14+
- Service account with appropriate permissions

## Step 1: Set Up GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"
export REGION="us-central1"

# Set default project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  compute.googleapis.com \
  run.googleapis.com \
  sql.googleapis.com \
  storage-api.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firebaseapp.googleapis.com \
  secretmanager.googleapis.com
```

## Step 2: Create Cloud SQL Instance

```bash
# Create PostgreSQL instance
gcloud sql instances create supercar-finance \
  --database-version=POSTGRES_14 \
  --tier=db-custom-2-8192 \
  --region=$REGION \
  --availability-type=REGIONAL \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --retained-backups-count=30

# Create database
gcloud sql databases create supercar_finance \
  --instance=supercar-finance

# Create database user
gcloud sql users create postgres \
  --instance=supercar-finance \
  --password=your-secure-password
```

## Step 3: Set Up Cloud Storage

```bash
# Create storage bucket for images
gsutil mb -l $REGION gs://$PROJECT_ID-supercar-finance

# Set up lifecycle policy (optional)
gsutil lifecycle set - gs://$PROJECT_ID-supercar-finance << 'EOF'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF
```

## Step 4: Configure Secrets

```bash
# Create secrets for sensitive data
echo -n "your-jwt-secret-key" | \
  gcloud secrets create JWT_SECRET --data-file=-

echo -n "your-credit-api-key" | \
  gcloud secrets create CREDIT_API_KEY --data-file=-

echo -n "your-firebase-private-key" | \
  gcloud secrets create FIREBASE_PRIVATE_KEY --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member=serviceAccount:supercar-finance@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

## Step 5: Build and Push Docker Images

```bash
# Authenticate Docker
gcloud auth configure-docker

# Build and push frontend
docker build -t gcr.io/$PROJECT_ID/supercar-finance-frontend ./frontend
docker push gcr.io/$PROJECT_ID/supercar-finance-frontend

# Build and push backend
docker build -t gcr.io/$PROJECT_ID/supercar-finance-backend ./backend
docker push gcr.io/$PROJECT_ID/supercar-finance-backend
```

## Step 6: Deploy to Cloud Run

### Deploy Backend

```bash
gcloud run deploy supercar-finance-backend \
  --image gcr.io/$PROJECT_ID/supercar-finance-backend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DB_HOST=/cloudsql/$PROJECT_ID:$REGION:supercar-finance \
  --set-env-vars DB_USER=postgres \
  --set-env-vars DB_NAME=supercar_finance \
  --set-env-vars GCP_PROJECT_ID=$PROJECT_ID \
  --set-env-vars ALLOWED_ORIGINS=https://yourdomain.com \
  --add-cloudsql-instances $PROJECT_ID:$REGION:supercar-finance \
  --service-account supercar-finance@appspot.gserviceaccount.com
```

### Deploy Frontend

```bash
gcloud run deploy supercar-finance-frontend \
  --image gcr.io/$PROJECT_ID/supercar-finance-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --timeout 60 \
  --set-env-vars NEXT_PUBLIC_BACKEND_URL=https://supercar-finance-backend-xxxxx.run.app
```

## Step 7: Set Up Cloud Build CI/CD

```bash
# Connect GitHub repository
gcloud builds connect --repository-name=supercar-finance \
  --repository-owner=yourusername \
  --region=$REGION

# Create Cloud Build trigger
gcloud builds triggers create github \
  --name=supercar-finance-deploy \
  --repo-name=supercar-finance \
  --repo-owner=yourusername \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

## Step 8: Run Database Migrations

```bash
# Connect to Cloud SQL instance
gcloud sql connect supercar-finance \
  --user=postgres \
  --instance=$PROJECT_ID:$REGION:supercar-finance

# Run migrations (from backend service)
npm run migrate
```

## Step 9: Set Up Cloud Monitoring

```bash
# Create uptime check for frontend
gcloud monitoring uptime-checks create \
  --display-name="Supercar Finance Frontend" \
  --resource-type=uptime-url \
  --host=yourdomain.com \
  --path=/ \
  --period=60

# Create uptime check for backend
gcloud monitoring uptime-checks create \
  --display-name="Supercar Finance Backend" \
  --resource-type=uptime-url \
  --host=api.yourdomain.com \
  --path=/health \
  --period=60
```

## Step 10: Configure Cloud Armor (Optional)

```bash
# Create security policy
gcloud compute security-policies create supercar-finance-policy

# Add rules
gcloud compute security-policies rules create 1000 \
  --security-policy=supercar-finance-policy \
  --action=allow

# Attach to Cloud Load Balancer
gcloud compute backend-services update supercar-finance-backend \
  --security-policy=supercar-finance-policy \
  --global
```

## Step 11: Set Up Custom Domain (Optional)

```bash
# Create DNS A record pointing to Load Balancer IP
# Then verify with gcloud
gcloud domains register yourdomain.com
gcloud dns managed-zones create supercar-finance \
  --dns-name=yourdomain.com.
```

## Verification

```bash
# Check Cloud Run deployments
gcloud run services list --region=$REGION

# Check Cloud SQL instance
gcloud sql instances describe supercar-finance

# Check Cloud Build triggers
gcloud builds triggers list

# Get backend service URL
gcloud run services describe supercar-finance-backend \
  --region=$REGION \
  --format='value(status.url)'
```

## Monitoring and Logs

```bash
# View Cloud Run logs
gcloud run services describe supercar-finance-backend \
  --region=$REGION \
  --format='value(status.url)' | xargs -I {} gcloud logging read \
  "resource.service.name=supercar-finance-backend" \
  --limit=50 \
  --format=json

# View Cloud Build logs
gcloud builds log [BUILD_ID]

# View Cloud SQL logs
gcloud logging read "resource.type=cloudsql_database" --limit=50
```

## Environment-Specific Deployments

### Staging

```bash
gcloud run deploy supercar-finance-backend-staging \
  --image gcr.io/$PROJECT_ID/supercar-finance-backend \
  --region $REGION \
  --set-env-vars NODE_ENV=staging
```

### Production

```bash
gcloud run deploy supercar-finance-backend-prod \
  --image gcr.io/$PROJECT_ID/supercar-finance-backend \
  --region $REGION \
  --set-env-vars NODE_ENV=production \
  --revision-suffix=prod-$(date +%s)
```

## Rollback

```bash
# List all revisions
gcloud run revisions list --service=supercar-finance-backend \
  --region=$REGION

# Route traffic to previous revision
gcloud run services update-traffic supercar-finance-backend \
  --to-revisions [REVISION_NAME]=100 \
  --region=$REGION
```

## Cost Estimation

- **Cloud Run**: ~$150/month (frontend + backend)
- **Cloud SQL**: ~$200/month (db-custom-2-8192)
- **Cloud Storage**: ~$20/month (images)
- **Cloud Logging**: ~$30/month
- **Cloud Monitoring**: Free tier usually sufficient

**Total estimated monthly cost**: ~$400-$500

## Troubleshooting

### Cloud Run deployment fails

```bash
# Check logs
gcloud run services describe supercar-finance-backend \
  --region=$REGION | grep -A5 "status"

# Re-deploy with verbose output
gcloud run deploy supercar-finance-backend \
  --image gcr.io/$PROJECT_ID/supercar-finance-backend \
  --region $REGION \
  --debug
```

### Database connection issues

```bash
# Test Cloud SQL connectivity
gcloud sql connect supercar-finance --user=postgres

# Check firewall rules
gcloud sql instances describe supercar-finance | grep -A5 ipAddresses
```

### Migration errors

```bash
# SSH into Cloud Run container (if needed)
gcloud run jobs create migration-runner \
  --image=gcr.io/$PROJECT_ID/supercar-finance-backend \
  --region=$REGION \
  --command npm run migrate
```

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Monitoring Documentation](https://cloud.google.com/monitoring/docs)
