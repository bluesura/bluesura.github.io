import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('projectile-events-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('projectile event migration preserves legacy descriptions, syntax and examples',()=>{
 for(const entry of plan.documents){
  const before=readJSON(`tests/mugen/batches/projectile-events-01/json/triggers/${entry.name}.json`),after=data[entry.name];
  assert.deepEqual(after,addFields(before,entry.additions));
  for(const field of ['description','syntax','associated_state','associated_trigger','version'])assert.deepEqual(after[field],before[field]);
  for(const field of ['quote','code_sample'])for(const [i,item] of (before[field]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'old_style');assert.deepEqual(after.return_type,['int']);
 }
});
test('projectile events expose suffix IDs and paired comparison arguments without inventing a function call',()=>{
 for(const [name,value] of Object.entries(data)){
  assert.deepEqual(views[name].syntax,[`${name} = 1`,`${name}1234 = 1`,`${name}1234 = 1, < 15`,`${name}1234 = 0, < 15`]);
  const [id,expected,operator,time]=value.arguments;assert.equal(value.arguments.length,4);
  assert.equal(id.expression_policy,'special_syntax');assert.equal(id.parameter_type,'optional');assert.ok(id.description.includes('省略または0で全Projectile'));
  assert.deepEqual(expected.type,['boolean']);assert.equal(expected.parameter_type,'required');assert.equal(expected.expression_policy,'constant_only');
  assert.equal(operator.expression_policy,'special_syntax');assert.ok(operator.description.includes('引用符で囲む文字列ではありません'));
  assert.ok(operator.description.includes('=、!=、&lt;、&gt;、&lt;=、&gt;='));
  assert.deepEqual(time.type,['int']);assert.equal(time.parameter_type,'optional');assert.equal(time.expression_policy,'constant_only');assert.ok(time.description.includes('[oper]と組'));
  assert.ok(views[name].description.includes('NumProjID(0)とは異なります'));
 }
});
test('projectile events separate boolean conditions, event types and zero-based elapsed time',()=>{
 for(const [name,view] of Object.entries(views)){
  assert.ok(view.description.includes('比較条件全体として整数の')&&view.description.includes('0以上')&&view.description.includes('直後はn = 0'));
  assert.ok(view.description.includes('0でその条件の否定')&&view.description.includes(`${name}Time(exprn)`));
  assert.deepEqual(view.code_sample.at(-1).code,[`Trigger1 = ${name}1234 = 1, < 15`]);assert.ok(view.code_sample.at(-1).title.includes('経過0〜14'));
 }
 assert.ok(views.ProjContact.description.includes('ヒットとガードの両方'));assert.ok(views.ProjHit.description.includes('ガードの判定はProjGuarded'));assert.ok(views.ProjGuarded.description.includes('ヒットの判定はProjHit'));
});
test('contact parenthesized legacy examples are retained internally while public examples keep suffix and negation semantics',()=>{
 const before=readJSON('tests/mugen/batches/projectile-events-01/json/triggers/ProjContact.json');
 for(const i of [0,1]){assert.deepEqual(data.ProjContact.code_sample[i].code,before.code_sample[i].code);assert.equal(data.ProjContact.code_sample[i].visibility,'internal');}
 assert.deepEqual(views.ProjContact.code_sample[0].code,['Trigger1 = ProjContact1234 = 1']);
 assert.deepEqual(views.ProjContact.code_sample[1].code,['Trigger1 = ProjContact456 = 0, < 15']);
 assert.ok(data.ProjContact.notes.some(n=>n.visibility==='internal'&&n.content.includes('無効な構文と断定して削除しません')));
 for(const name of ['ProjHit','ProjGuarded']){
  const original=readJSON(`tests/mugen/batches/projectile-events-01/json/triggers/${name}.json`);
  assert.deepEqual(views[name].code_sample.slice(0,2),original.code_sample);
 }
 assert.ok(data.ProjHit.notes.some(n=>n.visibility==='internal'&&n.content.includes('any of the player')));
});
test('projectile ownership and repeated events are public while resets and syntax conflicts stay internal research',()=>{
 for(const [name,value] of Object.entries(data)){
  const visible=publicNotes(value);assert.equal(visible.length,2);assert.ok(visible.some(n=>n.content.includes('多段Projectile')));
  assert.ok(visible.some(n=>n.content.includes('Rootの所有')&&n.content.includes(`Root, ${name}1234 = 1`)));
  assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));
  assert.ok(value.notes.some(n=>n.visibility==='internal'&&n.content.includes('リセット')));
  assert.ok(value.notes.some(n=>n.evidence.status==='conflicting'&&n.content.includes('計算式')));
  assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  assert.ok(value.quote.filter(q=>q.source_type==='community_documentation').every(q=>q.visibility==='internal'));
 }
});
