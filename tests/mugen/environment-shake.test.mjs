import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('environment shake controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('environment-shake-01').documents) {
    const original = readJSON(`tests/mugen/batches/environment-shake-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('FallEnvShake documents its one-shot fall.envshake behavior without inventing parameters', () => {
  const current = readJSON('src/content/state-controllers/FallEnvShake.json');
  assert.equal(current.parameter, undefined);
  assert.ok(effectiveDescription(current).includes('GetHitVar(fall.envshake.time)'));
  assert.ok(effectiveDescription(current).includes('実行後は同値を0'));
  assert.equal(publicNotes(current).length, 0);
  assert.ok(current.notes.some(note => note.kind === 'research' && note.evidence.status === 'conflicting'));
});

test('EnvShake preserves required and conditional defaults from each official generation', () => {
  const current = readJSON('src/content/state-controllers/EnvShake.json');
  const byName = Object.fromEntries(current.parameter.map(parameter => [parameter.parameter, parameter]));
  assert.equal(byName.Time.default[0].kind, 'required');
  assert.deepEqual(byName.Ampl.default.map(item => item.kind), ['literal', 'derived']);
  assert.deepEqual(byName.Ampl.default[0].environment.runtime, ['mugen-linux']);
  assert.deepEqual(byName.Ampl.default[1].environment.runtime, ['mugen-1.0', 'mugen-1.1']);
  assert.equal(byName.Phase.default[0].kind, 'derived');
  assert.ok(byName.Phase.default[0].display.includes('90以上なら90'));
  assert.equal(byName.Freq.default[0].value, 60);
});

test('EnvShake retains old research while hiding unsupported Time ranges from the public model', () => {
  const original = readJSON('tests/mugen/batches/environment-shake-01/json/state-controllers/EnvShake.json');
  const current = readJSON('src/content/state-controllers/EnvShake.json');
  const normalized = normalizeDocument(current, common);
  assert.deepEqual(current.parameter[0].min_value, original.parameter[0].min_value);
  assert.deepEqual(current.parameter[0].max_value, original.parameter[0].max_value);
  assert.equal(normalized.parameter[0].min_value, undefined);
  assert.equal(normalized.parameter[0].max_value, undefined);
  assert.equal(publicNotes(current).length, 0);
  assert.ok(current.notes.some(note => note.content.includes('NEGATIVE FREQ FOR ENVSHAKE')));
  assert.ok(current.notes.some(note => note.content.includes('360 / Freq')));
});

test('EnvShake CNS output comments required and conditional values while keeping Freq literal', () => {
  const current = normalizeDocument(readJSON('src/content/state-controllers/EnvShake.json'), common);
  const lines = copyLines(current, current.parameter);
  assert.ok(lines.some(line => /^; Time\s*=/.test(line) && line.includes('必須')));
  assert.ok(lines.some(line => /^; Ampl\s*=/.test(line) && line.includes('適用環境を確認')));
  assert.ok(lines.some(line => /^; Phase\s*=/.test(line) && line.includes('省略時')));
  assert.ok(lines.some(line => /^Freq\s*=/.test(line) && line.includes('60')));
});
