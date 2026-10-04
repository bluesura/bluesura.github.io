import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from '../../scripts/mugen/files.mjs';
import { addFields, loadPlan } from '../../scripts/mugen/batch.mjs';
import { normalizeDocument, publicNotes } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const plan = loadPlan('variable-ranges-01');
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const random = readJSON('src/content/state-controllers/VarRandom.json');
const range = readJSON('src/content/state-controllers/VarRangeSet.json');
const randomView = normalizeDocument(random, common);
const rangeView = normalizeDocument(range, common);

test('variable range controllers preserve original categories, defaults, warning text and every loading component', () => {
  for (const entry of plan.documents) {
    const before = readJSON(`tests/mugen/batches/variable-ranges-01/json/state-controllers/${entry.name}.json`);
    const after = entry.name === 'VarRandom' ? random : range;
    assert.deepEqual(after, addFields(before, entry.additions));
    assert.equal(after.description, before.description);
    assert.deepEqual(after.version, before.version);
    assert.equal(after.page.introduced_in, null);
    assert.deepEqual(after.page.category, before.page.category);
    for (const [index, parameter] of before.parameter.entries()) {
      for (const key of Object.keys(parameter)) assert.deepEqual(after.parameter[index][key], parameter[key]);
      assert.equal(after.parameter[index].load_priority_evidence.status, 'confirmed');
      assert.deepEqual(after.parameter[index].load_priority_evidence.basis, ['maintainer_report']);
    }
  }
  assert.deepEqual(random.parameter[1].load_priority, ['2', '3']);
  assert.deepEqual(range.parameter.map(parameter => parameter.load_priority), [['3'], ['3'], ['1'], ['2']]);
  assert.deepEqual(random.parameter[1].default_value, ['0, 1000']);
  assert.deepEqual(range.parameter[3].default_value, [';整数変数に代入する場合は59、小数変数の場合は39になります。']);
});

test('VarRandom keeps inclusive bounds, single-argument maximum and 0,1000 default separate from Random trigger limits', () => {
  assert.equal(randomView.page.category[1], '指定範囲の整数乱数を変数へ代入');
  assert.ok(randomView.description.includes('浮動小数変数には使用できません'));
  assert.ok(randomView.description.includes('Randomトリガーの0～999とは異なります'));
  const [number, interval] = randomView.parameter;
  assert.equal(number.default[0].kind, 'required');
  assert.ok(number.description.includes('0～59'));
  assert.deepEqual(interval.default.map(value => value.value), ['0', '1000']);
  assert.ok(interval.description.includes('両端を含む'));
  assert.ok(interval.description.includes('Range = 10') && interval.description.includes('Range = 0,10'));
  const lines = copyLines(randomView, randomView.parameter);
  assert.ok(lines.includes('Range'.padEnd(27) + '= 0, 1000'));
  assert.ok(lines.some(line => line.startsWith('; v ') && line.includes('必須')));
  assert.ok(!lines.some(line => /^v\s*=/.test(line)));
  assert.ok(!lines.some(line => /fvalue|fvar|sysvar/.test(line)));
});

test('VarRangeSet retains 0 first and type-dependent 59/39 last without selecting both required value forms', () => {
  const [integer, float, first, last] = rangeView.parameter;
  assert.equal(integer.default[0].kind, 'required');
  assert.equal(float.default[0].kind, 'required');
  assert.deepEqual(float.type, ['float']);
  assert.equal(first.default[0].value, '0');
  assert.equal(last.default[0].kind, 'derived');
  assert.equal(last.default[0].display, '整数用valueなら59、浮動小数用fvalueなら39');
  assert.equal(last.value[0], '最後の変数番号');
  assert.ok(last.description.includes('終了番号'));
  assert.ok(!last.description.includes('範囲のうち、最初の変数'));
  assert.deepEqual(rangeView.constraints.map(constraint => constraint.parameters), [['value', '; fvalue'], ['value', '; fvalue']]);
  const lines = copyLines(rangeView, rangeView.parameter);
  assert.ok(lines.includes('First'.padEnd(27) + '= 0'));
  assert.ok(lines.some(line => line.startsWith('; Last ') && line.includes('59') && line.includes('39')));
  assert.ok(!lines.some(line => /^(value|fvalue|Last)\s*=/.test(line)));
  assert.ok(!lines.some(line => /^(v|fv|sysvar|sysfvar)\s*=/.test(line)));
  assert.equal(lines.at(-2), 'IgnoreHitPause'.padEnd(27) + '= 0');
  assert.equal(lines.at(-1), 'Persistent'.padEnd(27) + '= 1');
});

test('VarRangeSet publishes single evaluation and examples using a contiguous integer range or all float slots', () => {
  assert.ok(rangeView.description.includes('式は1回だけ評価'));
  assert.ok(publicNotes(range).some(note => note.kind === 'behavior' && note.content.includes('変数ごとに乱数を取り直す処理にはなりません')));
  assert.ok(rangeView.parameter.slice(0, 2).every(parameter => parameter.description.includes('1回だけ評価')));
  const [integer, float] = rangeView.code_sample;
  assert.ok(integer.code.includes('First = 10') && integer.code.includes('Last = 14') && integer.code.includes('value = Random'));
  assert.ok(!integer.code.some(line => /^fvalue\s*=/.test(line)));
  assert.ok(float.code.includes('fvalue = 0.5'));
  assert.ok(!float.code.some(line => /^(First|Last|value)\s*=/.test(line)));
  assert.ok(float.description.includes('fvar(0)～fvar(39)'));
});

test('both controllers hide unverified warnings and community research while preserving conflicts and custom-state target guidance', () => {
  for (const [document, view] of [[random, randomView], [range, rangeView]]) {
    const oldWarning = document.notes.find(note => note.legacy_index === 0);
    assert.equal(oldWarning.kind, 'research');
    assert.equal(oldWarning.visibility, 'internal');
    assert.equal(oldWarning.evidence.status, 'unverified');
    const notes = publicNotes(document);
    assert.ok(!JSON.stringify(notes).includes('OUT OF RANGE'));
    assert.ok(!JSON.stringify(notes).includes('ILLEGAL VAR RANGE'));
    assert.ok(notes.some(note => note.kind === 'warning' && note.content.includes('相手自身の変数')));
    assert.ok(!view.quote.some(quote => quote.visibility === 'internal'));
  }
  assert.ok(random.notes.some(note => note.kind === 'research' && note.content.includes('+32767') && note.evidence.status === 'unverified'));
  assert.ok(!JSON.stringify(publicNotes(random)).includes('32767'));
  assert.ok(range.notes.some(note => note.kind === 'research' && note.content.includes('FValueをInt型') && note.evidence.status === 'conflicting'));
  assert.ok(range.notes.some(note => note.kind === 'research' && note.content.includes('F4')));
  assert.ok(!JSON.stringify(publicNotes(range)).includes('F4'));
});
