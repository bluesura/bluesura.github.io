import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readJSON, pathFromRoot } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const names = ['PlaySnd', 'StopSnd', 'SndPan'];
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const current = Object.fromEntries(names.map(name => [name, readJSON(`src/content/state-controllers/${name}.json`)]));
const views = Object.fromEntries(names.map(name => [name, normalizeDocument(current[name], common)]));
const parameter = (name, key) => views[name].parameter.find(item => item.parameter === key);
const lines = name => copyLines(views[name], views[name].parameter);

test('sound controllers preserve every original field including warning records, commented syntax and StopSnd examples', () => {
  const plan = loadPlan('sound-control-01');
  for (const name of names) {
    const original = readJSON(`tests/mugen/batches/sound-control-01/json/state-controllers/${name}.json`);
    assert.deepEqual(current[name], addFields(original, plan.documents.find(doc => doc.name === name).additions));
    assert.deepEqual(current[name].version, original.version);
    assert.deepEqual(current[name].parameter.map(item => item.load_priority), original.parameter.map(item => item.load_priority));
    assert.deepEqual(current[name].code_sample, original.code_sample);
  }
  assert.ok(current.PlaySnd.parameter.some(item => item.parameter === ';VolumeScale'));
});

test('PlaySnd distinguishes the RC8 volume change and keeps uncertain legacy bounds and tables internal', () => {
  const volume = parameter('PlaySnd', 'Volume');
  const scale = parameter('PlaySnd', ';VolumeScale');
  assert.equal(volume.min_value, undefined);
  assert.equal(volume.max_value, undefined);
  assert.equal(parameter('PlaySnd', 'value').possible_value, undefined);
  assert.ok(scale.environment.runtime.includes('mugen-1.0-rc8'));
  assert.ok(!scale.environment.runtime.includes('mugen-1.0'));
  assert.equal(scale.default[0].value, '100');
  assert.equal(volume.variants[0].default[0].kind, 'none');
  const change = publicNotes(current.PlaySnd);
  assert.equal(change.length, 1);
  assert.equal(change[0].at, 'mugen-1.0-rc8');
  assert.equal(change[0].change, 'changed');
  for (const name of ['Volume', 'LowPriority']) {
    assert.ok(parameter('PlaySnd', name).default[0].evidence.source_refs.includes('playsnd-chaos'));
    assert.ok(parameter('PlaySnd', name).default[0].evidence.basis.includes('community_documentation'));
  }
});

test('PlaySnd copy leaves required sound IDs, version-specific volume and exclusive panning commented', () => {
  const code = lines('PlaySnd');
  for (const key of ['value', 'Volume', 'VolumeScale', 'Pan', 'AbsPan']) {
    assert.ok(code.some(line => new RegExp(`^; ${key}\\s*=`).test(line)), `${key} must stay commented`);
    assert.ok(!code.some(line => new RegExp(`^${key}\\s*=`).test(line)));
  }
  for (const [key, value] of Object.entries({ Channel: '-1', LowPriority: '0', FreqMul: '1.0', Loop: '0' })) {
    assert.ok(code.some(line => line.trim() === `${key.padEnd(27)}= ${value}`));
  }
});

test('SndPan requires Channel and one exclusive panning argument while StopSnd documents all-player stopping', () => {
  assert.equal(parameter('SndPan', 'Channel').parameter_type, 'required');
  assert.deepEqual(views.SndPan.constraints.map(item => item.kind), ['one_of', 'mutually_exclusive']);
  for (const key of ['Pan', 'AbsPan']) {
    assert.equal(parameter('SndPan', key).parameter_type, 'instead');
    assert.equal(parameter('SndPan', key).default[0].kind, 'required');
    assert.ok(lines('SndPan').some(line => new RegExp(`^; ${key}\\s*=`).test(line)));
    assert.ok(!lines('SndPan').some(line => new RegExp(`^${key}\\s*=`).test(line)));
  }
  assert.ok(parameter('StopSnd', 'Channel').description.includes('他のプレイヤー'));
  assert.ok(lines('StopSnd').some(line => /^; Channel\s*=.*必須/.test(line)));
  assert.deepEqual(publicNotes(current.StopSnd), []);
  assert.deepEqual(publicNotes(current.SndPan), []);
});

test('RC8 registry date is grounded in archived history without guessing a separate distribution date', () => {
  const build = readJSON('src/data/engine-versions.json').builds.find(item => item.id === 'mugen-1.0-rc8');
  assert.equal(build.build_date, '2010-06-29');
  assert.equal(build.public_date, null);
  const history = readFileSync(pathFromRoot('public/MUGEN/document/Official/1.0/history.html'), 'utf8');
  assert.match(history, /id="version-1-0-rc8">\s*<h1>Version 1\.0 RC8<\/h1>\s*<p>29 Jun 2010<\/p>/);
});
