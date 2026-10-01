import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'MakeDust';
const original = readJSON(`tests/mugen/batches/dust-effect-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('MakeDust migration preserves its original fields', () => {
  assert.deepEqual(current, addFields(original, loadPlan('dust-effect-01').documents[0].additions));
});

test('MakeDust publishes supported defaults and 1.0/1.1 deprecation only', () => {
  assert.ok(effectiveDescription(current).includes('Explod'));
  assert.ok(!effectiveDescription(current).includes('fightfx.air'));
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['deprecated']);
  assert.ok(!publicNotes(current).some(note => note.content.includes('MAKEDUST SPACING')));
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^Spacing\s*= 3$/.test(line)));
  assert.ok(lines.some(line => /^Pos\s*= 0, 0$/.test(line)));
  assert.ok(lines.some(line => /^; Pos2\s*=/.test(line)));
});
