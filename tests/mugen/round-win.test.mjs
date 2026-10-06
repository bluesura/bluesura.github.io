import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('round-win-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('round victory migration preserves all original text metadata histories diagrams examples and perfect FAQ references',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/round-win-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','quote','qanda'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['int']);assert.equal(views[e.name].parameter.length,0);
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('public victory descriptions distinguish a team round result KO time and perfect treatment from final match completion',()=>{
 for(const name of Object.keys(data)){
  assert.ok(views[name].description.includes('評価対象のプレイヤー（チーム戦ではそのチーム）')&&views[name].description.includes('<code>1</code>')&&views[name].description.includes('<code>0</code>'));
  assert.ok(!views[name].description.includes('RoundState = 3'));
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes(`!${name}`)&&n.content.includes('敗北・引き分け')));
 }
 assert.ok(views.Win.description.includes('試合全体の決着はMatchOver'));
 assert.ok(views.WinKO.description.includes('相手のLifeが0かだけを調べる条件とは別'));
 assert.ok(views.WinTime.description.includes('時間切れが発生しただけでは成立せず')&&views.WinTime.description.includes('敗北や引き分けの場合は0'));
 assert.ok(views.WinPerfect.description.includes('終わった理由')&&views.WinPerfect.description.includes('別の条件'));
});

test('old timing transition and once-only flags are internal while the MatchOver delay keeps its documented 1.0 and 1.1 scope',()=>{
 const timing=publicNotes(data.Win).find(n=>n.legacy_index===0);assert.equal(timing.kind,'behavior');assert.deepEqual(timing.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});assert.ok(timing.content.includes('state 180'));
 for(const [name,index]of [['Win',1],['WinKO',0]]){
  const n=data[name].notes.find(n=>n.legacy_index===index);assert.equal(n.kind,'research');assert.equal(n.visibility,'internal');assert.ok(n.content.includes('専用777番')&&n.content.includes('全キャラ・全ビルド'));assert.ok(!publicNotes(data[name]).includes(n));
  assert.ok(!views[name].quote.some(q=>q.url.includes('19602')));
 }
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.images[0].visibility,'internal');assert.equal(views[name].images.length,0);for(const sample of source.code_sample.slice(0,2))assert.equal(sample.visibility,'internal');
  assert.ok(source.notes.some(n=>n.kind==='research'&&n.content.includes('Persistent = 0')&&n.content.includes('ラッチそのものではない')));
  assert.ok(!publicNotes(source).some(n=>n.content.includes('RoundState = 3')||n.content.includes('今回実測')||n.content.includes('共有図')));
 }
 assert.ok(data.Win.notes.some(n=>n.content.includes('勝利が取り消され')&&n.content.includes('Ieflse')));
 for(const name of ['WinKO','WinTime'])assert.ok(data[name].notes.some(n=>n.content.includes('時間切れ後')&&n.content.includes('同時に1にならない')));
});

test('WinPerfect retains conflicting healing research and the original history claim without publishing either as a tested universal rule',()=>{
 const old=data.WinPerfect.qanda[0];assert.equal(old.visibility,'internal');assert.ok(old.a.includes('途中で減ったかどうかの履歴'));
 const conflict=data.WinPerfect.notes.find(n=>n.evidence.status==='conflicting');assert.equal(conflict.visibility,'internal');assert.ok(conflict.content.includes('no life lost')&&conflict.content.includes('回復でも1になる')&&conflict.content.includes('検索結果本文'));
 assert.ok(!publicNotes(data.WinPerfect).includes(conflict));assert.equal(views.WinPerfect.qanda.length,1);assert.ok(views.WinPerfect.qanda[0].a.includes('チーム全体'));
 const publicText=[views.WinPerfect.description,...publicNotes(data.WinPerfect).map(n=>n.content),...views.WinPerfect.qanda.map(q=>q.a)].join(' ');
 assert.ok(!publicText.includes('履歴')&&!publicText.includes('回復後不可')&&!publicText.includes('no life lost'));
});

function conditions(sample,values){
 // Supplied boolean integers only: this is not an engine result/timing simulation.
 return sample.code.every(line=>{
  assert.match(line,/^Trigger1 = /);let expression=line.replace(/^Trigger1 = /,'');
  for(const [key,value]of Object.entries(values))expression=expression.replace(new RegExp(`\\b${key}\\b`,'g'),`(${value})`);
  assert.match(expression,/^[\d\s()!]+$/);return Boolean(runInNewContext(expression,{}, {timeout:100}));
 });
}
test('actual victory conditions distinguish negation from winning by another reason and combine KO with perfect treatment',()=>{
 for(const [name,view]of Object.entries(views))for(const value of [0,1]){
  assert.equal(conditions(view.code_sample[0],{[name]:value}),value===1);assert.equal(conditions(view.code_sample[1],{[name]:value}),value===0);
 }
 for(const Win of [0,1])for(const WinKO of [0,1])assert.equal(conditions(views.WinKO.code_sample[2],{Win,WinKO}),Win===1&&WinKO===0);
 for(const WinKO of [0,1])for(const WinPerfect of [0,1])assert.equal(conditions(views.WinPerfect.code_sample[2],{WinKO,WinPerfect}),WinKO===1&&WinPerfect===1);
 for(const view of Object.values(views))assert.ok(view.code_sample.every(s=>s.code.every(line=>!line.includes('Type =')&&!line.includes('Persistent')&&!line.includes('V =')&&!line.includes('RoundState'))));
});
