'use client';

import React from 'react';
import { PreApprovalResults } from '@/components/PreApprovalResults';
import Link from 'next/link';

export default function PreApprovalsPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-luxury-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-luxury-gold group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="text-lg font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">
              Revline Financing
            </span>
          </Link>
          <span className="text-sm text-luxury-platinum/60 font-medium tracking-wider uppercase">Step 2: Select Lender</span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Congratulations! <span className="text-luxury-gold">You're Approved</span>
          </h1>
          <p className="text-xl text-luxury-platinum/80">
            Select a premium lender below to finance your dream car.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Line */}
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-2 bg-luxury-black px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                ✓
              </div>
              <span className="text-xs font-medium text-luxury-gold uppercase tracking-wider">Application</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-2 bg-luxury-black px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-luxury-gold bg-luxury-black text-luxury-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                2
              </div>
              <span className="text-xs font-medium text-white uppercase tracking-wider">Select Lender</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-2 bg-luxury-black px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-luxury-black text-white/50 font-bold">
                3
              </div>
              <span className="text-xs font-medium text-luxury-platinum/40 uppercase tracking-wider">Select Car</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <PreApprovalResults />
      </div>
    </div>
  );
}
