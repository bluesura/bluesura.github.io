import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const current = name => readJSON(`src/content/state-controllers/${name}.json`);
const normalized = name => normalizeDocument(current(name), common);

test('boundary and push migration preserves every original field', () => {
  for (const target of loadPlan('boundary-push-01').documents) {
    const original = readJSON(`tests/mugen/batches/boundary-push-01/json/state-controllers/${target.name}.json`);
    assert.deepEqual(current(target.name), addFields(original, target.additions));
  }
});

test('AttackDist keeps the documented version conditions and a required copy line', () => {
  const source = current('AttackDist');
  assert.ok(effectiveDescription(source).includes('現在有効な HitDef がなければ'));
  assert.ok(effectiveDescription(source).includes('MoveType = A'));
  assert.equal(source.parameter[0].default[0].kind, 'required');
  assert.ok(copyLines(normalized('AttackDist'), normalized('AttackDist').parameter).some(line => /^; value\s*=/.test(line)));
});

test('PlayerPush does not publish its unsupported player and Helper initial values', () => {
  const source = current('PlayerPush');
  const view = normalized('PlayerPush');
  assert.ok(source.parameter[0].description.includes('ヘルパーが0'));
  assert.ok(!view.parameter[0].description.includes('ヘルパーが0'));
  assert.ok(source.notes[0].content.includes('初期値'));
  assert.deepEqual(publicNotes(source), []);
});

test('ScreenBound separates boundary and camera controls and preserves the unknown 2002 default', () => {
  const source = current('ScreenBound');
  const view = normalized('ScreenBound');
  assert.deepEqual(source.parameter[0].default.map(item => item.kind), ['unknown', 'literal']);
  assert.deepEqual(source.parameter[0].default[0].environment.runtime, ['mugen-linux']);
  assert.deepEqual(source.parameter[0].default[1].environment.runtime, ['mugen-1.0', 'mugen-1.1']);
  assert.ok(view.parameter[0].description.includes('画面外へ移動'));
  assert.ok(!view.parameter[0].description.includes('ワープ'));
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('適用環境を確認')));
  assert.ok(lines.some(line => /^MoveCamera\s*= 0, 0/.test(line)));
});

test('Width publishes optional Edge and Player without activating its alternative form', () => {
  const source = current('Width');
  const view = normalized('Width');
  assert.deepEqual(source.parameter.slice(0, 2).map(parameter => parameter.parameter_type), ['required', 'required']);
  assert.deepEqual(view.parameter.slice(0, 2).map(parameter => parameter.parameter_type), ['optional', 'optional']);
  assert.equal(view.parameter[0].min_value, undefined);
  assert.equal(view.parameter[1].max_value, undefined);
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^Edge\s*= 0, 0/.test(line)));
  assert.ok(lines.some(line => /^Player\s*= 0, 0/.test(line)));
  assert.ok(lines.some(line => /^; value\s*=/.test(line)));
  assert.deepEqual(publicNotes(source), []);
});
