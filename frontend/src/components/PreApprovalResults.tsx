'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApplicationStore } from '@/store/application';
import { applicationApi, creditApi } from '@/lib/api';

export function PreApprovalResults() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  const { preApprovals, ficoScore, creditFactors, selectedLender, setSelectedLender, setPreApprovals, setCreditScore } =
    useApplicationStore();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (applicationId) {
        try {
          // Fetch pre-approvals
          const approvalRes = await creditApi.getPreApprovals(applicationId);
          const approvals = approvalRes.data.approvals.map((item: any, index: number) => ({
            lenderId: item.lender_id || `lender_${index}`,
            lenderName: item.lender_name,
            maxLoanAmount: item.max_amount,
            interestRate: item.apr,
            monthlyPayment: item.monthly_payment,
            terms: item.term,
            approved: item.status === 'approved',
          }));
          setPreApprovals(approvals);

          // Fetch credit analysis
          const analysisRes = await creditApi.getCreditAnalysis(applicationId);
          const analysis = analysisRes.data;
          setCreditScore(analysis.score, analysis.factors.map((f: any) => f.name));
        } catch (error) {
          console.error('Failed to fetch results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (preApprovals.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [applicationId, preApprovals.length, setPreApprovals, setCreditScore]);

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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red"></div>
          <p className="mt-4 text-gray-600">Processing your application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Credit Score Card */}
      {ficoScore && (
        <div className="smooth-card p-6">
          <h3 className="text-lg font-semibold text-white">Your Credit Analysis</h3>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-luxury-platinum/70">FICO Auto Score 8</p>
              <p className="text-4xl font-bold text-luxury-red">{ficoScore}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-luxury-platinum/70 mb-2">Key Factors</p>
              <ul className="text-sm text-luxury-platinum space-y-1">
                {creditFactors?.slice(0, 3).map((factor, idx) => (
                  <li key={idx}>• {factor}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-luxury-platinum/50">
            ✓ Soft pull only - No impact on your credit score
          </p>
        </div>
      )}

      {/* Pre-Approval Results */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Pre-Approvals
        </h3>
        <div className="space-y-4">
          {preApprovals.map((approval) => (
            <div
              key={approval.lenderId}
              className={`rounded-3xl border-2 p-6 transition-all ${selectedLender === approval.lenderId
                ? 'border-luxury-red bg-luxury-charcoal/80'
                : 'border-white/10 bg-luxury-charcoal/40 hover:border-luxury-red/50'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">
                    {approval.lenderName}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-white">
                      ${approval.maxLoanAmount.toLocaleString()}
                    </span>{' '}
                    max loan
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-luxury-platinum/70">Interest Rate</p>
                      <p className="text-xl font-bold text-white">
                        {approval.interestRate.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-luxury-platinum/70">Est. Monthly</p>
                      <p className="text-xl font-bold text-white">
                        ${approval.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-luxury-platinum/70">Term</p>
                      <p className="text-xl font-bold text-white">
                        {approval.terms} months
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectLender(approval.lenderId)}
                  disabled={exporting && selectedLender === approval.lenderId}
                  className="ml-4 rounded-full bg-luxury-red px-6 py-2 font-semibold text-white hover:bg-luxury-red-dark disabled:bg-gray-600 transition duration-200 whitespace-nowrap"
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
