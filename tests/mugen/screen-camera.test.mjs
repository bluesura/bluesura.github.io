import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('screen-camera-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
test('screen and camera migration retains every original field including hidden histories samples and images',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/screen-camera-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','summary','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','images','code_sample'])for(const [i,item]of (before[f]??[]).entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});
test('screen and camera retain actual axis tokens with mandatory space-separated syntax and float output',()=>{
 for(const [name,source]of Object.entries(data)){const view=views[name];assert.equal(source.syntax_kind,'special_form');assert.deepEqual(source.return_type,['float']);assert.deepEqual(view.syntax,[`${name.slice(0,-1)} ${name.at(-1)}`]);
  const a=view.parameter[0];assert.equal(a.parameter_type,'required');assert.equal(a.expression_policy,'special_syntax');assert.deepEqual(a.type,['char']);assert.ok(a.description.includes('半角スペース'));
  assert.equal(source.images[0].visibility,'internal');assert.deepEqual(view.images,[]);
 }
});
test('ScreenPos uses left and top origins without publishing Round or treating Pos as stage-absolute',()=>{
 assert.ok(views.ScreenPosX.description.includes('画面左端を0')&&views.ScreenPosX.description.includes('Pos Xは画面中央'));
 assert.ok(views.ScreenPosY.description.includes('画面上端を0')&&views.ScreenPosY.description.includes('Pos Yは地面'));
 for(const name of ['ScreenPosX','ScreenPosY']){const source=data[name],v=views[name];assert.ok(!v.description.includes('Round')&&!v.description.includes('ステージ絶対座標'));assert.ok(source.description.includes('Round()'));
  const n=source.notes.find(n=>n.evidence.status==='conflicting');assert.ok(n.content.includes('top-right')&&n.content.includes('Pos [component]'));assert.ok(!publicNotes(source).includes(n));
  assert.ok(publicNotes(source).some(n=>n.content.includes('ScreenWidth/ScreenHeightはズームの影響を受けません')));
 }
});
test('ScreenPos repairs reference actual RC builds and preserve IKEMEN GO records internally as a separate engine',()=>{
 const registry=readJSON('src/data/engine-versions.json'),rc3=registry.builds.find(b=>b.id==='mugen-1.0-rc3');assert.equal(rc3.build_date,'2009-10-12');assert.equal(rc3.public_date,null);assert.equal(rc3.date_status,'official_history');
 for(const [name,rc]of [['ScreenPosX','rc2'],['ScreenPosY','rc3']]){
  const source=data[name],repair=publicNotes(source).find(n=>n.kind==='version_change');assert.equal(repair.at,`mugen-1.0-${rc}`);assert.equal(repair.change,'fixed');assert.equal(repair.legacy_index,0);
  const ik=source.notes.find(n=>n.legacy_index===1);assert.equal(ik.visibility,'internal');assert.equal(ik.environment.engine,'ikemen-go');assert.equal(ik.evidence.status,'unverified');assert.ok(ik.content.includes('Explodのスケール/HitFallVel'));assert.ok(!publicNotes(source).some(n=>n.environment.engine==='ikemen-go'));
  assert.ok(!views[name].quote.some(q=>q.url.includes('Ikemen-GO')));
 }
});
test('ScreenPos examples scope Game dimensions to 1.0 and retain fractional edges in legacy fixed-size examples',()=>{
 for(const axis of ['X','Y']){const name=`ScreenPos${axis}`,source=data[name],v=views[name],size=axis==='X'?'Width':'Height',limit=axis==='X'?320:240;
  for(const i of [0,1])assert.equal(source.code_sample[i].visibility,'internal');assert.equal(v.code_sample.length,2);
  assert.ok(v.code_sample[0].title.includes('MUGEN 1.0'));assert.deepEqual(v.code_sample[0].code,[`Trigger1 = ScreenPos ${axis} >= 0 && ScreenPos ${axis} < Game${size}`]);assert.ok(v.code_sample[0].description.includes('ズーム'));
  assert.deepEqual(v.code_sample[1].code,[`Trigger1 = ScreenPos ${axis} = [0,${limit})`]);assert.ok(v.code_sample[1].description.includes('小数部分を維持'));assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('閉区間')));
 }
});
test('CameraPos is a 1.1 current position in player coordinates without guessing the Alpha introduction or copying reversed official example',()=>{
 for(const name of ['CameraPosX','CameraPosY']){const source=data[name],v=views[name];assert.deepEqual(source.environment,{engine:'mugen',runtime:['mugen-1.1']});assert.equal(source.page.version,'2012.08.31');assert.equal(source.page.introduced_in,null);
  assert.ok(v.description.includes('基準位置は(0, 0)')&&v.description.includes('実行者の座標空間')&&v.description.includes('速度の判定とは分けて'));
  assert.equal(source.code_sample[0].visibility,'internal');assert.equal(v.code_sample.length,1);assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('Alpha 4の初導入と確認できません')));
 }
 assert.deepEqual(views.CameraPosX.code_sample[0].code,['Trigger1 = CameraPos X > 0']);assert.ok(views.CameraPosX.code_sample[0].title.includes('右'));
 assert.deepEqual(views.CameraPosY.code_sample[0].code,['Trigger1 = CameraPos Y < 0']);assert.ok(views.CameraPosY.code_sample[0].title.includes('上'));
 assert.ok(data.CameraPosX.notes.some(n=>n.visibility==='internal'&&n.evidence.status==='conflicting'&&n.content.includes('left of the center')));
});
