import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';
import { COUPONS } from '../data/deals.js';
import { formatKES } from '../utils/currency.js';

export const CartPage = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  fulfillmentType,
  setFulfillmentType,
  currentStore,
  stores,
  onSelectStore,
  appliedCoupon,
  setAppliedCoupon,
  onProceedToCheckout,
  onContinueShopping,
  addToast,
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 3000;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = fulfillmentType === 'pickup' ? 0 : isFreeDelivery ? 0 : 250;
  const estimatedTax = 0;

  // Calculate discount from coupon
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
    const cleanCode = couponCodeInput.trim().toUpperCase();

    if (!cleanCode) return;

    const coupon = COUPONS[cleanCode];
    if (!coupon) {
      setCouponError('Invalid promo code. Try "FRESH20" or "WELCOME10".');
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`This coupon requires a minimum subtotal of ${formatKES(coupon.minOrder)}.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCodeInput('');
    addToast({
      title: 'Coupon Applied!',
      message: `${coupon.code} discount was added to your order.`,
      type: 'success',
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      title: 'Coupon Removed',
      message: 'Promo code was removed.',
      type: 'info',
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800/50">
            <Icon name="ShoppingCart" className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cylet Basket is Empty</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Browse our fresh produce, artisan meats, bakery, and weekly deals to fill up your cart with fresh local groceries.
            </p>
          </div>
          <button
            onClick={onContinueShopping}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
          >
            Start Shopping Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Reviewing {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your basket
          </p>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto"
        >
          <Icon name="Trash2" className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Line Items & Delivery Toggle */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fulfillment Toggle: Doorstep Delivery vs Branch Pickup */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Select How You Want Your Order
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Delivery Option */}
              <button
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  fulfillmentType === 'delivery'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    fulfillmentType === 'delivery'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon name="Truck" className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Doorstep Delivery</span>
                    {isFreeDelivery && (
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Temperature-controlled cold vans in 2 hours
                  </p>
                </div>
              </button>

              {/* In-Store Pickup Option */}
              <button
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  fulfillmentType === 'pickup'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    fulfillmentType === 'pickup'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon name="MapPin" className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Branch Curbside Pickup</span>
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Ready in 30 mins at {currentStore ? currentStore.name : 'Branch'}
                  </p>
                </div>
              </button>
            </div>

            {/* Branch details if pickup */}
            {fulfillmentType === 'pickup' && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Pickup Location: </span>
                  <strong className="text-slate-900 dark:text-white font-bold">{currentStore?.name}</strong> (
                  {currentStore?.address})
                </div>
                <button
                  onClick={() => {
                    const nextStore = stores.find((s) => s.id !== currentStore?.id) || stores[0];
                    onSelectStore(nextStore);
                  }}
                  className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                >
                  Change Branch
                </button>
              </div>
            )}
          </div>

          {/* Free Shipping Progress Meter (for delivery) */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-200/80 dark:border-emerald-800/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  <Icon name="Truck" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold">You qualify for FREE Delivery!</span>
                  ) : (
                    <span>
                      Add <strong className="text-emerald-800 dark:text-emerald-300">{formatKES(amountToFreeShipping)}</strong> more for FREE Express Delivery
                    </span>
                  )}
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                      {product.brand}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.unit}</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 sm:hidden">
                      {formatKES(product.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                    {formatKES(product.price)}
                  </span>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Icon name={quantity === 1 ? 'Trash2' : 'Minus'} className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Icon name="Plus" className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-black text-slate-900 dark:text-white text-base">
                      {formatKES(product.price * quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-2 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div>
              <label htmlFor="promoCode" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Icon name="Tag" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      {appliedCoupon.code} ({appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    id="promoCode"
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Try FRESH20"
                    className="flex-1 px-3.5 py-2.5 uppercase text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-transparent dark:border-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatKES(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatKES(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  {fulfillmentType === 'pickup' ? 'Store Pickup Fee' : 'Express Delivery'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    formatKES(deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900 dark:text-white">Total Due</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatKES(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>

              <button
                onClick={onContinueShopping}
                className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-colors text-center border border-transparent dark:border-slate-700"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Icon name="ShieldCheck" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Free returns at any of our 11 branches within 7 days.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
