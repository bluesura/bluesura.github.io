import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('gethit-status-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('gethit predicates preserve original text, metadata, histories and every existing sample',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/gethit-status-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const f of ['description','syntax','summary','associated_trigger','version'])assert.deepEqual(after[f],before[f]);
  for(const f of ['code_sample','qanda','quote'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.return_type,['int']);assert.deepEqual(after.arguments,[]);assert.equal(after.page.introduced_in,null);
  assert.ok(views[e.name].description.includes('MoveType = H')&&views[e.name].description.includes('0 / 1'));assert.deepEqual(views[e.name].parameter,[]);
 }
});
test('shake end and hittime expiry are separated from attack-side pause and animation or controller effects',()=>{
 assert.ok(views.HitShakeOver.description.includes('被弾状態全体やアニメーションが終了したとは判断しません'));
 assert.ok(views.HitOver.description.includes('ステート変更やCtrlの付与は行われません'));
 const note=publicNotes(data.HitShakeOver).find(n=>n.kind==='behavior');assert.ok(note.content.includes('GetHitVar(HitShakeTime)')&&note.content.includes('攻撃側の残り停止時間')&&note.content.includes('guard.pausetime'));
 const h=publicNotes(data.HitOver).find(n=>n.kind==='behavior');assert.ok(h.content.includes('GetHitVar(HitTime) &lt; 0')&&h.content.includes('HitTime = 0だけ'));
 assert.ok(data.HitOver.notes.some(n=>n.kind==='research'&&n.evidence.status==='conflicting'&&n.content.includes('hitshaketime&gt;0')));
});
test('fall guidance keeps undefined output and fall mutation rather than turning the flag into physical descent',()=>{
 assert.ok(views.HitFall.description.includes('戻り値は公式資料では未定義')&&views.HitFall.description.includes('現在のY速度'));
 const n=publicNotes(data.HitFall).find(n=>n.kind==='behavior');assert.ok(n.content.includes('air.fall')&&n.content.includes('HitFallSetで変更'));
 assert.equal(data.HitFall.code_sample[0].visibility,'internal');assert.deepEqual(data.HitFall.code_sample[0].code,['Trigger1 = !HitFall']);
 assert.deepEqual(views.HitFall.code_sample[0].code,['Trigger1 = MoveType = H','Trigger1 = !HitFall']);
 assert.ok(data.HitFall.notes.some(n=>n.visibility==='internal'&&n.content.includes('疑問符')));
});
test('shake examples preserve the valid pair while hiding the unestablished 5000 to 5010 custom transition',()=>{
 assert.deepEqual(views.HitShakeOver.code_sample[0].code,['Trigger1 = MoveType = H','Trigger1 = HitShakeOver = 0']);
 assert.equal(data.HitShakeOver.code_sample[1].visibility,'internal');assert.ok(data.HitShakeOver.code_sample[1].code.includes('Value = 5010'));
 assert.equal(views.HitShakeOver.code_sample.length,2);assert.deepEqual(views.HitShakeOver.code_sample[1].code,['Trigger1 = MoveType = H','Trigger1 = HitShakeOver = 1']);
 assert.ok(data.HitShakeOver.notes.some(n=>n.visibility==='internal'&&n.evidence.status==='conflicting'&&n.content.includes('屈みヒットシェイク')));
 assert.equal(data.HitShakeOver.qanda[0].visibility,'internal');assert.equal(views.HitShakeOver.qanda.length,1);
 assert.ok(views.HitShakeOver.qanda[0].a.includes('残り時間そのもの'));
 assert.deepEqual(views.HitOver.code_sample[0].code,['Trigger1 = HitOver = 1']);assert.deepEqual(views.HitOver.code_sample[1].code,['Trigger1 = MoveType = H','Trigger1 = HitOver = 1']);
});
test('unrelated P1 correction and IKEMEN Lua history remain internal with unverified timing and no invented runtime tests',()=>{
 const source=data.HitShakeOver;assert.deepEqual(source.notes.filter(n=>n.legacy_index!==undefined).map(n=>n.legacy_index),[0,1]);
 assert.ok(source.notes.filter(n=>n.legacy_index!==undefined).every(n=>n.visibility==='internal'));
 const ik=source.notes.find(n=>n.legacy_index===1);assert.equal(ik.environment.engine,'ikemen-go');assert.ok(!publicNotes(source).includes(ik));assert.ok(!views.HitShakeOver.quote.some(q=>q.url.includes('ikemen')));
 for(const value of Object.values(data)){
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>!publicNotes(value).includes(n)));
  assert.ok(value.notes.some(n=>n.evidence.status==='unverified'&&n.content.includes('被弾状態以外')));
 }
});
