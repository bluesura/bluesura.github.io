import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['ChangeAnim', 'ChangeAnim2'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('animation change controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('animation-change-01').documents) {
    const original = readJSON(`tests/mugen/batches/animation-change-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.version, original.version);
    assert.equal(current.page.introduced_in, null);
  }
});

test('ChangeAnim parameters keep required value, legacy Elem default and reviewed load order', () => {
  for (const name of names) {
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    const [value, elem] = current.parameter;
    assert.equal(value.expression_policy, 'expression');
    assert.equal(value.default[0].kind, 'required');
    assert.deepEqual(value.default_value, ['?']);
    assert.equal(elem.expression_policy, 'expression');
    assert.equal(elem.default, undefined);
    assert.deepEqual(elem.default_value, ['1']);
    assert.deepEqual(current.parameter.map(item => item.load_priority_evidence.basis), [
      ['maintainer_report'],
      ['maintainer_report'],
    ]);

    const normalized = normalizeDocument(current, common);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
    assert.ok(lines.some(line => /^Elem\s*= 1$/.test(line)));
  }
});

test('incomplete warning and crash records remain internal while their source text stays intact', () => {
  for (const name of names) {
    const original = readJSON(`tests/mugen/batches/animation-change-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.deepEqual(current.notes.map(note => note.content), original.version.map(entry => entry.content));
    assert.ok(current.notes.every(note => note.kind === 'research'));
    assert.deepEqual(publicNotes(current), []);
  }
  const changeAnim = readJSON('src/content/state-controllers/ChangeAnim.json');
  assert.ok(changeAnim.notes.some(note => note.content.endsWith(': ')));
});

test('ChangeAnim2 publishes the P1 AIR and P2 custom-state relationship without replacing old prose', () => {
  const original = readJSON('tests/mugen/batches/animation-change-01/json/state-controllers/ChangeAnim2.json');
  const current = readJSON('src/content/state-controllers/ChangeAnim2.json');
  assert.equal(current.description, original.description);
  assert.ok(effectiveDescription(current).includes('P2 をカスタムステート'));
  assert.ok(effectiveDescription(current).includes('P1 の AIR'));
  assert.ok(effectiveDescription(current).includes('ChangeAnim'));
});
