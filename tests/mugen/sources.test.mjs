import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';
import { documents, pathFromRoot, readJSON } from '../../scripts/mugen/files.mjs';
import { findAll, attr } from '../../scripts/mugen/html.mjs';

test('new archived official source links resolve to files and anchors, including on Linux', () => {
  const cache = new Map();
  for (const { collection, path, data } of documents()) for (const quote of data.quote ?? []) {
    if (!quote.id || !quote.url.startsWith('/MUGEN/document/Official/')) continue;
    const baseline = `tests/mugen/baseline/json/${collection}/${path.split('/').at(-1)}`;
    // Historical broken links are retained and recorded separately; this check gates newly added sources.
    if (existsSync(pathFromRoot(baseline)) && readJSON(baseline).quote?.some(old => old.url === quote.url)) continue;
    const url = new URL(quote.url, 'https://bluesura.github.io');
    const local = pathFromRoot(`public${decodeURIComponent(url.pathname)}`);
    assert.ok(existsSync(local), `${path}: missing source ${quote.url}`);
    if (!url.hash) continue;
    if (!cache.has(local)) cache.set(local, parse(readFileSync(local, 'utf8')));
    const anchor = decodeURIComponent(url.hash.slice(1));
    assert.ok(findAll(cache.get(local), node => attr(node, 'id') === anchor || attr(node, 'name') === anchor).length, `${path}: missing anchor ${quote.url}`);
  }
});
