import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { loadPlan, hashText } from './batch.mjs';
import { pathFromRoot, readJSON, collections } from './files.mjs';
import { readArticle, compactText } from './html.mjs';
import { normalizeDocument } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const args = process.argv.slice(2);
assert.ok(args.length === 2 && args[0] === '--batch', 'Usage: npm run mugen:batch-baseline -- --batch <reviewed-batch-id>');
const plan = loadPlan(args[1]);
const base = `tests/mugen/batches/${plan.id}`;
assert.ok(!existsSync(pathFromRoot(base)), 'Batch baseline already exists; never overwrite it.');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const initial = readJSON('tests/mugen/baseline/manifest.json');
const captures = plan.documents.map(({ collection, name }) => {
  const path = `src/content/${collection}/${name}.json`;
  const raw = readFileSync(pathFromRoot(path), 'utf8');
  const source = JSON.parse(raw);
  assert.ok(!source.page.engine, `Already migrated: ${name}`);
  const originalHash = initial.documents.find(entry => entry.path === path)?.sha256;
  const lf = raw.replaceAll('\r\n', '\n');
  // Existing preservation tests gate the original corpus; this also checks before capture.
  assert.ok([raw, lf, lf.replaceAll('\n', '\r\n')].some(text => createHash('sha256').update(text).digest('hex') === originalHash), `Source differs from original corpus: ${name}`);
  const url = `/MUGEN/document/${collections[collection]}/${name}.html`;
  const article = readArticle(readFileSync(pathFromRoot(`dist${url}`), 'utf8'));
  assert.ok(article.text.includes(compactText(parseFragment(source.description))), `Stale build: ${name}`);
  const normalized = normalizeDocument(source, common);
  if (source.category === 'state') assert.deepEqual(article.code, copyLines(normalized, normalized.parameter), `Stale copy output: ${name}`);
  return { collection, name, path, url, raw, article, sha256_lf: hashText(raw) };
});
const manifest = {
  batch: plan.id, source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  captured_on: new Date().toISOString(), node: process.version,
  documents: captures.map(({ raw, article, ...entry }) => entry),
};
const write = (path, text) => { mkdirSync(dirname(pathFromRoot(path)), { recursive: true }); writeFileSync(pathFromRoot(path), text, { flag: 'wx' }); };
for (const { collection, name, raw, article } of captures) {
  write(`${base}/json/${collection}/${name}.json`, raw);
  write(`${base}/html/${collection}/${name}.html`, article.html + '\n');
  write(`${base}/rendered/${collection}/${name}.json`, JSON.stringify({ ...article, html: undefined }, null, 2) + '\n');
}
write(`${base}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Preserved ${captures.length} additional pages in ${base}.`);
