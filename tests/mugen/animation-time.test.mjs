import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { effectiveDescription, publicCodeSamples, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['AnimTime', 'AnimElemNo', 'AnimElemTime'];

test('animation time triggers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('animation-time-01').documents) {
    const original = readJSON(`tests/mugen/batches/animation-time-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
    assert.equal(current.page.introduced_in, null);
  }
});

test('AnimTime is nullary while element queries take one integer expression', () => {
  const animTime = readJSON('src/content/triggers/AnimTime.json');
  assert.equal(animTime.syntax_kind, 'nullary');
  assert.deepEqual(animTime.arguments, []);
  assert.deepEqual(animTime.return_type, ['int']);
  for (const name of names.slice(1)) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.syntax_kind, 'function');
    assert.deepEqual(current.return_type, ['int']);
    assert.deepEqual(current.arguments.map(argument => argument.name), ['exprn']);
    assert.deepEqual(current.arguments[0].type, ['int']);
    assert.equal(current.arguments[0].expression_policy, 'expression');
  }
});

test('empty legacy code samples and research records remain JSON-only', () => {
  for (const name of names) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.code_sample[0].visibility, 'internal');
    assert.deepEqual(publicCodeSamples(current), []);
    assert.ok(current.notes.some(note => note.kind === 'research'));
    assert.ok(publicNotes(current).every(note => note.kind !== 'research'));
  }
});

test('published animation timing prose contains only confirmed behavior and versioned errors', () => {
  const animTime = readJSON('src/content/triggers/AnimTime.json');
  assert.ok(animTime.description.includes('1しか返しません'));
  assert.ok(!effectiveDescription(animTime).includes('1しか返しません'));
  assert.ok(effectiveDescription(animTime).includes('AnimTime = 0'));
  assert.deepEqual(publicNotes(animTime), []);

  const elemNo = readJSON('src/content/triggers/AnimElemNo.json');
  assert.deepEqual(publicNotes(elemNo).map(note => note.content), [
    elemNo.version[0].content,
    '<p>MUGEN 1.0 / 1.1 では、指定時間が現在のアクション開始前になる場合は <code>bottom</code> を返します。</p>',
  ]);

  const elemTime = readJSON('src/content/triggers/AnimElemTime.json');
  const published = publicNotes(elemTime);
  assert.equal(published[0].content, elemTime.version[0].content);
  assert.ok(published[1].content.includes('bottom'));
  assert.equal(published[2].kind, 'limitation');
  assert.ok(published[2].content.includes('AnimElemTime(1) = 0 || AnimTime = 0'));
});
