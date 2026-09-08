import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { effectiveParameters, effectiveArguments } from '../../src/lib/mugen/parameters.mjs';
import { normalizeDocument, publicNotes, effectiveDescription } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { addFields } from '../../scripts/mugen/batch.mjs';
import { readJSON } from '../../scripts/mugen/files.mjs';

const schema = createDocumentSchema('state-controllers', readJSON('src/data/engine-versions.json'));
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const withDocumentation = documentation => ({ state: 'Example', page: {}, parameter: [{ parameter: 'X', documentation }] });

test('document-level prose is optional, strictly scoped, and resolved without modifying the original', () => {
  const source = { state: 'Example', page: {}, description: '旧本文', documentation: { description: '<p>公開本文</p>', evidence: { status: 'confirmed', basis: ['maintainer_report'] } } };
  const snapshot = structuredClone(source);
  assert.deepEqual(schema.parse(source), source);
  assert.equal(effectiveDescription(source), '<p>公開本文</p>');
  assert.equal(normalizeDocument(source).description, '<p>公開本文</p>');
  assert.equal(normalizeDocument(source).documentation, undefined);
  assert.equal(effectiveDescription({ description: '旧本文' }), '旧本文');
  assert.deepEqual(source, snapshot);
  for (const documentation of [{}, { description: '' }, { description: '説明', value: ['ラベル'] }, { description: '説明', parameter: [] }]) {
    assert.equal(schema.safeParse({ ...source, documentation }).success, false);
  }
  assert.equal(schema.safeParse({ ...source, documentation: { description: '説明', evidence: { status: 'confirmed', basis: ['official_document'], source_refs: ['missing'] } } }).success, false);
});

test('editorial documentation accepts only nonempty text fields and validates nested evidence', () => {
  const valid = withDocumentation({ value: ['加える速度'], description: '<p>実行者自身への加算。</p>' });
  assert.deepEqual(schema.parse(valid), valid);
  for (const documentation of [{}, { value: [] }, { value: [''] }, { description: '' }, { value: ['速度'], default_value: ['0'] }, { description: '説明', parameter: 'Fake' }]) {
    assert.equal(schema.safeParse(withDocumentation(documentation)).success, false);
  }
  const doc = withDocumentation({ description: '説明', evidence: { status: 'confirmed', basis: ['official_document'], source_refs: ['source'] } });
  assert.equal(schema.safeParse(doc).success, false);
  assert.equal(schema.safeParse({ ...doc, quote: [{ id: 'source', title: '資料', url: '/source' }] }).success, true);
});

test('partial editorial text preserves legacy fallback and local/common/argument precedence', () => {
  const legacy = { parameter: 'X', value: ['旧ラベル'], description: '旧説明', load_priority: ['?'] };
  const source = { category: 'state', parameter: [{ ...legacy, documentation: { value: ['新ラベル'] } }] };
  const snapshot = structuredClone(source);
  const resolved = effectiveParameters(source)[0];
  assert.deepEqual(resolved, { ...legacy, value: ['新ラベル'] });
  assert.deepEqual(source, snapshot);
  assert.deepEqual(effectiveParameters({ parameter: [legacy] }), [legacy]);
  const shared = [{ parameter: 'X', description: '共通の旧説明', value: ['共通の旧ラベル'], documentation: { description: '共通の新説明', value: ['共通の新ラベル'] } }];
  assert.deepEqual(effectiveParameters({ category: 'state', parameter: [{ parameter: 'x', description: '固有説明' }] }, shared), [{ parameter: 'x', description: '固有説明', value: ['共通の新ラベル'] }]);
  const trigger = { parameter: [{ ...legacy, documentation: { description: '訂正した説明' } }] };
  assert.equal(effectiveArguments(trigger)[0].description, '訂正した説明');
  assert.equal(effectiveArguments({ ...trigger, arguments: [{ name: 'value', legacy_index: 0, description: '引数固有の説明' }] })[0].description, '引数固有の説明');
});

test('VelAdd and VelSet correct public text while retaining the entire prior migration and CNS output', () => {
  const plan = readJSON('scripts/mugen/plans/axis-motion-01.json');
  for (const name of ['VelAdd', 'VelSet']) {
    const original = readJSON(`tests/mugen/batches/axis-motion-01/json/state-controllers/${name}.json`);
    const previous = addFields(original, plan.documents.find(entry => entry.name === name).additions);
    const source = readJSON(`src/content/state-controllers/${name}.json`);
    const withoutEditorialText = structuredClone(source);
    for (const parameter of withoutEditorialText.parameter) delete parameter.documentation;
    assert.deepEqual(withoutEditorialText, previous, `${name}: existing fields changed`);
    const current = normalizeDocument(source, common);
    assert.deepEqual(current.parameter.slice(0, 2).map(parameter => parameter.value[0]), name === 'VelAdd'
      ? ['水平方向に加える速度', '垂直方向に加える速度'] : ['水平方向の速度', '垂直方向の速度']);
    for (const parameter of current.parameter.slice(0, 2)) {
      assert.ok(parameter.description.includes('実行者自身'));
      assert.ok(!parameter.description.includes('ターゲット'));
      assert.equal(parameter.documentation, undefined);
    }
    assert.deepEqual(current.parameter.map(parameter => parameter.load_priority), effectiveParameters(previous, common).map(parameter => parameter.load_priority));
    assert.deepEqual(copyLines(current, current.parameter), copyLines(previous, effectiveParameters(previous, common)));
    assert.deepEqual(publicNotes(source), []);
    assert.equal(source.notes[0].kind, 'research');
  }
});
