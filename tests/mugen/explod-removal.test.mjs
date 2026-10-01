import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'RemoveExplod';
const original = readJSON(`tests/mugen/batches/explod-removal-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('RemoveExplod migration preserves every original field', () => {
  assert.deepEqual(current, addFields(original, loadPlan('explod-removal-01').documents[0].additions));
});

test('RemoveExplod publishes omitted-ID behavior without asserting an unverified -1 literal', () => {
  assert.ok(effectiveDescription(current).includes('所有するすべての Explod'));
  assert.ok(view.parameter[0].description.includes('省略すると'));
  assert.ok(!view.parameter[0].description.includes('-1'));
  assert.deepEqual(publicNotes(current), []);
  assert.ok(current.notes[0].content.includes('REMOVAL OF ILLEGAL EXPLOD ID'));
  assert.equal(current.parameter[0].default_value[0], '-1 ;全てのExplodを消去');
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; ID\s*=/.test(line)));
  assert.ok(!lines.some(line => /^ID\s*= -1$/.test(line)));
});
