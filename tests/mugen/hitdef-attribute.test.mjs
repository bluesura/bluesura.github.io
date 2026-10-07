import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
const plan=loadPlan('hitdef-attribute-01'),d=readJSON('src/content/triggers/HitDefAttr.json'),v=normalizeDocument(d,[]);

test('HitDefAttr additive migration preserves prose syntax parameters candidate tables history image and all original examples',()=>{
 const before=readJSON('tests/mugen/batches/hitdef-attribute-01/json/triggers/HitDefAttr.json');
 assert.deepEqual(d,addFields(before,plan.documents[0].additions));
 for(const key of ['description','syntax','parameter','associated_state','version'])assert.deepEqual(d[key],before[key]);
 for(const key of ['page'])for(const [k,val]of Object.entries(before[key]))assert.deepEqual(d[key][k],val);
 for(const key of ['images','code_sample','quote'])for(const [i,item]of before[key].entries())for(const [k,val]of Object.entries(item))assert.deepEqual(d[key][i][k],val);
 assert.equal(d.page.introduced_in,null);assert.equal(v.images.length,0);assert.equal(d.images[0].visibility,'internal');
});
test('HitDefAttr requires the operator and both unquoted attribute arguments while the old optional operator remains archived',()=>{
 assert.equal(d.syntax_kind,'old_style');assert.deepEqual(d.return_type,['int']);assert.equal(d.parameter[0].parameter_type,'optional');
 assert.deepEqual(d.arguments.map(a=>a.legacy_index),[0,1,2]);assert.ok(d.arguments.every(a=>a.parameter_type==='required'&&a.expression_policy==='special_syntax'));
 assert.deepEqual(v.parameter.map(a=>a.parameter_type),['required','required','required']);assert.ok(v.parameter[0].description.includes('省略しません'));
 assert.ok(v.parameter[1].description.includes('引用符で囲みません')&&v.parameter[1].description.includes('StateTypeだけ'));
 for(let i=0;i<3;i++)assert.deepEqual(v.parameter[i].possible_value,d.parameter[i].possible_value);
 assert.ok(v.description.includes('受けた攻撃の情報ではなく'));assert.ok(v.description.includes('両方'));
});
test('HitDefAttr separates RC4 parsing from RC5 evaluation fixes instead of assigning both to a generic version',()=>{
 const notes=publicNotes(d).filter(n=>n.kind==='version_change');assert.equal(notes.length,2);
 assert.deepEqual(notes.map(n=>[n.legacy_index,n.at,n.change]),[[0,'mugen-1.0-rc4','fixed'],[1,'mugen-1.0-rc5','fixed']]);
 assert.ok(notes[0].content.includes('解析'));assert.ok(notes[1].content.includes('評価')&&notes[1].content.includes('別'));
 assert.ok(notes.every(n=>n.evidence.basis.includes('official_history')&&!n.evidence.tested_on));
});
test('HitDefAttr negation example retains exact condition but exposes version scope and no attack guarantee',()=>{
 assert.equal(d.code_sample[2].visibility,'internal');assert.equal(v.code_sample.length,3);
 const sample=v.code_sample.find(s=>s.title.includes('否定する'));assert.deepEqual(sample.code,d.code_sample[2].code);
 assert.ok(sample.description.includes('公式1.0/1.1'));assert.ok(sample.description.includes('攻撃中でない場合'));
 assert.ok(sample.description.includes('確認にはなりません'));assert.ok(!v.code_sample.includes(d.code_sample[2]));
 assert.deepEqual(v.code_sample.slice(0,2),d.code_sample.slice(0,2));
});
test('subset versus overlap and old != doubts remain internal without widening public types to unmeasured wildcards or Projectile detection',()=>{
 const conflict=d.notes.find(n=>n.evidence.status==='conflicting');assert.ok(conflict.content.includes('部分集合')&&conflict.content.includes('共通部分'));
 assert.equal(conflict.visibility,'internal');assert.ok(!publicNotes(d).some(n=>n.kind==='research'));
 const timing=d.notes.find(n=>n.content.includes('UnHittable'));assert.ok(timing.content.includes('反応しない？')&&timing.content.includes('Projectile'));
 assert.equal(timing.evidence.status,'unverified');assert.ok(d.notes.some(n=>n.content.includes('本文の直接取得は失敗')));
 assert.ok(!v.quote.some(q=>q.source_type==='community_documentation'||q.visibility==='internal'));
 assert.ok(!v.parameter[2].possible_value.flat().some(s=>/>[NSHA]P</.test(s)));
 for(const n of d.notes)assert.ok(!n.evidence.basis.includes('runtime_test'));
});
