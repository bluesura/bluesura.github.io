import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('team-affiliation-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('team affiliation migration preserves original descriptions metadata syntax histories examples and FAQ references',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/team-affiliation-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['quote','qanda','code_sample'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('TeamMode is a quoted-token-free old-style comparison while TeamSide and IsHomeTeam are numeric nullary references',()=>{
 assert.equal(data.TeamMode.syntax_kind,'old_style');assert.deepEqual(data.TeamMode.return_type,['int']);assert.equal(views.TeamMode.parameter.length,2);
 const [oper,mode]=views.TeamMode.parameter;
 assert.equal(oper.name,'[oper]');assert.ok(oper.description.includes('!=')&&oper.description.includes('他の比較演算子は使えません'));
 assert.equal(mode.name,'mode');assert.deepEqual(mode.type,['string']);assert.ok(mode.description.includes('引用符を付けず')&&mode.description.includes('Single')&&mode.description.includes('Simul')&&mode.description.includes('Turns'));
 assert.ok([oper,mode].every(a=>a.parameter_type==='required'&&a.expression_policy==='special_syntax'));
 for(const name of ['TeamSide','IsHomeTeam']){assert.equal(data[name].syntax_kind,'nullary');assert.deepEqual(data[name].arguments,[]);assert.deepEqual(data[name].return_type,['int']);assert.equal(views[name].parameter.length,0);}
});

test('team documentation separates evaluated team format affiliation location facing and mode-dependent home status',()=>{
 assert.ok(views.TeamMode.description.includes('評価対象')&&views.TeamMode.description.includes('試合全体で両チームが同じ形式だと決めつけず')&&views.TeamMode.description.includes('相手へリダイレクト'));
 assert.ok(views.TeamSide.description.includes('P1チーム')&&views.TeamSide.description.includes('P2チーム')&&views.TeamSide.description.includes('現在のX座標やFacingではありません'));
 assert.ok(views.IsHomeTeam.description.includes('ホーム扱いなら1、それ以外なら0')&&views.IsHomeTeam.description.includes('コンピュータ側')&&views.IsHomeTeam.description.includes('P1チーム側'));
 assert.ok(views.TeamMode.qanda.some(q=>q.a.includes('相手側もSingleかは別')));
 assert.ok(views.TeamSide.qanda[0].a.includes('現在の横位置はPos X、向きはFacing'));
 assert.ok(views.IsHomeTeam.qanda[0].a.includes('所属側の1/2'));
 assert.ok(publicNotes(data.TeamMode).some(n=>n.content.includes('サバイバルモードの敵側')&&n.content.includes('Turns')));
});

test('TeamMode parsing and evaluation fixes keep separate RC4 RC5 build scopes and do not invent compatibility or introduction dates',()=>{
 const changes=publicNotes(data.TeamMode).filter(n=>n.kind==='version_change');assert.equal(changes.length,2);
 for(const [i,build]of ['mugen-1.0-rc4','mugen-1.0-rc5'].entries()){
  const n=changes[i];assert.equal(n.legacy_index,i);assert.equal(n.change,'fixed');assert.equal(n.at,build);assert.deepEqual(n.environment,{engine:'mugen',runtime:[build]});assert.deepEqual(n.evidence.basis,['official_history']);assert.ok(!n.environment.compatibility_profile);
 }
 assert.ok(changes[0].content.includes('構文解析')&&changes[0].content.includes('AuthorName'));assert.ok(changes[1].content.includes('評価が誤る'));
 const homeNote=publicNotes(data.IsHomeTeam).find(n=>n.legacy_index===0);assert.equal(homeNote.kind,'behavior');assert.deepEqual(homeNote.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});
});

function modeCondition(line,selected){
 // A comparison of supplied strings only; this does not simulate engine mode or Enemy selection.
 const positive=line.match(/^Trigger1 = TeamMode = (Single|Simul|Turns)$/);
 if(positive)return selected===positive[1];
 assert.equal(line,'Trigger1 = !(TeamMode = Single)');return selected!=='Single';
}
function numericExpression(expression,token,value){
 const expr=expression.replaceAll(token,`(${value})`).replaceAll('IfElse','choose').replace(/(?<![=!<>])=(?!=)/g,'===');
 assert.match(expr,/^(?:choose|[\d\s(),!<>=])+$/);
 return runInNewContext(expr,{choose:(condition,yes,no)=>condition?yes:no},{timeout:100});
}
test('actual team mode and home examples distinguish input values and retain valid TeamSide branching without forcing intro transitions',()=>{
 const modes=views.TeamMode.code_sample;assert.equal(modes.length,5);
 for(const [token,expected]of [['Single',[true,false,false,false]],['Simul',[false,true,false,true]],['Turns',[false,false,true,true]]])for(const [i,s]of modes.slice(0,4).entries())assert.equal(modeCondition(s.code[0],token),expected[i]);
 assert.deepEqual(modes[4].code,['TriggerAll = NumEnemy > 0','Trigger1 = Enemy, TeamMode = Turns']);
 assert.ok(modes.every(s=>s.code.every(line=>!line.includes('"')&&!line.includes('Type = Null'))));
 const side=views.TeamSide.code_sample;assert.equal(side.length,3);
 for(const value of [1,2]){
  assert.equal(numericExpression(side[0].code.find(line=>line.startsWith('Trigger1')).replace(/^Trigger1 = /,''),'TeamSide',value),value===2);
  assert.equal(numericExpression(side[1].code.find(line=>line.startsWith('Var(1)')).replace(/^Var\(1\) = /,''),'TeamSide',value),value===1?100:200);
  assert.equal(numericExpression(side[2].code[0].replace(/^Trigger1 = /,''),'TeamSide',value),value===1);
 }
 const home=views.IsHomeTeam.code_sample;assert.deepEqual(home.map(s=>s.code),[['Trigger1 = IsHomeTeam'],['Trigger1 = !IsHomeTeam']]);
 for(const value of [0,1]){assert.equal(numericExpression('IsHomeTeam','IsHomeTeam',value),value);assert.equal(numericExpression('!IsHomeTeam','IsHomeTeam',value),value===0);}
});

test('foreign-engine records research incorrect location FAQ and intro examples are retained but excluded from public output',()=>{
 for(const [name,source]of Object.entries(data)){
  const index={TeamMode:2,TeamSide:0,IsHomeTeam:1}[name],n=source.notes.find(n=>n.legacy_index===index);
  assert.equal(n.kind,'research');assert.equal(n.visibility,'internal');assert.deepEqual(n.environment,{engine:'ikemen-go'});assert.ok(!publicNotes(source).includes(n));assert.ok(!views[name].quote.some(q=>q.url.toLowerCase().includes('ikemen')));
  assert.ok(!publicNotes(source).some(n=>n.content.includes('今回未検証')));
 }
 for(const name of ['TeamSide','IsHomeTeam'])assert.equal(data[name].qanda[0].visibility,'internal');
 assert.equal(data.TeamMode.qanda[1].visibility,'internal');assert.equal(data.IsHomeTeam.code_sample[0].visibility,'internal');
 assert.ok(data.TeamMode.notes.some(n=>n.visibility==='internal'&&n.content.includes('引用符を付けるとエラー落ち')));
 assert.ok(data.TeamMode.notes.some(n=>n.visibility==='internal'&&n.content.includes('!=が無効')));
 assert.equal(data.TeamMode.quote[0].visibility,'internal');assert.ok(views.TeamMode.quote.some(q=>q.url.endsWith('#TeamMode(*,***)')));
});
