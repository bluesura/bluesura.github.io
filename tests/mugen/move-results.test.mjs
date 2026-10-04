import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('move-results-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
test('move result triggers preserve original descriptions, images, histories and all existing example fields',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/move-results-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const f of ['description','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','quote'])for(const [i,item] of before[f].entries())for(const key of Object.keys(item))assert.deepEqual(after[f][i][key],item[key]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.return_type,['int']);assert.deepEqual(after.arguments,[]);assert.deepEqual(views[e.name].parameter,[]);
 }
});
test('move result predicates separate hit, guard and reversed victim from reversal success and projectile conditions',()=>{
 assert.ok(views.MoveHit.description.includes('ガードは含みません'));assert.ok(views.MoveGuarded.description.includes('ヒットだけの判定にはMoveHit'));
 assert.ok(views.MoveReversed.description.includes('取られた側の情報')&&views.MoveReversed.description.includes('自分のReversalDefが成立したかを調べる場合はMoveHit'));
 for(const [name,view] of Object.entries(views)){assert.deepEqual(view.syntax,[name]);assert.ok(view.description.includes('Projectileの判定はProj系')&&view.description.includes('MoveType = A'));}
});
test('counter guidance scopes modern behavior, preserves pauses and does not promise a one-frame equals-one condition',()=>{
 for(const [name,view] of Object.entries(views)){
  assert.ok(view.description.includes('MUGEN 1.0 / 1.1')&&view.description.includes('停止していないフレームごとに増加'));
  assert.ok(view.description.includes('必ずしも1フレームだけの条件ではありません'));assert.deepEqual(view.code_sample[1].code,[`Trigger1 = ${name} = 1`]);
  const reset=publicNotes(data[name]).find(n=>n.content.includes('MoveHitPersist = 1'));assert.ok(reset&&reset.content.includes('遷移先のStateDef'));
  if(name==='MoveReversed')assert.ok(!reset.content.includes('MoveHitResetを使います'));else assert.ok(reset.content.includes('MoveHitResetを使います'));
 }
});
test('all four pages hide the misleading shared diagram while retaining image metadata and official simultaneity conflicts',()=>{
 for(const value of [...Object.values(data),readJSON('src/content/triggers/MoveContact.json')]){
  assert.equal(value.images[0].visibility,'internal');assert.equal(value.images[0].src,'mugen-move-contact-triggers-flow.png');assert.ok(value.images[0].alt);assert.deepEqual(normalizeDocument(value,[]).images,[]);
  assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.evidence.status==='conflicting'&&n.content.includes('他の3')));
 }
});
test('2002 history remains documentary, while old platform assignments, IKEMEN and same-frame research stay internal',()=>{
 for(const [name,value] of Object.entries(data)){
  assert.deepEqual(value.notes.filter(n=>n.legacy_index!==undefined).map(n=>n.legacy_index),value.version.map((_,i)=>i));
  assert.ok(value.notes.filter(n=>n.legacy_index!==undefined).every(n=>n.visibility==='internal'));
  const history=publicNotes(value).find(n=>n.kind==='version_change');assert.equal(history.change,name==='MoveReversed'?'added':'changed');assert.ok(history.content.includes('2002.04.14'));assert.ok(!history.at);
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.content.includes('処理')));
 }
 const ik=data.MoveHit.notes.find(n=>n.legacy_index===2);assert.equal(ik.environment.engine,'ikemen-go');assert.ok(!publicNotes(data.MoveHit).includes(ik));
 assert.equal(data.MoveHit.code_sample[3].visibility,'internal');assert.equal(views.MoveHit.code_sample.length,3);
 assert.ok(!views.MoveHit.quote.some(q=>q.url.includes('angelfire')||q.url.includes('ikemen')));assert.ok(!views.MoveReversed.quote.some(q=>q.url.includes('ikemen')));
});
