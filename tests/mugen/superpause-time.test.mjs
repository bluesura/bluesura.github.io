import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const original = readJSON('tests/mugen/batches/superpause-time-01/json/state-controllers/SuperPause.json');
const current = readJSON('src/content/state-controllers/SuperPause.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);
const parameter = name => view.parameter.find(item => item.parameter === name);

test('SuperPause retains original parameter names, warning records, image and loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('superpause-time-01').documents[0].additions));
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.images, original.images);
  assert.deepEqual(current.parameter.map(item => item.load_priority), original.parameter.map(item => item.load_priority));
  assert.equal(parameter('UnHitTable').parameter.toLowerCase(), 'unhittable');
  assert.deepEqual(parameter('PowerAdd').load_priority, ['20']);
});

test('SuperPause publishes relative animation position and group-first sound without changing legacy labels', () => {
  assert.deepEqual(parameter('Sound').value, ['グループ番号', 'サウンド番号']);
  assert.deepEqual(current.parameter[10].value, ['サウンド番号', 'グループ番号']);
  assert.ok(parameter('Sound').description.includes('Sound = S10,0'));
  assert.ok(parameter('Anim').description.includes('-1'));
  assert.ok(parameter('Pos').description.includes('実行者の軸位置'));
  assert.ok(parameter('P2DefMul').description.includes('Super.TargetDefenceMul'));
  assert.ok(!parameter('P2DefMul').description.includes('Super.TargetDefenceMul?'));
  assert.ok(!parameter('Time').description.includes('必ずMoveTimeより大きい'));
  assert.ok(parameter('EndCmdBufTime').description.includes('動けないプレイヤー'));
  assert.equal(parameter('Time').max_value, undefined);
  assert.equal(parameter('MoveTime').max_value, undefined);
});

test('SuperPause hides all six legacy investigations and publishes only the sourced Pause interaction', () => {
  for (let i = 0; i < original.version.length; i++) {
    const note = current.notes.find(item => item.legacy_index === i);
    assert.equal(note.kind, 'research');
    assert.equal(note.content, original.version[i].content);
  }
  assert.deepEqual(publicNotes(current).map(note => note.kind), ['behavior']);
  assert.ok(publicNotes(current)[0].content.includes('残り時間が減らず'));
  assert.ok(!view.quote.some(quote => quote.url.includes('mugenbinran')));
});

test('SuperPause CNS copy keeps Time optional and all eleven literal defaults including valid UnHitTable spelling', () => {
  const lines = copyLines(view, view.parameter);
  for (const [name, value] of Object.entries({ Time: '30', MoveTime: '0', PauseBG: '1', EndCmdBufTime: '0', Darken: '1', Anim: '30', Pos: '0, 0', P2DefMul: '0', PowerAdd: '0', UnHitTable: '1', Sound: '-1' })) {
    assert.ok(lines.some(line => new RegExp(`^${name}\\s*= ${value}$`).test(line)), `${name} default missing`);
  }
  assert.ok(lines.some(line => /^IgnoreHitPause\s*=/.test(line)));
  assert.ok(lines.some(line => /^Persistent\s*=/.test(line)));
});
