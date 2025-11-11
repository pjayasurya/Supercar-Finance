'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApplicationStore } from '@/store/application';
import { applicationApi } from '@/lib/api';

export function PreApprovalResults() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  const { preApprovals, ficoScore, creditFactors, selectedLender, setSelectedLender } =
    useApplicationStore();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (preApprovals.length === 0 && applicationId) {
      // Fetch if not in store
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [applicationId, preApprovals.length]);

  const handleSelectLender = async (lenderId: string) => {
    setSelectedLender(lenderId);
    setExporting(true);

    try {
      await applicationApi.exportToLender(applicationId!, lenderId);
      // Redirect to vehicle selection or confirmation
      window.location.href = `/vehicles?lenderId=${lenderId}&appId=${applicationId}`;
    } catch (error) {
      console.error('Failed to select lender:', error);
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-500"></div>
          <p className="mt-4 text-gray-600">Processing your application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Credit Score Card */}
      {ficoScore && (
        <div className="rounded-lg border border-luxury-200 bg-luxury-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Credit Analysis</h3>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">FICO Auto Score 8</p>
              <p className="text-4xl font-bold text-luxury-600">{ficoScore}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Key Factors</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {creditFactors?.slice(0, 3).map((factor, idx) => (
                  <li key={idx}>• {factor}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-600">
            ✓ Soft pull only - No impact on your credit score
          </p>
        </div>
      )}

      {/* Pre-Approval Results */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Pre-Approvals
        </h3>
        <div className="space-y-4">
          {preApprovals.map((approval) => (
            <div
              key={approval.lenderId}
              className={`rounded-lg border-2 p-6 transition-all ${
                selectedLender === approval.lenderId
                  ? 'border-luxury-500 bg-luxury-50'
                  : 'border-gray-200 bg-white hover:border-luxury-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {approval.lenderName}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      ${approval.maxLoanAmount.toLocaleString()}
                    </span>{' '}
                    max loan
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Interest Rate</p>
                      <p className="text-xl font-bold text-gray-900">
                        {approval.interestRate.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Est. Monthly</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${approval.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Term</p>
                      <p className="text-xl font-bold text-gray-900">
                        {approval.terms} months
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectLender(approval.lenderId)}
                  disabled={exporting && selectedLender === approval.lenderId}
                  className="ml-4 rounded-lg bg-luxury-500 px-6 py-2 font-semibold text-white hover:bg-luxury-600 disabled:bg-gray-400 transition duration-200 whitespace-nowrap"
                >
                  {exporting && selectedLender === approval.lenderId
                    ? 'Processing...'
                    : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {preApprovals.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
          <p className="text-gray-900 font-semibold">No Pre-Approvals Available</p>
          <p className="mt-2 text-sm text-gray-600">
            Unfortunately, we couldn't find matching lenders for your profile at this
            time. Please try again later or contact our support team.
          </p>
        </div>
      )}
    </div>
  );
}
