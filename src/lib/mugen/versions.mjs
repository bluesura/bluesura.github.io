export function versionIndex(registry) {
  return new Map(['engines', 'families', 'builds', 'compatibility_profiles'].flatMap(group => (registry[group] ?? []).map(item => [item.id, { ...item, group }])));
}
export function versionLabel(id, registry) {
  return versionIndex(registry).get(id)?.label ?? id;
}
export function environmentLabel(environment, registry) {
  if (!environment) return '';
  return [environment.engine, ...(environment.runtime ?? []), ...(environment.compatibility_profile ?? [])]
    .filter(Boolean).map(id => versionLabel(id, registry)).join(' / ');
}
export function registryIssues(registry) {
  const issues = [];
  const seen = new Set();
  const index = versionIndex(registry);
  for (const group of ['engines', 'families', 'builds', 'compatibility_profiles']) {
    for (const item of registry[group] ?? []) {
      if (seen.has(item.id)) issues.push(`Duplicate registry ID: ${item.id}`);
      seen.add(item.id);
      if (item.engine && index.get(item.engine)?.group !== 'engines') issues.push(`Unknown engine: ${item.id} → ${item.engine}`);
      if (group === 'builds' && (index.get(item.family)?.group !== 'families' || index.get(item.family)?.engine !== item.engine)) issues.push(`Invalid family: ${item.id} → ${item.family}`);
      for (const key of ['build_date', 'public_date']) {
        const date = new Date(item[key]);
        if (item[key] != null && (!/^\d{4}-\d{2}-\d{2}$/.test(item[key]) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== item[key])) issues.push(`Invalid ${key}: ${item.id}`);
      }
    }
  }
  return issues;
}
