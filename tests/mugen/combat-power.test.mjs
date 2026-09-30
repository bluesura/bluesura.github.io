import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicCodeSamples, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['AttackMulSet', 'DefenceMulSet', 'PowerAdd', 'PowerSet'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('combat and power controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('combat-power-01').documents) {
    const original = readJSON(`tests/mugen/batches/combat-power-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('all four value parameters are required expressions with reviewed load order', () => {
  for (const name of names) {
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    const value = current.parameter[0];
    assert.equal(value.expression_policy, 'expression');
    assert.equal(value.default[0].kind, 'required');
    assert.deepEqual(value.load_priority, ['1']);
    assert.deepEqual(value.load_priority_evidence.basis, ['maintainer_report']);

    const normalized = normalizeDocument(current, common);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^; value\s*=/i.test(line) && line.includes('必須: 値を指定してください')));
  }
});

test('AttackMulSet publishes the documented multiplier and keeps special cases internal', () => {
  const current = readJSON('src/content/state-controllers/AttackMulSet.json');
  assert.ok(effectiveDescription(current).includes('与えるダメージ'));
  assert.ok(current.parameter[0].documentation.description.includes('2倍'));
  assert.ok(!effectiveDescription(current).includes('1フレーム'));
  assert.ok(!current.parameter[0].documentation.description.includes('負数'));
  assert.ok(!current.parameter[0].documentation.description.includes('Helper'));
  assert.deepEqual(publicNotes(current), []);
});

test('DefenceMulSet records the official conflict without publishing one multiplier direction', () => {
  const current = readJSON('src/content/state-controllers/DefenceMulSet.json');
  assert.equal(current.evidence.status, 'conflicting');
  assert.equal(current.parameter[0].documentation.evidence.status, 'conflicting');
  assert.ok(current.notes[0].content.includes('逆数'));
  assert.ok(current.notes[0].content.includes('直接'));
  assert.ok(!effectiveDescription(current).includes('MoveType'));
  assert.ok(!current.parameter[0].documentation.description.includes('0.5'));
  assert.deepEqual(publicNotes(current), []);
});

test('Power controllers hide unverified ranges and RoundState behavior while retaining the raw data', () => {
  for (const name of ['PowerAdd', 'PowerSet']) {
    const original = readJSON(`tests/mugen/batches/combat-power-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.deepEqual(current.parameter[0].min_value, original.parameter[0].min_value);
    assert.deepEqual(current.parameter[0].max_value, original.parameter[0].max_value);
    assert.deepEqual(current.version, original.version);

    const normalized = normalizeDocument(current, common);
    assert.equal(normalized.parameter[0].min_value, undefined);
    assert.equal(normalized.parameter[0].max_value, undefined);
    assert.ok(!effectiveDescription(current).includes('PowerMax'));
    assert.deepEqual(publicNotes(current), []);
    assert.equal(current.notes.find(note => note.legacy_index === 0).kind, 'research');
  }
});

test('the complete PowerAdd and PowerSet examples remain public', () => {
  const add = readJSON('src/content/state-controllers/PowerAdd.json');
  const set = readJSON('src/content/state-controllers/PowerSet.json');
  assert.equal(publicCodeSamples(add).length, 1);
  assert.equal(publicCodeSamples(set).length, 1);
  assert.ok(publicCodeSamples(add)[0].code.includes('Value = 1'));
  assert.ok(publicCodeSamples(set)[0].code.includes('Value = PowerMax'));
});
