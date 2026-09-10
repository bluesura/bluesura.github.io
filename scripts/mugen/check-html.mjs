import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parse, parseFragment } from 'parse5';
import { readArticle, findAll, attr, compactText, textContent } from './html.mjs';
import { baselineCases, collections, documents, readJSON, pathFromRoot } from './files.mjs';
import { normalizeDocument, effectiveNotes, isPublicNote, effectiveDescription } from '../../src/lib/mugen/normalize.mjs';
import { copyLines } from '../../src/lib/mugen/defaults.mjs';
import { effectiveParameters } from '../../src/lib/mugen/parameters.mjs';

const manifest = readJSON('tests/mugen/baseline/manifest.json');
for (const route of manifest.routes) assert.ok(existsSync(pathFromRoot(`dist${route}`)), `Missing route: ${route}`);
const common = ['IgnoreHitPause', 'Persistent'].map(name => readJSON(`src/data/common/${name}.json`));
const sampleNodes = document => {
  const section = findAll(document, node => attr(node, 'id') === 'CodeSample')[0];
  return section ? findAll(section, node => node.tagName === 'div' && node.childNodes?.some(child => child.tagName === 'h3')) : [];
};
const qandaNodes = document => {
  const section = findAll(document, node => attr(node, 'id') === 'QandA')[0];
  const container = section && findAll(section, node => node.tagName === 'div' && node.childNodes?.some(child => child.tagName === 'h3'))[0];
  if (!container) return [];
  const entries = [];
  let nodes;
  for (const node of container.childNodes ?? []) {
    if (node.tagName === 'h3') {
      if (nodes?.length) entries.push({ childNodes: nodes });
      nodes = [node];
    } else if (nodes) {
      nodes.push(node);
      if (node.tagName === 'hr') { entries.push({ childNodes: nodes }); nodes = undefined; }
    }
  }
  if (nodes?.length) entries.push({ childNodes: nodes });
  return entries;
};
const results = [];
const cases = [...baselineCases(), ...Object.keys(collections).map(collection => ({ collection, name: 'index' }))];
for (const { collection, name, base } of cases) {
  const html = readFileSync(pathFromRoot(`dist/MUGEN/document/${collections[collection]}/${name}.html`), 'utf8');
  const rendered = readArticle(html);
  if (name === 'index') {
    const tree = parse(html);
    for (const entry of documents().filter(entry => entry.collection === collection && collection !== 'lifebars')) {
      assert.ok(rendered.links.some(link => link.href === entry.url), `${collection}: missing index link ${entry.url}`);
      if (entry.data.documentation) {
        const section = findAll(tree, node => node.tagName === 'div' && attr(node, 'class') === 'section' && findAll(node, child => child.tagName === 'h2' && findAll(child, link => attr(link, 'href') === entry.url).length).length)[0];
        const description = section?.childNodes.find(node => node.tagName === 'div');
        assert.ok(description, `${entry.url}: missing index description`);
        assert.equal(compactText(description), compactText(parseFragment(effectiveDescription(entry.data))), `${entry.url}: edited index description`);
      }
      if (collection === 'state-controllers') {
        const section = findAll(tree, node => node.tagName === 'div' && attr(node, 'class') === 'section' && findAll(node, child => child.tagName === 'h2' && findAll(child, link => attr(link, 'href') === entry.url).length).length)[0];
        assert.ok(section, `Missing index section: ${entry.url}`);
        const lines = findAll(section, node => node.tagName === 'li').map(textContent);
        for (const parameter of effectiveParameters(entry.data, common)) {
          const label = parameter.value?.join(', ');
          if (entry.data.parameter?.some(item => item.parameter === parameter.parameter && item.documentation?.value)) {
            assert.ok(lines.some(line => line.trim().startsWith(parameter.parameter) && line.includes(label)), `${entry.url}: index lost edited parameter label`);
          }
        }
        for (const shared of common) assert.equal(lines.filter(line => line.trim().toLowerCase().startsWith(shared.parameter.toLowerCase())).length, entry.data.category === 'state' ? 1 : 0, `${entry.url}: index common parameter ${shared.parameter}`);
      }
    }
    results.push({ collection, name, generated: true }); continue;
  }
  const legacy = readJSON(`${base}/json/${collection}/${name}.json`);
  const before = readJSON(`${base}/rendered/${collection}/${name}.json`);
  const source = readJSON(`src/content/${collection}/${name}.json`);
  const current = normalizeDocument(source, common);
  const hidden = [source, ...(source.parameter ?? [])].flatMap(value => effectiveNotes(value).filter(note => !isPublicNote(note)));
  const internalSampleIndices = (source.code_sample ?? []).flatMap((sample, i) => sample.visibility === 'internal' ? [i] : []);
  const internalQandAIndices = (source.qanda ?? []).flatMap((item, i) => item.visibility === 'internal' ? [i] : []);
  const oldDocument = internalSampleIndices.length || internalQandAIndices.length ? parse(readFileSync(pathFromRoot(`${base}/html/${collection}/${name}.html`), 'utf8')) : undefined;
  const oldSampleNodes = internalSampleIndices.length ? sampleNodes(oldDocument) : [];
  const oldQandANodes = internalQandAIndices.length ? qandaNodes(oldDocument) : [];
  const hiddenFragments = [
    ...hidden.map(note => parseFragment(note.content)),
    ...internalSampleIndices.flatMap(i => oldSampleNodes[i] ? [oldSampleNodes[i]] : []),
    ...internalQandAIndices.flatMap(i => oldQandANodes[i] ? [oldQandANodes[i]] : []),
  ];
  const hiddenLinks = hiddenFragments.flatMap(tree => findAll(tree, node => attr(node, 'href')).map(node => ({ href: attr(node, 'href'), text: compactText(node) })));
  const hiddenMedia = hiddenFragments.flatMap(tree => findAll(tree, node => attr(node, 'src')).map(node => attr(node, 'src')).filter(Boolean));
  for (const id of before.sections) assert.ok(
    rendered.sections.includes(id)
      || (id === 'CodeSample' && internalSampleIndices.length > 0 && !current.code_sample.length)
      || (id === 'QandA' && internalQandAIndices.length > 0 && !current.qanda.length),
    `${name}: lost section #${id}`,
  );
  for (const link of before.links) assert.ok(
    rendered.links.some(candidate => candidate.href === link.href && candidate.text === link.text)
      || hiddenLinks.some(candidate => candidate.href === link.href && candidate.text === link.text)
      || (link.href === '#CodeSample' && internalSampleIndices.length > 0 && !current.code_sample.length),
    `${name}: lost link ${link.href}`,
  );
  for (const src of before.media.filter(Boolean)) assert.ok(rendered.media.includes(src) || hiddenMedia.includes(src), `${name}: lost media ${src}`);
  const text = compactText(parseFragment(current.description));
  assert.ok(rendered.text.includes(text), `${name}: lost effective description`);
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
  if (collection !== 'lifebars' && source.code_sample) {
    const samples = sampleNodes(document);
    assert.equal(samples.length, current.code_sample.length, `${name}: wrong public sample count`);
    for (const [i, sample] of current.code_sample.entries()) {
      assert.equal(compactText(samples[i].childNodes.find(node => node.tagName === 'h3')), sample.title.trim(), `${name}: public sample order/title`);
      const lines = findAll(samples[i], node => attr(node, 'class') === 'code').flatMap(code => findAll(code, node => node.tagName === 'li').map(textContent));
      assert.deepEqual(lines, sample.code.map(line => textContent(parseFragment(line))), `${name}: public sample code changed`);
      if (sample.description) {
        const expectedDescription = parseFragment(sample.description);
        assert.ok(compactText(samples[i]).includes(compactText(expectedDescription)), `${name}: sample description missing`);
        const iframeAttrs = tree => findAll(tree, node => node.tagName === 'iframe').map(node => ({ src: attr(node, 'src') ?? '', srcdoc: attr(node, 'srcdoc') ?? '' }));
        assert.deepEqual(iframeAttrs(samples[i]), iframeAttrs(expectedDescription), `${name}: sample iframe changed`);
      }
    }
  }
  if (collection !== 'lifebars' && source.qanda) {
    const entries = qandaNodes(document);
    assert.equal(entries.length, current.qanda.length, `${name}: wrong public Q&A count`);
    for (const [i, item] of current.qanda.entries()) {
      const heading = findAll(entries[i], node => node.tagName === 'h3')[0];
      assert.equal(compactText(heading), item.q.trim(), `${name}: public Q&A order/question`);
      const answer = { childNodes: entries[i].childNodes.filter(node => !['h3', 'hr'].includes(node.tagName)) };
      assert.equal(compactText(answer), compactText(parseFragment(item.a)), `${name}: public Q&A answer changed`);
    }
  }
  if (source.documentation) {
    const description = findAll(document, node => attr(node, 'class') === 'description' && attr(node, 'itemprop') === 'articleBody')[0];
    assert.ok(description, `${name}: missing article description`);
    // Associated links are rendered separately in the same container.
    const prose = { childNodes: description.childNodes.filter(node => attr(node, 'class') !== 'associated-trigger') };
    assert.equal(compactText(prose), text, `${name}: edited article description`);
    const descriptionMetadata = findAll(document, node => node.tagName === 'meta' && [attr(node, 'name'), attr(node, 'property')].some(value => ['description', 'og:description', 'twitter:description'].includes(value)));
    assert.equal(descriptionMetadata.length, 3, `${name}: missing description metadata`);
    for (const meta of descriptionMetadata) {
      assert.equal(attr(meta, 'content'), current.description.replace(/<[^>]*>?/gm, ''), `${name}: stale description metadata`);
    }
    if (source.documentation.evidence?.comment) assert.ok(!html.includes(source.documentation.evidence.comment), `${name}: description evidence leaked`);
  }
  const parameterEntries = findAll(document, node => attr(node, 'class') === 'parameter-entry');
  for (const [index, parameter] of current.parameter.filter(parameter => parameter.parameter).entries()) {
    const editorial = source.parameter?.find(item => item.parameter === parameter.parameter)?.documentation;
    if (!editorial) continue;
    const entry = parameterEntries[index];
    assert.ok(entry, `${name}: missing edited parameter ${parameter.parameter}`);
    const heading = findAll(entry, node => node.tagName === 'h3')[0];
    const purpose = parameter.value?.filter(Boolean).length ? ` = ${parameter.value.join(', ')}` : '';
    assert.equal(compactText(heading), `${parameter.parameter}${purpose}`, `${name}: edited assignment heading`);
    const description = findAll(entry, node => attr(node, 'class') === 'parameter-description')[0];
    assert.equal(compactText(description), compactText(parseFragment(parameter.description)), `${name}: edited description`);
    if (editorial.evidence?.comment) assert.ok(!html.includes(editorial.evidence.comment), `${name}: editorial evidence leaked`);
    if (['VelAdd', 'VelSet'].includes(name)) assert.ok(!compactText(entry).includes('乗算速度') && !compactText(entry).includes('ターゲット'), `${name}: old error is still public`);
  }
  assert.equal(findAll(document, node => attr(node, 'class')?.split(' ').includes('evidence')).length, 0, `${name}: evidence leaked into HTML`);
  const renderedNotes = findAll(document, node => attr(node, 'class') === 'specification-note');
  assert.equal(renderedNotes.length, [source, ...(source.parameter ?? [])].flatMap(value => effectiveNotes(value).filter(isPublicNote)).length, `${name}: wrong public note count`);
  for (const note of [source, ...(source.parameter ?? [])].flatMap(value => effectiveNotes(value).filter(isPublicNote))) {
    assert.ok(renderedNotes.some(node => compactText(node).includes(compactText(parseFragment(note.content)))), `${name}: public note content missing`);
  }
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
