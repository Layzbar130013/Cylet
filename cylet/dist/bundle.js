// Cylet Supermarket - Consolidated Application Bundle
// Generated automatically for zero-friction browser execution

const { useState, useEffect, useMemo, useRef } = React;

// --- File: src/utils/currency.js ---
/**
 * Kenyan Shilling (KES) Currency Formatter
 *
 * Requirements:
 * - "KSh " prefix
 * - No decimal places for whole amounts (e.g., KSh 499, KSh 1,250)
 * - 2 decimals only when there are cents (e.g., KSh 3,499.50)
 * - Comma as thousands separator (e.g., KSh 12,500)
 */
const formatKES = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const hasCents = Math.abs(num % 1) > 0.0001;
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `KSh ${formatted}`;
};

const formatPrice = formatKES;


// --- File: src/data/users.js ---
/**
 * Mock Users & Role-Based Access Control (RBAC) Definitions for Cylet Supermarket
 * 
 * Supported Roles:
 * - 'admin': Full access to all administrative modules, system configurations, and master catalogues.
 * - 'manager': Operational access to Dashboard, Products, Orders, and Stores. Restricted from Categories, Deals, Settings, Users.
 * - 'customer': Storefront shopper with access to /account (order history, saved addresses, loyalty points).
 */

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
};

const ROLE_DETAILS = {
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

const MOCK_USERS = [
  {
    id: 'usr-admin-01',
    email: 'admin@cylet.com',
    aliases: ['cyletsupermarkets@gmail.com'],
    password: 'admin#1300',
    name: 'Sarah Jenkins',
    role: 'admin',
    title: 'Super Administrator',
    avatar: 'SJ',
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
    name: 'Michael Omondi',
    role: 'manager',
    title: 'Store Operations Manager',
    avatar: 'MO',
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
    name: 'Jane Doe',
    role: 'customer',
    title: 'Gold Club Member',
    avatar: 'JD',
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
const MOCK_ADMIN_USERS = MOCK_USERS;

/**
 * Loads users from localStorage database ('cylet_users_db') with fallback to MOCK_USERS.
 * Ensures initial default accounts (admin, manager, customer) always remain accessible.
 */
const getStoredUsers = () => {
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
const authenticateMockUser = (email, password, userList = null) => {
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
const isTabAllowedForRole = (role, tabKey) => {
  const details = ROLE_DETAILS[role];
  if (!details) return false;
  return details.allowedTabs.includes(tabKey);
};


// --- File: src/data/products.js ---
// Mock product data for Cylet Supermarket
// 38 curated grocery items across 7 categories

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles', count: 38 },
  { id: 'produce', name: 'Produce', icon: 'Apple', count: 7, color: 'emerald' },
  { id: 'meat', name: 'Meat & Seafood', icon: 'Beef', count: 6, color: 'rose' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'Egg', count: 6, color: 'amber' },
  { id: 'bakery', name: 'Bakery', icon: 'Croissant', count: 5, color: 'orange' },
  { id: 'beverages', name: 'Beverages', icon: 'Coffee', count: 5, color: 'blue' },
  { id: 'household', name: 'Household', icon: 'Home', count: 4, color: 'teal' },
  { id: 'snacks', name: 'Snacks & Pantry', icon: 'Cookie', count: 5, color: 'purple' },
];

const BRANDS = [
  'Cylet Organic',
  'Valley Pastures',
  'Ocean Catch Co.',
  'Artisan Hearth',
  'Green Leaf Farms',
  'Pure Orchard',
  'SunHarvest',
  'EcoLiving Clean',
  'Mountain Springs',
  'Golden Fields'
];

const PRODUCTS = [
  // PRODUCE (7 items)
  {
    id: 'prod-1',
    name: 'Organic Honeycrisp Apples',
    category: 'produce',
    brand: 'Cylet Organic',
    price: 320,
    originalPrice: 390,
    unit: 'per kg (~6 apples)',
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '18% OFF',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Crisp, sweet, and bursting with fresh orchard juice. Hand-picked from certified organic farms without synthetic pesticides.',
    nutrition: { calories: '95 kcal', carbs: '25g', fiber: '4.4g', sugar: '19g', origin: 'Embu, Kenya' },
    storageTips: 'Store in the crisper drawer of your refrigerator at cool temperatures for maximum crunch.',
    tags: ['Organic', 'Gluten-Free', 'Vegan', 'Seasonal']
  },
  {
    id: 'prod-2',
    name: 'Fresh Hass Avocados',
    category: 'produce',
    brand: 'Green Leaf Farms',
    price: 150,
    originalPrice: 180,
    unit: 'net of 4',
    rating: 4.7,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Popular',
    isWeeklyDeal: false,
    description: 'Creamy, rich Hass avocados from Mt. Kenya highlands ready to ripen. Perfect for homemade guacamole, toast, and salads.',
    nutrition: { calories: '240 kcal', healthyFats: '22g', fiber: '10g', potassium: '708mg', origin: 'Mt. Kenya Highlands' },
    storageTips: 'Ripen at room temperature on the counter. Once ripe, store in the fridge for up to 3 days.',
    tags: ['Organic', 'Keto', 'Vegan']
  },
  {
    id: 'prod-3',
    name: 'Baby Spinach Organic (Fresh Bunch)',
    category: 'produce',
    brand: 'Cylet Organic',
    price: 90,
    originalPrice: 110,
    unit: 'fresh bunch',
    rating: 4.9,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Triple Washed',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Tender baby spinach leaves, pre-washed three times and packed fresh for immediate use in salads, smoothies, or sautéing.',
    nutrition: { calories: '35 kcal', iron: '15% DV', vitaminA: '140% DV', fiber: '3g', origin: 'Central Kenya' },
    storageTips: 'Keep container refrigerated. Place a paper towel inside to absorb excess moisture.',
    tags: ['Organic', 'Superfood', 'Vegan']
  },
  {
    id: 'prod-4',
    name: 'Vine-Ripened Campari Tomatoes',
    category: 'produce',
    brand: 'SunHarvest',
    price: 140,
    originalPrice: 170,
    unit: '1 kg crate',
    rating: 4.6,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Sweet & Juicy',
    isWeeklyDeal: false,
    description: 'Renowned for their sweet flavor and low acidity. Grown on the vine to peak sweetness and harvested by hand.',
    nutrition: { calories: '32 kcal', lycopene: 'High', vitaminC: '28% DV', origin: 'Local Greenhouse' },
    storageTips: 'Never refrigerate unripe tomatoes. Keep stem-down at room temperature.',
    tags: ['Non-GMO', 'Vegan', 'Local']
  },
  {
    id: 'prod-5',
    name: 'Organic Fairtrade Bananas',
    category: 'produce',
    brand: 'Cylet Organic',
    price: 120,
    originalPrice: 150,
    unit: 'sweet bunch (~1.5 kg)',
    rating: 4.9,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Bestseller',
    isWeeklyDeal: false,
    description: 'Sweet, creamy organic bananas sourced under certified fair trade partnerships with local smallholder farms in Meru & Embu.',
    nutrition: { calories: '105 kcal', potassium: '422mg', vitaminB6: '20% DV', origin: 'Meru, Kenya' },
    storageTips: 'Hang on a banana tree stand away from direct sunlight at room temperature.',
    tags: ['Organic', 'Fair Trade', 'Vegan']
  },
  {
    id: 'prod-6',
    name: 'Crisp English Cucumbers',
    category: 'produce',
    brand: 'Green Leaf Farms',
    price: 80,
    originalPrice: 100,
    unit: 'each (seedless)',
    rating: 4.5,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Seedless',
    isWeeklyDeal: false,
    description: 'Thin-skinned, seedless greenhouse cucumber with an invigorating crisp texture and delicate garden aroma.',
    nutrition: { calories: '16 kcal', water: '96%', vitaminK: '19% DV', origin: 'Embu Greenhouses' },
    storageTips: 'Keep wrapped in protective plastic in the vegetable crisper.',
    tags: ['Hydrating', 'Vegan']
  },
  {
    id: 'prod-7',
    name: 'Organic Rainbow Bell Peppers',
    category: 'produce',
    brand: 'SunHarvest',
    price: 160,
    originalPrice: 200,
    unit: 'pack of 3 (Red, Yellow, Green)',
    rating: 4.7,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '20% OFF',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Sweet, bell-shaped peppers harvested at peak color maturity. Packed with vitamin C and antioxidant phytonutrients.',
    nutrition: { calories: '40 kcal', vitaminC: '250% DV', dietaryFiber: '2.5g', origin: 'Central Kenya' },
    storageTips: 'Store unwashed in produce drawer for up to 7 days.',
    tags: ['Organic', 'Gluten-Free', 'Vegan']
  },

  // MEAT & SEAFOOD (6 items)
  {
    id: 'meat-1',
    name: 'Grass-Fed Angus Ribeye Steak',
    category: 'meat',
    brand: 'Valley Pastures',
    price: 950,
    originalPrice: 1150,
    unit: '1 kg prime cut',
    rating: 4.9,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '17% OFF',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: '100% pasture-raised highland beef with rich natural marbling. Tender, deeply flavorful, and antibiotic-free.',
    nutrition: { protein: '52g', calories: '620 kcal', iron: '25% DV', omega3: 'High' },
    storageTips: 'Keep refrigerated below 38°F or freeze immediately if not consuming within 3 days.',
    tags: ['Grass-Fed', 'Keto', 'Gluten-Free']
  },
  {
    id: 'meat-2',
    name: 'Fresh Wild Atlantic Salmon Fillet',
    category: 'meat',
    brand: 'Ocean Catch Co.',
    price: 1250,
    originalPrice: 1450,
    unit: '1 kg fresh cut',
    rating: 4.8,
    reviewCount: 188,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Fresh Catch',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Sustainably wild-caught salmon with luscious pink flesh and heart-healthy Omega-3 fatty acids. Skin-on for pan-searing.',
    nutrition: { protein: '34g', calories: '280 kcal', omega3: '2100mg', vitaminD: '80% DV' },
    storageTips: 'Store on ice in the refrigerator; prepare within 2 days of delivery.',
    tags: ['Sustainably Sourced', 'Keto', 'Omega-3']
  },
  {
    id: 'meat-3',
    name: 'Organic Free-Range Chicken Breast',
    category: 'meat',
    brand: 'Valley Pastures',
    price: 650,
    originalPrice: 780,
    unit: '1 kg pack',
    rating: 4.8,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'No Hormones',
    isWeeklyDeal: false,
    description: 'Boneless, skinless breasts from pasture-raised organic chickens raised on vegetarian non-GMO grain feeds without antibiotics.',
    nutrition: { protein: '31g per serving', calories: '165 kcal', fat: '3.6g' },
    storageTips: 'Refrigerate immediately or freeze in airtight vacuum seal bags.',
    tags: ['Organic', 'High Protein', 'Halal']
  },
  {
    id: 'meat-4',
    name: 'Lean Ground Beef (85/15)',
    category: 'meat',
    brand: 'Valley Pastures',
    price: 580,
    originalPrice: 680,
    unit: '1 kg pack',
    rating: 4.6,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Family Favorite',
    isWeeklyDeal: false,
    description: 'Freshly ground daily from selected cuts of premium beef. Perfect ratio for juicy burgers, meatballs, or rich stews.',
    nutrition: { protein: '22g', calories: '250 kcal', iron: '15% DV' },
    storageTips: 'Cook thoroughly to an internal temperature of 160°F.',
    tags: ['Keto', 'No Additives']
  },
  {
    id: 'meat-5',
    name: 'Jumbo Wild Gulf Shrimp (Peeled & Deveined)',
    category: 'meat',
    brand: 'Ocean Catch Co.',
    price: 1400,
    originalPrice: 1650,
    unit: '1 kg pack',
    rating: 4.7,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '15% OFF',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Sweet, succulent jumbo shrimp peeled, deveined with tail on. Ready for garlic butter skewers, pasta, or curries.',
    nutrition: { protein: '24g', calories: '110 kcal', fat: '1g' },
    storageTips: 'Keep frozen until ready to thaw in cold water.',
    tags: ['Wild Caught', 'High Protein']
  },
  {
    id: 'meat-6',
    name: 'Artisan Smoked Bratwurst Sausages',
    category: 'meat',
    brand: 'Valley Pastures',
    price: 450,
    originalPrice: 520,
    unit: 'pack of 4 links',
    rating: 4.5,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Smoked Daily',
    isWeeklyDeal: false,
    description: 'Traditional hardwood-smoked sausages prepared with cracked black pepper, marjoram, and a touch of nutmeg.',
    nutrition: { protein: '16g', calories: '290 kcal', sodium: '590mg' },
    storageTips: 'Refrigerate and cook on medium grill heat.',
    tags: ['Gluten-Free', 'Keto']
  },

  // DAIRY & EGGS (6 items)
  {
    id: 'dairy-1',
    name: 'Organic Whole Pasture Milk',
    category: 'dairy',
    brand: 'Cylet Organic',
    price: 130,
    originalPrice: 150,
    unit: '1 Litre carton',
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Pasture Raised',
    isWeeklyDeal: false,
    description: 'Creamy, farm-fresh whole milk from pasture-grazed family dairy herds. Non-GMO, rBST-free, and rich in natural calcium.',
    nutrition: { calcium: '30% DV', protein: '8g', vitaminD: '25% DV', fat: '8g' },
    storageTips: 'Store inside refrigerator shelves, not the door, below 40°F.',
    tags: ['Organic', 'Non-GMO', 'Fresh']
  },
  {
    id: 'dairy-2',
    name: 'Farm-Fresh Free-Range Eggs (Tray of 30)',
    category: 'dairy',
    brand: 'Golden Fields',
    price: 220,
    originalPrice: 260,
    unit: 'Tray of 30 eggs',
    rating: 4.9,
    reviewCount: 410,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Best Value',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Farm-fresh Grade A brown eggs from free-range hens. Deep golden yolks bursting with rich flavor and vital nutrients.',
    nutrition: { protein: '6g per egg', choline: '147mg', vitaminE: 'High' },
    storageTips: 'Store in original protective carton in the refrigerator.',
    tags: ['Pasture-Raised', 'High Protein', 'Gluten-Free']
  },
  {
    id: 'dairy-3',
    name: 'Greek Whole Milk Strained Yogurt',
    category: 'dairy',
    brand: 'Cylet Organic',
    price: 280,
    originalPrice: 330,
    unit: '500g tub',
    rating: 4.8,
    reviewCount: 175,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '18g Protein',
    isWeeklyDeal: false,
    description: 'Traditionally strained Greek whole milk yogurt with 5 live and active probiotic cultures. Incredibly thick and velvety.',
    nutrition: { protein: '18g', liveCultures: '5 billion CFU', carbs: '6g', sugars: '4g' },
    storageTips: 'Keep sealed and chilled. Use within 7 days of breaking inner seal.',
    tags: ['Organic', 'Probiotic', 'Vegetarian']
  },
  {
    id: 'dairy-4',
    name: 'Aged Sharp White Cheddar Block',
    category: 'dairy',
    brand: 'Golden Fields',
    price: 420,
    originalPrice: 490,
    unit: '250g block',
    rating: 4.7,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Aged 12 Mo.',
    isWeeklyDeal: false,
    description: 'Aged naturally for over 12 months for a complex nutty sharpness and signature calcium crunch crystals.',
    nutrition: { calcium: '20% DV', protein: '7g', calories: '110 kcal' },
    storageTips: 'Wrap tightly in cheese paper or wax wrap after slicing.',
    tags: ['Artisanal', 'Keto', 'Gluten-Free']
  },
  {
    id: 'dairy-5',
    name: 'European Style Salted Butter (82% Fat)',
    category: 'dairy',
    brand: 'Golden Fields',
    price: 340,
    originalPrice: 390,
    unit: '250g pack',
    rating: 4.9,
    reviewCount: 130,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Chef Choice',
    isWeeklyDeal: false,
    description: 'Slow churned with cultured fresh cream to 82% butterfat and seasoned with sea salt flakes for flaky pastries and rich spreads.',
    nutrition: { calories: '100 kcal per tbsp', fat: '11g', transFat: '0g' },
    storageTips: 'Keep refrigerated or freeze up to 6 months.',
    tags: ['Cultured', 'Grass-Fed']
  },
  {
    id: 'dairy-6',
    name: 'Organic Unsweetened Almond Milk',
    category: 'dairy',
    brand: 'Pure Orchard',
    price: 380,
    originalPrice: 440,
    unit: '1 Litre carton',
    rating: 4.6,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1568651318042-430c6a81bb12?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Plant Based',
    isWeeklyDeal: false,
    description: 'Smooth, dairy-free almond beverage crafted with pure almonds and a touch of sea salt. Zero added sugar.',
    nutrition: { calories: '30 kcal', calcium: '35% DV', sugars: '0g' },
    storageTips: 'Refrigerate after opening and shake well before pouring.',
    tags: ['Vegan', 'Dairy-Free', 'Gluten-Free']
  },

  // BAKERY (5 items)
  {
    id: 'bakery-1',
    name: 'Fresh Farmhouse Sliced White Bread',
    category: 'bakery',
    brand: 'Artisan Hearth',
    price: 80,
    originalPrice: 95,
    unit: '400g sliced loaf',
    rating: 4.9,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Fresh Daily',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Freshly baked daily with wholesome wheat flour. Super soft, fluffy slices ideal for morning breakfast toast and sandwiches.',
    nutrition: { calories: '140 kcal', carbs: '28g', protein: '5g', sodium: '240mg' },
    storageTips: 'Store in a cool dry bread bin or sealed bag.',
    tags: ['Daily Bake', 'Family Favorite', 'No Preservatives']
  },
  {
    id: 'bakery-2',
    name: 'All-Butter French Croissants',
    category: 'bakery',
    brand: 'Artisan Hearth',
    price: 180,
    originalPrice: 220,
    unit: 'pack of 4',
    rating: 4.8,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Freshly Baked',
    isWeeklyDeal: false,
    description: 'Laminated with pure cultured butter for 27 airy, golden-brown flaky layers that melt in your mouth.',
    nutrition: { calories: '260 kcal', fat: '14g', carbs: '29g' },
    storageTips: 'Warm in a light oven for 3 minutes for straight-from-the-bakery crispiness.',
    tags: ['Bakery Fresh', 'Vegetarian']
  },
  {
    id: 'bakery-3',
    name: 'Artisan Multi-Seed Bagels',
    category: 'bakery',
    brand: 'Artisan Hearth',
    price: 160,
    originalPrice: 190,
    unit: 'pack of 5',
    rating: 4.6,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Kettle Boiled',
    isWeeklyDeal: false,
    description: 'Traditional kettle-boiled bagels coated with sesame, poppy, flax seeds, and sea salt for a chewy authentic bite.',
    nutrition: { calories: '270 kcal', protein: '10g', fiber: '4g' },
    storageTips: 'Slice and freeze immediately for easy morning toaster convenience.',
    tags: ['Kettle Boiled', 'Vegan']
  },
  {
    id: 'bakery-4',
    name: 'Golden Brioche Burger Buns',
    category: 'bakery',
    brand: 'Artisan Hearth',
    price: 140,
    originalPrice: 170,
    unit: 'pack of 4',
    rating: 4.7,
    reviewCount: 104,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Soft & Fluffy',
    isWeeklyDeal: false,
    description: 'Rich, pillowy buns baked with eggs and butter, topped with a shiny glaze. Elevates any homemade burger.',
    nutrition: { calories: '180 kcal', fat: '5g', protein: '5g' },
    storageTips: 'Keep tightly closed in bag at room temperature.',
    tags: ['Vegetarian', 'Gourmet']
  },
  {
    id: 'bakery-5',
    name: 'Dark Chocolate Sea Salt Brownies',
    category: 'bakery',
    brand: 'Artisan Hearth',
    price: 200,
    originalPrice: 250,
    unit: 'tray of 4 squares',
    rating: 4.9,
    reviewCount: 154,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Indulgent',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Fudgy, dense rich chocolate brownies finished with a sprinkle of sea salt flakes for an irresistible balance.',
    nutrition: { calories: '320 kcal', chocolate: '70% cacao', sugars: '24g' },
    storageTips: 'Store in an airtight container for up to 5 days.',
    tags: ['Sweet Treat', 'Vegetarian']
  },

  // BEVERAGES (5 items)
  {
    id: 'bev-1',
    name: 'Cold-Pressed Vitality Green Juice',
    category: 'beverages',
    brand: 'Pure Orchard',
    price: 250,
    originalPrice: 300,
    unit: '500ml bottle',
    rating: 4.8,
    reviewCount: 132,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Raw & Fresh',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Cold-pressed kale, cucumber, green apple, ginger, lemon, and celery. Hydraulic-pressed without heat to preserve vitamins.',
    nutrition: { calories: '80 kcal', vitaminC: '60% DV', potassium: '380mg', noAddedSugar: true },
    storageTips: 'Keep refrigerated continuously. Consume within 3 days of opening.',
    tags: ['Cold-Pressed', 'Raw', 'Vegan', 'Organic']
  },
  {
    id: 'bev-2',
    name: 'Sparkling Lime Mineral Water (6pk)',
    category: 'beverages',
    brand: 'Mountain Springs',
    price: 350,
    originalPrice: 420,
    unit: '6 x 500ml bottles',
    rating: 4.9,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: '17% OFF',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Zero calories, zero sugar. Pure sparkling mineral water infused with crisp natural lime essence.',
    nutrition: { calories: '0 kcal', sodium: '0mg', sugars: '0g' },
    storageTips: 'Store in a cool dry pantry. Serve ice cold.',
    tags: ['Zero Calorie', 'Refreshing', 'Gluten-Free']
  },
  {
    id: 'bev-3',
    name: 'Pure Kenya Arabica Coffee Beans',
    category: 'beverages',
    brand: 'Mountain Springs',
    price: 450,
    originalPrice: 520,
    unit: '250g whole bean',
    rating: 4.8,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Smooth & Bold',
    isWeeklyDeal: false,
    description: 'Single-origin Embu Mt. Kenya Arabica beans with bright acidity and rich chocolatey caramel undertones.',
    nutrition: { calories: '5 kcal', caffeine: '160mg per serving', zeroSugar: true },
    storageTips: 'Keep in an airtight bag away from heat and light.',
    tags: ['Organic', 'Direct Trade', 'Kenyan Grown']
  },
  {
    id: 'bev-4',
    name: '100% Squeezed Orange Juice',
    category: 'beverages',
    brand: 'Pure Orchard',
    price: 220,
    originalPrice: 260,
    unit: '1 Litre jug',
    rating: 4.7,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'No Added Sugar',
    isWeeklyDeal: false,
    description: 'Freshly squeezed sweet oranges packed with natural vitamin C. Never from concentrate.',
    nutrition: { vitaminC: '120% DV', potassium: '450mg', folate: '15% DV' },
    storageTips: 'Refrigerate. Shake thoroughly before each glass.',
    tags: ['Non-GMO', 'No Added Sugar']
  },
  {
    id: 'bev-5',
    name: 'Embu Highland Black Tea (500g)',
    category: 'beverages',
    brand: 'Mountain Springs',
    price: 190,
    originalPrice: 230,
    unit: '500g loose leaf',
    rating: 4.6,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Highland Grown',
    isWeeklyDeal: false,
    description: 'Premium quality Kenyan tea grown in the volcanic soils of Embu. Rich amber color and robust, invigorating aroma.',
    nutrition: { caffeine: 'Moderate', calories: '0 kcal' },
    storageTips: 'Store in an airtight tea canister away from spices.',
    tags: ['Local Farmed', 'Antioxidants', 'Fair Trade']
  },

  // HOUSEHOLD & CLEANING (4 items)
  {
    id: 'house-1',
    name: 'Plant-Based Lavender Dish Soap',
    category: 'household',
    brand: 'EcoLiving Clean',
    price: 180,
    originalPrice: 220,
    unit: '750ml bottle',
    rating: 4.8,
    reviewCount: 160,
    image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Eco-Friendly',
    isWeeklyDeal: false,
    description: 'Tough on grease, gentle on hands. Biodegradable plant-derived surfactants scented with lavender essential oils.',
    nutrition: { biodegradable: '98%', crueltyFree: true, phosphates: '0%' },
    storageTips: 'Store in cabinet under sink.',
    tags: ['Eco-Friendly', 'Cruelty-Free', 'Zero Phosphates']
  },
  {
    id: 'house-2',
    name: 'Bamboo Tree-Free Paper Towels (2 Rolls)',
    category: 'household',
    brand: 'EcoLiving Clean',
    price: 240,
    originalPrice: 290,
    unit: '2 mega rolls',
    rating: 4.7,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Save Trees',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Crafted from 100% fast-renewing bamboo. Ultra-absorbent 2-ply sheets that resist linting and tearing.',
    nutrition: { chlorineBleach: '0%', bambooContent: '100%' },
    storageTips: 'Store in a dry closet.',
    tags: ['Sustainable', 'Plastic-Free', 'Biodegradable']
  },
  {
    id: 'house-3',
    name: 'Concentrated Laundry Detergent Powder',
    category: 'household',
    brand: 'EcoLiving Clean',
    price: 350,
    originalPrice: 420,
    unit: '1 kg box',
    rating: 4.8,
    reviewCount: 202,
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'High Action',
    isWeeklyDeal: false,
    description: 'Deep stain removal power for machine or hand washing. Leaves laundry smelling fresh without harsh chemicals.',
    nutrition: { dyeFree: true, scent: 'Fresh Floral' },
    storageTips: 'Keep container securely closed out of reach of children.',
    tags: ['Eco-Friendly', 'Hypoallergenic']
  },
  {
    id: 'house-4',
    name: 'All-Purpose Surface Cleaner (Eucalyptus & Mint)',
    category: 'household',
    brand: 'EcoLiving Clean',
    price: 260,
    originalPrice: 310,
    unit: '750ml spray',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Multi-Surface',
    isWeeklyDeal: false,
    description: 'Cuts through grease and dirt on stainless steel, countertops, tile, and floors with natural botanical freshness.',
    nutrition: { phthalateFree: true, nonToxic: true },
    storageTips: 'Keep nozzle turned to OFF when not in use.',
    tags: ['Non-Toxic', 'Cruelty-Free']
  },

  // SNACKS & PANTRY (5 items)
  {
    id: 'snack-1',
    name: 'Kettle Cooked Himalayan Sea Salt Potato Chips',
    category: 'snacks',
    brand: 'Golden Fields',
    price: 110,
    originalPrice: 130,
    unit: '150g bag',
    rating: 4.8,
    reviewCount: 230,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Crunchy',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Batch-cooked in pure sunflower oil for an exceptional crunch. Finished with mineral-rich crystal salt.',
    nutrition: { calories: '150 kcal', fat: '9g', nonGMO: true, glutenFree: true },
    storageTips: 'Roll down bag and clip shut to maintain crispness.',
    tags: ['Gluten-Free', 'Vegan', 'Non-GMO']
  },
  {
    id: 'snack-2',
    name: 'Pure Premium Pishori Aromatic Rice 1kg',
    category: 'snacks',
    brand: 'Cylet Organic',
    price: 250,
    originalPrice: 290,
    unit: '1 kg sealed pouch',
    rating: 4.9,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Grade 1 Mwea',
    isWeeklyDeal: false,
    description: '100% pure authentic long-grain Mwea Pishori rice. Renowned across Kenya for its distinct sweet aroma and delicate fluffy texture.',
    nutrition: { protein: '7g per 100g', carbs: '78g', fat: '0.6g' },
    storageTips: 'Store in an airtight container in a dry pantry.',
    tags: ['Pishori', 'Aromatic', 'Pantry Staple']
  },
  {
    id: 'snack-3',
    name: 'Pure Golden Vegetable Cooking Oil 1L',
    category: 'snacks',
    brand: 'Pure Orchard',
    price: 550,
    originalPrice: 620,
    unit: '1 Litre bottle',
    rating: 4.9,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Triple Refined',
    isWeeklyDeal: false,
    description: 'Pure triple-refined vegetable cooking oil fortified with Vitamin A and Vitamin D. Cholesterol free with high smoke point for crisp frying.',
    nutrition: { vitaminA: 'Fortified', cholesterol: '0mg', transFat: '0g' },
    storageTips: 'Keep away from direct heat and direct sunlight.',
    tags: ['Fortified', 'Cholesterol-Free', 'Kitchen Essential']
  },
  {
    id: 'snack-4',
    name: 'Roasted & Salted Macadamia Nuts',
    category: 'snacks',
    brand: 'Golden Fields',
    price: 280,
    originalPrice: 330,
    unit: '200g pouch',
    rating: 4.7,
    reviewCount: 118,
    image: 'https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'Embu Grown',
    isWeeklyDeal: false,
    description: 'Locally grown Embu macadamia nuts, dry-roasted and lightly salted for a buttery, decadent crunch.',
    nutrition: { healthyFats: '21g per serving', protein: '4g', keto: true },
    storageTips: 'Store in cool dry place away from moisture.',
    tags: ['Local Produce', 'Keto', 'Gluten-Free', 'Vegan']
  },
  {
    id: 'snack-5',
    name: 'Organic Soft-Chew Dried Mango Slices',
    category: 'snacks',
    brand: 'Cylet Organic',
    price: 180,
    originalPrice: 210,
    unit: '150g pouch',
    rating: 4.8,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    badge: 'No Added Sugar',
    isWeeklyDeal: true,
    dealDeadline: 'Sunday 11:59 PM',
    description: 'Naturally tree-ripened mangoes gently dried to a sweet, tender chew. Contains only 100% pure organic mango.',
    nutrition: { vitaminA: '20% DV', sugars: 'Natural only', fiber: '3g' },
    storageTips: 'Keep zip closed between snacking.',
    tags: ['Organic', 'No Added Sugar', 'Vegan']
  }
];


// --- File: src/data/stores.js ---
// Store branches for Cylet Supermarket in Embu, Kenya
// Flagship: Embu - Siakago Road (near Kubukubu Rd.) in Embu, Kenya

const STORES = [
  {
    id: 'store-1',
    name: 'Cylet Supermarket - Embu Main Branch',
    code: 'CY-01',
    isFlagship: true,
    address: 'Embu - Siakago Road (near Kubukubu Rd.)',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '6:30 AM - 10:00 PM',
      weekend: '7:00 AM - 9:30 PM',
    },
    isOpenNow: true,
    coordinates: { x: 50, y: 50, lat: -0.5342, lng: 37.4560 },
    distance: '0.1 km from Embu Town Centre',
    features: ['In-Store Bakery', 'Butcher Counter', 'Fresh Farm Produce', 'M-Pesa Express Point', 'Curbside Pickup', 'Wholesale & Retail'],
    manager: 'Sarah Jenkins',
    description: 'Premier flagship location along Siakago Road near Kubukubu Road in Embu town. Full range of groceries, fresh local produce, bakery, butchery, and home goods.'
  },
  {
    id: 'store-2',
    name: 'Cylet Express - Kubukubu Road Junction',
    code: 'CY-02',
    isFlagship: false,
    address: 'Kubukubu Road opposite Municipal Market',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 9:30 PM',
      weekend: '8:00 AM - 9:00 PM',
    },
    isOpenNow: true,
    coordinates: { x: 46, y: 48, lat: -0.5332, lng: 37.4545 },
    distance: '0.4 km away',
    features: ['Rapid Checkout', 'Fresh Milk ATM', 'In-Store Bakery', 'Curbside Pickup', 'M-Pesa Paybill'],
    manager: 'Michael Omondi',
    description: 'Convenient quick-stop shopping right by Kubukubu Road for fresh dairy, snacks, bakery, and daily household pantry supplies.'
  },
  {
    id: 'store-3',
    name: 'Cylet Supermarket - Siakago Road Wholesale Hub',
    code: 'CY-03',
    isFlagship: false,
    address: 'Siakago Road Commercial Park',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '6:00 AM - 8:30 PM',
      weekend: '7:00 AM - 7:30 PM',
    },
    isOpenNow: true,
    coordinates: { x: 54, y: 52, lat: -0.5358, lng: 37.4582 },
    distance: '0.7 km away',
    features: ['Wholesale Bulk Buying', 'Truck Loading Bays', 'Beverage Distribution', 'Grain Store'],
    manager: 'Elena Vance',
    description: 'Dedicated wholesale distribution center supplying local retailers, restaurants, and schools with bulk pantry staples at farm-direct prices.'
  },
  {
    id: 'store-4',
    name: 'Cylet Supermarket - Kangaru Branch',
    code: 'CY-04',
    isFlagship: false,
    address: 'Kangaru Road opposite University Gate',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 10:00 PM',
      weekend: '7:30 AM - 9:30 PM',
    },
    isOpenNow: true,
    coordinates: { x: 58, y: 38, lat: -0.5185, lng: 37.4625 },
    distance: '2.5 km away',
    features: ['Student Discount Specials', 'Fresh Deli', 'Juice Bar', 'Stationery Department'],
    manager: 'David Mwangi',
    description: 'Serving students, faculty, and the Kangaru neighborhood with prepared meals, fresh fruit, stationery, and affordable groceries.'
  },
  {
    id: 'store-5',
    name: 'Cylet Express - Dallas Estate Hub',
    code: 'CY-05',
    isFlagship: false,
    address: 'Dallas Estate Commercial Avenue',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 9:30 PM',
      weekend: '7:30 AM - 9:00 PM',
    },
    isOpenNow: true,
    coordinates: { x: 42, y: 58, lat: -0.5420, lng: 37.4510 },
    distance: '1.4 km away',
    features: ['Neighborhood Express', 'Fresh Veggie Crates', 'M-Pesa Counter', 'Doorstep Delivery'],
    manager: 'Grace Njeri',
    description: 'A cozy residential branch catering to Dallas Estate families with fresh morning milk, bread, eggs, and evening dinner ingredients.'
  },
  {
    id: 'store-6',
    name: 'Cylet Supermarket - Majengo Center',
    code: 'CY-06',
    isFlagship: false,
    address: 'Majengo High Street near Matatu Terminus',
    city: 'Embu',
    postalCode: '60100',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '6:30 AM - 10:00 PM',
      weekend: '7:00 AM - 9:30 PM',
    },
    isOpenNow: true,
    coordinates: { x: 48, y: 44, lat: -0.5310, lng: 37.4530 },
    distance: '0.8 km away',
    features: ['Transit Grab-and-Go', 'Hot Snack Counter', 'Cold Drinks', 'Mobile Airtime'],
    manager: 'Kevin Kimani',
    description: 'High-foot-traffic branch at the transport hub offering swift shopping for commuters, market traders, and travelers.'
  },
  {
    id: 'store-7',
    name: 'Cylet Supermarket - Siakago Town Branch',
    code: 'CY-07',
    isFlagship: false,
    address: 'Siakago Town Plaza, Main Highway',
    city: 'Siakago',
    postalCode: '60103',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 8:30 PM',
      weekend: '7:30 AM - 8:00 PM',
    },
    isOpenNow: true,
    coordinates: { x: 75, y: 30, lat: -0.5833, lng: 37.6333 },
    distance: '24 km from Embu CBD',
    features: ['Farm Tools & Hardware', 'Animal Feeds', 'Fresh Groceries', 'Solar Appliances'],
    manager: 'Ann Mutua',
    description: 'Extending Cylet values to Mbeere North with bulk farm supplies, solar accessories, and comprehensive household provisions.'
  },
  {
    id: 'store-8',
    name: 'Cylet Supermarket - Runyenjes Branch',
    code: 'CY-08',
    isFlagship: false,
    address: 'Meru-Nairobi Highway, Runyenjes Central',
    city: 'Runyenjes',
    postalCode: '60102',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 9:00 PM',
      weekend: '7:30 AM - 8:30 PM',
    },
    isOpenNow: true,
    coordinates: { x: 70, y: 22, lat: -0.4167, lng: 37.5667 },
    distance: '18 km from Embu CBD',
    features: ['Fresh Produce', 'Butchery', 'Gas Cylinder Refill', 'Parking Area'],
    manager: 'Samuel Kariuki',
    description: 'Prominent highway branch serving Runyenjes town residents and travellers along the Nairobi-Meru transit corridor.'
  },
  {
    id: 'store-9',
    name: 'Cylet Supermarket - Manyatta Outpost',
    code: 'CY-09',
    isFlagship: false,
    address: 'Manyatta Market Square',
    city: 'Manyatta',
    postalCode: '60101',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '7:00 AM - 8:30 PM',
      weekend: '7:30 AM - 8:00 PM',
    },
    isOpenNow: true,
    coordinates: { x: 35, y: 22, lat: -0.4500, lng: 37.4667 },
    distance: '12 km north of Embu',
    features: ['Coffee Farmers Supplies', 'Fresh Farm Greens', 'Bakery', 'General Provisions'],
    manager: 'Beatrice Wambui',
    description: 'Community-oriented store at the foothills of Mt. Kenya serving Manyatta agricultural producers and local households.'
  },
  {
    id: 'store-10',
    name: 'Cylet Supermarket - Ishiara Branch',
    code: 'CY-10',
    isFlagship: false,
    address: 'Ishiara Main Market Street',
    city: 'Ishiara',
    postalCode: '60104',
    phone: '+254 20 2003310',
    email: 'cyletsupermarkets@gmail.com',
    hours: {
      weekday: '6:30 AM - 8:00 PM',
      weekend: '7:00 AM - 8:00 PM',
    },
    isOpenNow: true,
    coordinates: { x: 80, y: 15, lat: -0.4500, lng: 37.7833 },
    distance: '38 km from Embu CBD',
    features: ['Market Day Specials', 'Dry Cereals & Grains', 'Household Goods', 'Water Tanks'],
    manager: 'Dennis Murimi',
    description: 'Serving Mbeere North with staple cereals, clean water containers, livestock minerals, and everyday groceries.'
  }
];


// --- File: src/data/deals.js ---
// Deals, promo codes, and value propositions for Cylet Supermarket

const PROMO_BANNERS = [
  {
    id: 'promo-1',
    tag: 'SPRING HARVEST FESTIVAL',
    title: 'Up to 25% Off Fresh Organic Produce',
    subtitle: 'Direct from regional organic farms to your doorstep in under 2 hours.',
    code: 'FRESH20',
    discount: '20% OFF',
    bgColor: 'from-emerald-700 via-emerald-600 to-green-700',
    accentColor: 'text-amber-300',
    buttonText: 'Shop Harvest Deals',
    buttonLink: 'shop',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'promo-2',
    tag: 'WEEKEND BUTCHER & SEAFOOD',
    title: 'Sustainably Caught Wild Salmon & Angus Steaks',
    subtitle: 'Cut fresh daily by our master butchers. Free insulated cooling pack on all orders.',
    code: 'STEAK15',
    discount: '15% OFF',
    bgColor: 'from-slate-900 via-rose-950 to-red-900',
    accentColor: 'text-orange-400',
    buttonText: 'Explore Meat & Fish',
    buttonLink: 'shop',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'promo-3',
    tag: 'ARTISAN HEARTH SPECIAL',
    title: 'Morning Warm Sourdough & French Pastries',
    subtitle: 'Kettle-boiled bagels, flaky butter croissants, and organic sourdough baked at 5 AM.',
    code: 'BAKERY10',
    discount: 'Buy 2 Get 1 Free',
    bgColor: 'from-amber-800 via-amber-700 to-yellow-800',
    accentColor: 'text-yellow-200',
    buttonText: 'Order Fresh Bakery',
    buttonLink: 'shop',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  }
];

const COUPONS = {
  'FRESH20': { code: 'FRESH20', type: 'percentage', value: 0.20, description: '20% discount on orders over KSh 2,500', minOrder: 2500 },
  'WELCOME10': { code: 'WELCOME10', type: 'fixed', value: 300.00, description: 'KSh 300 off your first supermarket order', minOrder: 3000 },
  'FREESHIP': { code: 'FREESHIP', type: 'shipping', value: 250.00, description: 'Free express grocery delivery', minOrder: 2000 },
};

const VALUE_PROPOSITIONS = [
  {
    icon: 'Truck',
    title: 'Fast Delivery & Curbside',
    description: 'Get doorstep delivery in under 2 hours or curbside pickup ready in 30 minutes.'
  },
  {
    icon: 'ShieldCheck',
    title: '100% Freshness Guarantee',
    description: 'Not satisfied with your apples or salmon? Instant 1-click refund or replacement, no hassle.'
  },
  {
    icon: 'Sprout',
    title: 'Direct Farm Partnerships',
    description: 'We source daily from over 120 verified regional farms and fair-trade cooperatives.'
  },
  {
    icon: 'MapPin',
    title: '10+ Local Branches',
    description: 'Shop your local branch inventory online with real-time stock levels and aisle numbers.'
  }
];


// --- File: src/data/orders.js ---
// Mock orders dataset for Cylet Supermarket Admin Portal
// 25 realistic orders with customer details, line items, and financial summaries in KES

const INITIAL_ORDERS = [
  {
    "id": "FM-9425",
    "customer": {
      "name": "Sophia Patel",
      "email": "sophia.patel@gmail.com",
      "phone": "+1 (555) 234-8910"
    },
    "address": {
      "street": "450 Greenpark Way, Apt 12C",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Please buzz code 1212. Leave outside the apartment door."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 640
      },
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 1920
      },
      {
        "productId": "prod-20",
        "name": "Artisan Sourdough Loaf",
        "price": 270,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (650g)",
        "total": 270
      }
    ],
    "subtotal": 2830,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 3080,
    "paymentMethod": "Credit / Debit Card (Visa •••• 4242)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Pending",
    "date": "2026-10-18T09:42:00Z",
    "formattedDate": "Today, 9:42 AM"
  },
  {
    "id": "FM-9424",
    "customer": {
      "name": "James Wilson",
      "email": "j.wilson99@outlook.com",
      "phone": "+1 (555) 781-4421"
    },
    "address": {
      "street": "104 Market Street, Suite 500",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Reception desk on the 5th floor."
    },
    "items": [
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 450
      },
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 640
      },
      {
        "productId": "prod-25",
        "name": "Cold Pressed Green Detox Juice",
        "price": 270,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        "unit": "16 fl oz",
        "total": 1080
      }
    ],
    "subtotal": 2170,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 300,
    "total": 2120,
    "paymentMethod": "M-Pesa Mobile Money (254712***456)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Processing",
    "date": "2026-10-18T08:55:00Z",
    "formattedDate": "Today, 8:55 AM"
  },
  {
    "id": "FM-9423",
    "customer": {
      "name": "Amina Kimani",
      "email": "amina.k@safari.co.ke",
      "phone": "+1 (555) 612-9082"
    },
    "address": {
      "street": "72 Westlands Ring Road",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Gate 3, security guard will direct to Villa 14."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 2340
      },
      {
        "productId": "prod-15",
        "name": "Artisan Greek Yogurt Plain",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        "unit": "32 oz tub",
        "total": 540
      },
      {
        "productId": "prod-3",
        "name": "Organic Baby Spinach",
        "price": 90,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz clamshell",
        "total": 180
      }
    ],
    "subtotal": 3060,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 650,
    "total": 2410,
    "paymentMethod": "M-Pesa Mobile Money (254722***891)",
    "paymentStatus": "Paid",
    "fulfillmentType": "pickup",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Processing",
    "date": "2026-10-18T08:12:00Z",
    "formattedDate": "Today, 8:12 AM"
  },
  {
    "id": "FM-9422",
    "customer": {
      "name": "David Ochieng",
      "email": "dochieng@techhub.net",
      "phone": "+1 (555) 441-2390"
    },
    "address": {
      "street": "18 Riverside Drive, Block B",
      "city": "Riverside",
      "postalCode": "10006",
      "instructions": "Leave with concierge."
    },
    "items": [
      {
        "productId": "prod-28",
        "name": "Single Origin Whole Bean Dark Roast",
        "price": 840,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz bag",
        "total": 1680
      },
      {
        "productId": "prod-22",
        "name": "French Butter Croissants",
        "price": 300,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 4",
        "total": 600
      }
    ],
    "subtotal": 2280,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2530,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 8821)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Dallas Estate Hub",
    "status": "Delivered",
    "date": "2026-10-18T07:30:00Z",
    "formattedDate": "Today, 7:30 AM"
  },
  {
    "id": "FM-9421",
    "customer": {
      "name": "Emily Davis",
      "email": "emily.davis@designstudio.org",
      "phone": "+1 (555) 890-1234"
    },
    "address": {
      "street": "320 Karen Road",
      "city": "Karen",
      "postalCode": "10008",
      "instructions": "Main gate call button 4."
    },
    "items": [
      {
        "productId": "prod-10",
        "name": "Organic Boneless Chicken Breast",
        "price": 540,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
        "unit": "1.5 lb pack",
        "total": 1620
      },
      {
        "productId": "prod-5",
        "name": "Organic Sweet Blueberries",
        "price": 120,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
        "unit": "6 oz pint",
        "total": 240
      },
      {
        "productId": "prod-34",
        "name": "Artisan Mixed Roasted Nuts",
        "price": 480,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz jar",
        "total": 480
      }
    ],
    "subtotal": 2340,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2590,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Pending",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Siakago Town Branch",
    "status": "Pending",
    "date": "2026-10-18T06:45:00Z",
    "formattedDate": "Today, 6:45 AM"
  },
  {
    "id": "FM-9420",
    "customer": {
      "name": "Robert Mugabe",
      "email": "rmugabe@globalhealth.org",
      "phone": "+1 (555) 772-9102"
    },
    "address": {
      "street": "15 Parklands Avenue, Floor 3",
      "city": "Parklands",
      "postalCode": "10009",
      "instructions": "Deliver to front office."
    },
    "items": [
      {
        "productId": "prod-30",
        "name": "Eco-Friendly Plant Dish Liquid",
        "price": 240,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?auto=format&fit=crop&w=800&q=80",
        "unit": "25 fl oz bottle",
        "total": 720
      },
      {
        "productId": "prod-31",
        "name": "Concentrated Laundry Detergent",
        "price": 720,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
        "unit": "64 fl oz (64 loads)",
        "total": 720
      }
    ],
    "subtotal": 1440,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1690,
    "paymentMethod": "Credit / Debit Card (Visa •••• 1109)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Runyenjes Branch",
    "status": "Pending",
    "date": "2026-10-18T05:10:00Z",
    "formattedDate": "Today, 5:10 AM"
  },
  {
    "id": "FM-9419",
    "customer": {
      "name": "Chloe Tremblay",
      "email": "chloe.t@montreal.ca",
      "phone": "+1 (555) 302-8871"
    },
    "address": {
      "street": "55 Kilimani Square, Apt 8",
      "city": "Kilimani",
      "postalCode": "10010",
      "instructions": "Doorbell code 88."
    },
    "items": [
      {
        "productId": "prod-4",
        "name": "Farm Fresh Heirloom Tomatoes",
        "price": 140,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 280
      },
      {
        "productId": "prod-17",
        "name": "Aged English Farmhouse Cheddar",
        "price": 360,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz block",
        "total": 720
      },
      {
        "productId": "prod-21",
        "name": "Warm Sesame Brioche Buns",
        "price": 240,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 6",
        "total": 240
      }
    ],
    "subtotal": 1240,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1490,
    "paymentMethod": "Credit / Debit Card (Visa •••• 9920)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Manyatta Outpost",
    "status": "Cancelled",
    "date": "2026-10-17T21:40:00Z",
    "formattedDate": "Yesterday, 9:40 PM"
  },
  {
    "id": "FM-9418",
    "customer": {
      "name": "Alexander Novak",
      "email": "a.novak@eastern.eu",
      "phone": "+1 (555) 492-3810"
    },
    "address": {
      "street": "10 Village Market Parkway",
      "city": "Gigiri",
      "postalCode": "10011",
      "instructions": "Deliver to Embassy security annex."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 3840
      },
      {
        "productId": "prod-29",
        "name": "Organic Sparkling Lemon Mineral Water",
        "price": 360,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 6 x 12 oz",
        "total": 1080
      }
    ],
    "subtotal": 4920,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 980,
    "total": 3940,
    "paymentMethod": "Credit / Debit Card (Amex •••• 3001)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Ishiara Branch",
    "status": "Delivered",
    "date": "2026-10-17T18:15:00Z",
    "formattedDate": "Yesterday, 6:15 PM"
  },
  {
    "id": "FM-9417",
    "customer": {
      "name": "Grace Wanjiku",
      "email": "wanjiku.grace@gmail.com",
      "phone": "+1 (555) 912-4501"
    },
    "address": {
      "street": "12 South End Highway",
      "city": "Nairobi South",
      "postalCode": "10012",
      "instructions": "House with the green perimeter gate."
    },
    "items": [
      {
        "productId": "prod-11",
        "name": "Fresh Wild Tiger Prawns",
        "price": 990,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb raw deveined",
        "total": 1980
      },
      {
        "productId": "prod-6",
        "name": "Organic Hass Avocados Box",
        "price": 80,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "box of 8",
        "total": 80
      }
    ],
    "subtotal": 2060,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2310,
    "paymentMethod": "M-Pesa Mobile Money (254701***239)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Majengo Center",
    "status": "Delivered",
    "date": "2026-10-17T16:20:00Z",
    "formattedDate": "Yesterday, 4:20 PM"
  },
  {
    "id": "FM-9416",
    "customer": {
      "name": "Liam Murphy",
      "email": "liam.murphy@ireland.ie",
      "phone": "+1 (555) 782-9011"
    },
    "address": {
      "street": "450 Greenpark Way, Suite 4",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Curbside slot #3."
    },
    "items": [
      {
        "productId": "prod-23",
        "name": "Kettle-Boiled Everything Bagels",
        "price": 240,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 6",
        "total": 480
      },
      {
        "productId": "prod-18",
        "name": "European Salted Butter",
        "price": 260,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz block",
        "total": 520
      }
    ],
    "subtotal": 1000,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 0,
    "total": 1000,
    "paymentMethod": "Credit / Debit Card (Visa •••• 5512)",
    "paymentStatus": "Paid",
    "fulfillmentType": "pickup",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Delivered",
    "date": "2026-10-17T14:10:00Z",
    "formattedDate": "Yesterday, 2:10 PM"
  },
  {
    "id": "FM-9415",
    "customer": {
      "name": "Maria Santos",
      "email": "maria.santos@latam.org",
      "phone": "+1 (555) 671-2918"
    },
    "address": {
      "street": "104 Market Street, Apt 19B",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Deliver between 1 PM and 2 PM."
    },
    "items": [
      {
        "productId": "prod-7",
        "name": "Crisp English Cucumbers",
        "price": 160,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
        "unit": "each",
        "total": 640
      },
      {
        "productId": "prod-12",
        "name": "Lean Ground Beef 90/10",
        "price": 420,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb vacuum pack",
        "total": 1260
      },
      {
        "productId": "prod-37",
        "name": "Dark Chocolate Sea Salt Caramels",
        "price": 330,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
        "unit": "7 oz box",
        "total": 660
      }
    ],
    "subtotal": 2560,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2810,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 7733)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-17T11:05:00Z",
    "formattedDate": "Yesterday, 11:05 AM"
  },
  {
    "id": "FM-9414",
    "customer": {
      "name": "Kenneth Mwangi",
      "email": "k.mwangi@capital.co.ke",
      "phone": "+1 (555) 431-8977"
    },
    "address": {
      "street": "72 Westlands Ring Road, Penthouse",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Leave with concierge."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 5,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 4800
      },
      {
        "productId": "prod-16",
        "name": "Fresh Mozzarella di Bufala Ball",
        "price": 290,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz in brine",
        "total": 870
      }
    ],
    "subtotal": 5670,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 1130,
    "total": 4540,
    "paymentMethod": "M-Pesa Mobile Money (254711***982)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-16T19:22:00Z",
    "formattedDate": "Oct 16, 7:22 PM"
  },
  {
    "id": "FM-9413",
    "customer": {
      "name": "Jessica Taylor",
      "email": "jess.taylor@nyu.edu",
      "phone": "+1 (555) 883-1200"
    },
    "address": {
      "street": "88 Valley Arcade Square",
      "city": "Lavington",
      "postalCode": "10004",
      "instructions": "Corner townhouse."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 1280
      },
      {
        "productId": "prod-13",
        "name": "Organic Whole Milk Glass Bottle",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
        "unit": "64 fl oz (half gallon)",
        "total": 540
      }
    ],
    "subtotal": 1820,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2070,
    "paymentMethod": "Credit / Debit Card (Visa •••• 6602)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Siakago Road Wholesale Hub",
    "status": "Delivered",
    "date": "2026-10-16T15:10:00Z",
    "formattedDate": "Oct 16, 3:10 PM"
  },
  {
    "id": "FM-9412",
    "customer": {
      "name": "Daniel Kiprotich",
      "email": "dkiprotich@athletics.org",
      "phone": "+1 (555) 332-9019"
    },
    "address": {
      "street": "200 Airport Road Gateway",
      "city": "Embakasi",
      "postalCode": "10007",
      "instructions": "Cargo terminal gate 2."
    },
    "items": [
      {
        "productId": "prod-35",
        "name": "Organic Raw Wildflower Honey",
        "price": 510,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz jar",
        "total": 1020
      },
      {
        "productId": "prod-27",
        "name": "Sparkling Berry Kombucha",
        "price": 210,
        "quantity": 6,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
        "unit": "14 fl oz",
        "total": 1260
      }
    ],
    "subtotal": 2280,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2530,
    "paymentMethod": "M-Pesa Mobile Money (254705***443)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-16T11:45:00Z",
    "formattedDate": "Oct 16, 11:45 AM"
  },
  {
    "id": "FM-9411",
    "customer": {
      "name": "Sarah Connor",
      "email": "sarah.c@cyberdyne.org",
      "phone": "+1 (555) 198-4202"
    },
    "address": {
      "street": "104 Market Street, Room 102",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Deliver to front desk."
    },
    "items": [
      {
        "productId": "prod-33",
        "name": "All-Natural Almond Butter Crunchy",
        "price": 420,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz jar",
        "total": 840
      },
      {
        "productId": "prod-24",
        "name": "Whole Wheat Farmhouse Sliced Bread",
        "price": 230,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (600g)",
        "total": 460
      }
    ],
    "subtotal": 1300,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1550,
    "paymentMethod": "Credit / Debit Card (Visa •••• 1004)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-15T16:30:00Z",
    "formattedDate": "Oct 15, 4:30 PM"
  },
  {
    "id": "FM-9410",
    "customer": {
      "name": "Victor Vance",
      "email": "vvance@vicecity.com",
      "phone": "+1 (555) 777-8899"
    },
    "address": {
      "street": "72 Westlands Ring Road",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Ring bell at entrance."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 3120
      }
    ],
    "subtotal": 3120,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 620,
    "total": 2500,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 9928)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-15T14:15:00Z",
    "formattedDate": "Oct 15, 2:15 PM"
  },
  {
    "id": "FM-9409",
    "customer": {
      "name": "Nadia Petrova",
      "email": "n.petrova@nordic.com",
      "phone": "+1 (555) 881-2391"
    },
    "address": {
      "street": "18 Riverside Drive, Apt 3",
      "city": "Riverside",
      "postalCode": "10006",
      "instructions": "Ground floor unit."
    },
    "items": [
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 300
      },
      {
        "productId": "prod-3",
        "name": "Organic Baby Spinach",
        "price": 90,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz clamshell",
        "total": 270
      }
    ],
    "subtotal": 570,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 820,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Dallas Estate Hub",
    "status": "Delivered",
    "date": "2026-10-15T09:20:00Z",
    "formattedDate": "Oct 15, 9:20 AM"
  },
  {
    "id": "FM-9408",
    "customer": {
      "name": "Brian Otieno",
      "email": "botieno@energy.ke",
      "phone": "+1 (555) 902-3341"
    },
    "address": {
      "street": "320 Karen Road, House 7",
      "city": "Karen",
      "postalCode": "10008",
      "instructions": "Deliver to main veranda."
    },
    "items": [
      {
        "productId": "prod-10",
        "name": "Organic Boneless Chicken Breast",
        "price": 540,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
        "unit": "1.5 lb pack",
        "total": 2160
      }
    ],
    "subtotal": 2160,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2410,
    "paymentMethod": "M-Pesa Mobile Money (254728***119)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Siakago Town Branch",
    "status": "Delivered",
    "date": "2026-10-14T17:50:00Z",
    "formattedDate": "Oct 14, 5:50 PM"
  },
  {
    "id": "FM-9407",
    "customer": {
      "name": "Hannah Abbott",
      "email": "hannah.a@hufflepuff.org",
      "phone": "+1 (555) 431-7722"
    },
    "address": {
      "street": "15 Parklands Avenue, Apt 2B",
      "city": "Parklands",
      "postalCode": "10009",
      "instructions": "Doorbell is loud."
    },
    "items": [
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 960
      },
      {
        "productId": "prod-20",
        "name": "Artisan Sourdough Loaf",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (650g)",
        "total": 540
      }
    ],
    "subtotal": 1500,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1750,
    "paymentMethod": "Credit / Debit Card (Visa •••• 4490)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Runyenjes Branch",
    "status": "Delivered",
    "date": "2026-10-14T13:40:00Z",
    "formattedDate": "Oct 14, 1:40 PM"
  },
  {
    "id": "FM-9406",
    "customer": {
      "name": "Samuel Jackson",
      "email": "s.jackson@shield.gov",
      "phone": "+1 (555) 911-0007"
    },
    "address": {
      "street": "55 Kilimani Square, Suite 900",
      "city": "Kilimani",
      "postalCode": "10010",
      "instructions": "Top floor executive suite."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 2880
      },
      {
        "productId": "prod-28",
        "name": "Single Origin Whole Bean Dark Roast",
        "price": 840,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz bag",
        "total": 1680
      }
    ],
    "subtotal": 4560,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 910,
    "total": 3650,
    "paymentMethod": "Credit / Debit Card (Amex •••• 1009)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Manyatta Outpost",
    "status": "Delivered",
    "date": "2026-10-13T16:15:00Z",
    "formattedDate": "Oct 13, 4:15 PM"
  },
  {
    "id": "FM-9405",
    "customer": {
      "name": "Zoe Saldana",
      "email": "zoe.s@hollywood.com",
      "phone": "+1 (555) 345-6789"
    },
    "address": {
      "street": "10 Village Market Parkway, Villa 2",
      "city": "Gigiri",
      "postalCode": "10011",
      "instructions": "Private drive."
    },
    "items": [
      {
        "productId": "prod-25",
        "name": "Cold Pressed Green Detox Juice",
        "price": 270,
        "quantity": 6,
        "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        "unit": "16 fl oz",
        "total": 1620
      },
      {
        "productId": "prod-36",
        "name": "Organic Chia & Hemp Seed Clusters",
        "price": 360,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "10 oz pouch",
        "total": 1080
      }
    ],
    "subtotal": 2700,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2950,
    "paymentMethod": "Credit / Debit Card (Visa •••• 7711)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Ishiara Branch",
    "status": "Delivered",
    "date": "2026-10-13T11:20:00Z",
    "formattedDate": "Oct 13, 11:20 AM"
  },
  {
    "id": "FM-9404",
    "customer": {
      "name": "Patrick Njoroge",
      "email": "pnjoroge@finance.ke",
      "phone": "+1 (555) 601-2384"
    },
    "address": {
      "street": "12 South End Highway",
      "city": "Nairobi South",
      "postalCode": "10012",
      "instructions": "Front desk reception."
    },
    "items": [
      {
        "productId": "prod-11",
        "name": "Fresh Wild Tiger Prawns",
        "price": 990,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb raw deveined",
        "total": 1980
      },
      {
        "productId": "prod-12",
        "name": "Lean Ground Beef 90/10",
        "price": 420,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb vacuum pack",
        "total": 840
      }
    ],
    "subtotal": 2820,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 3070,
    "paymentMethod": "M-Pesa Mobile Money (254721***002)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Majengo Center",
    "status": "Delivered",
    "date": "2026-10-12T15:45:00Z",
    "formattedDate": "Oct 12, 3:45 PM"
  },
  {
    "id": "FM-9403",
    "customer": {
      "name": "Alice Cooper",
      "email": "alice.cooper@rock.net",
      "phone": "+1 (555) 666-1818"
    },
    "address": {
      "street": "104 Market Street, Suite 200",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Knock loudly."
    },
    "items": [
      {
        "productId": "prod-37",
        "name": "Dark Chocolate Sea Salt Caramels",
        "price": 330,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
        "unit": "7 oz box",
        "total": 1320
      }
    ],
    "subtotal": 1320,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1570,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 3321)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Night Express (8 PM - 10 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-12T19:30:00Z",
    "formattedDate": "Oct 12, 7:30 PM"
  },
  {
    "id": "FM-9402",
    "customer": {
      "name": "Lucas Scott",
      "email": "lucas.scott@raven.org",
      "phone": "+1 (555) 443-8822"
    },
    "address": {
      "street": "450 Greenpark Way, Apt 5",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Side entrance door."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 960
      },
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 640
      }
    ],
    "subtotal": 1600,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1850,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Delivered",
    "date": "2026-10-12T08:10:00Z",
    "formattedDate": "Oct 12, 8:10 AM"
  },
  {
    "id": "FM-9401",
    "customer": {
      "name": "Brooke Davis",
      "email": "clothes.over.bros@treehill.com",
      "phone": "+1 (555) 991-3820"
    },
    "address": {
      "street": "72 Westlands Ring Road, Penthouse A",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Elevator keycard required."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 1560
      },
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 300
      }
    ],
    "subtotal": 1860,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2110,
    "paymentMethod": "Credit / Debit Card (Visa •••• 9901)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-11T12:00:00Z",
    "formattedDate": "Oct 11, 12:00 PM"
  }
];


// --- File: src/components/SEO.js ---
// SEO & Structured Data (JSON-LD) Manager for Cylet Supermarket

const updateSEO = ({
  title,
  description,
  ogImage,
  canonicalUrl,
  ogType = 'website',
  product,
  stores,
  pageType = 'generic',
}) => {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  const siteTitle = 'Cylet Supermarket';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  document.title = fullTitle;

  // Helper function to safely set or create meta tags
  const setMetaTag = (attributeName, attributeValue, content) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Helper for Link elements (e.g. canonical)
  const setLinkTag = (rel, href) => {
    if (!href) return;
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute(rel, rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  const defaultDescription =
    'Cylet Supermarket is your premier grocery store on Siakago Road (near Kubukubu Rd.) in Embu, Kenya. Shop farm-fresh produce, quality meats, bakery, and daily essentials.';
  const finalDescription = description || defaultDescription;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://cylet.example.com');
  const defaultImage =
    ogImage || 'https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500';

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', finalDescription);
  setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');
  setLinkTag('canonical', currentUrl);

  // 3. Open Graph Tags
  setMetaTag('property', 'og:site_name', 'Cylet Supermarket');
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', finalDescription);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:url', currentUrl);
  setMetaTag('property', 'og:image', defaultImage);
  setMetaTag('property', 'og:locale', 'en_KE');

  // Product specific OpenGraph
  if (product) {
    setMetaTag('property', 'product:price:amount', product.price.toFixed(2));
    setMetaTag('property', 'product:price:currency', 'USD');
    setMetaTag('property', 'product:availability', product.inStock ? 'in stock' : 'out of stock');
    setMetaTag('property', 'product:condition', 'new');
    setMetaTag('property', 'product:brand', product.brand);
  }

  // 4. Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', finalDescription);
  setMetaTag('name', 'twitter:image', defaultImage);

  // 5. Structured Data (JSON-LD)
  let jsonLdData = null;

  if (pageType === 'product' && product) {
    // schema.org/Product structured data
    jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: [product.image],
      description: product.description,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: currentUrl,
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        priceValidUntil: '2026-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Cylet Supermarket',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    };
  } else if (pageType === 'locator' && stores) {
    // schema.org/LocalBusiness (GroceryStore) structured data for branches in Embu
    jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Cylet Supermarket Branches',
      itemListElement: stores.map((st, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'GroceryStore',
          '@id': `https://cylet.example.com/stores/${st.id}`,
          name: st.name,
          telephone: st.phone || '+254 20 2003310',
          email: st.email || 'cyletsupermarkets@gmail.com',
          url: currentUrl,
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: st.address,
            addressLocality: st.city,
            postalCode: st.postalCode || '60100',
            addressCountry: 'KE',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: st.coordinates?.lat || -0.5342,
            longitude: st.coordinates?.lng || 37.4560,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '06:30',
              closes: '22:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday', 'Sunday'],
              opens: '07:00',
              closes: '21:30',
            },
          ],
          hasMap: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            st.name + ', ' + st.address + ', ' + st.city + ', Kenya'
          )}`,
          amenityFeature: st.features.map((f) => ({
            '@type': 'LocationFeatureSpecification',
            name: f,
            value: true,
          })),
        },
      })),
    };
  } else {
    // Default Organization & WebSite structured data for Home & other pages
    jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://cylet.example.com/#organization',
          name: 'Cylet Supermarket',
          url: 'https://cylet.example.com',
          logo: 'https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500',
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+254 20 2003310',
              email: 'cyletsupermarkets@gmail.com',
              contactType: 'customer service',
              areaServed: 'KE',
              availableLanguage: ['en', 'sw'],
            },
          ],
          sameAs: [
            'https://twitter.com/cylet',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://cylet.example.com/#website',
          url: 'https://cylet.example.com',
          name: 'Cylet Supermarket',
          description: finalDescription,
          publisher: {
            '@id': 'https://cylet.example.com/#organization',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://cylet.example.com/shop?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };
  }

  // Inject or update the application/ld+json script tag in <head>
  let scriptElement = document.getElementById('cylet-jsonld') || document.getElementById('freshmart-jsonld');
  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = 'cylet-jsonld';
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  } else {
    scriptElement.id = 'cylet-jsonld';
  }
  scriptElement.textContent = JSON.stringify(jsonLdData, null, 2);
};


// --- File: src/components/Icons.js ---
// Hand-crafted SVG icons for Cylet supermarket UI
// Styled with standard Tailwind CSS utility classes


const Icon = ({ name, className = 'w-5 h-5', ...props }) => {
  switch (name) {
    case 'Leaf':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case 'ShoppingCart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      );
    case 'Search':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'Heart':
      return (
        <svg viewBox="0 0 24 24" fill={props.fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'MapPin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'Clock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'Phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'Mail':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'Star':
      return (
        <svg viewBox="0 0 24 24" fill={props.fill || "currentColor"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'Check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'Truck':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
          <circle cx="17" cy="18.5" r="2.5" />
          <circle cx="7" cy="18.5" r="2.5" />
        </svg>
      );
    case 'ShieldCheck':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'Sprout':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M7 20h10" />
          <path d="M10 20c5.5-2.5.8-6.4 3-10" />
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8Z" />
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2Z" />
        </svg>
      );
    case 'ArrowRight':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case 'ChevronRight':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case 'ChevronLeft':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case 'ChevronDown':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case 'Plus':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      );
    case 'Minus':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'Trash2':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      );
    case 'Filter':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case 'X':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case 'Menu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      );
    case 'CreditCard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      );
    case 'Smartphone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case 'DollarSign':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'Tag':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
      );
    case 'Navigation':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      );
    case 'Calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      );
    case 'Sparkles':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
      );
    case 'Info':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case 'Share2':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      );
    case 'Sun':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case 'Moon':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    case 'LayoutDashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      );
    case 'Package':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );
    case 'ShoppingBag':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case 'Layers':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'Percent':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <line x1="19" x2="5" y1="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case 'Settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'LogOut':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      );
    case 'User':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'Edit2':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case 'AlertTriangle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      );
    case 'TrendingUp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 'BarChart3':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      );
    case 'Upload':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      );
    case 'Eye':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'ArrowUpDown':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m21 16-4 4-4-4" />
          <path d="M17 20V4" />
          <path d="m3 8 4-4 4 4" />
          <path d="M7 4v16" />
        </svg>
      );
    case 'ExternalLink':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" x2="21" y1="14" y2="3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};


// --- File: src/components/Toast.js ---


const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? 'bg-emerald-900/95 border-emerald-500/50 text-white'
                : isError
                ? 'bg-red-900/95 border-red-500/50 text-white'
                : 'bg-slate-900/95 border-slate-700/60 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isError
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Icon name={isSuccess ? 'Check' : isError ? 'AlertCircle' : 'Info'} className="w-4 h-4" />
              </div>
              <div>
                {toast.title && <p className="font-semibold text-sm leading-tight">{toast.title}</p>}
                <p className="text-xs text-slate-200 mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
              aria-label="Close notification"
            >
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};


// --- File: src/components/BottomNav.js ---


const BottomNav = ({
  activePage,
  setActivePage,
  cartCount,
  onOpenCartDrawer,
  onOpenAccountModal,
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'Leaf',
      action: () => {
        setActivePage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: 'Sparkles',
      action: () => {
        setActivePage('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'shop',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: 'ShoppingCart',
      badge: cartCount,
      action: () => {
        // Slide out cart drawer on mobile
        onOpenCartDrawer();
      },
      isActive: false, // Cart opens drawer
    },
    {
      id: 'locator',
      label: 'Stores',
      icon: 'MapPin',
      action: () => {
        setActivePage('locator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activePage === 'locator',
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      action: () => {
        onOpenAccountModal();
      },
      isActive: false,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 py-1 rounded-2xl transition-all active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                active
                  ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold'
              }`}
              aria-label={item.label}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon
                  name={item.icon}
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                  }`}
                />

                {/* Cart Badge Count */}
                {item.id === 'cart' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] leading-tight mt-0.5 tracking-tight ${
                  active ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};


// --- File: src/components/CartDrawer.js ---




const CartDrawer = ({
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


// --- File: src/components/AccountModal.js ---


const AccountModal = ({
  isOpen,
  onClose,
  currentStore,
  stores,
  onSelectStore,
  setActivePage,
  addToast,
  currentUser,
}) => {
  // Close modal on Escape key press (WCAG Keyboard Accessibility)
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

  const initials = currentUser
    ? (currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase())
    : 'GS';
  const displayName = currentUser?.name || 'Guest Shopper';
  const displayEmail = currentUser?.email || 'Sign in to save addresses & earn points';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Customer Account Profile"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/30">
                {initials}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{displayName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{displayEmail}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label="Close account modal"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* FreshRewards Loyalty Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-5 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                FreshRewards Member
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Gold Tier</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black">350 Points</span>
                <span className="block text-[11px] text-emerald-100">KSh 350 grocery discount available</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  addToast({
                    title: 'Points Ready',
                    message: 'Use promo code FRESH20 for 20% savings today!',
                    type: 'success',
                  });
                }}
                className="min-h-[44px] px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                Redeem
              </button>
            </div>
          </div>

          {/* Current Branch Selector */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Icon name="MapPin" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Preferred Branch</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  setActivePage('locator');
                }}
                className="min-h-[44px] text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center focus-visible:ring-2 focus-visible:ring-emerald-500 rounded outline-none"
              >
                Change Map
              </button>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{currentStore?.name}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{currentStore?.address} • {currentStore?.hours?.weekday}</p>
          </div>

          {/* Quick Account Navigation Links */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              My Grocery Preferences
            </h4>

            {[
              {
                label: 'Order History & Receipts',
                icon: 'Truck',
                action: () => {
                  onClose();
                  setActivePage('account');
                },
              },
              {
                label: 'Saved Delivery Addresses',
                icon: 'Navigation',
                action: () => {
                  onClose();
                  setActivePage('account');
                },
              },
              {
                label: 'Find Nearest Branch (10 Stores)',
                icon: 'MapPin',
                action: () => {
                  onClose();
                  setActivePage('locator');
                },
              },
              {
                label: 'Customer Support & FAQ',
                icon: 'Phone',
                action: () => {
                  onClose();
                  setActivePage('contact');
                },
              },
              {
                label: 'Sign In / Switch Account',
                icon: 'User',
                action: () => {
                  onClose();
                  setActivePage('login');
                },
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              >
                <div className="flex items-center gap-3">
                  <Icon name={btn.icon} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{btn.label}</span>
                </div>
                <Icon name="ChevronRight" className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors text-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};


// --- File: src/components/ProductCard.js ---



const ProductCard = ({
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


// --- File: src/components/Header.js ---




const Header = ({
  activePage,
  setActivePage,
  cartCount,
  cartTotal,
  currentStore,
  stores,
  onSelectStore,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  allProducts,
  onOpenProductDetail,
  onOpenCartDrawer,
  onOpenAccountModal,
  darkMode,
  onToggleDarkMode,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const storeDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Filter search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSearchResults(matches);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  // Close dropdowns on outside click or Escape key press (WCAG Keyboard Accessibility)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(e.target)) {
        setStoreDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStoreDropdownOpen(false);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchFocused(false);
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
      setActivePage('shop');
    }
  };

  const handleSelectSearchResult = (product) => {
    setSearchFocused(false);
    setSearchQuery('');
    onOpenProductDetail(product);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-all">
      {/* Top micro-bar: store selector & quick perks (Desktop) */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-white text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Preferred Store Selector */}
            <div className="relative" ref={storeDropdownRef}>
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors py-1 min-h-[36px] focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg px-1 outline-none"
                aria-expanded={storeDropdownOpen}
                aria-label={`Current branch: ${currentStore ? currentStore.name : 'Select Store'}. Click to change branch.`}
              >
                <Icon name="MapPin" className="w-3.5 h-3.5 text-orange-400" />
                <span>My Branch:</span>
                <span className="font-semibold text-white underline decoration-emerald-500 underline-offset-2">
                  {currentStore ? currentStore.name : 'Select Store'}
                </span>
                <Icon name="ChevronDown" className="w-3 h-3 text-emerald-300" />
              </button>

              {/* Store dropdown menu */}
              {storeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Choose Supermarket Branch
                    </span>
                    <button
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        handleNavClick('locator');
                      }}
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-semibold min-h-[44px] flex items-center"
                    >
                      View Map
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          onSelectStore(store);
                          setStoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 min-h-[48px] hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition-colors flex items-start justify-between ${
                          currentStore?.id === store.id
                            ? 'bg-emerald-50 dark:bg-slate-800/80 text-emerald-900 dark:text-emerald-300 font-semibold'
                            : ''
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{store.name}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">{store.address}</p>
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium">
                            {store.hours.weekday}
                          </span>
                        </div>
                        {currentStore?.id === store.id && (
                          <span className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                            <Icon name="Check" className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-emerald-400/40">|</span>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Icon name="Truck" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Delivery on orders over KSh 3,000</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-200">
            <span className="flex items-center gap-1 text-emerald-300">
              <Icon name="Clock" className="w-3 h-3 text-emerald-400" />
              Open Today: 7:00 AM - 10:00 PM
            </span>
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className="text-xs bg-emerald-800/80 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                title={currentUser.role === 'customer' ? 'My Account' : 'Management Portal'}
              >
                <Icon name="User" className="w-3.5 h-3.5 text-emerald-300" />
                <span>Hi, {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs bg-emerald-800/80 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                title="Sign in to your account"
              >
                <Icon name="User" className="w-3.5 h-3.5 text-emerald-300" />
                <span>Sign In</span>
              </button>
            )}
            <a
              href="tel:+254202003310"
              className="hover:text-white transition-colors min-h-[36px] flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 outline-none text-xs font-semibold"
            >
              <Icon name="Phone" className="w-3.5 h-3.5 text-emerald-400" />
              <span>+254 20 2003310</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Logo with 44px+ touch target */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group min-h-[44px] focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl outline-none"
            aria-label="Cylet Supermarket Home"
          >
            <img
              src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
              alt="Cylet Supermarket Logo"
              className="h-10 sm:h-12 w-auto max-w-[130px] sm:max-w-[160px] object-cover rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Cylet
                </span>
                <span className="bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Supermarket
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium -mt-0.5 tracking-wide hidden sm:block">
                Embu - Siakago Rd (near Kubukubu Rd.)
              </p>
            </div>
          </button>

          {/* Desktop Prominent Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block" ref={searchContainerRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Icon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search organic produce, wild salmon, artisan bread, milk..."
                className="w-full min-h-[46px] pl-11 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-full text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                aria-label="Search grocery products"
              />
              <button
                onClick={() => {
                  setSearchFocused(false);
                  if (onSearchSubmit) onSearchSubmit(searchQuery);
                  setActivePage('shop');
                }}
                className="absolute inset-y-1 right-1 px-4 min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm"
                aria-label="Submit search"
              >
                Search
              </button>

              {/* Desktop Autocomplete Results */}
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Products matching "{searchQuery}"</span>
                    <span>Press Enter to view all</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-4 py-3 min-h-[48px] text-left hover:bg-emerald-50/60 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{item.category}</span>
                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">{item.brand}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{formatKES(item.price)}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">{item.unit}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSearchFocused(false);
                      setActivePage('shop');
                    }}
                    className="w-full min-h-[44px] text-center py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-800/60 hover:bg-emerald-100/70 dark:hover:bg-slate-800 transition-colors"
                  >
                    View all matching results in Shop →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons: Dark Mode Toggle, Store Locator & Slide-Out Cart Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dark Mode Toggle Button (WCAG AA Accessible) */}
            <button
              onClick={onToggleDarkMode}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon
                name={darkMode ? 'Sun' : 'Moon'}
                className="w-5 h-5 text-amber-500 dark:text-amber-400"
              />
            </button>

            {/* Store Locator Link (Desktop) */}
            <button
              onClick={() => handleNavClick('locator')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                activePage === 'locator'
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon name="MapPin" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>10 Branches</span>
            </button>

            {/* User Account / Sign In button */}
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                  activePage === 'account'
                    ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={currentUser.role === 'customer' ? 'My Account' : 'Management Portal'}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {currentUser.avatar || 'U'}
                </div>
                <span className="hidden lg:inline">{currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                  activePage === 'login'
                    ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title="Sign in to your account"
              >
                <Icon name="User" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger: Opens CartDrawer */}
            <button
              onClick={onOpenCartDrawer}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow-md shadow-emerald-600/20 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label={`Open shopping cart drawer with ${cartCount} items`}
            >
              <div className="relative flex items-center justify-center">
                <Icon name="ShoppingCart" className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-orange-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <span className="text-[10px] block opacity-80 uppercase tracking-wider font-semibold">
                  Basket
                </span>
                <span className="text-xs font-bold">{formatKES(cartTotal)}</span>
              </div>
            </button>

            {/* Mobile Menu Button with 44px+ hit area */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] p-2.5 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PROMINENT MOBILE SEARCH BAR IN HEADER */}
        <div className="md:hidden pb-3" ref={mobileSearchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search 38+ fresh groceries, produce, meat..."
              className="w-full min-h-[46px] pl-11 pr-20 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 focus:bg-white dark:focus:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
              aria-label="Search products on mobile"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-1 right-12 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                aria-label="Clear search input"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={() => {
                setSearchFocused(false);
                if (onSearchSubmit) onSearchSubmit(searchQuery);
                setActivePage('shop');
              }}
              className="absolute inset-y-1 right-1 px-3 min-h-[38px] bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center"
              aria-label="Run search"
            >
              Go
            </button>

            {/* Mobile Autocomplete Results Flyout */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Matches for "{searchQuery}"</span>
                  <span>Tap to view</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full px-3 py-2.5 min-h-[48px] text-left hover:bg-emerald-50/60 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{item.category} • {item.brand}</p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{formatKES(item.price)}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSearchFocused(false);
                    setActivePage('shop');
                  }}
                  className="w-full min-h-[44px] text-center py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-slate-800"
                >
                  View all in Shop →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-2.5 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="flex items-center gap-7 font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'home'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'shop'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => {
                setActivePage('shop');
              }}
              className="min-h-[44px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none"
            >
              <Icon name="Tag" className="w-3.5 h-3.5" />
              Weekly Deals & Specials
            </button>
            <button
              onClick={() => handleNavClick('locator')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'locator'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Store Locator
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'about'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              About Cylet
            </button>
            <button
              onClick={() => handleNavClick('careers')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'careers'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Careers
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`min-h-[44px] flex items-center transition-colors py-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 outline-none ${
                activePage === 'contact'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 -mb-[1px]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>All 11 Branches Open Now</span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu (When hamburger tapped) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile store selection banner */}
          <div className="p-3 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">Active Supermarket Branch</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">{currentStore?.name}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('locator')}
              className="min-h-[44px] px-3 text-xs bg-emerald-600 text-white rounded-xl font-bold flex items-center"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'home' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'shop' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              Shop All Groceries
            </button>
            <button
              onClick={() => handleNavClick('locator')}
              className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center ${
                activePage === 'locator' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              10 Store Branches
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCartDrawer();
              }}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span>My Cart</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('careers')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center"
            >
              Careers
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 col-span-2 flex items-center"
            >
              Customer Support & Contact
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNavClick('account');
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold col-span-2 flex items-center justify-between border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" className="w-4 h-4 text-emerald-600" />
                  <span>My Account ({currentUser.name})</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
                  {currentUser.role}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="min-h-[44px] px-3.5 py-2.5 text-left rounded-xl bg-emerald-600 text-white font-bold col-span-2 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" className="w-4 h-4 text-white" />
                  <span>Sign In to Your Account</span>
                </div>
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


// --- File: src/components/Footer.js ---


const Footer = ({ setActivePage, addToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    setSubscribed(true);
    addToast({
      title: 'Welcome to the Cylet Club!',
      message: 'Check your inbox for a 20% discount code (FRESH20).',
      type: 'success'
    });
  };

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Promo Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block bg-amber-400 text-slate-900 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-3">
                Join 50,000+ Fresh Shoppers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get KSh 300 Off Your First Groceries Order
              </h3>
              <p className="text-emerald-100 text-sm mt-2">
                Receive weekly seasonal recipes, branch-exclusive flash deals, and farm-fresh harvest alerts directly to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
              {subscribed ? (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/30 flex items-center justify-center gap-2">
                  <Icon name="Check" className="w-5 h-5 text-emerald-300" />
                  <span className="font-semibold text-sm">You're subscribed! Use promo code FRESH20</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    aria-label="Email address for grocery newsletter"
                    required
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 shrink-0"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
                alt="Cylet Supermarket Logo"
                className="h-10 w-auto max-w-[130px] object-cover rounded-lg border border-slate-700 shadow-sm"
              />
              <span className="text-2xl font-black text-white">
                Cylet <span className="text-emerald-400 text-lg font-bold">Supermarket</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your premier community supermarket on Siakago Road (near Kubukubu Rd.) in Embu, Kenya. Delivering 100% pasture-raised meats, organic farm produce, freshly baked artisan breads, and everyday household essentials.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-300 pt-2">
              <a href="tel:+254202003310" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="Phone" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+254 20 2003310</span>
              </a>
              <a href="mailto:cyletsupermarkets@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="Mail" className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>cyletsupermarkets@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Icon name="MapPin" className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Embu - Siakago Road (near Kubukubu Rd.), Embu, Kenya</span>
            </div>
          </div>

          {/* Supermarket Aisles */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop Aisles</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Organic Produce</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Meat & Wild Seafood</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Dairy & Farm Eggs</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Artisan Hearth Bakery</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Beverages & Juices</button></li>
              <li><button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">Eco Household & Cleaning</button></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company & Stores</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('locator')} className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">10 Branch Locations</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors">About Cylet</button></li>
              <li><button onClick={() => navigate('careers')} className="hover:text-emerald-400 transition-colors">Careers & Hiring</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-emerald-400 transition-colors">Help & FAQ Center</button></li>
              <li><button onClick={() => navigate('cart')} className="hover:text-emerald-400 transition-colors">My Cart</button></li>
              <li><button onClick={() => navigate('login')} className="hover:text-emerald-400 transition-colors">Sign In / My Account</button></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Accepted Payments</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Fast, secure digital checkout. Pay online or upon delivery:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Icon name="CreditCard" className="w-3.5 h-3.5 text-blue-400" />
                <span>Credit Card</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Icon name="Smartphone" className="w-3.5 h-3.5 text-green-400" />
                <span>M-Pesa Pay</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-1.5 col-span-2">
                <Icon name="DollarSign" className="w-3.5 h-3.5 text-amber-400" />
                <span>Cash on Delivery / Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Cylet Supermarkets Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Food Safety Standards</span>
            <span className="text-emerald-400 font-medium">100% Quality Inspected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


// --- File: src/pages/HomePage.js ---






const HomePage = ({
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


// --- File: src/pages/ShopPage.js ---





const ShopPage = ({
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


// --- File: src/pages/ProductDetailPage.js ---




const ProductDetailPage = ({
  product,
  allProducts,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onBackToShop,
  onOpenDetail,
  currentStore,
  onToggleFavorite,
  favorites,
  addToast,
}) => {
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">No product selected.</p>
        <button
          onClick={onBackToShop}
          className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountAmount = hasDiscount ? product.originalPrice - product.price : 0;

  // Find related products in the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    addToast({
      title: 'Added to Basket',
      message: `${quantity}x ${product.name} added to your cart.`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-6 font-medium">
        <button onClick={onBackToShop} className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Supermarket
        </button>
        <Icon name="ChevronRight" className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="capitalize hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer">{product.category}</span>
        <Icon name="ChevronRight" className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                isFavorite ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
              }`}
              aria-label="Add to favorites"
            >
              <Icon name="Heart" className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap items-center gap-2">
            {product.tags &&
              product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50"
                >
                  ✓ {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Category */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                {product.brand}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold">
                {product.category} Department
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Subtitle / Unit */}
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{product.unit}</p>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center text-amber-500 dark:text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    className="w-4 h-4"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{formatKES(product.price)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                      {formatKES(product.originalPrice)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                    You save {formatKES(discountAmount)} on this fresh grocery special!
                  </p>
                )}
              </div>

              {/* Branch stock status badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                  In Stock & Ready
                </span>
                <span className="block text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  At {currentStore ? currentStore.name : 'All Branches'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Basket Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Icon name="Minus" className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-base text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Icon name="Plus" className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingCart" className="w-5 h-5" />
                  <span>Add to Cart • {formatKES(product.price * quantity)}</span>
                </button>
              </div>

              {currentQuantityInCart > 0 && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold text-center">
                  ✓ You already have {currentQuantityInCart} in your shopping cart.
                </p>
              )}
            </div>

            {/* Branch Pickup Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-3 text-xs text-emerald-950 dark:text-emerald-200">
              <Icon name="MapPin" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Cylet Curbside Pickup & 2-Hour Express Delivery</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  Order now to pick up at <strong className="text-emerald-800 dark:text-emerald-300">{currentStore?.name}</strong> or choose home delivery slot at checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Freshness Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Truck" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cold-chain delivery packed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Nutrition, Storage) */}
      <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
        <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6 text-sm font-bold">
          <button
            onClick={() => setSelectedTab('description')}
            className={`pb-3 transition-colors ${
              selectedTab === 'description'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setSelectedTab('nutrition')}
            className={`pb-3 transition-colors ${
              selectedTab === 'nutrition'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Nutrition & Origin
          </button>
          <button
            onClick={() => setSelectedTab('storage')}
            className={`pb-3 transition-colors ${
              selectedTab === 'storage'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Storage & Handling
          </button>
        </div>

        <div className="pt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {selectedTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-base font-medium text-slate-800 dark:text-slate-100">{product.description}</p>
              <p>
                At Cylet, every item in our {product.category} aisle meets strict quality control standards. We partner directly with verified regional growers and suppliers to ensure minimal days from harvest to your kitchen.
              </p>
            </div>
          )}

          {selectedTab === 'nutrition' && (
            <div className="max-w-xl">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3">Nutritional Profile & Sourcing</h4>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 divide-y divide-slate-200/80 dark:divide-slate-700">
                {product.nutrition &&
                  Object.entries(product.nutrition).map(([key, val]) => (
                    <div key={key} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-600 dark:text-slate-400 capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{String(val)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedTab === 'storage' && (
            <div className="space-y-3 max-w-2xl">
              <h4 className="font-bold text-slate-900 dark:text-white">Recommended Storage Instructions</h4>
              <p className="text-sm bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 font-medium">
                {product.storageTips || 'Store in a cool dry pantry or refrigerator.'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To maximize freshness, wash produce immediately prior to consumption rather than ahead of time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">More From the {product.category} Aisle</h2>
            <button
              onClick={onBackToShop}
              className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              View All In Shop →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((relProd) => {
              const relCartItem = cart.find((item) => item.product.id === relProd.id);
              return (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  cartItem={relCartItem}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onOpenDetail={onOpenDetail}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(relProd.id)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};


// --- File: src/pages/CartPage.js ---




const CartPage = ({
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


// --- File: src/pages/CheckoutPage.js ---



const CheckoutPage = ({
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


// --- File: src/pages/StoreLocatorPage.js ---


const StoreLocatorPage = ({
  stores,
  currentStore,
  onSelectStore,
  setActivePage,
  addToast,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState(currentStore ? currentStore.id : stores[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [filterFeature, setFilterFeature] = useState('all');
  const [leafletReady, setLeafletReady] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const selectedBranch = stores.find((s) => s.id === selectedBranchId) || stores[0];

  // Extract unique cities from stores
  const uniqueCities = ['all', ...Array.from(new Set(stores.map((s) => s.city)))];

  // Filter stores based on search, city, and feature
  const filteredStores = stores.filter((st) => {
    // City filter
    if (selectedCity !== 'all' && st.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        st.name.toLowerCase().includes(q) ||
        st.address.toLowerCase().includes(q) ||
        st.city.toLowerCase().includes(q) ||
        st.postalCode.includes(q);
      if (!match) return false;
    }

    // Amenity filter
    if (filterFeature !== 'all') {
      if (!st.features.some((f) => f.toLowerCase().includes(filterFeature.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });

  // Check if Leaflet is loaded in the window
  useEffect(() => {
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && window.L) {
        setLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };
    checkLeaflet();
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;
    const L = window.L;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([-0.5342, 37.4560], 13);

      // Add modern, high-contrast OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    const bounds = L.latLngBounds();

    // Add markers for filtered stores
    filteredStores.forEach((store) => {
      const isSelected = store.id === selectedBranchId;
      const lat = store.coordinates?.lat || -0.5342;
      const lng = store.coordinates?.lng || 37.4560;

      // Custom HTML Pin using L.divIcon
      const pinColorClass = isSelected
        ? 'bg-orange-500 ring-4 ring-orange-300 shadow-orange-500/50 scale-125 z-50'
        : 'bg-emerald-600 ring-2 ring-white shadow-emerald-900/40 hover:scale-115';

      const customIcon = L.divIcon({
        className: 'cylet-custom-pin',
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="
              width: 34px;
              height: 34px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: ${isSelected ? '#f97316' : '#059669'};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border: 2px solid #ffffff;
              transition: transform 0.2s ease;
            ">
              <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: #ffffff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Google Maps URL for direct directions
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        store.name + ', ' + store.address + ', ' + store.city
      )}`;

      // Rich HTML Popup on Click
      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; min-width: 230px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #059669; letter-spacing: 0.05em;">
              ${store.code} ${store.isFlagship ? '• Flagship' : ''}
            </span>
            <span style="font-size: 10px; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 9999px; font-weight: 700;">
              ${store.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          </div>

          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.25;">
            ${store.name}
          </h4>

          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
            📍 ${store.address}, ${store.city}
          </p>

          <div style="background: #f8fafc; border-radius: 8px; padding: 6px 8px; margin-bottom: 10px; font-size: 10px; color: #334155; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">🕒 Operating Hours:</div>
            <div>Weekdays: <strong>${store.hours.weekday}</strong></div>
            <div>Weekends: <strong>${store.hours.weekend}</strong></div>
            <div style="margin-top: 2px; color: #64748b;">📞 ${store.phone}</div>
          </div>

          <div style="display: flex; gap: 6px;">
            <a
              href="${googleMapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                background: #059669;
                color: #ffffff;
                text-decoration: none;
                font-size: 11px;
                font-weight: 700;
                padding: 7px 10px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(5,150,105,0.25);
              "
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'cylet-map-popup',
      });

      // Tooltip on Hover showing name, address, and hours
      const tooltipHtml = `
        <div style="font-family: inherit; font-size: 11px; line-height: 1.3;">
          <strong style="color: #065f46; font-size: 12px; display: block;">${store.name}</strong>
          <span style="color: #475569;">${store.address}</span><br/>
          <span style="color: #059669; font-weight: 600;">🕒 ${store.hours.weekday}</span>
        </div>
      `;

      marker.bindTooltip(tooltipHtml, {
        direction: 'top',
        offset: [0, -34],
        opacity: 0.95,
      });

      // Marker click handler
      marker.on('click', () => {
        setSelectedBranchId(store.id);
      });

      markersRef.current[store.id] = marker;
      bounds.extend([lat, lng]);

      // If this store is selected, open its popup
      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }
    });

    // Fit map bounds to show all filtered branches if multiple
    if (filteredStores.length > 1 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else if (filteredStores.length === 1) {
      const single = filteredStores[0];
      map.setView([single.coordinates.lat, single.coordinates.lng], 14);
    }
  }, [leafletReady, filteredStores, selectedBranchId]);

  // Handle clicking a store card in the sidebar list
  const handleSelectStoreCard = (store) => {
    setSelectedBranchId(store.id);

    if (mapInstanceRef.current && store.coordinates) {
      mapInstanceRef.current.flyTo(
        [store.coordinates.lat, store.coordinates.lng],
        14,
        { duration: 1.2 }
      );

      const targetMarker = markersRef.current[store.id];
      if (targetMarker) {
        setTimeout(() => {
          targetMarker.openPopup();
        }, 1250);
      }
    }
  };

  const handleSetPreferred = (store) => {
    onSelectStore(store);
    addToast({
      title: 'Preferred Store Updated',
      message: `${store.name} is now set as your active supermarket branch.`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Page Title & Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Icon name="MapPin" className="w-4 h-4 text-orange-400" />
            <span>Interactive Store Locator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            Find Your Nearest Cylet Supermarket
          </h1>
          <p className="text-sm text-emerald-100 mt-2 max-w-xl">
            Explore all {stores.length} full-service supermarket branches on the interactive Leaflet map. Click any pin to view address, hours, and open one-click Google Maps directions.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <div className="text-center">
            <span className="text-2xl font-black text-amber-300">{stores.length}</span>
            <span className="block text-[11px] text-emerald-200 uppercase font-semibold">Active Branches</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <span className="text-2xl font-black text-white">{filteredStores.length}</span>
            <span className="block text-[11px] text-emerald-200 uppercase font-semibold">In View</span>
          </div>
        </div>
      </div>

      {/* Search & City Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Text Search Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon name="Search" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by branch name, address, or street..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear branch search"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search-by-City Dropdown Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <label htmlFor="cityFilter" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
              City / Area:
            </label>
            <select
              id="cityFilter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Cities ({stores.length} Branches)</option>
              {uniqueCities
                .filter((c) => c !== 'all')
                .map((city) => {
                  const count = stores.filter((s) => s.city.toLowerCase() === city.toLowerCase()).length;
                  return (
                    <option key={city} value={city}>
                      {city} ({count} {count === 1 ? 'branch' : 'branches'})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Amenity Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <label htmlFor="featureFilter" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
              Feature:
            </label>
            <select
              id="featureFilter"
              value={filterFeature}
              onChange={(e) => setFilterFeature(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Amenities</option>
              <option value="bakery">In-Store Bakery</option>
              <option value="curbside">Curbside Pickup</option>
              <option value="ev charging">EV Charging</option>
              <option value="butcher">Fresh Butcher Counter</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>
        </div>

        {/* Quick City Pills for fast navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">Popular Cities:</span>
          {uniqueCities.slice(0, 7).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCity.toLowerCase() === city.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {city === 'all' ? 'All Cities' : city}
            </button>
          ))}
          {(selectedCity !== 'all' || searchTerm || filterFeature !== 'all') && (
            <button
              onClick={() => {
                setSelectedCity('all');
                setSearchTerm('');
                setFilterFeature('all');
              }}
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold ml-auto whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Branch List & Interactive Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Branch Cards List */}
        <div className="lg:col-span-5 space-y-4 max-h-[720px] overflow-y-auto pr-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
            <span>Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStores.length}</strong> branches</span>
            <span>Click any card to center map</span>
          </div>

          {filteredStores.map((store) => {
            const isSelected = store.id === selectedBranchId;
            const isPreferred = currentStore?.id === store.id;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              store.name + ', ' + store.address + ', ' + store.city
            )}`;

            return (
              <div
                key={store.id}
                onClick={() => handleSelectStoreCard(store)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectStoreCard(store);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select branch ${store.name}`}
                className={`p-5 rounded-3xl border text-left cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20 shadow-lg'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {store.name}
                      </h3>
                      {store.isFlagship && (
                        <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                          Flagship
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{store.distance}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{store.city}</span>
                    </div>
                  </div>

                  {isPreferred && (
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      My Store ★
                    </span>
                  )}
                </div>

                {/* Address & Hours */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                  📍 {store.address}, {store.city} {store.postalCode}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <Icon name="Clock" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Mon - Fri: {store.hours.weekday}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                    Sat - Sun: {store.hours.weekend}
                  </div>
                </div>

                {/* Features chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {store.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-200/50 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                  {store.features.length > 3 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1 py-0.5">
                      +{store.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Card Actions: Get Directions + Set As My Store */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                  >
                    <Icon name="Navigation" className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPreferred(store);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isPreferred
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isPreferred ? 'Active Branch' : 'Set as My Store'}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStores.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No branches found in "{selectedCity !== 'all' ? selectedCity : searchTerm}"</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try switching the city dropdown to "All Cities" or clearing your search keywords.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('all');
                  setFilterFeature('all');
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Leaflet Interactive Map Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">
                  Live Interactive Map
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {selectedCity === 'all' ? 'All Metropolitan Branches' : `${selectedCity} Supermarket Branches`}
                </h3>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                💡 Hover or click pin for hours & directions
              </div>
            </div>

            {/* Leaflet Map DOM Element */}
            <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner z-0">
              <div
                ref={mapContainerRef}
                className="w-full h-full"
                style={{ background: '#e2e8f0' }}
              />

              {!leafletReady && (
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Initializing Leaflet Branch Map...</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connecting to OpenStreetMap geospatial tiles</p>
                </div>
              )}
            </div>

            {/* Active Branch Quick Spotlight Bar Below Map */}
            {selectedBranch && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Selected Branch
                    </span>
                    <h4 className="font-bold text-base text-white">{selectedBranch.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {selectedBranch.address}, {selectedBranch.city} • Open {selectedBranch.hours.weekday}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      selectedBranch.name + ', ' + selectedBranch.address + ', ' + selectedBranch.city
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Icon name="Navigation" className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <button
                    onClick={() => handleSetPreferred(selectedBranch)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                  >
                    Shop Here
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- File: src/pages/SimplePages.js ---


// ==================== ABOUT PAGE ====================
const AboutPage = ({ setActivePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-amber-400 text-slate-900 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Our Story & Values
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Nourishing Communities with Farm-Fresh Food Since 2012
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
            Cylet started as a modest neighborhood grocer. Today, we're proud to operate our premier supermarket located on Siakago Road (near Kubukubu Rd.) in Embu, Kenya, partnering with local regional farmers to bring wholesome, fresh groceries to your family's table.
          </p>
        </div>
      </div>

      {/* Key Milestones / Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Supermarket Branches', value: '10', sub: 'Embu & Mt. Kenya region' },
          { label: 'Local Farm Partners', value: '120+', sub: 'Fresh & family-owned' },
          { label: 'Weekly Fresh Deliveries', value: '50,000+', sub: 'To local families' },
          { label: 'Freshness Satisfaction', value: '99.8%', sub: 'Guaranteed or refunded' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400">{stat.value}</span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{stat.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">What Drives Us</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">The Cylet Promise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Icon name="Sprout" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Direct From Soil to Shelf</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We cut out unnecessary wholesalers and distributors. Produce harvested in the dawn hours reaches our 11 branch shelves and your doorstep within 24 to 36 hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <Icon name="ShieldCheck" className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">100% Quality Guarantee</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every single avocado, steak, and bunch of spinach is individually checked by trained in-store specialists. If you aren't completely delighted, we replace it instantly.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <Icon name="Heart" className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Community & Sustainability</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We donate 100% of unsold day-end bread and produce to neighborhood food banks, utilize 100% recyclable cold packaging, and support clean EV delivery fleets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CAREERS PAGE ====================
const CareersPage = ({ addToast }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const OPEN_ROLES = [
    {
      id: 'job-1',
      title: 'Senior Produce Specialist & Buyer',
      branch: 'Central Supply Hub & Downtown Flagship',
      type: 'Full-Time',
      salary: 'KSh 85,000 - KSh 120,000 / mo',
      description: 'Liaise with local organic farms, evaluate seasonal fruit/vegetable harvests, and lead quality inspections.',
    },
    {
      id: 'job-2',
      title: 'Artisan Head Baker',
      branch: 'Cylet Supermarket - Embu Main Branch',
      type: 'Full-Time',
      salary: 'KSh 45,000 - KSh 65,000 / mo',
      description: 'Hand-shape sourdough boules, bake butter croissants, and oversee 5 AM morning oven bakes.',
    },
    {
      id: 'job-3',
      title: 'E-Commerce Personal Shopper',
      branch: 'Cylet Express - Kubukubu Road Junction',
      type: 'Part-Time / Full-Time',
      salary: 'KSh 30,000 - KSh 40,000 / mo',
      description: 'Carefully select top-quality produce and groceries for online delivery orders and stage curbside pickups.',
    },
    {
      id: 'job-4',
      title: 'Master Meat Butcher',
      branch: 'Cylet Supermarket - Embu Main Branch',
      type: 'Full-Time',
      salary: 'KSh 50,000 - KSh 70,000 / mo',
      description: 'Custom cut grass-fed Angus steaks, prepare specialty roasts, and maintain immaculate cold storage cases.',
    },
    {
      id: 'job-5',
      title: 'Customer Experience & Cashier Lead',
      branch: 'Cylet Supermarket - Kangaru Branch',
      type: 'Full-Time',
      salary: 'KSh 35,000 - KSh 45,000 / mo',
      description: 'Welcome supermarket guests, coordinate front-end checkout lanes, and assist with store inquiries.',
    },
  ];

  const handleApply = (e) => {
    e.preventDefault();
    addToast({
      title: 'Application Submitted!',
      message: `Thank you, ${applicantName}. Our hiring team will contact you regarding the ${selectedRole.title} position.`,
      type: 'success',
    });
    setSelectedRole(null);
    setApplicantName('');
    setApplicantEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Careers Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Build a Wholesome Career in Grocery & Food
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            We offer competitive compensation, comprehensive health benefits, generous 20% in-store grocery discounts, and real career advancement across our 11 locations.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-3xl font-black text-amber-300">5 New Roles</span>
          <p className="text-xs text-slate-300 mt-1">Hiring immediately for Fall</p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: '20% Grocery Discount', desc: 'Save on your household grocery bills at Cylet.' },
          { title: 'Health & Dental Care', desc: 'Comprehensive medical insurance for full-time associates.' },
          { title: 'Flexible Scheduling', desc: 'Morning, afternoon, and weekend shifts to fit your life.' },
          { title: 'Paid Training & Growth', desc: 'Apprenticeship paths for butchery, bakery, and management.' },
        ].map((benefit, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              ★
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{benefit.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Roles List */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Current Open Opportunities</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Click any position to review details and apply</p>
        </div>

        <div className="space-y-3">
          {OPEN_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{role.title}</h3>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {role.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{role.salary}</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{role.branch}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">{role.description}</p>
              </div>

              <button
                onClick={() => setSelectedRole(role)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors self-start md:self-auto shrink-0 shadow-sm"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Job Application Form"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedRole(null)}
              className="absolute top-5 right-5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              aria-label="Close application modal"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Application Form
              </span>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white leading-tight">
                {selectedRole.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{selectedRole.branch}</p>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. David Kamau"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Years of Grocery Experience</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer">
                  <option>Entry-level / No prior grocery experience</option>
                  <option>1 - 2 years in retail / food</option>
                  <option>3 - 5 years experienced</option>
                  <option>5+ years senior</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== CONTACT PAGE ====================
const ContactPage = ({ addToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Order Status & Delivery',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const FAQS = [
    {
      q: 'How does curbside pickup work at the 11 branches?',
      a: 'Choose "Branch Curbside Pickup" during checkout and select your local branch. When you arrive at our designated curbside bays, notify us or park in spots #1-#6. A team member will load your groceries into your vehicle within 5 minutes.',
    },
    {
      q: 'What is the cutoff time for same-day delivery?',
      a: 'Orders placed before 6:00 PM are delivered same-day in your chosen 2-hour delivery window. Any order placed after 6:00 PM can be scheduled for morning delivery starting at 8:00 AM tomorrow.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all major Visa and MasterCard credit/debit cards, M-Pesa mobile money (instant STK push prompt), and Cash/Card on Delivery at your doorstep.',
    },
    {
      q: 'What is your freshness refund policy?',
      a: 'If any produce, meat, or bakery item arrives less than 100% fresh, simply tap "Need Help" or email us within 7 days for an unconditional instant replacement or refund.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      title: 'Message Sent!',
      message: 'Our customer support team will reply to your email within 2 hours.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Contact Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
            24/7 Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            We're Always Here to Help
          </h1>
          <p className="text-emerald-100 text-sm mt-2 max-w-lg">
            Have a question about an order, feedback on a branch visit, or need assistance? Reach out anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Customer Telephone Desk</span>
            <a href="tel:+254202003310" className="text-base font-bold text-white hover:text-emerald-300 transition-colors">+254 20 2003310</a>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Customer Email Support</span>
            <a href="mailto:cyletsupermarkets@gmail.com" className="text-sm font-bold text-white hover:text-emerald-300 transition-colors">cyletsupermarkets@gmail.com</a>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Store Location</span>
            <span className="text-xs font-bold text-white">Siakago Rd (near Kubukubu Rd.), Embu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Send an Inquiry</h2>

          {submitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Icon name="Check" className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200">Inquiry Received</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Thank you for contacting Cylet Supermarket. A customer care coordinator has been assigned to your ticket and will email you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inquiry Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option>Order Status & Delivery</option>
                  <option>Branch Feedback & Suggestion</option>
                  <option>Missing or Damaged Item</option>
                  <option>Local Farm / Supplier Partnership</option>
                  <option>General Customer Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white gap-3"
                  >
                    <span>{faq.q}</span>
                    <Icon
                      name={isOpen ? 'Minus' : 'Plus'}
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- File: src/pages/LoginPage.js ---



/**
 * Universal Login Page (/login)
 * Supports authentication for Customers, Store Managers, and Super Administrators,
 * as well as instant new customer registration.
 */
const LoginPage = ({
  onLoginSuccess,
  onNavigate,
  initialError = '',
  darkMode,
  onToggleDarkMode,
  addToast,
  users,
  onRegisterUser,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (isSignUp) {
        // Handle new customer account registration
        const pool = (Array.isArray(users) && users.length > 0) ? users : getStoredUsers();
        const normalizedEmail = email.trim().toLowerCase();
        const alreadyExists = pool.some(
          (u) => u.email?.toLowerCase().trim() === normalizedEmail
        );

        if (alreadyExists) {
          setError('An account with this email address already exists. Please sign in instead.');
          return;
        }

        const newUser = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password: password.trim(),
          role: 'customer',
          title: 'Customer Shopper',
          avatar: name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'CS',
          badgeColor: 'amber',
          status: 'Active',
          branch: 'Siakago Road (near Kubukubu Rd.) - Embu, Kenya',
          lastLogin: 'Just now',
          loyaltyPoints: 150,
          savedAddresses: [
            {
              id: `addr-${Date.now()}`,
              title: 'Default Address',
              address: 'Embu - Siakago Road',
              city: 'Embu',
              phone: '+254 700 000 000',
              isDefault: true,
            },
          ],
          orderHistory: [],
        };

        try {
          const current = getStoredUsers();
          localStorage.setItem('cylet_users_db', JSON.stringify([...current, newUser]));
        } catch (err) {
          console.error(err);
        }

        if (onRegisterUser) {
          onRegisterUser(newUser);
        }

        if (addToast) {
          addToast({
            title: 'Account Created',
            message: `Welcome to Cylet, ${newUser.name}!`,
            type: 'success',
          });
        }
        onLoginSuccess(newUser);
      } else {
        // Handle login verification against mock and dynamically stored users
        const user = authenticateMockUser(email, password, users);
        if (user) {
          if (addToast) {
            addToast({
              title: 'Welcome Back!',
              message: `Signed in as ${user.name} (${user.role.toUpperCase()})`,
              type: 'success',
            });
          }
          onLoginSuccess(user);
        } else {
          setError('Failed to Login: Invalid email or password.');
        }
      }
    }, 250);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Banner Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src="https://pbs.twimg.com/profile_banners/834417350321512449/1487776302/1500x500"
              alt="Cylet Supermarket"
              className="h-12 w-auto max-w-[220px] object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Create Your Cylet Account' : 'Sign In to Cylet'}
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            {isSignUp
              ? 'Join thousands of fresh grocery shoppers in Embu, Kenya'
              : 'Access your orders, saved addresses, or management console'}
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-in fade-in duration-200">
              <Icon name="AlertTriangle" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <Icon name="User" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Peter Kariuki"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Icon name="Mail" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cylet.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password *
                </label>
              </div>
              <div className="relative">
                <Icon name="ShieldCheck" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (addToast) {
                      addToast({
                        title: 'Password Assistance',
                        message: 'Please contact support at cyletsupermarkets@gmail.com to reset your password.',
                        type: 'info',
                      });
                    }
                  }}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <Icon name="ArrowRight" className="w-4 h-4" />
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Create Account */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-block ml-1"
              >
                {isSignUp ? 'Sign In' : 'Create an Account'}
              </button>
            </p>
          </div>

          {/* Back to store navigation */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Icon name="ArrowRight" className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Storefront Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- File: src/pages/AccountPage.js ---



/**
 * Customer Account Page (/account)
 * Displays customer order history, saved delivery addresses, and personal loyalty profile.
 */
const AccountPage = ({
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


// --- File: src/pages/AdminPage.js ---




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

const AdminPage = ({
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



// --- File: src/App.js ---























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
  address: 'Embu - Siakago Road (near Kubukubu Rd.) in Embu, Kenya',
  deliveryFee: 250.0,
  freeDeliveryThreshold: 3000.0,
  curbsideFee: 0.0,
  paymentMethods: {
    card: true,
    mpesa: true,
    cod: true,
  },
};

const App = () => {
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
            'Cylet is your trusted community grocer located on Siakago Road (near Kubukubu Rd.) in Embu, Kenya.',
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


// Mount to DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
