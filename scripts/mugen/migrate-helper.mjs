// A reviewed, single-page migration. Original fields are retained for comparison and rollback.
import { writeFileSync } from 'node:fs';
import { readJSON, pathFromRoot } from './files.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { parseFragment } from 'parse5';
import { textContent } from './html.mjs';
import { legacyLoadPriorityEvidence } from './load-priority-evidence.mjs';

const target = 'src/content/state-controllers/Helper.json';
const doc = readJSON(target);
if (doc.notes !== undefined || doc.page.engine !== undefined) throw new Error('Helper is already migrated; review a new change rather than overwriting it.');
doc.page.engine = 'mugen';
doc.page.introduced_in = null;
const sourceKinds = ['official_document', 'official_document', 'official_document', 'official_document', 'official_history', 'archive', 'community_documentation', 'community_documentation', 'community_documentation', 'community_documentation', 'personal_research', 'community_documentation', 'community_documentation'];
doc.quote.forEach((quote, index) => Object.assign(quote, { id: `helper-legacy-${index + 1}`, source_type: sourceKinds[index] }));
doc.quote.push(
  { id: 'helper-local-1.0', title: 'Helper — 保存済み Elecbyte 1.0 公式資料', url: '/MUGEN/document/Official/1.0/sctrls.html#helper', source_type: 'official_document' },
  { id: 'helper-local-1.1', title: 'Helper — 保存済み Elecbyte 1.1 Beta 1 公式資料', url: '/MUGEN/document/Official/1.1b1/sctrls.html#helper', source_type: 'official_document' },
  { id: 'helper-chaos-current', title: 'SC-/Helper — MUGEN CNS WIKI CHAOS@予定（現行 URL）', url: 'https://w.atwiki.jp/mugencns/pages/231.html', source_type: 'community_documentation' },
);
const evidence = (status, basis, source_refs = []) => ({ status, basis, source_refs });
const official = evidence('confirmed', ['official_document'], ['helper-local-1.0', 'helper-local-1.1']);
const unknown = evidence('unverified', []);
const kinds = ['behavior', 'version_change', 'version_change', 'warning', 'warning', 'warning', 'warning'];
doc.notes = doc.version.map((entry, index) => ({
  kind: kinds[index], content: entry.content, legacy_index: index,
  ...(index === 1 ? { change: 'changed', environment: { engine: 'mugen', runtime: ['mugen-1.0'] } } : {}),
  ...(index === 2 ? { change: 'added', environment: { engine: 'mugen', runtime: ['mugen-1.1'] } } : {}),
  evidence: index >= 3 ? evidence('unverified', ['community_documentation'], ['helper-legacy-9']) : index === 2 ? evidence('probable', ['official_document'], ['helper-local-1.0', 'helper-local-1.1']) : unknown,
}));
doc.notes.push({ kind: 'research', content: '<p>保存済みの2002.04.14版公式資料に掲載されていますが、初めて実装されたビルドはこの移行では確定していません。</p>', evidence: evidence('confirmed', ['official_document'], ['helper-legacy-1']) });
for (const parameter of doc.parameter) {
  parameter.load_priority_evidence = legacyLoadPriorityEvidence(parameter);
  parameter.expression_policy = ['HelperType', 'Name', 'PosType'].includes(parameter.parameter) ? 'string_literal' : 'expression';
  if (parameter.parameter.startsWith('Size.')) parameter.default = [{ kind: 'inherit', display: '親から継承', evidence: official }];
  else if (parameter.parameter === 'Name') parameter.default = [{ kind: 'derived', display: textContent(parseFragment(parameter.default_value[0])), evidence: official }];
  else parameter.default = parameter.default_value.map(value => ({ kind: 'literal', value, evidence: official }));
}
const pos = doc.parameter.find(parameter => parameter.parameter === 'Pos');
pos.variants = [
  { environment: { engine: 'mugen', runtime: ['mugen-1.0-final'] }, type: ['int', 'int'], evidence: evidence('confirmed', ['official_document'], ['helper-local-1.0']) },
  { environment: { engine: 'mugen', runtime: ['mugen-1.1-b1'] }, type: ['float', 'float'], evidence: evidence('confirmed', ['official_document'], ['helper-local-1.1']) },
];
doc.parameter.find(parameter => parameter.parameter === 'ReMapPal').environment = { engine: 'mugen', runtime: ['mugen-1.1'] };
doc.parameter.find(parameter => parameter.parameter === 'ReMapPal').default.forEach(item => { item.evidence = evidence('confirmed', ['official_document'], ['helper-local-1.1']); });
doc.parameter.find(parameter => parameter.parameter === 'HelperType').notes = [{ kind: 'deprecated', visibility: 'internal', content: '<p>1.0・1.1の公式資料では Player 型は非推奨として説明されています。旧データにある動作説明と未文書化値の記録は保持しています。</p>', environment: { engine: 'mugen', runtime: ['mugen-1.0-final', 'mugen-1.1-b1'] }, evidence: official }];
doc.parameter.find(parameter => parameter.parameter === 'PosType').notes = [{ kind: 'research', content: '<p>CHAOS の記録では F/B/L/R の高さは地面が基準です。公式資料の Y 座標に関する説明との適用条件の違いは、対象ビルドを指定した実機検証が必要です。</p>', evidence: evidence('conflicting', ['official_document', 'community_documentation'], ['helper-local-1.0', 'helper-local-1.1', 'helper-chaos-current']) }];
createDocumentSchema('state-controllers', readJSON('src/data/engine-versions.json')).parse(doc);
writeFileSync(pathFromRoot(target), JSON.stringify(doc, null, 2) + '\n');
console.log('Migrated Helper; retained all original fields and unresolved load priorities.');
