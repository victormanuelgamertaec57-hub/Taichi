/**
 * scripts/analyze-bundle.mjs
 * Reports the top contributors to the main JS bundle by parsing the
 * rollup-plugin-visualizer output (dist/stats.html JSON).
 *
 * Run after `npm run build` (which auto-generates dist/stats.html).
 */

import { readFileSync } from 'fs';

const html = readFileSync('dist/stats.html', 'utf8');
const match = html.match(/const data = (\{[\s\S]*?\});\s*const run/);
if (!match) {
  console.error('Could not find JSON data in dist/stats.html');
  process.exit(1);
}

const data = JSON.parse(match[1]);

// visualizer 7.x stores module sizes in two parallel maps:
//   data.nodeParts[partUid] = { renderedLength, gzipLength, brotliLength, metaUid }
//   data.nodeMetas[metaUid] = { id, moduleParts, imported, importedBy }
// We join them on metaUid and aggregate by package.

function pkgFromId(id) {
  if (!id) return '(app)';
  const parts = id.split('node_modules/');
  if (parts.length < 2) return '(app)';
  const after = parts[parts.length - 1];
  if (after.startsWith('@')) {
    return after.split('/').slice(0, 2).join('/');
  }
  return after.split('/')[0];
}

const sizes = new Map();
let totalBytes = 0;
let totalGzip = 0;

for (const part of Object.values(data.nodeParts)) {
  const meta = data.nodeMetas[part.metaUid];
  if (!meta) continue;
  const pkg = pkgFromId(meta.id);
  const cur = sizes.get(pkg) || { size: 0, gzip: 0, count: 0 };
  cur.size += part.renderedLength || 0;
  cur.gzip += part.gzipLength || 0;
  cur.count += 1;
  sizes.set(pkg, cur);
  totalBytes += part.renderedLength || 0;
  totalGzip += part.gzipLength || 0;
}

const sorted = [...sizes.entries()].sort((a, b) => b[1].size - a[1].size);

console.log('\n═══ BUNDLE BREAKDOWN (rendered size, all chunks) ═══\n');
console.log(
  'Package'.padEnd(34) +
  'Size'.padStart(10) +
  'Gzip'.padStart(8) +
  '  Gzip %'.padStart(7) +
  '  Modules'
);
console.log('─'.repeat(80));

for (const [pkg, s] of sorted) {
  const kb = (s.size / 1024).toFixed(1);
  const kbGz = (s.gzip / 1024).toFixed(1);
  const pctGz = ((s.gzip / totalGzip) * 100).toFixed(1);
  console.log(
    pkg.padEnd(34) +
    (kb + ' kB').padStart(10) +
    (kbGz + ' kB').padStart(8) +
    (pctGz + '%').padStart(8) +
    String(s.count).padStart(8)
  );
}

console.log('─'.repeat(80));
console.log(
  'Total'.padEnd(34) +
  ((totalBytes / 1024).toFixed(1) + ' kB').padStart(10) +
  ((totalGzip / 1024).toFixed(1) + ' kB').padStart(8)
);
console.log();
