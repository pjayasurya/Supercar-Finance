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

  const inputClasses = "mt-1 block w-full rounded-2xl border border-white/10 bg-luxury-charcoal/50 px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:border-luxury-red focus:ring-1 focus:ring-luxury-red focus:outline-none transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-luxury-platinum/90 mb-1";
  const errorClasses = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-500/20 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Personal Info Section */}
        <div className="sm:col-span-2">
          <h3 className="text-lg font-serif font-bold text-white mb-4 border-b border-white/10 pb-2">Personal Information</h3>
        </div>

        {/* First Name */}
        <div>
          <label className={labelClasses}>First Name</label>
          <input {...register('firstName')} type="text" className={inputClasses} placeholder="John" />
          {errors.firstName && <p className={errorClasses}>{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className={labelClasses}>Last Name</label>
          <input {...register('lastName')} type="text" className={inputClasses} placeholder="Doe" />
          {errors.lastName && <p className={errorClasses}>{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email</label>
          <input {...register('email')} type="email" className={inputClasses} placeholder="john@example.com" />
          {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelClasses}>Phone (10 digits)</label>
          <input {...register('phone')} type="tel" className={inputClasses} placeholder="5551234567" />
          {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
        </div>

        {/* SSN */}
        <div>
          <label className={labelClasses}>SSN (9 digits)</label>
          <input {...register('ssn')} type="password" className={inputClasses} placeholder="●●●●●●●●●" />
          {errors.ssn && <p className={errorClasses}>{errors.ssn.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className={labelClasses}>Date of Birth</label>
          <input {...register('dob')} type="date" className={inputClasses} />
          {errors.dob && <p className={errorClasses}>{errors.dob.message}</p>}
        </div>

        {/* Address Section */}
        <div className="sm:col-span-2 mt-4">
          <h3 className="text-lg font-serif font-bold text-white mb-4 border-b border-white/10 pb-2">Address Details</h3>
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className={labelClasses}>Street Address</label>
          <input {...register('address')} type="text" className={inputClasses} placeholder="123 Luxury Lane" />
          {errors.address && <p className={errorClasses}>{errors.address.message}</p>}
        </div>

        {/* City */}
        <div>
          <label className={labelClasses}>City</label>
          <input {...register('city')} type="text" className={inputClasses} placeholder="Beverly Hills" />
          {errors.city && <p className={errorClasses}>{errors.city.message}</p>}
        </div>

        {/* State & Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>State</label>
            <input {...register('state')} type="text" maxLength={2} className={inputClasses} placeholder="CA" />
            {errors.state && <p className={errorClasses}>{errors.state.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>ZIP Code</label>
            <input {...register('zipCode')} type="text" maxLength={5} className={inputClasses} placeholder="90210" />
            {errors.zipCode && <p className={errorClasses}>{errors.zipCode.message}</p>}
          </div>
        </div>

        {/* Financial Info Section */}
        <div className="sm:col-span-2 mt-4">
          <h3 className="text-lg font-serif font-bold text-white mb-4 border-b border-white/10 pb-2">Financial Profile</h3>
        </div>

        {/* Annual Income */}
        <div>
          <label className={labelClasses}>Annual Income ($)</label>
          <input {...register('annualIncome', { valueAsNumber: true })} type="number" className={inputClasses} placeholder="250000" />
          {errors.annualIncome && <p className={errorClasses}>{errors.annualIncome.message}</p>}
        </div>

        {/* Employment Status */}
        <div>
          <label className={labelClasses}>Employment Status</label>
          <select {...register('employmentStatus')} className={inputClasses}>
            <option value="" className="bg-luxury-charcoal">Select...</option>
            <option value="employed" className="bg-luxury-charcoal">Employed</option>
            <option value="self-employed" className="bg-luxury-charcoal">Self-Employed</option>
            <option value="retired" className="bg-luxury-charcoal">Retired</option>
          </select>
          {errors.employmentStatus && <p className={errorClasses}>{errors.employmentStatus.message}</p>}
        </div>

        {/* Down Payment */}
        <div>
          <label className={labelClasses}>Down Payment ($)</label>
          <input {...register('downPayment', { valueAsNumber: true })} type="number" className={inputClasses} placeholder="50000" />
          {errors.downPayment && <p className={errorClasses}>{errors.downPayment.message}</p>}
        </div>

        {/* Desired Loan Amount */}
        <div>
          <label className={labelClasses}>Desired Loan Amount ($)</label>
          <input {...register('desiredLoanAmount', { valueAsNumber: true })} type="number" className={inputClasses} placeholder="200000" />
          {errors.desiredLoanAmount && <p className={errorClasses}>{errors.desiredLoanAmount.message}</p>}
        </div>

        {/* Loan Term */}
        <div className="sm:col-span-2">
          <label className={labelClasses}>Loan Term (Months)</label>
          <div className="flex items-center space-x-4">
            <input
              {...register('loanTerm', { valueAsNumber: true })}
              type="range"
              min="24"
              max="84"
              step="12"
              className="w-full h-2 bg-luxury-charcoal rounded-lg appearance-none cursor-pointer accent-luxury-red"
            />
            <span className="text-white font-mono w-12 text-center">60</span>
          </div>
          {errors.loanTerm && <p className={errorClasses}>{errors.loanTerm.message}</p>}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full group relative overflow-hidden rounded-full bg-luxury-red px-8 py-4 font-bold text-white transition-all hover:shadow-[0_0_40px_-10px_rgba(208,0,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                Get Instant Pre-Approval
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        <p className="text-center text-xs text-luxury-platinum/50 mt-4">
          By clicking "Get Instant Pre-Approval", you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  );
}
