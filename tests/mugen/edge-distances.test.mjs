import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('edge-distances-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('distance migration retains original metadata sources history samples FAQs and image contents',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/edge-distances-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger','associated_state'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample','qanda'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['float']);assert.deepEqual(views[e.name].parameter,[]);
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('public distances distinguish axis and edge width from coordinates pixels and collision boxes',()=>{
 for(const [name,v]of Object.entries(views)){
  const front=name.startsWith('Front'),body=name.includes('Body');
  assert.ok(v.description.includes(`Facing = 1）では${front?'右端':'左端'}`)&&v.description.includes(`Facing = -1）では${front?'左端':'右端'}`));
  assert.ok(v.description.includes('端そのものの座標')&&v.description.includes('描画ピクセル数と一律に'));
  assert.ok(v.description.includes(body?'対画面端の幅を考慮します':'幅を考慮しない基準軸'));
  if(body){
   assert.ok(v.description.includes('Clsn1 / Clsn2'));
   assert.ok(publicNotes(data[name]).some(n=>n.content.includes('Edge')&&n.content.includes('Player')&&n.content.includes('橙')));
   assert.ok(!v.description.includes('ground.')&&!v.description.includes('player幅（黄色）'));
  }
 }
});

test('published distance conditions distinguish negative values zero fractional thresholds and either edge',()=>{
 // Evaluate only the published numeric comparisons. No MUGEN distance or width behavior is simulated.
 const cases=[[-1,-2,true,false,false],[0,-2,true,true,true],[29.5,100,true,true,true],[30,30,false,false,false],[30,0,false,false,true],[100,-1,false,false,false],[100,29.5,false,false,true]];
 for(const [name,v]of Object.entries(views)){
  const opposite=name.replace(name.startsWith('Front')?'Front':'Back',name.startsWith('Front')?'Back':'Front');
  for(const [a,b,...expected]of cases){
   const values={[name]:a,[opposite]:b};
   for(const [i,sample]of v.code_sample.entries()){
    const expr=sample.code[0].replace(/^Trigger1 = /,'').replace(/(?:Front|Back)Edge(?:Body)?Dist/g,token=>`(${values[token]})`);
    assert.match(expr,/^[\d\s().<>\-=|&]+$/);assert.equal(runInNewContext(expr,{}, {timeout:100}),expected[i],`${name}: ${a}, ${b}, sample ${i}`);
   }
  }
 }
});

test('float versus integer reports and old state-dependent width research remain internal with original scope',()=>{
 for(const [name,source]of Object.entries(data)){
  const conflict=source.notes.find(n=>n.evidence.status==='conflicting'&&n.content.includes('Int型'));
  assert.equal(conflict.visibility,'internal');assert.ok(conflict.content.includes('切り捨て'));assert.ok(conflict.content.includes('float精度'));
  const width=source.notes.find(n=>n.content.includes('StateType=A/L'));
  assert.deepEqual(width.environment,{engine:'mugen',runtime:['winmugen','mugen-1.0']});assert.equal(width.visibility,'internal');assert.equal(width.evidence.status,'unverified');
  assert.ok(!publicNotes(source).includes(conflict)&&!publicNotes(source).includes(width));
  assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('初導入の証明')));
  assert.ok(source.version.every((_,i)=>source.notes.some(n=>n.legacy_index===i)));
 }
 assert.ok(data.BackEdgeDist.notes.some(n=>n.visibility==='internal'&&n.content.includes('例にBackEdgeBodyDist')));
});

test('legacy examples negative-value FAQs figures and separate-engine sources do not reappear in public output',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.ok(source.code_sample.slice(0,2).every(s=>s.visibility==='internal'));assert.equal(views[name].code_sample.length,3);
  assert.equal(source.images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);
  assert.ok(!views[name].qanda.some(q=>q.q.includes('0未満')));
  assert.ok(!views[name].quote.some(q=>q.url.includes('ikemen')));
  for(const note of source.notes.filter(n=>n.environment?.engine==='ikemen-go'))assert.equal(note.visibility,'internal');
  assert.ok(publicNotes(source).some(n=>n.content.includes('負の値が返った場合も真')));
 }
});
