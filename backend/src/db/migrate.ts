import { db } from './connection.js';

export async function migrate() {
  try {
    console.log('Running database migrations...');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        firebase_uid VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Applications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        ssn_encrypted VARCHAR(255),
        dob DATE,
        address VARCHAR(255),
        city VARCHAR(100),
        state CHAR(2),
        zip_code CHAR(5),
        annual_income NUMERIC(12,2),
        employment_status VARCHAR(50),
        down_payment NUMERIC(12,2),
        desired_loan_amount NUMERIC(12,2),
        loan_term INTEGER,
        fico_score INTEGER,
        credit_factors JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Applications table created');

    // Pre-approvals table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pre_approvals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
        lender_id VARCHAR(50) NOT NULL,
        lender_name VARCHAR(255) NOT NULL,
        max_loan_amount NUMERIC(12,2) NOT NULL,
        interest_rate NUMERIC(5,2) NOT NULL,
        monthly_payment NUMERIC(10,2),
        terms INTEGER,
        approved BOOLEAN DEFAULT TRUE,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Pre-approvals table created');

    // Vehicles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id UUID,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        color VARCHAR(50),
        mileage INTEGER,
        price NUMERIC(12,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Vehicles table created');

    // Lenders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lenders (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        min_loan NUMERIC(12,2),
        max_loan NUMERIC(12,2),
        min_apr NUMERIC(5,2),
        max_apr NUMERIC(5,2),
        supported_states TEXT[],
        api_endpoint VARCHAR(500),
        webhook_url VARCHAR(500),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Lenders table created');

    // Audit logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        application_id UUID REFERENCES applications(id),
        action VARCHAR(255) NOT NULL,
        details JSONB,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Audit logs table created');

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_pre_approvals_application_id ON pre_approvals(application_id);
      CREATE INDEX IF NOT EXISTS idx_pre_approvals_lender_id ON pre_approvals(lender_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `);
    console.log('✓ Indexes created');

    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

if (process.argv[1].includes('migrate.ts')) {
  migrate().then(() => process.exit(0));
}
