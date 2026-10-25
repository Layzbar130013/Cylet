import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// Asset compression script for Cylet Supermarket
console.log('🔄 Compressing Cylet web assets...');

// 1. Minify dist/bundle.js
const bundlePath = 'dist/bundle.js';
if (fs.existsSync(bundlePath)) {
  const originalCode = fs.readFileSync(bundlePath, 'utf8');
  const originalSize = Buffer.byteLength(originalCode, 'utf8');

  // Clean and minify whitespace, multiline comments, and redundant spaces
  let minifiedCode = originalCode
    // Remove multi-line comments (except URLs)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove single line comments that start at beginning of line
    .replace(/^\s*\/\/.*$/gm, '')
    // Collapse multiple blank lines
    .replace(/\n\s*\n/g, '\n');

  const minPath = 'dist/bundle.min.js';
  fs.writeFileSync(minPath, minifiedCode, 'utf8');
  const minSize = Buffer.byteLength(minifiedCode, 'utf8');

  // Gzip compress bundle.min.js
  const gzippedBundle = zlib.gzipSync(minifiedCode, { level: 9 });
  fs.writeFileSync('dist/bundle.min.js.gz', gzippedBundle);
  fs.writeFileSync('dist/bundle.js.gz', zlib.gzipSync(originalCode, { level: 9 }));
  const gzSize = gzippedBundle.length;

  console.log(`✓ Bundle Minified:   ${(originalSize / 1024).toFixed(1)} KB → ${(minSize / 1024).toFixed(1)} KB`);
  console.log(`✓ Bundle Gzip (gz):  ${(originalSize / 1024).toFixed(1)} KB → ${(gzSize / 1024).toFixed(1)} KB (${((1 - gzSize / originalSize) * 100).toFixed(1)}% compression ratio)`);
}

// 2. Gzip compress index.html
if (fs.existsSync('index.html')) {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  const htmlGz = zlib.gzipSync(htmlContent, { level: 9 });
  fs.writeFileSync('index.html.gz', htmlGz);
  console.log(`✓ index.html Gzip:   ${(htmlContent.length / 1024).toFixed(1)} KB → ${(htmlGz.length / 1024).toFixed(1)} KB`);
}

if (fs.existsSync('dist/index.html')) {
  const distHtml = fs.readFileSync('dist/index.html', 'utf8');
  fs.writeFileSync('dist/index.html.gz', zlib.gzipSync(distHtml, { level: 9 }));
}

// 3. Mirror Netlify & Cloudflare routing config files to dist/
if (fs.existsSync('_redirects')) {
  fs.copyFileSync('_redirects', 'dist/_redirects');
}
if (fs.existsSync('_headers')) {
  fs.copyFileSync('_headers', 'dist/_headers');
}

console.log('🎉 Asset compression complete! All production files ready in dist/');
