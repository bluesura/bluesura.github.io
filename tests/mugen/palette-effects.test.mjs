import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['PalFX', 'AllPalFX', 'BGPalFX'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const originals = Object.fromEntries(names.map(name => [name, readJSON(`tests/mugen/batches/palette-effects-01/json/state-controllers/${name}.json`)]));
const current = Object.fromEntries(names.map(name => [name, readJSON(`src/content/state-controllers/${name}.json`)]));
const views = Object.fromEntries(names.map(name => [name, normalizeDocument(current[name], common)]));
const parameter = (name, key) => views[name].parameter.find(item => item.parameter === key);

test('palette migrations preserve original prose, Q&A, media, limits and exact loading-order strings', () => {
  const plan = loadPlan('palette-effects-01');
  for (const name of names) {
    assert.deepEqual(current[name], addFields(originals[name], plan.documents.find(doc => doc.name === name).additions));
    assert.deepEqual(current[name].version, originals[name].version);
    for (let i = 0; i < originals[name].parameter.length; i++) {
      for (const field of ['description', 'min_value', 'max_value', 'default_value', 'load_priority', 'media']) {
        assert.deepEqual(current[name].parameter[i][field], originals[name].parameter[i][field]);
      }
    }
  }
  assert.deepEqual(current.PalFX.parameter[2].load_priority, ['3, 4, 5']);
  assert.deepEqual(current.PalFX.parameter[3].load_priority, ['6, 7, 8']);
});

test('palette parameter explanations correct stopping, unrestricted nonnegative multiplication and inversion order', () => {
  for (const name of names) {
    assert.ok(parameter(name, 'Time').description.includes('現在の効果を停止'));
    assert.equal(parameter(name, 'Time').max_value, undefined);
    assert.ok(parameter(name, 'Mul').description.includes('各値は0以上'));
    assert.equal(parameter(name, 'Mul').min_value, undefined);
    assert.equal(parameter(name, 'Mul').max_value, undefined);
    assert.equal(parameter(name, 'Add').max_value, undefined);
    assert.ok(parameter(name, 'InvertAll').description.includes('非0'));
    assert.ok(parameter(name, 'InvertAll').description.includes('前に適用'));
    assert.equal(parameter(name, 'InvertAll').max_value, undefined);
    assert.deepEqual(parameter(name, 'SinAdd').value, ['赤の振幅', '緑の振幅', '青の振幅', '周期']);
    assert.deepEqual(parameter(name, 'SinAdd').media, originals[name].parameter[4].media);
  }
});

test('palette pages keep all legacy investigations and reversed Q&A internal while retaining the useful flash example', () => {
  for (const name of names) {
    for (const [i, legacy] of originals[name].version.entries()) {
      const note = current[name].notes.find(item => item.legacy_index === i);
      assert.equal(note.kind, 'research');
      assert.equal(note.content, legacy.content);
    }
    assert.equal(views[name].qanda.length, 0);
    assert.equal(current[name].qanda[0].a, originals[name].qanda[0].a);
    assert.ok(!publicNotes(current[name]).some(note => note.kind === 'research'));
    assert.ok(!views[name].quote.some(quote => quote.url.includes('mugenbinran')));
  }
  assert.equal(views.AllPalFX.code_sample.length, 1);
  assert.deepEqual(views.AllPalFX.code_sample[0], originals.AllPalFX.code_sample[0]);
  assert.equal(current.AllPalFX.code_sample[1].visibility, 'internal');
  assert.deepEqual(current.AllPalFX.code_sample[1].code, originals.AllPalFX.code_sample[1].code);
});

test('palette copy output activates supported defaults and does not assume SinAdd period zero is a safe literal', () => {
  for (const name of names) {
    const code = copyLines(views[name], views[name].parameter);
    for (const [key, value] of Object.entries({ Time: '0', Color: '256', Add: '0, 0, 0', Mul: '256, 256, 256', InvertAll: '0' })) {
      assert.ok(code.some(line => line === `${key.padEnd(27)}= ${value}`));
    }
    assert.equal(parameter(name, 'SinAdd').default[0].kind, 'unknown');
    assert.equal(parameter(name, 'SinAdd').default[0].evidence.status, 'unverified');
    assert.ok(code.some(line => /^; SinAdd\s*=.*未確認/.test(line)));
    assert.ok(!code.some(line => /^SinAdd\s*=/.test(line)));
    for (const shared of ['IgnoreHitPause', 'Persistent']) {
      assert.ok(code.some(line => line.startsWith(shared)));
    }
  }
});

test('palette scopes distinguish player sharing, all objects and background plus lifebars', () => {
  assert.ok(views.PalFX.description.includes('OwnPal = 1'));
  const ownPal = publicNotes(current.PalFX).find(note => note.kind === 'compatibility');
  assert.deepEqual(ownPal.environment.runtime, ['mugen-1.1']);
  assert.ok(ownPal.content.includes('非0'));
  assert.ok(views.AllPalFX.description.includes('OwnPal'));
  assert.ok(views.AllPalFX.description.includes('背景とライフバー'));
  assert.ok(views.BGPalFX.description.includes('背景とライフバー'));
  assert.ok(views.BGPalFX.description.includes('キャラクターのパレットには作用しません'));
});

test('AllPalFX fixes use the documented RC8 and Beta 1 builds rather than the old 1.0 debug-text cutoff', () => {
  const changes = publicNotes(current.AllPalFX).filter(note => note.kind === 'version_change');
  assert.deepEqual(changes.map(note => note.at), ['mugen-1.0-rc8', 'mugen-1.1-b1']);
  assert.ok(changes[0].content.includes('緑・青'));
  assert.ok(changes[1].content.includes('デバッグ表示'));
  assert.ok(changes.every(note => note.evidence.basis.includes('official_history')));
  assert.equal(current.AllPalFX.notes.find(note => note.legacy_index === 0).evidence.status, 'conflicting');
});
