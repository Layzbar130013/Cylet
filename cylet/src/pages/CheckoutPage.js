import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';
import { formatKES } from '../utils/currency.js';

export const CheckoutPage = ({
  cart,
  fulfillmentType,
  currentStore,
  appliedCoupon,
  onClearCart,
  onContinueShopping,
  setActivePage,
  addToast,
  onOrderCreated,
}) => {
  // Step in checkout: 'checkout' or 'confirmation'
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSummaryData, setOrderSummaryData] = useState(null);

  // Address & Contact state
  const [formData, setFormData] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 789-0123',
    address: '452 Elm Street, Apt 3B',
    city: 'Metropolis',
    postalCode: '10001',
    notes: 'Please leave grocery bags at the front door ring bell.',
  });

  // Delivery slot state
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('Afternoon: 12:00 PM - 3:00 PM');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    cardName: 'Jane Doe',
  });
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 3000;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment authorization & order creation
    setTimeout(() => {
      const generatedOrderId = 'FM-' + Math.floor(100000 + Math.random() * 900000);
      const placedOrder = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        subtotal,
        discount,
        deliveryFee,
        tax: estimatedTax,
        grandTotal,
        fulfillmentType,
        store: currentStore,
        slot: `${selectedDate}, ${selectedSlot}`,
        customer: { ...formData },
        paymentMethod,
      };

      setOrderSummaryData(placedOrder);
      setOrderPlaced(true);
      setIsProcessing(false);
      onClearCart();

      if (onOrderCreated) {
        onOrderCreated({
          id: generatedOrderId,
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          address: {
            street: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            instructions: formData.notes,
          },
          items: cart.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
            unit: i.product.unit || 'each',
            total: i.product.price * i.quantity,
          })),
          subtotal,
          deliveryFee,
          tax: estimatedTax,
          discount,
          total: grandTotal,
          paymentMethod:
            paymentMethod === 'mpesa'
              ? 'M-Pesa Mobile Money'
              : paymentMethod === 'cod'
              ? 'Cash on Delivery (COD)'
              : 'Credit Card (Visa •••• 4242)',
          paymentStatus: 'Paid',
          fulfillmentType,
          deliverySlot: `${selectedDate}, ${selectedSlot}`,
          branchName: currentStore?.name || 'Cylet Supermarket - Embu Main Branch',
          status: 'Pending',
          date: new Date().toISOString(),
          formattedDate: 'Just now',
        });
      }

      addToast({
        title: 'Order Successfully Placed!',
        message: `Your Cylet order #${generatedOrderId} has been confirmed.`,
        type: 'success',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // If order has been placed, show rich confirmation screen
  if (orderPlaced && orderSummaryData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in zoom-in-95 duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 p-8 sm:p-12 shadow-xl space-y-8">
          {/* Header celebration */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <Icon name="Check" className="w-10 h-10" />
            </div>
            <span className="inline-block text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              Order Confirmed & Processing
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              We've received your order{' '}
              <strong className="text-slate-900 dark:text-white font-bold">#{orderSummaryData.orderId}</strong>. A
              confirmation has been sent to{' '}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{orderSummaryData.customer.email}</span>.
            </p>
          </div>

          {/* Simulated Order Tracker */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
              Live Order Progress
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  ✓
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">Order Placed</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Just Now</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md animate-pulse">
                  2
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">Personal Shopper</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Selecting Best Produce</span>
              </div>
              <div className="flex flex-col items-center opacity-70">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                  {orderSummaryData.fulfillmentType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{orderSummaryData.slot}</span>
              </div>
              <div className="flex flex-col items-center opacity-70">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-2">Completed</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Freshness Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Fulfillment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                Fulfillment Method
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 capitalize">
                {orderSummaryData.fulfillmentType === 'pickup'
                  ? `Store Pickup at ${orderSummaryData.store?.name}`
                  : `Home Delivery to ${orderSummaryData.customer.address}`}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">Time Slot: {orderSummaryData.slot}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                Payment Method
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 uppercase">
                {orderSummaryData.paymentMethod === 'mpesa'
                  ? 'M-Pesa Mobile Money'
                  : orderSummaryData.paymentMethod === 'cod'
                  ? 'Cash On Delivery'
                  : 'Visa / MasterCard Ending in 4242'}
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">Status: Authorized / Pending on arrival</p>
            </div>
          </div>

          {/* Ordered items breakdown */}
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Items Ordered ({orderSummaryData.items.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-2">
              {orderSummaryData.items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{product.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">Qty: {quantity} • {formatKES(product.price)} each</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">{formatKES(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatKES(orderSummaryData.subtotal)}</span>
              </div>
              {orderSummaryData.discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatKES(orderSummaryData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{orderSummaryData.deliveryFee === 0 ? 'FREE' : formatKES(orderSummaryData.deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Total Paid</span>
                <span>{formatKES(orderSummaryData.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onContinueShopping}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setActivePage('locator')}
              className="py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-2xl transition-colors border border-transparent dark:border-slate-700"
            >
              View Branch Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Express Checkout</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Complete your delivery address, schedule your slot, and select a secure payment method.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Contact & Address Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {fulfillmentType === 'pickup' ? 'Contact Details for Pickup' : 'Delivery Address & Contact'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (For SMS Updates) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (For Receipt) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {fulfillmentType === 'delivery' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Street Address & Apt/Suite *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Postal Code / Zip
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Special Delivery Instructions (Gate code, doorstep drop)
                    </label>
                    <textarea
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {fulfillmentType === 'pickup' && (
                <div className="sm:col-span-2 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200">
                  <p className="font-bold">Pickup Branch: {currentStore?.name}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{currentStore?.address}</p>
                  <p className="text-emerald-700 dark:text-emerald-400 mt-1">
                    Your groceries will be packed in chilled insulated bags at the curbside desk.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Schedule Delivery / Pickup Slot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Choose {fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'} Time Slot
              </h2>
            </div>

            {/* Date Selector */}
            <div>
              <span className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2.5">
                Select Day
              </span>
              <div className="grid grid-cols-3 gap-3">
                {['Today', 'Tomorrow', 'Day After Tomorrow'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center ${
                      selectedDate === day
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <span className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2.5">
                Select Preferred Window
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Morning: 8:00 AM - 11:00 AM',
                  'Afternoon: 12:00 PM - 3:00 PM',
                  'Evening: 5:00 PM - 8:00 PM',
                  'Night Express: 8:00 PM - 10:00 PM',
                ].map((slot) => (
                  <label
                    key={slot}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedSlot === slot
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      checked={selectedSlot === slot}
                      onChange={() => setSelectedSlot(slot)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Payment Method</h2>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Credit/Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <Icon name="CreditCard" className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Credit / Debit Card</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Visa, Mastercard</span>
                </div>
              </button>

              {/* M-Pesa Mobile Money */}
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'mpesa'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <Icon name="Smartphone" className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">M-Pesa Mobile Money</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct STK Push prompt</span>
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <Icon name="DollarSign" className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Pay driver or at counter</span>
                </div>
              </button>
            </div>

            {/* Dynamic Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-805/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardExpiry}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardExpiry: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                      CVC Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardDetails.cardCvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardCvc: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mpesa' && (
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">M-Pesa STK Instant Push</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Enter your registered M-Pesa mobile number below. You will receive an instant PIN prompt on your phone to authorize the transaction.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200">
                <p className="font-bold">Cash on Delivery / Pickup Selected</p>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  You can pay with exact cash, contactless card tap, or local mobile transfer when your delivery driver arrives or upon picking up at the branch counter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Order Summary & Submit Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Review
            </h3>

            {/* Items preview list */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {quantity}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{product.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {formatKES(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatKES(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-{formatKES(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery / Pickup</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? 'FREE' : formatKES(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatKES(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Authorizing Order...</span>
                </>
              ) : (
                <>
                  <Icon name="Check" className="w-5 h-5" />
                  <span>Place Order • {formatKES(grandTotal)}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1">
              <p>🔒 256-Bit SSL Encrypted Supermarket Checkout</p>
              <p>No card will be charged in this test environment.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
