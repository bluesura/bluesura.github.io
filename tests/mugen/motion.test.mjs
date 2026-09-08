import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { parameterLine, copyLines } from '../../src/lib/mugen/defaults.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const load = name => readJSON(`src/content/state-controllers/${name}.json`);

test('second motion batch matches the reviewed additions and preserves literal defaults and parameter-free Gravity', () => {
  for (const entry of loadPlan('axis-motion-02').documents) {
    const original = readJSON(`tests/mugen/batches/axis-motion-02/json/state-controllers/${entry.name}.json`);
    const source = load(entry.name);
    assert.deepEqual(source, addFields(original, entry.additions));
    assert.equal(source.page.introduced_in, null);
    for (const parameter of source.parameter ?? []) {
      assert.deepEqual(parameter.load_priority, original.parameter.find(p => p.parameter === parameter.parameter).load_priority);
      assert.equal(parameter.load_priority_evidence.status, 'confirmed');
      assert.equal(parameter.expression_policy, 'expression');
    }
  }
  const velocity = normalizeDocument(load('VelMul'), common);
  assert.deepEqual(velocity.parameter.slice(0, 2).map(p => p.value[0]), ['水平方向の速度倍率', '垂直方向の速度倍率']);
  for (const parameter of velocity.parameter.slice(0, 2)) {
    assert.match(parameterLine(parameter), /^[XY]\s+= 1$/);
    assert.ok(parameter.description.includes('負の倍率'));
    assert.ok(!parameter.description.includes('ターゲット'));
  }
  const freeze = normalizeDocument(load('PosFreeze'), common);
  assert.match(parameterLine(freeze.parameter[0]), /^value\s+= 1$/);
  assert.ok(freeze.parameter[0].description.includes('0以外'));
  const gravity = normalizeDocument(load('Gravity'), common);
  assert.equal(load('Gravity').parameter, undefined);
  assert.deepEqual(gravity.parameter.map(p => p.parameter), ['IgnoreHitPause', 'Persistent']);
  assert.equal(copyLines(gravity, gravity.parameter).length, 5);
});

test('conflicting Gravity and PosFreeze descriptions remain internal with community evidence and no invented build', () => {
  for (const name of ['Gravity', 'PosFreeze']) {
    const source = load(name);
    const original = readJSON(`tests/mugen/batches/axis-motion-02/json/state-controllers/${name}.json`);
    assert.equal(source.description, original.description);
    assert.deepEqual(publicNotes(source), []);
    const research = source.notes[0];
    assert.equal(research.kind, 'research');
    assert.equal(research.evidence.status, 'conflicting');
    assert.deepEqual(research.evidence.source_refs, ['posfreeze-chaos-current', 'gravity-chaos-current']);
    assert.ok(research.content.includes('Win版'));
    assert.equal(research.evidence.tested_on, undefined);
    const current = normalizeDocument(source, common);
    assert.ok(!current.description.includes('PosFreeze中に加速の影響を受けない'));
    assert.ok(!current.description.includes('VelAdd・Gravityの影響を受けます'));
    if (name === 'Gravity') {
      assert.ok(current.description.includes('実行するたび'));
      assert.ok(current.description.includes('physics = N'));
      assert.ok(!current.description.includes('常に重力'));
      assert.ok(!current.description.includes('phisycs'));
    }
  }
});
