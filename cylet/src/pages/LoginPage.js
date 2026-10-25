import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';
import { authenticateMockUser, getStoredUsers } from '../data/users.js';

/**
 * Universal Login Page (/login)
 * Supports authentication for Customers, Store Managers, and Super Administrators,
 * as well as instant new customer registration.
 */
export const LoginPage = ({
  onLoginSuccess,
  onNavigate,
  initialError = '',
  darkMode,
  onToggleDarkMode,
  addToast,
  users,
  onRegisterUser,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (isSignUp) {
        // Handle new customer account registration
        const pool = (Array.isArray(users) && users.length > 0) ? users : getStoredUsers();
        const normalizedEmail = email.trim().toLowerCase();
        const alreadyExists = pool.some(
          (u) => u.email?.toLowerCase().trim() === normalizedEmail
        );

        if (alreadyExists) {
          setError('An account with this email address already exists. Please sign in instead.');
          return;
        }

        const newUser = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password: password.trim(),
          role: 'customer',
          title: 'Customer Shopper',
          avatar: name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'CS',
          badgeColor: 'amber',
          status: 'Active',
          branch: 'Siakago Road (near Kubukubu Rd.) - Embu, Kenya',
          lastLogin: 'Just now',
          loyaltyPoints: 150,
          savedAddresses: [
            {
              id: `addr-${Date.now()}`,
              title: 'Default Address',
              address: 'Embu - Siakago Road',
              city: 'Embu',
              phone: '+254 700 000 000',
              isDefault: true,
            },
          ],
          orderHistory: [],
        };

        try {
          const current = getStoredUsers();
          localStorage.setItem('cylet_users_db', JSON.stringify([...current, newUser]));
        } catch (err) {
          console.error(err);
        }

        if (onRegisterUser) {
          onRegisterUser(newUser);
        }

        if (addToast) {
          addToast({
            title: 'Account Created',
            message: `Welcome to Cylet, ${newUser.name}!`,
            type: 'success',
          });
        }
        onLoginSuccess(newUser);
      } else {
        // Handle login verification against mock and dynamically stored users
        const user = authenticateMockUser(email, password, users);
        if (user) {
          if (addToast) {
            addToast({
              title: 'Welcome Back!',
              message: `Signed in as ${user.name} (${user.role.toUpperCase()})`,
              type: 'success',
            });
          }
          onLoginSuccess(user);
        } else {
          setError('Failed to Login: Invalid email or password.');
        }
      }
    }, 250);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Banner Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
              alt="Cylet Supermarket"
              className="h-12 w-auto max-w-[220px] object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Create Your Cylet Account' : 'Sign In to Cylet'}
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            {isSignUp
              ? 'Join thousands of fresh grocery shoppers in Embu, Kenya'
              : 'Access your orders, saved addresses, or management console'}
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-in fade-in duration-200">
              <Icon name="AlertTriangle" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <Icon name="User" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Peter Kariuki"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Icon name="Mail" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cylet.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password *
                </label>
              </div>
              <div className="relative">
                <Icon name="ShieldCheck" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (addToast) {
                      addToast({
                        title: 'Password Assistance',
                        message: 'Please contact support at cyletsupermarkets@gmail.com to reset your password.',
                        type: 'info',
                      });
                    }
                  }}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <Icon name="ArrowRight" className="w-4 h-4" />
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Create Account */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-block ml-1"
              >
                {isSignUp ? 'Sign In' : 'Create an Account'}
              </button>
            </p>
          </div>

          {/* Back to store navigation */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Icon name="ArrowRight" className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Storefront Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
