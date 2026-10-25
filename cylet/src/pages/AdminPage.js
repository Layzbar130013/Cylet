import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Icon } from '../components/Icons.js';
import { MOCK_ADMIN_USERS, ROLE_DETAILS, authenticateMockUser, isTabAllowedForRole } from '../data/users.js';
import { formatKES } from '../utils/currency.js';

// Default presets for product imagery in Add/Edit modal
const PRESET_IMAGES = [
  { label: 'Honeycrisp Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hass Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
  { label: 'Baby Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Heirloom Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ribeye Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: 'Atlantic Salmon', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sourdough Bread', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Detox Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coffee Beans', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Eco Dish Soap', url: 'https://images.unsplash.com/photo-1585830812416-a6c86bb14576?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Nuts', url: 'https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=800&q=80' },
];

export const AdminPage = ({
  products,
  setProducts,
  categories,
  setCategories,
  stores,
  setStores,
  deals,
  setDeals,
  orders,
  setOrders,
  settings,
  setSettings,
  addToast,
  onExitAdmin,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onUnauthorized,
  onLogout,
  users,
  setUsers,
}) => {
  // Admin Authentication State
  const adminAuth = currentUser || (() => {
    try {
      const saved = localStorage.getItem('cylet_admin_auth') || localStorage.getItem('cylet_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Enforce protection: if unauthenticated or role === 'customer', redirect out with 'Failed to Login'
  useEffect(() => {
    if (!adminAuth || adminAuth.role === 'customer') {
      if (onUnauthorized) {
        onUnauthorized('Failed to Login');
      } else if (onExitAdmin) {
        onExitAdmin();
      }
    }
  }, [adminAuth, onUnauthorized, onExitAdmin]);

  // Admin Active Tab: 'dashboard' | 'products' | 'orders' | 'categories' | 'deals' | 'stores' | 'settings' | 'users'
  const [adminTab, setAdminTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Selected Order for the Order Detail Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Enforce role-based tab access:
  // manager -> Dashboard, Products, Orders, Stores
  // admin -> Dashboard, Products, Orders, Categories, Deals, Stores, Settings, Users
  useEffect(() => {
    if (adminAuth && adminAuth.role === 'manager') {
      const allowed = ['dashboard', 'products', 'orders', 'stores'];
      if (!allowed.includes(adminTab)) {
        setAdminTab('dashboard');
      }
    }
  }, [adminAuth, adminTab]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        localStorage.removeItem('cylet_admin_auth');
        localStorage.removeItem('cylet_user');
      } catch (e) {}
      if (onExitAdmin) onExitAdmin();
    }
  };

  // If not authenticated or customer role, don't render admin UI
  if (!adminAuth || adminAuth.role === 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Mobile hamburger & logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle sidebar menu"
          >
            <Icon name="Menu" className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2.5">
            <img
              src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
              alt="Cylet Logo"
              className="h-9 w-auto max-w-[110px] object-cover rounded-xl shadow-md border border-slate-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Cylet</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                  Admin Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Embu Siakago Rd Flagship & Regional Operations
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Icon name="Search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, orders, customers (#FM-94...)"
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {adminSearchQuery && (
              <button
                type="button"
                onClick={() => setAdminSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Storefront Link, Theme Toggle, Admin Avatar & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onExitAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="ExternalLink" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Storefront</span>
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Icon name="Sun" className="w-5 h-5 text-amber-400" /> : <Icon name="Moon" className="w-5 h-5" />}
          </button>

          {/* Admin User Badge with Dynamic Role Pill */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <div
              className={`w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm ${
                adminAuth.role === 'admin'
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-blue-600 shadow-blue-600/30'
              }`}
            >
              {adminAuth.avatar || (adminAuth.role === 'admin' ? 'SJ' : 'MO')}
            </div>
            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {adminAuth.name || (adminAuth.role === 'admin' ? 'Sarah Jenkins' : 'Michael Omondi')}
                </p>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    adminAuth.role === 'admin'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                  }`}
                >
                  {adminAuth.role === 'admin' ? 'Super Admin' : 'Manager'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {adminAuth.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
              aria-label="Sign out of admin portal"
            >
              <Icon name="LogOut" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-0 md:top-[61px] left-0 h-full md:h-[calc(100vh-61px)] w-64 bg-slate-900 text-slate-300 flex flex-col z-50 md:z-10 transition-transform duration-300 ease-in-out border-r border-slate-800 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-4 md:hidden flex items-center justify-between border-b border-slate-800">
            <span className="font-extrabold text-white text-base">Navigation</span>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1 flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
              Operations
            </div>

            <SidebarNavLink
              active={adminTab === 'dashboard'}
              onClick={() => {
                setAdminTab('dashboard');
                setMobileSidebarOpen(false);
              }}
              icon="LayoutDashboard"
              label="Dashboard"
            />

            <SidebarNavLink
              active={adminTab === 'products'}
              onClick={() => {
                setAdminTab('products');
                setMobileSidebarOpen(false);
              }}
              icon="Package"
              label="Products"
              badge={products.length}
            />

            <SidebarNavLink
              active={adminTab === 'orders'}
              onClick={() => {
                setAdminTab('orders');
                setMobileSidebarOpen(false);
              }}
              icon="ShoppingBag"
              label="Orders"
              badge={orders.filter((o) => o.status === 'Pending').length}
              badgeColor="amber"
            />

            {/* Categories: Visible only to 'admin' role */}
            {adminAuth.role === 'admin' && (
              <SidebarNavLink
                active={adminTab === 'categories'}
                onClick={() => {
                  setAdminTab('categories');
                  setMobileSidebarOpen(false);
                }}
                icon="Layers"
                label="Categories"
                badge={categories.filter((c) => c.id !== 'all').length}
              />
            )}

            {/* Weekly Deals: Visible only to 'admin' role */}
            {adminAuth.role === 'admin' && (
              <SidebarNavLink
                active={adminTab === 'deals'}
                onClick={() => {
                  setAdminTab('deals');
                  setMobileSidebarOpen(false);
                }}
                icon="Percent"
                label="Weekly Deals"
                badge={deals.length}
                badgeColor="orange"
              />
            )}

            <SidebarNavLink
              active={adminTab === 'stores'}
              onClick={() => {
                setAdminTab('stores');
                setMobileSidebarOpen(false);
              }}
              icon="MapPin"
              label="Store Locations"
              badge={stores.length}
            />

            {/* Store Settings: Visible only to 'admin' role */}
            {adminAuth.role === 'admin' && (
              <SidebarNavLink
                active={adminTab === 'settings'}
                onClick={() => {
                  setAdminTab('settings');
                  setMobileSidebarOpen(false);
                }}
                icon="Settings"
                label="Store Settings"
              />
            )}

            {/* Users & Access: Visible only to 'admin' role */}
            {adminAuth.role === 'admin' && (
              <SidebarNavLink
                active={adminTab === 'users'}
                onClick={() => {
                  setAdminTab('users');
                  setMobileSidebarOpen(false);
                }}
                icon="Users"
                label="Users"
                badge={users ? users.length : 3}
              />
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              <Icon name="ExternalLink" className="w-4 h-4 text-emerald-400" />
              <span>Back to Storefront</span>
            </button>
            <div className="mt-3 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Cylet Admin v2.4.0</span>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {adminTab === 'dashboard' && (
            <AdminDashboardTab
              orders={orders}
              products={products}
              categories={categories}
              stores={stores}
              deals={deals}
              onNavigateTab={setAdminTab}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {adminTab === 'products' && (
            <AdminProductsTab
              products={products}
              setProducts={setProducts}
              categories={categories}
              searchQuery={adminSearchQuery}
              addToast={addToast}
            />
          )}

          {adminTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              setOrders={setOrders}
              searchQuery={adminSearchQuery}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
              addToast={addToast}
            />
          )}

          {adminTab === 'categories' && (
            adminAuth.role === 'admin' ? (
              <AdminCategoriesTab
                categories={categories}
                setCategories={setCategories}
                products={products}
                addToast={addToast}
              />
            ) : (
              <AccessRestrictedCard
                feature="Product Categories"
                requiredRole="Super Admin"
                userRole={adminAuth.role}
                onGoBack={() => setAdminTab('dashboard')}
              />
            )
          )}

          {adminTab === 'deals' && (
            adminAuth.role === 'admin' ? (
              <AdminDealsTab
                deals={deals}
                setDeals={setDeals}
                products={products}
                setProducts={setProducts}
                addToast={addToast}
              />
            ) : (
              <AccessRestrictedCard
                feature="Weekly Deals"
                requiredRole="Super Admin"
                userRole={adminAuth.role}
                onGoBack={() => setAdminTab('dashboard')}
              />
            )
          )}

          {adminTab === 'stores' && (
            <AdminStoresTab
              stores={stores}
              setStores={setStores}
              addToast={addToast}
            />
          )}

          {adminTab === 'settings' && (
            adminAuth.role === 'admin' ? (
              <AdminSettingsTab
                settings={settings}
                setSettings={setSettings}
                addToast={addToast}
              />
            ) : (
              <AccessRestrictedCard
                feature="Store Settings"
                requiredRole="Super Admin"
                userRole={adminAuth.role}
                onGoBack={() => setAdminTab('dashboard')}
              />
            )
          )}

          {adminTab === 'users' && (
            adminAuth.role === 'admin' ? (
              <AdminUsersTab
                users={users}
                setUsers={setUsers}
                addToast={addToast}
              />
            ) : (
              <AccessRestrictedCard
                feature="User Management"
                requiredRole="Super Admin"
                userRole={adminAuth.role}
                onGoBack={() => setAdminTab('dashboard')}
              />
            )
          )}
        </main>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, newStatus) => {
            setOrders((prev) =>
              prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
            setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
            addToast({
              title: 'Order Status Updated',
              message: `Order #${orderId} marked as ${newStatus}.`,
              type: 'success',
            });
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// 1. Sidebar Nav Link Component
// ============================================================================
const SidebarNavLink = ({ active, onClick, icon, label, badge, badgeColor = 'emerald' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon name={icon} className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            active
              ? 'bg-white/20 text-white'
              : badgeColor === 'amber'
              ? 'bg-amber-500/20 text-amber-300'
              : badgeColor === 'orange'
              ? 'bg-orange-500/20 text-orange-300'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// 1.5 Access Restricted Card (RBAC Gate)
// ============================================================================
const AccessRestrictedCard = ({ feature, requiredRole = 'Super Admin', userRole, onGoBack }) => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
        <Icon name="ShieldAlert" className="w-8 h-8" />
      </div>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Icon name="Lock" className="w-3.5 h-3.5" />
          <span>Access Restricted</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          {feature} Requires {requiredRole}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Your account is currently signed in as <strong>{userRole === 'manager' ? 'Store Manager' : userRole}</strong>.
          Managers have permission to view orders and edit products, but cannot modify store settings or product categories.
        </p>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
        <p className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
          Permission Breakdown for Store Manager:
        </p>
        <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <Icon name="Check" className="w-3.5 h-3.5 shrink-0" />
            <span>View & Update Orders</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <Icon name="Check" className="w-3.5 h-3.5 shrink-0" />
            <span>Edit Products & Stock</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-medium">
            <Icon name="X" className="w-3.5 h-3.5 shrink-0" />
            <span>Categories (Restricted)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-medium">
            <Icon name="X" className="w-3.5 h-3.5 shrink-0" />
            <span>Store Settings (Restricted)</span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onGoBack}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
        >
          <Icon name="LayoutDashboard" className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. Admin Login Screen (Role-Based Access)
// ============================================================================
const AdminLoginScreen = ({ onLogin, onExitAdmin, darkMode, onToggleDarkMode, addToast }) => {
  const [email, setEmail] = useState('cyletsupermarkets@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const authenticatedUser = authenticateMockUser(email, password);
      if (authenticatedUser) {
        onLogin({
          ...authenticatedUser,
          loggedInAt: new Date().toISOString(),
        });
      } else {
        setError('Invalid credentials. Please select one of the demo roles below or enter valid credentials.');
      }
    }, 350);
  };

  const handleQuickLogin = (roleKey) => {
    const userToLogin = MOCK_ADMIN_USERS.find((u) => u.role === roleKey);
    if (userToLogin) {
      setEmail(userToLogin.email);
      setPassword(userToLogin.password);
      setError('');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const { password: _, ...safeUser } = userToLogin;
        onLogin({
          ...safeUser,
          loggedInAt: new Date().toISOString(),
        });
      }, 300);
    }
  };

  const handleSelectRole = (roleKey) => {
    const user = MOCK_ADMIN_USERS.find((u) => u.role === roleKey);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setError('');
      addToast({
        title: `${user.title} Selected`,
        message: `Loaded credentials for ${user.email}`,
        type: 'info',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right exit & theme button */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Icon name="Sun" className="w-5 h-5 text-amber-400" /> : <Icon name="Moon" className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={onExitAdmin}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
        >
          <Icon name="ArrowRight" className="w-4 h-4 rotate-180" />
          <span>Exit to Storefront</span>
        </button>
      </div>

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-600/30 mb-4">
            <Icon name="Leaf" className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Cylet Admin Portal</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Sign in to manage catalog, orders, and branch operations
          </p>
        </div>

        {/* Role Presets / 1-Click Access Cards */}
        <div className="mb-6 space-y-2.5">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400">
            Select Role or 1-Click Sign In:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Admin Role Card */}
            <div
              onClick={() => handleSelectRole('admin')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all text-left ${
                email === 'cyletsupermarkets@gmail.com' || email === 'admin@cylet.com' || email === 'admin@freshmart.com'
                  ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Admin
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLogin('admin');
                  }}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                >
                  Sign In →
                </button>
              </div>
              <p className="text-xs font-bold text-white">Sarah Jenkins</p>
              <p className="text-[11px] text-slate-400">cyletsupermarkets@gmail.com</p>
              <p className="text-[10px] text-emerald-400/90 font-medium mt-1">Full system access (All tabs)</p>
            </div>

            {/* Manager Role Card */}
            <div
              onClick={() => handleSelectRole('manager')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all text-left ${
                email === 'manager@cylet.com' || email === 'manager@freshmart.com'
                  ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-900/80 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Manager
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLogin('manager');
                  }}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  Sign In →
                </button>
              </div>
              <p className="text-xs font-bold text-white">Michael Omondi</p>
              <p className="text-[11px] text-slate-400">manager@cylet.com</p>
              <p className="text-[10px] text-blue-400/90 font-medium mt-1">Orders & Products only</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs font-medium">
            <Icon name="AlertTriangle" className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Icon name="Mail" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cyletsupermarkets@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">
                {email === 'manager@cylet.com' || email === 'manager@freshmart.com' ? 'Demo: manager123' : 'Demo: admin123'}
              </span>
            </div>
            <div className="relative">
              <Icon name="ShieldCheck" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
              />
              <span>Remember session</span>
            </label>
            <span className="text-slate-400 text-[11px]">
              Active: <strong>{email.includes('manager') ? 'Store Manager' : 'Super Admin'}</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Role-Based Access Control Active. Managers are restricted from Settings and Categories.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. Tab: Admin Dashboard
// ============================================================================
const AdminDashboardTab = ({ orders, products, categories, stores, deals, onNavigateTab, onSelectOrder }) => {
  // KPI Calculations
  const todayOrders = useMemo(() => {
    return orders.filter((o) => o.date.startsWith('2026-10-18'));
  }, [orders]);

  const todayRevenue = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  }, [todayOrders]);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status !== 'inactive');
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.stock !== undefined ? p.stock < 15 : false));
  }, [products]);

  // Last 7 days revenue for chart
  const revenueChartData = useMemo(() => {
    return [
      { day: 'Mon 12', label: 'Oct 12', revenue: 74200, orders: 28 },
      { day: 'Tue 13', label: 'Oct 13', revenue: 89000, orders: 34 },
      { day: 'Wed 14', label: 'Oct 14', revenue: 76500, orders: 31 },
      { day: 'Thu 15', label: 'Oct 15', revenue: 110200, orders: 39 },
      { day: 'Fri 16', label: 'Oct 16', revenue: 145000, orders: 48 },
      { day: 'Sat 17', label: 'Oct 17', revenue: 189000, orders: 54 },
      { day: 'Today', label: 'Oct 18', revenue: todayRevenue > 0 ? todayRevenue : 94500, orders: todayOrders.length > 0 ? todayOrders.length : 38 },
    ];
  }, [todayRevenue, todayOrders]);

  const sevenDayRevenue = useMemo(() => revenueChartData.reduce((sum, d) => sum + d.revenue, 0), [revenueChartData]);
  const sevenDayOrders = useMemo(() => revenueChartData.reduce((sum, d) => sum + d.orders, 0), [revenueChartData]);
  const avgOrderValue = useMemo(() => (sevenDayOrders > 0 ? Math.round(sevenDayRevenue / sevenDayOrders) : 2150), [sevenDayRevenue, sevenDayOrders]);

  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue));

  // Recent 10 orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 10);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Supermarket Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Live overview across all 10 Cylet store branches & fulfillment routes in Embu, Kenya.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Icon name="Plus" className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('deals')}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
          >
            <Icon name="Percent" className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Orders Today */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Orders Today</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon name="ShoppingBag" className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{todayOrders.length || 38}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <Icon name="TrendingUp" className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">vs 33 orders yesterday</p>
        </div>

        {/* KPI 2: Revenue Today */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Revenue Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon name="DollarSign" className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {formatKES(todayRevenue > 0 ? todayRevenue : 94500)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <Icon name="TrendingUp" className="w-3.5 h-3.5 mr-0.5" /> +8.5%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Average order: {formatKES(avgOrderValue)}</p>
        </div>

        {/* KPI 3: Active Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon name="Package" className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{activeProducts.length}</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ {products.length} total</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Across {categories.length - 1} grocery aisles</p>
        </div>

        {/* KPI 4: Low-Stock Alerts */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Low-Stock Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icon name="AlertTriangle" className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {lowStockProducts.length || 4}
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Needs restock</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Click to inspect & reorder</span>
            <Icon name="ArrowRight" className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 7-Day Revenue Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Icon name="BarChart3" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Last 7 Days Revenue Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cumulative grocery sales across 11 physical stores & online express checkout
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
              <span className="text-slate-700 dark:text-slate-300">Revenue (KES)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-200 dark:bg-emerald-950" />
              <span className="text-slate-500 dark:text-slate-400">Previous Cycle</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
          {revenueChartData.map((d, index) => {
            const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
            const isToday = index === revenueChartData.length - 1;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Hover Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg pointer-events-none shadow-xl whitespace-nowrap z-20">
                  {d.label}: {formatKES(d.revenue)} ({d.orders} orders)
                </div>

                {/* Amount on top of bar on hover / today */}
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 hidden sm:block">
                  {formatKES(Math.round(d.revenue))}
                </span>

                {/* The Bar itself */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative group-hover:brightness-110 ${
                    isToday
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30'
                      : 'bg-emerald-600/70 hover:bg-emerald-600'
                  }`}
                />

                {/* Day label */}
                <span className={`text-xs mt-3 font-bold truncate max-w-full ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>7-Day Total Revenue: <strong className="text-slate-900 dark:text-white">{formatKES(sevenDayRevenue)}</strong></span>
          <span>Average Order Value: <strong className="text-slate-900 dark:text-white">{formatKES(avgOrderValue)}</strong></span>
          <span>On-Time Fulfillment Rate: <strong className="text-emerald-600 dark:text-emerald-400">98.4%</strong></span>
        </div>
      </div>

      {/* Recent Orders Table (Last 10) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Showing last 10 grocery orders placed across all branches</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <Icon name="ArrowRight" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{order.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{order.customer.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.branchName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {formatKES(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    {order.formattedDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  switch (status) {
    case 'Delivered':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          Delivered
        </span>
      );
    case 'Processing':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          Processing
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {status}
        </span>
      );
  }
};

// ============================================================================
// 4. Tab: Admin Products (with CRUD, pagination 20/page, Modal)
// ============================================================================
const AdminProductsTab = ({ products, setProducts, categories, searchQuery, addToast }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirmation
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = (p.brand || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all') {
        const isInactive = p.status === 'inactive';
        if (statusFilter === 'active' && isInactive) return false;
        if (statusFilter === 'inactive' && !isInactive) return false;
      }
      // Stock filter
      if (stockFilter === 'low') {
        const stock = p.stock !== undefined ? p.stock : 25;
        if (stock >= 15) return false;
      } else if (stockFilter === 'out') {
        const stock = p.stock !== undefined ? p.stock : 25;
        if (stock > 0) return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory, statusFilter, stockFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, statusFilter, stockFilter]);

  // Toggle status (Active / Inactive)
  const handleToggleStatus = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStatus = p.status === 'inactive' ? 'active' : 'inactive';
          addToast({
            title: `Product ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
            message: `${p.name} is now ${newStatus}.`,
            type: newStatus === 'active' ? 'success' : 'info',
          });
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  // Delete product
  const confirmDelete = () => {
    if (!productToDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    addToast({
      title: 'Product Deleted',
      message: `${productToDelete.name} has been removed from catalog.`,
      type: 'info',
    });
    setProductToDelete(null);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
      );
      addToast({
        title: 'Product Updated',
        message: `${formData.name} details were saved successfully.`,
        type: 'success',
      });
    } else {
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...formData,
        rating: 4.8,
        reviewCount: 1,
        inStock: formData.stock > 0,
        tags: ['Cylet Choice'],
      };
      setProducts((prev) => [newProduct, ...prev]);
      addToast({
        title: 'Product Created',
        message: `${formData.name} added to catalog inventory.`,
        type: 'success',
      });
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Manage inventory levels, prices, categories, and active status ({products.length} products total).
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Icon name="Plus" className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <div className="flex-1 min-w-[160px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Departments ({products.length})</option>
            {categories
              .filter((c) => c.id !== 'all')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Status: All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Stock Level Dropdown */}
        <div className="w-40">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Stock: All</option>
            <option value="low">Low Stock (&lt;15)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>

        {/* Active Filters Clear */}
        {(selectedCategory !== 'all' || statusFilter !== 'all' || stockFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('all');
              setStockFilter('all');
            }}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline px-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Icon name="Package" className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold">No products match your current filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const stock = p.stock !== undefined ? p.stock : 24;
                  const isLowStock = stock < 15;
                  const isOut = stock === 0;
                  const isActive = p.status !== 'inactive';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Product Thumbnail + Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{p.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {p.brand} • <span className="italic">{p.unit}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {formatKES(p.price)}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="ml-1.5 text-xs text-slate-400 line-through">
                            {formatKES(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOut ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span className={`font-bold ${isOut ? 'text-rose-600' : isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {stock} in stock
                          </span>
                        </div>
                        {isLowStock && !isOut && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                            Low Stock Alert
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-slate-400'}`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Edit Product"
                          >
                            <Icon name="Edit2" className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Product"
                          >
                            <Icon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (20 per page) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> products
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-bold ${
                  currentPage === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Product?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white">{productToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for Add / Edit Product
const ProductFormModal = ({ product, categories, onClose, onSave }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [category, setCategory] = useState(product ? product.category : 'produce');
  const [brand, setBrand] = useState(product ? product.brand : 'Cylet Organic');
  const [price, setPrice] = useState(product ? product.price : 4.99);
  const [originalPrice, setOriginalPrice] = useState(product ? (product.originalPrice || '') : '');
  const [stock, setStock] = useState(product ? (product.stock !== undefined ? product.stock : 24) : 25);
  const [unit, setUnit] = useState(product ? product.unit : 'per lb');
  const [image, setImage] = useState(product ? product.image : PRESET_IMAGES[0].url);
  const [status, setStatus] = useState(product ? (product.status || 'active') : 'active');
  const [description, setDescription] = useState(product ? product.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      category,
      brand: brand.trim(),
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      stock: parseInt(stock, 10) || 0,
      unit: unit.trim(),
      image: image.trim(),
      status,
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Honeycrisp Apples"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Cylet Organic"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Sale Price (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Original Price (KSh)
              </label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Unit / Packaging *
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="per lb, bag of 4, 12 oz..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
            />

            {/* Quick Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-400 font-bold shrink-0">Presets:</span>
              {PRESET_IMAGES.slice(0, 6).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Product Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh farm sourcing details, certifications, and nutritional highlights..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 5. Tab: Admin Orders (with status dropdown & Order Detail Drawer)
// ============================================================================
const AdminOrdersTab = ({ orders, setOrders, searchQuery, selectedOrder, onSelectOrder, addToast }) => {
  const [statusTab, setStatusTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status tab
      if (statusTab !== 'all' && o.status !== statusTab) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesCust = o.customer.name.toLowerCase().includes(q);
        const matchesEmail = o.customer.email.toLowerCase().includes(q);
        if (!matchesId && !matchesCust && !matchesEmail) return false;
      }
      return true;
    });
  }, [orders, statusTab, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusTab, searchQuery]);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast({
      title: 'Order Status Changed',
      message: `Order #${orderId} marked as ${newStatus}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Customer Orders</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          Track customer transactions, dispatch status, delivery addresses, and payment receipts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((tab) => {
          const count = tab === 'all' ? orders.length : orders.filter((o) => o.status === tab).length;
          const isActive = statusTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{tab === 'all' ? 'All Orders' : tab}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Icon name="ShoppingBag" className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold">No orders found matching this filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      #{order.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">{order.customer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{order.customer.email}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatKES(order.total)}</span>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                        {order.fulfillmentType === 'pickup' ? 'Branch Pickup' : 'Express Delivery'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {order.paymentMethod.includes('M-Pesa')
                        ? 'M-Pesa'
                        : order.paymentMethod.includes('Card')
                        ? 'Credit Card'
                        : 'Cash (COD)'}
                    </td>

                    {/* Status with Inline Dropdown */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : order.status === 'Pending'
                            ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {order.formattedDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900 dark:text-white">{filteredOrders.length}</span> orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-bold ${
                  currentPage === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Detail Slide-out Drawer
const OrderDetailDrawer = ({ order, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl z-10 flex flex-col overflow-hidden border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">
                #{order.id}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Placed {order.formattedDate}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Status Update Control */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2">
              Update Dispatch Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(order.id, st)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    order.status === st
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Customer Information
            </h3>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customer.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{order.customer.email}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{order.customer.phone}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {order.fulfillmentType === 'pickup' ? 'Curbside Pickup Branch' : 'Delivery Address'}
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{order.address.street}</p>
              <p className="text-xs text-slate-500">{order.address.city}, {order.address.postalCode}</p>
              {order.address.instructions && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Note:</strong> {order.address.instructions}
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatKES(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {formatKES(item.total || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h3 className="font-black uppercase tracking-wider text-slate-400 mb-2">
              Payment & Totals
            </h3>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatKES(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {order.deliveryFee === 0 ? 'FREE' : formatKES(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatKES(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Discount Promo</span>
                <span>-{formatKES(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatKES(order.total)}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Method: <strong>{order.paymentMethod}</strong>
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            Close Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. Tab: Admin Categories (Add, Rename, Reorder, Delete)
// ============================================================================
const AdminCategoriesTab = ({ categories, setCategories, products, addToast }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catToDelete, setCatToDelete] = useState(null);

  // Compute product count per category dynamically
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat, idx) => {
      const count =
        cat.id === 'all'
          ? products.length
          : products.filter((p) => p.category === cat.id).length;
      return { ...cat, count, order: idx + 1 };
    });
  }, [categories, products]);

  // Reorder: Move Up
  const handleMoveUp = (index) => {
    if (index <= 1) return; // index 0 is 'all', cannot move 'all' or move into 'all'
    setCategories((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
    addToast({ title: 'Reordered', message: 'Category order updated.', type: 'info' });
  };

  // Reorder: Move Down
  const handleMoveDown = (index) => {
    if (index >= categories.length - 1 || index === 0) return;
    setCategories((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
    addToast({ title: 'Reordered', message: 'Category order updated.', type: 'info' });
  };

  // Add / Edit Category Save
  const handleSaveCategory = (catData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...catData } : c))
      );
      addToast({
        title: 'Category Updated',
        message: `${catData.name} renamed successfully.`,
        type: 'success',
      });
    } else {
      const newCat = {
        id: catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ...catData,
      };
      setCategories((prev) => [...prev, newCat]);
      addToast({
        title: 'Category Created',
        message: `${catData.name} aisle added to catalog.`,
        type: 'success',
      });
    }
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  // Delete Category
  const confirmDeleteCategory = () => {
    if (!catToDelete) return;
    setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
    addToast({
      title: 'Category Removed',
      message: `${catToDelete.name} has been removed.`,
      type: 'info',
    });
    setCatToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Department Aisles & Categories</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Manage storefront departments, display ordering, and live inventory assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Icon name="Plus" className="w-5 h-5" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 w-16">Sort</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Icon Identifier</th>
                <th className="py-3 px-4">Product Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {categoriesWithCounts.map((cat, index) => {
                const isAll = cat.id === 'all';
                return (
                  <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Sort controls */}
                    <td className="py-3.5 px-4">
                      {!isAll && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index <= 1}
                            onClick={() => handleMoveUp(index)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index >= categories.length - 1}
                            onClick={() => handleMoveDown(index)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Category Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{cat.name}</span>
                        {isAll && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                            Default Root
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Icon name */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {cat.icon || 'Sparkles'}
                    </td>

                    {/* Product count */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                        {cat.count} products
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!isAll && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title="Rename Category"
                          >
                            <Icon name="Edit2" className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatToDelete(cat)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Category"
                          >
                            <Icon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingCategory ? 'Rename Category' : 'Add New Category'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                handleSaveCategory({
                  name: form.catName.value.trim(),
                  icon: form.catIcon.value.trim() || 'Sparkles',
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  name="catName"
                  type="text"
                  required
                  defaultValue={editingCategory ? editingCategory.name : ''}
                  placeholder="e.g. Organic Dairy & Eggs"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Icon Name
                </label>
                <input
                  name="catIcon"
                  type="text"
                  defaultValue={editingCategory ? editingCategory.icon : 'Sparkles'}
                  placeholder="Sparkles, Apple, Beef, Egg..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-md shadow-emerald-600/30"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {catToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Category?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
              Delete category <strong className="text-slate-900 dark:text-white">{catToDelete.name}</strong>? Any existing products will remain in the catalog.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCatToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 7. Tab: Admin Deals (Weekly Deals creation & editing)
// ============================================================================
const AdminDealsTab = ({ deals, setDeals, products, setProducts, addToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  // Delete Deal
  const handleDeleteDeal = (dealId) => {
    const deal = deals.find((d) => d.id === dealId);
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    // Reset product weekly deal flag
    if (deal && deal.productId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === deal.productId ? { ...p, isWeeklyDeal: false } : p))
      );
    }
    addToast({
      title: 'Deal Removed',
      message: 'Weekly promotion was deactivated.',
      type: 'info',
    });
  };

  const handleSaveDeal = (dealData) => {
    if (editingDeal) {
      setDeals((prev) =>
        prev.map((d) => (d.id === editingDeal.id ? { ...d, ...dealData } : d))
      );
      addToast({ title: 'Deal Updated', message: 'Promotional pricing updated.', type: 'success' });
    } else {
      const newDeal = {
        id: `deal-${Date.now()}`,
        ...dealData,
        status: 'Active',
      };
      setDeals((prev) => [newDeal, ...prev]);
      // Update the product to be a weekly deal
      setProducts((prev) =>
        prev.map((p) =>
          p.id === dealData.productId
            ? {
                ...p,
                isWeeklyDeal: true,
                price: dealData.salePrice,
                originalPrice: dealData.originalPrice,
                badge: dealData.badge || 'PROMO',
              }
            : p
        )
      );
      addToast({
        title: 'Weekly Deal Published',
        message: 'Promotional price is now active on the storefront.',
        type: 'success',
      });
    }
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Deals & Specials</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Configure featured discounted items for the storefront weekly carousel and live countdown clock.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingDeal(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-md shadow-orange-600/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Icon name="Plus" className="w-5 h-5" />
          <span>Create Weekly Deal</span>
        </button>
      </div>

      {/* Deals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => {
          const product = products.find((p) => p.id === deal.productId);
          const savings = deal.originalPrice - deal.salePrice;
          const discountPercent = Math.round((savings / deal.originalPrice) * 100);

          return (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-xs font-black uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Save {formatKES(savings)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={deal.image || (product && product.image)}
                    alt={deal.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {deal.productName}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-orange-600 dark:text-orange-400">
                        {formatKES(deal.salePrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatKES(deal.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <p>
                    <strong>Schedule:</strong> {deal.startDate} → {deal.endDate}
                  </p>
                  <p>
                    <strong>Badge:</strong> {deal.badge || '⚡ Limited time'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeal(deal);
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
                >
                  <Icon name="Edit2" className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDeal(deal.id)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-500 flex items-center gap-1"
                >
                  <Icon name="Trash2" className="w-3.5 h-3.5" />
                  <span>End Promotion</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Deal Modal */}
      {isModalOpen && (
        <DealFormModal
          deal={editingDeal}
          products={products}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDeal(null);
          }}
          onSave={handleSaveDeal}
        />
      )}
    </div>
  );
};

// Deal Form Modal
const DealFormModal = ({ deal, products, onClose, onSave }) => {
  const [selectedProdId, setSelectedProdId] = useState(deal ? deal.productId : products[0]?.id || '');
  const selectedProduct = products.find((p) => p.id === selectedProdId);

  const [salePrice, setSalePrice] = useState(deal ? deal.salePrice : 3.49);
  const [originalPrice, setOriginalPrice] = useState(
    deal ? deal.originalPrice : (selectedProduct?.originalPrice || selectedProduct?.price || 4.99)
  );
  const [startDate, setStartDate] = useState(deal ? deal.startDate : '2026-10-18');
  const [endDate, setEndDate] = useState(deal ? deal.endDate : '2026-10-25');
  const [badge, setBadge] = useState(deal ? deal.badge : '⚡ Limited time');

  // When selected product changes, adjust default prices
  const handleProductChange = (prodId) => {
    setSelectedProdId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setOriginalPrice(prod.price);
      setSalePrice(parseFloat((prod.price * 0.8).toFixed(2)));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      productId: selectedProdId,
      productName: selectedProduct?.name || 'Weekly Grocery Deal',
      image: selectedProduct?.image || '',
      salePrice: parseFloat(salePrice),
      originalPrice: parseFloat(originalPrice),
      startDate,
      endDate,
      badge,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
          {deal ? 'Edit Weekly Deal' : 'Create Weekly Deal'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Select Product *
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatKES(p.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Original Price (KSh)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Sale Price (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Badge Label
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="⚡ Limited time, 25% OFF..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 font-extrabold text-xs text-white shadow-md shadow-orange-600/30"
            >
              {deal ? 'Save Changes' : 'Activate Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 8. Tab: Admin Stores (Branches list, Add, Edit, Lat/Lng)
// ============================================================================
const AdminStoresTab = ({ stores, setStores, addToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const handleSaveStore = (storeData) => {
    if (editingStore) {
      setStores((prev) =>
        prev.map((s) => (s.id === editingStore.id ? { ...s, ...storeData } : s))
      );
      addToast({
        title: 'Branch Updated',
        message: `${storeData.name} details saved.`,
        type: 'success',
      });
    } else {
      const newStore = {
        id: `store-${Date.now()}`,
        code: `FM-${stores.length + 1}`,
        ...storeData,
        isOpenNow: true,
      };
      setStores((prev) => [...prev, newStore]);
      addToast({
        title: 'Branch Added',
        message: `${storeData.name} added to supermarket network.`,
        type: 'success',
      });
    }
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const confirmDeleteStore = () => {
    if (!storeToDelete) return;
    setStores((prev) => prev.filter((s) => s.id !== storeToDelete.id));
    addToast({
      title: 'Branch Removed',
      message: `${storeToDelete.name} removed from store locator.`,
      type: 'info',
    });
    setStoreToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Supermarket Branch Network</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Manage 11 physical supermarket stores, operating hours, phone numbers, and Leaflet GPS pins.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingStore(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Icon name="Plus" className="w-5 h-5" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {store.code || 'FM-LOC'}
                </span>
                {store.isFlagship && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                    Flagship Store
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                {store.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex items-start gap-1.5">
                <Icon name="MapPin" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{store.address}, {store.city}</span>
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{store.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Weekdays:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{store.hours?.weekday || '7 AM - 10 PM'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Weekends:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{store.hours?.weekend || '8 AM - 9 PM'}</strong>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>GPS:</span>
                  <span>{store.coordinates?.lat?.toFixed(4)}, {store.coordinates?.lng?.toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditingStore(store);
                  setIsModalOpen(true);
                }}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
              >
                <Icon name="Edit2" className="w-3.5 h-3.5" />
                <span>Edit Branch</span>
              </button>
              <button
                type="button"
                onClick={() => setStoreToDelete(store)}
                className="text-xs font-bold text-rose-600 hover:text-rose-500 flex items-center gap-1"
              >
                <Icon name="Trash2" className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Store Modal */}
      {isModalOpen && (
        <StoreFormModal
          store={editingStore}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStore(null);
          }}
          onSave={handleSaveStore}
        />
      )}

      {/* Delete Store Confirmation */}
      {storeToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Branch?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
              Remove <strong className="text-slate-900 dark:text-white">{storeToDelete.name}</strong> from the store locator?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStoreToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStore}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Store Form Modal
const StoreFormModal = ({ store, onClose, onSave }) => {
  const [name, setName] = useState(store ? store.name : '');
  const [code, setCode] = useState(store ? store.code : 'CY-11');
  const [address, setAddress] = useState(store ? store.address : '');
  const [city, setCity] = useState(store ? store.city : 'Embu');
  const [phone, setPhone] = useState(store ? store.phone : '+254 20 2003310');
  const [email, setEmail] = useState(store ? store.email : 'embu@cyletsupermarkets.com');
  const [weekdayHours, setWeekdayHours] = useState(store?.hours?.weekday || '7:00 AM - 10:00 PM');
  const [weekendHours, setWeekendHours] = useState(store?.hours?.weekend || '8:00 AM - 9:00 PM');
  const [lat, setLat] = useState(store?.coordinates?.lat || -0.5342);
  const [lng, setLng] = useState(store?.coordinates?.lng || 37.4560);
  const [isFlagship, setIsFlagship] = useState(store ? !!store.isFlagship : false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      code: code.trim(),
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isFlagship,
      hours: {
        weekday: weekdayHours,
        weekend: weekendHours,
      },
      coordinates: {
        x: 50,
        y: 50,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
          {store ? 'Edit Branch' : 'Add New Branch'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cylet Supermarket - Embu Main Branch"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="FM-12"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="104 Market Street"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                City / District *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Metropolis"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Weekday Hours
              </label>
              <input
                type="text"
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(e.target.value)}
                placeholder="7:00 AM - 10:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Weekend Hours
              </label>
              <input
                type="text"
                value={weekendHours}
                onChange={(e) => setWeekendHours(e.target.value)}
                placeholder="8:00 AM - 9:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Latitude (GPS)
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Longitude (GPS)
              </label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFlagship}
                onChange={(e) => setIsFlagship(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-50 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Designate as Regional Flagship Supermarket
              </span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-md shadow-emerald-600/30"
            >
              {store ? 'Save Changes' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 9. Tab: Admin Settings (Store name, logo upload, delivery fee, threshold, payment toggles)
// ============================================================================
const AdminSettingsTab = ({ settings, setSettings, addToast }) => {
  const [storeName, setStoreName] = useState(settings?.storeName || 'Cylet Supermarket');
  const [tagline, setTagline] = useState(settings?.tagline || 'Farm-Fresh Groceries & Everyday Essentials');
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || 'https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'cyletsupermarkets@gmail.com');
  const [phone, setPhone] = useState(settings?.phone || '+254 20 2003310');
  const [address, setAddress] = useState(settings?.address || 'Embu - Siakago Road (near Kubukubu Rd.) in Embu, Kenya');
  const [deliveryFee, setDeliveryFee] = useState(settings?.deliveryFee !== undefined ? settings.deliveryFee : 4.99);
  const [freeThreshold, setFreeThreshold] = useState(settings?.freeDeliveryThreshold !== undefined ? settings.freeDeliveryThreshold : 50.0);

  // Payment method toggles
  const [payCard, setPayCard] = useState(settings?.paymentMethods?.card !== false);
  const [payMpesa, setPayMpesa] = useState(settings?.paymentMethods?.mpesa !== false);
  const [payCod, setPayCod] = useState(settings?.paymentMethods?.cod !== false);

  // Simulated logo upload
  const fileInputRef = useRef(null);
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setLogoUrl(simulatedUrl);
      addToast({
        title: 'Logo Selected',
        message: `${file.name} loaded as store brand icon.`,
        type: 'info',
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      logoUrl: logoUrl.trim(),
      supportEmail: supportEmail.trim(),
      phone: phone.trim(),
      address: address.trim(),
      deliveryFee: parseFloat(deliveryFee) || 0,
      freeDeliveryThreshold: parseFloat(freeThreshold) || 0,
      paymentMethods: {
        card: payCard,
        mpesa: payMpesa,
        cod: payCod,
      },
    };
    setSettings(updated);
    try {
      localStorage.setItem('cylet_settings', JSON.stringify(updated));
      localStorage.removeItem('freshmart_settings');
    } catch (err) {
      console.error(err);
    }
    addToast({
      title: 'Settings Saved',
      message: 'Store configuration and payment gateway preferences updated.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Supermarket Configuration & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          Control brand identity, customer service channels, delivery charges, and active payment gateways.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="Leaf" className="w-5 h-5 text-emerald-600" />
            <span>Store Brand & Logo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Supermarket Chain Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Store Logo Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white overflow-hidden shadow-md shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" />
                ) : (
                  <Icon name="Leaf" className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors mb-1.5"
                >
                  <Icon name="Upload" className="w-4 h-4" />
                  <span>Upload Logo Image</span>
                </button>
                <p className="text-[11px] text-slate-500">Supports PNG, SVG, or JPG (max 2MB).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="Mail" className="w-5 h-5 text-emerald-600" />
            <span>Customer Contact & Headquarters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Support Email *
              </label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Customer Hotline *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Physical Headquarters Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Delivery & Thresholds */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="Truck" className="w-5 h-5 text-emerald-600" />
            <span>Delivery Rates & Shipping Policies</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Standard Express Delivery Fee (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
              <p className="text-[11px] text-slate-500 mt-1">Charged on orders below the free delivery minimum.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Free Delivery Threshold (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100"
              />
              <p className="text-[11px] text-slate-500 mt-1">Orders at or above this value receive 100% free delivery.</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Toggle */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="CreditCard" className="w-5 h-5 text-emerald-600" />
            <span>Active Storefront Payment Gateways</span>
          </h2>
          <p className="text-xs text-slate-500">Toggle which payment methods customers can select during checkout.</p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Icon name="CreditCard" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Credit & Debit Cards</p>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, American Express via Stripe</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={payCard}
                onChange={(e) => setPayCard(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-50 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Icon name="Smartphone" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">M-Pesa Mobile Money</p>
                  <p className="text-[11px] text-slate-500">Instant STK Push confirmation to mobile</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={payMpesa}
                onChange={(e) => setPayMpesa(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-50 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Icon name="DollarSign" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-slate-500">Pay delivery driver or store pickup counter in cash</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={payCod}
                onChange={(e) => setPayCod(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-50 border-slate-300"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-sm text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <Icon name="Check" className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 10. Tab: Admin Users (User & Access Control Management)
// ============================================================================
const AdminUsersTab = ({ users, setUsers, addToast }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const userList = users || [];

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.branch?.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [userList, search, roleFilter]);

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers((prev) => {
        const updated = prev.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u));
        try {
          localStorage.setItem('cylet_users_db', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      addToast({
        title: 'User Updated',
        message: `Account credentials and access for ${userData.email} updated.`,
        type: 'success',
      });
    } else {
      const roleTitle =
        userData.role === 'admin'
          ? 'Super Administrator'
          : userData.role === 'manager'
          ? 'Store Operations Manager'
          : 'Customer Shopper';
      const roleBadge =
        userData.role === 'admin'
          ? 'emerald'
          : userData.role === 'manager'
          ? 'blue'
          : 'amber';
      const newUser = {
        id: `usr-${Date.now()}`,
        avatar: userData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        title: roleTitle,
        badgeColor: roleBadge,
        status: 'Active',
        lastLogin: 'Never',
        ...userData,
      };
      setUsers((prev) => {
        const updated = [...prev, newUser];
        try {
          localStorage.setItem('cylet_users_db', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      addToast({
        title: 'User Created',
        message: `New account ${newUser.email} (${newUser.role}) has been created.`,
        type: 'success',
      });
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    const target = userList.find((u) => u.id === userId);
    if (target?.email === 'admin@cylet.com') {
      addToast({
        title: 'Action Denied',
        message: 'Primary Super Administrator account cannot be deleted.',
        type: 'error',
      });
      return;
    }
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== userId);
      try {
        localStorage.setItem('cylet_users_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addToast({
      title: 'User Removed',
      message: 'Account has been removed from user directory.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Users & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Manage administrative staff roles, store managers, and customer accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Icon name="Plus" className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Accounts</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{userList.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Registered logins</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Super Admins</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {userList.filter((u) => u.role === 'admin').length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Full privileges</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Store Managers</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {userList.filter((u) => u.role === 'manager').length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Operations only</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customers</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {userList.filter((u) => u.role === 'customer').length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Store shoppers</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Icon name="Search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or branch..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'admin', label: 'Admins' },
            { id: 'manager', label: 'Managers' },
            { id: 'customer', label: 'Customers' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                roleFilter === r.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Branch / Scope</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last Login</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                            u.role === 'admin'
                              ? 'bg-emerald-600'
                              : u.role === 'manager'
                              ? 'bg-blue-600'
                              : 'bg-amber-600'
                          }`}
                        >
                          {u.avatar || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : u.role === 'manager'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {u.branch || 'Global (Online Storefront)'}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {u.status || 'Active'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 font-medium">
                      {u.lastLogin || 'Recent'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit User"
                        >
                          <Icon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete User"
                        >
                          <Icon name="Trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

// Modal for Creating or Editing Users
const UserFormModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState(user ? (user.password || '') : 'cylet123');
  const [role, setRole] = useState(user ? user.role : 'manager');
  const [branch, setBranch] = useState(user ? (user.branch || '') : 'Cylet Supermarket - Embu Main Branch (Siakago Rd)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,
      branch: branch.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {user ? 'Edit User Account' : 'Add New User'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Peter Kariuki"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@cylet.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Password *
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secure password"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Access Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="admin">Admin (Full Access)</option>
                <option value="manager">Manager (Ops Only)</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Branch Scope
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Branch name"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

