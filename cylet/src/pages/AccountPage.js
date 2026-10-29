import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';
import { formatKES } from '../utils/currency.js';

/**
 * Customer Account Page (/account)
 * Displays customer order history, saved delivery addresses, and personal loyalty profile.
 */
export const AccountPage = ({
  currentUser,
  onLogout,
  onNavigate,
  addToast,
}) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const [addresses, setAddresses] = useState(
    currentUser?.savedAddresses || [
      {
        id: 'addr-1',
        title: 'Home Address',
        address: 'Embu - Siakago Road near Kubukubu Rd.',
        city: 'Embu',
        phone: '+254 712 345 678',
        isDefault: true,
      },
      {
        id: 'addr-2',
        title: 'Work / Office',
        address: 'Kangaru Business Center, 2nd Floor',
        city: 'Embu',
        phone: '+254 722 987 654',
        isDefault: false,
      },
    ]
  );

  const [orders] = useState(
    currentUser?.orderHistory || [
      {
        id: 'CY-89412',
        date: 'Oct 16, 2026',
        itemsCount: 4,
        total: 1110,
        status: 'Delivered',
        branch: 'Cylet Supermarket - Embu Main Branch',
        items: [
          { name: 'Organic Mt. Kenya Hass Avocados', quantity: 2, price: 150 },
          { name: 'Fresh Farmhouse Whole Milk 1L', quantity: 2, price: 120 },
          { name: 'Artisan Sourdough Loaf', quantity: 1, price: 80 },
          { name: 'Embu Highland Black Tea 500g', quantity: 1, price: 250 },
        ],
      },
      {
        id: 'CY-88204',
        date: 'Oct 09, 2026',
        itemsCount: 2,
        total: 520,
        status: 'Delivered',
        branch: 'Cylet Supermarket - Embu Main Branch',
        items: [
          { name: 'Ripe Sweet Plantains (Bunch)', quantity: 2, price: 150 },
          { name: 'Farm-Fresh Free-Range Eggs (Tray of 30)', quantity: 1, price: 220 },
        ],
      },
    ]
  );

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Embu');
  const [newPhone, setNewPhone] = useState(currentUser?.phone || '+254 712 345 678');

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAddress.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      title: newTitle.trim(),
      address: newAddress.trim(),
      city: newCity.trim(),
      phone: newPhone.trim(),
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setIsAddressModalOpen(false);
    setNewTitle('');
    setNewAddress('');
    if (addToast) {
      addToast({
        title: 'Address Saved',
        message: `${newAddr.title} added to your delivery addresses.`,
        type: 'success',
      });
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    if (addToast) {
      addToast({
        title: 'Default Updated',
        message: 'Primary delivery destination updated.',
        type: 'info',
      });
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (addToast) {
      addToast({
        title: 'Address Removed',
        message: 'Saved delivery address was removed.',
        type: 'info',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Icon name="ArrowRight" className="w-4 h-4 rotate-180" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Icon name="LogOut" className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              {currentUser?.avatar || 'CU'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.name || 'Customer Account'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  {currentUser?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {currentUser?.email || 'customer@cylet.com'} • Member since 2024
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between md:min-w-[260px]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                Cylet Club Rewards
              </span>
              <p className="text-xl font-black mt-0.5">
                {currentUser?.loyaltyPoints || 350} Points
              </p>
              <span className="text-[11px] text-emerald-100">{formatKES(350)} credit available</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="Gift" className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon name="ShoppingBag" className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon name="MapPin" className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
        </div>

        {/* Tab 1: Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Past Orders & Invoices
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
                <Icon name="ShoppingBag" className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No orders yet</h3>
                <p className="text-xs text-slate-500 mt-1">Start shopping to see your receipt history here.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        Order #{ord.id}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Placed on {ord.date} • {ord.branch}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {ord.status}
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatKES(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Line items list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold text-slate-600 dark:text-slate-400">
                          {formatKES(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Standard Temperature-Controlled Delivery</span>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Reorder Items →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Delivery Locations
              </h2>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Icon name="Plus" className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-3 relative transition-all ${
                    addr.isDefault
                      ? 'border-emerald-500 dark:border-emerald-500/80 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Icon name="MapPin" className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {addr.title}
                      </h3>
                    </div>

                    {addr.isDefault ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {addr.address}, {addr.city}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Icon name="Phone" className="w-3 h-3" />
                    <span>{addr.phone}</span>
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Add Delivery Address
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <Icon name="X" className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Address Label (e.g. Home, Office)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Home"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address & Landmarks
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Embu - Siakago Road (near Kubukubu Rd.)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
