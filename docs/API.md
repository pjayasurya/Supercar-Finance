# Supercar Finance Platform - API Documentation

## Base URL

Production: `https://api.supercarfinance.com`
Development: `http://localhost:3001`

## Authentication

All endpoints (except `/health`) require Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

## Credit API Endpoints

### POST /api/credit/apply
Submit soft-pull credit application.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "5551234567",
  "ssn": "123456789",
  "dob": "1990-01-15",
  "address": "123 Main St",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "annualIncome": 150000,
  "employmentStatus": "employed",
  "downPayment": 50000,
  "desiredLoanAmount": 200000,
  "loanTerm": 60
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "approved",
  "ficoScore": 720,
  "creditFactors": ["Payment history", "Credit utilization"],
  "preApprovalsCount": 3
}
```

### GET /api/credit/pre-approvals/{applicationId}
Get pre-approval results for an application.

**Response:**
```json
{
  "approvals": [
    {
      "lenderId": "lender_001",
      "lenderName": "Luxury Motors Finance",
      "maxLoanAmount": 250000,
      "interestRate": 4.99,
      "monthlyPayment": 4580,
      "terms": 60,
      "approved": true
    }
  ]
}
```

### GET /api/credit/analysis/{applicationId}
Get credit analysis (FICO score and factors).

**Response:**
```json
{
  "ficoScore": 720,
  "factors": [
    "Payment history (35%)",
    "Credit utilization (30%)",
    "Length of credit history (15%)"
  ]
}
```

## Vehicle API Endpoints

### GET /api/vehicles?maxPrice=250000&sort=price_desc&limit=50
Get available vehicles filtered by price.

**Query Parameters:**
- `maxPrice` (number) - Maximum vehicle price
- `sort` (string) - price_asc, price_desc, year_desc, newest
- `limit` (number) - Results per page (default: 50)
- `offset` (number) - Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": "uuid",
    "make": "Ferrari",
    "model": "F8 Tributo",
    "year": 2023,
    "color": "Red",
    "mileage": 1200,
    "price": 280000,
    "description": "Low mileage supercar",
    "imageUrl": "https://...",
    "dealerName": "Exotic Motors"
  }
]
```

### GET /api/vehicles/{vehicleId}
Get single vehicle details.

### GET /api/vehicles/inventory?dealerId=uuid
Get dealer inventory.

## Application API Endpoints

### POST /api/applications
Create new application (auto-called by credit/apply).

### GET /api/applications/{applicationId}
Get application status and details.

### POST /api/applications/{applicationId}/export
Export application to lender.

**Request:**
```json
{
  "lenderId": "lender_001"
}
```

**Response:**
```json
{
  "success": true,
  "lenderId": "lender_001"
}
```

### PUT /api/applications/{applicationId}
Update application details.

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "status": 400
}
```

### Status Codes
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 404 - Not Found
- 500 - Server Error

## Rate Limiting

- 100 requests per minute per IP
- Credit applications: 10 per hour per email

## Data Security

- All SSNs encrypted with AES-256
- FCRA compliance maintained
- PII never logged
- SOC2 Type II certified

## Compliance

- FCRA-compliant soft-pull integration
- GLBA compliant data handling
- GDPR compliant with data deletion
- PCI DSS compliance (no card data stored)
