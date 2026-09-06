// Maintainer clarification on 2026-09-07: existing known priorities are verified results.
// No build ID is invented, and entries containing '?' remain unresolved.
export function legacyLoadPriorityEvidence(parameter) {
  return parameter.load_priority?.length && parameter.load_priority.every(value => value.trim() && !value.includes('?'))
    ? { status: 'confirmed', basis: ['maintainer_report'], comment: '既存の読み込み順は基本的に検証済みとの管理者確認（2026-09-07）。検証ビルド等の詳細は未記録。' }
    : { status: 'unverified', basis: [], source_refs: [] };
}
