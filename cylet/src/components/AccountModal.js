import React, { useEffect } from 'react';
import { Icon } from './Icons.js';

export const AccountModal = ({
  isOpen,
  onClose,
  currentStore,
  stores,
  onSelectStore,
  setActivePage,
  addToast,
  currentUser,
}) => {
  // Close modal on Escape key press (WCAG Keyboard Accessibility)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = currentUser
    ? (currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase())
    : 'GS';
  const displayName = currentUser?.name || 'Guest Shopper';
  const displayEmail = currentUser?.email || 'Sign in to save addresses & earn points';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Customer Account Profile"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/30">
                {initials}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{displayName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{displayEmail}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label="Close account modal"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* FreshRewards Loyalty Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-5 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                FreshRewards Member
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Gold Tier</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black">350 Points</span>
                <span className="block text-[11px] text-emerald-100">KSh 350 grocery discount available</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  addToast({
                    title: 'Points Ready',
                    message: 'Use promo code FRESH20 for 20% savings today!',
                    type: 'success',
                  });
                }}
                className="min-h-[44px] px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                Redeem
              </button>
            </div>
          </div>

          {/* Current Branch Selector */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Icon name="MapPin" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Preferred Branch</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  setActivePage('locator');
                }}
                className="min-h-[44px] text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center focus-visible:ring-2 focus-visible:ring-emerald-500 rounded outline-none"
              >
                Change Map
              </button>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{currentStore?.name}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{currentStore?.address} • {currentStore?.hours?.weekday}</p>
          </div>

          {/* Quick Account Navigation Links */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              My Grocery Preferences
            </h4>

            {[
              {
                label: 'Order History & Receipts',
                icon: 'Truck',
                action: () => {
                  onClose();
                  setActivePage('account');
                },
              },
              {
                label: 'Saved Delivery Addresses',
                icon: 'Navigation',
                action: () => {
                  onClose();
                  setActivePage('account');
                },
              },
              {
                label: 'Find Nearest Branch (10 Stores)',
                icon: 'MapPin',
                action: () => {
                  onClose();
                  setActivePage('locator');
                },
              },
              {
                label: 'Customer Support & FAQ',
                icon: 'Phone',
                action: () => {
                  onClose();
                  setActivePage('contact');
                },
              },
              {
                label: 'Sign In / Switch Account',
                icon: 'User',
                action: () => {
                  onClose();
                  setActivePage('login');
                },
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              >
                <div className="flex items-center gap-3">
                  <Icon name={btn.icon} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{btn.label}</span>
                </div>
                <Icon name="ChevronRight" className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors text-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
