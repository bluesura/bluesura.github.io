import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['Abs', 'Ceil', 'Floor'];

test('basic numeric triggers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('numeric-basic-01').documents) {
    const original = readJSON(`tests/mugen/batches/numeric-basic-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.code_sample, original.code_sample);
    assert.equal(current.page.introduced_in, null);
  }
});

test('Abs preserves its input type while Ceil and Floor return integers', () => {
  const expectedReturns = {
    Abs: ['int', 'float'],
    Ceil: ['int'],
    Floor: ['int'],
  };
  for (const name of names) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.syntax_kind, 'function');
    assert.deepEqual(current.arguments.map(argument => argument.name), ['exprn']);
    assert.deepEqual(current.arguments[0].type, ['int', 'float']);
    assert.equal(current.arguments[0].expression_policy, 'expression');
    assert.deepEqual(current.return_type, expectedReturns[name]);
  }
});

test('old SFalse and newer bottom notes retain their version-specific public wording', () => {
  for (const name of names) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.deepEqual(publicNotes(current).map(note => note.content), current.version.map(note => note.content));
    assert.deepEqual(current.notes.map(note => note.legacy_index), [0, 1]);
    assert.ok(current.notes.every(note => note.kind === 'error' && note.evidence.status === 'confirmed'));
  }
});
