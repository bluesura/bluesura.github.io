import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const pathFromRoot = (...parts) => resolve(root, ...parts);
export const readJSON = path => JSON.parse(readFileSync(pathFromRoot(path), 'utf8'));
export function filesUnder(directory, extension) {
  return readdirSync(pathFromRoot(directory), { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? filesUnder(path, extension) : path.endsWith(extension) ? [path] : [];
  }).sort();
}
export const collections = { 'state-controllers': 'State', triggers: 'Trigger', lifebars: 'Lifebar' };
export function documents() {
  return Object.entries(collections).flatMap(([collection, route]) => filesUnder(`src/content/${collection}`, '.json').map(path => ({
    collection, path, data: readJSON(path),
    url: `/MUGEN/document/${route}/${relative(pathFromRoot('src/content', collection), pathFromRoot(path)).replaceAll('\\', '/').replace(/\.json$/, '.html')}`,
  })));
}
export const fixtures = {
  'state-controllers': ['Helper', 'HitDef', 'VarSet', 'HitBy', 'Explod', 'Zoom', 'TagIn', 'TagOut', 'TargetLifeAdd', 'A', 'C', 'L', 'S', 'U'],
  triggers: ['MoveContact', 'AnimElem', 'IfElse', 'Cond', 'AILevel', 'StandBy', 'Const'],
  lifebars: ['BeginAction', 'LifeBar', 'Round'],
};

// Later batches have separate snapshots; never replace the initial 24-page baseline.
export function baselineCases() {
  const initial = Object.entries(fixtures).flatMap(([collection, names]) => names.map(name => ({ collection, name, base: 'tests/mugen/baseline' })));
  const directory = 'tests/mugen/batches';
  const batches = existsSync(pathFromRoot(directory)) ? filesUnder(directory, '/manifest.json').flatMap(path =>
    readJSON(path).documents.map(({ collection, name }) => ({ collection, name, base: path.slice(0, -'/manifest.json'.length) })),
  ) : [];
  const seen = new Set();
  for (const entry of [...initial, ...batches]) {
    const key = `${entry.collection}/${entry.name}`;
    if (seen.has(key)) throw new Error(`Duplicate baseline: ${key}`);
    seen.add(key);
  }
  return [...initial, ...batches];
}
