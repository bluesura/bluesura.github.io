import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('opponent-distances-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('opponent distance migration preserves original sources metadata descriptions syntax histories samples and figures',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/opponent-distances-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('P2 distance interfaces use space-separated axis tokens and document float without guaranteeing runtime precision',()=>{
 for(const [name,source]of Object.entries(data)){
  const family=name.slice(0,-1),axis=name.at(-1),view=views[name];
  assert.equal(source.syntax_kind,'special_form');assert.deepEqual(source.return_type,['float']);assert.deepEqual(view.syntax,[`${family} ${axis}`]);
  const a=view.parameter[0];assert.equal(view.parameter.length,1);assert.equal(a.name,'[component]');assert.deepEqual(a.type,['char']);assert.equal(a.parameter_type,'required');assert.equal(a.expression_policy,'special_syntax');assert.ok(a.description.includes('半角スペース')&&a.description.includes(`${family} ${axis}`));
  const precision=source.notes.find(n=>n.content.includes('Xの小数切り捨てとYの小数保持'));
  assert.equal(precision.visibility,'internal');assert.equal(precision.evidence.status,'unverified');assert.ok(!publicNotes(source).includes(precision));
 }
});

test('public X descriptions distinguish facing-relative axis distance from body width and preserve disputed width behavior internally',()=>{
 assert.ok(views.P2DistX.description.includes('Facing')&&views.P2DistX.description.includes('前方なら正、後方なら負')&&views.P2DistX.description.includes('同じX位置なら0'));
 const body=views.P2BodyDistX;assert.ok(body.description.includes('P2側で実行者に面する幅基準点'));assert.ok(body.description.includes('常に両者のfront同士')&&body.description.includes('基準軸の前後と同じ判定になるとは限りません'));
 assert.ok(!body.description.includes('front.width'));
 assert.ok(publicNotes(data.P2BodyDistX).some(n=>n.content.includes('ground.front / ground.back / air.front / air.back')));
 const width=data.P2BodyDistX.notes.find(n=>n.content.includes('同じ基準X座標'));
 assert.equal(width.visibility,'internal');assert.equal(width.evidence.status,'conflicting');assert.ok(width.content.includes('相手の後ろ幅')&&width.content.includes('感知できない'));
 assert.ok(!publicNotes(data.P2BodyDistX).includes(width));
});

test('both Y components retain axis-height differences rather than body boxes and preserve sign and exact boundaries',()=>{
 for(const name of ['P2DistY','P2BodyDistY']){
  const v=views[name];assert.ok(v.description.includes('上なら負、下なら正、同じ高さなら0')&&v.description.includes('向きによって上下の符号は変わりません'));
  assert.ok(v.description.includes('Clsn2'));assert.ok(publicNotes(data[name]).some(n=>n.content.includes('どちらも両者のY軸の高さの差')));
 }
 assert.ok(views.P2BodyDistY.description.includes('size box同士の上下の隙間'));
});

function compare(sample,values){
 const expr=sample.code[0].replace(/^Trigger1 = /,'').replace(/P2(?:Body)?Dist [XY]/g,token=>`(${values[token]})`).replaceAll('Abs','abs');
 assert.match(expr,/^(?:abs|[\d\s().<>\-=|&])+$/);
 return runInNewContext(expr,{abs:Math.abs},{timeout:100});
}
test('actual public CNS comparisons handle negative distances zero fractional thresholds and body versus axis conditions',()=>{
 // These test numerical comparisons only; no MUGEN selection, width or distance computation is simulated.
 const axisCases=[[-100,true,false,false],[-30,true,false,false],[-29.5,true,false,true],[0,true,true,true],[29.5,true,true,true],[30,false,false,false]];
 for(const [x,...expected]of axisCases)for(const [i,s]of views.P2DistX.code_sample.entries())assert.equal(compare(s,{'P2Dist X':x}),expected[i],`P2Dist X ${x}, sample ${i}`);
 const bodyCases=[[-100,1,true,false,false],[0,0,true,true,false],[0,1,true,true,true],[29.5,100,true,true,true],[30,10,false,false,false],[20,-5,true,true,false]];
 for(const [body,axis,...expected]of bodyCases)for(const [i,s]of views.P2BodyDistX.code_sample.entries())assert.equal(compare(s,{'P2BodyDist X':body,'P2Dist X':axis}),expected[i],`body=${body} axis=${axis}, sample ${i}`);
 const yCases=[[-13,true,true,false],[-12,true,true,false],[-11.5,true,false,true],[0,false,false,true],[11.5,false,false,true],[12,false,false,false]];
 for(const name of ['P2DistY','P2BodyDistY'])for(const [y,...expected]of yCases)for(const [i,s]of views[name].code_sample.entries())assert.equal(compare(s,{[name.slice(0,-1)+' Y']:y}),expected[i],`${name} ${y}, sample ${i}`);
});

test('P2 absence assumptions selection research IKEMEN histories and old figures remain internal',()=>{
 for(const [name,source]of Object.entries(data)){
  const absence=source.notes.find(n=>n.content.includes('Error conditions:none'));
  assert.equal(absence.visibility,'internal');assert.equal(absence.evidence.status,'unverified');assert.ok(absence.content.includes('P2StateNo/P2StateType')&&absence.content.includes('NumEnemy>0'));
  assert.ok(!publicNotes(source).some(n=>n.content.includes('bottom')||n.content.includes('HelperType=Player')));
  assert.equal(source.images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);
  assert.equal(source.code_sample[0].visibility,'internal');assert.equal(views[name].code_sample.length,3);
  assert.ok(!views[name].quote.some(q=>q.url.includes('ikemen')));
  for(const i of (source.version??[]).keys()){
   const n=source.notes.find(n=>n.legacy_index===i);assert.equal(n.visibility,'internal');assert.equal(n.kind,'research');assert.deepEqual(n.environment,{engine:'ikemen-go'});assert.equal(n.evidence.status,'unverified');assert.ok(!publicNotes(source).includes(n));
  }
 }
});
