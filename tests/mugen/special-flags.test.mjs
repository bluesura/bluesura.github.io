import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const original = readJSON('tests/mugen/batches/special-flags-01/json/state-controllers/AssertSpecial.json');
const current = readJSON('src/content/state-controllers/AssertSpecial.json');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const view = normalizeDocument(current, common);
const flag = key => view.parameter[0].possible_value.find(row => row[0] === key);

test('AssertSpecial keeps the entire original flag table, research histories, sample and unknown loading order', () => {
  assert.deepEqual(current, addFields(original, loadPlan('special-flags-01').documents[0].additions));
  for (const [i, old] of original.parameter.entries()) for (const key of Object.keys(old)) assert.deepEqual(current.parameter[i][key], old[key]);
  assert.deepEqual(current.version, original.version);
  assert.deepEqual(current.code_sample[0].code, original.code_sample[0].code);
  assert.equal(current.code_sample[0].description, original.code_sample[0].description);
  assert.ok(current.parameter[0].possible_value.some(row => row[0] === 'NoKO'));
  assert.equal(current.page.introduced_in, null);
  assert.ok(current.parameter.every(param => param.load_priority[0] === '?' && param.load_priority_evidence.status === 'unverified'));
});

test('AssertSpecial public flags distinguish attack unguardability, own guard restriction and visual/audio targets', () => {
  assert.equal(view.parameter[0].possible_value.length, 20);
  assert.deepEqual(view.parameter[0].possible_value[0], ['フラグ', '対象', '効果']);
  assert.equal(flag('UnGuardable')[1], '実行者のHitDef');
  assert.ok(flag('UnGuardable')[2].includes('GuardFlag'));
  assert.equal(flag('NoStandGuard')[1], '実行者');
  assert.ok(flag('NoStandGuard')[2].includes('相手のガードを無効にするフラグではありません'));
  assert.ok(flag('GlobalNoShadow')[2].includes('Explod'));
  assert.ok(!flag('GlobalNoShadow')[2].includes('Projectile'));
  assert.ok(flag('NoMusic')[2].includes('一時停止'));
  assert.ok(flag('NoBG')[2].includes('黒でクリア'));
  assert.ok(flag('NoKOSnd')[2].includes('11,0') && flag('NoKOSnd')[2].includes('50フレーム以上'));
  assert.ok(!view.parameter[0].possible_value.some(row => row[0] === 'NoKO'));
});

test('AssertSpecial keeps mandatory Flag and absent optional flags as commented CNS without invented names', () => {
  const lines = copyLines(view, view.parameter);
  assert.equal(view.parameter[0].default[0].kind, 'required');
  assert.ok(view.parameter.slice(1, 3).every(param => param.default[0].kind === 'none'));
  for (const name of ['Flag', 'Flag2', 'Flag3']) {
    assert.ok(lines.some(line => line.startsWith(`; ${name} `)));
    assert.ok(!lines.some(line => new RegExp(`^${name}\\s*=`).test(line)));
  }
  assert.ok(!lines.some(line => /Flag1/.test(line)));
  assert.ok(lines.includes('IgnoreHitPause'.padEnd(27) + '= 0'));
  assert.ok(view.parameter.slice(0, 3).every(param => param.expression_policy === 'string_literal'));
});

test('AssertSpecial exposes separate RC6 invisible repair and nine-flag 2002 compatibility history', () => {
  const notes = publicNotes(current);
  assert.equal(notes.length, 2);
  assert.equal(notes[0].change, 'fixed');
  assert.equal(notes[0].environment, undefined);
  assert.equal(notes[1].change, 'added');
  assert.deepEqual(notes[1].environment.compatibility_profile, ['mugen-compat-2002']);
  assert.ok(notes.every(note => note.at === 'mugen-1.0-rc6'));
  for (const name of ['NoStandGuard', 'NoCrouchGuard', 'NoAirGuard', 'NoAutoTurn', 'NoShadow', 'NoJuggleCheck', 'NoWalk', 'UnGuardable', 'Invisible']) assert.ok(notes[1].content.includes(`<code>${name}</code>`));
  assert.ok(!notes[1].content.includes('<code>NoMusic</code>'));
  assert.ok(!notes[1].content.includes('<code>TimerFreeze</code>'));
  assert.deepEqual(current.notes.filter(note => note.legacy_index !== undefined).map(note => note.legacy_index), [0, 1]);
});

test('AssertSpecial keeps investigative flags and misleading guard example internal while publishing a valid visibility example', () => {
  const internal = current.notes.filter(note => note.kind === 'research');
  assert.equal(internal.length, 8);
  assert.ok(internal.every(note => note.visibility === 'internal'));
  assert.ok(internal.some(note => note.content.includes('NoKO') && note.evidence.status === 'unverified'));
  assert.ok(internal.some(note => note.evidence.status === 'conflicting'));
  assert.ok(internal.some(note => note.evidence.status === 'confirmed'));
  assert.equal(view.code_sample.length, 1);
  assert.equal(view.code_sample[0].title, '実行者の表示と影を消す');
  assert.ok(view.code_sample[0].code.includes('Flag = Invisible'));
  assert.ok(view.code_sample[0].code.includes('Flag2 = NoShadow'));
  assert.ok(!JSON.stringify(view.code_sample).includes('PrevStateNo'));
});
