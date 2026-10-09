import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
import {parameterLine} from '../../src/lib/mugen/defaults.mjs';
const batch='feedback-victory-01',plan=loadPlan(batch);
const docs=Object.fromEntries(plan.documents.map(d=>[d.name,readJSON(`src/content/state-controllers/${d.name}.json`)]));
const views=Object.fromEntries(Object.entries(docs).map(([n,d])=>[n,normalizeDocument(d,[])]));

test('feedback and victory additive migrations preserve original prose all metadata defaults priorities tables images and samples',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/${batch}/json/state-controllers/${e.name}.json`),after=docs[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const [k,v]of Object.entries(before)){
   if(k==='page'){for(const [key,val]of Object.entries(v))assert.deepEqual(after.page[key],val);}
   else if(['parameter','quote','images','code_sample'].includes(k)){for(const [i,item]of v.entries())for(const [key,val]of Object.entries(item))assert.deepEqual(after[k][i][key],val);}
   else assert.deepEqual(after[k],v);
  }
  for(const p of after.parameter){const unknown=p.load_priority.some(v=>v.includes('?'));assert.equal(p.load_priority_evidence.status,unknown?'unverified':'confirmed');if(!unknown)assert.deepEqual(p.load_priority_evidence.basis,['maintainer_report']);}
  for(const n of after.notes)assert.ok(!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test'));
 }
});
test('ForceFeedback preserves tentative retirement internally and scopes documented nonimplementation to MUGEN 1.0',()=>{
 const d=docs.ForceFeedback,v=views.ForceFeedback;
 assert.equal(d.page.introduced_in,null);assert.equal(d.version[0].content,'廃止されています。(多分)');
 const mapped=d.notes.find(n=>n.legacy_index===0);assert.equal(mapped.kind,'research');assert.equal(mapped.visibility,'internal');
 const shown=publicNotes(d);assert.equal(shown.length,1);assert.equal(shown[0].kind,'limitation');assert.deepEqual(shown[0].environment,{engine:'mugen',runtime:['mugen-1.0']});
 assert.ok(v.description.includes('未実装')&&v.description.includes('実際に振動することの確認にはなりません'));
 assert.ok(!shown.some(n=>n.change==='removed'||n.at));assert.ok(mapped.content.includes('1.1固有'));
});
test('ForceFeedback documents constant numeric inputs and ignored frequency without activating untested waveform quoting',()=>{
 const d=docs.ForceFeedback,v=views.ForceFeedback;
 for(const p of d.parameter)assert.equal(p.expression_policy,p.parameter==='WaveForm'?'special_syntax':'constant_only');
 const waveform=v.parameter.find(p=>p.parameter==='WaveForm');assert.equal(waveform.default[0].kind,'unknown');assert.ok(parameterLine(waveform).startsWith('; WaveForm'));
 assert.deepEqual(d.parameter[0].default_value,['"Sine"']);assert.ok(waveform.description.includes('引用符なし'));
 assert.equal(waveform.default[0].display,'sine（公式資料の省略値）');assert.ok(!parameterLine(waveform).includes('未検証'));
 assert.equal(waveform.possible_value.length,5);assert.ok(waveform.possible_value.some(row=>row[0]==='off'));
 const freq=v.parameter.find(p=>p.parameter==='Freq');assert.ok(freq.description.includes('完全に無視'));assert.ok(freq.description.includes('start + d1*t + d2*t**2 + d3*t**3'));
 const ampl=v.parameter.find(p=>p.parameter==='Ampl');assert.deepEqual(ampl.value,['開始振幅','一次係数','二次係数','三次係数']);assert.ok(ampl.description.includes('係数にCNSの式を指定する意味ではありません'));
});
test('VictoryQuote selects numbered quotes only for the winner and records the explicit RC1 introduction with distribution date unknown',()=>{
 const d=docs.VictoryQuote,v=views.VictoryQuote,registry=readJSON('src/data/engine-versions.json');
 assert.equal(d.page.introduced_in,'mugen-1.0-rc1');const rc=registry.builds.find(b=>b.id===d.page.introduced_in);assert.equal(rc.build_date,'2009-09-22');assert.equal(rc.public_date,null);assert.ok(rc.notes.includes('21 Sep'));
 assert.equal(publicNotes(d).find(n=>n.kind==='version_change').at,'mugen-1.0-rc1');
 assert.ok(v.description.includes('勝者の指定')&&v.description.includes('Helperが実行しても効果はありません'));
 const p=v.parameter.find(p=>p.parameter==='value');assert.equal(p.expression_policy,'expression');assert.equal(p.default[0].value,-1);
 assert.ok(p.description.includes('範囲外')&&p.description.includes('victory3'));
 assert.ok(d.notes.some(n=>n.kind==='research'&&n.content.includes('未定義の範囲内番号')&&n.evidence.status==='unverified'));
});
test('VictoryQuote keeps valid bilingual definitions while isolating universal portrait dimensions and supplying actual config groups and safe name selection',()=>{
 const d=docs.VictoryQuote,v=views.VictoryQuote;
 assert.equal(v.images.length,0);assert.equal(d.images[0].visibility,'internal');
 assert.deepEqual(v.code_sample.slice(0,2),d.code_sample.slice(1,3));
 assert.ok(v.code_sample.some(s=>JSON.stringify(s.code)===JSON.stringify(['[Config]','Language = "ja"'])));
 assert.ok(v.code_sample.some(s=>JSON.stringify(s.code)===JSON.stringify(['[Victory Screen]','enabled = 1'])));
 const choice=v.code_sample.find(s=>s.title.includes('victory3'));assert.ok(choice.code.includes('TriggerAll = NumEnemy > 0')&&choice.code.includes('TriggerAll = !IsHelper')&&choice.code.includes('TriggerAll = Win'));
 assert.ok(choice.code.includes('Value = 3'));assert.ok(!choice.code.some(l=>l.startsWith('[State ,')));
 assert.ok(publicNotes(d).some(n=>n.content.includes('UTF-8')&&n.content.includes('TrueType')&&n.content.includes('フォールバック')));
 assert.ok(!publicNotes(d).some(n=>n.content.includes('120×115')));assert.ok(d.notes.some(n=>n.kind==='research'&&n.content.includes('120×115')));
 assert.ok(!v.quote.some(q=>q.source_type==='community_documentation'));assert.ok(!publicNotes(d).some(n=>n.kind==='research'));
});
