import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readJSON, fixtures, pathFromRoot } from '../../scripts/mugen/files.mjs';

function retained(before, after, path = '') {
  if (before && typeof before === 'object') {
    assert.ok(after && typeof after === 'object', `Lost object ${path}`);
    if (Array.isArray(before)) assert.ok(Array.isArray(after) && after.length >= before.length, `Lost array entries ${path}`);
    for (const [key, value] of Object.entries(before)) retained(value, after[key], `${path}/${key}`);
  } else assert.deepEqual(after, before, `Changed legacy value ${path}`);
}
test('every original field in representative documents and common parameters is retained', () => {
  for (const [collection, names] of Object.entries(fixtures)) for (const name of names) retained(
    readJSON(`tests/mugen/baseline/json/${collection}/${name}.json`),
    readJSON(`src/content/${collection}/${name}.json`), `${collection}/${name}`,
  );
  for (const name of ['IgnoreHitPause', 'Persistent']) retained(readJSON(`tests/mugen/baseline/json/common/${name}.json`), readJSON(`src/data/common/${name}.json`), name);
});

test('documents outside the representative set are unchanged, allowing Git line-ending conversion', () => {
  const selected = new Set(Object.entries(fixtures).flatMap(([collection, names]) => names.map(name => `src/content/${collection}/${name}.json`)));
  for (const entry of readJSON('tests/mugen/baseline/manifest.json').documents) {
    if (selected.has(entry.path)) continue;
    const raw = readFileSync(pathFromRoot(entry.path), 'utf8');
    const lf = raw.replaceAll('\r\n', '\n');
    const hashes = [raw, lf, lf.replaceAll('\n', '\r\n')].map(text => createHash('sha256').update(text).digest('hex'));
    assert.ok(hashes.includes(entry.sha256), `${entry.path}: capture and review a baseline before expanding migration scope`);
  }
});
