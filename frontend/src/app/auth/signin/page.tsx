'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, isUsingMockAuth, MockUser } from '@/lib/firebase';

// Mock authentication for development
const mockAuthStore = new Map<string, { email: string; password: string }>();

async function mockSignIn(email: string, password: string): Promise<MockUser> {
  const stored = mockAuthStore.get(email);
  if (!stored || stored.password !== password) {
    throw new Error('auth/wrong-password');
  }
  return {
    uid: 'mock_' + email.replace('@', '_'),
    email,
    displayName: email.split('@')[0],
    getIdToken: async () => 'mock_token_' + Date.now(),
  };
}

async function mockSignUp(email: string, password: string): Promise<MockUser> {
  if (mockAuthStore.has(email)) {
    throw new Error('auth/email-already-in-use');
  }
  if (password.length < 6) {
    throw new Error('auth/weak-password');
  }
  mockAuthStore.set(email, { email, password });
  return {
    uid: 'mock_' + email.replace('@', '_'),
    email,
    displayName: email.split('@')[0],
    getIdToken: async () => 'mock_token_' + Date.now(),
  };
}

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;

      if (isUsingMockAuth) {
        // Use mock authentication
        if (isSignUp) {
          user = await mockSignUp(email, password);
        } else {
          user = await mockSignIn(email, password);
        }
        // Store mock user in localStorage
        localStorage.setItem('mockUser', JSON.stringify(user));
        localStorage.setItem('authToken', await user.getIdToken());
      } else {
        // Use Firebase authentication
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      }

      // Redirect to home page after successful auth
      router.push('/');
    } catch (err: any) {
      const errorCode = err.code || err.message;
      const errorMessage = err.message || 'Authentication failed';

      // Parse error messages
      if (errorCode === 'auth/user-not-found') {
        setError('User not found. Try signing up instead.');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Email already in use. Try signing in instead.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (errorMessage.includes('api-key')) {
        setError('Firebase not configured. Using mock authentication for demo.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-luxury-900 to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg border border-luxury-700 bg-black/50 p-8 backdrop-blur">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="text-2xl font-bold text-luxury-400">
                SF
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isSignUp
                ? 'Join Revline Financing for instant pre-approvals'
                : 'Access your applications and dashboard'}
            </p>
            {isUsingMockAuth && (
              <p className="text-xs text-luxury-300 mt-2 bg-luxury-900/50 rounded px-2 py-1">
                📝 Demo Mode - Using Mock Authentication
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50/10 border border-red-500/30 p-3 text-sm text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-luxury-700 bg-black/30 px-4 py-2 text-white placeholder-gray-500 focus:border-luxury-500 focus:outline-none disabled:opacity-50"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-luxury-700 bg-black/30 px-4 py-2 text-white placeholder-gray-500 focus:border-luxury-500 focus:outline-none disabled:opacity-50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-luxury-500 px-4 py-2 font-semibold text-white hover:bg-luxury-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 mt-6"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-luxury-400 hover:text-luxury-300 font-semibold transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-300 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-lg border border-luxury-700/50 bg-black/30 p-6 backdrop-blur">
          <h3 className="text-sm font-semibold text-white mb-3">
            {isUsingMockAuth ? '📝 Demo Mode Instructions' : '🔐 Production Mode'}
          </h3>
          {isUsingMockAuth ? (
            <div className="space-y-2 text-xs text-gray-400">
              <p>
                ✅ <strong>Mock authentication is active</strong> - you can sign up and sign in without Firebase.
              </p>
              <p>
                📧 <strong>Try these steps:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click "Sign Up"</li>
                <li>Enter any email (e.g., demo@example.com)</li>
                <li>Enter a password (6+ characters)</li>
                <li>Click "Create Account"</li>
              </ol>
              <p className="mt-3">
                🔧 <strong>To use real Firebase:</strong> Add valid credentials to <code className="bg-black/50 px-1 py-0.5 rounded text-luxury-300">frontend/.env.local</code>
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              ✅ Firebase authentication is configured and active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
