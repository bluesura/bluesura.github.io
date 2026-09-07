import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readJSON, baselineCases, pathFromRoot } from '../../scripts/mugen/files.mjs';

function retained(before, after, path = '') {
  if (before && typeof before === 'object') {
    assert.ok(after && typeof after === 'object', `Lost object ${path}`);
    if (Array.isArray(before)) assert.ok(Array.isArray(after) && after.length >= before.length, `Lost array entries ${path}`);
    for (const [key, value] of Object.entries(before)) retained(value, after[key], `${path}/${key}`);
  } else assert.deepEqual(after, before, `Changed legacy value ${path}`);
}
test('every original field in representative documents, later batches and common parameters is retained', () => {
  for (const { collection, name, base } of baselineCases()) retained(
    readJSON(`${base}/json/${collection}/${name}.json`),
    readJSON(`src/content/${collection}/${name}.json`), `${collection}/${name}`,
  );
  for (const name of ['IgnoreHitPause', 'Persistent']) retained(readJSON(`tests/mugen/baseline/json/common/${name}.json`), readJSON(`src/data/common/${name}.json`), name);
});

test('all captured baselines and untouched documents match the original corpus, allowing Git line-ending conversion', () => {
  const selected = new Map(baselineCases().map(({ collection, name, base }) => [`src/content/${collection}/${name}.json`, `${base}/json/${collection}/${name}.json`]));
  for (const entry of readJSON('tests/mugen/baseline/manifest.json').documents) {
    const raw = readFileSync(pathFromRoot(selected.get(entry.path) ?? entry.path), 'utf8');
    const lf = raw.replaceAll('\r\n', '\n');
    const hashes = [raw, lf, lf.replaceAll('\n', '\r\n')].map(text => createHash('sha256').update(text).digest('hex'));
    assert.ok(hashes.includes(entry.sha256), `${entry.path}: modified original baseline or source outside captured migration scope`);
  }
});
