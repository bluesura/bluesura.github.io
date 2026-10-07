import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('player-names-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('player name migration preserves all original prose metadata syntax associations diagrams and samples through additive edits',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/player-names-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','quote'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});
  assert.ok(after.notes.every(n=>!('legacy_index'in n)&&!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('player name comparisons use required operator and quoted special-syntax literal and integer results rather than string functions',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.syntax_kind,'old_style');assert.deepEqual(source.return_type,['int']);
  const [operator,literal]=views[name].parameter;assert.equal(views[name].parameter.length,2);
  assert.equal(operator.name,'[oper]');assert.equal(literal.name,'"name"');assert.deepEqual(literal.type,['string']);
  assert.ok(operator.description.includes('!=')&&operator.description.includes('他の比較演算子は使えません'));
  assert.ok(literal.description.includes('ダブルクォート')&&literal.description.includes('文字列リテラル'));
  assert.ok([operator,literal].every(a=>a.parameter_type==='required'&&a.expression_policy==='special_syntax'));
  assert.ok(views[name].description.includes('単独で文字列値を取り出す関数ではありません')&&views[name].description.includes('<code>1</code>'));
  assert.ok(views[name].description.includes('displaynameやキャラのフォルダ名'));
 }
});

test('relative player targets correct P2 teammate confusion without overwriting original associations or asserting fixed side numbers',()=>{
 assert.ok(views.P1Name.description.includes('Name</code>の別名')&&views.P1Name.description.includes('固定の1P側')&&views.P1Name.description.includes('リダイレクト時'));
 assert.ok(views.P2Name.description.includes('第1の対戦相手')&&views.P2Name.description.includes('パートナーを調べるトリガーではありません'));
 assert.deepEqual(views.P2Name.associated_trigger,['NumEnemy','Name','P1Name','P3Name','P4Name']);
 assert.ok(data.P2Name.associated_trigger.includes('NumPartner'));
 assert.ok(views.P3Name.description.includes('同じチームのパートナー')&&views.P3Name.description.includes('固定の3P側'));
 assert.ok(views.P4Name.description.includes('第2の対戦相手')&&views.P4Name.description.includes('固定の4P側'));
 for(const name of ['P2Name','P3Name','P4Name']){
  const correction=data[name].notes.find(n=>n.evidence.status==='conflicting');assert.equal(correction.visibility,'internal');
  assert.ok(correction.content.includes('旧本文')&&correction.content.includes('bottom')&&correction.content.includes('直接比較'));
  assert.ok(!publicNotes(data[name]).includes(correction));
 }
});

test('absent direct P2 P3 P4 comparisons return 0 or 1 separately from bottom for a missing redirect and examples include the correct presence guard',()=>{
 const inputs={P2Name:['Sakura','NumEnemy > 0',1],P3Name:['Sakura','NumPartner > 0',1],P4Name:['Boss','NumEnemy >= 2',2]};
 for(const [name,[literal,guard,minCount]]of Object.entries(inputs)){
  const notes=publicNotes(data[name]);const absence=notes.find(n=>n.content.includes('指定した名前にかかわらず'));
  assert.ok(absence.content.includes(`${name} = "名前"</code>は<code>0`)&&absence.content.includes(`${name} != "名前"</code>は<code>1`));
  const bottom=notes.find(n=>n.content.includes('リダイレクト先そのもの'));
  assert.deepEqual(bottom.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});assert.ok(bottom.content.includes('0/1とは区別'));
  const samples=views[name].code_sample;
  assert.deepEqual(samples[0].code,[`Trigger1 = ${name} = "${literal}"`]);
  assert.deepEqual(samples[1].code,[`Trigger1 = !(${name} = "${literal}")`]);
  assert.deepEqual(samples[2].code,[`Trigger1 = ${guard}`,`Trigger1 = ${name} != "${literal}"`]);
  // Check guards extracted from actual published CNS lines. Counts and boolean results
  // are supplied inputs; this does not emulate MUGEN's target selection/string matching.
  const [,comparison,threshold]=samples[2].code[0].match(/^Trigger1 = Num(?:Enemy|Partner) (>|>=) (\d+)$/);
  for(const count of [0,1,2])for(const nameMismatch of [false,true]){
   const present=comparison==='>'?count>Number(threshold):count>=Number(threshold);
   assert.equal(present&&nameMismatch,count>=minCount&&nameMismatch);
  }
 }
 assert.ok(views.P4Name.code_sample[2].description.includes('1人の場合'));
 assert.equal(publicNotes(data.P1Name).filter(n=>n.content.includes('指定した名前にかかわらず')).length,0);
});

test('legacy examples shared figures and target-selection research stay internal while corrected historical anchors remain public',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.images[0].visibility,'internal');assert.equal(views[name].images.length,0);
  assert.equal(source.code_sample[0].visibility,'internal');assert.ok(!views[name].code_sample.some(s=>s.code.includes('Type = ChangeState')||s.code.includes('Var = 2')));
  assert.equal(source.quote[0].visibility,'internal');assert.ok(views[name].quote.some(q=>q.url.endsWith(`#${name}(*,***)`)));
  const selection=source.notes.find(n=>n.content.includes('距離同値'));assert.equal(selection.visibility,'internal');assert.equal(selection.evidence.status,'unverified');
  assert.ok(selection.content.includes('first opponent')&&selection.content.includes('もっとも近い相手')&&selection.evidence.basis.includes('community_documentation'));
  assert.ok(!publicNotes(source).some(n=>n.kind==='research'||n.content.includes('AuthorNameのRC4')));
 }
 assert.ok(data.P1Name.notes.some(n=>n.visibility==='internal'&&n.content.includes('Var = 2')&&n.content.includes('v/value')));
 assert.ok(data.P2Name.notes.some(n=>n.visibility==='internal'&&n.content.includes('NumPartnerはP2Name対象の存在確認にならない')));
});
