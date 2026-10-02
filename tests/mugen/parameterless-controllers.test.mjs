import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveDescription, normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';

const plan = loadPlan('parameterless-controllers-01');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));

test('Turn and Null retain every legacy field and have no controller-specific parameters', () => {
  for (const { name, additions } of plan.documents) {
    const original = readJSON(`tests/mugen/batches/parameterless-controllers-01/json/state-controllers/${name}.json`);
    const current = readJSON(`src/content/state-controllers/${name}.json`);
    const view = normalizeDocument(current, common);
    assert.deepEqual(current, addFields(original, additions));
    assert.equal(current.parameter, undefined);
    assert.deepEqual(view.parameter.map(parameter => parameter.parameter), ['IgnoreHitPause', 'Persistent']);
    assert.ok(effectiveDescription(current).includes('固有の必須・任意パラメーターはありません'));
    const lines = copyLines(view, view.parameter);
    assert.ok(lines.some(line => new RegExp(`^Type\\s*= ${name}$`).test(line)));
    assert.equal(lines.length, 5);
  }
});

test('Turn does not promise an animation, while Null scopes trigger evaluation to the 1.1 source', () => {
  const turn = readJSON('src/content/state-controllers/Turn.json');
  const nullController = readJSON('src/content/state-controllers/Null.json');
  assert.match(effectiveDescription(turn), /振り向きアニメーションは再生されません/);
  assert.deepEqual(turn.images, readJSON('tests/mugen/batches/parameterless-controllers-01/json/state-controllers/Turn.json').images);
  assert.deepEqual(publicNotes(nullController).map(note => note.environment.runtime), [['mugen-1.1']]);
  assert.match(publicNotes(nullController)[0].content, /トリガーも評価される/);
});
