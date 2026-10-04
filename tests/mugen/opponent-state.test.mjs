import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('opponent-state-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, normalizeDocument(value, [readJSON('src/data/common/Persistent.json')])]));

test('opponent state migration retains original fields, all sample lines and source URLs', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/opponent-state-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before, entry.additions));
    for (const field of ['description','syntax','associated_state','associated_trigger','version']) assert.deepEqual(after[field], before[field]);
    for (const field of ['code_sample','quote']) for (const [i,item] of before[field].entries()) for (const key of Object.keys(item)) assert.deepEqual(after[field][i][key], item[key]);
    assert.equal(after.page.introduced_in, null);
    assert.deepEqual(after.return_type, ['int']);
    assert.ok(!views[entry.name].parameter.some(p => ['Persistent','IgnoreHitPause'].includes(p.parameter)));
  }
});

test('opponent state number is nullary while type triggers require literal comparisons', () => {
  assert.equal(data.P2StateNo.syntax_kind, 'nullary');
  assert.deepEqual(data.P2StateNo.arguments, []);
  assert.deepEqual(views.P2StateNo.parameter, []);
  assert.deepEqual(views.P2StateNo.syntax, ['P2StateNo']);
  for (const name of ['P2StateType','P2MoveType']) {
    assert.equal(data[name].syntax_kind, 'old_style');
    assert.deepEqual(data[name].arguments.map(a => a.name), ['[oper]', name==='P2StateType'?'state_type':'move_type']);
    assert.ok(data[name].arguments.every(a => a.expression_policy==='special_syntax' && a.parameter_type==='required'));
    assert.ok(data[name].arguments[0].description.includes('他の比較演算子は使えません'));
  }
  assert.ok(views.P2StateType.syntax.includes('P2StateType = L'));
  assert.ok(views.P2StateType.parameter[1].description.includes('L'));
  assert.ok(views.P2StateType.associated_state.includes('L'));
  assert.ok(views.P2MoveType.description.includes('立ち姿勢だけを意味する値ではありません'));
});

test('missing P2 is distinguished from integer zero only for documented state readers', () => {
  for (const name of ['P2StateNo','P2StateType']) {
    const error = publicNotes(data[name]).find(n => n.kind==='error');
    assert.ok(error.content.includes('通常の整数0とは区別'));
    assert.ok(error.content.includes('条件式全体の評価結果がbottom'));
    assert.deepEqual(error.environment.runtime, ['mugen-1.0','mugen-1.1']);
    assert.ok(data[name].notes.some(n => n.kind==='research' && n.content.includes('SFalse') && n.evidence.status==='conflicting'));
  }
  assert.equal(data.P2StateNo.notes.find(n => n.legacy_index===0).visibility, 'internal');
  assert.ok(data.P2StateType.description.includes('存在しない場合は0'));
  assert.ok(!views.P2StateType.description.includes('存在しない場合は0'));
  assert.ok(!publicNotes(data.P2MoveType).some(n => n.kind==='error' || n.content.includes('bottom')));
  assert.ok(data.P2MoveType.notes.some(n => n.content.includes('不在時エラー条件の記載がない') && n.evidence.status==='unverified'));
});

test('public opponent examples reference their trigger and preserve unrelated old Helper code internally', () => {
  assert.deepEqual(data.P2StateType.code_sample[0].code, ['[State 0]','Type     = DestroySelf','Trigger1 = IsHelper']);
  for (const [name, value] of Object.entries(data)) {
    assert.equal(value.code_sample[0].visibility, 'internal');
    assert.ok(views[name].code_sample.length>0);
    assert.ok(views[name].code_sample.every(s => s.code.every(line => line.startsWith('Trigger1 = '+name))));
  }
  assert.ok(data.P2StateNo.associated_state.includes('HitOverride'));
  assert.ok(views.P2StateNo.associated_state.includes('HitOverRide'));
  assert.ok(!views.P2StateNo.associated_state.includes('HitOverride'));
});

test('opponent selection and introduction research remain internal without a runtime verification claim', () => {
  for (const value of Object.values(data)) {
    const research = value.notes.filter(n => n.kind==='research');
    assert.ok(research.every(n => n.visibility==='internal'));
    assert.ok(research.some(n => n.content.includes('HelperType=Player') && n.content.includes('StateNo=5150') && n.content.includes('EnemyNear') && n.evidence.status==='unverified'));
    assert.ok(value.notes.every(n => !n.evidence.tested_on && !n.evidence.basis.includes('runtime_test')));
    assert.ok(!publicNotes(value).some(n => n.kind==='research'));
  }
});
