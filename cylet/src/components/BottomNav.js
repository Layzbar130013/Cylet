import React from 'react';
import { Icon } from './Icons.js';

export const BottomNav = ({
  activePage,
  setActivePage,
  cartCount,
  onOpenCartDrawer,
  onOpenAccountModal,
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'Leaf',
      action: () => {
        setActivePage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: 'Sparkles',
      action: () => {
        setActivePage('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'shop',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: 'ShoppingCart',
      badge: cartCount,
      action: () => {
        // Slide out cart drawer on mobile
        onOpenCartDrawer();
      },
      isActive: false, // Cart opens drawer
    },
    {
      id: 'locator',
      label: 'Stores',
      icon: 'MapPin',
      action: () => {
        setActivePage('locator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'locator',
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      action: () => {
        onOpenAccountModal();
      },
      isActive: false,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 py-1 rounded-2xl transition-all active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                active
                  ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold'
              }`}
              aria-label={item.label}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon
                  name={item.icon}
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                  }`}
                />

                {/* Cart Badge Count */}
                {item.id === 'cart' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] leading-tight mt-0.5 tracking-tight ${
                  active ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
