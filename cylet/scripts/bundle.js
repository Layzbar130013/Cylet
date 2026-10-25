import fs from 'fs';
import path from 'path';

const filesToBundle = [
  'src/utils/currency.js',
  'src/data/users.js',
  'src/data/products.js',
  'src/data/stores.js',
  'src/data/deals.js',
  'src/data/orders.js',
  'src/components/SEO.js',
  'src/components/Icons.js',
  'src/components/Toast.js',
  'src/components/BottomNav.js',
  'src/components/CartDrawer.js',
  'src/components/AccountModal.js',
  'src/components/ProductCard.js',
  'src/components/Header.js',
  'src/components/Footer.js',
  'src/pages/HomePage.js',
  'src/pages/ShopPage.js',
  'src/pages/ProductDetailPage.js',
  'src/pages/CartPage.js',
  'src/pages/CheckoutPage.js',
  'src/pages/StoreLocatorPage.js',
  'src/pages/SimplePages.js',
  'src/pages/LoginPage.js',
  'src/pages/AccountPage.js',
  'src/pages/AdminPage.js',
  'src/App.js'
];

let bundleContent = `// Cylet Supermarket - Consolidated Application Bundle
// Generated automatically for zero-friction browser execution

const { useState, useEffect, useMemo, useRef } = React;
`;

for (const relPath of filesToBundle) {
  const filePath = path.resolve(relPath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Strip import statements
  content = content.replace(/^import\s+.*?;\s*$/gm, '');
  // Strip export statements (e.g. "export const", "export default", etc.)
  content = content.replace(/^export\s+(const|let|var|function|class)\s+/gm, '$1 ');
  content = content.replace(/^export\s+default\s+.*?;/gm, '');

  bundleContent += `\n// --- File: ${relPath} ---\n` + content + '\n';
}

bundleContent += `
// Mount to DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
`;

import { createRequire } from 'module';
const req = createRequire(import.meta.url);

// Validate bundle syntax with Acorn JSX parser if available in environment
try {
  const acorn = req('acorn');
  const jsx = req('acorn-jsx');
  const Parser = acorn.Parser.extend(jsx());
  Parser.parse(bundleContent, { ecmaVersion: 2022, sourceType: 'script' });
  console.log('✓ Acorn JSX syntax validation: PASSED (Zero syntax errors)');
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log('ℹ Acorn parser not present in environment; skipping optional AST validation.');
  } else {
    console.error('❌ Bundle syntax error detected:', err.message, 'at line', err.loc?.line);
    process.exit(1);
  }
}

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

fs.writeFileSync('dist/bundle.js', bundleContent, 'utf-8');
console.log('✓ Successfully created dist/bundle.js (' + (bundleContent.length / 1024).toFixed(1) + ' KB)');

// Create standalone dist/index.html so deployments targeting either root "." or "dist" both work flawlessly
if (fs.existsSync('index.html')) {
  let distHtml = fs.readFileSync('index.html', 'utf-8');
  distHtml = distHtml.replace('src="dist/bundle.js"', 'src="bundle.js"');
  fs.writeFileSync('dist/index.html', distHtml, 'utf-8');
  console.log('✓ Generated standalone dist/index.html for dist-targeted deployments');
}

