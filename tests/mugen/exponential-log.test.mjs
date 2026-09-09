import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { publicCodeSamples, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['E', 'Exp', 'Ln', 'Log'];

test('exponential and logarithm triggers match the additive plan and preserve the old JSON', () => {
  for (const target of loadPlan('exponential-log-01').documents) {
    const original = readJSON(`tests/mugen/batches/exponential-log-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
    assert.deepEqual(current.return_type, ['float']);
    assert.equal(current.page.introduced_in, null);
  }
});

test('E is nullary while Exp, Ln and Log retain their reviewed argument order', () => {
  const expected = {
    E: { syntax: 'nullary', arguments: [] },
    Exp: { syntax: 'function', arguments: ['exprn'] },
    Ln: { syntax: 'function', arguments: ['exprn'] },
    Log: { syntax: 'function', arguments: ['base', 'exprn'] },
  };
  for (const name of names) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.syntax_kind, expected[name].syntax);
    assert.deepEqual(current.arguments.map(argument => argument.name), expected[name].arguments);
    assert.ok(current.arguments.every(argument => argument.type[0] === 'float' && argument.expression_policy === 'expression'));
  }
});

test('environment-specific measurements and unverified warning strings stay internal', () => {
  for (const [name, hidden] of [['E', [0]], ['Exp', [0]], ['Ln', []], ['Log', []]]) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    const original = readJSON(`tests/mugen/batches/exponential-log-01/json/triggers/${name}.json`);
    assert.deepEqual(current.code_sample.flatMap((sample, index) => sample.visibility === 'internal' ? [index] : []), hidden);
    assert.deepEqual(publicCodeSamples(current), original.code_sample.filter((_, index) => !hidden.includes(index)));
  }
  const ln = readJSON('src/content/triggers/Ln.json');
  assert.deepEqual(publicNotes(ln).map(note => note.content), ln.version.slice(0, 2).map(note => note.content));
  assert.equal(ln.notes.find(note => note.legacy_index === 2).kind, 'research');
  const log = readJSON('src/content/triggers/Log.json');
  assert.equal(log.notes.find(note => note.legacy_index === 0).kind, 'research');
  assert.ok(publicNotes(log).every(note => !note.content.includes('TOOK LOG')));
  assert.ok(publicNotes(log).some(note => note.kind === 'error' && note.content.includes('bottom')));
});
