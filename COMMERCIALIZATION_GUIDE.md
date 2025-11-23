# Commercialization Guide: Revline Financing Platform

This guide provides technical and operational details for selling or deploying the Revline Financing platform as a service (SaaS) or a white-label product for luxury dealerships and credit unions.

## 1. Soft Pull API Integration

The platform is designed to be modular. While the default implementation uses a generic structure, we highly recommend **iSoftpull** for production deployments due to their robust "Intelligence Indicator" and "Full Feed" APIs.

### Prerequisites & Onboarding

To use iSoftpull, you must first establish a commercial account:

1.  **Sign Up**: Go to [iSoftpull.com](https://isoftpull.com) and request a demo or sign up for a commercial account.
2.  **Compliance**: Complete their FCRA compliance vetting process (typically requires proof of business, permissible purpose).
3.  **Get Credentials**:
    *   Log in to the **iSoftpull Dashboard**.
    *   Navigate to **Settings** > **API Credentials** (or "Integrations").
    *   Click **Generate New Key**.
    *   Save your `API Key ID` and `Secret Access Token` securely.

### Option A: iSoftpull Integration (Recommended)

**Endpoint**: `https://app.isoftpull.com/api/v2/reports`  
**Method**: `POST`  
**Headers**:
- `Content-Type`: `application/json`
- `api-key`: `[YOUR_API_KEY_ID]`
- `api-secret`: `[YOUR_SECRET_ACCESS_TOKEN]`

**Request Payload**:
```json
{
  "applicant": {
    "firstName": "John",
    "lastName": "Doe",
    "address": {
      "line1": "123 Luxury Ln",
      "city": "Beverly Hills",
      "state": "CA",
      "zip": "90210"
    }
  }
}
```

**Response (Simplified)**:
```json
{
  "status": "success",
  "credit_score": 785,
  "report_pdf_url": "https://...",
  "factors": ["Length of credit history", "Credit utilization"]
}
```

### Option B: Generic / Custom Integration

If you prefer another provider (e.g., 700Credit, Experian Connect), the platform uses a standardized internal interface (`CreditService`) that can be adapted.

### API Endpoint (Internal Platform)
`POST /api/credit/apply`

### Request Payload
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "ssn": "000-00-0000",
  "dob": "1980-01-01",
  "address": "123 Luxury Ln",
  "city": "Beverly Hills",
  "state": "CA",
  "zipCode": "90210",
  "annualIncome": 250000
}
```

### Response
```json
{
  "id": "app_uuid",
  "status": "approved",
  "ficoScore": 785,
  "preApprovalsCount": 3
}
```

### Integration Steps for Clients
1.  **Credentials**: Obtain API keys from the credit bureau (e.g., Experian Connect API).
2.  **Configuration**: Update `backend/src/config.ts` with the client's API credentials.
3.  **Compliance**: Ensure the client has the necessary FCRA permissible purpose to perform soft pulls.

## 2. Lender Onboarding

To add new credit unions or lenders to the platform:

1.  **Database Entry**: Insert a new record into the `lenders` table.
    ```sql
    INSERT INTO lenders (id, name, min_loan, max_loan, min_apr, max_apr, supported_states)
    VALUES ('lender_new', 'New Credit Union', 50000, 500000, 3.5, 8.0, '{CA, TX, FL}');
    ```
2.  **Matching Logic**: The `lenderService.ts` automatically matches applicants based on the criteria defined in the database (State, Loan Amount, Credit Score).
3.  **Webhooks**: Configure webhook URLs in the `lenders` table to forward approved applications directly to the lender's loan origination system (LOS).

## 3. White Labeling Guide

The platform is built for easy rebranding.

### Design System
-   **Colors**: Modify `frontend/tailwind.config.ts`. Change the `luxury` color palette to match the client's brand (e.g., Blue/Silver for a BMW dealership).
-   **Logo**: Update the SVG/Text in `frontend/src/app/page.tsx` and `layout.tsx`.
-   **Typography**: Switch fonts in `layout.tsx` (currently Inter/Playfair Display).

### Deployment
-   **Docker**: The app is container-ready.
-   **Environment Variables**: Use `.env` files to manage database connections and API keys for different client deployments.

## 4. Selling Points

-   **"Smooth" Luxury UI**: Modern, glassmorphism-based design that appeals to high-net-worth individuals.
-   **Instant Decisions**: <60s pre-approval process.
-   **No Credit Impact**: Soft-pull technology increases conversion rates.
-   **Plug-and-Play**: Rapid deployment for dealerships wanting their own finance portal.
