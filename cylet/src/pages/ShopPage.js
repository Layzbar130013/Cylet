import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Icons.js';
import { ProductCard } from '../components/ProductCard.js';
import { CATEGORIES, BRANDS } from '../data/products.js';
import { formatKES } from '../utils/currency.js';

export const ShopPage = ({
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onToggleFavorite,
  favorites,
}) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);

  // Available tag filters
  const ALL_TAGS = ['Organic', 'Gluten-Free', 'Vegan', 'Keto', 'Non-GMO', 'Pasture-Raised'];

  // Handle brand toggle
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Handle tag toggle
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedTags([]);
    setMaxPrice(1500);
    setOnlyDeals(false);
    onSelectCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    selectedTags.length > 0 ||
    maxPrice < 1500 ||
    onlyDeals ||
    searchQuery.trim().length > 0;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
          if (!match) return false;
        }
        // Deals filter
        if (onlyDeals && !p.isWeeklyDeal && !p.originalPrice) {
          return false;
        }
        // Price filter
        if (p.price > maxPrice) {
          return false;
        }
        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }
        // Tag filter
        if (selectedTags.length > 0 && (!p.tags || !selectedTags.every((t) => p.tags.includes(t)))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-desc':
            return b.rating - a.rating;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return b.reviewCount - a.reviewCount; // featured
        }
      });
  }, [products, selectedCategory, searchQuery, onlyDeals, maxPrice, selectedBrands, selectedTags, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Shop Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-emerald-200 text-xs uppercase font-extrabold tracking-wider">Cylet Supermarket Aisles</span>
          <h1 className="text-3xl font-black tracking-tight mt-1">
            {selectedCategory === 'all'
              ? 'All Grocery Departments'
              : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Department'}
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Showing {filteredProducts.length} verified farm-fresh items in stock
          </p>
        </div>

        {/* Search inside shop */}
        <div className="w-full md:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800">
            <Icon name="Search" className="w-4 h-4 text-emerald-600" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter current aisle..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear aisle search"
            >
              <Icon name="X" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTER (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 p-6 overflow-y-auto block'
              : 'hidden lg:block'
          }`}
        >
          {/* Mobile drawer header */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Filter Products</h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              aria-label="Close filter drawer"
            >
              <Icon name="X" className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm sticky top-28">
            {/* Header with clear filters */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Icon name="Filter" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Filters & Categories</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* 1. Category selector */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                Categories
              </h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Deals only toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Icon name="Tag" className="w-3.5 h-3.5 text-orange-500" />
                  On Sale & Weekly Deals Only
                </span>
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* 3. Price Range Slider */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                  Up to {formatKES(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
                aria-label="Filter maximum price"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>{formatKES(50)}</span>
                <span>{formatKES(750)}</span>
                <span>{formatKES(1500)}+</span>
              </div>
            </div>

            {/* 4. Dietary & Quality Tags */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                Dietary & Quality
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-all border ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {isChecked ? `✓ ${tag}` : tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Brand Filters */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                Supermarket Brands
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {BRANDS.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile close button */}
            <div className="lg:hidden pt-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT LISTING */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/60"
              >
                <Icon name="Filter" className="w-4 h-4" />
                <span>Filters {hasActiveFilters && '• Active'}</span>
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Found <strong className="text-slate-900 dark:text-white font-bold">{filteredProducts.length}</strong> fresh items
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="sortSelect" className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="featured">Popularity & Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Customer Rating</option>
                <option value="name-asc">Product Name (A - Z)</option>
                <option value="name-desc">Product Name (Z - A)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                  Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => onSelectCategory('all')} aria-label="Clear category filter">
                    <Icon name="X" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search term">
                    <Icon name="X" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </span>
              )}
              {onlyDeals && (
                <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 text-xs px-2.5 py-1 rounded-full font-medium">
                  On Sale
                  <button onClick={() => setOnlyDeals(false)} aria-label="Clear deals filter">
                    <Icon name="X" className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  </button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200 dark:border-slate-700"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)} aria-label={`Remove brand ${b}`}>
                    <Icon name="X" className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </button>
                </span>
              ))}
              {selectedTags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200 dark:border-slate-700"
                >
                  {t}
                  <button onClick={() => toggleTag(t)} aria-label={`Remove tag ${t}`}>
                    <Icon name="X" className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-bold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
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
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                <Icon name="Search" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matching groceries found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try relaxing your price slider or search terms.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
