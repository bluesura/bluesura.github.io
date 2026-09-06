// Only the named, reviewed representative set is accepted. No all-document conversion here.
import { writeFileSync } from 'node:fs';
import { parseFragment } from 'parse5';
import { compactText } from './html.mjs';
import { readJSON, pathFromRoot } from './files.mjs';
import { isCnsLiteral } from '../../src/lib/mugen/defaults.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';
import { legacyLoadPriorityEvidence } from './load-priority-evidence.mjs';

const definitions = {
  HitDef: { collection: 'state-controllers', kinds: ['behavior', 'version_change', 'version_change', ...Array(31).fill('warning')], changes: { 1: 'changed', 2: 'added' } },
  VarSet: { collection: 'state-controllers', kinds: ['error', 'warning'] },
  HitBy: { collection: 'state-controllers', kinds: [] },
  Explod: { collection: 'state-controllers', kinds: ['bug', 'research', 'research', 'research', 'bug', 'version_change', 'bug', 'version_change', 'version_change', ...Array(6).fill('warning')], changes: { 5: 'changed', 7: 'added', 8: 'removed' } },
  Zoom: { collection: 'state-controllers', kinds: ['limitation', 'bug', 'limitation'] },
  TagIn: { collection: 'state-controllers', kinds: ['warning'] },
  TagOut: { collection: 'state-controllers', kinds: [] },
  TargetLifeAdd: { collection: 'state-controllers', kinds: ['behavior', 'compatibility'] },
  MoveContact: { collection: 'triggers', kinds: ['behavior', 'behavior', 'behavior'], syntax: 'nullary', returns: ['int'] },
  AnimElem: { collection: 'triggers', kinds: ['limitation', 'limitation', 'error', 'compatibility'], syntax: 'old_style', returns: ['int'] },
  IfElse: { collection: 'triggers', kinds: ['behavior', 'version_change', 'compatibility'], changes: { 1: 'added' }, syntax: 'special_form', returns: ['int', 'float'] },
  Cond: { collection: 'triggers', kinds: ['behavior', 'version_change', 'version_change'], changes: { 1: 'added', 2: 'fixed' }, syntax: 'special_form', returns: ['int', 'float'] },
  AILevel: { collection: 'triggers', kinds: ['version_change', 'version_change', 'compatibility'], changes: { 0: 'added', 1: 'fixed' }, syntax: 'nullary', returns: ['int'] },
  StandBy: { collection: 'triggers', kinds: [], syntax: 'nullary', returns: ['unknown'] },
  Const: { collection: 'triggers', kinds: [], syntax: 'function', returns: ['int', 'float'] },
};
const name = process.argv[2];
if (!definitions[name]) throw new Error(`Specify one reviewed fixture: ${Object.keys(definitions).join(', ')}`);
const definition = definitions[name];
const target = `src/content/${definition.collection}/${name}.json`;
const doc = readJSON(target);
if (doc.page.engine !== undefined || doc.notes !== undefined) throw new Error(`${name} is already migrated; do not overwrite later edits.`);
if ((doc.version ?? []).length !== definition.kinds.length) throw new Error(`${name}: historical notes changed; re-review the classification.`);
const unverified = { status: 'unverified', basis: [], source_refs: [] };
doc.page.engine = 'mugen';
doc.page.introduced_in = name === 'Cond' ? 'mugen-1.0-rc6' : name === 'AILevel' ? 'mugen-1.0-rc2' : null;
doc.quote.forEach((quote, index) => { if (quote.url) quote.id = `${name.toLowerCase()}-legacy-${index + 1}`; });
const localSources = {};
if (!['Zoom', 'TagIn', 'TagOut', 'StandBy'].includes(name)) {
  for (const version of ['1.0', '1.1b1']) {
    const anchor = name === 'IfElse' ? 'ifelse-math' : name === 'Cond' ? 'cond-math' : name === 'AnimElem' ? 'animelem' : name.toLowerCase();
    const id = `${name.toLowerCase()}-local-${version}`;
    doc.quote.push({ id, title: `${name} — 保存済み Elecbyte ${version} 公式資料`, url: `/MUGEN/document/Official/${version}/${definition.collection === 'triggers' ? 'trigger' : 'sctrls'}.html#${anchor}`, source_type: 'official_document' });
    localSources[version] = id;
  }
}
const official = (...versions) => ({ status: 'confirmed', basis: ['official_document'], source_refs: versions.map(version => localSources[version]) });
if (['Cond', 'IfElse', 'AILevel'].includes(name)) doc.quote.push({ id: `${name.toLowerCase()}-history`, title: '保存済み Elecbyte 1.0 更新履歴', url: '/MUGEN/document/Official/1.0/history.html', source_type: 'official_history' });
const history = { status: 'confirmed', basis: ['official_history'], source_refs: [`${name.toLowerCase()}-history`] };
doc.notes = (doc.version ?? []).map((entry, index) => ({
  kind: definition.kinds[index], content: entry.content, legacy_index: index,
  ...(definition.changes?.[index] ? { change: definition.changes[index] } : {}),
  evidence: { ...unverified, source_refs: entry.blockquote ? doc.quote.filter(q => q.url === entry.blockquote).map(q => q.id).filter(Boolean) : [] },
}));
for (const p of doc.parameter ?? []) {
  if (definition.collection !== 'state-controllers') continue;
  p.expression_policy = 'unknown';
  p.load_priority_evidence = legacyLoadPriorityEvidence(p);
  const old = p.default_value?.join(', ') ?? '';
  const text = compactText(parseFragment(old)).replace(/^;\s*/, '');
  if (p.parameter_type === 'required') p.default = [{ kind: 'required', display: '値を指定してください', evidence: unverified }];
  else if (!old || /\?|未検証|未確認|多分/.test(text)) p.default = [{ kind: 'unknown', display: text || '未確認（旧データは空欄）', evidence: unverified }];
  else if (isCnsLiteral(old)) p.default = [{ kind: 'literal', value: old, evidence: unverified }];
  else if (/継承|引き継/.test(text)) p.default = [{ kind: 'inherit', display: text, evidence: unverified }];
  else if (/同じ|同値|場合|なら|Version|解像度|とき|×|\/ 2/.test(text)) p.default = [{ kind: 'derived', display: text, evidence: unverified }];
  else if (/変更なし|変更しない|無効|no change/i.test(text)) p.default = [{ kind: 'none', display: text, evidence: unverified }];
  else if (p.default_value?.length === 1 && old.includes(';') && isCnsLiteral(old.split(';')[0])) p.default = [{ kind: 'literal', value: old.split(';')[0].trim(), display: compactText(parseFragment(old.slice(old.indexOf(';') + 1))).trim(), evidence: unverified }];
  else p.default = [{ kind: 'unknown', display: text, evidence: unverified }];
}
if (name === 'HitDef') {
  doc.notes[1].environment = doc.notes[2].environment = { engine: 'mugen', runtime: ['mugen-1.0'] };
  // The original descriptions carry unresolved conditional/derived values; retain them verbatim.
  doc.parameter.find(p => p.parameter === 'GuardFlag').default = [{ kind: 'none', display: '省略するとガード不可（旧記述）', evidence: unverified }];
  // Reviewed individually: annotations on these literal values do not describe conditional defaults.
  for (const name of ['HitFlag', 'ChainID', 'NoChainID', 'P2StateNo', 'Fall.Recover', 'P1GetP2Facing', 'Down.Bounce']) {
    const p = doc.parameter.find(p => p.parameter === name);
    const [value, ...annotation] = p.default_value[0].split(';');
    p.default = [{ kind: 'literal', value: value.trim(), display: annotation.join(';').trim(), evidence: unverified }];
  }
  for (const name of ['Fall.XVelocity', 'P1Facing', 'P2Facing', 'Snap', '; MinDist', '; MaxDist']) {
    const p = doc.parameter.find(p => p.parameter === name);
    p.default = [{ kind: 'none', display: p.default_value.join(', ').replace(/^;\s*/, ''), evidence: unverified }];
  }
  for (const name of ['HitOnce', 'SparkNo', 'Guard.SparkNo', 'Guard.Dist']) {
    const p = doc.parameter.find(p => p.parameter === name);
    p.default = [{ kind: 'derived', display: compactText(parseFragment(p.default_value.join(', '))).replace(/^;\s*/, ''), evidence: unverified }];
  }
  const p = doc.parameter.find(p => p.parameter === 'P2GetP1State');
  p.default = [{ kind: 'unknown', display: p.default_value[0].replace(/^;\s*/, ''), evidence: unverified }];
}
if (name === 'HitBy') doc.constraints = [
  { kind: 'one_of', parameters: ['value', 'value2'], evidence: official('1.0', '1.1b1') },
  { kind: 'mutually_exclusive', parameters: ['value', 'value2'], evidence: official('1.0', '1.1b1') },
];
if (name === 'VarSet') doc.constraints = [
  { kind: 'one_of', parameters: ['v', '; fv', '; var(番号)', '; fvar(番号)'], description: '整数版・小数版・各代替書式から、使用する書式を選びます。', evidence: official('1.0', '1.1b1') },
  { kind: 'mutually_exclusive', parameters: ['v', '; fv', '; var(番号)', '; fvar(番号)'], evidence: official('1.0', '1.1b1') },
  { kind: 'requires', parameters: ['v', 'value'], description: 'v 形式では整数用 value も指定します。', evidence: official('1.0', '1.1b1') },
  { kind: 'requires', parameters: ['; fv', '; value'], description: 'fv 形式では小数用 value も指定します。', evidence: official('1.0', '1.1b1') },
];
if (name === 'Explod') {
  const env = (runtime, profiles) => ({ engine: 'mugen', runtime, ...(profiles ? { compatibility_profile: profiles } : {}) });
  for (const index of [5, 6, 7, 8]) doc.notes[index].environment = env(['mugen-1.1']);
  doc.notes[8].evidence = { status: 'conflicting', basis: ['official_document'], source_refs: [localSources['1.1b1']] };
  doc.notes.push({ kind: 'deprecated', content: '<p>旧履歴には SuperMove の「廃止」とありますが、1.1 Beta 1 の保存済み公式資料は非推奨パラメーターとして説明しています。記述の違いを保持し、実際の受理・効果はビルドごとに確認する必要があります。</p>', environment: env(['mugen-1.1-b1']), evidence: official('1.1b1') });
  const p = doc.parameter.find(p => p.parameter === 'PosType');
  p.default = [{ kind: 'derived', display: '実行ビルドとキャラクターの mugenversion による', evidence: official('1.1b1') }];
  p.variants = [
    { environment: env(['mugen-1.0-final']), default: [{ kind: 'literal', value: 'P1' }], evidence: official('1.0') },
    { environment: env(['mugen-1.1-b1'], ['mugen-compat-2002', 'mugen-compat-1.0']), default: [{ kind: 'literal', value: 'P1' }], evidence: official('1.1b1') },
    { environment: env(['mugen-1.1-b1'], ['mugen-compat-1.1']), default: [{ kind: 'literal', value: 'None' }], evidence: official('1.1b1') },
  ];
  for (const p of doc.parameter) if (['Space', 'Angle', 'XAngle', 'YAngle', 'ReMapPal', 'BindID'].includes(p.parameter)) p.environment = env(['mugen-1.1']);
  const override = { parameter: 'IgnoreHitPause', value: ['Explodのヒット停止中のアニメーション更新'], type: ['boolean'], description: '<p>Explod のアニメーション更新にも関わる固有パラメーターです。公式1.0・1.1資料の既定値は1ですが、旧ページには省略と明示指定の違いについて未検証の記録があります。共通項目の既定値0を無条件に当てはめず、目的と対象環境を確認してください。</p>', parameter_type: 'optional', expression_policy: 'constant_only', load_priority: ['?'], load_priority_evidence: unverified,
    default: [{ kind: 'unknown', display: '省略と明示指定の差は実機で未検証' }],
    variants: [{ environment: env(['mugen-1.0-final', 'mugen-1.1-b1']), default: [{ kind: 'literal', value: 1 }], evidence: official('1.0', '1.1b1') }],
  };
  doc.parameter.push(override);
}
if (name === 'Zoom') doc.notes.forEach(note => { note.environment = { engine: 'mugen', runtime: ['mugen-1.1-a4'] }; });
if (name === 'TargetLifeAdd') doc.notes[1].environment = { engine: 'ikemen-go' };
if (definition.collection === 'triggers') {
  doc.syntax_kind = definition.syntax;
  doc.return_type = definition.returns;
  doc.arguments = (doc.parameter ?? []).map((p, index) => ({ name: p.parameter, type: p.type, legacy_index: index, expression_policy: name === 'AnimElem' ? (p.parameter === '[oper]' ? 'special_syntax' : 'constant_only') : name === 'Const' ? 'special_syntax' : 'expression' }));
}
if (name === 'MoveContact') {
  doc.variants = [
    { environment: { engine: 'mugen', runtime: ['mugen-dos'] }, return_type: ['int'], description: '旧記述: 0 / 1 の真偽値。対象ビルドの再検証は未実施。', evidence: unverified },
    { environment: { engine: 'mugen', runtime: ['mugen-1.0-final', 'mugen-1.1-b1'] }, return_type: ['int'], description: '接触と経過時間を表す整数カウンター。停止中の扱いは下記の記述を参照。', evidence: official('1.0', '1.1b1') },
  ];
  doc.notes[0].environment = { engine: 'mugen', runtime: ['mugen-dos'] };
  doc.notes[1].environment = { engine: 'mugen', runtime: ['winmugen'] };
  doc.notes[2].environment = { engine: 'mugen', runtime: ['mugen-1.0-final', 'mugen-1.1-b1'] };
  doc.notes[2].evidence = official('1.0', '1.1b1');
}
if (name === 'AnimElem') {
  doc.notes[3].environment = { engine: 'ikemen-go' };
  for (const index of [0, 1, 2]) doc.notes[index].evidence = official('1.0', '1.1b1');
  doc.notes[1].evidence.status = 'probable'; // The detailed expression example also needs parser/runtime verification.
}
if (['IfElse', 'Cond'].includes(name)) {
  doc.notes[0].evidence = official('1.0', '1.1b1');
  doc.notes[0].evidence.status = 'probable'; // Preserve the old assignment examples without claiming they were executed.
  Object.assign(doc.notes[1], { at: 'mugen-1.0-rc6', evidence: history });
  if (name === 'Cond') Object.assign(doc.notes[2], { at: 'mugen-1.0-rc7', evidence: history });
}
if (name === 'AILevel') {
  Object.assign(doc.notes[0], { at: 'mugen-1.0-rc2', evidence: history });
  Object.assign(doc.notes[1], { at: 'mugen-1.0-rc4', evidence: history });
  doc.notes[2].environment = { engine: 'ikemen' };
}
createDocumentSchema(definition.collection, readJSON('src/data/engine-versions.json')).parse(doc);
writeFileSync(pathFromRoot(target), JSON.stringify(doc, null, 2) + '\n');
console.log(`Migrated ${name}; original fields retained, unverified claims not promoted to runtime facts.`);
