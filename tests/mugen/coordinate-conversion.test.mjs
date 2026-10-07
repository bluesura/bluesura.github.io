import test from 'node:test';
import assert from 'node:assert/strict';
import {readJSON} from '../../scripts/mugen/files.mjs';
import {loadPlan,addFields} from '../../scripts/mugen/batch.mjs';
import {normalizeDocument,publicNotes} from '../../src/lib/mugen/normalize.mjs';

const plan=loadPlan('coordinate-conversion-01');
const data=Object.fromEntries(plan.documents.map(e=>[e.name,readJSON(`src/content/triggers/${e.name}.json`)]));
const views=Object.fromEntries(Object.entries(data).map(([name,value])=>[name,normalizeDocument(value,[])]));
const bases={Const240p:[320,240,3],Const480p:[640,480,6],Const720p:[1280,720,12]};

test('coordinate conversion migration preserves all metadata prose syntax original arguments associations samples and quotes',()=>{
 for(const e of plan.documents){
  const before=readJSON(`tests/mugen/batches/coordinate-conversion-01/json/triggers/${e.name}.json`),after=data[e.name];
  assert.deepEqual(after,addFields(before,e.additions));
  for(const f of ['page','description','syntax','parameter','associated_trigger','code_sample','quote']){
   if(f==='page'){for(const [k,v]of Object.entries(before.page))assert.deepEqual(after.page[k],v);}
   else if(['code_sample','quote'].includes(f)){for(const [i,item]of before[f].entries())for(const k of Object.keys(item))assert.deepEqual(after[f][i][k],item[k]);}
   else assert.deepEqual(after[f],before[f]);
  }
  assert.equal(after.page.introduced_in,null);assert.deepEqual(after.environment,{engine:'mugen',runtime:['mugen-1.0','mugen-1.1']});
  assert.ok(after.notes.every(n=>!('legacy_index'in n)&&!n.evidence.tested_on&&!n.evidence.basis.includes('runtime_test')));
 }
});

test('coordinate conversion functions expose one mandatory float expression inheriting the unchanged legacy parameter',()=>{
 for(const [name,source]of Object.entries(data)){
  assert.equal(source.syntax_kind,'function');assert.deepEqual(source.return_type,['float']);assert.equal(source.arguments.length,1);
  const arg=source.arguments[0],shown=views[name].parameter[0];assert.equal(arg.legacy_index,0);assert.equal(arg.parameter_type,'required');assert.equal(arg.expression_policy,'expression');
  assert.deepEqual(arg.type,['float']);assert.equal(views[name].parameter.length,1);assert.equal(shown.name,'値');assert.equal(shown.parameter_type,'required');
  assert.ok(shown.description.includes('小数・負数・0')&&shown.description.includes('引数がbottom'));
  assert.ok(publicNotes(source).some(n=>n.kind==='behavior'&&n.content.includes('換算結果もbottom')&&n.content.includes('数値0とは区別')));
 }
});

test('conversion formula uses width ratio with exact zero sign and fractional arithmetic independently of height or display resolution',()=>{
 for(const [name,[baseWidth,baseHeight]]of Object.entries(bases)){
  const description=views[name].description;assert.ok(description.includes(`${baseWidth}×${baseHeight}`));
  const match=description.match(/換算元の値 × 評価対象の座標空間の横幅 \/ (\d+)/);assert.equal(Number(match[1]),baseWidth);
  assert.ok(description.includes('高さの比')&&description.includes('表示ピクセル数'));
  const convert=(value,width)=>value*width/Number(match[1]);
  for(const value of [0,-1.5,1.5,3]){
   assert.equal(convert(value,baseWidth),value);assert.equal(convert(value,baseWidth*2),value*2);assert.equal(convert(value,baseWidth/2),value/2);
  }
 }
 // A 1280x720 player's width is 4x the 320x240 reference, not its height ratio 3.
 assert.equal(3*1280/320,12);assert.notEqual(3*1280/320,3*720/240);
});

test('old official assignment fragments stay public and new conversion samples use actual VelSet axes with matching equivalent scaled speeds',()=>{
 for(const [name,[baseWidth,,value]]of Object.entries(bases)){
  const samples=views[name].code_sample;assert.equal(samples.length,2);
  assert.equal(samples[0].code[0],`value = ${name}(${value})`);assert.ok(samples[0].code.includes(';1280x720の場合、12がvalueに代入されます。'));
  assert.deepEqual(samples[1].code,[`[State 0, ${name} velocity]`,'Type = VelSet','Trigger1 = Time = 0',`X = ${name}(${value})`,`Y = ${name}(0)`]);
  const argument=Number(samples[1].code[3].match(/\((\d+)\)/)[1]);
  for(const [width,expected]of [[320,3],[640,6],[1280,12]])assert.equal(argument*width/baseWidth,expected);
  assert.ok(publicNotes(data[name]).some(n=>n.content.includes('common1.cns')&&n.content.includes('0以外')&&n.content.includes('基準')));
 }
});

test('unknown introductory build and resolution interpretation remain internal without inventing a RC1 introduction or a screen zoom multiplier',()=>{
 for(const [name,source]of Object.entries(data)){
  const intro=source.notes.find(n=>n.content.includes('RC1履歴'));assert.equal(intro.visibility,'internal');assert.equal(intro.evidence.status,'unverified');
  assert.ok(intro.content.includes('初追加は明記されない')&&intro.content.includes('introduced_inはnull')&&intro.content.includes('項目？'));
  const coords=source.notes.find(n=>n.content.includes('CameraZoom'));assert.equal(coords.visibility,'internal');assert.ok(coords.content.includes('未測定'));
  assert.equal(publicNotes(source).filter(n=>n.kind==='version_change').length,0);assert.ok(!publicNotes(source).some(n=>n.kind==='research'));
  assert.ok(!views[name].quote.some(q=>q.source_type==='community_documentation'||q.url.includes('history.html')));
 }
});
