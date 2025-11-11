'use client';

import React from 'react';
import { VehicleFilter } from '@/components/VehicleFilter';
import Link from 'next/link';

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-luxury-600 hover:text-luxury-700">
            ← Supercar Finance
          </Link>
          <span className="text-sm text-gray-600">Step 3: Browse Vehicles</span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Available Supercars
          </h1>
          <p className="text-xl text-gray-600">
            See vehicles within your pre-approved budget
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-luxury-500 text-white font-semibold">
              ✓
            </div>
            <span className="text-gray-700 font-semibold">Application</span>
          </div>
          <div className="flex-1 mx-4 border-t-2 border-luxury-500"></div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-luxury-500 text-white font-semibold">
              ✓
            </div>
            <span className="text-gray-700 font-semibold">Lender Selected</span>
          </div>
          <div className="flex-1 mx-4 border-t-2 border-luxury-500"></div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-luxury-500 text-white font-semibold">
              3
            </div>
            <span className="text-gray-700 font-semibold">Choose Car</span>
          </div>
        </div>

        {/* Vehicle Filter */}
        <VehicleFilter />
      </div>
    </div>
  );
}
