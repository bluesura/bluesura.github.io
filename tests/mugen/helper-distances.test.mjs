import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('helper-distances-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('helper distance migrations preserve all original prose metadata examples sources figures and histories',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/helper-distances-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('ParentDist and RootDist require space-separated char axes without publishing an IKEMEN Z component',()=>{
 for(const [name,source]of Object.entries(data)){
  const family=name.slice(0,-1),axis=name.at(-1),view=views[name];
  assert.equal(source.syntax_kind,'special_form');assert.deepEqual(source.return_type,['float']);assert.deepEqual(view.syntax,[`${family} ${axis}`]);
  assert.equal(view.parameter.length,1);const a=view.parameter[0];assert.equal(a.name,'[component]');assert.equal(a.parameter_type,'required');assert.deepEqual(a.type,['char']);assert.equal(a.expression_policy,'special_syntax');
  assert.ok(a.description.includes('半角スペース')&&a.description.includes(`${family} ${axis}`));assert.ok(!a.description.includes(' Z'));
 }
});

test('helper distance prose separates immediate parent from owner and uses the executing helper facing and axes',()=>{
 for(const [name,view]of Object.entries(views)){
  assert.ok(view.description.includes('Helper専用'));
  if(name.startsWith('Parent'))assert.ok(view.description.includes('生成した直接の親'));
  else assert.ok(view.description.includes('所有する本体')&&view.description.includes('直接の親ではなく本体'));
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes('Helper BのParentはHelper A、Rootは本体')));
  assert.ok(view.qanda[0].a.includes('距離が同じとは限りません'));
  if(name.endsWith('X'))assert.ok(view.description.includes('実行者のHelperのFacing')&&view.description.includes('前方なら正、後方なら負')&&view.description.includes('同じX位置なら0'));
  else assert.ok(view.description.includes('上なら負、下なら正、同じ高さなら0')&&view.description.includes('上下の符号は変わりません'));
 }
});

test('helper distance absence keeps numeric zero separate from bottom and scopes error claims to documented families',()=>{
 for(const [name,source]of Object.entries(data)){
  const error=publicNotes(source).find(n=>n.kind==='error');
  assert.deepEqual(error.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});
  assert.ok(error.content.includes('bottom')&&error.content.includes('通常の数値0とは異なります')&&error.content.includes('条件式全体')&&error.content.includes('Cond/IfElse'));
  assert.ok(!error.content.includes('2002'));
  const legacy=source.notes.find(n=>n.legacy_index===0);assert.equal(legacy.visibility,'internal');assert.equal(legacy.evidence.status,'conflicting');assert.ok(legacy.content.includes('2002.04.14資料はSFalse')&&legacy.content.includes('変更/修正時点'));
  if(name.startsWith('Root'))assert.ok(legacy.content.includes('公式X説明は3世代ともParentDist'));
  assert.ok(publicNotes(source).some(n=>n.content.includes('IsHelper')&&n.content.includes('存在や生存を保証しません')));
 }
});

function compare(sample,syntax,value,isHelper=true){
 // Fixed input values exercise CNS comparisons only, not MUGEN distance/parent/bottom evaluation.
 assert.equal(sample.code[0],'TriggerAll = IsHelper');
 const expr=sample.code[1].replace(/^Trigger1 = /,'').replaceAll(syntax,`(${value})`).replaceAll('Abs','abs');
 assert.match(expr,/^(?:abs|[\d\s().<>!\-=|&])+$/);
 return isHelper&&runInNewContext(expr,{abs:Math.abs},{timeout:100});
}
test('actual helper distance examples handle type guards signs zero fractional bounds and inclusive upper-height thresholds',()=>{
 const xCases=[[-100,true,false,false],[-30,true,false,false],[-29.5,true,false,true],[0,false,true,true],[29.5,true,true,true],[30,true,false,false]];
 const yCases=[[-13,true,true,false],[-12,true,true,false],[-11.5,true,false,true],[0,false,false,true],[11.5,false,false,true],[12,false,false,false]];
 for(const [name,view]of Object.entries(views)){
  const syntax=name.slice(0,-1)+' '+name.at(-1),cases=name.endsWith('X')?xCases:yCases;
  assert.equal(view.code_sample.length,3);
  for(const [value,...expected]of cases)for(const [i,s]of view.code_sample.entries()){
   assert.equal(compare(s,syntax,value),expected[i],`${name} ${value}, sample ${i}`);
   assert.equal(compare(s,syntax,value,false),false);
  }
 }
});

test('helper distance precision lifecycle introduction figures and foreign-engine histories stay exclusively internal',()=>{
 for(const [name,source]of Object.entries(data)){
  const precision=source.notes.find(n=>n.content.includes('小数が切り捨てられる'));assert.equal(precision.visibility,'internal');assert.equal(precision.evidence.status,'unverified');assert.ok(!publicNotes(source).includes(precision));
  if(name.endsWith('Y'))assert.ok(precision.content.includes('Yの整数化へ一般化しません')&&precision.content.includes('今回取得できず'));
  const life=source.notes.find(n=>n.content.includes('親が消えたらRootへ'));assert.equal(life.visibility,'internal');assert.equal(life.evidence.status,'unverified');
  const foreign=source.notes.find(n=>n.legacy_index===1);assert.deepEqual(foreign.environment,{engine:'ikemen-go'});assert.equal(foreign.kind,'research');assert.ok(!publicNotes(source).includes(foreign));
  assert.equal(source.images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);assert.equal(source.code_sample[0].visibility,'internal');
  assert.ok(!views[name].quote.some(q=>q.url.includes('ikemen')));
 }
});
