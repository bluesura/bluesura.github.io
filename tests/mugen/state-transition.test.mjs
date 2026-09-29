import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['ChangeState', 'SelfState', 'TargetState'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('state transition controllers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('state-transition-01').documents) {
    const original = readJSON(`tests/mugen/batches/state-transition-01/json/state-controllers/${target.name}.json`);
    const current = readJSON(`src/content/state-controllers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.version, original.version);
    assert.equal(current.page.introduced_in, null);
  }
});

test('unverified warnings and operational claims stay internal while their source text remains intact', () => {
  for (const name of names) {
    const original = readJSON(`tests/mugen/batches/state-transition-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.deepEqual(current.notes.slice(0, original.version.length).map(note => note.content), original.version.map(entry => entry.content));
    assert.ok(current.notes.every(note => note.kind === 'research'));
    assert.deepEqual(publicNotes(current), []);
  }
});

test('ChangeState and SelfState expose required destinations and inherited animation defaults', () => {
  for (const name of ['ChangeState', 'SelfState']) {
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    const [value, ctrl, anim] = current.parameter;
    assert.equal(value.expression_policy, 'expression');
    assert.equal(value.default[0].kind, 'required');
    assert.deepEqual(value.default_value, ['?']);
    assert.equal(ctrl.expression_policy, 'expression');
    assert.equal(ctrl.default, undefined);
    assert.ok(ctrl.default_value[0].includes('引き継ぐ'));
    assert.equal(anim.expression_policy, 'expression');
    assert.equal(anim.default[0].kind, 'inherit');
    assert.ok(anim.default[0].display.includes('アニメーション'));
    assert.deepEqual(current.parameter.map(item => item.load_priority_evidence.basis), [
      ['maintainer_report'],
      ['maintainer_report'],
      ['maintainer_report'],
    ]);

    const normalized = normalizeDocument(current, common);
    assert.equal(normalized.parameter[1].default_value, undefined);
    const lines = copyLines(normalized, normalized.parameter);
    assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
    assert.ok(lines.some(line => /^; Anim\s*=/.test(line) && line.includes('前のアニメーションを維持')));
    assert.ok(lines.some(line => /^; Ctrl\s*=/.test(line) && line.includes('未確認')));
    assert.ok(!lines.some(line => line.includes('コントロールを引き継ぐ')));
  }

  const changeState = readJSON('src/content/state-controllers/ChangeState.json');
  assert.deepEqual(changeState.parameter[0].max_value, ['2147483647']);
  assert.equal(normalizeDocument(changeState, common).parameter[0].max_value, undefined);
});

test('TargetState corrects the public ID meaning and keeps copyable ID=-1 output', () => {
  const original = readJSON('tests/mugen/batches/state-transition-01/json/state-controllers/TargetState.json');
  const current = readJSON('src/content/state-controllers/TargetState.json');
  assert.deepEqual(current.parameter[0].value, original.parameter[0].value);
  assert.equal(current.parameter[0].description, original.parameter[0].description);

  const normalized = normalizeDocument(current, common);
  const [id, value] = normalized.parameter;
  assert.deepEqual(id.value, ['対象にするターゲット ID']);
  assert.ok(id.description.includes('一致する ID'));
  assert.equal(id.default[0].kind, 'literal');
  assert.equal(id.default[0].value, -1);
  assert.equal(value.default[0].kind, 'required');
  assert.deepEqual(current.parameter.map(item => item.load_priority_evidence.basis), [
    ['maintainer_report'],
    ['maintainer_report'],
  ]);

  const lines = copyLines(normalized, normalized.parameter);
  assert.ok(lines.some(line => /^ID\s+= -1$/.test(line)));
  assert.ok(lines.some(line => /^; value\s*=/.test(line) && line.includes('必須: 値を指定してください')));
});

test('public controller descriptions use the reviewed scope without replacing legacy prose', () => {
  for (const name of names) {
    const original = readJSON(`tests/mugen/batches/state-transition-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    assert.equal(current.description, original.description);
    assert.notEqual(effectiveDescription(current), current.description);
  }
  assert.ok(effectiveDescription(readJSON('src/content/state-controllers/SelfState.json')).includes('自身のステートデータ'));
  assert.ok(effectiveDescription(readJSON('src/content/state-controllers/TargetState.json')).includes('一致するターゲット ID'));
});
