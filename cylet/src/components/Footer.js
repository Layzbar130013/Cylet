import React, { useState } from 'react';
import { Icon } from './Icons.js';

export const Footer = ({ setActivePage, addToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    setSubscribed(true);
    addToast({
      title: 'Welcome to the Cylet Club!',
      message: 'Check your inbox for a 20% discount code (FRESH20).',
      type: 'success'
    });
  };

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Promo Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block bg-amber-400 text-slate-900 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-3">
                Join 50,000+ Fresh Shoppers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get KSh 300 Off Your First Groceries Order
              </h3>
              <p className="text-emerald-100 text-sm mt-2">
                Receive weekly seasonal recipes, branch-exclusive flash deals, and farm-fresh harvest alerts directly to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
              {subscribed ? (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/30 flex items-center justify-center gap-2">
                  <Icon name="Check" className="w-5 h-5 text-emerald-300" />
                  <span className="font-semibold text-sm">You're subscribed! Use promo code FRESH20</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    aria-label="Email address for grocery newsletter"
                    required
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 shrink-0"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
                alt="Cylet Supermarket Logo"
                className="h-10 w-auto max-w-[130px] object-cover rounded-lg border border-slate-700 shadow-sm"
              />
              <span className="text-2xl font-black text-white">
                Cylet <span className="text-emerald-400 text-lg font-bold">Supermarket</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your premier community supermarket on Siakago Road (near Kubukubu Rd.) in Embu, Kenya. Delivering 100% pasture-raised meats, organic farm produce, freshly baked artisan breads, and everyday household essentials.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-300 pt-2">
              <a href="tel:+254202003310" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="Phone" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+254 20 2003310</span>
              </a>
              <a href="mailto:cyletsupermarkets@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="Mail" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>cyletsupermarkets@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Icon name="MapPin" className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Embu - Siakago Road (near Kubukubu Rd.), Embu, Kenya</span>
            </div>
          </div>

          {/* Supermarket Aisles */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop Aisles</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Organic Produce</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Meat & Wild Seafood</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Dairy & Farm Eggs</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Artisan Hearth Bakery</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Beverages & Juices</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Eco Household & Cleaning</button></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company & Stores</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('locator')} className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">10 Branch Locations</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors">About Cylet</button></li>
              <li><button onClick={() => navigate('careers')} className="hover:text-emerald-400 transition-colors">Careers & Hiring</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-emerald-400 transition-colors">Help & FAQ Center</button></li>
              <li><button onClick={() => navigate('cart')} className="hover:text-emerald-400 transition-colors">My Cart</button></li>
              <li><button onClick={() => navigate('login')} className="hover:text-emerald-400 transition-colors">Sign In / My Account</button></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Accepted Payments</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Fast, secure digital checkout. Pay online or upon delivery:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Icon name="CreditCard" className="w-3.5 h-3.5 text-blue-400" />
                <span>Credit Card</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Icon name="Smartphone" className="w-3.5 h-3.5 text-green-400" />
                <span>M-Pesa Pay</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5 col-span-2">
                <Icon name="DollarSign" className="w-3.5 h-3.5 text-amber-400" />
                <span>Cash on Delivery / Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Cylet Supermarkets Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Food Safety Standards</span>
            <span className="text-emerald-400 font-medium">100% Quality Inspected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
