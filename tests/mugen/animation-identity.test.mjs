import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { effectiveDescription, publicCodeSamples, publicNotes, publicQandA } from '../../src/lib/mugen/normalize.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';

const names = ['Anim', 'AnimExist', 'SelfAnimExist'];

test('animation identity triggers match the additive plan and preserve every legacy field', () => {
  for (const target of loadPlan('animation-identity-01').documents) {
    const original = readJSON(`tests/mugen/batches/animation-identity-01/json/triggers/${target.name}.json`);
    const current = readJSON(`src/content/triggers/${target.name}.json`);
    assert.deepEqual(current, addFields(original, target.additions));
    assert.equal(current.page.introduced_in, null);
  }
});

test('Anim is nullary while animation existence checks take one integer expression', () => {
  const anim = readJSON('src/content/triggers/Anim.json');
  assert.equal(anim.syntax_kind, 'nullary');
  assert.deepEqual(anim.arguments, []);
  assert.deepEqual(anim.return_type, ['int']);
  for (const name of names.slice(1)) {
    const current = readJSON(`src/content/triggers/${name}.json`);
    assert.equal(current.syntax_kind, 'function');
    assert.deepEqual(current.return_type, ['int']);
    assert.equal(current.arguments.length, 1);
    assert.deepEqual(current.arguments[0].type, ['int']);
    assert.equal(current.arguments[0].expression_policy, 'expression');
  }
});

test('Q&A visibility is validated and filters publication without changing stored entries', () => {
  const schema = createDocumentSchema('triggers', readJSON('src/data/engine-versions.json'));
  const source = { trigger: 'Example', page: {}, qanda: [
    { q: '従来の質問', a: '従来の回答', extra: ['保存'] },
    { q: '内部の質問', a: '内部の回答', visibility: 'internal' },
    { q: '公開する質問', a: '公開する回答', visibility: 'public' },
  ] };
  const snapshot = structuredClone(source);
  assert.deepEqual(schema.parse(source), source);
  assert.deepEqual(publicQandA(source).map(item => item.q), ['従来の質問', '公開する質問']);
  assert.deepEqual(source, snapshot);
  assert.deepEqual(publicQandA({ qanda: [source.qanda[1]] }), []);
  assert.equal(schema.safeParse({ ...source, qanda: [{ ...source.qanda[1], visibility: 'internall' }] }).success, false);
});

test('conflicting legacy AnimExist material and incomplete samples remain JSON-only', () => {
  const original = readJSON('tests/mugen/batches/animation-identity-01/json/triggers/AnimExist.json');
  const current = readJSON('src/content/triggers/AnimExist.json');
  assert.deepEqual(current.qanda.map(({ visibility, ...item }) => item), original.qanda);
  assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
  assert.deepEqual(publicQandA(current), []);
  assert.deepEqual(publicCodeSamples(current), []);
  assert.ok(current.notes.filter(note => note.kind === 'research').every(note => !publicNotes(current).includes(note)));
  assert.ok(current.description.includes('アニメーションデータ'));
  assert.ok(effectiveDescription(current).includes('結果は未定義'));
  assert.ok(!effectiveDescription(current).includes('攻撃側キャラクター'));
});

test('SelfAnimExist publishes the P1-only rule and keeps its old ambiguous prose', () => {
  const original = readJSON('tests/mugen/batches/animation-identity-01/json/triggers/SelfAnimExist.json');
  const current = readJSON('src/content/triggers/SelfAnimExist.json');
  assert.deepEqual(current.code_sample.map(({ visibility, ...sample }) => sample), original.code_sample);
  assert.deepEqual(publicCodeSamples(current), []);
  assert.ok(current.description.includes('相手のアニメが対象'));
  assert.ok(effectiveDescription(current).includes('実行者自身'));
  assert.ok(effectiveDescription(current).includes('P2 側のデータを存在判定に使用しません'));
  assert.ok(publicNotes(current).every(note => note.kind !== 'research'));
});
