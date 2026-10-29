import React, { useState, useEffect } from 'react';
import { updateSEO } from './components/SEO.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Toast } from './components/Toast.js';
import { BottomNav } from './components/BottomNav.js';
import { CartDrawer } from './components/CartDrawer.js';
import { AccountModal } from './components/AccountModal.js';

import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { StoreLocatorPage } from './pages/StoreLocatorPage.js';
import { AboutPage, CareersPage, ContactPage } from './pages/SimplePages.js';
import { AdminPage } from './pages/AdminPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { AccountPage } from './pages/AccountPage.js';

import { PRODUCTS, CATEGORIES } from './data/products.js';
import { STORES } from './data/stores.js';
import { INITIAL_ORDERS } from './data/orders.js';
import { MOCK_USERS } from './data/users.js';
import { formatKES } from './utils/currency.js';

const INITIAL_DEALS = [
  {
    id: 'deal-1',
    productId: 'prod-1',
    productName: 'Organic Honeycrisp Apples',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    originalPrice: 390,
    salePrice: 320,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: '18% OFF',
    status: 'Active',
  },
  {
    id: 'deal-2',
    productId: 'meat-1',
    productName: 'Grass-Fed Angus Ribeye Steak',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
    originalPrice: 1150,
    salePrice: 950,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: '17% OFF',
    status: 'Active',
  },
  {
    id: 'deal-3',
    productId: 'meat-2',
    productName: 'Fresh Wild Atlantic Salmon Fillet',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    originalPrice: 1450,
    salePrice: 1250,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: 'LIMITED DEAL',
    status: 'Active',
  },
  {
    id: 'deal-4',
    productId: 'bakery-1',
    productName: 'Fresh Farmhouse Sliced White Bread',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    originalPrice: 95,
    salePrice: 80,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: 'FRESH BAKE',
    status: 'Active',
  },
  {
    id: 'deal-5',
    productId: 'bev-1',
    productName: 'Cold-Pressed Vitality Green Juice',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    originalPrice: 300,
    salePrice: 250,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: 'HEALTH SPECIAL',
    status: 'Active',
  },
  {
    id: 'deal-6',
    productId: 'snack-4',
    productName: 'Roasted & Salted Macadamia Nuts',
    image: 'https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=800&q=80',
    originalPrice: 330,
    salePrice: 280,
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    badge: 'SWEET TOOTH',
    status: 'Active',
  },
];

const DEFAULT_SETTINGS = {
  storeName: 'Cylet Supermarket',
  tagline: 'Farm-Fresh Groceries & Everyday Essentials',
  logoUrl: 'https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500',
  supportEmail: 'cyletsupermarkets@gmail.com',
  phone: '+254 20 2003310',
  address: 'Embu - Siakago Road near Kubukubu Rd. in Embu, Kenya',
  deliveryFee: 250.0,
  freeDeliveryThreshold: 3000.0,
  curbsideFee: 0.0,
  paymentMethods: {
    card: true,
    mpesa: true,
    cod: true,
  },
};

export const App = () => {
  // Current logged in user (customer, manager, or admin)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_user') || localStorage.getItem('cylet_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginError, setLoginError] = useState('');

  // Navigation & Page routing (supports /admin, /login, /account, and storefront routes)
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname === '/admin' || pathname.startsWith('/admin') || hash === '#admin') {
        try {
          const saved = localStorage.getItem('cylet_user') || localStorage.getItem('cylet_admin_auth');
          const user = saved ? JSON.parse(saved) : null;
          if (user && (user.role === 'admin' || user.role === 'manager')) {
            return 'admin';
          }
        } catch {}
        return 'login';
      }
      if (pathname === '/login' || hash === '#login') {
        return 'login';
      }
      if (pathname === '/account' || hash === '#account') {
        try {
          const saved = localStorage.getItem('cylet_user');
          if (saved) return 'account';
        } catch {}
        return 'login';
      }
    }
    return 'home';
  });

  // Protected /admin check on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname === '/admin' || pathname.startsWith('/admin') || hash === '#admin') {
        if (!currentUser || currentUser.role === 'customer') {
          setLoginError('Failed to Login: You do not have permission to access the administrative portal.');
          setActivePage('login');
          window.history.replaceState({ page: 'login' }, '', '/login');
        }
      }
    }
  }, [currentUser]);

  // Users database with persistence
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_users_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cylet_users_db', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer & modal states
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && (parsed.length === 0 || parsed[0]?.product?.price >= 50)) {
          return parsed;
        }
      }
    } catch {
      return [];
    }
    return [];
  });

  // Current preferred store branch
  const [currentStore, setCurrentStore] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_store') || localStorage.getItem('freshmart_store');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.name?.includes('FreshMart')) return parsed;
      }
    } catch {}
    return STORES[0]; // Default to Cylet Embu Main Branch
  });

  // Fulfillment type: 'delivery' | 'pickup'
  const [fulfillmentType, setFulfillmentType] = useState('delivery');

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Dark Mode State with LocalStorage & OS Preference sync
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_theme') || localStorage.getItem('freshmart_theme');
      if (saved) return saved === 'dark';
      return (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('cylet_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('cylet_theme', 'light');
      }
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_favs') || localStorage.getItem('freshmart_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Central dynamic datasets with localStorage persistence for real-time CRUD
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price >= 50) {
          return parsed;
        }
      }
    } catch {}
    return PRODUCTS.map((p, idx) => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : idx % 7 === 0 ? 8 : idx % 5 === 0 ? 12 : 24 + (idx % 15),
      status: p.status || 'active',
    }));
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_categories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CATEGORIES;
  });

  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0]?.name?.includes('FreshMart')) {
          return parsed;
        }
      }
    } catch {}
    return STORES;
  });

  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_deals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].salePrice >= 50) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_DEALS;
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].total >= 100) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_ORDERS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cylet_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.storeName?.includes('FreshMart') && parsed.deliveryFee >= 50) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Persist store datasets
  useEffect(() => {
    try {
      localStorage.setItem('cylet_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('cylet_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('cylet_stores', JSON.stringify(stores));
    } catch (e) {
      console.error(e);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem('cylet_deals', JSON.stringify(deals));
    } catch (e) {
      console.error(e);
    }
  }, [deals]);

  useEffect(() => {
    try {
      localStorage.setItem('cylet_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cylet_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Synchronize browser URL bar between storefront, /login, /account, and /admin
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    if (activePage === 'admin') {
      if (path !== '/admin') window.history.pushState({ page: 'admin' }, '', '/admin');
    } else if (activePage === 'login') {
      if (path !== '/login') window.history.pushState({ page: 'login' }, '', '/login');
    } else if (activePage === 'account') {
      if (path !== '/account') window.history.pushState({ page: 'account' }, '', '/account');
    } else {
      if (['/admin', '/login', '/account'].includes(path)) {
        window.history.pushState({ page: activePage }, '', '/');
      }
    }
  }, [activePage]);

  // Handle popstate & hashchange events (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname === '/admin' || pathname.startsWith('/admin') || hash === '#admin') {
        if (!currentUser || currentUser.role === 'customer') {
          setLoginError('Failed to Login: You do not have permission to access the administrative portal.');
          setActivePage('login');
          window.history.replaceState({ page: 'login' }, '', '/login');
        } else {
          setActivePage('admin');
        }
      } else if (pathname === '/login' || hash === '#login') {
        setActivePage('login');
      } else if (pathname === '/account' || hash === '#account') {
        if (!currentUser) {
          setActivePage('login');
          window.history.replaceState({ page: 'login' }, '', '/login');
        } else {
          setActivePage('account');
        }
      } else {
        setActivePage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [currentUser]);

  // Protected navigation handler
  const handleNavigate = (targetPage) => {
    if (targetPage === 'admin') {
      if (!currentUser || currentUser.role === 'customer') {
        setLoginError('Failed to Login: You do not have permission to access the administrative portal.');
        setActivePage('login');
        return;
      }
    }
    if (targetPage === 'account') {
      if (!currentUser) {
        setActivePage('login');
        return;
      }
    }
    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLoginError('');
    try {
      localStorage.setItem('cylet_user', JSON.stringify(user));
      if (user.role === 'admin' || user.role === 'manager') {
        localStorage.setItem('cylet_admin_auth', JSON.stringify(user));
      }
    } catch (e) {
      console.error(e);
    }

    if (user.role === 'customer') {
      setActivePage('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (user.role === 'manager' || user.role === 'admin') {
      setActivePage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginError('');
    try {
      localStorage.removeItem('cylet_user');
      localStorage.removeItem('cylet_admin_auth');
      localStorage.removeItem('freshmart_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setActivePage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({
      title: 'Signed Out',
      message: 'You have been safely signed out.',
      type: 'info',
    });
  };

  const handleUnauthorized = (msg = 'Failed to Login') => {
    setLoginError(msg);
    setActivePage('login');
    window.history.replaceState({ page: 'login' }, '', '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notification Toasts
  const [toasts, setToasts] = useState([]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cylet_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Save current store
  useEffect(() => {
    try {
      localStorage.setItem('cylet_store', JSON.stringify(currentStore));
    } catch (e) {
      console.error('Failed to save store:', e);
    }
  }, [currentStore]);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('cylet_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Synchronize SEO Meta Tags & JSON-LD Structured Data on navigation & interaction
  useEffect(() => {
    switch (activePage) {
      case 'admin':
        updateSEO({
          title: 'Admin Portal & Operations | Cylet Supermarket',
          description: 'Protected internal administration portal for inventory, orders, and branch management.',
          ogType: 'website',
          pageType: 'admin',
        });
        break;

      case 'home':
        updateSEO({
          title: 'Farm-Fresh Groceries & Everyday Essentials | Embu, Kenya',
          description:
            'Order organic farm-fresh produce, artisanal bakery, prime meats & daily essentials from Cylet Supermarket in Embu, Kenya (Siakago Rd near Kubukubu Rd).',
          ogType: 'website',
          pageType: 'home',
        });
        break;

      case 'shop':
        const categoryLabel =
          selectedCategory === 'all'
            ? 'All Groceries'
            : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        updateSEO({
          title: `Shop ${categoryLabel} - Cylet Online Grocery`,
          description: `Browse our freshest selection of ${categoryLabel.toLowerCase()}. 100% farm-fresh guarantee with weekly deals and fast 2-hour delivery.`,
          ogType: 'website',
          pageType: 'shop',
        });
        break;

      case 'detail':
        if (selectedProduct) {
          updateSEO({
            title: `${selectedProduct.name} (${formatKES(selectedProduct.price)})`,
            description: selectedProduct.description,
            ogImage: selectedProduct.image,
            ogType: 'product',
            product: selectedProduct,
            pageType: 'product',
          });
        }
        break;

      case 'cart':
        updateSEO({
          title: `Shopping Basket (${cartCount} items)`,
          description:
            'Review your selected Cylet groceries and proceed to seamless checkout with delivery or 30-minute curbside pickup.',
          pageType: 'generic',
        });
        break;

      case 'checkout':
        updateSEO({
          title: 'Secure Checkout - Fast Delivery & Pickup',
          description:
            'Finalize your Cylet grocery order with flexible payment methods including Card, M-Pesa, and Cash on Delivery.',
          pageType: 'generic',
        });
        break;

      case 'locator':
        updateSEO({
          title: 'Store Locator - Cylet Supermarket Branches in Embu',
          description:
            'Find a Cylet supermarket branch near you in Embu. View live opening hours, exact addresses, GPS coordinates, phone numbers, and get instant Google Maps directions.',
          stores: STORES,
          pageType: 'locator',
        });
        break;

      case 'about':
        updateSEO({
          title: 'About Cylet - Our Fresh Food Mission',
          description:
            'Learn about Cylet’s commitment to quality groceries, local agriculture, and top-tier customer satisfaction in Embu, Kenya.',
          pageType: 'generic',
        });
        break;

      case 'careers':
        updateSEO({
          title: 'Careers at Cylet - Join Our Growing Team',
          description:
            'Explore exciting retail, supply chain, store management, and customer experience career opportunities at Cylet.',
          pageType: 'generic',
        });
        break;

      case 'login':
        updateSEO({
          title: 'Sign In - Cylet Supermarket',
          description:
            'Sign in to your Cylet Supermarket account to access order history, saved addresses, and member benefits.',
          pageType: 'generic',
        });
        break;

      case 'account':
        updateSEO({
          title: 'My Account & Orders - Cylet Supermarket',
          description:
            'Manage your Cylet customer profile, view past grocery orders and receipts, and update delivery addresses.',
          pageType: 'generic',
        });
        break;

      case 'contact':
        updateSEO({
          title: 'Contact Cylet Customer Care & Support',
          description:
            'Get in touch with Cylet customer support for inquiries, corporate bulk orders, delivery tracking, or store feedback.',
          pageType: 'generic',
        });
        break;

      default:
        updateSEO({
          title: 'Cylet Supermarket - Embu, Kenya',
          description:
            'Cylet is your trusted community grocer located on Siakago Road near Kubukubu Rd. in Embu, Kenya.',
          pageType: 'generic',
        });
    }
  }, [activePage, selectedProduct, selectedCategory, cartCount]);

  // Toast manager
  const addToast = ({ title, message, type = 'success' }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast({
      title: 'Added to Basket',
      message: `${quantity}x ${product.name} added.`,
      type: 'success',
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      addToast({
        title: 'Removed from Basket',
        message: `${item.product.name} removed.`,
        type: 'info',
      });
    }
  };

  const handleClearCart = () => {
    setCart([]);
    addToast({
      title: 'Basket Cleared',
      message: 'All items have been removed from your basket.',
      type: 'info',
    });
  };

  // Favorite toggle
  const handleToggleFavorite = (productId) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      addToast({
        title: exists ? 'Removed from Favorites' : 'Saved to Favorites',
        message: exists ? 'Item removed from your favorites list.' : 'Item saved for your next grocery run.',
        type: exists ? 'info' : 'success',
      });
      return updated;
    });
  };

  // Open Product Detail
  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate cart badge & totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Render Dedicated Admin Panel when route is /admin or activePage === 'admin'
  if (activePage === 'admin') {
    // Strictly protect /admin: if unauthenticated or customer, redirect to login with "Failed to Login"
    if (!currentUser || currentUser.role === 'customer') {
      return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-0 transition-colors duration-200">
          <Toast toasts={toasts} removeToast={removeToast} />
          <Header
            activePage="login"
            setActivePage={handleNavigate}
            cartCount={cartCount}
            cartTotal={cartTotal}
            currentStore={currentStore}
            stores={stores}
            onSelectStore={setCurrentStore}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allProducts={products}
            onOpenProductDetail={handleOpenProductDetail}
            onOpenCartDrawer={() => setCartDrawerOpen(true)}
            onOpenAccountModal={() => setAccountModalOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            currentUser={currentUser}
          />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={handleNavigate}
              initialError={loginError || 'Failed to Login: You do not have permission to access the administrative portal.'}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              addToast={addToast}
              users={users}
              onRegisterUser={(newUser) => setUsers((prev) => [...prev, newUser])}
            />
          </main>
          <Footer setActivePage={handleNavigate} addToast={addToast} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
        {/* Skip to Main Content Link for Keyboard Accessibility (WCAG AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-emerald-300 font-bold text-sm outline-none"
        >
          Skip to main content
        </a>

        {/* Toast Notification Container */}
        <Toast toasts={toasts} removeToast={removeToast} />

        <AdminPage
          products={products}
          setProducts={setProducts}
          categories={categories}
          setCategories={setCategories}
          stores={stores}
          setStores={setStores}
          deals={deals}
          setDeals={setDeals}
          orders={orders}
          setOrders={setOrders}
          settings={settings}
          setSettings={setSettings}
          addToast={addToast}
          onExitAdmin={() => handleNavigate('home')}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onUnauthorized={handleUnauthorized}
          onLogout={handleLogout}
          users={users}
          setUsers={setUsers}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-0 transition-colors duration-200">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-emerald-300 font-bold text-sm outline-none"
      >
        Skip to main content
      </a>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Slide-out Cart Drawer (Mobile & Quick Access) */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        fulfillmentType={fulfillmentType}
        setFulfillmentType={setFulfillmentType}
        currentStore={currentStore}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        onProceedToCheckout={() => {
          setActivePage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewFullCart={() => {
          setActivePage('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        addToast={addToast}
      />

      {/* Account Profile & Rewards Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        currentStore={currentStore}
        stores={stores}
        onSelectStore={setCurrentStore}
        setActivePage={handleNavigate}
        addToast={addToast}
        currentUser={currentUser}
      />

      {/* Global Sticky Supermarket Header */}
      <Header
        activePage={activePage}
        setActivePage={handleNavigate}
        cartCount={cartCount}
        cartTotal={cartTotal}
        currentStore={currentStore}
        stores={stores}
        onSelectStore={setCurrentStore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allProducts={products}
        onOpenProductDetail={handleOpenProductDetail}
        onOpenCartDrawer={() => setCartDrawerOpen(true)}
        onOpenAccountModal={() => setAccountModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
      />

      {/* Main Dynamic Page Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {activePage === 'home' && (
          <HomePage
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenDetail={handleOpenProductDetail}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActivePage('shop');
            }}
            setActivePage={handleNavigate}
            currentStore={currentStore}
            stores={stores}
            onSelectStore={setCurrentStore}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenDetail={handleOpenProductDetail}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {activePage === 'detail' && (
          <ProductDetailPage
            product={selectedProduct || products[0]}
            allProducts={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onBackToShop={() => setActivePage('shop')}
            onOpenDetail={handleOpenProductDetail}
            currentStore={currentStore}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            addToast={addToast}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            fulfillmentType={fulfillmentType}
            setFulfillmentType={setFulfillmentType}
            currentStore={currentStore}
            stores={stores}
            onSelectStore={setCurrentStore}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            onProceedToCheckout={() => {
              setActivePage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            addToast={addToast}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            fulfillmentType={fulfillmentType}
            currentStore={currentStore}
            appliedCoupon={appliedCoupon}
            onClearCart={() => setCart([])}
            onContinueShopping={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActivePage={handleNavigate}
            addToast={addToast}
            onOrderCreated={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
          />
        )}

        {activePage === 'locator' && (
          <StoreLocatorPage
            stores={stores}
            currentStore={currentStore}
            onSelectStore={setCurrentStore}
            setActivePage={handleNavigate}
            addToast={addToast}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            initialError={loginError}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            addToast={addToast}
            users={users}
            onRegisterUser={(newUser) => setUsers((prev) => [...prev, newUser])}
          />
        )}

        {activePage === 'account' && (
          <AccountPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            addToast={addToast}
          />
        )}

        {activePage === 'about' && <AboutPage setActivePage={handleNavigate} />}

        {activePage === 'careers' && <CareersPage addToast={addToast} />}

        {activePage === 'contact' && <ContactPage addToast={addToast} />}
      </main>

      {/* Global Supermarket Footer */}
      <Footer setActivePage={handleNavigate} addToast={addToast} />

      {/* Mobile Bottom Navigation Bar (Home, Shop, Cart, Stores, Account) */}
      <BottomNav
        activePage={activePage}
        setActivePage={handleNavigate}
        cartCount={cartCount}
        onOpenCartDrawer={() => setCartDrawerOpen(true)}
        onOpenAccountModal={() => setAccountModalOpen(true)}
      />
    </div>
  );
};
