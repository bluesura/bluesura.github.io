import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parse, parseFragment } from 'parse5';
import { readArticle, findAll, attr, compactText, textContent } from './html.mjs';
import { fixtures, collections, documents, readJSON, pathFromRoot } from './files.mjs';
import { normalizeDocument, effectiveNotes, isPublicNote } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';

const manifest = readJSON('tests/mugen/baseline/manifest.json');
for (const route of manifest.routes) assert.ok(existsSync(pathFromRoot(`dist${route}`)), `Missing route: ${route}`);
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const results = [];
for (const [collection, names] of Object.entries(fixtures)) for (const name of [...names, 'index']) {
  const html = readFileSync(pathFromRoot(`dist/MUGEN/document/${collections[collection]}/${name}.html`), 'utf8');
  const rendered = readArticle(html);
  if (name === 'index') {
    const tree = parse(html);
    for (const entry of documents().filter(entry => entry.collection === collection && collection !== 'lifebars')) {
      assert.ok(rendered.links.some(link => link.href === entry.url), `${collection}: missing index link ${entry.url}`);
      if (collection === 'state-controllers') {
        const section = findAll(tree, node => node.tagName === 'div' && attr(node, 'class') === 'section' && findAll(node, child => child.tagName === 'h2' && findAll(child, link => attr(link, 'href') === entry.url).length).length)[0];
        assert.ok(section, `Missing index section: ${entry.url}`);
        const lines = findAll(section, node => node.tagName === 'li').map(textContent);
        for (const shared of common) assert.equal(lines.filter(line => line.trim().toLowerCase().startsWith(shared.parameter.toLowerCase())).length, entry.data.category === 'state' ? 1 : 0, `${entry.url}: index common parameter ${shared.parameter}`);
      }
    }
    results.push({ collection, name, generated: true }); continue;
  }
  const legacy = readJSON(`tests/mugen/baseline/json/${collection}/${name}.json`);
  const before = readJSON(`tests/mugen/baseline/rendered/${collection}/${name}.json`);
  const source = readJSON(`src/content/${collection}/${name}.json`);
  const current = normalizeDocument(source, common);
  const hidden = [source, ...(source.parameter ?? [])].flatMap(value => effectiveNotes(value).filter(note => !isPublicNote(note)));
  const hiddenFragments = hidden.map(note => parseFragment(note.content));
  const hiddenLinks = hiddenFragments.flatMap(tree => findAll(tree, node => attr(node, 'href')).map(node => ({ href: attr(node, 'href'), text: compactText(node) })));
  const hiddenMedia = hiddenFragments.flatMap(tree => findAll(tree, node => attr(node, 'src')).map(node => attr(node, 'src')));
  for (const id of before.sections) assert.ok(rendered.sections.includes(id), `${name}: lost section #${id}`);
  for (const link of before.links) assert.ok(rendered.links.some(candidate => candidate.href === link.href && candidate.text === link.text) || hiddenLinks.some(candidate => candidate.href === link.href && candidate.text === link.text), `${name}: lost link ${link.href}`);
  for (const src of before.media) assert.ok(rendered.media.includes(src) || hiddenMedia.includes(src), `${name}: lost media ${src}`);
  const text = compactText(parseFragment(legacy.description));
  assert.ok(rendered.text.includes(text), `${name}: lost description`);
  for (const [index, entry] of (legacy.version ?? []).entries()) {
    const mapped = source.notes?.find(note => note.legacy_index === index);
    if (!mapped || isPublicNote(mapped)) assert.ok(rendered.text.includes(compactText(parseFragment(entry.content))), `${name}: lost public legacy history`);
  }
  // Lifebars use their own schema and renderer; compare their complete article text.
  if (collection === 'lifebars') assert.equal(rendered.text, before.text, `${name}: lifebar changed`);
  if (source.category === 'state') {
    assert.deepEqual(rendered.code.map(line => line.replace(/\s+/g, ' ')), copyLines(current, current.parameter).map(line => line.replace(/\s+/g, ' ')), `${name}: copy text differs from model`);
    const tree = parse(html);
    for (const id of ['Parameter', 'DefaultParameter', 'LoadParameter']) {
      const section = findAll(tree, node => attr(node, 'id') === id)[0];
      assert.ok(section, `${name}: missing ${id}`);
      for (const shared of common) assert.ok(textContent(section).toLowerCase().includes(shared.parameter.toLowerCase()), `${name}: ${id} missing ${shared.parameter}`);
    }
    if (name === 'Helper') assert.ok(rendered.code.some(line => /^; Size.XScale/.test(line)), 'Helper inherited assignment must be commented');
  }
  const document = parse(html);
  assert.equal(findAll(document, node => attr(node, 'class')?.split(' ').includes('evidence')).length, 0, `${name}: evidence leaked into HTML`);
  const renderedNotes = findAll(document, node => attr(node, 'class') === 'specification-note');
  assert.equal(renderedNotes.length, [source, ...(source.parameter ?? [])].flatMap(value => effectiveNotes(value).filter(isPublicNote)).length, `${name}: wrong public note count`);
  for (const note of hidden) assert.ok(!renderedNotes.some(node => compactText(node).includes(compactText(parseFragment(note.content)))), `${name}: internal note leaked`);
  if (name === 'Helper') {
    const value = source.parameter.find(p => p.parameter === 'Name').default[0].display;
    assert.ok(rendered.text.includes(value), 'Helper name format lost from documentation');
    assert.ok(rendered.code.some(line => line.includes(value)), 'Helper name format lost from copy output');
  }
  const ids = new Set(findAll(document, node => attr(node, 'id')).map(node => attr(node, 'id')));
  for (const { href } of rendered.links.filter(link => link.href.startsWith('#source-'))) assert.ok(ids.has(href.slice(1)), `${name}: dangling evidence link ${href}`);
  results.push({ collection, name, preserved: true, sections: rendered.sections, code: rendered.code });
}
mkdirSync(pathFromRoot('artifacts/mugen'), { recursive: true });
writeFileSync(pathFromRoot('artifacts/mugen/html-report.json'), JSON.stringify({ routes: manifest.routes.length, pages: results }, null, 2) + '\n');
console.log(`Checked ${manifest.routes.length} existing routes and ${results.length} representative/index pages.`);
