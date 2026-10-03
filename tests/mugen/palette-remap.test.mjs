import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { copyLines, parameterLine, hasRequirementVariants } from '../../src/lib/mugen/defaults.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';

const original = readJSON('tests/mugen/batches/palette-remap-01/json/state-controllers/RemapPal.json');
const current = readJSON('src/content/state-controllers/RemapPal.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('RemapPal retains its original defaults, required flags, chain example and comma loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('palette-remap-01').documents[0].additions));
  for (const [i, parameter] of original.parameter.entries()) {
    for (const field of Object.keys(parameter)) assert.deepEqual(current.parameter[i][field], parameter[field]);
  }
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.parameter.map(p => p.load_priority), [['1, 2'], ['3, 4']]);
  assert.equal(current.page.introduced_in, null);
});

test('RemapPal separates 1.0 required input from 1.1 optional -1,0 and keeps both copy lines inactive', () => {
  for (const parameter of view.parameter.slice(0, 2)) {
    assert.equal(hasRequirementVariants(parameter), true);
    assert.equal(parameter.variants[0].parameter_type, 'required');
    assert.deepEqual(parameter.variants[0].environment.runtime, ['mugen-1.0']);
    assert.equal(parameter.variants[0].default[0].kind, 'required');
    assert.equal(parameter.variants[1].parameter_type, 'optional');
    assert.deepEqual(parameter.variants[1].environment.runtime, ['mugen-1.1']);
    assert.equal(parameter.variants[1].default[0].value, '-1, 0');
    assert.match(parameterLine(parameter), /^; .*適用環境を確認.*1\.0: 省略不可 \/ 1\.1: -1, 0$/);
  }
  const code = copyLines(view, view.parameter);
  assert.ok(!code.some(line => /^(Source|Dest)\s*=/.test(line)));
  assert.ok(code.some(line => line.startsWith('IgnoreHitPause')));
  assert.ok(code.some(line => line.startsWith('Persistent')));
});

test('RemapPal publishes nontransitive mapping, 1.1 removal and capacity while hiding unresolved introduction research', () => {
  assert.ok(view.parameter[0].description.includes('ほかの既存の割り当てを解除'));
  assert.ok(view.parameter[1].description.includes('(1,6)にはなりません'));
  assert.ok(view.parameter[1].description.includes('Sourceと同じ番号の組'));
  const notes = publicNotes(current);
  assert.equal(notes.length, 2);
  assert.equal(notes[0].kind, 'limitation');
  assert.ok(notes[0].content.includes('8個まで'));
  assert.ok(notes[0].content.includes('未登録のSource'));
  assert.deepEqual(notes[0].environment.runtime, ['mugen-1.1']);
  assert.equal(notes[1].at, 'mugen-1.0-rc4');
  assert.equal(current.notes[2].kind, 'research');
});

test('requirement variants validate enums and prevent unconditional copy activation even without variant defaults', () => {
  const schema = createDocumentSchema('state-controllers', readJSON('src/data/engine-versions.json'));
  const p = { parameter: 'Value', parameter_type: 'optional', default: [{ kind: 'literal', value: 0 }], variants: [{ environment: { engine: 'mugen', runtime: ['mugen-1.0'] }, parameter_type: 'required' }] };
  const data = { ...current, parameter: [p] };
  assert.equal(schema.safeParse(data).success, true);
  assert.match(parameterLine(p), /^; .*適用環境を確認/);
  assert.equal(hasRequirementVariants({ ...p, variants: [{ ...p.variants[0], parameter_type: 'optional' }] }), false);
  assert.equal(schema.safeParse({ ...data, parameter: [{ ...p, variants: [{ ...p.variants[0], parameter_type: 'optinal' }] }] }).success, false);
});
