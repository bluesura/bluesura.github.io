import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveParameters, effectiveArguments } from '../../src/lib/mugen/parameters.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';

const original = readJSON('tests/mugen/batches/afterimage-effects-01/json/state-controllers/AfterImage.json');
const current = readJSON('src/content/state-controllers/AfterImage.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);
const parameter = key => view.parameter.find(p => p.parameter === key);

test('AfterImage preserves every original parameter, question, sample, image and unknown loading component', () => {
  assert.deepEqual(current, addFields(original, loadPlan('afterimage-effects-01').documents[0].additions));
  for (const [i, old] of original.parameter.entries()) for (const key of Object.keys(old)) assert.deepEqual(current.parameter[i][key], old[key]);
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.images, original.images);
  assert.deepEqual(current.parameter[6].load_priority, ['?', '7', '8']);
  assert.equal(current.parameter[6].load_priority_evidence.status, 'unverified');
  assert.deepEqual(current.parameter[12].load_priority, ['21', '22']);
});

test('AfterImage separates palette-wide post-brightness from cumulative add/multiply and corrects floating multipliers', () => {
  assert.deepEqual(parameter('PalMul').type, ['float', 'float', 'float']);
  assert.ok(parameter('PalMul').description.includes('256で割る指定ではありません'));
  assert.ok(parameter('PalMul').description.includes('1</code> が等倍'));
  assert.ok(parameter('PalAdd').description.includes('最新の履歴には0回'));
  assert.ok(parameter('PalPostBright').description.includes('残像すべて'));
  assert.ok(!parameter('PalPostBright').description.includes('2つ目以降'));
  assert.equal(parameter('PalMul').max_value, undefined);
  assert.equal(parameter('PalBright').max_value, undefined);
  assert.equal(parameter('Trans').possible_value, undefined);
  assert.ok(parameter('Framegap').description.includes('1番目・5番目・9番目'));
  assert.equal(publicNotes(current).length, 1);
  assert.ok(publicNotes(current)[0].content.includes('PalColor → PalInvertAll → PalBright'));
});

test('AfterImage hides Alpha, investigative Q&A and samples while retaining standard defaults and the basic media example', () => {
  assert.equal(parameter('Alpha'), undefined);
  assert.equal(current.parameter[12].default[0].kind, 'unknown');
  assert.deepEqual(current.parameter[12].default_value, ['256', '0<!--????-->']);
  assert.equal(view.qanda.length, 0);
  assert.deepEqual(view.code_sample, [original.code_sample[0]]);
  assert.equal(view.parameter.length, 14);
  const lines = copyLines(view, view.parameter);
  assert.ok(!lines.some(line => /^;?\s*Alpha\s*=/.test(line)));
  for (const [key, expected] of Object.entries({ Time: '1', Length: '20', Timegap: '1', Framegap: '4', PalColor: '256', PalInvertall: '0', PalBright: '30, 30, 30', PalContrast: '120, 120, 220', PalPostBright: '0, 0, 0', PalAdd: '10, 10, 25', PalMul: '.65, .65, .75', Trans: 'None' })) {
    assert.ok(lines.includes(`${key.padEnd(27)}= ${expected}`));
  }
  assert.equal(parameter('IgnoreHitPause').anchor_index, 13);
  assert.equal(parameter('Persistent').anchor_index, 14);
});

test('internal parameter visibility retains raw data and prevents common or legacy trigger entries from returning', () => {
  const hidden = { parameter: 'IgnoreHitPause', visibility: 'internal', load_priority: ['?'] };
  const document = { category: 'state', parameter: [hidden, { parameter: 'Value' }] };
  const parameters = effectiveParameters(document, common);
  assert.deepEqual(parameters.map(p => p.parameter), ['Value', 'Persistent']);
  assert.equal(parameters[0].anchor_index, 1);
  assert.deepEqual(document.parameter[0], hidden);
  const trigger = { parameter: [{ parameter: 'old', visibility: 'internal', description: '内部引数' }, { parameter: 'other' }], arguments: [{ name: 'value', type: ['int'], legacy_index: 0 }] };
  assert.deepEqual(effectiveArguments(trigger).map(p => p.parameter), ['other']);
  assert.deepEqual(effectiveArguments({ ...trigger, arguments: [{ name: 'value', type: ['int'], legacy_index: 0, visibility: 'public' }] }).map(p => p.parameter), ['value', 'other']);
});

test('visibility enums reject accidental spelling errors for parameters and trigger arguments', () => {
  const registry = readJSON('src/data/engine-versions.json');
  const stateSchema = createDocumentSchema('state-controllers', registry);
  assert.equal(stateSchema.safeParse(current).success, true);
  assert.equal(stateSchema.safeParse({ ...current, parameter: [{ parameter: 'Alpha', visibility: 'internall' }] }).success, false);
  const triggerSchema = createDocumentSchema('triggers', registry);
  assert.equal(triggerSchema.safeParse({ page: { engine: 'mugen' }, trigger: 'Example', arguments: [{ name: 'value', type: ['int'], visibility: 'internal' }] }).success, true);
  assert.equal(triggerSchema.safeParse({ page: { engine: 'mugen' }, trigger: 'Example', arguments: [{ name: 'value', type: ['int'], visibility: 'publik' }] }).success, false);
});
