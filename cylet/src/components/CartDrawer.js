import React, { useState, useEffect } from 'react';
import { Icon } from './Icons.js';
import { COUPONS } from '../data/deals.js';
import { formatKES } from '../utils/currency.js';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  fulfillmentType,
  setFulfillmentType,
  currentStore,
  appliedCoupon,
  setAppliedCoupon,
  onProceedToCheckout,
  onViewFullCart,
  addToast,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Close drawer on Escape key press (WCAG Keyboard Accessibility)
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

  // Price calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 3000;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = fulfillmentType === 'pickup' ? 0 : isFreeDelivery ? 0 : 250;
  const estimatedTax = 0;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * appliedCoupon.value;
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(subtotal, appliedCoupon.value);
    } else if (appliedCoupon.type === 'shipping') {
      discount = deliveryFee;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const coupon = COUPONS[code];
    if (!coupon) {
      setCouponError('Invalid promo code. Try "FRESH20"');
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`Min order ${formatKES(coupon.minOrder)} required.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput('');
    addToast({
      title: 'Coupon Applied!',
      message: `${coupon.code} discount applied.`,
      type: 'success',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-100 dark:border-slate-800">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Icon name="ShoppingCart" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  Your Grocery Cart
                </h3>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items in basket
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label="Close cart drawer"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {cart.length === 0 ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Icon name="ShoppingCart" className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Your basket is empty</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                Explore our fresh aisles for organic produce, meats, artisan bakery, and weekly deals.
              </p>
              <button
                onClick={onClose}
                className="min-h-[44px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Browse Aisles
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Free Delivery Meter */}
              <div className="p-3 bg-emerald-50/80 dark:bg-slate-800/80 rounded-2xl border border-emerald-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Icon name="Truck" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {isFreeDelivery ? 'FREE Delivery Qualified!' : `Add ${formatKES(amountToFreeShipping)} for FREE Delivery`}
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-300">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-emerald-200/60 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Fulfillment Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold text-center">
                <button
                  onClick={() => setFulfillmentType('delivery')}
                  className={`min-h-[44px] rounded-xl py-2 flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                    fulfillmentType === 'delivery'
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon name="Truck" className="w-4 h-4" />
                  <span>Doorstep Delivery</span>
                </button>
                <button
                  onClick={() => setFulfillmentType('pickup')}
                  className={`min-h-[44px] rounded-xl py-2 flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                    fulfillmentType === 'pickup'
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon name="MapPin" className="w-4 h-4" />
                  <span>Curbside Pickup</span>
                </button>
              </div>

              {/* Line Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100 dark:border-slate-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{product.unit}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {formatKES(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 line-through">
                            {formatKES(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper with 44px minimum touch targets */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="min-w-[44px] min-h-[44px] rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        <Icon name={quantity === 1 ? 'Trash2' : 'Minus'} className="w-4 h-4" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="min-w-[44px] min-h-[44px] rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        <Icon name="Plus" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">
                      🏷️ {appliedCoupon.code} applied
                    </span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="min-h-[44px] px-2 text-rose-600 dark:text-rose-400 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. FRESH20)"
                      className="flex-1 px-3 py-2 text-xs uppercase font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                    />
                    <button
                      type="submit"
                      className="min-h-[44px] px-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{couponError}</p>}
              </div>
            </div>
          )}

          {/* Drawer Footer with Totals & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatKES(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatKES(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({fulfillmentType})</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {deliveryFee === 0 ? 'FREE' : formatKES(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{formatKES(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA Button with 48px height */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full min-h-[48px] py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              >
                <span>Proceed to Checkout</span>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onViewFullCart();
                  }}
                  className="min-h-[44px] text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold flex items-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none rounded"
                >
                  View full cart details →
                </button>
                <button
                  onClick={onClearCart}
                  className="min-h-[44px] text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold flex items-center focus-visible:ring-2 focus-visible:ring-rose-500 outline-none rounded"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
