import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { loadPlan, addFields } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { parameterLine } from '../../src/lib/mugen/defaults.mjs';

test('drawing angle controllers keep mandatory inputs and distinguish degrees from multipliers', () => {
  for (const entry of loadPlan('drawing-angle-01').documents) {
    const old = readJSON(`tests/mugen/batches/drawing-angle-01/json/state-controllers/${entry.name}.json`);
    const source = readJSON(`src/content/state-controllers/${entry.name}.json`);
    assert.deepEqual(source, addFields(old, entry.additions));
    assert.deepEqual(source.images, old.images);
    assert.deepEqual(source.parameter[0].default_value, ['?']);
    assert.deepEqual(source.parameter[0].load_priority, ['1']);
    assert.equal(source.page.introduced_in, null);
    const current = normalizeDocument(source);
    const value = current.parameter[0];
    assert.equal(value.parameter_type, 'required');
    assert.equal(value.default[0].kind, 'required');
    assert.equal(value.expression_policy, 'expression');
    assert.match(parameterLine(value), /^; value\s+=.*必須/);
    assert.ok(publicNotes(source).some(note => note.content.includes('AngleDraw') && note.content.includes('当たり判定')));
    if (entry.name === 'AngleMul') {
      assert.deepEqual(value.value, ['角度に掛ける倍率']);
      assert.ok(value.description.includes('1なら現在の角度を保ち'));
      assert.ok(!current.description.includes('ラジアン'));
      assert.ok(!value.description.includes('1以上でアクセル'));
      assert.equal(source.notes.find(note => note.kind === 'research').evidence.status, 'confirmed');
      assert.ok(!publicNotes(source).some(note => note.content.includes('取得できず')));
    } else {
      assert.ok(current.description.includes('Atan(1) * 180 / Pi'));
      assert.ok(value.description.includes('度で指定'));
    }
    if (entry.name === 'AngleSet') assert.ok(publicNotes(source).some(note => note.content.includes('0度で初期化')));
  }
});
