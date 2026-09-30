import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, effectivePageCategory, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('hit fall controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('hit-fall-01').documents) {
    const original = readJSON(`tests/mugen/batches/hit-fall-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('HitFallSet publishes confirmed fall variables and hides speculative defaults', () => {
  const original = readJSON('tests/mugen/batches/hit-fall-01/json/state-controllers/HitFallSet.json');
  const current = readJSON('src/content/state-controllers/HitFallSet.json');
  const normalized = normalizeDocument(current, common);

  assert.equal(current.description, original.description);
  assert.deepEqual(current.page.category, original.page.category);
  assert.equal(effectivePageCategory(current), '空中やられ時の落下変数を設定');
  assert.deepEqual(normalized.page.category, ['状態変化', '空中やられ時の落下変数を設定']);
  assert.ok(effectiveDescription(current).includes('落下フラグ'));
  assert.ok(!effectiveDescription(current).includes('強制移行'));
  assert.deepEqual(current.parameter[0].default[0].value, -1);
  assert.deepEqual(current.parameter.slice(1).map(parameter => parameter.default[0].kind), ['none', 'none']);
  assert.deepEqual(current.parameter[1].default_value, original.parameter[1].default_value);
  assert.deepEqual(current.parameter[2].default_value, original.parameter[2].default_value);
  assert.equal(normalized.parameter[1].default_value, undefined);
  assert.equal(normalized.parameter[2].default_value, undefined);
  assert.equal(current.parameter[1].load_priority[0], '?');
  assert.equal(current.parameter[2].load_priority[0], '?');
  assert.deepEqual(publicNotes(current), []);
});

test('HitFallVel and HitFallDamage remain parameterless and publish confirmed effects', () => {
  const velocity = readJSON('src/content/state-controllers/HitFallVel.json');
  const damage = readJSON('src/content/state-controllers/HitFallDamage.json');

  assert.equal(velocity.parameter, undefined);
  assert.equal(damage.parameter, undefined);
  assert.ok(effectiveDescription(velocity).includes('fall.xvel'));
  assert.ok(effectiveDescription(velocity).includes('fall.yvel'));
  assert.ok(effectiveDescription(damage).includes('落下ダメージ'));
  assert.deepEqual(publicNotes(velocity), []);
  assert.deepEqual(publicNotes(damage), []);
});

test('hit fall CNS output does not invent parameters and keeps optional values copy-safe', () => {
  const hitFallSet = normalizeDocument(readJSON('src/content/state-controllers/HitFallSet.json'), common);
  const setLines = copyLines(hitFallSet, hitFallSet.parameter);
  assert.ok(setLines.some(line => /^value\s*=/.test(line) && line.includes('-1')));
  assert.ok(setLines.some(line => /^; XVel\s*=/.test(line) && line.includes('変更しない')));
  assert.ok(setLines.some(line => /^; YVel\s*=/.test(line) && line.includes('変更しない')));

  for (const name of ['HitFallVel', 'HitFallDamage']) {
    const document = normalizeDocument(readJSON(`src/content/state-controllers/${name}.json`), common);
    const lines = copyLines(document, document.parameter);
    assert.ok(lines.every(line => !/^;?\s*(value|xvel|yvel)\s*=/i.test(line)));
  }
});
