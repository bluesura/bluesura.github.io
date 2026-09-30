import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('target velocity controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('target-velocity-01').documents) {
    const original = readJSON(`tests/mugen/batches/target-velocity-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('TargetVelAdd publishes additive axes and target-facing positive X', () => {
  const current = readJSON('src/content/state-controllers/TargetVelAdd.json');
  assert.ok(effectiveDescription(current).includes('現在速度に'));
  assert.ok(effectiveDescription(current).includes('各ターゲットが向いている方向'));
  assert.equal(current.parameter[0].default[0].value, -1);
  assert.equal(current.parameter[1].default[0].kind, 'none');
  assert.equal(current.parameter[2].default[0].kind, 'none');
  assert.ok(current.parameter.every(parameter => parameter.load_priority_evidence.basis.includes('maintainer_report')));
  assert.deepEqual(publicNotes(current), []);
});

test('TargetVelSet publishes assignment and executor-facing positive X while preserving old prose', () => {
  const original = readJSON('tests/mugen/batches/target-velocity-01/json/state-controllers/TargetVelSet.json');
  const current = readJSON('src/content/state-controllers/TargetVelSet.json');
  assert.equal(current.parameter[1].description, original.parameter[1].description);
  assert.ok(current.parameter[1].description.includes('ターゲットが向いている方向'));
  assert.ok(effectiveDescription(current).includes('指定した値へ設定'));
  assert.ok(current.parameter[1].documentation.description.includes('実行者が向いている方向'));
  assert.ok(current.notes.some(note => note.evidence.status === 'conflicting'));
  assert.deepEqual(publicNotes(current), []);
});

test('target velocity CNS output activates ID and comments omitted axes', () => {
  for (const name of ['TargetVelAdd', 'TargetVelSet']) {
    const normalized = normalizeDocument(readJSON(`src/content/state-controllers/${name}.json`), common);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^ID\s*= -1$/.test(line)));
    assert.ok(lines.some(line => /^; X\s*=/.test(line) && line.includes('変更しない')));
    assert.ok(lines.some(line => /^; Y\s*=/.test(line) && line.includes('変更しない')));
  }
});
