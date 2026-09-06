// Read-only inventory. Writing the report never rewrites source JSON or classifies old prose.
import { mkdirSync, writeFileSync } from 'node:fs';
import { documents, pathFromRoot } from './files.mjs';
import { isCnsLiteral } from '../../src/lib/mugen/defaults.mjs';
import { isPublicNote } from '../../src/lib/mugen/normalize.mjs';

const rows = documents().map(({ path, url, collection, data }) => {
  const inScope = data.category === 'state' || collection === 'triggers';
  const parameters = data.parameter ?? [];
  const mapped = new Set((data.notes ?? []).map(note => note.legacy_index));
  const unresolved = [];
  const internalNotes = [];
  function walk(value, path = '') {
    if (!value || typeof value !== 'object') return;
    if (value.content && !isPublicNote(value)) internalNotes.push(path);
    if (['unknown'].includes(value.kind)) unresolved.push({ path, reason: 'unknown default' });
    if (value.expression_policy === 'unknown') unresolved.push({ path: `${path}/expression_policy`, reason: 'expression policy unknown' });
    for (const key of ['evidence', 'load_priority_evidence']) if (['unverified', 'probable', 'conflicting'].includes(value[key]?.status)) unresolved.push({ path: `${path}/${key}`, reason: value[key].status });
    for (const [key, child] of Object.entries(value)) {
      if (Array.isArray(child)) child.forEach((item, index) => walk(item, `${path}/${key}/${index}`));
      else if (child && typeof child === 'object') walk(child, `${path}/${key}`);
    }
  }
  if (inScope) walk(data);
  const undisplayed = [];
  if (inScope && data.sample_code?.length) undisplayed.push('sample_code');
  if (inScope) for (const [index, item] of (data.qanda ?? []).entries()) for (const key of Object.keys(item)) if (!['q', 'a'].includes(key)) undisplayed.push(`qanda/${index}/${key}`);
  return {
    path, url, collection, category: data.category ?? 'lifebar',
    stage: !inScope ? 'outside_current_migration' : data.page.engine ? 'v2_additions_present' : 'legacy',
    parameters: parameters.length,
    structured_defaults: parameters.filter(p => p.default !== undefined).length,
    literal_default_candidates: !inScope ? [] : parameters.flatMap((p, index) => p.default === undefined && p.parameter_type !== 'required' && isCnsLiteral(p.default_value?.join(', ') ?? '') ? [index] : []),
    unmapped_legacy_notes: !inScope ? [] : (data.version ?? []).flatMap((_, index) => mapped.has(index) ? [] : [index]),
    load_priority_unknown: !inScope ? [] : parameters.flatMap((p, index) => p.load_priority?.some(value => value.includes('?')) ? [index] : []),
    introduced_in: !inScope ? undefined : data.page.introduced_in ?? null,
    undisplayed_legacy_fields: undisplayed, internal_notes: internalNotes, unresolved,
  };
});
const count = stage => rows.filter(row => row.stage === stage).length;
const summary = {
  total_documents: rows.length,
  v2_additions_present: count('v2_additions_present'),
  legacy_in_scope: count('legacy'),
  outside_current_migration: count('outside_current_migration'),
  unmapped_legacy_notes: rows.reduce((n, row) => n + row.unmapped_legacy_notes.length, 0),
  pages_with_undisplayed_legacy_fields: rows.filter(row => row.undisplayed_legacy_fields.length).length,
  internal_notes: rows.reduce((n, row) => n + row.internal_notes.length, 0),
};
const directory = pathFromRoot('artifacts/mugen');
mkdirSync(directory, { recursive: true });
writeFileSync(pathFromRoot('artifacts/mugen/inventory.json'), JSON.stringify({ summary, documents: rows }, null, 2) + '\n');
const lines = [
  '# MUGEN 移行台帳（自動集計）', '',
  '任意構造の追加済みは、仕様の実機検証完了を意味しません。固定値候補も適用条件・省略時の意味を個別確認してから移行します。', '',
  `全 ${summary.total_documents} 件 / v2 追加済み ${summary.v2_additions_present} 件 / 対象内の旧形式 ${summary.legacy_in_scope} 件 / 対象外 ${summary.outside_current_migration} 件`, '',
  '| ファイル | 状態 | 未対応履歴 | 既存の未表示項目 |', '| --- | --- | --- | --- |',
  ...rows.map(row => `| ${row.path} | ${row.stage} | ${row.unmapped_legacy_notes.length} | ${row.undisplayed_legacy_fields.join(', ')} |`), '',
  '各パラメーターの未確認項目、固定値候補、読み込み順の疑問符は inventory.json を参照してください。', '',
];
writeFileSync(pathFromRoot('artifacts/mugen/inventory.md'), lines.join('\n'));
console.log(JSON.stringify(summary, null, 2));
