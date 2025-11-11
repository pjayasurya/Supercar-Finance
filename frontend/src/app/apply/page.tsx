'use client';

import React from 'react';
import { CreditApplicationForm } from '@/components/CreditApplicationForm';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-lg font-bold text-luxury-600 hover:text-luxury-700">
            ← Supercar Finance
          </Link>
        </div>
      </nav>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Pre-Approved for Your Supercar
          </h1>
          <p className="text-gray-600 mb-8">
            Complete this quick application and instantly see offers from multiple lenders.
          </p>

          <CreditApplicationForm />

          <div className="mt-8 space-y-4 text-sm text-gray-600 border-t border-gray-200 pt-8">
            <p>
              🔐 <strong>Your data is secure:</strong> Encrypted with AES-256. FCRA compliant.
            </p>
            <p>
              ✓ <strong>Soft pull only:</strong> No hard inquiry. No credit score impact.
            </p>
            <p>
              ⚡ <strong>Instant results:</strong> See pre-approvals in under 60 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
