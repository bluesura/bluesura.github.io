import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const original = readJSON('tests/mugen/batches/helper-destruction-01/json/state-controllers/DestroySelf.json');
const current = readJSON('src/content/state-controllers/DestroySelf.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('DestroySelf preserves the original no-parameter description, histories, helper example and unknown loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('helper-destruction-01').documents[0].additions));
  assert.equal(current.description, original.description);
  assert.deepEqual(current.version, original.version);
  for (const [i, old] of original.parameter.entries()) for (const key of Object.keys(old)) assert.deepEqual(current.parameter[i][key], old[key]);
  assert.deepEqual(current.code_sample[0].code, original.code_sample[0].code);
  assert.ok(current.parameter.every(param => param.load_priority[0] === '?' && param.load_priority_evidence.status === 'unverified'));
  assert.equal(current.page.introduced_in, null);
});

test('DestroySelf scopes recursive descendants and Explod removal to 1.1 without producing unsupported 1.0 assignments', () => {
  assert.equal(view.page.category[1], 'Helper自身の消去');
  assert.ok(view.description.includes('通常のプレイヤー本体には使用できません'));
  assert.ok(view.parameter[0].description.includes('子・孫以降'));
  assert.ok(view.parameter[1].description.includes('スプライトや飛び道具全般を消去する項目ではありません'));
  for (const param of view.parameter.slice(0, 2)) {
    assert.deepEqual(param.environment.runtime, ['mugen-1.1']);
    assert.equal(param.default[0].value, '0');
    assert.deepEqual(param.default[0].environment.runtime, ['mugen-1.1']);
  }
  const lines = copyLines(view, view.parameter);
  for (const name of ['Recursive', 'RemoveExplods']) {
    assert.ok(lines.some(line => line.startsWith(`; ${name} `) && line.includes('適用環境を確認: 0')));
    assert.ok(!lines.some(line => new RegExp(`^${name}\\s*=`).test(line)));
  }
  assert.ok(lines.includes('IgnoreHitPause'.padEnd(27) + '= 0'));
});

test('DestroySelf uses the dated RC5 repair without inventing an Alpha introduction for the 1.1 options', () => {
  const registry = readJSON('src/data/engine-versions.json');
  const build = registry.builds.find(build => build.id === 'mugen-1.0-rc5');
  assert.equal(build.build_date, '2009-10-28');
  assert.equal(build.public_date, null);
  const notes = publicNotes(current);
  assert.equal(notes.length, 3);
  assert.equal(notes.find(note => note.kind === 'version_change').at, 'mugen-1.0-rc5');
  assert.ok(notes.find(note => note.kind === 'behavior').content.includes('バインドが強制的に解除'));
  assert.ok(notes.find(note => note.kind === 'behavior').content.includes('所有元を失います'));
  assert.ok(!notes.some(note => note.at?.startsWith('mugen-1.1-a')));
  assert.deepEqual(current.notes.filter(note => note.legacy_index !== undefined).map(note => note.legacy_index), [0, 1, 2]);
});

test('DestroySelf hides unresolved crash and timing reports plus the broad clone claim but keeps an animation-end example', () => {
  const internal = current.notes.filter(note => note.kind === 'research');
  assert.equal(internal.length, 6);
  assert.ok(internal.every(note => note.visibility === 'internal'));
  assert.ok(internal.some(note => note.content.includes('Draw.offset')));
  assert.ok(internal.some(note => note.content.includes('クラッシュ') && note.evidence.status === 'unverified'));
  assert.equal(view.code_sample.length, 1);
  assert.ok(view.code_sample[0].code.includes('Trigger1 = AnimTime = 0'));
  assert.ok(!JSON.stringify(view.code_sample).includes('分身バグ対策'));
});
