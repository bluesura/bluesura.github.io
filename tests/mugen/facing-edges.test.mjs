import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {createDocumentSchema} from '../../src/lib/mugen/schema.mjs';
import {normalizeDocument,publicNotes,effectiveAssociatedTriggers} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('facing-edges-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('related-trigger editorial overrides preserve fallbacks and sources while validating replacements and explicit empty arrays',()=>{
 const schema=createDocumentSchema('triggers',readJSON('src/data/engine-versions.json'));
 const original={page:{},category:'trigger',trigger:'Example',description:'legacy',associated_trigger:['CameraPos'],associated_state:['ScreenBound']};
 assert.deepEqual(effectiveAssociatedTriggers(original),['CameraPos']);
 const corrected={...original,documentation:{description:'public',associated_trigger:['CameraPosX']}};
 assert.equal(schema.safeParse(corrected).success,true);assert.deepEqual(normalizeDocument(corrected).associated_trigger,['CameraPosX']);
 assert.deepEqual(corrected.associated_trigger,['CameraPos']);assert.deepEqual(normalizeDocument(corrected).associated_state,['ScreenBound']);
 const hidden={...corrected,documentation:{description:'public',associated_trigger:[]}};
 assert.equal(schema.safeParse(hidden).success,true);assert.deepEqual(normalizeDocument(hidden).associated_trigger,[]);
 assert.equal(normalizeDocument({page:{},trigger:'Example',category:'trigger',description:'legacy'}).associated_trigger,undefined);
 for(const associated_trigger of [[''],'CameraPosX',[2],null])assert.equal(schema.safeParse({...corrected,documentation:{description:'public',associated_trigger}}).success,false);
});

test('facing edge migration preserves old samples FAQs metadata related IDs and the undisplayed sample_code',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/facing-edges-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger','associated_state','sample_code'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample','qanda'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['float']);assert.deepEqual(views[e.name].parameter,[]);assert.deepEqual(after.environment,{engine:'mugen',runtime:['mugen-1.1']});
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('front and back edges publish facing-selected coordinates with local units instead of pixel distances',()=>{
 for(const [name,a,b]of [['FrontEdge','RightEdge','LeftEdge'],['BackEdge','LeftEdge','RightEdge']]){
  const v=views[name];assert.ok(v.description.includes(`Facing = 1）なら${a}`)&&v.description.includes(`Facing = -1）なら${b}`));
  assert.ok(v.description.includes('端そのものの位置')&&v.description.includes('ローカル座標系')&&v.description.includes('描画ピクセル数ではありません'));
  assert.ok(v.description.includes('Pos X + CameraPos X'));
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes(`IfElse(Facing = 1, ${a}, ${b})`)));
  assert.ok(v.qanda[0].a.includes('基準軸')&&v.qanda[0].a.includes('幅バー端')&&!v.qanda[0].a.includes('px'));
 }
 assert.deepEqual(data.BackEdge.associated_trigger.at(-1),'CameraPos');assert.equal(views.BackEdge.associated_trigger.at(-1),'CameraPosX');
 assert.equal(views.BackEdge.qanda[1].a.includes('FrontEdge'),false);
});

test('published facing comparisons handle both directions, exact edges, camera offsets and the opposite-side counterexample',()=>{
 // Algebraic checks of the published CNS expressions; this is not a MUGEN runtime test.
 const cases=[[-200,1,true,true,true,true],[200,1,false,true,false,false],[-120,1,true,true,false,true],[0,1,true,true,false,false],[201,1,false,false,false,false],[250,-1,true,true,true,true],[-120,-1,false,true,false,false],[200,-1,true,true,false,true],[0,-1,true,true,false,false],[-121,-1,false,false,false,false]];
 for(const [x,facing,frontStrict,frontInclusive,backStrict,backInclusive]of cases){
  const values={'Facing':facing,'Pos X':x-40,'CameraPos X':40,'FrontEdge':facing===1?200:-120,'BackEdge':facing===1?-120:200};
  for(const [name,expectations]of [['FrontEdge',[frontStrict,frontInclusive]],['BackEdge',[backStrict,backInclusive]]]){
   for(const [i,sample]of views[name].code_sample.slice(-2).entries()){
    const expr=sample.code[0].replace(/^Trigger1 = /,'').replace(/CameraPos X|Pos X|FrontEdge|BackEdge|Facing/g,token=>`(${values[token]})`);
    assert.match(expr,/^[\d\s()+*.<>\-=]+$/);assert.equal(runInNewContext(expr,{}, {timeout:100}),expectations[i],`${name} x=${x} facing=${facing} sample=${i}`);
   }
  }
 }
});

test('mislabelled one-edge examples stay internal and public descriptions do not imply the whole screen or image is inside',()=>{
 assert.equal(data.FrontEdge.code_sample[1].visibility,'internal');assert.ok(data.FrontEdge.code_sample[1].description.includes('画面内側にいる'));
 assert.equal(data.FrontEdge.code_sample[2].visibility,'internal');assert.equal(data.BackEdge.code_sample[0].visibility,'internal');assert.equal(data.BackEdge.code_sample[1].visibility,'internal');
 assert.deepEqual(views.FrontEdge.code_sample[0],data.FrontEdge.code_sample[0]);
 assert.ok(views.FrontEdge.code_sample.at(-2).description.includes('反対側の端より外'));
 assert.ok(views.BackEdge.code_sample[0].description.includes('右向きなら左端より左、左向きなら右端より右'));
 for(const name of Object.keys(data))assert.ok(publicNotes(data[name]).some(n=>n.content.includes('片側の端だけでは')&&n.content.includes('厳密な')));
});

test('IKEMEN compatibility, figure records and initial-build uncertainty remain internal without claiming fixed runtime equivalence',()=>{
 for(const name of Object.keys(data)){
  const source=data[name],ik=source.notes.find(n=>n.environment.engine==='ikemen-go');assert.equal(ik.visibility,'internal');assert.equal(ik.evidence.status,'unverified');assert.ok(!publicNotes(source).includes(ik));
  assert.ok(source.qanda.slice(0,3).every(q=>q.visibility==='internal'));assert.ok(!views[name].qanda.some(q=>q.q.includes('Ikemen')));
  assert.equal(source.images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);assert.ok(!views[name].quote.some(q=>q.url.includes('ikemen')));
  assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('最初の個別Alpha/Betaビルド')));
  assert.equal(source.notes.find(n=>n.legacy_index===0).kind,'behavior');
 }
});
