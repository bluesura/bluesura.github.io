import { readdirSync, readFileSync } from 'node:fs';
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
