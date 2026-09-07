import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, basename, join } from 'node:path';
import { createHash } from 'node:crypto';
import { addFields, loadPlan, parseArguments, runBatch, hashText } from '../../scripts/mugen/batch.mjs';
import { pathFromRoot, readJSON } from '../../scripts/mugen/files.mjs';
import { parameterLine } from '../../src/lib/mugen/defaults.mjs';

const batch = 'axis-motion-01';
const plan = loadPlan(batch);
const targets = plan.documents.map(entry => entry.name);
const sourcePath = name => `src/content/state-controllers/${name}.json`;
const baselinePath = name => `tests/mugen/batches/${batch}/json/state-controllers/${name}.json`;
function workspace(t) {
  const directory = mkdtempSync(join(tmpdir(), 'mugen-batch-test-'));
  t.after(() => {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith('mugen-batch-test-'));
    rmSync(directory, { recursive: true, force: true });
  });
  const copy = (from, to = from) => {
    mkdirSync(dirname(resolve(directory, to)), { recursive: true });
    copyFileSync(pathFromRoot(from), resolve(directory, to));
  };
  copy(`scripts/mugen/plans/${batch}.json`);
  copy(`tests/mugen/batches/${batch}/manifest.json`);
  copy('src/data/engine-versions.json');
  for (const name of targets) { copy(baselinePath(name)); copy(baselinePath(name), sourcePath(name)); }
  return directory;
}

test('dry-run never changes source files and requires reviewed explicit targets', t => {
  const directory = workspace(t);
  const options = parseArguments(['--batch', batch, '--target', 'PosAdd', '--target', 'PosSet']);
  assert.equal(options.apply, false);
  const before = targets.map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8'));
  const report = runBatch(options, directory);
  assert.equal(report.mode, 'dry-run');
  assert.equal(report.documents.length, 2);
  assert.ok(report.documents[1].remaining.some(item => item.path.includes('description')));
  assert.deepEqual(targets.map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8')), before);
  assert.throws(() => parseArguments(['--batch', batch]), /--target/);
  assert.throws(() => parseArguments(['--batch', batch, '--all']), /Unknown argument/);
  assert.throws(() => runBatch({ batch, targets: ['Helper'], apply: true }, directory), /not in reviewed batch/);
});

test('an edited final target aborts the whole batch before any source is written', t => {
  const directory = workspace(t);
  const last = resolve(directory, sourcePath('VelSet'));
  const edited = JSON.parse(readFileSync(last, 'utf8'));
  edited.description += '<p>管理者による編集中の記述</p>';
  writeFileSync(last, JSON.stringify(edited));
  const before = targets.map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8'));
  assert.throws(() => runBatch({ batch, targets, apply: true }, directory), /Source changed or already migrated/);
  assert.deepEqual(targets.map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8')), before);
});

test('apply only changes selected documents, and replay cannot overwrite them', t => {
  const directory = workspace(t);
  const untouched = targets.slice(1).map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8'));
  const options = { batch, targets: ['PosAdd'], apply: true };
  assert.equal(runBatch(options, directory).mode, 'applied');
  const migrated = readFileSync(resolve(directory, sourcePath('PosAdd')), 'utf8');
  assert.equal(JSON.parse(migrated).page.engine, 'mugen');
  assert.throws(() => runBatch(options, directory), /Source changed or already migrated/);
  assert.equal(readFileSync(resolve(directory, sourcePath('PosAdd')), 'utf8'), migrated);
  assert.deepEqual(targets.slice(1).map(name => readFileSync(resolve(directory, sourcePath(name)), 'utf8')), untouched);
});

test('additive plans cannot replace existing metadata, array entries or prototype keys', () => {
  const original = { page: { version: '不明' }, parameter: [{ parameter: 'X' }] };
  assert.throws(() => addFields(original, [{ path: ['page', 'version'], value: '1.0' }]), /overwrite/);
  assert.throws(() => addFields(original, [{ path: ['parameter', 0], value: {} }]), /array entries/);
  assert.throws(() => addFields(original, [{ path: ['__proto__'], value: {} }]), /Invalid path/);
  assert.deepEqual(original, { page: { version: '不明' }, parameter: [{ parameter: 'X' }] });
});

test('new baselines match the original corpus and preserve Set versus Add defaults', () => {
  const original = readJSON('tests/mugen/baseline/manifest.json').documents;
  const manifest = readJSON(`tests/mugen/batches/${batch}/manifest.json`);
  for (const entry of plan.documents) {
    const raw = readFileSync(pathFromRoot(baselinePath(entry.name)), 'utf8');
    const captured = manifest.documents.find(item => item.name === entry.name);
    assert.equal(hashText(raw), captured.sha256_lf);
    const lf = raw.replaceAll('\r\n', '\n');
    const hashes = [raw, lf, lf.replaceAll('\n', '\r\n')].map(text => createHash('sha256').update(text).digest('hex'));
    assert.ok(hashes.includes(original.find(item => item.path === sourcePath(entry.name)).sha256));
    const migrated = addFields(JSON.parse(raw), entry.additions);
    for (const parameter of migrated.parameter) {
      const line = parameterLine(parameter);
      if (entry.name === 'PosAdd') assert.match(line, /^[XY]\s+= 0$/);
      else { assert.match(line, /^; [XY]\s+=/); assert.ok(line.includes('変更しない')); }
      assert.equal(parameter.load_priority_evidence.status, 'confirmed');
    }
    if (entry.name.startsWith('Pos')) {
      assert.equal(migrated.notes.find(note => note.legacy_index === 0).kind, 'research');
      assert.ok(migrated.notes.some(note => note.kind === 'behavior' && note.content.includes('小数')));
    }
  }
});
