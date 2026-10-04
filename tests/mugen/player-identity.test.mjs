import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('player-identity-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('player identity migration retains every old description, syntax, source and code line',()=>{
 for(const entry of plan.documents){
  const before=readJSON(`tests/mugen/batches/player-identity-01/json/triggers/${entry.name}.json`),after=data[entry.name];
  assert.deepEqual(after,addFields(before,entry.additions));
  for(const field of ['description','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[field],before[field]);
  for(const field of ['quote','code_sample'])for(const [i,item] of (before[field]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.return_type,['int']);
 }
});

test('ID preserves official parameter fragments and guards the complete opponent capture example',()=>{
 assert.equal(data.ID.syntax_kind,'nullary');assert.deepEqual(data.ID.arguments,[]);assert.deepEqual(views.ID.parameter,[]);
 assert.ok(views.ID.description.includes('同じ試合')&&views.ID.description.includes('TargetID'));
 assert.deepEqual(views.ID.code_sample.slice(0,2).map(s=>s.code),[['value = ID'],['value = EnemyNear, ID']]);
 assert.deepEqual(views.ID.code_sample[2].code,['[State 0, Save opponent ID]','Type = VarSet','Trigger1 = NumEnemy > 0','v = 0','value = EnemyNear, ID']);
 assert.ok(data.ID.notes.some(n=>n.visibility==='internal'&&n.content.includes('HelperMax')&&n.content.includes('スロットID')));
});

test('IsHelper keeps the optional bare form distinct from matching the controller helper ID',()=>{
 assert.deepEqual(views.IsHelper.syntax,['IsHelper','IsHelper(exprn)']);assert.equal(data.IsHelper.syntax_kind,'function');
 assert.equal(views.IsHelper.parameter.length,1);assert.equal(views.IsHelper.parameter[0].parameter_type,'optional');
 assert.deepEqual(data.IsHelper.arguments[0].type,['int']);assert.equal(data.IsHelper.arguments[0].expression_policy,'expression');
 assert.ok(!('default' in data.IsHelper.arguments[0]));assert.ok(views.IsHelper.description.includes('一意IDとは別'));
 assert.deepEqual(views.IsHelper.code_sample.map(s=>s.code),[['Trigger1 = !IsHelper'],['Trigger1 = IsHelper(1234)']]);
 assert.ok(data.IsHelper.notes.some(n=>n.content.includes('Arguments欄はnone')&&n.evidence.status==='conflicting'));
});

test('PlayerIDExist requires the unique ID and publishes separate existence and redirect conditions',()=>{
 const value=data.PlayerIDExist,view=views.PlayerIDExist;
 assert.deepEqual(view.syntax,['PlayerIDExist(ID_number)']);assert.equal(view.parameter[0].parameter_type,'required');
 assert.ok(view.description.includes('Helperも対象')&&view.description.includes('TargetID'));
 assert.deepEqual(view.code_sample.map(s=>s.code),[['Trigger1 = PlayerIDExist(var(0))'],['Trigger1 = PlayerIDExist(var(0))','Trigger1 = PlayerID(var(0)), Life > 0']]);
 assert.ok(value.code_sample.slice(0,2).every(s=>s.visibility==='internal'));
 assert.ok(value.code_sample[0].code.includes('Trigger1 = PlayerExist(var(0))'));
 assert.ok(value.code_sample[1].code.includes('TriggerAll    = PlayerIDExist(ID)'));
 assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.content.includes('フリーズ対策')&&n.evidence.status==='unverified'));
});

test('identity error metadata separates ordinary false from bottom and leaves research unpublished',()=>{
 for(const name of ['IsHelper','PlayerIDExist']){
  const errors=publicNotes(data[name]).filter(n=>n.kind==='error');assert.equal(errors.length,1);
  assert.ok(errors[0].content.includes('bottom')&&errors[0].content.includes('0とは区別'));
  assert.deepEqual(errors[0].environment.runtime,['mugen-1.0','mugen-1.1']);
  assert.ok(data[name].notes.some(n=>n.visibility==='internal'&&n.content.includes('SFalse')));
 }
 for(const value of Object.values(data)){
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});
