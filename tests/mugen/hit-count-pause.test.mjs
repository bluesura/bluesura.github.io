import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('hit-count-pause-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('hit count and pause migration preserves original fields, histories and every original sample',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/hit-count-pause-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const f of ['description','syntax','summary','associated_state','associated_trigger','version','sample_code'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','code_sample','qanda'])for(const [i,item]of (before[f]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[f][i][key],item[key]);
  assert.equal(after.page.introduced_in,null);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.return_type,['int']);assert.deepEqual(after.arguments,[]);assert.deepEqual(views[e.name].parameter,[]);
 }
});
test('hit counts separate simultaneous victims and persistent state counters from combo display and unique opponents',()=>{
 for(const name of ['HitCount','UniqHitCount']){
  const view=views[name];assert.ok(view.description.includes('ガードは含みません')&&view.description.includes('HitCountは1、UniqHitCountは2増えます'));
  assert.ok(view.description.includes('種類数を返すトリガーではありません')&&view.description.includes('コンボ数とは別'));
  assert.ok(view.description.includes('遷移先のStateDef'));
  const n=publicNotes(data[name]).find(n=>n.kind==='behavior');assert.ok(n.content.includes('省略時または0')&&n.content.includes('画面のコンボカウンターには影響しません'));
 }
 assert.deepEqual(views.HitCount.code_sample[0].code,['Trigger1 = HitCount > 8']);
 assert.equal(views.UniqHitCount.page.category.at(-1),'相手ごとに合計したヒット数取得');
});
test('UniqHitCount corrects the half-open interval without rewriting the old closed interval example',()=>{
 assert.equal(data.UniqHitCount.code_sample[0].visibility,'internal');assert.deepEqual(data.UniqHitCount.code_sample[0].code,['Trigger1 = UniqHitCount = [4,6]']);
 assert.equal(views.UniqHitCount.code_sample.length,1);assert.deepEqual(views.UniqHitCount.code_sample[0].code,['Trigger1 = UniqHitCount = [4,6)']);
 assert.ok(views.UniqHitCount.code_sample[0].description.includes('4または5'));
 assert.ok(data.UniqHitCount.notes.some(n=>n.evidence.status==='conflicting'&&n.visibility==='internal'&&n.content.includes('6を含み')));
});
test('HitPauseTime separates the controller evaluation gate from zero and preserves working IgnoreHitPause examples',()=>{
 const view=views.HitPauseTime;assert.deepEqual(view.syntax,['HitPauseTime']);assert.ok(view.description.includes('評価されないことと、式を評価して0を返すことは区別'));
 assert.ok(!view.description.includes('結果として常に'));
 assert.equal(view.code_sample.length,2);assert.ok(view.code_sample[1].code.includes('IgnoreHitPause = 1'));
 assert.equal(data.HitPauseTime.qanda[0].visibility,'internal');assert.equal(view.qanda.length,1);assert.ok(view.qanda[0].a.includes('コントローラー評価が行われません'));
 const n=publicNotes(data.HitPauseTime).find(n=>n.kind==='behavior');assert.ok(n.content.includes('guard.pausetime')&&n.content.includes('GetHitVar(HitShakeTime)')&&n.content.includes('一般のPause / SuperPause'));
});
test('HitPauseTime history scopes RC1 correction and mugenversion compensation while IKEMEN and research stay internal',()=>{
 const value=data.HitPauseTime;assert.deepEqual(value.notes.filter(n=>n.legacy_index!==undefined).map(n=>n.legacy_index),[0,1]);
 const h=publicNotes(value).find(n=>n.kind==='version_change');assert.equal(h.change,'fixed');assert.equal(h.legacy_index,0);assert.ok(h.content.includes('1.0 RC1')&&h.content.includes('式を評価した後')&&h.content.includes('mugenversion = 1.0'));
 const ik=value.notes.find(n=>n.legacy_index===1);assert.equal(ik.environment.engine,'ikemen-go');assert.equal(ik.visibility,'internal');assert.ok(!publicNotes(value).includes(ik));
 assert.ok(!views.HitPauseTime.quote.some(q=>q.url.includes('ikemen')));
 for(const source of Object.values(data)){
  assert.ok(source.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  assert.ok(source.notes.filter(n=>n.kind==='research').every(n=>!publicNotes(source).includes(n)));
 }
});
