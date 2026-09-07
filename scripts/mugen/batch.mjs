import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './files.mjs';
import { createDocumentSchema } from '../../src/lib/mugen/schema.mjs';

export const hashText = text => createHash('sha256').update(text.replaceAll('\r\n', '\n')).digest('hex');
export function loadPlan(batch, directory = root) {
  assert.match(batch ?? '', /^[a-z][a-z0-9-]*$/, 'An explicit --batch ID is required.');
  const plan = JSON.parse(readFileSync(resolve(directory, `scripts/mugen/plans/${batch}.json`), 'utf8'));
  assert.equal(plan.id, batch);
  assert.ok(plan.documents.length > 0 && plan.documents.length <= 5, 'Keep batches to 1–5 reviewed documents.');
  const seen = new Set();
  for (const entry of plan.documents) {
    assert.ok(['state-controllers', 'triggers'].includes(entry.collection));
    assert.match(entry.name, /^[A-Za-z][A-Za-z0-9]*$/);
    assert.ok(!seen.has(entry.name), `Duplicate target: ${entry.name}`);
    seen.add(entry.name);
  }
  return plan;
}

// Plans only add keys or append array entries. Existing prose/metadata cannot be overwritten.
export function addFields(original, additions) {
  const result = structuredClone(original);
  for (const { path, value } of additions) {
    assert.ok(Array.isArray(path) && path.length > 0, 'An addition needs a nonempty path.');
    assert.ok(path.every(key => (typeof key === 'string' || Number.isInteger(key)) && !['__proto__', 'prototype', 'constructor'].includes(key)), 'Invalid path.');
    let parent = result;
    for (const key of path.slice(0, -1)) {
      assert.ok(parent && typeof parent === 'object' && Object.hasOwn(parent, key), `Missing parent: ${path.join('/')}`);
      parent = parent[key];
    }
    assert.ok(parent && typeof parent === 'object', 'Invalid parent.');
    const key = path.at(-1);
    if (Array.isArray(parent)) {
      assert.equal(key, '-', 'Existing array entries cannot be overwritten.');
      parent.push(structuredClone(value));
    } else {
      assert.ok(!Object.hasOwn(parent, key), `Refusing to overwrite ${path.join('/')}`);
      parent[key] = structuredClone(value);
    }
  }
  return result;
}

export function parseArguments(args) {
  const options = { targets: [], apply: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--apply') { assert.ok(!options.apply, 'Duplicate --apply.'); options.apply = true; }
    else if (arg === '--batch') { assert.equal(options.batch, undefined, 'Duplicate --batch.'); options.batch = args[++i]; }
    else if (arg === '--target') options.targets.push(args[++i]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  assert.match(options.batch ?? '', /^[a-z][a-z0-9-]*$/, 'Specify --batch.');
  assert.ok(options.targets.length > 0, 'Specify each --target explicitly; no all-documents mode exists.');
  assert.equal(new Set(options.targets).size, options.targets.length, 'Duplicate --target.');
  return options;
}

export function runBatch(options, directory = root) {
  const plan = loadPlan(options.batch, directory);
  const read = path => readFileSync(resolve(directory, path), 'utf8');
  const manifest = JSON.parse(read(`tests/mugen/batches/${plan.id}/manifest.json`));
  const registry = JSON.parse(read('src/data/engine-versions.json'));
  const targets = options.targets.map(name => {
    const target = plan.documents.find(entry => entry.name === name);
    assert.ok(target, `Target not in reviewed batch: ${name}`);
    return target;
  });
  assert.ok(targets.length && new Set(options.targets).size === targets.length, 'Explicit unique targets are required.');
  // Prepare and validate every target before any source write.
  const prepared = targets.map(entry => {
    const path = `src/content/${entry.collection}/${entry.name}.json`;
    const raw = read(path);
    const before = JSON.parse(raw);
    const captured = manifest.documents.find(item => item.collection === entry.collection && item.name === entry.name);
    assert.ok(captured, `Missing baseline for ${path}`);
    assert.equal(hashText(read(`tests/mugen/batches/${plan.id}/json/${entry.collection}/${entry.name}.json`)), captured.sha256_lf, `Baseline was modified: ${path}`);
    assert.equal(hashText(raw), captured.sha256_lf, `Source changed or already migrated: ${path}`);
    const after = addFields(before, entry.additions);
    createDocumentSchema(entry.collection, registry).parse(after);
    return { entry, path, raw, after };
  });
  if (options.apply) {
    // Also reject edits that arrived while the other targets were being validated.
    for (const item of prepared) assert.equal(read(item.path), item.raw, `Source changed during preparation: ${item.path}`);
    for (const item of prepared) writeFileSync(resolve(directory, item.path), JSON.stringify(item.after, null, 2) + '\n');
  }
  return {
    batch: plan.id, mode: options.apply ? 'applied' : 'dry-run',
    documents: prepared.map(({ entry, path, after }) => ({
      path, additions: entry.additions.map(op => ({ path: '/' + op.path.join('/'), value: op.value })),
      unmapped_legacy_notes: (after.version ?? []).flatMap((_, i) => after.notes?.some(note => note.legacy_index === i) ? [] : [i]),
      remaining: entry.remaining,
    })),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(runBatch(parseArguments(process.argv.slice(2))), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
