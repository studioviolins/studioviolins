// Copies the approved 3D viewer from the local design preview into the site:
//   output/design/violin-3d-preview/{viewer.js, vendor/, models/violin-4-4.*, fallback/violin-4-4.webp}
//   -> public/violin-3d/
// The preview loads three.js through an import map; the site has none, so the bare 'three' imports are
// rewritten to relative paths in the copies. The preview remains the source: edit there, then run
//   node scripts/sync-violin-3d.mjs
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'output/design/violin-3d-preview');
const out = join(root, 'public/violin-3d');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, 'vendor'), join(out, 'vendor'), { recursive: true });
for (const f of ['viewer.js', 'models/violin-4-4.glb', 'models/violin-4-4.json', 'fallback/violin-4-4.webp']) {
  mkdirSync(dirname(join(out, f)), { recursive: true });
  cpSync(join(src, f), join(out, f));
}

const threeModule = join(out, 'vendor/three/three.module.js');
const rel = (from, to) => {
  const r = relative(dirname(from), to).split('\\').join('/');
  return r.startsWith('.') ? r : `./${r}`;
};
// only real import statements: `... from 'three'` / `... from 'three/addons/...'` ending in a semicolon
const IMPORT = /(\bfrom\s+)'(three(?:\/addons\/[^']+)?)'(\s*;)/g;
function rewrite(file) {
  const text = readFileSync(file, 'utf8');
  let n = 0;
  const next = text.replace(IMPORT, (m, pre, spec, post, offset) => {
    const lineStart = text.lastIndexOf('\n', offset) + 1;
    if (/^\s*(\*|\/\/)/.test(text.slice(lineStart, offset))) return m;   // inside a doc comment
    n += 1;
    const target = spec === 'three' ? threeModule : join(out, 'vendor/three', spec.slice('three/'.length));
    return `${pre}'${rel(file, target)}'${post}`;
  });
  if (n) writeFileSync(file, next);
  return n;
}
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
let total = 0;
for (const f of [join(out, 'viewer.js'), ...walk(join(out, 'vendor/three/addons'))]) {
  if (f.endsWith('.js')) total += rewrite(f);
}
console.log(`public/violin-3d: copied, ${total} three.js imports rewritten`);
