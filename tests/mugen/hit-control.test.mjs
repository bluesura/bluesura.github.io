import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('hit control controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('hit-control-01').documents) {
    const original = readJSON(`tests/mugen/batches/hit-control-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('HitAdd publishes a required combo addition and hides unsupported ranges', () => {
  const original = readJSON('tests/mugen/batches/hit-control-01/json/state-controllers/HitAdd.json');
  const current = readJSON('src/content/state-controllers/HitAdd.json');
  const normalized = normalizeDocument(current, common);
  assert.deepEqual(current.parameter[0].min_value, original.parameter[0].min_value);
  assert.deepEqual(current.parameter[0].max_value, original.parameter[0].max_value);
  assert.equal(normalized.parameter[0].min_value, undefined);
  assert.equal(normalized.parameter[0].max_value, undefined);
  assert.equal(current.parameter[0].default[0].kind, 'required');
  assert.ok(effectiveDescription(current).includes('コンボカウンター'));
  assert.deepEqual(publicNotes(current), []);
});

test('MoveHitReset publishes only the three confirmed contact triggers', () => {
  const original = readJSON('tests/mugen/batches/hit-control-01/json/state-controllers/MoveHitReset.json');
  const current = readJSON('src/content/state-controllers/MoveHitReset.json');
  assert.equal(current.description, original.description);
  assert.ok(effectiveDescription(current).includes('MoveContact'));
  assert.ok(effectiveDescription(current).includes('MoveGuarded'));
  assert.ok(effectiveDescription(current).includes('MoveHit'));
  assert.ok(!effectiveDescription(current).includes('MoveReversed'));
  assert.ok(current.notes.some(note => note.content.includes('MoveReversed')));
  assert.deepEqual(publicNotes(current), []);
});

test('HitVelSet publishes deprecation and optional gethit velocity flags', () => {
  const original = readJSON('tests/mugen/batches/hit-control-01/json/state-controllers/HitVelSet.json');
  const current = readJSON('src/content/state-controllers/HitVelSet.json');
  assert.deepEqual(current.version, original.version);
  assert.ok(effectiveDescription(current).includes('非推奨'));
  assert.deepEqual(current.parameter.map(parameter => parameter.default[0].kind), ['none', 'none']);
  assert.ok(current.parameter[0].documentation.description.includes('0以外'));
  assert.ok(current.parameter.every(parameter => parameter.load_priority_evidence.basis.includes('maintainer_report')));
  assert.deepEqual(publicNotes(current), []);
});

test('hit control CNS output keeps required and omitted values copy-safe', () => {
  const hitAdd = normalizeDocument(readJSON('src/content/state-controllers/HitAdd.json'), common);
  const hitAddLines = copyLines(hitAdd, hitAdd.parameter);
  assert.ok(hitAddLines.some(line => /^; value\s*=/.test(line) && line.includes('必須')));

  const hitVelSet = normalizeDocument(readJSON('src/content/state-controllers/HitVelSet.json'), common);
  const velocityLines = copyLines(hitVelSet, hitVelSet.parameter);
  assert.ok(velocityLines.some(line => /^; X\s*=/.test(line) && line.includes('変更しない')));
  assert.ok(velocityLines.some(line => /^; Y\s*=/.test(line) && line.includes('変更しない')));
});
