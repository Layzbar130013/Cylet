import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';
import { ProductCard } from '../components/ProductCard.js';
import { formatKES } from '../utils/currency.js';

export const ProductDetailPage = ({
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
