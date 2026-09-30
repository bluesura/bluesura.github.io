import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('target control controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('target-control-01').documents) {
    const original = readJSON(`tests/mugen/batches/target-control-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('TargetBind publishes the official defaults and keeps conflicting old behavior internal', () => {
  const original = readJSON('tests/mugen/batches/target-control-01/json/state-controllers/TargetBind.json');
  const current = readJSON('src/content/state-controllers/TargetBind.json');
  assert.deepEqual(current.parameter.map(parameter => parameter.default_value), original.parameter.map(parameter => parameter.default_value));
  assert.deepEqual(current.parameter.map(parameter => parameter.default[0].value), [-1, 1, '0, 0']);
  assert.ok(effectiveDescription(current).includes('実行者の軸'));
  assert.ok(!effectiveDescription(current).includes('特定のターゲットを指定できない'));
  assert.ok(current.notes.some(note => note.evidence.status === 'conflicting' && note.content.includes('-1025')));
  assert.deepEqual(publicNotes(current), []);
});

test('TargetDrop publishes both optional defaults and selection behavior', () => {
  const current = readJSON('src/content/state-controllers/TargetDrop.json');
  assert.deepEqual(current.parameter.map(parameter => parameter.default[0].value), [-1, 1]);
  assert.ok(current.parameter[0].documentation.description.includes('すべてのターゲットを外し'));
  assert.ok(current.parameter[1].documentation.description.includes('ランダムに1体'));
  assert.ok(current.parameter.every(parameter => parameter.load_priority_evidence.basis.includes('maintainer_report')));
});

test('TargetFacing removes the unsupported public default while preserving it in raw JSON', () => {
  const original = readJSON('tests/mugen/batches/target-control-01/json/state-controllers/TargetFacing.json');
  const current = readJSON('src/content/state-controllers/TargetFacing.json');
  assert.deepEqual(current.parameter[1].default_value, original.parameter[1].default_value);
  assert.equal(current.parameter[1].default[0].kind, 'required');
  assert.equal(current.parameter[1].load_priority_evidence, undefined);
  assert.deepEqual(current.parameter[1].load_priority, ['?']);
  const normalized = normalizeDocument(current, common);
  assert.equal(normalized.parameter[1].default_value, undefined);
  assert.ok(normalized.parameter[1].description.includes('同じ方向'));
  assert.deepEqual(publicNotes(current), []);
});

test('target controller CNS output keeps confirmed defaults active and required facing unset', () => {
  const bind = normalizeDocument(readJSON('src/content/state-controllers/TargetBind.json'), common);
  const bindLines = copyLines(bind, bind.parameter);
  assert.ok(bindLines.some(line => /^ID\s*= -1$/.test(line)));
  assert.ok(bindLines.some(line => /^Time\s*= 1$/.test(line)));
  assert.ok(bindLines.some(line => /^Pos\s*= 0, 0$/.test(line)));

  const drop = normalizeDocument(readJSON('src/content/state-controllers/TargetDrop.json'), common);
  const dropLines = copyLines(drop, drop.parameter);
  assert.ok(dropLines.some(line => /^ExcludeID\s*= -1$/.test(line)));
  assert.ok(dropLines.some(line => /^KeepOne\s*= 1$/.test(line)));

  const facing = normalizeDocument(readJSON('src/content/state-controllers/TargetFacing.json'), common);
  const facingLines = copyLines(facing, facing.parameter);
  assert.ok(facingLines.some(line => /^ID\s*= -1$/.test(line)));
  assert.ok(facingLines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
});
