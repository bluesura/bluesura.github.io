import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const batch='command-stage-metadata-01',plan=loadPlan(batch);
const data=Object.fromEntries(plan.documents.map(d=>[d.name,readJSON(`src/content/triggers/${d.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([n,d])=>[n,normalizeDocument(d,[])]));

test('Command and StageVar preserve all original prose metadata syntax parameters history code FAQ and references',()=>{
 for(const d of plan.documents){
  const before=readJSON(`tests/mugen/batches/${batch}/json/triggers/${d.name}.json`),after=data[d.name];
  assert.deepEqual(after,addFields(before,d.additions));
  for(const [key,value]of Object.entries(before)){
   if(key==='page'){for(const [k,v]of Object.entries(value))assert.deepEqual(after.page[k],v);}
   else if(['code_sample','quote','qanda'].includes(key)){for(const [i,item]of value.entries())for(const [k,v]of Object.entries(item))assert.deepEqual(after[key][i][k],v);}
   else assert.deepEqual(after[key],value);
  }
  assert.equal(after.page.engine,'mugen');assert.deepEqual(after.return_type,['int']);assert.equal(after.syntax_kind,'old_style');
  for(const n of after.notes){assert.ok(!n.evidence.tested_on);assert.ok(!n.evidence.basis.includes('runtime_test'));}
 }
});

test('Command exposes only required comparison operator and case sensitive quoted name without GO links or GO history',()=>{
 const d=data.Command,v=views.Command;
 assert.equal(d.page.introduced_in,null);assert.equal(v.parameter.length,2);
 assert.deepEqual(d.arguments.map(a=>[a.name,a.expression_policy,a.parameter_type]),[['[oper]','special_syntax','required'],['"command_name"','special_syntax','required']]);
 assert.ok(v.parameter[1].description.includes('大文字・小文字'));
 assert.deepEqual(d.associated_trigger,['Key','KeyDown','KeyUp']);assert.deepEqual(v.associated_trigger,['Ctrl','StateType']);
 const go=d.notes.find(n=>n.legacy_index===0);assert.equal(go.environment.engine,'ikemen-go');assert.equal(go.kind,'research');assert.equal(go.visibility,'internal');
 assert.ok(go.content.includes('再現手順不足'));assert.ok(!publicNotes(d).some(n=>n.environment?.engine==='ikemen-go'));
 assert.ok(!v.quote.some(q=>q.url.includes('Ikemen-GO')||q.url.endsWith('#Command')));
 assert.ok(v.quote.some(q=>q.url.endsWith('#Command (*,***)')));
});

test('inverted CMD timing caption stays internal while identical real CMD settings receive the corrected caption',()=>{
 const d=data.Command,v=views.Command,old=d.code_sample[1];
 assert.equal(old.visibility,'internal');assert.ok(old.description.includes('Time</code> は成立後'));
 const fixed=v.code_sample.find(s=>s.title==='CMDの入力猶予と成立後の有効期間');
 assert.deepEqual(fixed.code,old.code);assert.ok(fixed.description.includes('入力を完成させる猶予を15フレーム'));
 assert.ok(fixed.description.includes('成立したフレームだけ有効'));assert.ok(!v.code_sample.includes(old));
 assert.ok(v.code_sample.some(s=>s.title.includes('同名コマンド')));
 assert.ok(publicNotes(d).some(n=>n.content.includes('成立を1回だけのイベントとは扱わない')&&n.content.includes('ホールドだけ')));
 assert.ok(publicNotes(d).some(n=>n.content.includes('1000')&&n.content.includes('キャラクター側で定義')));
});

test('Pause FAQ uses EndCmdBufTime with bounded duration and only frozen players rather than an invented buffer parameter',()=>{
 const d=data.Command,v=views.Command;
 assert.equal(d.qanda[1].visibility,'internal');assert.ok(d.qanda[1].a.includes('状況によって'));
 const faq=v.qanda.find(q=>q.q.includes('終了直後まで'));assert.ok(faq);
 for(const word of ['EndCmdBufTime','0〜Time','省略時','停止中に動けない','MoveTime','SuperPause'])assert.ok(faq.a.includes(word));
 assert.ok(!faq.a.includes('CommandBufferTime'));assert.ok(!v.qanda.includes(d.qanda[1]));
 const pause=readJSON('src/content/state-controllers/Pause.json');assert.ok(pause.parameter.some(p=>p.parameter==='EndCmdBufTime'));
});

test('StageVar separates an unquoted identifier from operator and string while retaining the original three parameter tables',()=>{
 const d=data.StageVar,v=views.StageVar;
 assert.equal(v.parameter.length,3);assert.deepEqual(d.arguments.map(a=>a.legacy_index),[0,1,2]);
 assert.deepEqual(d.arguments.map(a=>a.type),[['識別子'],['演算子'],['string']]);
 assert.ok(d.arguments.every(a=>a.expression_policy==='special_syntax'&&a.parameter_type==='required'));
 assert.deepEqual(v.parameter[0].possible_value,d.parameter[0].possible_value);assert.deepEqual(v.parameter[1].possible_value,d.parameter[1].possible_value);
 assert.ok(v.parameter[0].description.includes('引用符で囲みません'));assert.equal(v.code_sample.length,2);
 const conflict=d.notes.find(n=>n.evidence.status==='conflicting');assert.ok(conflict.content.includes('info.authorname')&&conflict.content.includes('info.author'));
 assert.equal(conflict.visibility,'internal');assert.ok(!publicNotes(d).includes(conflict));
 assert.ok(!v.syntax.some(s=>s.toLowerCase().includes('authorname')));assert.ok(!v.parameter[0].possible_value.flat().some(s=>s.toLowerCase().includes('authorname')));
});

test('StageVar addition maps the existing history to RC8 while unknown comparison and command processing research stay internal',()=>{
 const d=data.StageVar,history=publicNotes(d).filter(n=>n.kind==='version_change');
 assert.equal(d.page.introduced_in,'mugen-1.0-rc8');assert.equal(history.length,1);
 assert.equal(history[0].legacy_index,0);assert.equal(history[0].at,'mugen-1.0-rc8');assert.equal(history[0].change,'added');
 assert.deepEqual(history[0].evidence.basis,['official_history']);
 assert.ok(publicNotes(d).some(n=>n.content.includes('displayname')&&n.content.includes('省略')));
 for(const source of Object.values(data))assert.ok(!publicNotes(source).some(n=>n.kind==='research'));
 const research=data.Command.notes.filter(n=>n.kind==='research'&&n.environment.engine==='mugen');
 assert.ok(research.some(n=>n.content.includes('recovery')&&n.content.includes('疑問符')));
 assert.ok(research.some(n=>n.content.includes('ホールド順')&&n.evidence.status==='unverified'));
});
