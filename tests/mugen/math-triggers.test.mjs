import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes, publicCodeSamples } from '../../src/lib/mugen/normalize.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
test('math triggers retain original examples and argument detail while separating nullary Pi from functions', () => {
  for (const entry of loadPlan('inverse-trig-01').documents) {
    const old = readJSON(`tests/mugen/batches/inverse-trig-01/json/triggers/${entry.name}.json`);
    const source = readJSON(`src/content/triggers/${entry.name}.json`);
    assert.deepEqual(source, addFields(old, entry.additions));
    assert.deepEqual(source.code_sample.map(({ visibility, ...sample }) => sample), old.code_sample);
    assert.deepEqual(source.images, old.images);
    assert.deepEqual(source.return_type, ['float']);
    assert.equal(source.page.introduced_in, null);
    const current = normalizeDocument(source, common);
    assert.ok(!current.parameter.some(p => ['IgnoreHitPause', 'Persistent'].includes(p.parameter)));
    if (entry.name === 'PI') {
      assert.equal(source.syntax_kind, 'nullary');
      assert.deepEqual(source.arguments, []);
      assert.deepEqual(current.parameter, []);
    } else {
      assert.equal(source.syntax_kind, 'function');
      assert.equal(current.parameter.length, 1);
      assert.equal(current.parameter[0].description, old.parameter[0].description);
      assert.equal(current.parameter[0].parameter_type, 'required');
      assert.equal(current.parameter[0].expression_policy, 'expression');
      assert.deepEqual(publicNotes(source).map(n => n.content), old.version.map(n => n.content));
    }
    const hidden = source.code_sample.flatMap((sample, i) => sample.visibility === 'internal' ? [i] : []);
    assert.deepEqual(hidden, entry.name === 'PI' ? [0, 2, 3] : entry.name === 'Atan' ? [1] : []);
    assert.deepEqual(current.code_sample, old.code_sample.filter((_, i) => !hidden.includes(i)));
  }
});

test('sample visibility is an explicit validated publication choice and does not mutate stored samples', () => {
  const schema = createDocumentSchema('triggers', readJSON('src/data/engine-versions.json'));
  const source = { trigger: 'Example', page: {}, code_sample: [
    { title: '従来の例', code: ['value = 1'], old_metadata: '?' },
    { title: '内部に残す例', code: ['value = 1 / 0'], visibility: 'internal' },
    { title: '公開例', code: ['value = 2'], visibility: 'public' },
  ] };
  const snapshot = structuredClone(source);
  assert.deepEqual(schema.parse(source), source);
  assert.deepEqual(publicCodeSamples(source).map(sample => sample.title), ['従来の例', '公開例']);
  assert.deepEqual(source, snapshot);
  assert.deepEqual(publicCodeSamples({ code_sample: [source.code_sample[1]] }), []);
  assert.equal(schema.safeParse({ ...source, code_sample: [{ ...source.code_sample[1], visibility: 'internall' }] }).success, false);
});
