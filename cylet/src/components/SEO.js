// SEO & Structured Data (JSON-LD) Manager for Cylet Supermarket

export const updateSEO = ({
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
