import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const original = readJSON('tests/mugen/batches/display-offset-01/json/state-controllers/Offset.json');
const current = readJSON('src/content/state-controllers/Offset.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('Offset preserves the original collision-box description, empty defaults and exact loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('display-offset-01').documents[0].additions));
  assert.equal(current.description, original.description);
  for (const [i, old] of original.parameter.entries()) for (const key of Object.keys(old)) assert.deepEqual(current.parameter[i][key], old[key]);
  assert.deepEqual(current.parameter.map(param => param.default_value), [[''], ['']]);
  assert.deepEqual(current.parameter.map(param => param.load_priority), [['1'], ['2']]);
  assert.equal(current.page.introduced_in, null);
});

test('Offset distinguishes shifted collision boxes from actual position and uses screen-axis signs', () => {
  assert.ok(view.description.includes('判定の枠も表示と一緒にずれます'));
  assert.ok(view.description.includes('Pos X'));
  assert.ok(view.description.includes('押し合い判定は変わりません'));
  assert.ok(view.parameter[0].description.includes('正の値で画面の右'));
  assert.ok(view.parameter[1].description.includes('正の値で下'));
  assert.ok(view.parameter.slice(0, 2).every(param => param.description.includes('向きによって正負の意味は変わりません')));
  assert.deepEqual(view.parameter[0].value, ['横方向の表示ずらし量']);
});

test('Offset unknown axis defaults never become active empty or invented zero assignments in CNS', () => {
  const lines = copyLines(view, view.parameter);
  for (const name of ['X', 'Y']) {
    assert.ok(lines.some(line => line.startsWith(`; ${name} `) && line.includes('未確認')));
    assert.ok(!lines.some(line => new RegExp(`^${name}\\s*=`).test(line)));
  }
  assert.ok(lines.includes('IgnoreHitPause'.padEnd(27) + '= 0'));
  assert.ok(lines.includes('Persistent'.padEnd(27) + '= 1'));
});

test('Offset separates RC6 coordinate scaling repair from 2002 compatibility and hides investigative records', () => {
  const notes = publicNotes(current);
  assert.equal(notes.length, 2);
  assert.ok(notes.every(note => note.at === 'mugen-1.0-rc6'));
  assert.equal(notes[0].change, 'fixed');
  assert.equal(notes[0].environment, undefined);
  assert.equal(notes[1].change, 'added');
  assert.deepEqual(notes[1].environment.compatibility_profile, ['mugen-compat-2002']);
  assert.ok(!JSON.stringify(notes).includes('TargetState'));
  assert.ok(!JSON.stringify(notes).includes('Explod'));
  assert.equal(current.notes.filter(note => note.visibility === 'internal').length, 3);
  assert.ok(current.notes.some(note => note.kind === 'research' && note.evidence.status === 'confirmed'));
});
