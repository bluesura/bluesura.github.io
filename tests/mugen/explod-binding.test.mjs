import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'ExplodBindTime';
const original = readJSON(`tests/mugen/batches/explod-binding-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('ExplodBindTime migration preserves every original field', () => {
  assert.deepEqual(current, addFields(original, loadPlan('explod-binding-01').documents[0].additions));
});

test('ExplodBindTime keeps uncertain warnings internal and its value alias inactive', () => {
  assert.deepEqual(publicNotes(current), []);
  assert.ok(current.notes[0].content.includes('EXPLODBONDTIME'));
  assert.ok(view.parameter[1].description.includes('-1'));
  assert.ok(!view.parameter[1].description.includes('-1以下'));
  assert.ok(!view.parameter[2].description.includes('優先順位'));
  assert.deepEqual(view.parameter.slice(0, 3).map(parameter => parameter.load_priority), [['1'], ['2'], ['2']]);
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^ID\s*= -1$/.test(line)));
  assert.ok(lines.some(line => /^Time\s*= 1$/.test(line)));
  assert.ok(lines.some(line => /^; value\s*=/.test(line)));
});
