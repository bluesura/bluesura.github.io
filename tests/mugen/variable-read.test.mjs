import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { normalizeDocument, publicNotes, effectiveSyntax, effectiveAssociatedStates } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('variable-read-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, normalizeDocument(value, [readJSON('src/data/common/Persistent.json')])]));

test('document syntax and associated-state overrides reject malformed data and preserve legacy fallbacks and source immutability', () => {
  const schema = createDocumentSchema('triggers', readJSON('src/data/engine-versions.json'));
  const original = { trigger: 'Example', category: 'trigger', page: {}, description: 'legacy', syntax: ['Example(式) := 式'], associated_state: ['ExampleSet'], associated_trigger: ['Var'] };
  assert.deepEqual(effectiveSyntax(original), original.syntax);
  assert.deepEqual(effectiveAssociatedStates(original), original.associated_state);
  const corrected = { ...original, documentation: { description: 'public', syntax: ['Example(式)'], associated_state: [] } };
  assert.equal(schema.safeParse(corrected).success, true);
  const view = normalizeDocument(corrected);
  assert.deepEqual(view.syntax, ['Example(式)']);
  assert.deepEqual(view.associated_state, []);
  assert.deepEqual(view.associated_trigger, ['Var']);
  assert.deepEqual(corrected.syntax, ['Example(式) := 式']);
  assert.deepEqual(corrected.associated_state, ['ExampleSet']);
  for (const syntax of [[], [''], 'Example(式)', [2]]) assert.equal(schema.safeParse({ ...corrected, documentation: { description: 'public', syntax } }).success, false);
  for (const associated_state of [[''], 'ExampleSet', [2]]) assert.equal(schema.safeParse({ ...corrected, documentation: { description: 'public', associated_state } }).success, false);
});

test('all variable triggers retain complete original text, syntax, relations, histories, images and code examples', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/variable-read-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before, entry.additions));
    for (const field of ['description', 'syntax', 'associated_state', 'associated_trigger', 'version', 'parameter', 'sample_code']) assert.deepEqual(after[field], before[field]);
    for (const field of ['images', 'code_sample', 'qanda']) for (const [index, value] of (before[field] ?? []).entries()) for (const key of Object.keys(value)) assert.deepEqual(after[field][index][key], value[key]);
    assert.equal(after.page.introduced_in, null);
  }
});

test('variable readers distinguish integer index bounds from float return types without adding common state parameters', () => {
  for (const [name, maximum, type] of [['Var', '59', 'int'], ['FVar', '39', 'float'], ['SysVar', '4', 'int'], ['SysFVar', '4', 'float']]) {
    const document = data[name];
    const view = views[name];
    assert.deepEqual(document.return_type, [type]);
    assert.equal(document.syntax_kind, 'function');
    assert.equal(view.parameter.length, 1);
    const [argument] = view.parameter;
    assert.equal(argument.parameter, 'N');
    assert.deepEqual(argument.type, ['int']);
    assert.equal(argument.parameter_type, 'required');
    assert.equal(argument.expression_policy, 'expression');
    assert.deepEqual(argument.min_value, ['0']);
    assert.deepEqual(argument.max_value, [maximum]);
    assert.ok(argument.description.includes(`0～${maximum}`));
    assert.ok(!argument.description.includes('警告の原因になりやすい'));
    assert.ok(!view.parameter.some(parameter => parameter.parameter === 'Persistent'));
  }
});

test('system variable public syntax removes unsupported expression assignment and phantom controller links while retaining beta repair', () => {
  for (const name of ['SysVar', 'SysFVar']) {
    const document = data[name];
    const view = views[name];
    assert.deepEqual(view.syntax, [`${name}(式)`]);
    assert.ok(document.syntax.some(syntax => syntax.includes(':=')));
    assert.ok(document.associated_state.length === 2);
    assert.deepEqual(view.associated_state, []);
    assert.ok(!view.page.category[1].includes('代入'));
    assert.ok(view.description.includes('common1.cns'));
    assert.ok(view.description.includes('SysVar/SysFVarには使用できません'));
    const repair = publicNotes(document).find(note => note.kind === 'version_change');
    assert.equal(repair.at, 'mugen-1.1-b1');
    assert.equal(repair.change, 'fixed');
    assert.ok(repair.content.includes('対応追加を意味する履歴ではありません'));
    assert.ok(document.notes.some(note => note.kind === 'research' && note.content.includes('Format欄') && note.evidence.status === 'conflicting'));
  }
});

test('bottom guidance scopes runtime families and preserves special-form exceptions without claiming a tested WinMUGEN boundary', () => {
  for (const document of Object.values(data)) {
    const legacy = document.notes.find(note => note.legacy_index === 0);
    assert.equal(legacy.kind, 'research');
    assert.equal(legacy.visibility, 'internal');
    assert.equal(legacy.evidence.status, 'unverified');
    const bottom = publicNotes(document).find(note => note.legacy_index === 1);
    assert.deepEqual(bottom.environment, { engine: 'mugen', runtime: ['mugen-1.0', 'mugen-1.1'] });
    assert.ok(bottom.content.includes('Cond/IfElse') && bottom.content.includes('常に式全体へ波及するとは限りません'));
    assert.ok(publicNotes(document).some(note => note.content.includes('2002.04.14の公式資料') && note.content.includes('SFalse')));
    assert.ok(!publicNotes(document).some(note => note.content.includes('WinMUGEN')));
    assert.ok(document.notes.filter(note => note.kind === 'research').every(note => note.visibility === 'internal'));
  }
  assert.ok(data.Var.notes.some(note => note.legacy_index === 2 && note.kind === 'research'));
});

test('legacy diagrams and incomplete applications remain internal and public normal-variable examples demonstrate explicit assignment and comparison', () => {
  for (const view of Object.values(views)) assert.deepEqual(view.images, []);
  assert.equal(views.Var.qanda.length, 2);
  for (const name of ['Var', 'FVar']) {
    assert.equal(views[name].code_sample.length, 2);
    const sample = views[name].code_sample.at(-1);
    assert.ok(sample.code.includes('Type = Null'));
    const value = name === 'Var' ? '5' : '0.5';
    assert.ok(sample.code.includes(`Trigger1 = (${name}(0) := ${value}) = ${value}`));
    assert.ok(sample.description.includes('1.0/1.1'));
    assert.ok(publicNotes(data[name]).some(note => note.content.includes(name === 'Var' ? '整数へ切り詰めてから' : '右辺を浮動小数点数へ変換')));
  }
});
