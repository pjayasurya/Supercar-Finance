import { z } from 'zod';

export const applicationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  ssn: z.string().regex(/^\d{9}$/),
  dob: z.string().date(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}$/),
  annualIncome: z.number().min(50000),
  employmentStatus: z.enum(['employed', 'self-employed', 'retired']),
  downPayment: z.number().min(10000),
  desiredLoanAmount: z.number().min(80000).max(500000),
  loanTerm: z.number().min(24).max(84),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
