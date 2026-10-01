import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'EnvColor';
const original = readJSON(`tests/mugen/batches/environment-color-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('EnvColor migration preserves every original field', () => {
  assert.deepEqual(current, addFields(original, loadPlan('environment-color-01').documents[0].additions));
});

test('EnvColor publishes documented drawing and defaults without the old untested -2 claim', () => {
  assert.ok(effectiveDescription(current).includes('ステージの前面レイヤー'));
  assert.ok(!effectiveDescription(current).includes('AllPalFX'));
  assert.deepEqual(publicNotes(current), []);
  assert.ok(current.notes[0].content.includes('-1,-2'));
  assert.ok(current.notes[1].content.includes('SET ILLEGAL ENVCOLORTIME'));
  assert.ok(view.parameter[1].description.includes('-1'));
  assert.ok(!view.parameter[1].description.includes('-2'));
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^value\s*= 255, 255, 255$/.test(line)));
  assert.ok(lines.some(line => /^Time\s*= 1$/.test(line)));
  assert.ok(lines.some(line => /^Under\s*= 0$/.test(line)));
});
