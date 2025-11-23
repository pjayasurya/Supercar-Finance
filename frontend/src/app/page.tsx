'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-luxury-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-luxury-red to-luxury-red-dark rounded-2xl flex items-center justify-center shadow-lg shadow-luxury-red/20">
              <span className="text-white font-serif font-bold text-xl">RF</span>
            </div>
            <span className="text-xl font-serif font-bold tracking-wide">Revline Financing</span>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-luxury-platinum text-sm hidden sm:inline">{user.email}</span>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-luxury-red/50 hover:bg-white/10 transition-all duration-300"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-luxury-red to-luxury-red-dark text-white font-semibold hover:shadow-lg hover:shadow-luxury-red/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury_supercar_hero.png"
            alt="Luxury Supercar"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 via-luxury-black/20 to-luxury-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-luxury-red/30 bg-luxury-red/10 backdrop-blur-sm">
            <span className="text-luxury-red text-sm font-medium tracking-wider uppercase">The Art of Financing</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight">
            Drive Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-red via-luxury-red-light to-luxury-red">Dream Today</span>
          </h1>
          <p className="text-xl md:text-2xl text-luxury-platinum/80 mb-10 max-w-2xl mx-auto font-light">
            Experience the pinnacle of automotive financing. Instant pre-approvals for the world's most exclusive vehicles.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/apply"
              className="group relative px-8 py-4 bg-luxury-red text-white font-bold text-lg rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(208,0,0,0.5)]"
            >
              <span className="relative z-10">Start Application</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-luxury-red/50 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: '60s', label: 'Approval Time', desc: 'Lightning fast processing' },
              { stat: '$500k+', label: 'Loan Amount', desc: 'High-limit financing' },
              { stat: '0', label: 'Credit Impact', desc: 'Soft pull only' },
            ].map((item) => (
              <div key={item.label} className="smooth-card p-8 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <p className="text-5xl font-serif font-bold text-luxury-red mb-2">{item.stat}</p>
                <p className="text-white font-medium text-lg">{item.label}</p>
                <p className="text-luxury-platinum/60 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-luxury-charcoal relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-red/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Excellence in Every Detail</h2>
            <p className="text-luxury-platinum/60 text-lg max-w-2xl mx-auto">
              We've reimagined the financing experience to match the sophistication of the cars we fund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Intelligence',
                description: 'Our AI-driven engine matches you with premium lenders in seconds, not days.',
                icon: '⚡',
              },
              {
                title: 'Privacy First',
                description: 'Bank-grade encryption and FCRA compliance ensure your data remains secure.',
                icon: '🔒',
              },
              {
                title: 'Exclusive Inventory',
                description: 'Access a curated selection of vehicles from the nation\'s top exotic dealers.',
                icon: '🏎️',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-luxury-red/30 hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-luxury-red/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-luxury-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-luxury-platinum/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black to-luxury-charcoal"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8">
            Your <span className="text-luxury-red">Supercar</span> Awaits
          </h2>
          <p className="text-xl text-luxury-platinum/80 mb-12">
            Join the exclusive circle of drivers who demand the best in financing.
          </p>
          <Link
            href="/apply"
            className="inline-block px-12 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-luxury-red hover:text-white hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-luxury-red font-serif font-bold text-lg">RF</span>
            <span className="text-white/50 text-sm">© 2024 Revline Financing</span>
          </div>
          <div className="flex space-x-8 text-sm text-white/50">
            <a href="#" className="hover:text-luxury-red transition-colors">Privacy</a>
            <a href="#" className="hover:text-luxury-red transition-colors">Terms</a>
            <a href="#" className="hover:text-luxury-red transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
