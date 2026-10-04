import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('state-status-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, normalizeDocument(value, [readJSON('src/data/common/Persistent.json')])]));

test('state status migration retains original prose, syntax, relations and every sample line', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/state-status-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before, entry.additions));
    for (const field of ['description', 'syntax', 'associated_state', 'associated_trigger']) assert.deepEqual(after[field], before[field]);
    for (const field of ['code_sample', 'quote']) for (const [index, item] of before[field].entries()) for (const key of Object.keys(item)) assert.deepEqual(after[field][index][key], item[key]);
    assert.equal(after.page.introduced_in, null);
    assert.deepEqual(after.return_type, ['int']);
    assert.deepEqual(after.arguments, []);
    assert.equal(after.syntax_kind, 'nullary');
    assert.deepEqual(views[entry.name].parameter, []);
    assert.deepEqual(views[entry.name].syntax, [entry.name]);
  }
});

test('Alive keeps unverified KO timing and unsuitable enemy search out of public examples', () => {
  assert.deepEqual(views.Alive.code_sample.map(sample => sample.code[0]), ['[State ]', 'Trigger1 = Alive']);
  assert.ok(views.Alive.description.includes('生存中は1') && views.Alive.description.includes('0'));
  assert.ok(data.Alive.notes.some(note => note.content.includes('終端？') && note.evidence.status === 'unverified'));
  assert.ok(data.Alive.notes.some(note => note.content.includes('EnemyNear(9)') && note.visibility === 'internal'));
  assert.ok(data.Alive.code_sample[1].code.includes('Absolute = 1'));
  assert.equal(data.Alive.code_sample[1].visibility, 'internal');
  assert.equal(data.Alive.code_sample[2].visibility, 'internal');
});

test('Ctrl describes the control flag without claiming it forbids every custom action', () => {
  assert.ok(views.Ctrl.description.includes('すべての入力受付の可否を表す値ではありません'));
  assert.deepEqual(views.Ctrl.code_sample[0].code, ['Trigger1 = Ctrl']);
  assert.ok(publicNotes(data.Ctrl).some(note => note.content.includes('CtrlSet') && note.content.includes('参照するだけ')));
});

test('StateNo public range examples distinguish inclusive and exclusive upper bounds', () => {
  assert.deepEqual(views.StateNo.code_sample.map(sample => sample.code[0]), ['Trigger1 = StateNo = [200,650]', 'Trigger1 = StateNo = [200,650)']);
  assert.ok(views.StateNo.code_sample[0].title.includes('650以下'));
  assert.ok(views.StateNo.code_sample[1].title.includes('650未満'));
  assert.equal(data.StateNo.code_sample[0].visibility, 'internal');
  for (const name of ['StateNo', 'PrevStateNo']) {
    assert.ok(data[name].associated_state.includes('HitOverride'));
    assert.ok(data[name].documentation.associated_state.includes('HitOverRide'));
    assert.ok(!data[name].documentation.associated_state.includes('HitOverride'));
  }
});

test('PrevStateNo accuracy limitation is public while source typos and runtime research remain internal', () => {
  assert.deepEqual(views.PrevStateNo.syntax, ['PrevStateNo']);
  assert.deepEqual(views.PrevStateNo.code_sample[0].code, ['Trigger1 = PrevStateNo = [200,650] ']);
  assert.ok(publicNotes(data.PrevStateNo).some(note => note.kind === 'limitation' && note.content.includes('正確さは保証されていません')));
  assert.ok(data.PrevStateNo.notes.some(note => note.content.includes('Format欄がStateNo') && note.evidence.status === 'conflicting'));
  for (const value of Object.values(data)) {
    assert.ok(value.notes.filter(note => note.kind === 'research').every(note => note.visibility === 'internal'));
    assert.ok(value.notes.every(note => !note.evidence.tested_on && !note.evidence.basis.includes('runtime_test')));
  }
});
