import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
import {copyLines,describeDefault} from '../../src/lib/mugen/defaults.mjs';

const plan=loadPlan('modify-explod-01'),entry=plan.documents[0];
const before=readJSON('tests/mugen/batches/modify-explod-01/json/state-controllers/ModifyExplod.json');
const doc=readJSON('src/content/state-controllers/ModifyExplod.json');
const common=['IgnoreHitPause','Persistent'].map(name=>readJSON(`src/data/common/${name}.json`));
const view=normalizeDocument(doc,common),find=name=>view.parameter.find(p=>p.parameter===name);

test('ModifyExplod preserves original 20 definitions images 9 histories priorities prose and source links',()=>{
 assert.deepEqual(doc,addFields(before,entry.additions));
 for(const [key,value]of Object.entries(before)){
  if(key==='page'){for(const [k,v]of Object.entries(value))assert.deepEqual(doc.page[k],v);}
  else if(['parameter','quote'].includes(key)){for(const [i,item]of value.entries())for(const [k,v]of Object.entries(item))assert.deepEqual(doc[key][i][k],v);}
  else assert.deepEqual(doc[key],value);
 }
 assert.equal(doc.parameter.length,20);assert.equal(doc.page.introduced_in,null);
 assert.deepEqual(doc.notes.filter(n=>n.legacy_index!==undefined).map(n=>[n.legacy_index,n.content]),before.version.map((v,i)=>[i,v.content]));
 assert.ok(doc.parameter[4].possible_value.some(r=>r[1].includes('PosType_None.png')));
});

test('ModifyExplod copy retains owner ID selector and shared defaults without inserting creation defaults',()=>{
 assert.ok(view.description.includes('実行者が作成'));assert.ok(find('ID').description.includes('複数'));
 assert.equal(find('ID').default[0].value,-1);
 const lines=copyLines(view,view.parameter);assert.equal(lines.length,22);
 assert.deepEqual(lines.filter(l=>!l.startsWith(';')).slice(3).map(l=>l.split('=')[0].trim()),['ID','IgnoreHitPause','Persistent']);
 for(const p of view.parameter.filter(p=>!['ID','IgnoreHitPause','Persistent'].includes(p.parameter))){
  assert.equal(p.default[0].kind,'none');
  assert.ok(lines.some(l=>l.startsWith('; '+p.parameter.padEnd(25)+'=')));
 }
 assert.equal(describeDefault(find('IgnoreHitPause')),'0');
 assert.ok(!lines.some(l=>/^PosType\s*=\s*P1/.test(l)));
 assert.ok(!lines.some(l=>/^Scale\s*=\s*1/.test(l)));
});

test('ModifyExplod position constraint is scoped to 1.0 without inventing 1.1 syntax or resolving old unknown priorities',()=>{
 const constraint=doc.constraints.find(c=>c.parameters.includes('Pos'));
 assert.deepEqual(constraint.parameters,['Pos','PosType']);
 assert.deepEqual(constraint.environment.runtime,['mugen-1.0']);
 assert.equal(find('PosType').default[0].kind,'none');
 assert.ok(!find('PosType').default[0].display.includes('None'));
 assert.deepEqual(find('PosType').load_priority,['?']);
 assert.equal(find('PosType').load_priority_evidence.status,'unverified');
 assert.ok(find('PosType').possible_value.some(r=>r[0]==='F / front'&&r[1].includes('画面上端')));
 assert.ok(!JSON.stringify(find('PosType').possible_value).includes('<img'));
 assert.ok(!find('Pos').min_value&&!find('Pos').max_value);
 for(const key of ['Space','BindID','Anim','OwnPal','Color'])assert.ok(!view.parameter.some(p=>p.parameter===key));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('mugenversion')));
});

test('ModifyExplod separates unresolved pause-time update records from actual public parameters and keeps anchors',()=>{
 for(const name of ['SuperMoveTime','PauseMoveTime','SuperMove']){
  const p=doc.parameter.find(p=>p.parameter===name);assert.equal(p.visibility,'internal');
  assert.ok(!find(name));assert.ok(p.load_priority.length);
 }
 assert.equal(find('SprPriority').anchor_index,13);
 assert.ok(doc.notes.some(n=>n.legacy_index===4&&n.content.includes('変更することはできない')));
 assert.ok(!publicNotes(doc).some(n=>n.kind==='research'));
 assert.ok(doc.notes.some(n=>n.content.includes('共通の0へ上書きしない')));
 assert.ok(!view.description.includes('Anime')&&!view.description.includes('ID以降'));
});

test('ModifyExplod corrects Scale pair and Trans Default without claiming a verified 1.1 Shadow variant',()=>{
 assert.deepEqual(find('Scale').type,['float','float']);assert.deepEqual(doc.parameter[8].type,['float']);
 const table=find('Trans').possible_value;
 assert.deepEqual(table.find(r=>r[0]==='Default'),['Default','透過設定を変更しない']);
 assert.deepEqual(table.find(r=>r[0]==='None'),['None','透過を無効にする']);
 assert.ok(!find('Trans').description.includes('多分'));
 assert.deepEqual(find('Shadow').environment.runtime,['mugen-1.0']);
 assert.deepEqual(find('Shadow').type,['int','int','int']);assert.equal(find('Shadow').variants,undefined);
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('単一整数')&&n.evidence.status==='conflicting'));
 assert.ok(doc.notes.some(n=>n.legacy_index===8&&n.content.includes('Color')));
});

test('ModifyExplod public sample changes scale only and does not mislabel warnings or research as runtime verification',()=>{
 assert.equal(view.code_sample.length,1);
 assert.deepEqual(view.code_sample[0].code,['[State 0, ModifyExplod]','Type = ModifyExplod','Trigger1 = Time = 0','ID = 2300','Scale = 2, 2']);
 assert.ok(view.code_sample[0].description.includes('別途必要'));
 const warnings=doc.notes.filter(n=>n.legacy_index>=5);assert.equal(warnings.length,4);
 assert.ok(warnings.every(n=>n.visibility==='internal'&&n.evidence.status==='unverified'));
 for(const n of doc.notes)assert.ok(!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test'));
 assert.ok(!view.quote.some(q=>q.visibility==='internal'));
});
