import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const original = readJSON('tests/mugen/batches/pause-time-01/json/state-controllers/Pause.json');
const current = readJSON('src/content/state-controllers/Pause.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);

test('Pause retains original warnings, limits, image and source data', () => {
  assert.deepEqual(current, addFields(original, loadPlan('pause-time-01').documents[0].additions));
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.images, original.images);
  assert.deepEqual(current.parameter.map(parameter => parameter.max_value), original.parameter.map(parameter => parameter.max_value));
});

test('Pause publishes sourced ranges and interaction while hiding warning records', () => {
  assert.ok(!effectiveDescription(current).includes('未検証'));
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['behavior']);
  assert.ok(publicNotes(current)[0].content.includes('SuperPause'));
  assert.equal(view.parameter[0].max_value, undefined);
  assert.equal(view.parameter[1].max_value, undefined);
  assert.ok(view.parameter[0].description.includes('0</code> も'));
  assert.ok(view.parameter[1].description.includes('Time'));
  assert.ok(view.parameter[3].description.includes('command'));
  assert.equal(view.quote.some(quote => quote.title.includes('警告メッセージ集')), false);
});

test('Pause CNS copy requires Time and keeps the three documented defaults', () => {
  const lines = copyLines(view, view.parameter);
  assert.ok(lines.some(line => /^; Time\s*=.*必須/.test(line)));
  assert.ok(lines.some(line => /^MoveTime\s*= 0$/.test(line)));
  assert.ok(lines.some(line => /^PauseBG\s*= 1$/.test(line)));
  assert.ok(lines.some(line => /^EndCmdBufTime\s*= 0$/.test(line)));
});
