import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicCodeSamples, publicImages, publicNotes, publicQandA } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('life and target power controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('life-power-01').documents) {
    const original = readJSON(`tests/mugen/batches/life-power-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('LifeAdd publishes confirmed defaults and keeps its required value copy-safe', () => {
  const current = readJSON('src/content/state-controllers/LifeAdd.json');
  assert.deepEqual(current.parameter.map(parameter => parameter.expression_policy), ['expression', 'expression', 'expression']);
  assert.equal(current.parameter[0].default[0].value, 0);
  assert.equal(current.parameter[1].default[0].value, 1);
  assert.equal(current.parameter[2].default[0].kind, 'required');
  assert.ok(effectiveDescription(current).includes('防御倍率'));

  const normalized = normalizeDocument(current, common);
  const lines = copyLines(normalized, normalized.parameter);
  assert.ok(lines.some(line => /^Absolute\s*= 0$/.test(line)));
  assert.ok(lines.some(line => /^Kill\s*= 1$/.test(line)));
  assert.ok(lines.some(line => /^; Value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
});

test('LifeSet exposes only the confirmed set operation', () => {
  const current = readJSON('src/content/state-controllers/LifeSet.json');
  assert.ok(effectiveDescription(current).includes('指定した値に設定'));
  assert.ok(!effectiveDescription(current).includes('即死'));
  assert.equal(current.parameter[0].default[0].kind, 'required');
  const normalized = normalizeDocument(current, common);
  const lines = copyLines(normalized, normalized.parameter);
  assert.ok(lines.some(line => /^; Value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
});

test('unverified life diagrams, history and Q&A remain JSON-only', () => {
  for (const name of ['LifeAdd', 'LifeSet']) {
    const original = readJSON(`tests/mugen/batches/life-power-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.deepEqual(current.images[0].src, original.images[0].src);
    assert.equal(current.images[0].visibility, 'internal');
    assert.deepEqual(publicImages(current), []);
    assert.deepEqual(publicNotes(current), []);
    assert.ok(current.notes.some(note => note.environment?.engine === 'ikemen-go'));
  }
  const lifeSet = readJSON('src/content/state-controllers/LifeSet.json');
  assert.equal(lifeSet.qanda[0].visibility, 'internal');
  assert.deepEqual(publicQandA(lifeSet), []);
  assert.equal(publicCodeSamples(readJSON('src/content/state-controllers/LifeAdd.json')).length, 2);
});

test('TargetPowerAdd publishes target ID selection and retains the unverified RoundState record internally', () => {
  const current = readJSON('src/content/state-controllers/TargetPowerAdd.json');
  assert.equal(current.parameter[0].default[0].value, -1);
  assert.equal(current.parameter[1].default[0].kind, 'required');
  assert.deepEqual(current.parameter.map(parameter => parameter.load_priority_evidence.basis), [['maintainer_report'], ['maintainer_report']]);
  assert.deepEqual(publicNotes(current), []);
  assert.equal(current.notes[0].legacy_index, 0);

  const normalized = normalizeDocument(current, common);
  const lines = copyLines(normalized, normalized.parameter);
  assert.ok(lines.some(line => /^ID\s*= -1$/.test(line)));
  assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
});
