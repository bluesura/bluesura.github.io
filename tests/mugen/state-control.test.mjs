import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['CtrlSet', 'StateTypeSet', 'SprPriority'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('state control controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('state-control-01').documents) {
    const original = readJSON(`tests/mugen/batches/state-control-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('CtrlSet and SprPriority require integer expressions and retain reviewed load order', () => {
  for (const name of ['CtrlSet', 'SprPriority']) {
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    const value = current.parameter[0];
    assert.equal(value.expression_policy, 'expression');
    assert.equal(value.default[0].kind, 'required');
    assert.deepEqual(value.default_value, ['?']);
    assert.deepEqual(value.load_priority_evidence.basis, ['maintainer_report']);
    const normalized = normalizeDocument(current, common);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
  }
  const priority = readJSON('src/content/state-controllers/SprPriority.json').parameter[0];
  assert.deepEqual(priority.min_value, ['-5']);
  assert.deepEqual(priority.max_value, ['5']);
});

test('StateTypeSet publishes confirmed tokens and inheritance while retaining its detailed old tables internally', () => {
  const original = readJSON('tests/mugen/batches/state-control-01/json/state-controllers/StateTypeSet.json');
  const current = readJSON('src/content/state-controllers/StateTypeSet.json');
  assert.deepEqual(current.parameter.map(item => item.possible_value), original.parameter.map(item => item.possible_value));
  assert.deepEqual(current.parameter.map(item => item.load_priority), [['?'], ['?'], ['?']]);
  assert.ok(current.parameter.every(item => item.load_priority_evidence === undefined));

  const normalized = normalizeDocument(current, common);
  for (const parameter of normalized.parameter.slice(0, 3)) {
    assert.equal(parameter.expression_policy, 'constant_only');
    assert.equal(parameter.default[0].kind, 'inherit');
    assert.equal(parameter.possible_value, undefined);
    assert.ok(parameter.description.includes('省略時'));
  }
  const lines = copyLines(normalized, normalized.parameter);
  for (const name of ['StateType', 'Physics', 'MoveType']) {
    assert.ok(lines.some(line => new RegExp(`^; ${name}\\s*=`).test(line) && line.includes('維持')));
    assert.ok(!lines.some(line => new RegExp(`^${name}\\s*= U$`).test(line)));
  }
});

test('unverified operational detail stays JSON-only while reviewed descriptions are public', () => {
  for (const name of ['CtrlSet', 'StateTypeSet']) {
    const original = readJSON(`tests/mugen/batches/state-control-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.equal(current.description, original.description);
    assert.notEqual(effectiveDescription(current), current.description);
    assert.ok(current.notes.every(note => note.kind === 'research'));
    assert.deepEqual(publicNotes(current), []);
  }
  assert.ok(!effectiveDescription(readJSON('src/content/state-controllers/CtrlSet.json')).includes('技の途中'));
  assert.ok(effectiveDescription(readJSON('src/content/state-controllers/StateTypeSet.json')).includes('物理状態'));
});

test('SprPriority publishes the confirmed range and front-to-back direction', () => {
  const current = readJSON('src/content/state-controllers/SprPriority.json');
  assert.ok(effectiveDescription(current).includes('値が大きい'));
  assert.ok(current.parameter[0].documentation.description.includes('-5'));
  assert.ok(current.parameter[0].documentation.description.includes('5'));
});
