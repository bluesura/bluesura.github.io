import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const original = readJSON('tests/mugen/batches/clipboard-display-01/json/state-controllers/DisplayToClipboard.json');
const current = readJSON('src/content/state-controllers/DisplayToClipboard.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('DisplayToClipboard migration preserves legacy format research and samples', () => {
  assert.deepEqual(current, addFields(original, loadPlan('clipboard-display-01').documents[0].additions));
  assert.deepEqual(current.parameter[0].possible_value, original.parameter[0].possible_value);
  assert.deepEqual(current.code_sample.map(sample => sample.code), original.code_sample.map(sample => sample.code));
  assert.deepEqual(current.images.map(image => image.src), original.images.map(image => image.src));
});

test('DisplayToClipboard shows sourced 2002 and 1.0/1.1 rules only', () => {
  assert.match(effectiveDescription(current), /内容を消去し/);
  assert.deepEqual(publicNotes(current).map(note => note.legacy_index), [0, 2, 3]);
  assert.equal(publicNotes(current).some(note => note.content.includes('フリーズ')), false);
  assert.equal(view.parameter[0].possible_value, undefined);
  assert.ok(view.parameter[0].description.includes('%d'));
  assert.ok(view.parameter[1].description.includes('最大5個'));
  assert.ok(view.parameter[1].description.includes('最大6個'));
  assert.deepEqual(view.images, []);
  assert.deepEqual(view.code_sample, []);
  assert.ok(current.quote.some(quote => quote.title === '%nの説明' && quote.visibility === 'internal'));
  assert.ok(view.quote.every(quote => quote.title !== '%nの説明'));
  assert.ok(current.notes.some(note => note.kind === 'research' && note.content.includes('%s')));
});

test('DisplayToClipboard copy output requires Text and never activates placeholder Params', () => {
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; Text\s*=.*必須/.test(line)));
  assert.ok(lines.some(line => /^; Params\s*=/.test(line)));
  assert.ok(lines.every(line => !/^(?:Text|Params)\s*=/.test(line)));
});
