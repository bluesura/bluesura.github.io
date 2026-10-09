import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
import {copyLines} from '../../src/lib/mugen/defaults.mjs';

const entry=loadPlan('reversal-definition-01').documents[0];
const before=readJSON('tests/mugen/batches/reversal-definition-01/json/state-controllers/ReversalDef.json');
const doc=readJSON('src/content/state-controllers/ReversalDef.json');
const common=['IgnoreHitPause','Persistent'].map(name=>readJSON(`src/data/common/${name}.json`));
const view=normalizeDocument(doc,common),find=name=>view.parameter.find(p=>p.parameter===name);
const publicNames=['Reversal.Attr','Attr','HitOnce','PauseTime','HitSound','P1StateNo','P2StateNo','SparkNo','SparkXY','IgnoreHitPause','Persistent'];
const lines=copyLines(view,view.parameter);

test('ReversalDef keeps all 87 original definitions 34 histories FAQ media source links and priority annotations',()=>{
 assert.deepEqual(doc,addFields(before,entry.additions));assert.equal(doc.parameter.length,87);
 for(const [i,p]of before.parameter.entries())for(const [k,v]of Object.entries(p))assert.deepEqual(doc.parameter[i][k],v);
 for(const [k,v]of Object.entries(before.page))assert.deepEqual(doc.page[k],v);
 assert.deepEqual(doc.version,before.version);assert.equal(doc.version.length,34);
 assert.deepEqual(doc.notes.filter(n=>n.legacy_index!==undefined).map(n=>[n.legacy_index,n.content]),before.version.map((v,i)=>[i,v.content]));
 for(const [k,v]of Object.entries(before.qanda[0]))assert.deepEqual(doc.qanda[0][k],v);
 assert.equal(doc['パラメータについて'],'<!--HitDefの丸コピ-->');
 for(const [i,q]of before.quote.entries())for(const [k,v]of Object.entries(q))assert.deepEqual(doc.quote[i][k],v);
 assert.equal(doc.parameter.filter(p=>p.media?.image).length,2);
 assert.equal(doc.page.introduced_in,null);
});

test('ReversalDef publishes supported reversal settings without cloning ordinary damage guard or juggle effects',()=>{
 assert.deepEqual(view.parameter.map(p=>p.parameter),publicNames);assert.equal(lines.length,14);
 assert.equal(doc.parameter.filter(p=>p.visibility==='internal').length,78);
 for(const name of ['ID','Fall','Fall.Damage','Damage','GetPower','GivePower','HitFlag','GuardFlag','Air.Juggle','PalFX.Time']){
  assert.ok(!find(name));const p=doc.parameter.find(p=>p.parameter===name);assert.equal(p.default[0].kind,'unknown');assert.ok(p.load_priority.length);
 }
 assert.ok(!lines.some(l=>/^Damage\s*=|^ID\s*=|^GuardFlag\s*=/.test(l)));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('読み込み順の管理者確認と有効な効果')));
});

test('ReversalDef distinguishes accepted attack attribute list from optional self attribute without forcing unknown defaults',()=>{
 const p=find('Reversal.Attr');assert.equal(p.parameter_type,'required');assert.equal(p.default[0].kind,'required');assert.equal(p.expression_policy,'special_syntax');
 assert.deepEqual(p.type,['属性','属性リスト']);assert.ok(p.description.includes('SA, NA, SA'));
 assert.ok(p.description.includes('組み合わせ'));assert.ok(!p.min_value&&!p.max_value);
 assert.ok(lines.some(l=>/^; Reversal.Attr\s*=.*必須/.test(l)));
 assert.equal(find('Attr').default[0].kind,'unknown');assert.equal(find('HitOnce').default[0].kind,'unknown');
 assert.ok(find('Attr').description.includes('HitOverride'));
 assert.ok(find('HitOnce').description.includes('別々の相手'));
 assert.ok(lines.some(l=>/^; HitOnce\s*=/.test(l)));assert.ok(!lines.some(l=>/^HitOnce\s*=/.test(l)));
 assert.deepEqual(doc.parameter.find(p=>p.parameter==='HitOnce').default_value,['0']);
});

test('ReversalDef spark syntax is one value and SparkXY offsets opponent hitdef rather than ordinary absolute placement',()=>{
 assert.ok(find('SparkNo').description.includes('SparkNo = S2000'));assert.ok(!find('SparkNo').description.includes('S2000,0'));
 assert.ok(doc.parameter.find(p=>p.parameter==='SparkNo').description.includes('S2000,0'));
 assert.ok(find('SparkXY').description.includes('相手のHitDef'));assert.ok(find('SparkXY').description.includes('オフセット'));
 assert.equal(find('SparkXY').default[0].value,'0, 0');assert.equal(find('PauseTime').default[0].value,'0, 0');
 assert.equal(find('SparkNo').default[0].kind,'derived');assert.equal(find('HitSound').default[0].kind,'derived');
 assert.equal(find('P1StateNo').default[0].value,-1);assert.equal(find('P2StateNo').default[0].value,-1);
});

test('ReversalDef history separates 2002 spark change and RC6 compatibility fix from uncertain PrevStateNo report',()=>{
 const changes=publicNotes(doc).filter(n=>n.kind==='version_change');assert.equal(changes.length,2);
 assert.equal(changes[0].at,'mugen-linux-2002.04.14');assert.equal(changes[0].change,'changed');
 assert.equal(changes[1].at,'mugen-1.0-rc6');assert.deepEqual(changes[1].environment.compatibility_profile,['mugen-compat-2002']);
 assert.ok(changes[1].content.includes('1tick'));assert.ok(!changes[1].content.includes('PrevStateNo'));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('PrevStateNo')&&n.content.includes('別事象')));
 for(const n of doc.notes)assert.ok(!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test'));
});

test('ReversalDef original universal helper fixes power uncertainty and 31 warning logs stay internal',()=>{
 assert.equal(doc.qanda[0].visibility,'internal');assert.equal(view.qanda.length,1);
 assert.ok(!view.qanda[0].a.includes('必ず'));assert.ok(view.qanda[0].a.includes('MoveHit'));
 const warnings=doc.notes.filter(n=>n.legacy_index>=3);assert.equal(warnings.length,31);
 assert.ok(warnings.every(n=>n.visibility==='internal'&&n.evidence.status==='unverified'));
 assert.ok(!publicNotes(doc).some(n=>n.kind==='research'));
 assert.ok(doc.notes.some(n=>n.legacy_index===1&&n.content.includes('GivePower')));
 assert.ok(!view.parameter.some(p=>['P1SteteNo','P2SteteNo','RecoverTime','DownHitTime','; Attack.Width'].includes(p.parameter)));
});

test('ReversalDef preserves unresolved and known priorities separately and retained shared anchors do not shift',()=>{
 assert.equal(find('SparkNo').anchor_index,40);assert.equal(find('IgnoreHitPause').anchor_index,87);assert.equal(find('Persistent').anchor_index,88);
 const sin=doc.parameter.find(p=>p.parameter==='PalFX.SinAdd');assert.deepEqual(sin.load_priority,['84','85','86','(調査中・・・)']);assert.equal(sin.load_priority_evidence.status,'unverified');
 assert.equal(find('PauseTime').load_priority_evidence.status,'confirmed');assert.deepEqual(find('PauseTime').load_priority,['17','16']);
 assert.equal(find('Attr').load_priority_evidence.status,'unverified');
 assert.deepEqual(doc.parameter.find(p=>p.parameter==='Snap').load_priority,['(43->45)','(44->46)']);
});

test('ReversalDef distinguishes successful actor from reversed target and example requires actual AIR and destination state',()=>{
 assert.ok(view.description.includes('Clsn1'));assert.ok(view.associated_trigger.includes('MoveHit'));assert.ok(view.associated_trigger.includes('MoveReversed'));
 assert.ok(publicNotes(doc).some(n=>n.kind==='limitation'&&n.content.includes('Projectileそのもの')));
 assert.equal(view.code_sample.length,1);const sample=view.code_sample[0];
 assert.ok(sample.description.includes('AIRにClsn1'));assert.ok(sample.description.includes('801をCNSへ定義'));
 assert.ok(sample.code.includes('Reversal.Attr = SA, NA, SA'));assert.ok(sample.code.includes('HitSound = -1, 0'));
 for(const line of sample.code.slice(3))assert.ok(find(line.split('=')[0].trim()));
 assert.ok(!sample.code.some(l=>l.startsWith('Damage')||l.startsWith('P2StateNo')));
});

test('ReversalDef retains aggregate AA filter syntax without exposing migration bookkeeping or research prose',()=>{
 assert.ok(find('Reversal.Attr').description.includes('SCA, AA'));
 assert.ok(find('Reversal.Attr').description.includes('通常／必殺／超必殺すべて'));
 assert.ok(!view.description.includes('JSON'));
 assert.ok(!find('Attr').description.includes('研究')&&!find('HitOnce').description.includes('研究'));
 assert.ok(doc.parameter[0].documentation.evidence.source_refs.includes('reversal-chaos'));
});
