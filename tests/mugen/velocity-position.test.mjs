import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('velocity-position-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
test('velocity and position migrations retain every original field with only reviewed additions',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/velocity-position-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','summary','syntax'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});
test('Vel and Pos require space-separated axis tokens and keep float precision in their common interface',()=>{
 for(const [name,source]of Object.entries(data)){
  const view=views[name],family=name.slice(0,-1),axis=name.at(-1);assert.deepEqual(view.syntax,[`${family} ${axis}`]);assert.equal(source.syntax_kind,'special_form');assert.deepEqual(source.return_type,['float']);
  assert.equal(view.parameter.length,1);const a=view.parameter[0];assert.equal(a.name,'[component]');assert.equal(a.parameter_type,'required');assert.equal(a.expression_policy,'special_syntax');assert.deepEqual(a.type,['char']);assert.ok(a.description.includes('半角スペース'));
  const notes=publicNotes(source);assert.ok(notes.some(n=>n.content.includes('常にFloorやCeilで整数化する必要はありません')&&n.content.includes('整数を要求する項目')));
 }
});
test('velocity signs distinguish facing-relative forward movement from vertical speed and position',()=>{
 assert.ok(views.VelX.description.includes('前進')&&views.VelX.description.includes('後退')&&views.VelX.description.includes('向きで変わります'));
 assert.deepEqual(views.VelX.code_sample[0].code,['Trigger1 = Vel X > 0']);
 assert.ok(views.VelY.description.includes('正の値は下方向、負の値は上方向')&&views.VelY.description.includes('fall属性は別'));
 assert.deepEqual(views.VelY.code_sample[0].code,['Trigger1 = Vel Y >= 0']);
 assert.ok(publicNotes(data.VelY).some(n=>n.content.includes('垂直速度0の両方')&&n.content.includes('Vel Y &gt; 0')));
 const conflict=data.VelX.notes.find(n=>n.evidence.status==='conflicting');assert.ok(conflict.content.includes('HitVel X'));assert.ok(!publicNotes(data.VelX).includes(conflict));
});
test('Pos X keeps screen-center coordinates separate from stage coordinates and scopes CameraPos to 1.1',()=>{
 const v=views.PosX;assert.equal(v.page.category[1],'画面中央基準の現在X座標取得');assert.equal(data.PosX.page.category[1],'ステージ中心基準の現在X座標取得');
 assert.ok(v.description.includes('左側は負、右側は正')&&v.description.includes('向きによって左右の符号を反転させません'));
 const note=publicNotes(data.PosX).find(n=>n.content.includes('Pos X + CameraPos X'));assert.deepEqual(note.environment,{engine:'mugen',runtime:['mugen-1.1']});
 assert.deepEqual(note.evidence.source_refs,['posx-local-1.1']);assert.deepEqual(v.code_sample[0].code,['Trigger1 = Pos X > 0']);assert.equal(data.PosX.code_sample[0].visibility,'internal');
});
test('Pos Y includes zero at ground and distinguishes below-ground conditions from landing transitions',()=>{
 const v=views.PosY;assert.ok(v.description.includes('地面を0')&&v.description.includes('地面より上は負、地面より下は正')&&v.description.includes('着地処理'));
 assert.equal(v.code_sample.length,1);assert.ok(v.code_sample[0].title.includes('地面上'));assert.deepEqual(v.code_sample[0].code,['Trigger1 = Pos Y >= 0']);
 assert.ok(publicNotes(data.PosY).some(n=>n.content.includes('地面上の0も含みます')&&n.content.includes('Pos Y &gt; 0')&&n.content.includes('Pos Y &lt; 0')));
 assert.equal(data.PosY.code_sample[0].visibility,'internal');assert.ok(data.PosY.notes.some(n=>n.evidence.status==='conflicting'&&n.content.includes('Pos X=0なら地面')));
});
test('old rounding advice, coordinate diagrams and evaluation-order research stay exclusively internal',()=>{
 for(const [name,source]of Object.entries(data)){
  const n=source.notes.find(n=>n.content.includes('エラーとなる場合が多い'));assert.equal(n.visibility,'internal');assert.equal(n.evidence.status,'unverified');assert.ok(!publicNotes(source).includes(n));
  assert.ok(!views[name].quote.some(q=>q.source_type==='community_documentation'||q.id?.endsWith('-legacy')));
 }
 for(const name of ['PosX','PosY']){assert.equal(data[name].images[0].visibility,'internal');assert.deepEqual(views[name].images,[]);assert.ok(data[name].notes.some(n=>n.visibility==='internal'&&n.content.includes('上向きY軸')));}
 for(const name of ['VelX','VelY'])assert.ok(data[name].notes.some(n=>n.visibility==='internal'&&n.content.includes('PosFreeze/Bind')&&n.evidence.status==='unverified'));
});
