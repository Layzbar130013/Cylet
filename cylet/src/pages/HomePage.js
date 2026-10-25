import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from '../components/Icons.js';
import { ProductCard } from '../components/ProductCard.js';
import { CATEGORIES } from '../data/products.js';
import { PROMO_BANNERS, VALUE_PROPOSITIONS } from '../data/deals.js';
import { formatKES } from '../utils/currency.js';

export const HomePage = ({
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
  onSelectCategory,
  setActivePage,
  currentStore,
  stores,
  onSelectStore,
  onToggleFavorite,
  favorites,
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const dealsCarouselRef = useRef(null);

  // Auto-rotate hero banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Live countdown timer calculating remaining days/hours/minutes/seconds until Sunday midnight
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 42, seconds: 18 });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 is Sunday
      // Days until coming Sunday midnight (or next Sunday if today is Sunday late)
      const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
      const target = new Date(now);
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(23, 59, 59, 999);

      const diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Curate exactly 8 discounted products for the Weekly Deals carousel
  const eightWeeklyDeals = useMemo(() => {
    return products
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = (a.originalPrice - a.price) / a.originalPrice;
        const discountB = (b.originalPrice - b.price) / b.originalPrice;
        return discountB - discountA;
      })
      .slice(0, 8);
  }, [products]);

  // Horizontal scroll controls
  const scrollDeals = (direction) => {
    if (dealsCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      dealsCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const popularItems = products.filter((p) => p.rating >= 4.8).slice(0, 8);
  const currentBanner = PROMO_BANNERS[currentBannerIndex];

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO PROMO BANNER CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center bg-slate-900">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center filter brightness-[0.65] transition-all duration-1000 scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgColor} opacity-85 mix-blend-multiply`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Banner content */}
          <div className="relative z-10 max-w-2xl p-6 sm:p-12 lg:p-16 text-white space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-extrabold uppercase tracking-widest text-amber-300">
              <Icon name="Sparkles" className="w-3.5 h-3.5" />
              <span>{currentBanner.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white drop-shadow-md">
              {currentBanner.title}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 font-medium max-w-xl leading-relaxed">
              {currentBanner.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('shop')}
                className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>{currentBanner.buttonText}</span>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-slate-300">Use promo code:</span>
                <span className="font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded text-sm">
                  {currentBanner.code}
                </span>
              </div>
            </div>
          </div>

          {/* Carousel navigation dots & arrows */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentBannerIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)
              }
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              aria-label="Previous promo slide"
            >
              <Icon name="ChevronLeft" className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {PROMO_BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBannerIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentBannerIndex === i ? 'w-8 bg-orange-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              aria-label="Next promo slide"
            >
              <Icon name="ChevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-emerald-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/80 dark:border-slate-700">
                <Icon name={prop.icon} className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{prop.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY GRID (Produce, Meat, Dairy, Bakery, Beverages, Household, Snacks) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              <Icon name="Sprout" className="w-4 h-4" />
              <span>Browse By Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Fresh Aisles & Categories
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              setActivePage('shop');
            }}
            className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-emerald-500 rounded outline-none"
          >
            <span>Explore All 38 Products</span>
            <Icon name="ChevronRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const sampleProd = products.find((p) => p.category === cat.id);
            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${cat.name} department with ${cat.count} items`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setActivePage('shop');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(cat.id);
                    setActivePage('shop');
                  }
                }}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 p-4 text-center cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 bg-emerald-50/50 dark:bg-slate-800 p-1 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={sampleProd ? sampleProd.image : ''}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 block font-medium">{cat.count} items</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WEEKLY DEALS SECTION (HORIZONTAL SCROLLABLE CAROUSEL OF 8 DISCOUNTED PRODUCTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-emerald-50/40 rounded-3xl p-6 sm:p-10 border border-orange-200/90 shadow-sm relative overflow-hidden">
          {/* Decorative subtle background circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header with Countdown Timer & Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                  <Icon name="Clock" className="w-3.5 h-3.5" />
                  <span>Limited Time Offers</span>
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  8 Weekly Deals
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                Weekly Deals & Flash Savings
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Hand-picked discounts on fresh organic meats, wild seafood, daily bakery, and produce. Available while weekly branch stocks last.
              </p>
            </div>

            {/* Countdown Timer (Days / Hours / Minutes / Seconds) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-orange-200 shadow-md">
                <div className="text-right hidden sm:block mr-2">
                  <span className="block text-[10px] uppercase font-black tracking-wider text-slate-400 leading-none">
                    Deals Expire In:
                  </span>
                  <span className="text-xs font-extrabold text-orange-600 leading-tight">
                    Sunday Midnight
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-center">
                  {/* Days */}
                  <div className="bg-slate-900 text-white rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
                    <span className="block text-base sm:text-xl font-black leading-none text-amber-300">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                      Days
                    </span>
                  </div>

                  <span className="text-slate-400 font-bold text-base">:</span>

                  {/* Hours */}
                  <div className="bg-slate-900 text-white rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
                    <span className="block text-base sm:text-xl font-black leading-none text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                      Hours
                    </span>
                  </div>

                  <span className="text-slate-400 font-bold text-base">:</span>

                  {/* Minutes */}
                  <div className="bg-slate-900 text-white rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
                    <span className="block text-base sm:text-xl font-black leading-none text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                      Mins
                    </span>
                  </div>

                  <span className="text-slate-400 font-bold text-base">:</span>

                  {/* Seconds */}
                  <div className="bg-orange-600 text-white rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
                    <span className="block text-base sm:text-xl font-black leading-none text-white animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-orange-200 mt-0.5">
                      Secs
                    </span>
                  </div>
                </div>
              </div>

              {/* Carousel Left / Right Arrows */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => scrollDeals('left')}
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-90"
                  aria-label="Scroll deals left"
                >
                  <Icon name="ChevronLeft" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollDeals('right')}
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-90"
                  aria-label="Scroll deals right"
                >
                  <Icon name="ChevronRight" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel showing 8 discounted products */}
          <div
            ref={dealsCarouselRef}
            className="flex gap-5 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory relative z-10"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
          >
            {eightWeeklyDeals.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id);
              const currentQuantity = cartItem ? cartItem.quantity : 0;
              const isFavorite = favorites.includes(product.id);
              const discountSavings = product.originalPrice - product.price;
              const discountPercentage = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="shrink-0 w-[280px] sm:w-[310px] snap-start bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                >
                  {/* Top Badges: "Limited time" badge + Favorite Heart */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex flex-col gap-1 items-start">
                      {/* Explicit Limited Time Badge */}
                      <span className="pointer-events-auto bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                        <span>⚡</span>
                        <span>Limited time</span>
                      </span>

                      {/* Percent Savings Badge */}
                      <span className="pointer-events-auto bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        {discountPercentage}% OFF
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) onToggleFavorite(product.id);
                      }}
                      className={`pointer-events-auto w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                        isFavorite ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
                      }`}
                      aria-label="Add to favorites"
                    >
                      <Icon name="Heart" className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => onOpenDetail(product)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenDetail(product);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${product.name}`}
                    className="w-full h-48 sm:h-52 bg-slate-50 dark:bg-slate-800/50 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Product Details Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Brand */}
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span className="uppercase tracking-wider font-bold text-[10px] text-emerald-700 dark:text-emerald-400">
                          {product.category}
                        </span>
                        <span className="truncate max-w-[130px] text-[11px] text-slate-600 dark:text-slate-400">
                          {product.brand}
                        </span>
                      </div>

                      {/* Name */}
                      <h3
                        onClick={() => onOpenDetail(product)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onOpenDetail(product);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="font-bold text-slate-900 dark:text-white text-base leading-snug hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 min-h-[2.75rem]"
                      >
                        {product.name}
                      </h3>

                      {/* Unit / Weight subtitle */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-2 font-medium">{product.unit}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex items-center text-amber-500 dark:text-amber-400">
                          <Icon name="Star" className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Pricing Box: Highlighted Sale Price + Original Price Struck Through */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
                      <div>
                        <div className="flex items-baseline gap-2">
                          {/* Sale Price Highlighted */}
                          <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-xl border border-orange-200/70 dark:border-orange-800/50">
                            {formatKES(product.price)}
                          </span>

                          {/* Original Price Struck Through */}
                          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-through font-semibold">
                            {formatKES(product.originalPrice)}
                          </span>
                        </div>

                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-1">
                          Save {formatKES(discountSavings)} with deal
                        </span>
                      </div>

                      {/* Add to Cart Stepper / Button */}
                      <div>
                        {currentQuantity > 0 ? (
                          <div className="flex items-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-1 shadow-inner">
                            <button
                              onClick={() => onUpdateQuantity(product.id, currentQuantity - 1)}
                              className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-90"
                              aria-label="Decrease quantity"
                            >
                              <Icon name={currentQuantity === 1 ? 'Trash2' : 'Minus'} className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-emerald-950 dark:text-emerald-200">
                              {currentQuantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, currentQuantity + 1)}
                              className="w-7 h-7 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition-colors shadow-sm active:scale-90"
                              aria-label="Increase quantity"
                            >
                              <Icon name="Plus" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(product, 1)}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <Icon name="ShoppingCart" className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Mobile Scroll Helper Hint */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-orange-200/40 dark:border-orange-900/40">
            <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              👉 Swipe horizontally or use arrow buttons to explore all 8 discounted weekly specials
            </span>
            <button
              onClick={() => setActivePage('shop')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline underline-offset-2 whitespace-nowrap ml-2"
            >
              View all aisle promotions →
            </button>
          </div>
        </div>
      </section>

      {/* 5. POPULAR EVERYDAY ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              <Icon name="Star" className="w-4 h-4 text-amber-400" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Top Rated Fresh Groceries
            </h2>
          </div>
          <button
            onClick={() => setActivePage('shop')}
            className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Grocery Catalog</span>
            <Icon name="ChevronRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {popularItems.map((product) => {
            const cartItem = cart.find((item) => item.product.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                cartItem={cartItem}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onOpenDetail={onOpenDetail}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            );
          })}
        </div>
      </section>

      {/* 6. STORE LOCATOR CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6 text-white z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <Icon name="MapPin" className="w-4 h-4 text-emerald-400" />
                <span>11 Full-Service Supermarkets</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Order Online & Pick Up in 30 Mins at Any Cylet Branch
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Prefer picking up on your way home? Your personal in-store shopper will select the freshest produce and pack everything into temperature-controlled bags ready at your chosen branch curbside.
              </p>

              {/* Current Branch Info Card */}
              {currentStore && (
                <div className="p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                      Your Selected Branch
                    </span>
                    <h4 className="font-bold text-white text-base">{currentStore.name}</h4>
                    <p className="text-xs text-slate-400">{currentStore.address} • {currentStore.hours.weekday}</p>
                  </div>
                  <button
                    onClick={() => setActivePage('locator')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 self-start sm:self-auto"
                  >
                    Change Branch
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActivePage('locator')}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
                >
                  <Icon name="Navigation" className="w-4 h-4" />
                  <span>Find Nearest Branch & Hours</span>
                </button>
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-colors"
                >
                  Start Online Order
                </button>
              </div>
            </div>

            {/* Map visual illustration */}
            <div className="lg:col-span-5 h-80 lg:h-full min-h-[350px] bg-slate-800 relative overflow-hidden flex items-center justify-center p-6">
              <div className="w-full h-full rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 relative flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Branch Network
                  </span>
                  <span>11 Supermarkets</span>
                </div>

                {/* Simulated mini map coordinates */}
                <div className="relative flex-1 my-3 bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  {stores.slice(0, 6).map((st) => (
                    <div
                      key={st.id}
                      style={{ top: `${st.coordinates.y}%`, left: `${st.coordinates.x}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      onClick={() => {
                        onSelectStore(st);
                        setActivePage('locator');
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center animate-ping"></div>
                      <div className="absolute inset-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold shadow-md">
                        ●
                      </div>
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
                        {st.name}
                      </div>
                    </div>
                  ))}
                  <div className="text-center z-10 p-2">
                    <p className="text-xs font-bold text-slate-300">Serving Central Metropolis, Westlands, Karen & Beyond</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Average delivery time: 38 mins</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('locator')}
                  className="w-full text-center py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 transition-colors"
                >
                  Open Full Interactive Store Map →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
