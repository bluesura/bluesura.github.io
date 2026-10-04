import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const original = readJSON('tests/mugen/batches/angle-draw-01/json/state-controllers/AngleDraw.json');
const current = readJSON('src/content/state-controllers/AngleDraw.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('AngleDraw preserves original defaults, unknown historical comments, image and loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('angle-draw-01').documents[0].additions));
  for (const [i, old] of original.parameter.entries()) for (const key of Object.keys(old)) assert.deepEqual(current.parameter[i][key], old[key]);
  assert.deepEqual(current.images, original.images);
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.parameter[0].default_value, ['0']);
  assert.deepEqual(current.parameter[1].load_priority, ['2', '3']);
  assert.equal(current.page.introduced_in, null);
});

test('AngleDraw omission retains the stored angle instead of copying an active reset to zero', () => {
  const lines = copyLines(view, view.parameter);
  assert.equal(view.parameter[0].default[0].kind, 'derived');
  assert.ok(view.parameter[0].description.includes('value = 0'));
  assert.ok(lines.some(line => line.startsWith('; value') && line.includes('保持している回転角度')));
  assert.ok(!lines.some(line => /^value\s*=/.test(line)));
  assert.ok(lines.includes('Scale'.padEnd(27) + '= 1, 1'));
  assert.ok(view.parameter[1].description.includes('リセットする指定ではありません'));
  assert.ok(view.parameter[1].description.includes('同じフレーム'));
  assert.ok(view.description.includes('判定の枠は変わりません'));
});

test('AngleDraw public history scopes the RC6 change to 2002 compatibility independently of the runtime', () => {
  const notes = publicNotes(current);
  assert.equal(notes.length, 1);
  assert.equal(notes[0].at, 'mugen-1.0-rc6');
  assert.equal(notes[0].change, 'added');
  assert.deepEqual(notes[0].environment, { engine: 'mugen', compatibility_profile: ['mugen-compat-2002'] });
  assert.deepEqual(notes[0].evidence.basis, ['official_history']);
  assert.ok(!JSON.stringify(notes).includes('縮尺が固定されません'));
  assert.deepEqual(current.notes.filter(note => note.legacy_index !== undefined).map(note => note.legacy_index), [0, 1]);
});

test('AngleDraw retains unresolved AIR and version claims as internal research with traceable conflicts', () => {
  const internal = current.notes.filter(note => note.kind === 'research');
  assert.equal(internal.length, 6);
  assert.ok(internal.every(note => note.visibility === 'internal'));
  assert.ok(internal.some(note => note.content.includes('AIR') && note.evidence.status === 'unverified'));
  assert.ok(internal.some(note => note.content.includes('Win版') && note.evidence.status === 'conflicting'));
  assert.ok(internal.some(note => note.evidence.status === 'confirmed'));
  assert.ok(current.parameter.every(param => param.load_priority_evidence.basis.includes('maintainer_report')));
});
