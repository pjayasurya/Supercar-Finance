import { create } from 'zustand';

export interface ApplicationData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  ssn?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  annualIncome?: number;
  employmentStatus?: string;
  downPayment?: number;
  loanTerm?: number;
  carType?: string;
}

export interface PreApprovalResult {
  lenderId: string;
  lenderName: string;
  maxLoanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  terms: number;
  approved: boolean;
  reason?: string;
}

interface ApplicationStore {
  applicationData: ApplicationData;
  preApprovals: PreApprovalResult[];
  selectedLender?: string;
  ficoScore?: number;
  creditFactors?: string[];
  
  setApplicationData: (data: Partial<ApplicationData>) => void;
  setPreApprovals: (approvals: PreApprovalResult[]) => void;
  setSelectedLender: (lenderId: string) => void;
  setCreditScore: (score: number, factors: string[]) => void;
  resetApplication: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applicationData: {},
  preApprovals: [],
  
  setApplicationData: (data) =>
    set((state) => ({
      applicationData: { ...state.applicationData, ...data },
    })),
  
  setPreApprovals: (approvals) => set({ preApprovals: approvals }),
  
  setSelectedLender: (lenderId) => set({ selectedLender: lenderId }),
  
  setCreditScore: (score, factors) =>
    set({ ficoScore: score, creditFactors: factors }),
  
  resetApplication: () =>
    set({
      applicationData: {},
      preApprovals: [],
      selectedLender: undefined,
      ficoScore: undefined,
      creditFactors: undefined,
    }),
}));
