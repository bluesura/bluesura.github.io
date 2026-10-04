import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('projectile-times-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('projectile elapsed-time migration preserves all old fields, titles and codes including the cancellation bug',()=>{
 for(const entry of plan.documents){
  const before=readJSON(`tests/mugen/batches/projectile-times-01/json/triggers/${entry.name}.json`),after=data[entry.name];
  assert.deepEqual(after,addFields(before,entry.additions));
  for(const field of ['summary','description','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[field],before[field]);
  for(const field of ['quote','code_sample'])for(const [i,item] of before[field].entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'function');assert.deepEqual(after.return_type,['int']);
 }
});
test('elapsed-time readers require a ProjID expression, use zero as a wildcard and coerce negative IDs rather than fixing the return value',()=>{
 for(const [name,value] of Object.entries(data)){
  assert.deepEqual(views[name].syntax,[`${name}(exprn)`]);assert.equal(value.arguments.length,1);
  const arg=value.arguments[0];assert.equal(arg.parameter_type,'required');assert.deepEqual(arg.type,['int']);assert.equal(arg.expression_policy,'expression');assert.ok(!('default' in arg));
  assert.ok(views[name].description.includes('負のIDは0として扱います')&&views[name].description.includes('戻り値を固定で0にする指定ではありません'));
  assert.ok(views[name].description.includes('ID 0はID照合を行わない')&&views[name].description.includes('NumProjID(0)とは異なります'));
 }
});
test('contact, hit and guarded time readers distinguish the most recent contact record from projectile creation and per-ID history search',()=>{
 for(const name of ['ProjContactTime','ProjHitTime','ProjGuardedTime']){
  assert.ok(views[name].description.includes('最後に接触したProjectileの記録')&&views[name].description.includes('最後に生成した弾を調べる機能ではありません'));
  assert.ok(views[name].description.includes('その記録のIDと指定IDが一致')&&views[name].description.includes('条件に該当する記録がないときは-1'));
  assert.ok(data[name].notes.some(n=>n.visibility==='internal'&&n.content.includes('独立した過去履歴を検索できるとは記述しません')));
 }
 assert.ok(views.ProjContactTime.description.includes('ヒットとガードの両方'));assert.ok(views.ProjHitTime.description.includes('ガードの経過時間はProjGuardedTime'));assert.ok(views.ProjGuardedTime.description.includes('ヒットの経過時間はProjHitTime'));
});
test('zero-based samples guard against the negative sentinel and preserve conflicting original equals-one examples internally',()=>{
 for(const [name,value] of Object.entries(data)){
  const before=readJSON(`tests/mugen/batches/projectile-times-01/json/triggers/${name}.json`),id=name==='ProjCancelTime'?0:1234;
  assert.equal(value.code_sample[0].visibility,'internal');assert.deepEqual(value.code_sample[0].code,before.code_sample[0].code);
  assert.deepEqual(views[name].code_sample[0],before.code_sample[1]);
  assert.deepEqual(views[name].code_sample[1].code,[`Trigger1 = ${name}(${id}) = 0`]);
  assert.ok(views[name].description.includes('0以上かどうかも確認'));
  assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.evidence.status==='conflicting'&&n.content.includes('旧code_sample[0]')));
  if(id!==0)assert.deepEqual(views[name].code_sample[2].code,[`Trigger1 = ${name}(1234) >= 0 && ${name}(1234) < 15`]);
 }
});
test('cancellation keeps the documented WinMUGEN ID bug scoped and does not promise a per-cancelled-ID example',()=>{
 const notes=publicNotes(data.ProjCancelTime),bug=notes.find(n=>n.kind==='bug');assert.equal(bug.legacy_index,0);assert.deepEqual(bug.environment.runtime,['winmugen']);
 assert.ok(bug.content.includes('直前に命中したProjectileのProjID')&&bug.content.includes('ProjCancelTime(0)'));
 assert.equal(notes.filter(n=>n.legacy_index===0).length,1);assert.ok(!views.ProjCancelTime.code_sample.some(s=>s.code.some(c=>c.includes('(1234)'))));
 assert.ok(data.ProjCancelTime.notes.some(n=>n.visibility==='internal'&&n.content.includes('1.0/1.1で修正済み/同じバグとは断定しません')));
});
test('modern bottom errors remain separate from integer sentinels, and parsing, resets and official naming discrepancies remain research',()=>{
 for(const [name,value] of Object.entries(data)){
  const err=publicNotes(value).find(n=>n.kind==='error');assert.deepEqual(err.environment.runtime,['mugen-1.0','mugen-1.1']);assert.ok(err.content.includes('-1')&&err.content.includes('0（発生直後）'));
  assert.ok(publicNotes(value).some(n=>n.content.includes(`Root, ${name}(`)));
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.content.includes('SFalse')));
 }
 assert.ok(data.ProjGuardedTime.notes.some(n=>n.visibility==='internal'&&n.content.includes('Format欄がProjCancelTime(exprn)')));
 assert.ok(data.ProjHitTime.notes.some(n=>n.visibility==='internal'&&n.content.includes('本文に経過時間を返す名前としてProjHit')));
});
