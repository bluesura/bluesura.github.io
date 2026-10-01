import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const name = 'AfterImageTime';
const original = readJSON(`tests/mugen/batches/afterimage-duration-01/json/state-controllers/${name}.json`);
const current = readJSON(`src/content/state-controllers/${name}.json`);
const common = ['IgnoreHitPause', 'Persistent'].map(item => readJSON(`src/data/common/${item}.json`));
const view = normalizeDocument(current, common);

test('AfterImageTime migration preserves original prose, code and video references', () => {
  assert.deepEqual(current, addFields(original, loadPlan('afterimage-duration-01').documents[0].additions));
  assert.deepEqual(current.code_sample.map(sample => sample.media), original.code_sample.map(sample => sample.media));
});

test('AfterImageTime publishes documented behavior and bug while hiding unsupported examples', () => {
  assert.ok(effectiveDescription(current).includes('残像が表示されていないときは効果がありません'));
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['bug']);
  assert.ok(publicNotes(current)[0].content.includes('TimeGap'));
  assert.equal(view.parameter[0].parameter_type, 'required');
  assert.ok(!view.parameter[0].description.includes('TimeGap×Length'));
  assert.ok(!view.parameter[0].description.includes('永続化'));
  assert.deepEqual(view.code_sample, []);
  assert.equal(current.code_sample.length, 3);
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; Time\s*=/.test(line)));
  assert.ok(lines.some(line => /^; Value\s*=/.test(line)));
});
