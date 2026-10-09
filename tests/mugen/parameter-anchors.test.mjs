import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {createDocumentSchema} from '../../src/lib/mugen/schema.mjs';
import {normalizeDocument} from '../../src/lib/mugen/normalize.mjs';
import {copyLines} from '../../src/lib/mugen/defaults.mjs';

const doc=readJSON('src/content/state-controllers/Projectile.json');
const common=['IgnoreHitPause','Persistent'].map(name=>readJSON(`src/data/common/${name}.json`));
const schema=createDocumentSchema('state-controllers',readJSON('src/data/engine-versions.json'));

test('explicit parameter anchors preserve shared legacy links after appending real fields and filtering internal fields',()=>{
 const original=structuredClone(doc),view=normalizeDocument(doc,common);
 assert.equal(view.parameter.find(p=>p.parameter==='IgnoreHitPause').anchor_index,122);
 assert.equal(view.parameter.find(p=>p.parameter==='Persistent').anchor_index,123);
 assert.equal(view.parameter.find(p=>p.parameter==='OwnPal').anchor_index,122);
 assert.equal(view.parameter.find(p=>p.parameter==='AfterImage.Trans').anchor_index,123);
 const IDs=view.parameter.map((p,i)=>`${p.parameter}-${p.anchor_index??i}`);assert.equal(new Set(IDs).size,IDs.length);
 const fallback=structuredClone(doc);delete fallback.documentation.parameter_anchor_indices;
 assert.equal(normalizeDocument(fallback,common).parameter.find(p=>p.parameter==='IgnoreHitPause').anchor_index,124);
 assert.deepEqual(copyLines(view,view.parameter),copyLines(normalizeDocument(fallback,common),normalizeDocument(fallback,common).parameter));
 assert.deepEqual(doc,original);
});

test('explicit anchors work when no internal fields exist and unconfigured parameters keep ordinary indices',()=>{
 const doc={category:'state',state:'Example',parameter:[{parameter:'Value',default_value:['1']}],documentation:{description:'example',parameter_anchor_indices:{IgnoreHitPause:1}}};
 const view=normalizeDocument(doc,common);
 assert.equal(view.parameter[0].anchor_index,undefined);
 assert.equal(view.parameter.find(p=>p.parameter==='IgnoreHitPause').anchor_index,1);
 assert.equal(view.parameter.find(p=>p.parameter==='Persistent').anchor_index,undefined);
});

test('anchor metadata rejects negative fractional empty-name and nonnumeric values while permitting zero',()=>{
 for(const anchors of [{IgnoreHitPause:-1},{IgnoreHitPause:0.5},{IgnoreHitPause:'122'},{'':122},['IgnoreHitPause']]){
  assert.equal(schema.safeParse({...doc,documentation:{...doc.documentation,parameter_anchor_indices:anchors}}).success,false);
 }
 assert.equal(schema.safeParse({...doc,documentation:{...doc.documentation,parameter_anchor_indices:{IgnoreHitPause:0}}}).success,true);
});
