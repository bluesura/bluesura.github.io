import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('hit defense controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('hit-defense-01').documents) {
    const original = readJSON(`tests/mugen/batches/hit-defense-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('HitOverRide preserves the StateNo requirement difference between generations', () => {
  const current = readJSON('src/content/state-controllers/HitOverRide.json');
  const stateNo = current.parameter.find(parameter => parameter.parameter === 'StateNo');
  assert.deepEqual(stateNo.default.map(item => item.kind), ['literal', 'required']);
  assert.deepEqual(stateNo.default[0].environment.runtime, ['mugen-linux']);
  assert.deepEqual(stateNo.default[1].environment.runtime, ['mugen-1.0', 'mugen-1.1']);
  assert.ok(stateNo.documentation.description.includes('2002.04.14'));
  assert.ok(stateNo.documentation.description.includes('1.0 / 1.1'));
  assert.ok(effectiveDescription(current).includes('最大8個'));
});

test('HitOverRide publishes confirmed version behavior and keeps old warnings internal', () => {
  const current = readJSON('src/content/state-controllers/HitOverRide.json');
  const notes = publicNotes(current);
  assert.equal(notes.length, 1);
  assert.equal(notes[0].kind, 'behavior');
  assert.ok(notes[0].content.includes('p1stateno'));
  assert.ok(notes[0].content.includes('p2getp1state'));
  assert.ok(current.notes.filter(note => note.kind === 'research').some(note => note.content.includes('ILLEGAL OVERRIDE SLOT')));
  assert.ok(!notes.some(note => note.content.includes('ILLEGAL')));
});

test('NotHitBy exposes one exclusive attribute slot and hides unsupported time ranges', () => {
  const original = readJSON('tests/mugen/batches/hit-defense-01/json/state-controllers/NotHitBy.json');
  const current = readJSON('src/content/state-controllers/NotHitBy.json');
  const normalized = normalizeDocument(current, common);
  assert.deepEqual(current.constraints.map(constraint => constraint.kind), ['one_of', 'mutually_exclusive']);
  assert.deepEqual(current.constraints.map(constraint => constraint.parameters), [['value', 'value2'], ['value', 'value2']]);
  assert.deepEqual(current.parameter[2].min_value, original.parameter[2].min_value);
  assert.deepEqual(current.parameter[2].max_value, original.parameter[2].max_value);
  assert.equal(normalized.parameter[2].min_value, undefined);
  assert.equal(normalized.parameter[2].max_value, undefined);
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['behavior']);
});

test('hit defense CNS output keeps alternatives and environment-specific values inactive', () => {
  const hitOverride = normalizeDocument(readJSON('src/content/state-controllers/HitOverRide.json'), common);
  const overrideLines = copyLines(hitOverride, hitOverride.parameter);
  assert.ok(overrideLines.some(line => /^; Attr\s*=/.test(line) && line.includes('必須')));
  assert.ok(overrideLines.some(line => /^Slot\s*=/.test(line) && line.includes('0')));
  assert.ok(overrideLines.some(line => /^; StateNo\s*=/.test(line) && line.includes('適用環境を確認')));
  assert.ok(overrideLines.some(line => /^Time\s*=/.test(line) && line.includes('1')));
  assert.ok(overrideLines.some(line => /^ForceAir\s*=/.test(line) && line.includes('0')));

  const notHitBy = normalizeDocument(readJSON('src/content/state-controllers/NotHitBy.json'), common);
  const notHitByLines = copyLines(notHitBy, notHitBy.parameter);
  assert.ok(notHitByLines.some(line => /^; value\s*=/.test(line) && line.includes('代替書式')));
  assert.ok(notHitByLines.some(line => /^; value2\s*=/.test(line) && line.includes('代替書式')));
  assert.ok(notHitByLines.some(line => /^Time\s*=/.test(line) && line.includes('1')));
});
