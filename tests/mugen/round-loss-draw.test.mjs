import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('round-loss-draw-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('round loss and draw migration retains original metadata text syntax references diagrams and all flag codes',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/round-loss-draw-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','quote'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['int']);assert.equal(views[e.name].parameter.length,0);
  assert.ok(!after.notes.some(n=>'legacy_index' in n));assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('public descriptions separate team round loss its reason and draw from current Life and final match completion',()=>{
 for(const [name,view]of Object.entries(views)){
  assert.ok(view.description.includes('評価対象のプレイヤー（チーム戦ではそのチーム）')&&view.description.includes('<code>1</code>')&&view.description.includes('<code>0</code>'));
  assert.ok(view.description.includes('試合全体の決着はMatchOver')&&!view.description.includes('RoundState = 3'));
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes(`!${name}`)&&n.content.includes('区間')));
 }
 assert.ok(views.LoseKO.description.includes('現在の自分のLifeが0かだけを調べる条件とは別'));
 assert.ok(views.LoseTime.description.includes('時間切れが発生しただけでは成立せず')&&views.LoseTime.description.includes('勝利や引き分けの場合は0'));
 assert.ok(views.DrawGame.description.includes('WinやLoseの否定だけでは')&&views.DrawGame.description.includes('引き分けを判断できません'));
});

test('old once-only negative-state flags shared flow diagrams and uncertain result timings stay internal',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.images[0].visibility,'internal');assert.equal(views[name].images.length,0);for(const sample of source.code_sample.slice(0,2))assert.equal(sample.visibility,'internal');
  assert.ok(source.notes.some(n=>n.kind==='research'&&n.content.includes('Persistent = 0')&&n.content.includes('ラッチそのものではない')));
  assert.ok(source.notes.some(n=>n.kind==='research'&&n.content.includes('正確な更新フレーム')&&n.evidence.status==='unverified'));
  assert.ok(!publicNotes(source).some(n=>n.content.includes('RoundState = 3')||n.content.includes('今回実測')||n.content.includes('共有図')));
  assert.ok(!views[name].quote.some(q=>q.url.includes('pages/108.html')));
 }
 for(const name of ['Lose','LoseKO','LoseTime'])assert.ok(data[name].notes.some(n=>n.content.includes('個別ページ本文は直接取得に失敗')&&n.content.includes('鏡写しして確認済みにはしない')));
});

test('DrawGame keeps official Draw format discrepancy and draw-limit/result-change research without publishing inferred aliases or exclusivity',()=>{
 const conflict=data.DrawGame.notes.find(n=>n.evidence.status==='conflicting');assert.equal(conflict.visibility,'internal');assert.ok(conflict.content.includes('FormatをDraw')&&conflict.content.includes('trigger1 = DrawGame'));
 assert.deepEqual(views.DrawGame.syntax,['DrawGame']);assert.ok(!publicNotes(data.DrawGame).includes(conflict));
 assert.ok(data.DrawGame.notes.some(n=>n.content.includes('ラウンド取得前の死亡')&&n.content.includes('はず')&&n.evidence.status==='unverified'));
 assert.ok(data.DrawGame.notes.some(n=>n.content.includes('両者にラウンド勝利判定')&&n.content.includes('WinとDrawGameが同時に1になると推定しない')));
 assert.ok(data.DrawGame.description.includes('Win</code>/<code>Lose</code> は通常 0'));
 const publicText=[views.DrawGame.description,...publicNotes(data.DrawGame).map(n=>n.content),...views.DrawGame.code_sample.map(s=>s.description)].join(' ');
 assert.ok(!publicText.includes('通常 0')&&!publicText.includes('Drawを')&&!publicText.includes('許容回数')&&!publicText.includes('同時に1'));
});

function conditions(sample,values){
 // Fixed supplied boolean integers: no simulated MUGEN timing or round result calculation.
 return sample.code.every(line=>{
  assert.match(line,/^Trigger1 = /);let expression=line.replace(/^Trigger1 = /,'');
  for(const [key,value]of Object.entries(values))expression=expression.replace(new RegExp(`\\b${key}\\b`,'g'),`(${value})`);
  assert.match(expression,/^[\d\s()!]+$/);return Boolean(runInNewContext(expression,{}, {timeout:100}));
 });
}
test('actual loss/draw conditions distinguish negation from a different loss reason and combine round draw with no final match result',()=>{
 for(const [name,view]of Object.entries(views))for(const value of [0,1]){
  assert.equal(conditions(view.code_sample[0],{[name]:value}),value===1);assert.equal(conditions(view.code_sample[1],{[name]:value}),value===0);
 }
 for(const Lose of [0,1])for(const LoseKO of [0,1])assert.equal(conditions(views.LoseKO.code_sample[2],{Lose,LoseKO}),Lose===1&&LoseKO===0);
 for(const DrawGame of [0,1])for(const MatchOver of [0,1])assert.equal(conditions(views.DrawGame.code_sample[2],{DrawGame,MatchOver}),DrawGame===1&&MatchOver===0);
 for(const view of Object.values(views))assert.ok(view.code_sample.every(s=>s.code.every(line=>!line.includes('Type =')&&!line.includes('Persistent')&&!line.includes('V =')&&!line.includes('RoundState'))));
});
