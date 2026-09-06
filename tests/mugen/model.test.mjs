import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { registryIssues } from '../../src/lib/mugen/versions.mjs';
import { effectiveParameters, effectiveArguments } from '../../src/lib/mugen/parameters.mjs';
import { effectiveNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines, parameterLine } from '../../src/lib/mugen/defaults.mjs';
import { readJSON, documents } from '../../scripts/mugen/files.mjs';

const registry = readJSON('src/data/engine-versions.json');
const schema = createDocumentSchema('state-controllers', registry);
const document = additions => ({ state: 'Example', category: 'state', page: { engine: 'mugen' }, ...additions });
const parameter = (value, extra = {}) => ({ parameter: 'Value', parameter_type: 'optional', default: value, ...extra });
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('all production and representative legacy documents remain readable', () => {
  for (const entry of documents()) assert.equal(createDocumentSchema(entry.collection, registry).safeParse(entry.data).success, true, entry.path);
  const historical = readJSON('tests/mugen/baseline/json/state-controllers/VarSet.json');
  assert.deepEqual(schema.parse(historical), historical);
});
test('registry distinguishes families, builds, engines and compatibility profiles', () => {
  assert.deepEqual(registryIssues(registry), []);
  assert.equal(schema.safeParse(document({ page: { engine: 'mugen', introduced_in: 'mugen-1.0' } })).success, false);
  assert.equal(schema.safeParse(document({ environment: { engine: 'ikemen-go', runtime: ['mugen-1.0-final'] } })).success, false);
  assert.equal(schema.safeParse(document({ environment: { engine: 'mugen', runtime: ['mugen-1.0-final'], compatibility_profile: ['mugen-compat-2002'] } })).success, true);
});
test('misspelled v2 enums fail while historical unknown fields survive', () => {
  assert.equal(schema.safeParse(document({ notes: [{ kind: 'warningg', content: 'x' }] })).success, false);
  assert.equal(schema.safeParse(document({ parameter: [parameter([{ kind: 'inherited', display: '親' }])] })).success, false);
  const d = document({ '調査メモ': '?', parameter: [{ parameter: 'x', parameter_type: '?<!--optional?-->', load_priority: ['2 ;補足', '?'] }] });
  assert.deepEqual(schema.parse(d), d);
});
test('source and runtime evidence references must resolve', () => {
  const evidence = { status: 'unverified', basis: [], source_refs: ['missing'] };
  assert.equal(schema.safeParse(document({ evidence })).success, false);
  assert.equal(schema.safeParse(document({ evidence, quote: [{ id: 'missing', title: '資料', url: '/source.html' }] })).success, true);
  assert.equal(schema.safeParse(document({ evidence: { status: 'confirmed', basis: ['runtime_test'] } })).success, false);
  assert.equal(schema.safeParse(document({ evidence: { status: 'confirmed', basis: [] } })).success, false);
  assert.equal(schema.safeParse(document({ evidence: { status: 'confirmed', basis: ['official_document'] } })).success, false);
  assert.equal(schema.safeParse(document({ evidence: { status: 'confirmed', basis: ['runtime_test'], tested_on: ['mugen-1.0'] } })).success, false);
  assert.equal(schema.safeParse(document({ evidence: { status: 'confirmed', basis: ['runtime_test'], tested_on: ['mugen-1.0-final'] } })).success, true);
});
test('unmapped legacy history is retained and mapped entries render once', () => {
  const d = document({ version: [{ no: '警告', content: '警告本文', blockquote: '/old' }, { no: '-', content: '未分類' }], notes: [{ kind: 'warning', content: '警告本文', legacy_index: 0 }] });
  assert.equal(effectiveNotes(d).length, 2);
  assert.equal(effectiveNotes(d)[0].legacy.blockquote, '/old');
  assert.equal(effectiveNotes(d)[1].content, '未分類');
  assert.equal(effectiveNotes({ ...d, notes: [] }).length, 2);
  assert.equal(schema.safeParse({ ...d, notes: [{ ...d.notes[0], legacy_index: 2 }] }).success, false);
  assert.equal(schema.safeParse({ ...d, notes: [d.notes[0], d.notes[0]] }).success, false);
});
test('common parameters are added once only to controllers, with local overrides', () => {
  for (const category of ['trigger', 'statetype', undefined]) assert.deepEqual(effectiveParameters({ category }, common), []);
  const local = { parameter: 'ignorehitpause', default: [{ kind: 'unknown', display: '固有挙動' }] };
  const p = effectiveParameters({ category: 'state', parameter: [local] }, common);
  assert.equal(p.length, 2);
  assert.equal(p[0].default[0].display, '固有挙動');
  assert.equal(p[0].description, common[0].description);
  assert.equal(common[0].parameter, 'IgnoreHitPause');
  assert.throws(() => effectiveParameters({ category: 'state', parameter: [local, local] }, common), /Duplicate/);
});
test('alternative VarSet forms and their load order are not collapsed', () => {
  const d = readJSON('tests/mugen/baseline/json/state-controllers/VarSet.json');
  const p = effectiveParameters(d, common);
  assert.deepEqual(p.slice(0, d.parameter.length), d.parameter);
  assert.equal(p.length, 8);
  const lines = copyLines(d, p);
  for (const name of ['fv', 'value', 'var(番号)', 'fvar(番号)']) assert.ok(lines.some(line => line.startsWith('; ') && line.includes(name)));
});
test('literal defaults produce usable CNS; semantic or unsafe defaults are wholly commented', () => {
  assert.match(parameterLine(parameter([{ kind: 'literal', value: 0 }])), /^Value\s*= 0$/);
  assert.match(parameterLine(parameter([{ kind: 'literal', value: 0 }, { kind: 'literal', value: -1 }])), /= 0, -1$/);
  assert.match(parameterLine(parameter([{ kind: 'literal', value: '"my helper"' }])), /= "my helper"$/);
  for (const kind of ['inherit', 'derived', 'required', 'unknown', 'none']) assert.match(parameterLine(parameter([{ kind, display: '意味を保持' }])), /^; /);
  for (const value of ['Parent.Size.XScale', '0\nTrigger1 = 1', '?', '<code>0</code>', '']) assert.match(parameterLine(parameter([{ kind: 'literal', value }])), /^; /);
  assert.match(parameterLine({ parameter: 'Size.XScale', default_value: [';親から継承'] }), /^; Size.XScale/);
  assert.match(parameterLine({ parameter: 'ID', parameter_type: 'required', default_value: ['0'] }), /^; /);
});
test('environment-specific and mutually alternative defaults never become unconditional active lines', () => {
  const p = parameter([{ kind: 'literal', value: 1 }], { variants: [{ environment: { engine: 'mugen', runtime: ['mugen-1.1'] }, default: [{ kind: 'literal', value: 2 }] }] });
  assert.match(parameterLine(p), /^; /);
  assert.match(parameterLine(parameter([{ kind: 'literal', value: 1 }]), { constraints: [{ kind: 'one_of', parameters: ['Value', 'Value2'] }] }), /^; /);
  assert.match(parameterLine(parameter([{ kind: 'literal', value: 1, environment: { engine: 'mugen', runtime: ['mugen-1.1'] } }])), /^; /);
});
test('v2 argument metadata reuses legacy explanation and retains unmapped arguments', () => {
  const d = { parameter: [{ parameter: 'old', description: '詳細', media: { image: [] }, type: ['int'] }, { parameter: 'other' }], arguments: [{ name: 'new', type: ['int'], legacy_index: 0 }] };
  assert.equal(effectiveArguments(d).length, 2);
  assert.equal(effectiveArguments(d)[0].description, '詳細');
  assert.equal(effectiveArguments(d)[0].parameter, 'new');
  assert.equal(effectiveArguments({ ...d, arguments: [] }).length, 2);
});

test('reviewed fixture defaults retain inheritance, literal annotations and compatibility differences', () => {
  const helper = readJSON('src/content/state-controllers/Helper.json');
  assert.equal(helper.parameter.find(p => p.parameter === 'Size.XScale').default[0].kind, 'inherit');
  assert.deepEqual(helper.parameter.find(p => p.parameter === 'ReMapPal').default[0].evidence.source_refs, ['helper-local-1.1']);
  const explod = readJSON('src/content/state-controllers/Explod.json');
  const parameters = effectiveParameters(explod, common);
  assert.equal(parameters.filter(p => p.parameter === 'IgnoreHitPause').length, 1);
  assert.match(parameterLine(parameters.find(p => p.parameter === 'IgnoreHitPause')), /^; /);
  const posType = parameters.find(p => p.parameter === 'PosType');
  assert.equal(posType.variants.find(v => v.environment.compatibility_profile?.includes('mugen-compat-1.1')).default[0].value, 'None');
  assert.equal(posType.variants.find(v => v.environment.compatibility_profile?.includes('mugen-compat-1.0')).default[0].value, 'P1');
  const hitDef = readJSON('src/content/state-controllers/HitDef.json');
  assert.equal(hitDef.parameter.find(p => p.parameter === 'HitFlag').default[0].kind, 'literal');
  assert.equal(hitDef.parameter.find(p => p.parameter === 'Fall.XVelocity').default[0].kind, 'none');
  assert.equal(hitDef.parameter.find(p => p.parameter === 'HitOnce').default[0].kind, 'derived');
  assert.equal(hitDef.parameter.find(p => p.parameter === 'Down.HitTime').default[0].kind, 'unknown');
});
