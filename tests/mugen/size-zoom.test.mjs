import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('size-zoom-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('size and zoom migration preserves original prose histories samples sources and empty records',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/size-zoom-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','summary','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample','qanda'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['float']);assert.deepEqual(views[e.name].parameter,[]);
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('dimension units use player local coordinates without publishing pixel or universal zoom claims',()=>{
 for(const name of ['GameWidth','GameHeight','ScreenWidth','ScreenHeight']){
  const v=views[name];assert.ok(v.description.includes('実行者のローカル座標系'));assert.ok(v.description.includes('描画ピクセル数では'));
  assert.deepEqual(v.images,[]);assert.equal(data[name].images[0].visibility,'internal');
  assert.ok(!v.description.includes('ズーム0.5')&&!v.description.includes('2倍'));
  assert.ok(v.qanda.some(q=>q.q.includes('MUGEN 1.1')));assert.ok(!v.qanda.some(q=>q.a.includes('IKEMEN')));
 }
 for(const name of ['ScreenWidth','ScreenHeight']){
  assert.ok(data[name].description.includes('ピクセル単位'));assert.ok(views[name].description.includes('カメラズームの影響を受けません'));
  const ik=data[name].notes.find(n=>n.environment.engine==='ikemen-go');assert.equal(ik.visibility,'internal');assert.ok(!publicNotes(data[name]).includes(ik));
  assert.ok(!views[name].quote.some(q=>q.url.includes('ikemen')));
 }
});

test('Game dimensions use the RC4 introduction while documentation-only histories and 1.1 build uncertainty stay internal',()=>{
 const rc4=readJSON('src/data/engine-versions.json').builds.find(b=>b.id==='mugen-1.0-rc4');assert.equal(rc4.build_date,'2009-10-25');
 for(const name of ['GameWidth','GameHeight']){
  const source=data[name];assert.equal(source.page.introduced_in,rc4.id);
  const added=publicNotes(source).find(n=>n.kind==='version_change');assert.equal(added.at,rc4.id);assert.equal(added.change,'added');assert.equal(added.legacy_index,0);
  const changed=source.notes.find(n=>n.legacy_index===1);assert.equal(changed.kind,'research');assert.equal(changed.visibility,'internal');assert.equal(changed.evidence.status,'conflicting');assert.equal(changed.at,undefined);
 }
 for(const name of ['ScreenWidth','ScreenHeight','CameraZoom']){assert.equal(data[name].page.introduced_in,null);assert.deepEqual(data[name].environment,{engine:'mugen',runtime:['mugen-1.1']});}
 assert.equal(data.CameraZoom.page.version,'2012.08.31');
});

test('Game dimension public examples scope ScreenPos conditions to 1.0 and state the central boundary accurately',()=>{
 assert.deepEqual(views.GameWidth.code_sample[0].code,['Trigger1 = ScreenPos X >= GameWidth / 2']);
 assert.ok(views.GameWidth.code_sample[0].title.includes('中央以上'));
 assert.deepEqual(views.GameHeight.code_sample[0].code,['Trigger1 = ScreenPos Y < GameHeight / 2']);
 for(const name of ['GameWidth','GameHeight']){
  assert.equal(views[name].code_sample.length,1);assert.ok(views[name].code_sample[0].title.includes('MUGEN 1.0'));
  assert.ok(views[name].code_sample[0].description.includes('体全体')&&views[name].code_sample[0].description.includes('保証する条件にはしません'));
  assert.ok(data[name].code_sample[0].title.includes('ズーム対応'));assert.equal(data[name].code_sample[0].visibility,'internal');assert.equal(data[name].code_sample[1].visibility,'internal');
 }
});

test('screen examples retain valid Explods and use float Params instead of the invalid legacy Text list',()=>{
 assert.deepEqual(views.ScreenWidth.code_sample[0],data.ScreenWidth.code_sample[0]);
 assert.deepEqual(views.ScreenHeight.code_sample[0],data.ScreenHeight.code_sample[1]);
 assert.equal(data.ScreenWidth.code_sample[1].visibility,'internal');assert.ok(data.ScreenWidth.code_sample[1].description.includes('16px'));
 assert.ok(views.ScreenWidth.code_sample[1].description.includes('16ピクセルとは限りません'));
 assert.deepEqual(views.ScreenWidth.code_sample[1].code,['space = screen','pos = ScreenWidth - 16, 16','bindID = -2']);
 assert.equal(data.ScreenHeight.code_sample[0].visibility,'internal');
 assert.deepEqual(views.ScreenHeight.code_sample[1].code,['[State -2, DebugScreenSize]','Type = DisplayToClipboard','Trigger1 = 1','Text = "Screen: %f x %f"','Params = ScreenWidth, ScreenHeight']);
 assert.ok(publicNotes(data.ScreenHeight).some(n=>n.content.includes('AIR')&&n.content.includes('bindID = -2')));
});

test('CameraZoom and official formula errors stay recorded without leaking into public examples or claiming runtime confirmation',()=>{
 assert.deepEqual(views.CameraZoom.code_sample[0].code,['Trigger1 = CameraZoom != 1']);assert.equal(data.CameraZoom.code_sample[0].visibility,'internal');
 assert.ok(views.CameraZoom.description.includes('float')&&views.CameraZoom.description.includes('引数はありません'));
 for(const name of ['GameWidth','GameHeight','CameraZoom']){
  const n=data[name].notes.find(n=>n.evidence.status==='conflicting'&&n.content.includes('CameraZoom * ScreenWidth'));
  assert.ok(n&&n.visibility==='internal');assert.ok(!publicNotes(data[name]).includes(n));assert.ok(!views[name].code_sample.some(s=>s.code.join('\n').includes('CameraZoom * ScreenWidth')));
 }
 assert.ok(data.GameWidth.notes.some(n=>n.visibility==='internal'&&n.content.includes('Format欄はGameHeight')));
 assert.ok(data.ScreenHeight.notes.some(n=>n.visibility==='internal'&&n.content.includes('左下')));
 assert.ok(data.CameraZoom.notes.some(n=>n.content.includes('一次研究')&&n.evidence.basis.includes('community_documentation')));
});
