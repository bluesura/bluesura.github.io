import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const original = readJSON('tests/mugen/batches/clipboard-append-01/json/state-controllers/AppendToClipboard.json');
const current = readJSON('src/content/state-controllers/AppendToClipboard.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('AppendToClipboard migration keeps legacy format records and code intact', () => {
  assert.deepEqual(current, addFields(original, loadPlan('clipboard-append-01').documents[0].additions));
  assert.deepEqual(current.parameter[0].possible_value, original.parameter[0].possible_value);
  assert.deepEqual(current.code_sample.map(sample => sample.code), original.code_sample.map(sample => sample.code));
});

test('AppendToClipboard publishes append behavior and numeric Params type', () => {
  assert.match(effectiveDescription(current), /改行して追記/);
  assert.deepEqual(publicNotes(current).map(note => note.legacy_index), [0, 2, 3]);
  assert.equal(view.parameter[0].possible_value, undefined);
  assert.deepEqual(current.parameter[1].type, ['string']);
  assert.deepEqual(view.parameter[1].type, ['数値式']);
  assert.deepEqual(view.code_sample, []);
  assert.ok(current.quote.some(quote => quote.title === '%nの説明' && quote.visibility === 'internal'));
  assert.ok(view.quote.every(quote => quote.title !== '%nの説明'));
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; Text\s*=.*必須/.test(line)));
  assert.ok(lines.some(line => /^; Params\s*=/.test(line)));
});
