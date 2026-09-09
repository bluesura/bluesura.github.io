import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { publicCodeSamples, publicNotes } from '../../src/lib/mugen/normalize.mjs';

test('Sin, Cos and Tan match their reviewed additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('circular-trig-01').documents) {
    const original = readJSON(`tests/mugen/batches/circular-trig-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
    assert.deepEqual(current.images, original.images);
    assert.deepEqual(current.return_type, ['float']);
    assert.equal(current.syntax_kind, 'function');
    assert.equal(current.arguments.length, 1);
    assert.equal(current.arguments[0].name, 'Radian');
    assert.equal(current.arguments[0].type[0], 'float');
    assert.equal(current.arguments[0].expression_policy, 'expression');
    assert.equal(current.arguments[0].legacy_index, 0);
    assert.deepEqual(publicNotes(current).map(note => note.content), original.version.map(note => note.content));
  }
});

test('placeholder-based trigonometry samples stay in JSON but are excluded from public examples', () => {
  for (const [name, hidden] of [['Sin', [1]], ['Cos', []], ['Tan', [1]]]) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    const original = readJSON(`tests/mugen/batches/circular-trig-01/json/triggers/${name}.json`);
    assert.deepEqual(current.code_sample.flatMap((sample, index) => sample.visibility === 'internal' ? [index] : []), hidden);
    assert.deepEqual(publicCodeSamples(current), original.code_sample.filter((_, index) => !hidden.includes(index)));
    assert.ok(current.notes.filter(note => note.kind === 'research').every(note => note.evidence.status === 'confirmed'));
  }
  assert.ok(readJSON('src/content/triggers/Sin.json').code_sample[1].code.some(line => line.includes('ラディウス')));
  assert.ok(readJSON('src/content/triggers/Tan.json').code_sample[1].code.some(line => line.includes('角度')));
});
