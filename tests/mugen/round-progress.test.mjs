import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('round-progress-01');
const data=Object.fromEntries(plan.documents.map(entry=>[entry.name,readJSON(`src/content/triggers/${entry.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('round progress migration retains every original description, image, FAQ, source and code line',()=>{
  for(const entry of plan.documents){
    const before=readJSON(`tests/mugen/batches/round-progress-01/json/triggers/${entry.name}.json`), after=data[entry.name];
    assert.deepEqual(after,addFields(before,entry.additions));
    for(const field of ['description','syntax','associated_trigger','sample_code','version'])assert.deepEqual(after[field],before[field]);
    for(const field of ['images','qanda','code_sample','quote'])for(const [i,item] of (before[field]??[]).entries())for(const key of Object.keys(item))assert.deepEqual(after[field][i][key],item[key]);
    assert.equal(after.page.introduced_in,null);
    assert.deepEqual(after.return_type,['int']);assert.equal(after.syntax_kind,'nullary');assert.deepEqual(after.arguments,[]);assert.deepEqual(views[entry.name].parameter,[]);
  }
});

test('RoundState publishes all five phase values and distinguishes phase, player state and control',()=>{
  for(const text of ['<code>0</code>','<code>1</code>','<code>2</code>','<code>3</code>','<code>4</code>','Pre-intro','Intro','Fight','Pre-over','Over'])assert.ok(views.RoundState.description.includes(text));
  assert.ok(views.RoundState.description.includes('StateNo')&&views.RoundState.description.includes('RoundNo'));
  assert.ok(publicNotes(data.RoundState).some(n=>n.content.includes('Ctrl = 1を保証する条件にはなりません')));
  assert.deepEqual(views.RoundState.code_sample.map(s=>s.code),[['Trigger1 = RoundState = 2'],['Trigger1 = RoundState = 2','Trigger1 = Ctrl']]);
});

test('RoundState preserves monitoring design and separate engine reports without exposing them as MUGEN history',()=>{
  const value=data.RoundState;
  assert.equal(value.images[0].visibility,'internal');
  assert.equal(value.code_sample[0].visibility,'internal');
  assert.ok(value.qanda.every(q=>q.visibility==='internal'));
  assert.ok(value.sample_code.code.includes('var(59) = RoundState'));
  const engineNote=value.notes.find(n=>n.legacy_index===0);
  assert.equal(engineNote.environment.engine,'ikemen-go');assert.equal(engineNote.visibility,'internal');
  assert.ok(!publicNotes(value).some(n=>n.environment?.engine==='ikemen-go'));
  assert.ok(value.notes.some(n=>n.content.includes('修正版')&&n.evidence.status==='conflicting'));
  assert.ok(value.notes.some(n=>n.content.includes('Helperに-3/-2がなく')));
  assert.ok(value.quote.slice(6,8).every(q=>q.visibility==='internal'));
});

test('RoundNo retains the valid third-round comparison and hides the broader-than-described gauge initializer',()=>{
  assert.deepEqual(views.RoundNo.code_sample.map(s=>s.code),[['Trigger1 = RoundNo = 3']]);
  assert.equal(data.RoundNo.code_sample[1].visibility,'internal');
  assert.ok(data.RoundNo.code_sample[1].code.includes('Trigger1   = var(51) != 10 || MatchNo = 1 && RoundNo = 1 && var(52) = 2'));
  assert.ok(data.RoundNo.notes.some(n=>n.content.includes('OR条件だけでも成立')&&n.evidence.status==='conflicting'));
});

test('RoundsExisted keeps zero-based player history and the original Turns example distinct from one-frame detection',()=>{
  assert.ok(views.RoundsExisted.description.includes('最初のラウンドでは0')&&views.RoundsExisted.description.includes('途中'));
  assert.deepEqual(views.RoundsExisted.code_sample[0].code,['Trigger1 = RoundsExisted = 0','Trigger1 = TeamMode = Turns','Trigger1 = RoundNo > 0']);
  assert.deepEqual(views.RoundsExisted.code_sample[1].code,['Trigger1 = RoundsExisted = 0']);
  assert.ok(publicNotes(data.RoundsExisted).some(n=>n.content.includes('最初の1フレームだけという意味にはなりません')));
  assert.ok(data.RoundsExisted.notes.some(n=>n.content.includes('RoundNo - 1')&&n.evidence.status==='unverified'));
  for(const value of Object.values(data)){
    assert.ok(value.notes.filter(n=>n.kind==='research').every(n=>n.visibility==='internal'));
    assert.ok(value.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
  }
});
