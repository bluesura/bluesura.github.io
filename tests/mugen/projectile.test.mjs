import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';
import {copyLines,describeDefault} from '../../src/lib/mugen/defaults.mjs';

const entry=loadPlan('projectile-definition-01').documents[0];
const before=readJSON('tests/mugen/batches/projectile-definition-01/json/state-controllers/Projectile.json');
const doc=readJSON('src/content/state-controllers/Projectile.json');
const common=['IgnoreHitPause','Persistent'].map(name=>readJSON(`src/data/common/${name}.json`));
const view=normalizeDocument(doc,common),find=name=>view.parameter.find(p=>p.parameter===name);
const lines=copyLines(view,view.parameter);
const inactive=name=>lines.some(l=>l.startsWith('; '+name.padEnd(25)+'='));

test('Projectile preserves 122 original definitions 44 histories diagrams quotes and exact priorities with additive edits',()=>{
 assert.deepEqual(doc,addFields(before,entry.additions));
 assert.equal(before.parameter.length,122);assert.equal(doc.parameter.length,124);
 assert.equal(doc.page.introduced_in,null);
 assert.deepEqual(doc.version,before.version);assert.equal(doc.version.length,44);
 for(const [i,p]of before.parameter.entries())for(const [key,value]of Object.entries(p))assert.deepEqual(doc.parameter[i][key],value);
 for(const [key,value]of Object.entries(before.page))assert.deepEqual(doc.page[key],value);
 for(const [i,q]of before.quote.entries())assert.deepEqual(doc.quote[i],q);
 for(const [i,img]of before.images.entries())for(const [key,value]of Object.entries(img))assert.deepEqual(doc.images[i][key],value);
 assert.deepEqual(doc.notes.filter(n=>n.legacy_index!==undefined).map(n=>n.legacy_index),Array.from({length:44},(_,i)=>i));
 for(const n of doc.notes.filter(n=>n.legacy_index>0))assert.equal(n.content,before.version[n.legacy_index].content);
});

test('Projectile copy separates attack ID from ProjID and removes no real shared setting or common parameter',()=>{
 assert.equal(view.parameter.length,121);assert.equal(lines.length,124);
 assert.equal(new Set(view.parameter.map(p=>p.parameter)).size,121);
 assert.equal(find('Attr').parameter_type,'optional');assert.equal(find('Attr').default[0].kind,'none');assert.ok(inactive('Attr'));
 assert.equal(find('GuardFlag').default[0].kind,'none');assert.ok(inactive('GuardFlag'));
 assert.deepEqual(doc.parameter.find(p=>p.parameter==='GuardFlag').default_value,['MA ;どのような状態でもガード可']);
 assert.equal(find('ID').default[0].value,0);assert.equal(find('ProjID').default[0].kind,'unknown');assert.ok(inactive('ProjID'));
 assert.ok(find('ID').value[0].includes('TargetID'));assert.ok(find('ProjID').description.includes('NumProjID'));
 assert.equal(describeDefault(find('IgnoreHitPause')),'0');assert.equal(describeDefault(find('Persistent')),'1');
 assert.ok(!view.parameter.some(p=>['Pos','ProjCanselAnim','Color','; MinDist','Attack.Width','HitOnce'].includes(p.parameter)));
 for(const name of ['; SprPriority','; MinDist','; MaxDist','Attack.Width','HitOnce'])assert.equal(doc.parameter.find(p=>p.parameter===name).visibility,'internal');
});

test('Projectile shadow defaults respect incompatible 1.0 RGB and 1.1 single flag without active RGB copy',()=>{
 const p=find('ProjShadow');assert.equal(p.default[0].kind,'unknown');assert.ok(p.default[0].display.includes('環境別'));
 assert.deepEqual(p.variants.map(v=>[v.environment.runtime,v.type,v.default[0].value]),[[['mugen-1.0'],['int','int','int'],'0, 0, 0'],[['mugen-1.1'],['int'],0]]);
 assert.ok(inactive('ProjShadow'));assert.ok(!lines.some(l=>/^ProjShadow\s*=/.test(l)));
 const legacy=doc.parameter.find(p=>p.parameter==='ProjShadow');assert.deepEqual(legacy.default_value,['0','0','0']);assert.deepEqual(legacy.load_priority,['4','5','6']);
});

test('Projectile own palette and remap are 1.1 scoped with conditional commented copy and preserved helper typo research',()=>{
 for(const name of ['OwnPal','ReMapPal']){assert.deepEqual(find(name).environment.runtime,['mugen-1.1']);assert.ok(inactive(name));}
 assert.equal(find('OwnPal').default[0].value,0);assert.equal(find('ReMapPal').default[0].value,'-1, 0');
 assert.ok(find('ReMapPal').description.includes('OwnPal'));assert.ok(!find('ReMapPal').description.includes('helper'));
 assert.ok(doc.parameter.find(p=>p.parameter==='ReMapPal').description.includes("helper's"));
 assert.equal(find('OwnPal').load_priority_evidence.status,'unverified');assert.deepEqual(find('OwnPal').load_priority,['?']);
 assert.ok(doc.constraints.some(c=>c.parameters.includes('OwnPal')&&c.environment.runtime.includes('mugen-1.1')));
 assert.ok(publicNotes(doc).some(n=>n.kind==='version_change'&&n.environment.runtime.includes('mugen-1.1')));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('旧WinのOwnPal無効')));
});

test('Projectile coordinate defaults and velocity multipliers remain conditional rather than fixed resolution constants',()=>{
 for(const name of ['ProjEdgeBound','ProjStageBound','ProjHeightBound','YAccel','Fall.YVelocity']){assert.equal(find(name).default[0].kind,'derived');assert.ok(inactive(name));assert.ok(describeDefault(find(name)).includes('720p'));}
 assert.equal(describeDefault(find('ProjHeightBound')),'240p: -240, 1、480p: -480, 2、720p: -960, 4');
 assert.equal(find('ProjRemAnim').default[0].kind,'derived');assert.equal(find('ProjCancelAnim').default[0].kind,'derived');
 assert.ok(find('VelMul').description.includes('乗算'));assert.ok(find('VelMul').description.includes('Accel'));
 assert.ok(find('ProjHits').description.includes('NumHits'));assert.ok(find('ProjPriority').description.includes('ProjSprPriority'));
 assert.ok(find('PosType').description.includes('実行者'));assert.ok(!find('PosType').possible_value.some(r=>r[0]==='N'));
 assert.ok(!JSON.stringify(find('PosType').possible_value).includes('<img'));assert.ok(!find('Offset').min_value&&!find('Offset').max_value);
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('旧PosType N追加')));
});

test('Projectile afterimage settings stay inactive and retain default conflicts plus corrected additive postbright',()=>{
 const names=view.parameter.filter(p=>p.parameter.startsWith('AfterImage.')).map(p=>p.parameter);assert.equal(names.length,12);
 for(const name of names)assert.ok(inactive(name),name);
 assert.equal(find('AfterImage.Time').default[0].kind,'unknown');assert.equal(find('AfterImage.Time').default[0].evidence.status,'conflicting');
 assert.equal(describeDefault(find('AfterImage.PalPostBright')),'0, 0, 0');
 assert.ok(find('AfterImage.PalPostBright').description.includes('加算'));
 assert.equal(find('AfterImage.Trans').default[0].value,'None');
 const old=doc.parameter.find(p=>p.parameter==='AfterImage.PalPostBright');assert.deepEqual(old.default_value,['120, 120, 220']);
 const red=doc.parameter.find(p=>p.parameter==='AfterImage.PalBright');assert.ok(red.load_priority.some(v=>v.includes('-1')));
 assert.equal(red.load_priority_evidence.status,'confirmed');
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('省略=0')));
});

test('Projectile retains unmeasured logs and runtime conflicts internally without claiming runtime evidence',()=>{
 const warnings=doc.notes.filter(n=>n.legacy_index>=4);assert.equal(warnings.length,40);
 assert.ok(warnings.every(n=>n.visibility==='internal'&&n.evidence.status==='unverified'));
 assert.equal(doc.images[0].visibility,'internal');assert.ok(!view.images.length);
 assert.ok(!publicNotes(doc).some(n=>n.kind==='research'));
 for(const n of doc.notes)assert.ok(!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test'));
 assert.ok(!view.quote.some(q=>q.visibility==='internal'));
 for(const p of doc.parameter){if(p.load_priority?.some(v=>v.includes('?')))assert.equal(p.load_priority_evidence.status,'unverified');}
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('Winでは1扱い')));
 assert.ok(doc.notes.some(n=>n.kind==='research'&&n.content.includes('Clsn2同士')));
});

test('Projectile examples specify real attack settings guardability and AIR assets while helper count uses Root',()=>{
 assert.equal(view.code_sample.length,2);assert.ok(view.code_sample[0].description.includes('AIRの2300'));
 const sample=view.code_sample[0].code;assert.ok(sample.includes('Attr = S, NP'));assert.ok(sample.includes('GuardFlag = MA'));assert.ok(sample.includes('ProjID = 2300'));
 for(const line of sample.slice(3)){const name=line.split('=')[0].trim();assert.ok(find(name),name);}
 assert.deepEqual(view.code_sample[1].code,['Trigger1 = Root, NumProjID(2300) = 0']);
 assert.ok(view.description.includes('Rootの所有'));assert.ok(publicNotes(doc).some(n=>n.kind==='limitation'&&n.content.includes('[StateDef -2]')));
 assert.ok(!find('Guard.SparkNo').description.includes('S2010,0'));assert.ok(find('Guard.SparkNo').description.includes('S2010'));
 assert.ok(find('Down.Bounce').description.includes('Yが0の場合は無効'));
});


test('Projectile public spark syntax and pause target are corrected without deleting the retained source claims',()=>{
 assert.ok(find('SparkNo').description.includes('SparkNo = S2000'));
 assert.ok(!find('SparkNo').description.includes('S2000,0'));
 assert.ok(doc.parameter.find(p=>p.parameter==='SparkNo').description.includes('S2000,0'));
 assert.deepEqual(find('PauseTime').value,['飛び道具の停止時間, 相手の揺れ時間']);
 assert.ok(find('PauseTime').description.includes('キャラクター自身の停止時間'));
 assert.ok(!find('Fall').description.includes('x+y'));
 assert.ok(!find('P2StateNo').description.includes('できれば全く使わない'));
});
