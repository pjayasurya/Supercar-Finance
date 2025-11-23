'use client';

import React from 'react';
import { CreditApplicationForm } from '@/components/CreditApplicationForm';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-luxury-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-luxury-gold group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="text-lg font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">
              Revline Financing
            </span>
          </Link>
        </div>
      </nav>

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Secure Your <span className="text-luxury-gold">Pre-Approval</span>
          </h1>
          <p className="text-luxury-platinum/80 text-lg max-w-2xl mx-auto">
            Complete this secure application to view personalized offers from our network of premium lenders.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10 shadow-2xl shadow-black/50">
          <CreditApplicationForm />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-luxury-platinum/60 border-t border-white/10 pt-8">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">🔒</span>
              <span><strong>Bank-Grade Security</strong><br />AES-256 Encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">🛡️</span>
              <span><strong>Soft Credit Pull</strong><br />No Score Impact</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">⚡</span>
              <span><strong>Instant Decisions</strong><br />Real-time Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
