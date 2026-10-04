import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('projectile-counts-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
test('projectile counts retain all original fields and the original absence and exactly-one examples',()=>{
 for(const entry of plan.documents){
  const before=readJSON(`tests/mugen/batches/projectile-counts-01/json/triggers/${entry.name}.json`),after=data[entry.name];
  assert.deepEqual(after,addFields(before,entry.additions));
  for(const field of ['description','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[field],before[field]);
  for(const field of ['quote','code_sample'])for(const [i,item] of (before[field]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
  assert.deepEqual(views[entry.name].code_sample[0],before.code_sample[0]);assert.equal(after.page.introduced_in,null);
 }
});
test('NumProj totals are nullary and distinguish projectile ownership from helper counts',()=>{
 assert.equal(data.NumProj.syntax_kind,'nullary');assert.deepEqual(data.NumProj.arguments,[]);assert.deepEqual(views.NumProj.parameter,[]);
 assert.deepEqual(views.NumProj.syntax,['NumProj']);assert.ok(views.NumProj.description.includes('総数')&&views.NumProj.description.includes('Helper数とは別'));
 assert.deepEqual(views.NumProj.code_sample[2].code,['Trigger1 = Root, NumProj > 0']);
});
test('NumProjID requires an integer ProjID and negative IDs refer to zero instead of all projectiles',()=>{
 const view=views.NumProjID;assert.deepEqual(view.syntax,['NumProjID(exprn)']);assert.equal(view.parameter[0].parameter_type,'required');
 assert.deepEqual(data.NumProjID.arguments[0].type,['int']);assert.equal(data.NumProjID.arguments[0].expression_policy,'expression');
 assert.ok(!('default' in data.NumProjID.arguments[0]));assert.ok(view.description.includes('負のIDは0')&&view.description.includes('ProjID 0のProjectileの数'));
 assert.ok(view.description.includes('TargetID')&&view.description.includes('一意PlayerID'));
 assert.deepEqual(view.code_sample[0].code,['Trigger1 = NumProjID(1234) = 1']);
 assert.deepEqual(view.code_sample[2].code,['Trigger1 = Root, NumProjID(1234) > 0']);
});
test('root ownership is public documentary behavior while error history and timing research remain internal',()=>{
 for(const value of Object.values(data)){
  const owner=publicNotes(value).find(n=>n.content.includes('直ちにRoot'));assert.ok(owner);assert.equal(owner.evidence.source_refs.length,3);
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
 assert.ok(!publicNotes(data.NumProj).some(n=>n.kind==='error'));
 const err=publicNotes(data.NumProjID).find(n=>n.kind==='error');assert.ok(err.content.includes('bottom')&&err.content.includes('0とは区別'));
 assert.deepEqual(err.environment.runtime,['mugen-1.0','mugen-1.1']);assert.ok(data.NumProjID.notes.some(n=>n.visibility==='internal'&&n.content.includes('SFalse')));
});
