'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-luxury-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-luxury-700 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-luxury-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SF</span>
            </div>
            <span className="text-xl font-bold text-white">Supercar Finance</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white text-sm">{user.email}</span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-luxury-500 text-white hover:bg-luxury-600 transition"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-lg bg-luxury-500 text-white hover:bg-luxury-600 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif">
            Supercar <span className="text-luxury-400">Financing</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get pre-approved from multiple lenders in 60 seconds. No credit damage. One soft pull.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-8 py-4 rounded-lg bg-luxury-500 text-white font-semibold hover:bg-luxury-600 transition text-lg"
            >
              Start Application
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-lg border border-luxury-500 text-luxury-400 font-semibold hover:bg-luxury-500/10 transition text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Instant Pre-Approvals',
              description: 'See offers from multiple lenders in under 60 seconds',
              icon: '⚡',
            },
            {
              title: 'Soft Credit Pull',
              description: 'Your credit score never takes a hit',
              icon: '🛡️',
            },
            {
              title: 'Exotic Cars Only',
              description: 'Browse supercars filtered by your approval amount',
              icon: '🏎️',
            },
            {
              title: 'Compare Offers',
              description: 'Side-by-side rates, terms, and loan amounts',
              icon: '📊',
            },
            {
              title: 'Fast Lender Connection',
              description: 'Your application goes directly to lenders',
              icon: '🚀',
            },
            {
              title: 'FCRA Compliant',
              description: 'Enterprise-grade security and privacy',
              icon: '🔒',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-luxury-700 bg-luxury-900/50 p-6 hover:border-luxury-500 transition"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '<60s', label: 'App to Pre-Approval' },
            { stat: '40%+', label: 'Approval Rate' },
            { stat: '$80K-$500K', label: 'Loan Range' },
          ].map((item) => (
            <div key={item.stat}>
              <p className="text-4xl font-bold text-luxury-400">{item.stat}</p>
              <p className="text-gray-400 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-luxury-700 bg-luxury-900/50 py-20 mt-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to finance your supercar?</h2>
          <p className="text-gray-300 mb-8">
            No credit impact. Multiple pre-approvals. Full transparency.
          </p>
          <Link
            href="/apply"
            className="inline-block px-8 py-4 rounded-lg bg-luxury-500 text-white font-semibold hover:bg-luxury-600 transition text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-luxury-700 bg-black/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>
              © 2024 Supercar Finance. All rights reserved. FCRA Compliant. Data encrypted.
            </p>
            <div className="mt-4 space-x-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
