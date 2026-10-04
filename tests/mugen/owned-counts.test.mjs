import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('owned-counts-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('owned count migration retains every legacy field and both valid count examples',()=>{
 for(const entry of plan.documents){
  const before=readJSON(`tests/mugen/batches/owned-counts-01/json/triggers/${entry.name}.json`),after=data[entry.name];
  assert.deepEqual(after,addFields(before,entry.additions));
  for(const field of ['description','syntax','associated_state','associated_trigger','version','code_sample'])if(field!=='code_sample')assert.deepEqual(after[field],before[field]);
  for(const field of ['quote','code_sample'])for(const [i,item] of (before[field]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
  assert.deepEqual(views[entry.name].code_sample.slice(0,2),before.code_sample);assert.equal(after.page.introduced_in,null);
 }
});

test('owned counts publish optional integer arguments with bare and filtered forms, without pseudo parameters',()=>{
 for(const [name,value] of Object.entries(data)){
  const view=views[name];assert.deepEqual(view.syntax,[name,`${name}(exprn)`]);assert.equal(value.syntax_kind,'function');assert.deepEqual(value.return_type,['int']);
  assert.equal(view.parameter.length,1);assert.equal(view.parameter[0].parameter_type,'optional');assert.deepEqual(value.arguments[0].type,['int']);
  assert.equal(value.arguments[0].expression_policy,'expression');assert.ok(!('default' in value.arguments[0]));
  assert.ok(view.description.includes('一意IDとは別'));assert.ok(publicNotes(value).some(n=>n.content.includes('個数')&&n.content.includes('= 0')));
 }
});

test('NumHelper filtering excludes zero from specific IDs and preserves root ownership research',()=>{
 assert.ok(views.NumHelper.description.includes('正のID')&&views.NumHelper.description.includes('0以下'));
 assert.ok(data.NumHelper.notes.some(n=>n.evidence.status==='conflicting'&&n.content.includes('ID=0')));
 assert.ok(data.NumHelper.notes.some(n=>n.visibility==='internal'&&n.content.includes('同じRoot')&&n.content.includes('Parent')));
 assert.deepEqual(views.NumHelper.code_sample[2].code,['Trigger1 = NumHelper(1234) > 0','Trigger1 = Helper(1234), Time > 20']);
});

test('NumTarget uses TargetID and retains official Explod example mismatch internally',()=>{
 assert.ok(views.NumTarget.description.includes('HitDef')&&views.NumTarget.description.includes('0以上')&&views.NumTarget.description.includes('-1以下'));
 assert.deepEqual(views.NumTarget.code_sample[0].code,['Trigger1 = NumTarget >= 2']);
 assert.deepEqual(views.NumTarget.code_sample[2].code,['Trigger1 = NumTarget(1234) > 0','Trigger1 = Target(1234), Life > 0']);
 assert.ok(data.NumTarget.notes.some(n=>n.visibility==='internal'&&n.content.includes('Examples欄')&&n.content.includes('NumExplod')));
 assert.ok(data.NumTarget.notes.some(n=>n.visibility==='internal'&&n.content.includes('上限8')&&n.content.includes('上書き')));
});

test('NumExplod includes all negative IDs in total count and keeps documentary errors separate from zero counts',()=>{
 assert.ok(views.NumExplod.description.includes('所有')&&views.NumExplod.description.includes('0以上')&&views.NumExplod.description.includes('-1以下'));
 assert.deepEqual(views.NumExplod.code_sample[2].code,['Trigger1 = NumExplod(1234) = 0']);
 for(const value of Object.values(data)){
  const errors=publicNotes(value).filter(n=>n.kind==='error');assert.equal(errors.length,1);assert.ok(errors[0].content.includes('bottom')&&errors[0].content.includes('0とは区別'));
  assert.deepEqual(errors[0].environment.runtime,['mugen-1.0','mugen-1.1']);
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});
