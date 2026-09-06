import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parseFragment } from 'parse5';
import { textContent } from '../../scripts/mugen/html.mjs';
import { readJSON, pathFromRoot } from '../../scripts/mugen/files.mjs';
import { publicNotes, effectiveNotes } from '../../src/lib/mugen/normalize.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { describeDefault, parameterLine } from '../../src/lib/mugen/defaults.mjs';

const registry = readJSON('src/data/engine-versions.json');
test('internal publication choices survive validation and never resurrect mapped legacy notes', () => {
  const doc = { state: 'Example', page: {}, version: [{ no: '旧調査', content: '旧調査の本文' }], notes: [
    { kind: 'research', content: '検証済みの内部記録', legacy_index: 0, evidence: { status: 'confirmed', basis: ['maintainer_report'] } },
    { kind: 'behavior', visibility: 'internal', content: '公開不要の結果', evidence: { status: 'confirmed', basis: ['maintainer_report'] } },
    { kind: 'behavior', content: '公開する説明' },
  ] };
  const parsed = createDocumentSchema('state-controllers', registry).parse(doc);
  assert.equal(effectiveNotes(parsed).length, 3);
  assert.deepEqual(publicNotes(parsed).map(note => note.content), ['公開する説明']);
  assert.equal(parsed.notes[0].evidence.status, 'confirmed');
  assert.equal(createDocumentSchema('state-controllers', registry).safeParse({ ...doc, notes: [{ kind: 'research', visibility: 'public', content: '公開不可' }] }).success, false);
});
test('Helper name retains the precise suffix and placeholder, including in copied CNS comments', () => {
  const doc = readJSON('src/content/state-controllers/Helper.json');
  const name = doc.parameter.find(p => p.parameter === 'Name');
  const original = textContent(parseFragment(name.default_value[0]));
  assert.equal(describeDefault(name), original);
  assert.ok(original.includes("'s helper"));
  assert.ok(parameterLine(name).startsWith('; Name'));
  assert.ok(parameterLine(name).includes(original));
  const known = doc.parameter.find(p => p.parameter === 'OwnPal');
  assert.equal(known.load_priority_evidence.status, 'confirmed');
  assert.deepEqual(known.load_priority_evidence.basis, ['maintainer_report']);
  assert.equal(known.load_priority_evidence.tested_on, undefined);
  assert.deepEqual(name.load_priority, ['?']);
});
test('client syntax highlighting preserves angle brackets and operators when building HTML', () => {
  const name = readJSON('src/content/state-controllers/Helper.json').parameter.find(p => p.parameter === 'Name');
  const lines = [parameterLine(name), 'Trigger1 = Time < 20 && var(0) >= 1', 'Name = "<helper>&test"'];
  const nodes = lines.map(text => ({ text, html: '' }));
  const document = {};
  const $ = target => target === document ? { ready: fn => fn() } : target === '.code li' ? {
    each: fn => { for (const node of nodes) if (fn.call(node) === false) break; },
  } : { text: () => target.text, html: html => { target.html = html; } };
  runInNewContext(readFileSync(pathFromRoot('public/scripts/code.js'), 'utf8'), { $, document });
  assert.deepEqual(nodes.map(node => textContent(parseFragment(node.html))), lines);
});
