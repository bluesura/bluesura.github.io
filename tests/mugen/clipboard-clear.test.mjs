import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument } from '../../src/lib/mugen/normalize.mjs';

const original = readJSON('tests/mugen/batches/clipboard-clear-01/json/state-controllers/ClearClipboard.json');
const current = readJSON('src/content/state-controllers/ClearClipboard.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('ClearClipboard migration retains the original document and sources', () => {
  assert.deepEqual(current, addFields(original, loadPlan('clipboard-clear-01').documents[0].additions));
  assert.deepEqual(current.quote.slice(0, original.quote.length), original.quote);
  assert.equal(current.page.introduced_in, null);
});

test('ClearClipboard publishes no invented controller parameters', () => {
  const view = normalizeDocument(current, common);
  assert.match(effectiveDescription(current), /固有の必須・任意パラメーターはありません/);
  assert.equal(current.parameter, undefined);
  assert.deepEqual(view.parameter.map(parameter => parameter.parameter), ['IgnoreHitPause', 'Persistent']);
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^Type\s*= ClearClipboard$/.test(line)));
  assert.ok(lines.every(line => !/^(?:Text|Params)\s*=/.test(line)));
});
