import React from 'react';
import { Icon } from './Icons.js';
import { formatKES } from '../utils/currency.js';

export const ProductCard = ({
  product,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
  onToggleFavorite,
  isFavorite,
}) => {
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Badges & Favorite Button (Min 44px Touch Target) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="pointer-events-auto bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="pointer-events-auto bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(product.id);
          }}
          className={`pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
            isFavorite ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
          }`}
          aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
        >
          <Icon name="Heart" className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Image Area with Keyboard Interaction */}
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
        className="w-full h-48 sm:h-52 bg-slate-50 dark:bg-slate-800 overflow-hidden relative cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
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

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
            <span className="uppercase tracking-wider font-bold text-[10px] text-emerald-700 dark:text-emerald-400">
              {product.category}
            </span>
            <span className="truncate max-w-[120px] text-[11px] text-slate-600 dark:text-slate-300 font-medium">{product.brand}</span>
          </div>

          {/* Product Title */}
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
            className="font-bold text-slate-900 dark:text-white text-base leading-snug hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 min-h-[2.75rem] focus-visible:ring-2 focus-visible:ring-emerald-500 rounded outline-none"
          >
            {product.name}
          </h3>

          {/* Unit / Weight subtitle */}
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-2.5 font-medium">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Icon name="Star" className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart Controls (All touch targets >= 44px) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatKES(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                  {formatKES(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">In Stock • Fresh</span>
          </div>

          {/* Cart Buttons with 44px+ hit areas */}
          <div>
            {currentQuantity > 0 ? (
              <div className="flex items-center bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 p-1 shadow-inner">
                <button
                  onClick={() => onUpdateQuantity(product.id, currentQuantity - 1)}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                  aria-label={`Decrease ${product.name} quantity`}
                >
                  <Icon name={currentQuantity === 1 ? 'Trash2' : 'Minus'} className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-xs text-emerald-950 dark:text-white">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, currentQuantity + 1)}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition-colors shadow-sm active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                  aria-label={`Increase ${product.name} quantity`}
                >
                  <Icon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product, 1)}
                className="min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-emerald-600/15 flex items-center gap-1.5 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                aria-label={`Add ${product.name} to cart`}
              >
                <Icon name="ShoppingCart" className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
