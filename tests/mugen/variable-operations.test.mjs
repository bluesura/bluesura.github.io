import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const plan = loadPlan('variable-operations-01');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/state-controllers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, document]) => [name, normalizeDocument(document, common)]));

test('variable controllers retain all original prose, defaults, requirements, duplicate value names and loading annotations', () => {
  for (const entry of plan.documents) {
    const old = readJSON(`tests/mugen/batches/variable-operations-01/json/state-controllers/${entry.name}.json`);
    const document = data[entry.name];
    assert.deepEqual(document, addFields(old, entry.additions));
    assert.equal(document.description, old.description);
    assert.deepEqual(document.version, old.version);
    for (const [index, parameter] of old.parameter.entries()) {
      for (const key of Object.keys(parameter)) assert.deepEqual(document.parameter[index][key], parameter[key]);
      assert.equal(document.parameter[index].load_priority_evidence.status, 'confirmed');
      assert.deepEqual(document.parameter[index].load_priority_evidence.basis, ['maintainer_report']);
    }
    assert.deepEqual(document.parameter.slice(4).map(parameter => parameter.load_priority), [['2 ;先に()内がロードされます。'], ['2 ;先に()内がロードされます。']]);
    assert.equal(document.page.introduced_in, null);
  }
  assert.ok(data.ParentVarSet.parameter.slice(0, 4).every(parameter => parameter.parameter_type === 'optional'));
});

test('selected variable forms require their number and value without activating a guessed default or all alternatives', () => {
  for (const view of Object.values(views)) {
    const parameters = view.parameter.slice(0, 6);
    assert.deepEqual(parameters.map(parameter => parameter.parameter_type), ['required', 'required', 'required', 'required', 'instead', 'instead']);
    assert.ok(parameters.every(parameter => parameter.default.every(value => value.kind === 'required')));
    assert.deepEqual(parameters.map(parameter => parameter.expression_policy), ['expression', 'expression', 'expression', 'expression', 'special_syntax', 'special_syntax']);
    assert.ok(parameters[0].description.includes('0～59'));
    assert.ok(parameters[2].description.includes('0～39') && parameters[2].description.includes('番号自体は整数'));
    assert.deepEqual(parameters.map(parameter => parameter.type), [['int'], ['int'], ['int'], ['float'], ['int', 'int'], ['int', 'float']]);
    const selectors = ['v', '; fv', '; var(番号)', '; fvar(番号)'];
    assert.deepEqual(view.constraints.find(constraint => constraint.kind === 'one_of').parameters, selectors);
    assert.deepEqual(view.constraints.filter(constraint => constraint.kind === 'requires').map(constraint => constraint.parameters), [['v', 'value'], ['; fv', '; value']]);
    const lines = copyLines(view, view.parameter);
    assert.ok(lines.slice(3, 9).every(line => line.startsWith('; ') && !line.includes('?')));
    assert.ok(!lines.some(line => /^(v|fv|value|var\(|fvar\(|; var\([^)]*\)\s*=\s*[-\d])/.test(line)));
    assert.ok(!lines.some(line => /^(sysvar|sysfvar)/.test(line)));
    assert.equal(lines.at(-2), 'IgnoreHitPause'.padEnd(27) + '= 0');
    assert.equal(lines.at(-1), 'Persistent'.padEnd(27) + '= 1');
  }
});

test('VarAdd and ParentVarAdd explain addition even with equals syntax while ParentVarSet explains replacement', () => {
  for (const name of ['VarAdd', 'ParentVarAdd']) {
    const view = views[name];
    assert.equal(view.parameter[1].value[0], '整数加算量');
    assert.ok(view.parameter[1].description.includes('加算する量'));
    assert.ok(!view.parameter[1].description.includes('代入値'));
    assert.ok(view.parameter[4].description.includes('var(0)へ1を加算'));
    assert.ok(view.parameter[5].description.includes('fvar(0)へ0.5を加算'));
    assert.ok(publicNotes(data[name]).some(note => note.content.includes('指定値への置き換えにはなりません')));
  }
  assert.equal(views.ParentVarSet.parameter[1].value[0], '整数代入値');
  assert.ok(views.ParentVarSet.parameter[4].description.includes('var(0)へ1を代入'));
  assert.ok(views.ParentVarSet.parameter[5].description.includes('fvar(0)へ0.5を代入'));
});

test('parent controllers target the immediate parent including a Helper parent and separate beta crash repair from sysvar support', () => {
  for (const name of ['ParentVarSet', 'ParentVarAdd']) {
    const document = data[name];
    const view = views[name];
    assert.ok(view.description.includes('親は必ずしも本体（Root）ではありません'));
    assert.ok(view.description.includes('実行者がHelperでなければ何もしません'));
    const notes = publicNotes(document);
    assert.ok(notes.some(note => note.kind === 'warning' && note.content.includes('相手がHelperなら、その直近の親')));
    const limitation = notes.find(note => note.kind === 'limitation');
    assert.deepEqual(limitation.environment, { engine: 'mugen', runtime: ['mugen-1.1'] });
    assert.ok(limitation.content.includes('使用できません'));
    const repair = notes.find(note => note.kind === 'version_change');
    assert.equal(repair.at, 'mugen-1.1-b1');
    assert.equal(repair.change, 'fixed');
    assert.equal(repair.environment, undefined);
    assert.ok(repair.content.includes('解析時クラッシュ') && repair.content.includes('対応追加を意味する履歴ではありません'));
    assert.deepEqual(repair.evidence.basis, ['official_history']);
  }
  assert.ok(publicNotes(data.VarAdd).some(note => note.kind === 'warning' && note.content.includes('相手自身')));
});

test('old case errors, warning text and stopped VarAdd behavior stay internal without asserting a tested version boundary', () => {
  for (const document of Object.values(data)) {
    const legacyNotes = document.notes.filter(note => note.legacy_index !== undefined);
    assert.deepEqual(legacyNotes.map(note => note.legacy_index), document.version.map((_, index) => index));
    assert.ok(legacyNotes.every(note => note.kind === 'research' && note.visibility === 'internal' && note.evidence.status === 'unverified'));
    assert.ok(legacyNotes.every(note => note.at === undefined && note.environment === undefined));
    assert.ok(!JSON.stringify(publicNotes(document)).includes('OUT OF RANGE'));
    assert.ok(!JSON.stringify(publicNotes(document)).includes('大文字'));
  }
  assert.ok(data.VarAdd.notes.some(note => note.visibility === 'internal' && note.content.includes('ヒット硬直')));
  assert.ok(!JSON.stringify(publicNotes(data.VarAdd)).includes('値が変化しない'));
  assert.ok(data.VarAdd.notes.some(note => note.content.includes('sysvar/sysfvarも挙げています') && note.evidence.status === 'unverified'));
});

test('published examples choose one valid integer or float form and document the alternate without executing both', () => {
  for (const [name, view] of Object.entries(views)) {
    const [integer, float] = view.code_sample;
    assert.ok(integer.code.includes(`Type = ${name}`) && float.code.includes(`Type = ${name}`));
    assert.deepEqual(integer.code.filter(line => /^(v|value)\s*=/.test(line)), ['v = 0', 'value = 1']);
    assert.ok(!integer.code.some(line => /^(fv|f?var\()/.test(line)));
    assert.ok(float.code.includes(`fvar(0) = ${name === 'ParentVarSet' ? '0.5' : '-0.5'}`));
    assert.ok(!float.code.some(line => /^(fv|value)\s*=/.test(line)));
    if (name !== 'VarAdd') assert.ok(integer.description.includes('Helperのステート'));
  }
});
