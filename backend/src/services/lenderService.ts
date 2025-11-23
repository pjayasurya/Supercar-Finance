import { v4 as uuid } from 'uuid';
import { db } from '../db/connection';
import { config } from '../config';

interface LenderCriteria {
  minLoan: number;
  maxLoan: number;
  minIncome?: number;
  minCreditScore?: number;
  maxDTI?: number;
  states: string[];
}

/**
 * Rules Engine: Match applicant with eligible lenders
 */
export async function matchLenders(applicationData: any, creditData: any) {
  const { state, annualIncome, desiredLoanAmount, downPayment } = applicationData;
  const { ficoScore } = creditData;

  const monthlyIncome = annualIncome / 12;
  const monthlyDebts = 0; // TODO: Calculate from credit report
  const dti = monthlyDebts / monthlyIncome;

  const approvals = [];

  // Fetch lenders from DB
  const lendersResult = await db.query('SELECT * FROM lenders');
  const lenders = lendersResult.rows;

  for (const lender of lenders) {
    console.log(`Checking lender: ${lender.name}`);
    console.log(`Applicant State: ${state}, Supported: ${lender.supported_states}`);

    // Check state eligibility
    if (!lender.supported_states.includes(state)) {
      console.log(`State mismatch: ${state} not in ${lender.supported_states}`);
      continue;
    }

    // Check loan amount range
    const loanAmount = desiredLoanAmount;
    console.log(`Loan Amount: ${loanAmount}, Min: ${lender.min_loan}, Max: ${lender.max_loan}`);
    if (loanAmount < parseFloat(lender.min_loan) || loanAmount > parseFloat(lender.max_loan)) {
      console.log('Loan amount mismatch');
      continue;
    }

    // Check FICO score (soft requirement)
    console.log(`FICO: ${ficoScore}`);
    if (ficoScore < 580) {
      console.log('FICO too low');
      continue;
    }

    // Calculate APR based on credit score
    const baseAPR = parseFloat(lender.min_apr);
    const maxAPR = parseFloat(lender.max_apr);
    const aprAdjustment = Math.max(0, (680 - ficoScore) * 0.001);
    const apr = Math.min(maxAPR, baseAPR + aprAdjustment);

    // Calculate monthly payment
    const monthlyRate = apr / 100 / 12;
    const months = 60; // Default to 60 months
    const monthlyPayment = monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    approvals.push({
      lenderId: lender.id,
      lenderName: lender.name,
      maxLoanAmount: loanAmount,
      interestRate: parseFloat(apr.toFixed(2)),
      monthlyPayment: Math.round(monthlyPayment),
      terms: months,
      approved: true,
    });
  }

  return approvals;
}

export async function savePreApprovals(
  applicationId: string,
  approvals: any[],
) {
  for (const approval of approvals) {
    await db.query(
      `INSERT INTO pre_approvals (
        id, application_id, lender_id, lender_name, max_loan_amount,
        interest_rate, monthly_payment, terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        uuid(),
        applicationId,
        approval.lenderId,
        approval.lenderName,
        approval.maxLoanAmount,
        approval.interestRate,
        approval.monthlyPayment,
        approval.terms,
      ],
    );
  }
}

export async function getPreApprovals(applicationId: string) {
  const result = await db.query(
    'SELECT * FROM pre_approvals WHERE application_id = $1',
    [applicationId],
  );
  return result.rows;
}

export async function exportToLender(
  applicationId: string,
  lenderId: string,
) {
  // Get application and lender details
  const appResult = await db.query(
    'SELECT * FROM applications WHERE id = $1',
    [applicationId],
  );
  const app = appResult.rows[0];

  const lenderResult = await db.query(
    'SELECT * FROM lenders WHERE id = $1',
    [lenderId],
  );
  const lender = lenderResult.rows[0];

  if (!lender) {
    throw new Error('Lender not found');
  }

  // TODO: Send to lender via API, webhook, or email
  // For now, just mark the export in audit logs
  await db.query(
    `INSERT INTO audit_logs (application_id, action, details)
     VALUES ($1, $2, $3)`,
    [applicationId, 'exported_to_lender', JSON.stringify({ lenderId, lenderName: lender.name })],
  );

  return { success: true, lenderId };
}
