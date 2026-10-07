import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('palette-tick-rate-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('palette and tick-rate migration preserves every original field summary and sample through additive edits and leaves unknown introduction unknown',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/palette-tick-rate-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','summary','syntax'])assert.deepEqual(after[f],before[f]);
  for(const f of ['code_sample','quote'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['int']);
  assert.deepEqual(after.environment,{engine:'mugen'});assert.equal(views[e.name].parameter.length,0);
  assert.ok(after.notes.every(n=>!('legacy_index'in n)&&!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('PalNo separates selected number from optional DEF button ordering and publishes an accessible scoped six-row mapping',()=>{
 assert.ok(views.PalNo.description.includes('キャラ選択時に選ばれた')&&views.PalNo.description.includes('評価対象プレイヤー'));
 const mapping=publicNotes(data.PalNo).find(n=>n.kind==='behavior');assert.deepEqual(mapping.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});
 assert.ok(mapping.content.includes('省略時の既定対応')&&mapping.content.includes('Yボタンが必ず5番になるとは限りません'));
 assert.ok(mapping.content.includes('<caption>')&&mapping.content.includes('scope="col"'));
 const rows=[...mapping.content.matchAll(/<tr><th scope="row">([ABCXYZ])<\/th><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)].map(([,b,a,s])=>[b,Number(a),Number(s)]);
 assert.deepEqual(rows,[['A',1,7],['B',2,8],['C',3,9],['X',4,10],['Y',5,11],['Z',6,12]]);
 assert.equal(data.PalNo.code_sample[0].visibility,'internal');assert.ok(data.PalNo.code_sample[0].title.includes('Yボタン'));
 assert.deepEqual(views.PalNo.code_sample.map(s=>s.code),[['Trigger1 = PalNo = 5'],['Trigger1 = PalNo != 5']]);
 assert.ok(!views.PalNo.code_sample.some(s=>s.title.includes('Yボタン')));
});

test('PalNo distinguishes RC2 helper inheritance repair from RC3 selection repair and retains Win helper and dynamic palette research internally',()=>{
 const changes=publicNotes(data.PalNo).filter(n=>n.kind==='version_change');assert.equal(changes.length,2);
 const helper=changes.find(n=>n.at==='mugen-1.0-rc2'),start=changes.find(n=>n.at==='mugen-1.0-rc3');
 assert.ok(helper.content.includes('Helperが親からpalnoを継承しない'));assert.ok(start.content.includes('Start')&&start.content.includes('7〜12'));
 for(const n of changes){assert.equal(n.change,'fixed');assert.deepEqual(n.environment,{engine:'mugen',runtime:[n.at]});assert.deepEqual(n.evidence.basis,['official_history']);}
 const win=data.PalNo.notes.find(n=>n.content.includes('少なくともWin'));assert.equal(win.visibility,'internal');assert.equal(win.evidence.status,'unverified');
 assert.ok(win.content.includes('1だけ')&&win.content.includes('1.0の動作は疑問符')&&win.content.includes('Root, PalNo'));
 const dynamic=data.PalNo.notes.find(n=>n.content.includes('RemapPalはスプライト'));assert.equal(dynamic.visibility,'internal');assert.ok(dynamic.content.includes('変化する/しないを断定しない'));
 assert.ok(!publicNotes(data.PalNo).includes(win)&&!publicNotes(data.PalNo).includes(dynamic));
});

test('TicksPerSecond retains the official strict threshold and actual public inclusive half-open range conditions handle supplied integer boundaries',()=>{
 assert.ok(views.TicksPerSecond.description.includes('1秒あたりのtick数')&&views.TicksPerSecond.description.includes('Time'));
 assert.deepEqual(views.TicksPerSecond.associated_trigger,['Time','GameTime']);
 assert.deepEqual(views.TicksPerSecond.code_sample.map(s=>s.code),[
  ['Trigger1 = Time > 10 * TicksPerSecond'],
  ['Trigger1 = Time >= 10 * TicksPerSecond'],
  ['Trigger1 = Time >= 10 * TicksPerSecond','Trigger1 = Time < 11 * TicksPerSecond']
 ]);
 const evaluate=(lines,time,rate)=>lines.every(line=>{
  const [,op,multiplier]=line.match(/^Trigger1 = Time (>|>=|<) (\d+) \* TicksPerSecond$/),bound=Number(multiplier)*rate;
  return op==='>'?time>bound:op==='>='?time>=bound:time<bound;
 });
 // Supplied rates only; no assertion that these are values returned by an engine.
 for(const rate of [30,60,120])for(const time of [10*rate-1,10*rate,10*rate+1,11*rate-1,11*rate,11*rate+1]){
  const [strict,inclusive,range]=views.TicksPerSecond.code_sample.map(s=>evaluate(s.code,time,rate));
  assert.equal(strict,time>10*rate);assert.equal(inclusive,time>=10*rate);assert.equal(range,time>=10*rate&&time<11*rate);
 }
 assert.ok(publicNotes(data.TicksPerSecond).some(n=>n.content.includes('継続して成立')&&n.content.includes('1回だけ')));
});

test('tick-rate FPS and debug-speed research is preserved internally without inventing a constant rate or claiming runtime evidence',()=>{
 const fps=data.TicksPerSecond.notes.find(n=>n.content.includes('FPS取得'));assert.equal(fps.visibility,'internal');assert.ok(fps.content.includes('常時60')&&fps.content.includes('未実測'));
 const debug=data.TicksPerSecond.notes.find(n=>n.content.includes('デバッグ加速に対応できない'));assert.equal(debug.visibility,'internal');assert.ok(debug.content.includes('HitPause中は加算しない')&&debug.content.includes('個別本文は取得失敗'));
 assert.ok(debug.evidence.basis.includes('community_documentation'));
 for(const source of Object.values(data))assert.ok(!publicNotes(source).some(n=>n.kind==='research'));
 assert.ok(!views.TicksPerSecond.description.includes('FPS')&&!views.TicksPerSecond.description.includes('60'));
});
