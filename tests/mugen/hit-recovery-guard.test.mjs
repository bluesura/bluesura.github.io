import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('hit-recovery-guard-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
test('velocity recovery and guard preserve every original field and only apply reviewed additions',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/hit-recovery-guard-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const f of ['description','summary','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[f],before[f]);
  for(const f of ['qanda','code_sample','quote'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});
test('HitVel uses mandatory space-separated axis syntax and float return without becoming a current velocity reader',()=>{
 for(const axis of ['X','Y']){
  const name=`HitVel${axis}`,value=data[name],view=views[name];assert.equal(value.syntax_kind,'special_form');assert.deepEqual(value.return_type,['float']);assert.deepEqual(view.syntax,[`HitVel ${axis}`]);
  assert.equal(value.arguments.length,1);const a=view.parameter[0];assert.equal(a.name,'[component]');assert.equal(a.expression_policy,'special_syntax');assert.equal(a.parameter_type,'required');assert.ok(a.description.includes('空白の後'));
  assert.ok(view.description.includes(`Vel ${axis}`)&&view.description.includes('現在実際に移動している速度'));
  assert.ok(!view.page.category[1].includes('現在の水平速度'));assert.deepEqual(view.code_sample[0].code,[`Trigger1 = HitVel ${axis} > 0.5`]);
 }
});
test('HitVel preserves incompatible sign descriptions and community uncertainty exclusively in internal notes',()=>{
 for(const name of ['HitVelX','HitVelY']){
  const source=data[name],n=source.notes.find(n=>n.evidence.status==='conflicting');assert.ok(n.content.includes('後方正')&&n.content.includes('上方正')&&n.content.includes('Win版'));
  assert.equal(n.visibility,'internal');assert.ok(!publicNotes(source).includes(n));assert.ok(!views[name].description.includes('上方')&&!views[name].description.includes('後方'));
  assert.ok(source.notes.some(n=>n.evidence.status==='unverified'&&n.content.includes('疑問符')));
 }
});
test('CanRecover separates fall-only permission from input and maps legacy guidance to scoped common source',()=>{
 const v=views.CanRecover,source=data.CanRecover;assert.equal(source.syntax_kind,'nullary');assert.deepEqual(source.return_type,['int']);assert.deepEqual(source.arguments,[]);
 assert.ok(v.description.includes('fall状態以外での戻り値は公式資料では未定義')&&v.description.includes('受身入力や受身ステートへの移行まで完了したとは判断しません'));
 const mapped=source.notes.filter(n=>n.legacy_index!==undefined);assert.deepEqual(mapped.map(n=>n.legacy_index),[0,1]);assert.deepEqual(mapped[1].environment.runtime,['mugen-1.0']);
 assert.ok(mapped[0].content.includes('必須番号ではありません'));assert.ok(mapped[1].content.includes('地面近く'));
 assert.ok(publicNotes(source).some(n=>n.content.includes('Fall.Recover = 0')&&n.content.includes('ヒットシェイクで停止する時間を含みません')));
 assert.ok(v.quote.some(q=>q.url==='https://github.com/fanyer/mugen/blob/b6885c654ba830157f5dd4f257bebfa738300df3/data/common1.cns'));
});
test('confirmed Common example remains available while context-dependent AI and unverified combo FAQ are retained internally',()=>{
 const source=data.CanRecover,v=views.CanRecover;assert.equal(v.code_sample.length,1);assert.deepEqual(v.code_sample[0],source.code_sample[0]);assert.ok(v.code_sample[0].code.includes('triggerall = CanRecover'));
 assert.equal(source.code_sample[1].visibility,'internal');for(const i of [0,1,3])assert.equal(source.qanda[i].visibility,'internal');assert.equal(v.qanda.length,2);assert.deepEqual(v.qanda[0],source.qanda[2]);
 assert.ok(!v.quote.some(q=>q.url.includes('mugenfreeforall')||q.url.includes('simple-ai')||q.url.includes('livedoor')));
 assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('死亡時')&&n.content.includes('疑問符')));
});
test('InGuardDist checks attack range without promising successful guard or inventing a Windows introduction',()=>{
 const source=data.InGuardDist,v=views.InGuardDist;assert.deepEqual(source.arguments,[]);assert.equal(source.syntax_kind,'nullary');assert.ok(v.description.includes('相手が攻撃していなければ0'));
 assert.ok(v.description.includes('既にガードが成立したこと')&&v.description.includes('AttackDistでも変更できます'));assert.deepEqual(v.associated_state,['HitDef','AttackDist']);
 const history=source.notes.find(n=>n.legacy_index===0);assert.equal(history.visibility,'internal');assert.equal(history.evidence.status,'conflicting');assert.equal(source.version[0].no,'?');
 assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('P2Distとの1差')));
 assert.equal(source.code_sample[0].visibility,'internal');assert.deepEqual(v.code_sample[0].code,['Trigger1 = InGuardDist = 1']);
 assert.ok(publicNotes(source).some(n=>n.content.includes('MoveType = A')));
});
