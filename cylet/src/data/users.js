/**
 * Mock Users & Role-Based Access Control (RBAC) Definitions for Cylet Supermarket
 * 
 * Supported Roles:
 * - 'admin': Full access to all administrative modules, system configurations, and master catalogues.
 * - 'manager': Operational access to Dashboard, Products, Orders, and Stores. Restricted from Categories, Deals, Settings, Users.
 * - 'customer': Storefront shopper with access to /account (order history, saved addresses, loyalty points).
 */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
};

export const ROLE_DETAILS = {
  admin: {
    key: 'admin',
    name: 'Administrator',
    label: 'Super Admin',
    badgeColor: 'emerald',
    description: 'Full system privileges: orders, products, categories, deals, stores, settings, and user access.',
    allowedTabs: ['dashboard', 'products', 'orders', 'categories', 'deals', 'stores', 'settings', 'users'],
  },
  manager: {
    key: 'manager',
    name: 'Store Manager',
    label: 'Store Operations Manager',
    badgeColor: 'blue',
    description: 'Operational privileges: Dashboard, Products, Orders, and Store Locations.',
    allowedTabs: ['dashboard', 'products', 'orders', 'stores'],
  },
  customer: {
    key: 'customer',
    name: 'Customer',
    label: 'Customer Shopper',
    badgeColor: 'amber',
    description: 'Storefront customer access: order history, personal profile, and saved addresses.',
    allowedTabs: [],
  },
};

export const MOCK_USERS = [
  {
    id: 'usr-admin-01',
    email: 'admin@cylet.com',
    aliases: ['cyletsupermarkets@gmail.com'],
    password: 'admin#1300',
    name: 'Administrator',
    role: 'admin',
    title: 'Super Administrator',
    avatar: 'A',
    badgeColor: 'emerald',
    branch: 'Cylet Supermarket - Embu Main Branch (Siakago Rd)',
    status: 'Active',
    lastLogin: 'Today, 12:10 PM',
    permissions: [
      'orders:all',
      'products:all',
      'categories:all',
      'deals:all',
      'stores:all',
      'settings:all',
      'users:all',
    ],
  },
  {
    id: 'usr-mgr-01',
    email: 'manager@cylet.com',
    aliases: [],
    password: 'manager@1',
    name: 'Manager',
    role: 'manager',
    title: 'Store Operations Manager',
    avatar: 'M',
    badgeColor: 'blue',
    branch: 'Cylet Express - Kubukubu Road Junction',
    status: 'Active',
    lastLogin: 'Today, 09:30 AM',
    permissions: [
      'orders:view',
      'orders:update',
      'products:view',
      'products:edit',
      'products:stock_update',
      'stores:view',
    ],
  },
  {
    id: 'usr-cust-01',
    email: 'customer@cylet.com',
    aliases: [],
    password: 'customer123',
    name: 'Customer',
    role: 'customer',
    title: 'Gold Club Member',
    avatar: 'C',
    badgeColor: 'amber',
    phone: '+254 712 345 678',
    status: 'Active',
    lastLogin: 'Just now',
    loyaltyPoints: 350,
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'Home Address',
        address: 'Embu - Siakago Road (near Kubukubu Rd.)',
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
    ],
    orderHistory: [
      {
        id: 'CY-89412',
        date: 'Oct 16, 2026',
        itemsCount: 4,
        total: 1110,
        status: 'Delivered',
        branch: 'Cylet Supermarket - Embu Main Branch',
        items: [
          { name: 'Organic Mt. Kenya Hass Avocados', quantity: 2, price: 150 },
          { name: 'Fresh Farmhouse Whole Milk 1L', quantity: 2, price: 130 },
          { name: 'Fresh Farmhouse Sliced White Bread', quantity: 1, price: 80 },
          { name: 'Embu Highland Black Tea 500g', quantity: 1, price: 190 },
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
          { name: 'Fresh Hass Avocados', quantity: 2, price: 150 },
          { name: 'Farm-Fresh Free-Range Eggs (Tray of 30)', quantity: 1, price: 220 },
        ],
      },
    ],
  },
];

// Alias for backwards compatibility
export const MOCK_ADMIN_USERS = MOCK_USERS;

/**
 * Loads users from localStorage database ('cylet_users_db') with fallback to MOCK_USERS.
 * Ensures initial default accounts (admin, manager, customer) always remain accessible.
 */
export const getStoredUsers = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('cylet_users_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingEmails = new Set(
            parsed.map((u) => u.email?.toLowerCase().trim()).filter(Boolean)
          );
          const missingDefaults = MOCK_USERS.filter(
            (u) => !existingEmails.has(u.email.toLowerCase().trim())
          );
          return [...parsed, ...missingDefaults];
        }
      }
    }
  } catch (e) {
    console.error('Failed to retrieve stored users:', e);
  }
  return MOCK_USERS;
};

/**
 * Validates login credentials against mock and dynamically created users.
 * Supports checking an in-memory userList or persisted localStorage accounts.
 * Returns the authenticated user object or null.
 */
export const authenticateMockUser = (email, password, userList = null) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();

  // Combine user sources: passed userList, localStorage cylet_users_db, and MOCK_USERS
  let allUsers = [];
  if (Array.isArray(userList) && userList.length > 0) {
    allUsers = [...userList];
  } else {
    allUsers = getStoredUsers();
  }

  // Ensure default mock users are always available in the pool
  const existingEmails = new Set(
    allUsers.map((u) => u.email?.toLowerCase().trim()).filter(Boolean)
  );
  for (const defUser of MOCK_USERS) {
    if (!existingEmails.has(defUser.email.toLowerCase().trim())) {
      allUsers.push(defUser);
    }
  }

  const user = allUsers.find((u) => {
    const emailMatch =
      (u.email && u.email.toLowerCase().trim() === normalizedEmail) ||
      (Array.isArray(u.aliases) &&
        u.aliases.map((a) => a.toLowerCase().trim()).includes(normalizedEmail));
    const passwordMatch =
      u.password === normalizedPassword ||
      (typeof u.password === 'string' && u.password.trim() === normalizedPassword);
    return emailMatch && passwordMatch;
  });

  if (!user) return null;

  // Omit password from session object, but ensure valid defaults for app routing
  const { password: _, aliases: __, ...safeUser } = user;
  return {
    role: 'customer',
    name: safeUser.name || 'Cylet User',
    avatar: safeUser.avatar || (safeUser.name ? safeUser.name.slice(0, 2).toUpperCase() : 'CU'),
    branch: safeUser.branch || 'Cylet Supermarket - Embu Main Branch (Siakago Rd)',
    status: 'Active',
    ...safeUser,
  };
};

/**
 * Checks whether a given role is allowed to access a specific admin tab
 */
export const isTabAllowedForRole = (role, tabKey) => {
  const details = ROLE_DETAILS[role];
  if (!details) return false;
  return details.allowedTabs.includes(tabKey);
};
