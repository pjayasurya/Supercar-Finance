import { v4 as uuid } from 'uuid';
import { db } from '../db/connection';
import { ApplicationData } from '../schemas/application';

export async function createApplication(
  userId: string,
  data: ApplicationData,
) {
  const id = uuid();

  await db.query(
    `INSERT INTO applications (
      id, user_id, first_name, last_name, email, phone, dob,
      address, city, state, zip_code, annual_income, employment_status,
      down_payment, desired_loan_amount, loan_term
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      id,
      userId,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.dob,
      data.address,
      data.city,
      data.state,
      data.zipCode,
      data.annualIncome,
      data.employmentStatus,
      data.downPayment,
      data.desiredLoanAmount,
      data.loanTerm,
    ],
  );

  return id;
}

export async function getApplication(applicationId: string) {
  const result = await db.query(
    'SELECT * FROM applications WHERE id = $1',
    [applicationId],
  );
  return result.rows[0];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  creditData?: any,
) {
  await db.query(
    `UPDATE applications
     SET status = $1, fico_score = $2, credit_factors = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4`,
    [status, creditData?.ficoScore, JSON.stringify(creditData?.factors), applicationId],
  );
}
