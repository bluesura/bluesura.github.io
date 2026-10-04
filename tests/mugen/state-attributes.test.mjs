import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('state-attributes-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, normalizeDocument(value, [readJSON('src/data/common/Persistent.json')])]));

test('state attribute migration preserves all original prose, syntax, relations, sources and sample lines', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/state-attributes-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before, entry.additions));
    for (const field of ['description','syntax','associated_state','associated_trigger']) assert.deepEqual(after[field], before[field]);
    for (const field of ['quote','code_sample']) for (const [i,item] of before[field].entries()) for (const key of Object.keys(item)) assert.deepEqual(after[field][i][key], item[key]);
    assert.equal(after.page.introduced_in, null);
    assert.deepEqual(after.return_type, ['int']);
    assert.ok(!views[entry.name].parameter.some(p => ['Persistent','IgnoreHitPause'].includes(p.parameter)));
  }
});

test('StateType and MoveType describe literal comparisons rather than bare numeric readers', () => {
  for (const name of ['StateType','MoveType']) {
    assert.equal(data[name].syntax_kind, 'old_style');
    assert.deepEqual(data[name].arguments.map(a => a.name), ['[oper]',name==='StateType'?'state_type':'move_type']);
    assert.ok(data[name].arguments.every(a => a.expression_policy === 'special_syntax' && a.parameter_type === 'required'));
    assert.ok(data[name].arguments[0].description.includes('!=') && data[name].arguments[0].description.includes('他の比較演算子は使えません'));
    assert.ok(views[name].description.includes('成立なら1、不成立なら0'));
    assert.ok(publicNotes(data[name]).some(n => n.content.includes('U') && n.content.includes('維持')));
  }
  assert.deepEqual(views.MoveType.syntax, ['MoveType = A','MoveType = I','MoveType = H','MoveType != A','MoveType != I','MoveType != H']);
});

test('StateType retains L and distinguishes documentation omissions, introduction and separate physics', () => {
  assert.ok(views.StateType.syntax.includes('StateType = L') && views.StateType.syntax.includes('StateType != L'));
  assert.ok(views.StateType.parameter[1].description.includes('L'));
  assert.ok(views.StateType.associated_state.includes('L'));
  assert.ok(publicNotes(data.StateType).some(n => n.content.includes('Physicsは別の設定')));
  assert.ok(data.StateType.notes.some(n => n.content.includes('1.1で追加されたと推測せず') && n.evidence.status === 'conflicting' && n.visibility === 'internal'));
  assert.deepEqual(views.StateType.code_sample.map(s => s.code[0]), ['Trigger1 = StateType != A','Trigger1 = StateType = L']);
});

test('MoveType I does not promise a standing pose or an inactive character', () => {
  assert.ok(views.MoveType.description.includes('攻撃でもくらいでもない状態'));
  assert.ok(views.MoveType.description.includes('立ち姿勢だけを意味する値ではありません'));
  assert.deepEqual(views.MoveType.code_sample.map(s => s.code[0]), ['Trigger1 = movetype != H','Trigger1 = MoveType = I']);
});

test('Facing uses numbered public trigger examples and distinguishes minus one from false', () => {
  assert.equal(data.Facing.syntax_kind,'nullary');
  assert.deepEqual(data.Facing.arguments,[]);
  assert.deepEqual(views.Facing.parameter,[]);
  assert.equal(data.Facing.code_sample[0].code[0],'Trigger = Facing = -1');
  assert.equal(data.Facing.code_sample[0].visibility,'internal');
  assert.deepEqual(views.Facing.code_sample.map(s => s.code[0]), ['Trigger1 = Facing = -1','Trigger1 = Facing = 1']);
  assert.ok(publicNotes(data.Facing).some(n => n.content.includes('左右どちらでも成立')));
  for (const value of Object.values(data)) {
    assert.ok(value.notes.filter(n => n.kind === 'research').every(n => n.visibility === 'internal'));
    assert.ok(value.notes.every(n => !n.evidence.tested_on && !n.evidence.basis.includes('runtime_test')));
  }
});
