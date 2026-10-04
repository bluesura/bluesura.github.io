import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('resource-read-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, normalizeDocument(value, [readJSON('src/data/common/Persistent.json')])]));

test('resource readers retain every original description, history, diagram, relation and sample', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/resource-read-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before, entry.additions));
    for (const field of ['description', 'syntax', 'associated_state', 'associated_trigger', 'version', 'qanda']) assert.deepEqual(after[field], before[field]);
    for (const field of ['images', 'code_sample', 'quote']) for (const [index, item] of before[field].entries()) for (const key of Object.keys(item)) assert.deepEqual(after[field][index][key], item[key]);
    assert.equal(after.page.introduced_in, null);
  }
});

test('resource readers are nullary integer triggers and never acquire common controller parameters', () => {
  for (const name of Object.keys(data)) {
    assert.deepEqual(data[name].arguments, []);
    assert.deepEqual(data[name].return_type, ['int']);
    assert.equal(data[name].syntax_kind, 'nullary');
    assert.deepEqual(views[name].syntax, [name]);
    assert.deepEqual(views[name].parameter, []);
    assert.ok(views[name].description.includes('引数はありません'));
  }
});

test('LifeMax distinguishes effective maximum and integer quotient from fractional comparisons', () => {
  const view = views.LifeMax;
  assert.ok(view.description.includes('チームモードなどでは異なる'));
  const note = publicNotes(data.LifeMax).find(note => note.content.includes('LifeMax / 4'));
  assert.deepEqual(note.environment, { engine: 'mugen', runtime: ['mugen-1.0', 'mugen-1.1'] });
  assert.ok(note.content.includes('整数同士の除算') && note.content.includes('除数0'));
  assert.deepEqual(view.code_sample.map(sample => sample.code[0]), ['Trigger1 = Life < LifeMax / 4', '[StateDef -2]', '[StateDef -2]', 'Trigger1 = Life < LifeMax * 0.25']);
  assert.ok(!view.code_sample.some(sample => sample.code.some(line => line.startsWith('Persistent'))));
  assert.ok(data.LifeMax.notes.some(note => note.visibility === 'internal' && note.content.includes('Persistent = 45') && note.evidence.status === 'conflicting'));
  assert.ok(data.LifeMax.notes.some(note => note.visibility === 'internal' && note.content.includes('LifeMax=1500') && note.content.includes('1000未満')));
});

test('PowerSet changes current amount and public conditions distinguish fixed cost from effective maximum', () => {
  const view = views.Power;
  assert.ok(view.description.includes('必要量が固定'));
  assert.deepEqual(view.code_sample.map(sample => sample.code), [['Trigger1 = Power >= 1000'], ['Trigger1 = Power < PowerMax']]);
  assert.ok(publicNotes(data.Power).some(note => note.content.includes('PowerSetが設定するのは現在量') && note.content.includes('別途設定')));
  assert.ok(data.Power.code_sample[1].code.includes('TriggerAll = Power < 3000'));
  assert.equal(data.Power.code_sample[1].visibility, 'internal');
  assert.equal(views.PowerMax.code_sample[0].code[0], 'Trigger1 = Power < PowerMax / 2');
  assert.equal(views.PowerMax.code_sample[1].code[0], 'Trigger1 = Power < PowerMax * 0.5');
  assert.ok(!views.PowerMax.description.includes('Const(Data.Power)'));
});

test('IKEMEN report, unsettled sharing rules and misleading diagrams remain internal with original evidence', () => {
  for (const [name, value] of Object.entries(data)) {
    assert.deepEqual(views[name].images, []);
    assert.ok(value.notes.filter(note => note.kind === 'research').every(note => note.visibility === 'internal'));
    assert.ok(publicNotes(value).every(note => note.environment.engine === 'mugen'));
    assert.ok(value.notes.every(note => !note.evidence.tested_on && !note.evidence.basis.includes('runtime_test')));
  }
  const oldIssue = data.LifeMax.notes.find(note => note.legacy_index === 0);
  assert.deepEqual(oldIssue.environment, { engine: 'ikemen-go' });
  assert.equal(oldIssue.evidence.status, 'unverified');
  assert.ok(oldIssue.content.includes('固定SHAがない'));
  assert.ok(!publicNotes(data.LifeMax).some(note => note.content.includes('IKEMEN')));
  for (const name of ['Power', 'PowerMax']) {
    assert.equal(data[name].quote[4].visibility, 'internal');
    assert.ok(!views[name].quote.some(quote => quote.url.includes('ikemen-engine')));
    assert.ok(data[name].notes.some(note => note.content.includes('TeamSide') && note.visibility === 'internal'));
  }
});
