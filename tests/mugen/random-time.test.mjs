import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { publicCodeSamples, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['Random', 'GameTime', 'Time', 'TimeMod'];

test('random and time triggers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('random-time-01').documents) {
    const original = readJSON(`tests/mugen/batches/random-time-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
    assert.equal(current.page.introduced_in, null);
  }
});

test('Random, GameTime and Time are nullary integer triggers', () => {
  for (const name of names.slice(0, 3)) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.syntax_kind, 'nullary');
    assert.deepEqual(current.arguments, []);
    assert.deepEqual(current.return_type, ['int']);
    assert.equal(current.evidence.status, 'confirmed');
  }
});

test('the unverified per-reference Random example stays in JSON but out of public HTML data', () => {
  const original = readJSON('tests/mugen/batches/random-time-01/json/triggers/Random.json');
  const current = readJSON('src/content/triggers/Random.json');
  assert.equal(current.code_sample[1].visibility, 'internal');
  assert.deepEqual(publicCodeSamples(current), [original.code_sample[0], original.code_sample[2]]);
  assert.equal(current.notes[0].kind, 'research');
  assert.equal(current.notes[0].evidence.status, 'unverified');
  assert.deepEqual(publicNotes(current), []);
});

test('TimeMod preserves old-style constant syntax and separates SFalse from bottom', () => {
  const current = readJSON('src/content/triggers/TimeMod.json');
  assert.equal(current.syntax_kind, 'old_style');
  assert.deepEqual(current.return_type, ['int']);
  assert.deepEqual(current.arguments.map(argument => argument.name), ['[oper]', 'divisor', 'value1']);
  assert.equal(current.arguments[0].expression_policy, 'special_syntax');
  assert.ok(current.arguments.slice(1).every(argument => argument.expression_policy === 'constant_only'));
  assert.deepEqual(publicNotes(current).map(note => note.content), [
    current.version[0].content,
    '<p>MUGEN 1.0 / 1.1 では、除数が0の場合は <code>bottom</code> を返します。</p>',
  ]);
});
