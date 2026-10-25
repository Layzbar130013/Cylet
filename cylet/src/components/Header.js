import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons.js';
import { CATEGORIES } from '../data/products.js';
import { formatKES } from '../utils/currency.js';

export const Header = ({
  activePage,
  setActivePage,
  cartCount,
  cartTotal,
  currentStore,
  stores,
  onSelectStore,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  allProducts,
  onOpenProductDetail,
  onOpenCartDrawer,
  onOpenAccountModal,
  darkMode,
  onToggleDarkMode,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const storeDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Filter search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSearchResults(matches);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  // Close dropdowns on outside click or Escape key press (WCAG Keyboard Accessibility)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(e.target)) {
        setStoreDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStoreDropdownOpen(false);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchFocused(false);
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
      setActivePage('shop');
    }
  };

  const handleSelectSearchResult = (product) => {
    setSearchFocused(false);
    setSearchQuery('');
    onOpenProductDetail(product);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-all">
      {/* Top micro-bar: store selector & quick perks (Desktop) */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-white text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Preferred Store Selector */}
            <div className="relative" ref={storeDropdownRef}>
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors py-1 min-h-[36px] focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg px-1 outline-none"
                aria-expanded={storeDropdownOpen}
                aria-label={`Current branch: ${currentStore ? currentStore.name : 'Select Store'}. Click to change branch.`}
              >
                <Icon name="MapPin" className="w-3.5 h-3.5 text-orange-400" />
                <span>My Branch:</span>
                <span className="font-semibold text-white underline decoration-emerald-500 underline-offset-2">
                  {currentStore ? currentStore.name : 'Select Store'}
                </span>
                <Icon name="ChevronDown" className="w-3 h-3 text-emerald-300" />
              </button>

              {/* Store dropdown menu */}
              {storeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Choose Supermarket Branch
                    </span>
                    <button
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        handleNavClick('locator');
                      }}
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-semibold min-h-[44px] flex items-center"
                    >
                      View Map
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          onSelectStore(store);
                          setStoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 min-h-[48px] hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition-colors flex items-start justify-between ${
                          currentStore?.id === store.id
                            ? 'bg-emerald-50 dark:bg-slate-800/80 text-emerald-900 dark:text-emerald-300 font-semibold'
                            : ''
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{store.name}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">{store.address}</p>
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium">
                            {store.hours.weekday}
                          </span>
                        </div>
                        {currentStore?.id === store.id && (
                          <span className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                            <Icon name="Check" className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-emerald-400/40">|</span>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Icon name="Truck" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Delivery on orders over KSh 3,000</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-200">
            <span className="flex items-center gap-1 text-emerald-300">
              <Icon name="Clock" className="w-3 h-3 text-emerald-400" />
              Open Today: 7:00 AM - 10:00 PM
            </span>
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className="text-xs bg-emerald-800/80 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                title={currentUser.role === 'customer' ? 'My Account' : 'Management Portal'}
              >
                <Icon name="User" className="w-3.5 h-3.5 text-emerald-300" />
                <span>Hi, {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs bg-emerald-800/80 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                title="Sign in to your account"
              >
                <Icon name="User" className="w-3.5 h-3.5 text-emerald-300" />
                <span>Sign In</span>
              </button>
            )}
            <a
              href="tel:+254202003310"
              className="hover:text-white transition-colors min-h-[36px] flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 outline-none text-xs font-semibold"
            >
              <Icon name="Phone" className="w-3.5 h-3.5 text-emerald-400" />
              <span>+254 20 2003310</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Logo with 44px+ touch target */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group min-h-[44px] focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl outline-none"
            aria-label="Cylet Supermarket Home"
          >
            <img
              src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
              alt="Cylet Supermarket Logo"
              className="h-10 sm:h-12 w-auto max-w-[130px] sm:max-w-[160px] object-cover rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Cylet
                </span>
                <span className="bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Supermarket
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium -mt-0.5 tracking-wide hidden sm:block">
                Embu - Siakago Rd (near Kubukubu Rd.)
              </p>
            </div>
          </button>

          {/* Desktop Prominent Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block" ref={searchContainerRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Icon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search organic produce, wild salmon, artisan bread, milk..."
                className="w-full min-h-[46px] pl-11 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-full text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                aria-label="Search grocery products"
              />
              <button
                onClick={() => {
                  setSearchFocused(false);
                  if (onSearchSubmit) onSearchSubmit(searchQuery);
                  setActivePage('shop');
                }}
                className="absolute inset-y-1 right-1 px-4 min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm"
                aria-label="Submit search"
              >
                Search
              </button>

              {/* Desktop Autocomplete Results */}
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Products matching "{searchQuery}"</span>
                    <span>Press Enter to view all</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-4 py-3 min-h-[48px] text-left hover:bg-emerald-50/60 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{item.category}</span>
                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">{item.brand}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{formatKES(item.price)}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">{item.unit}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSearchFocused(false);
                      setActivePage('shop');
                    }}
                    className="w-full min-h-[44px] text-center py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-800/60 hover:bg-emerald-100/70 dark:hover:bg-slate-800 transition-colors"
                  >
                    View all matching results in Shop →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons: Dark Mode Toggle, Store Locator & Slide-Out Cart Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dark Mode Toggle Button (WCAG AA Accessible) */}
            <button
              onClick={onToggleDarkMode}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon
                name={darkMode ? 'Sun' : 'Moon'}
                className="w-5 h-5 text-amber-500 dark:text-amber-400"
              />
            </button>

            {/* Store Locator Link (Desktop) */}
            <button
              onClick={() => handleNavClick('locator')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                activePage === 'locator'
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon name="MapPin" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>10 Branches</span>
            </button>

            {/* User Account / Sign In button */}
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                  activePage === 'account'
                    ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={currentUser.role === 'customer' ? 'My Account' : 'Management Portal'}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {currentUser.avatar || 'U'}
                </div>
                <span className="hidden lg:inline">{currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                  activePage === 'login'
                    ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title="Sign in to your account"
              >
                <Icon name="User" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger: Opens CartDrawer */}
            <button
              onClick={onOpenCartDrawer}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow-md shadow-emerald-600/20 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label={`Open shopping cart drawer with ${cartCount} items`}
            >
              <div className="relative flex items-center justify-center">
                <Icon name="ShoppingCart" className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-orange-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <span className="text-[10px] block opacity-80 uppercase tracking-wider font-semibold">
                  Basket
                </span>
                <span className="text-xs font-bold">{formatKES(cartTotal)}</span>
              </div>
            </button>

            {/* Mobile Menu Button with 44px+ hit area */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] p-2.5 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PROMINENT MOBILE SEARCH BAR IN HEADER */}
        <div className="md:hidden pb-3" ref={mobileSearchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search 38+ fresh groceries, produce, meat..."
              className="w-full min-h-[46px] pl-11 pr-20 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 focus:bg-white dark:focus:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
              aria-label="Search products on mobile"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-1 right-12 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                aria-label="Clear search input"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={() => {
                setSearchFocused(false);
                if (onSearchSubmit) onSearchSubmit(searchQuery);
                setActivePage('shop');
              }}
              className="absolute inset-y-1 right-1 px-3 min-h-[38px] bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center"
              aria-label="Run search"
            >
              Go
            </button>

            {/* Mobile Autocomplete Results Flyout */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Matches for "{searchQuery}"</span>
                  <span>Tap to view</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full px-3 py-2.5 min-h-[48px] text-left hover:bg-emerald-50/60 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{item.category} • {item.brand}</p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{formatKES(item.price)}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSearchFocused(false);
                    setActivePage('shop');
                  }}
                  className="w-full min-h-[44px] text-center py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-slate-800"
                >
                  View all in Shop →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-2.5 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="flex items-center gap-7 font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'home'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'shop'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => {
                setActivePage('shop');
              }}
              className="min-h-[44px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none"
            >
              <Icon name="Tag" className="w-3.5 h-3.5" />
              Weekly Deals & Specials
            </button>
            <button
              onClick={() => handleNavClick('locator')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'locator'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Store Locator
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'about'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              About Cylet
            </button>
            <button
              onClick={() => handleNavClick('careers')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'careers'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Careers
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'contact'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>All 11 Branches Open Now</span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu (When hamburger tapped) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile store selection banner */}
          <div className="p-3 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">Active Supermarket Branch</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">{currentStore?.name}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('locator')}
              className="min-h-[44px] px-3 text-xs bg-emerald-600 text-white rounded-xl font-bold flex items-center"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'home' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'shop' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              Shop All Groceries
            </button>
            <button
              onClick={() => handleNavClick('locator')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'locator' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              10 Store Branches
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCartDrawer();
              }}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span>My Cart</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('careers')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center"
            >
              Careers
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 col-span-2 flex items-center"
            >
              Customer Support & Contact
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold col-span-2 flex items-center justify-between border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" className="w-4 h-4 text-emerald-600" />
                  <span>My Account ({currentUser.name})</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
                  {currentUser.role}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-emerald-600 text-white font-bold col-span-2 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" className="w-4 h-4 text-white" />
                  <span>Sign In to Your Account</span>
                </div>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
