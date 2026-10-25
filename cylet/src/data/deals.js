// Deals, promo codes, and value propositions for Cylet Supermarket

export const PROMO_BANNERS = [
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

export const COUPONS = {
  'FRESH20': { code: 'FRESH20', type: 'percentage', value: 0.20, description: '20% discount on orders over KSh 2,500', minOrder: 2500 },
  'WELCOME10': { code: 'WELCOME10', type: 'fixed', value: 300.00, description: 'KSh 300 off your first supermarket order', minOrder: 3000 },
  'FREESHIP': { code: 'FREESHIP', type: 'shipping', value: 250.00, description: 'Free express grocery delivery', minOrder: 2000 },
};

export const VALUE_PROPOSITIONS = [
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
