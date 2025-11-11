import { config } from '../config.js';

/**
 * Soft-pull credit API integration
 * Supports Experian, TransUnion, Equifax
 */

interface CreditResponse {
  ficoScore: number;
  factors: string[];
  approved: boolean;
}

export async function softPullCredit(ssn: string, dob: string): Promise<CreditResponse> {
  // Mock implementation - replace with real API calls
  
  try {
    // Simulate API call to credit bureau
    // In production, call actual Experian/TransUnion/Equifax API
    
    const score = Math.floor(Math.random() * (800 - 550) + 550); // Mock FICO 550-800
    const factors = [
      'Payment history (35%)',
      'Credit utilization (30%)',
      'Length of credit history (15%)',
      'Credit mix (10%)',
      'New credit inquiries (10%)',
    ];

    return {
      ficoScore: score,
      factors,
      approved: score >= 580,
    };
  } catch (error) {
    console.error('Credit pull failed:', error);
    throw error;
  }
}

export async function validateApplicationEligibility(
  applicationData: any,
  creditData: any,
): Promise<boolean> {
  // Basic eligibility checks
  const { annualIncome, employmentStatus, dob } = applicationData;
  const { ficoScore } = creditData;

  // Check age (must be 18+)
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 18) return false;

  // Check income
  if (annualIncome < 50000) return false;

  // Check credit score (soft requirement)
  if (ficoScore < 550) return false;

  // Check employment
  if (!['employed', 'self-employed', 'retired'].includes(employmentStatus)) {
    return false;
  }

  return true;
}
