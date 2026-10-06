import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('match-progress-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('match migration retains every original field including the title-less MatchNo and undisplayed MatchOver flag template',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/match-progress-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','sample_code'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['int']);assert.equal(views[e.name].parameter.length,0);
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
 assert.equal(Object.hasOwn(data.MatchNo,'title'),false);
 assert.deepEqual(data.MatchOver.sample_code.code,['[State -2, MatchOverFlag]','Type = VarSet','Trigger1 = MatchOver','Var(59) = 1']);
});

test('MatchNo separates match and round numbers and preserves the continue contradiction as internal evidence',()=>{
 const d=views.MatchNo.description;
 assert.ok(d.includes('現在の試合番号')&&d.includes('ラウンド番号RoundNoとは別')&&d.includes('次の試合が始まるたびに1増え')&&d.includes('コンティニューでは増えません'));
 assert.ok(d.includes('新しいゲームを始めると1へ戻り')&&d.includes('対戦系モードでは常に1'));
 assert.ok(data.MatchNo.description.includes('勝利・コンティニューするたび'));
 const conflict=data.MatchNo.notes.find(n=>n.evidence.status==='conflicting');assert.equal(conflict.kind,'research');assert.equal(conflict.visibility,'internal');assert.ok(conflict.content.includes('continueでは増えず'));assert.ok(!publicNotes(data.MatchNo).includes(conflict));
 assert.ok(publicNotes(data.MatchNo).some(n=>n.content.includes('処理が1回だけ実行されることは保証しません')));
 assert.ok(views.MatchNo.qanda[0].a.includes('コンティニューではMatchNoは増えません'));
});

test('MatchOver separates match completion from one round result and limits documented win-pose timing to 1.0 and 1.1',()=>{
 assert.ok(views.MatchOver.description.includes('試合全体の決着')&&views.MatchOver.description.includes('2本先取')&&views.MatchOver.description.includes('ラウンドが1つ終わっただけ'));
 const timing=publicNotes(data.MatchOver).find(n=>n.legacy_index===0);assert.equal(timing.kind,'behavior');assert.deepEqual(timing.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});assert.equal(timing.evidence.status,'confirmed');assert.ok(timing.content.includes('state 180')&&timing.content.includes('全員のStateNo = 180を確認する条件ではありません'));
 assert.ok(!publicNotes(data.MatchOver).some(n=>n.content.includes('両者が勝利ポーズ')||n.content.includes('約10フレーム')||n.content.includes('1から0')));
 const c=data.MatchOver.notes.find(n=>n.content.includes('約10フレーム'));assert.equal(c.evidence.status,'conflicting');assert.ok(c.content.includes('DOS版')&&c.content.includes('1から0'));
 const negation=publicNotes(data.MatchOver).find(n=>n.content.includes('!MatchOver'));assert.ok(negation.content.includes('RoundState = 2')&&negation.content.includes('試合の勝利条件に達していない'));
 assert.deepEqual(data.MatchOver.associated_trigger,readJSON('tests/mugen/batches/match-progress-01/json/triggers/MatchOver.json').associated_trigger);
});

function conditions(sample,values){
 // Evaluate comparisons on supplied numbers only, not MUGEN's timing, mode selection or state execution.
 return sample.code.every(line=>{
  assert.match(line,/^Trigger1 = /);
  let expression=line.replace(/^Trigger1 = /,'');
  for(const [key,value]of Object.entries(values))expression=expression.replace(new RegExp(`\\b${key}\\b`,'g'),`(${value})`);
  expression=expression.replace(/(?<![=!<>])=(?!=)/g,'===');assert.match(expression,/^[\d\s()!<>=]+$/);
  return Boolean(runInNewContext(expression,{}, {timeout:100}));
 });
}
test('actual match-number and completion examples compare fixed inputs without repeating faulty gauge or fade controllers',()=>{
 const number=views.MatchNo.code_sample;assert.equal(number.length,3);
 for(const MatchNo of [1,2,3])for(const RoundNo of [1,2,3]){
  assert.equal(conditions(number[0],{MatchNo,RoundNo}),MatchNo===1);
  assert.equal(conditions(number[1],{MatchNo,RoundNo}),MatchNo===1&&RoundNo===1);
  assert.equal(conditions(number[2],{MatchNo,RoundNo}),MatchNo>1);
 }
 const over=views.MatchOver.code_sample;assert.equal(over.length,3);
 for(const MatchOver of [0,1])for(const Win of [0,1]){
  assert.equal(conditions(over[0],{MatchOver,Win}),MatchOver===1);
  assert.equal(conditions(over[1],{MatchOver,Win}),MatchOver===0);
  assert.equal(conditions(over[2],{MatchOver,Win}),MatchOver===1&&Win===1);
 }
 assert.ok([...number,...over].every(s=>s.code.every(line=>!line.includes('Var(')&&!line.includes('Type =')&&!line.includes('RoundState = 3'))));
});

test('old gauge PreOver fade figure and foreign-engine records stay in JSON without becoming public through evidence status',()=>{
 assert.equal(data.MatchNo.code_sample[0].visibility,'internal');
 assert.ok(data.MatchNo.notes.some(n=>n.content.includes('var(51) != 10')&&n.evidence.status==='confirmed'));
 assert.equal(data.MatchOver.images[0].visibility,'internal');assert.equal(views.MatchOver.images.length,0);
 for(const s of data.MatchOver.code_sample.slice(0,2))assert.equal(s.visibility,'internal');
 assert.ok(data.MatchOver.notes.some(n=>n.content.includes('明るさを徐々に変えるフェードではない')));
 const go=data.MatchOver.notes.find(n=>n.legacy_index===1);assert.equal(go.kind,'research');assert.deepEqual(go.environment,{engine:'ikemen-go'});assert.equal(go.visibility,'internal');assert.ok(!publicNotes(data.MatchOver).includes(go));
 assert.ok(!views.MatchOver.quote.some(q=>q.url.includes('Ikemen-GO')));
 assert.ok(!publicNotes(data.MatchOver).some(n=>n.content.includes('PreOver')||n.content.includes('今回')));
});
