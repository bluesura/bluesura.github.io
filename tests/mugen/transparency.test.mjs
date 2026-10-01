import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'Trans';
const original = readJSON(`tests/mugen/batches/transparency-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('Trans migration preserves every original field and sample', () => {
  assert.deepEqual(current, addFields(original, loadPlan('transparency-01').documents[0].additions));
  assert.deepEqual(current.code_sample, original.code_sample);
});

test('Trans presents reviewed tokens and keeps untested negative-alpha claims internal', () => {
  assert.ok(effectiveDescription(current).includes('現在のゲーム tick'));
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['deprecated']);
  assert.ok(current.notes[1].content.includes('負数'));
  assert.equal(view.parameter[0].possible_value, undefined);
  assert.ok(view.parameter[0].description.includes('Default'));
  assert.ok(view.parameter[0].description.includes('None'));
  assert.ok(!view.parameter[1].description.includes('負数'));
  assert.deepEqual(current.parameter[0].load_priority, ['?']);
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; Trans\s*=/.test(line)));
  assert.ok(lines.some(line => /^; Alpha\s*=/.test(line)));
  assert.ok(!lines.some(line => /^Alpha\s*=/.test(line)));
});
