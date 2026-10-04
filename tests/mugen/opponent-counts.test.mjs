import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('opponent-counts-01');
const data = Object.fromEntries(plan.documents.map(entry => [entry.name, readJSON(`src/content/triggers/${entry.name}.json`)]));
const views = Object.fromEntries(Object.entries(data).map(([name,value]) => [name,normalizeDocument(value,[readJSON('src/data/common/Persistent.json')])]));

test('opponent count migration preserves original descriptions, syntax, samples, sources and unknown introduction', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/opponent-counts-01/json/triggers/${entry.name}.json`);
    const after = data[entry.name];
    assert.deepEqual(after, addFields(before,entry.additions));
    assert.deepEqual(after.description,before.description);
    assert.deepEqual(after.syntax,before.syntax);
    for (const field of ['code_sample','quote']) for (const [i,item] of before[field].entries()) for (const key of Object.keys(item)) assert.deepEqual(after[field][i][key],item[key]);
    assert.equal(after.page.introduced_in,null);
    assert.deepEqual(after.return_type,['int']);
    assert.equal(after.syntax_kind,'nullary');
    assert.deepEqual(after.arguments,[]);
    assert.deepEqual(views[entry.name].parameter,[]);
  }
});

test('P2Life publishes a current-life comparison without promising a missing-P2 result or a percentage', () => {
  assert.ok(views.P2Life.description.includes('P2として選択される相手'));
  assert.equal(data.P2Life.code_sample[0].visibility,'internal');
  assert.deepEqual(views.P2Life.code_sample[0].code,['Trigger1 = P2Life <= 200']);
  assert.ok(views.P2Life.code_sample[0].description.includes('最大ライフに対する割合'));
  assert.ok(!publicNotes(data.P2Life).some(n => n.kind==='error'));
  assert.ok(data.P2Life.notes.some(n => n.content.includes('不在時エラー条件を記載していない') && n.evidence.status==='unverified'));
});

test('count readers publish documented normal-helper and neutral-player exclusions without turning counts into booleans', () => {
  for (const name of ['NumEnemy','NumPartner']) {
    assert.ok(views[name].description.includes('人数を整数で返します'));
    assert.ok(views[name].description.includes('通常のヘルパーと中立プレイヤー'));
    assert.ok(data[name].notes.some(n => n.content.includes('normal helpers') && n.evidence.status==='conflicting'));
  }
  assert.ok(data.NumPartner.description.includes('チーム戦は1'));
  assert.ok(!views.NumPartner.description.includes('チーム戦は1'));
  assert.ok(views.NumPartner.description.includes('TeamModeと区別'));
  assert.ok(data.NumPartner.notes.some(n => n.content.includes('交代制チームは0') && n.visibility==='internal'));
});

test('public redirects retain earlier count guards and hide the unverified ID-to-player-number example', () => {
  assert.deepEqual(views.NumEnemy.code_sample[0].code,['Trigger1 = NumEnemy = 2','Trigger1 = EnemyNear(1),Name = "Squash"']);
  assert.deepEqual(views.NumEnemy.code_sample[1].code,['Trigger1 = NumEnemy >= 2','Trigger1 = EnemyNear(1),Life < 200']);
  assert.equal(data.NumPartner.code_sample[0].visibility,'internal');
  assert.ok(data.NumPartner.code_sample[0].code.includes('Trigger5 = var(1) := -1'));
  assert.deepEqual(views.NumPartner.code_sample[0].code,['[State ]','Type = Null','Trigger1 = NumPartner = 1','Trigger1 = Partner,Life < 200']);
  assert.deepEqual(views.NumPartner.code_sample[1].code,['Trigger1 = NumPartner > 0']);
  assert.ok(publicNotes(data.NumPartner).some(n => n.content.includes('先の条件が偽なら後の行は評価されません')));
});

test('special helpers, disappearance, modified engines and selection research stay in JSON without a runtime claim', () => {
  for (const value of Object.values(data)) {
    assert.ok(value.notes.filter(n => n.kind==='research').every(n => n.visibility==='internal'));
    assert.ok(value.notes.every(n => !n.evidence.tested_on && !n.evidence.basis.includes('runtime_test')));
    assert.ok(!publicNotes(value).some(n => n.kind==='research'));
  }
  assert.ok(data.P2Life.notes.some(n => n.content.includes('HelperType=Player') && n.evidence.status==='unverified'));
  assert.ok(data.NumPartner.notes.some(n => n.content.includes('デバッグ消滅') && n.content.includes('実機未確認')));
});
