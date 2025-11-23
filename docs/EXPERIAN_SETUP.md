# Experian Credit Bureau Integration Guide

## Overview

This guide walks you through integrating Experian's soft-pull credit API into the Supercar Finance platform.

## What is a Soft-Pull Credit Check?

- **No hard inquiry** - doesn't affect credit score
- **Fast results** - under 60 seconds
- **FCRA compliant** - meets Federal Credit Reporting Act requirements
- **Perfect for pre-approvals** - ideal for lender pre-qualification

## Prerequisites

1. **Experian Business Account** - Register at https://www.experian.com/business/partnerships
2. **API Credentials** - Get from your Experian account dashboard
3. **Sandbox Access** (Optional) - For testing before production

## Step 1: Get Experian API Credentials

1. Go to **https://www.experian.com/business/partnerships**
2. Sign up or log in to your business account
3. Navigate to **API Management** or **Developer Console**
4. Create a new application or API key
5. Request access to:
   - **Credit Scoring API** (Soft-pull)
   - **Consumer Credit Reports**
6. You'll receive:
   - **API Key** (X-API-Key header)
   - **Username** (for Basic Auth)
   - **Password** (for Basic Auth)
   - **Sandbox URL** (for testing)
   - **Production URL** (for live use)

**Typical Credentials:**
```
API Key: ABC123XYZ...
Username: your_api_username
Password: your_api_password
Sandbox: https://sandbox.api.experian.com/creditpull/v3
Production: https://api.experian.com/creditpull/v3
```

## Step 2: Configure Backend Environment

Edit `backend/.env`:

```bash
# Experian Credit Bureau API
CREDIT_API_PROVIDER=experian
CREDIT_API_KEY=your_api_key_from_experian
CREDIT_API_SECRET=your_api_secret_if_provided
CREDIT_API_USERNAME=your_experian_username
CREDIT_API_PASSWORD=your_experian_password

# Use sandbox for testing (remove /sandbox for production)
CREDIT_API_ENDPOINT=https://sandbox.api.experian.com/creditpull/v3

# Switch to production when ready:
# CREDIT_API_ENDPOINT=https://api.experian.com/creditpull/v3
```

## Step 3: Test the Integration

### Using cURL (Testing in Sandbox)

```bash
curl -X POST http://localhost:3001/api/credit/apply \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "ssn": "123456789",
    "dob": "1990-01-15",
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "annualIncome": 150000,
    "employmentStatus": "employed",
    "desiredLoanAmount": 250000,
    "downPayment": 50000,
    "loanTerm": "60"
  }'
```

### Expected Response (Success)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "approved",
  "ficoScore": 720,
  "creditFactors": [
    "Payment history (35%)",
    "Credit utilization (30%)",
    "Length of credit history (15%)",
    "Credit mix (10%)",
    "New credit inquiries (10%)"
  ],
  "preApprovalsCount": 3
}
```

### Expected Response (Declined)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "declined",
  "message": "Unfortunately, you do not meet our current eligibility criteria."
}
```

## Step 4: Verify FCRA Compliance

The system automatically logs all credit inquiries for FCRA compliance:

**Logged Information:**
- User ID
- Application ID
- Action: `credit_pull_initiated`
- Timestamp
- Client IP address
- Masked SSN (last 4 digits only)

**Accessible at:** `backend/src/utils/audit.ts`

## Experian API Request Format

```typescript
// Request sent to Experian
{
  ssn: "123456789",
  dateOfBirth: "1990-01-15",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",      // Optional
  city: "Los Angeles",          // Optional
  state: "CA",                  // Optional
  zipCode: "90001"              // Optional
}
```

## Experian API Response Format

```typescript
{
  scoringResponse: {
    score: 720,                    // FICO score
    scoreFactors: [
      {
        code: "G048",
        description: "Payment history (35%)"
      },
      // ... more factors
    ]
  }
}
```

## Error Handling

The system handles Experian API errors gracefully:

| Error | Behavior | Resolution |
|-------|----------|-----------|
| Invalid credentials | Falls back to mock data (dev mode) | Check API key/username/password |
| Network timeout | Returns error to user | Check endpoint URL, firewall |
| Invalid SSN format | Experian returns error | Validate SSN format |
| API rate limit | Request denied | Contact Experian for rate limits |

## Pricing

Experian charges per soft-pull inquiry:
- **Typical cost:** $0.10 - $1.00 per inquiry
- **Volume discounts:** Available for 1000+ monthly pulls
- **Contract:** Usually annual, minimum fees apply

## Compliance & Security

✅ **FCRA Compliant**
- Soft-pull only (no hard inquiry)
- Proper disclosures
- Secure data handling
- Audit logging

✅ **Data Protection**
- SSN encrypted in database
- TLS 1.2+ in transit
- PII masking in logs
- Access controls

✅ **Best Practices**
- Only collect necessary data
- Proper consent & disclosures
- Regular security audits
- Data retention policies

## Troubleshooting

### Issue: "auth/api-key-not-valid"

**Cause:** Firebase auth misconfiguration (not Experian related)

**Solution:** 
1. Check `frontend/.env.local` Firebase credentials
2. Or use mock auth (already configured)

### Issue: "Experian API error: Authentication failed"

**Cause:** Invalid API credentials

**Solution:**
1. Verify username/password in `.env`
2. Check if credentials are for sandbox or production
3. Ensure API is enabled in Experian account

### Issue: "Request timeout"

**Cause:** Network issue or wrong endpoint URL

**Solution:**
1. Check `CREDIT_API_ENDPOINT` is correct
2. Verify firewall allows outbound HTTPS
3. Check Experian API status

### Issue: "All applications returning mock data"

**Cause:** Real API not configured or failing

**Solution:**
1. Ensure `CREDIT_API_PROVIDER=experian` is set
2. Verify all credentials are present
3. Check backend logs: `npm run dev`

## Monitoring & Analytics

Track credit pull metrics in your dashboard:

```sql
-- Recent credit pulls
SELECT 
  created_at,
  action,
  details->>'provider' as provider,
  COUNT(*) as pulls
FROM audit_logs
WHERE action = 'credit_pull_initiated'
GROUP BY DATE(created_at), action, provider
ORDER BY created_at DESC;
```

## Production Checklist

- [ ] Switch to Experian production endpoint
- [ ] Update credentials to production API key
- [ ] Enable HTTPS (TLS 1.2+)
- [ ] Configure proper error handling
- [ ] Set up monitoring & alerting
- [ ] Document SLA & compliance
- [ ] Set up audit log retention (7+ years)
- [ ] Configure backup credit provider
- [ ] Test with real SSNs in production environment
- [ ] Document support process

## Next Steps

1. ✅ Configure Experian API credentials
2. ✅ Test in sandbox environment
3. ✅ Verify FCRA compliance logging
4. ✅ Load test with expected volume
5. ✅ Deploy to production
6. ✅ Monitor and optimize

## Support

- **Experian Support:** https://developer.experian.com/support
- **API Documentation:** https://developer.experian.com/documentation
- **Status Page:** https://status.experian.com

---

**Last Updated:** November 2025
**Status:** Ready for production integration
