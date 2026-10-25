import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icons.js';

export const StoreLocatorPage = ({
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
