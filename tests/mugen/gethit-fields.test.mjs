import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('gethit-fields-01'),entry=plan.documents[0];
const before=readJSON('tests/mugen/batches/gethit-fields-01/json/triggers/GetHitVar.json');
const doc=readJSON('src/content/triggers/GetHitVar.json'),view=normalizeDocument(doc,[]);
const rows=view.parameter[0].possible_value.slice(1);

test('GetHitVar migration preserves every original selector definition summary syntax sample and quote',()=>{
 assert.deepEqual(doc,addFields(before,entry.additions));
 for(const [key,value] of Object.entries(before)){
  if(key==='page'){for(const [k,v]of Object.entries(value))assert.deepEqual(doc.page[k],v);}
  else if(['parameter','quote','code_sample'].includes(key)){for(const [i,item]of value.entries())for(const [k,v]of Object.entries(item))assert.deepEqual(doc[key][i][k],v);}
  else assert.deepEqual(doc[key],value);
 }
 assert.equal(doc.parameter.length,34);assert.equal(doc.summary,before.summary);
 assert.equal(doc.page.introduced_in,null);
});

test('GetHitVar exposes one mandatory identifier rather than treating 33 selector choices as positional arguments',()=>{
 assert.equal(doc.arguments.length,1);assert.equal(doc.arguments[0].legacy_index,33);
 assert.equal(view.parameter.length,1);const arg=view.parameter[0];
 assert.equal(arg.parameter,'param_name');assert.equal(arg.parameter_type,'required');
 assert.deepEqual(arg.type,['識別子']);assert.equal(arg.expression_policy,'special_syntax');
 assert.ok(doc.parameter.slice(0,33).every(p=>p.visibility==='internal'));
 assert.deepEqual(view.syntax,['GetHitVar(param_name)','GetHitVar(yvel)','GetHitVar(hittime)','GetHitVar(isbound)']);
 assert.equal(doc.syntax.filter(s=>s==='GetHitVar(HitShakeTime)').length,2);
});

test('GetHitVar preserves unknown offsets and index-only names without guessing types and includes documented isbound',()=>{
 assert.equal(rows.length,31);assert.equal(new Set(rows.map(r=>r[0])).size,31);
 assert.deepEqual(rows.find(r=>r[0]==='isbound').slice(0,2),['isbound','int']);
 for(const name of ['xoff','yoff','zoff']){
  assert.deepEqual(doc.parameter.find(p=>p.parameter===name).type,['謎']);
  assert.ok(!rows.some(r=>r[0]===name));
 }
 for(const name of ['hitid','fall.time'])assert.ok(!rows.some(r=>r[0]===name));
 assert.deepEqual(doc.return_type,['int','float']);
 for(const name of ['xvel','yvel','fall.xvel','fall.yvel'])assert.equal(rows.find(r=>r[0]===name)[1],'float');
 assert.ok(publicNotes(doc).some(n=>n.kind==='deprecated'&&n.content.includes('2002')&&n.content.includes('zoff')));
});

test('GetHitVar separates hit-time boundaries from common thresholds and retains conflicting generation scope internally',()=>{
 const published=publicNotes(doc);assert.ok(!view.description.includes('0しか返しません'));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('一律0')&&n.evidence.status==='conflicting'));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('hitshaketime>0')&&n.content.includes('停止解除後')));
 for(const name of ['slidetime','ctrltime','fall.recovertime'])assert.ok(!rows.find(r=>r[0]===name)[2].includes('残り時間'));
 assert.ok(rows.find(r=>r[0]==='slidetime')[2].includes('Time'));
 assert.ok(rows.find(r=>r[0]==='ctrltime')[2].includes('Time'));
 assert.ok(published.some(n=>n.content.includes('&lt; 0')&&n.content.includes('0になっただけ')));
 assert.ok(!published.some(n=>n.kind==='research'));
});

test('GetHitVar keeps its official example and adds scoped condition snippets without invented controller parameters',()=>{
 assert.deepEqual(view.code_sample[0],before.code_sample[0]);
 const snippets=view.code_sample.slice(1);assert.equal(snippets.length,3);
 for(const sample of snippets){assert.equal(sample.code[0],'Trigger1 = MoveType = H');assert.ok(sample.code.every(line=>line.startsWith('Trigger1 = ')));}
 assert.ok(snippets.some(s=>s.code.includes('Trigger1 = GetHitVar(hittime) < 0')));
 assert.ok(snippets.some(s=>s.code.includes('Trigger1 = GetHitVar(isbound)')));
 for(const n of doc.notes)assert.ok(!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test'));
 assert.ok(!view.quote.some(q=>q.visibility==='internal'));
});
