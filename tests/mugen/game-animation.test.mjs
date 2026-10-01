import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'GameMakeAnim';
const original = readJSON(`tests/mugen/batches/game-animation-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('GameMakeAnim migration retains every original field', () => {
  assert.deepEqual(current, addFields(original, loadPlan('game-animation-01').documents[0].additions));
});

test('GameMakeAnim publishes documented defaults and only its reviewed deprecation', () => {
  assert.ok(effectiveDescription(current).includes('Explod'));
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['deprecated']);
  assert.ok(current.notes[1].content.includes('MADE NEGATIVE GAMEANIM'));
  assert.ok(current.notes[2].content.includes('NEGATIVE RANDOM PARAM'));
  assert.ok(view.parameter[2].description.includes('X・Y方向それぞれ独立'));
  assert.ok(!view.parameter[2].description.includes('正方形'));
  const lines = copyLines(view, view.parameter);
  for (const [parameter, value] of [['value', '0'], ['Pos', '0, 0'], ['Random', '0'], ['Under', '0']]) {
    assert.ok(lines.some(line => new RegExp(`^${parameter}\\s*= ${value}$`).test(line)), `${parameter} default`);
  }
});
