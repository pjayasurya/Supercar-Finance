'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { applicationApi, creditApi } from '@/lib/api';
import { useApplicationStore } from '@/store/application';
import { useState } from 'react';

const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\d{10}$/, 'Valid 10-digit phone required'),
  ssn: z.string().regex(/^\d{9}$/, 'Valid SSN required'),
  dob: z.string().min(10, 'Date of birth required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().length(2, 'Valid state code required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Valid ZIP code required'),
  annualIncome: z.number().min(50000, 'Annual income must be at least $50,000'),
  employmentStatus: z.enum(['employed', 'self-employed', 'retired']),
  downPayment: z.number().min(10000, 'Down payment must be at least $10,000'),
  desiredLoanAmount: z.number().min(80000, 'Loan amount must be between $80K-$500K').max(500000),
  loanTerm: z.number().min(24).max(84),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function CreditApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setApplicationData, setPreApprovals, setCreditScore } =
    useApplicationStore();

  const onSubmit = async (data: ApplicationFormData) => {
    setLoading(true);
    setError('');

    try {
      // Create application record
      const appResponse = await applicationApi.createApplication(data);
      const applicationId = appResponse.data.id;

      // Get credit analysis (soft pull)
      const creditResponse = await creditApi.getCreditAnalysis(applicationId);
      setCreditScore(creditResponse.data.ficoScore, creditResponse.data.factors);

      // Get pre-approvals
      const preAppResponse = await creditApi.getPreApprovals(applicationId);
      setPreApprovals(preAppResponse.data.approvals);

      // Store application data
      setApplicationData(data);

      // Redirect to results
      window.location.href = `/pre-approvals?id=${applicationId}`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone (10 digits)
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="5551234567"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* SSN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            SSN (9 digits)
          </label>
          <input
            {...register('ssn')}
            type="password"
            placeholder="●●●●●●●●●"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.ssn && (
            <p className="mt-1 text-sm text-red-600">{errors.ssn.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            {...register('dob')}
            type="date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            {...register('address')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            {...register('city')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State (2-letter code)
          </label>
          <input
            {...register('state')}
            type="text"
            maxLength={2}
            placeholder="CA"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            {...register('zipCode')}
            type="text"
            maxLength={5}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Annual Income ($)
          </label>
          <input
            {...register('annualIncome', { valueAsNumber: true })}
            type="number"
            placeholder="100000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.annualIncome && (
            <p className="mt-1 text-sm text-red-600">{errors.annualIncome.message}</p>
          )}
        </div>

        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employment Status
          </label>
          <select
            {...register('employmentStatus')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          >
            <option value="">Select...</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="retired">Retired</option>
          </select>
          {errors.employmentStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.employmentStatus.message}</p>
          )}
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Down Payment ($)
          </label>
          <input
            {...register('downPayment', { valueAsNumber: true })}
            type="number"
            placeholder="50000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.downPayment && (
            <p className="mt-1 text-sm text-red-600">{errors.downPayment.message}</p>
          )}
        </div>

        {/* Desired Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Desired Loan Amount ($80K-$500K)
          </label>
          <input
            {...register('desiredLoanAmount', { valueAsNumber: true })}
            type="number"
            placeholder="200000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.desiredLoanAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.desiredLoanAmount.message}</p>
          )}
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Term (months: 24-84)
          </label>
          <input
            {...register('loanTerm', { valueAsNumber: true })}
            type="number"
            placeholder="60"
            min="24"
            max="84"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-luxury-500 focus:outline-none focus:ring-luxury-500"
          />
          {errors.loanTerm && (
            <p className="mt-1 text-sm text-red-600">{errors.loanTerm.message}</p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 space-y-2">
        <p>
          🔒 <strong>Secure soft pull:</strong> We use soft-pull credit inquiries that
          don&apos;t affect your credit score. Your information is encrypted and
          protected.
        </p>
        <p>
          ✓ <strong>FCRA Compliant:</strong> We comply with all Federal Credit
          Reporting Act requirements and maintain strict data privacy.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-luxury-500 px-4 py-3 font-semibold text-white hover:bg-luxury-600 disabled:bg-gray-400 transition duration-200"
      >
        {loading ? 'Processing Your Application...' : 'Get Pre-Approved in 60 Seconds'}
      </button>
    </form>
  );
}
