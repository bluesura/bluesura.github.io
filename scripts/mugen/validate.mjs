import { createDocumentSchema, parameterSchema } from '../../src/lib/mugen/schema.mjs';
import { registryIssues } from '../../src/lib/mugen/versions.mjs';
import { documents, readJSON, filesUnder } from './files.mjs';

const registry = readJSON('src/data/engine-versions.json');
const errors = registryIssues(registry);
const entries = documents();
const schemas = new Map();
for (const { collection, path, data } of entries) {
  if (!schemas.has(collection)) schemas.set(collection, createDocumentSchema(collection, registry));
  const result = schemas.get(collection).safeParse(data);
  if (!result.success) for (const issue of result.error.issues) errors.push(`${path}:${issue.path.join('.')} ${issue.message}`);
}
for (const path of filesUnder('src/data/common', '.json')) {
  const result = parameterSchema.safeParse(readJSON(path));
  if (!result.success) errors.push(`${path}: ${result.error.message}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Validated ${entries.length} documents, common parameters and version registry.`);
