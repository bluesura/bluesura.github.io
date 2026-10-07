import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('name-comparisons-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));

test('name comparison migration preserves original metadata description quoted syntax diagram and state controller examples',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/name-comparisons-01/json/triggers/${e.name}.json`),after=data[e.name];assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);
  for(const f of ['description','syntax','version','associated_trigger'])assert.deepEqual(after[f],before[f]);
  for(const f of ['images','code_sample','quote'])for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen'});assert.ok(!after.notes.some(n=>'legacy_index' in n));
  assert.ok(after.notes.every(n=>!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('Name and AuthorName expose quoted special-syntax comparisons returning integer booleans rather than string-valued functions',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.syntax_kind,'old_style');assert.deepEqual(source.return_type,['int']);assert.equal(views[name].parameter.length,2);
  const [oper,literal]=views[name].parameter;assert.equal(oper.name,'[oper]');assert.equal(literal.name,'"name"');assert.deepEqual(literal.type,['string']);
  assert.ok(oper.description.includes('=')&&oper.description.includes('!=')&&oper.description.includes('他の比較演算子は使えません'));
  assert.ok(literal.description.includes('ダブルクォート')&&literal.description.includes('文字列リテラル'));
  assert.ok([oper,literal].every(a=>a.parameter_type==='required'&&a.expression_policy==='special_syntax'));
  assert.ok(views[name].description.includes('単独で文字列値を取り出す関数ではありません')&&views[name].description.includes('<code>1</code>'));
 }
 assert.ok(views.Name.description.includes('[Info]にあるname')&&views.Name.description.includes('表示名displaynameやキャラのフォルダ名'));
 assert.ok(views.AuthorName.description.includes('[Info]にあるauthor')&&views.AuthorName.description.includes('同じ対象に対して併用'));
});

test('AuthorName parser fix is scoped to RC4 while conflicting Win inequality and empty-string reports remain internal without changing Name',()=>{
 const changes=publicNotes(data.AuthorName).filter(n=>n.kind==='version_change');assert.equal(changes.length,1);const fix=changes[0];
 assert.equal(fix.change,'fixed');assert.equal(fix.at,'mugen-1.0-rc4');assert.deepEqual(fix.environment,{engine:'mugen',runtime:['mugen-1.0-rc4']});assert.deepEqual(fix.evidence.basis,['official_history']);assert.ok(fix.content.includes('構文解析'));
 assert.equal(publicNotes(data.Name).filter(n=>n.kind==='version_change').length,0);
 const conflict=data.AuthorName.notes.find(n=>n.evidence.status==='conflicting');assert.equal(conflict.visibility,'internal');assert.ok(conflict.content.includes('空文字')&&conflict.content.includes('Win向け研究')&&conflict.content.includes('ChangState'));assert.ok(!publicNotes(data.AuthorName).includes(conflict));
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.quote[0].visibility,'internal');assert.ok(views[name].quote.some(q=>q.url.endsWith(`#${name}(*,***)`)));
  assert.ok(source.notes.some(n=>n.visibility==='internal'&&n.content.includes('大小文字や文字コード')&&n.content.includes('個別本文は取得失敗')));
 }
});

test('missing redirect bottom differs from ordinary mismatch and actual samples guard Enemy before comparison and combine the same target',()=>{
 // Supplied string comparisons only. No emulation of engine name casing, bottom propagation or Enemy selection.
 for(const [name,source]of Object.entries(data)){
  const bottom=publicNotes(source).find(n=>n.kind==='behavior');assert.deepEqual(bottom.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});assert.ok(bottom.content.includes('0とは別にbottom')&&bottom.content.includes('存在を先に確認'));
  const samples=views[name].code_sample.filter(s=>s.code.every(line=>line.startsWith('Trigger1 = ')));
  const literal=name==='Name'?'Kumquat':'Suika';
  assert.deepEqual(samples[0].code,[`Trigger1 = ${name} = "${literal}"`]);assert.deepEqual(samples[1].code,[`Trigger1 = !(${name} = "${literal}")`]);
  assert.deepEqual(samples[2].code,['Trigger1 = NumEnemy > 0',`Trigger1 = Enemy, ${name} = "${literal}"`]);
  const compare=new RegExp(`^Trigger1 = (?:Enemy, )?${name} = "([^"]+)"$`);
  for(const supplied of [literal,'Different name']){
   const equal=supplied===samples[0].code[0].match(compare)[1];assert.equal(equal,supplied===literal);
   const negated=samples[1].code[0].match(/^Trigger1 = !\((?:Name|AuthorName) = "([^"]+)"\)$/);assert.equal(supplied!==negated[1],!equal);
   for(const enemyCount of [0,1,2])assert.equal(enemyCount>0&&supplied===samples[2].code[1].match(compare)[1],enemyCount>0&&supplied===literal);
  }
 }
 const combined=views.AuthorName.code_sample[3];assert.deepEqual(combined.code,['Trigger1 = NumEnemy > 0','Trigger1 = Enemy, Name = "Kumquat"','Trigger1 = Enemy, AuthorName = "Suika"']);
 const [nameLiteral,authorLiteral]=combined.code.slice(1).map(l=>l.match(/= "([^"]+)"$/)[1]);
 for(const suppliedName of ['Kumquat','Other'])for(const suppliedAuthor of ['Suika','Other'])for(const count of [0,1])assert.equal(count>0&&suppliedName===nameLiteral&&suppliedAuthor===authorLiteral,count>0&&suppliedName==='Kumquat'&&suppliedAuthor==='Suika');
});

test('valid original Name NoAutoTurn example remains visible while invalid AuthorName Var assignment and shared diagram stay preserved internally',()=>{
 assert.ok(views.Name.code_sample.some(s=>s.code.includes('Type = AssertSpecial')&&s.code.includes('Flag = NoAutoTurn')));
 assert.equal(data.AuthorName.code_sample[0].visibility,'internal');assert.ok(data.AuthorName.code_sample[0].code.includes('Var = 0'));assert.ok(!views.AuthorName.code_sample.some(s=>s.code.includes('Var = 0')));
 assert.ok(data.AuthorName.notes.some(n=>n.visibility==='internal'&&n.content.includes('v/valueまたはvar(n)')&&n.content.includes('リセット')));
 for(const [name,source]of Object.entries(data)){assert.equal(source.images[0].visibility,'internal');assert.equal(views[name].images.length,0);assert.ok(!publicNotes(source).some(n=>n.content.includes('共有図')||n.content.includes('実測は未実施')));}
});
