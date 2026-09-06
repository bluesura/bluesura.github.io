import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { documents, fixtures, collections, pathFromRoot, filesUnder } from './files.mjs';
import { readArticle } from './html.mjs';

const base = pathFromRoot('tests/mugen/baseline');
if (existsSync(base)) throw new Error('Baseline already exists. Preserve it; create a separately reviewed baseline for a new migration.');
const write = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, value); };
const sha256 = value => createHash('sha256').update(value).digest('hex');
const manifest = {
  source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  captured_on: new Date().toISOString(), node: process.version,
  astro: JSON.parse(readFileSync(pathFromRoot('node_modules/astro/package.json'), 'utf8')).version,
  documents: documents().map(({ path, url }) => ({ path, url, sha256: sha256(readFileSync(pathFromRoot(path))) })),
  routes: Object.values(collections).flatMap(route => filesUnder(`dist/MUGEN/document/${route}`, '.html').map(path => path.slice(4))),
};
// Read all output before writing, so a missing build does not create a partial baseline.
const captures = Object.entries(fixtures).flatMap(([collection, names]) => names.map(name => {
  const json = readFileSync(pathFromRoot(`src/content/${collection}/${name}.json`));
  const article = readArticle(readFileSync(pathFromRoot(`dist/MUGEN/document/${collections[collection]}/${name}.html`), 'utf8'));
  return { collection, name, json, article };
}));
for (const { collection, name, json, article } of captures) {
  write(`${base}/json/${collection}/${name}.json`, json);
  write(`${base}/html/${collection}/${name}.html`, article.html + '\n');
  write(`${base}/rendered/${collection}/${name}.json`, JSON.stringify({ ...article, html: undefined }, null, 2) + '\n');
}
for (const name of ['IgnoreHitPause', 'Persistent']) write(`${base}/json/common/${name}.json`, readFileSync(pathFromRoot(`src/data/common/${name}.json`)));
write(`${base}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Preserved ${captures.length} pages, 2 common parameters and ${manifest.routes.length} routes.`);
