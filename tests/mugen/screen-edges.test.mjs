import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('screen-edges-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('screen edge migration preserves every legacy field including pixel claims figures and assignment-like examples',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/screen-edges-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger','associated_state'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','qanda','quote'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen',runtime:['mugen-1.1']});assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(after.return_type,['float']);assert.deepEqual(views[e.name].parameter,[]);
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('screen edges distinguish coordinates from distance and player-facing choice with local coordinate units',()=>{
 for(const [name,edge]of [['LeftEdge','左'],['RightEdge','右'],['TopEdge','上'],['BottomEdge','下']]){
  const v=views[name];assert.ok(v.description.includes(`画面${edge}端`)&&v.description.includes('ステージ基準のfloat'));
  assert.ok(v.description.includes('端そのものの位置')&&v.description.includes('実行者のローカル座標系')&&v.description.includes('描画ピクセル数ではありません'));
  assert.ok(v.description.includes('Facing')&&v.description.includes('切り替わることはありません'));
  assert.ok(publicNotes(data[name]).some(n=>n.legacy_index===1&&n.content.includes('移動可能範囲')));
 }
 assert.ok(views.LeftEdge.qanda[0].a.includes('右向きなら左端'));
 assert.ok(views.RightEdge.qanda[0].a.includes('右向きなら右端'));
});

test('screen edges scope official equivalents to 1.1 without replacing RightEdge with its erroneous Format token',()=>{
 const expressions={LeftEdge:'CameraPos X - GameWidth / 2',RightEdge:'CameraPos X + GameWidth / 2',TopEdge:'Pos Y - ScreenPos Y',BottomEdge:'Pos Y - ScreenPos Y + GameHeight'};
 for(const [name,expr]of Object.entries(expressions)){
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes(expr)&&n.environment.runtime.includes('mugen-1.1')));
  assert.deepEqual(views[name].syntax,[name]);assert.equal(data[name].images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);
 }
 const typo=data.RightEdge.notes.find(n=>n.evidence.status==='conflicting');assert.ok(typo.content.includes('Format欄はLeftEdge'));assert.equal(typo.visibility,'internal');assert.ok(!publicNotes(data.RightEdge).includes(typo));
});

test('edge examples retain useful official conditions and test both inclusive boundaries on the same axis',()=>{
 for(const name of Object.keys(data)){
  const horizontal=['LeftEdge','RightEdge'].includes(name),v=views[name],sample=v.code_sample.at(-1);
  assert.deepEqual(sample.code,horizontal?['Trigger1 = Pos X + CameraPos X >= LeftEdge','Trigger1 = Pos X + CameraPos X <= RightEdge']:['Trigger1 = Pos Y >= TopEdge','Trigger1 = Pos Y <= BottomEdge']);
  assert.ok(sample.title.includes('両端を含む'));assert.ok(sample.description.includes('両方を満たす')&&sample.description.includes('もう一方の軸'));
  assert.ok(v.code_sample.some(s=>s.title.startsWith('公式例')));
  assert.ok(!v.code_sample.some(s=>s.title.includes('何px')||s.title.includes('削除')||s.code.some(c=>c.startsWith('FVar')||c.startsWith('BottomEdge ='))));
  assert.equal(data[name].code_sample.at(-2).visibility,'internal');
 }
 assert.ok(views.TopEdge.code_sample.some(s=>s.code.includes('Trigger1 = Pos Y < TopEdge')));
 assert.ok(views.BottomEdge.code_sample.some(s=>s.code.includes('Trigger1 = Pos Y > BottomEdge')));
});

test('legacy histories map individually while universal zoom coupling and uncertain initial builds remain research',()=>{
 for(const name of Object.keys(data)){
  const source=data[name];assert.deepEqual(source.notes.filter(n=>n.legacy_index!==undefined).map(n=>n.legacy_index),[0,1,2]);
  const coupling=source.notes.find(n=>n.legacy_index===2);assert.equal(coupling.kind,'research');assert.equal(coupling.evidence.status,'unverified');assert.equal(coupling.visibility,'internal');assert.ok(!publicNotes(source).includes(coupling));
  assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('最初の個別Alpha/Betaビルド')));
  assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('Win/1.0')));
 }
});

test('vertical edge FAQs do not publish approximate GameHeight identities or trigger assignment notation',()=>{
 for(const name of ['TopEdge','BottomEdge']){
  const source=data[name],v=views[name];assert.equal(source.qanda[0].visibility,'internal');assert.equal(v.qanda.length,1);
  assert.ok(v.qanda[0].a.includes('上か下か')&&v.qanda[0].a.includes('画像全体'));
  assert.ok(!v.qanda[0].a.includes('GameHeight'));assert.ok(source.qanda[0].a.includes('GameHeight'));
  assert.ok(source.code_sample.some(s=>s.visibility==='internal'&&s.code.some(c=>c.startsWith('FVar(0)'))));
 }
});
