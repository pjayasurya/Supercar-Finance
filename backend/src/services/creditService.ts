import { config } from '../config.js';
import axios from 'axios';

/**
 * Soft-pull credit API integration with Experian
 * Supports Experian API v3
 */

interface CreditResponse {
  ficoScore: number;
  factors: string[];
  approved: boolean;
}

interface ExperianSoftPullRequest {
  ssn: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface ExperianSoftPullResponse {
  scoringResponse?: {
    score?: number;
    scoreFactors?: Array<{
      code: string;
      description: string;
    }>;
  };
  errorResponse?: {
    code: string;
    message: string;
  };
}

/**
 * Call Experian soft-pull credit API
 * Docs: https://developer.experian.com/
 */
export async function softPullCredit(ssn: string, dob: string, firstName?: string, lastName?: string): Promise<CreditResponse> {
  try {
    // Check if we should use real Experian API or mock
    const useRealAPI = config.credit.apiKey && !config.credit.apiKey.includes('dev-');

    if (!useRealAPI) {
      // Use mock for development
      return getMockCreditResponse();
    }

    // Build Experian request
    const experianRequest: ExperianSoftPullRequest = {
      ssn,
      dateOfBirth: dob,
      firstName: firstName || 'Unknown',
      lastName: lastName || 'Unknown',
    };

    // Call Experian API with Basic Auth
    const auth = Buffer.from(
      `${config.credit.username}:${config.credit.password}`
    ).toString('base64');

    const response = await axios.post<ExperianSoftPullResponse>(
      `${config.credit.endpoint}/softpull`,
      experianRequest,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'X-API-Key': config.credit.apiKey,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Parse Experian response
    if (response.data.errorResponse) {
      console.error('Experian API error:', response.data.errorResponse);
      throw new Error(`Experian error: ${response.data.errorResponse.message}`);
    }

    const ficoScore = response.data.scoringResponse?.score || 650;
    const factors = (response.data.scoringResponse?.scoreFactors || []).map(
      (f) => `${f.description} (${f.code})`
    );

    return {
      ficoScore,
      factors,
      approved: ficoScore >= 580,
    };
  } catch (error: any) {
    console.error('Credit pull failed:', error.message);

    // Return mock data on error (for development/testing)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock credit data due to error');
      return getMockCreditResponse();
    }

    throw error;
  }
}

/**
 * Mock credit response for development/testing
 */
function getMockCreditResponse(): CreditResponse {
  const score = Math.floor(Math.random() * (800 - 680) + 680); // Mock FICO 680-800 for consistent approval
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
