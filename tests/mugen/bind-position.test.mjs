import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('bind position controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('bind-position-01').documents) {
    const original = readJSON(`tests/mugen/batches/bind-position-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('BindToParent publishes its helper-only parent binding and confirmed defaults', () => {
  const current = readJSON('src/content/state-controllers/BindToParent.json');
  const normalized = normalizeDocument(current, common);
  assert.ok(effectiveDescription(current).includes('親の軸'));
  assert.ok(effectiveDescription(current).includes('Helper でない場合は何も起きません'));
  assert.deepEqual(current.parameter.map(parameter => parameter.default[0].value), [1, 0, '0, 0']);
  assert.equal(normalized.parameter[0].min_value, undefined);
  assert.equal(normalized.parameter[0].max_value, undefined);
  assert.ok(current.parameter.every(parameter => parameter.load_priority_evidence.basis.includes('maintainer_report')));
  assert.deepEqual(publicNotes(current), []);
});

test('BindToRoot corrects the old parent-based prose without deleting it', () => {
  const original = readJSON('tests/mugen/batches/bind-position-01/json/state-controllers/BindToRoot.json');
  const current = readJSON('src/content/state-controllers/BindToRoot.json');
  const normalized = normalizeDocument(current, common);
  assert.equal(current.description, original.description);
  assert.ok(effectiveDescription(current).includes('ルートキャラクターの軸'));
  assert.ok(!effectiveDescription(current).includes('親がHelper'));
  assert.deepEqual(current.parameter.map(parameter => parameter.default[0].value), [1, 0, '0, 0']);
  assert.equal(normalized.parameter[0].min_value, undefined);
  assert.equal(normalized.parameter[0].max_value, undefined);
  assert.ok(current.notes.some(note => note.evidence.status === 'conflicting'));
  assert.deepEqual(publicNotes(current), []);
});

test('BindToTarget confirms the target axis but keeps x and y omission unknown', () => {
  const original = readJSON('tests/mugen/batches/bind-position-01/json/state-controllers/BindToTarget.json');
  const current = readJSON('src/content/state-controllers/BindToTarget.json');
  assert.deepEqual(current.parameter.map(parameter => parameter.default_value), original.parameter.map(parameter => parameter.default_value));
  assert.equal(current.parameter[0].default[0].value, -1);
  assert.equal(current.parameter[1].default[0].value, 1);
  assert.equal(current.parameter[2].default[0].kind, 'unknown');
  assert.ok(current.parameter[2].default[0].display.includes('x/y オフセット省略時は未確認'));
  assert.deepEqual(current.parameter[2].load_priority, ['3', '4', '?']);
  assert.equal(current.parameter[2].load_priority_evidence, undefined);
  assert.ok(current.notes.some(note => note.content.includes('-1025')));
  assert.deepEqual(publicNotes(current), []);
});

test('bind position CNS output activates confirmed defaults and comments unknown target offsets', () => {
  for (const name of ['BindToParent', 'BindToRoot']) {
    const normalized = normalizeDocument(readJSON(`src/content/state-controllers/${name}.json`), common);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^Time\s*= 1$/.test(line)));
    assert.ok(lines.some(line => /^Facing\s*= 0$/.test(line)));
    assert.ok(lines.some(line => /^Pos\s*= 0, 0$/.test(line)));
  }

  const target = normalizeDocument(readJSON('src/content/state-controllers/BindToTarget.json'), common);
  const targetLines = copyLines(target, target.parameter);
  assert.ok(targetLines.some(line => /^ID\s*= -1$/.test(line)));
  assert.ok(targetLines.some(line => /^Time\s*= 1$/.test(line)));
  assert.ok(targetLines.some(line => /^; Pos\s*=/.test(line) && line.includes('未確認')));
});
