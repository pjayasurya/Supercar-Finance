import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'supercar_finance',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Credit API Integration
  credit: {
    apiKey: process.env.CREDIT_API_KEY,
    apiSecret: process.env.CREDIT_API_SECRET,
    provider: process.env.CREDIT_API_PROVIDER || 'experian',
    endpoint: process.env.CREDIT_API_ENDPOINT || 'https://api.experian.com/creditpull/v3',
    username: process.env.CREDIT_API_USERNAME,
    password: process.env.CREDIT_API_PASSWORD,
  },
  
  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  
  // GCP
  gcp: {
    projectId: process.env.GCP_PROJECT_ID,
    region: process.env.GCP_REGION || 'us-central1',
    bucketName: process.env.GCP_BUCKET_NAME,
  },
  
  // Lenders
  lenders: [
    {
      id: 'lender_001',
      name: 'Luxury Motors Finance',
      minLoan: 80000,
      maxLoan: 500000,
      minAPR: 3.99,
      maxAPR: 8.99,
      states: ['CA', 'NY', 'TX', 'FL'],
    },
    {
      id: 'lender_002',
      name: 'Exotic Auto Loans',
      minLoan: 100000,
      maxLoan: 400000,
      minAPR: 4.49,
      maxAPR: 9.49,
      states: ['CA', 'NY', 'TX', 'IL', 'OH'],
    },
    {
      id: 'lender_003',
      name: 'Premium Vehicle Credit',
      minLoan: 80000,
      maxLoan: 500000,
      minAPR: 4.99,
      maxAPR: 10.99,
      states: ['CA', 'NY', 'TX', 'FL', 'MI'],
    },
  ],
};
