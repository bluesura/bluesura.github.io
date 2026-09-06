import { z } from 'astro/zod';
import { versionIndex } from './versions.mjs';

const id = z.string().min(1);
const strings = z.array(z.string());
export const environmentSchema = z.object({
  engine: id,
  runtime: z.array(id).optional(),
  compatibility_profile: z.array(id).optional(),
}).strict();
export const evidenceSchema = z.object({
  status: z.enum(['confirmed', 'probable', 'unverified', 'conflicting']),
  basis: z.array(z.enum(['official_document', 'official_history', 'runtime_test', 'community_documentation', 'reverse_engineering', 'source_code', 'cross_version_test', 'maintainer_report'])),
  comment: z.string().optional(),
  tested_on: z.array(id).optional(),
  source_refs: z.array(id).optional(),
}).strict().superRefine((value, ctx) => {
  if (value.status === 'confirmed' && !value.basis.length) {
    ctx.addIssue({ code: 'custom', path: ['basis'], message: 'Confirmed evidence requires a basis.' });
  }
  if (value.status === 'confirmed' && value.basis.some(b => !['runtime_test', 'cross_version_test', 'maintainer_report'].includes(b)) && !value.source_refs?.length) {
    ctx.addIssue({ code: 'custom', path: ['source_refs'], message: 'Confirmed documentary evidence requires source references.' });
  }
  if (value.status === 'confirmed' && value.basis.some(b => ['runtime_test', 'cross_version_test'].includes(b)) && !value.tested_on?.length) {
    ctx.addIssue({ code: 'custom', path: ['tested_on'], message: 'Confirmed runtime tests require tested build IDs.' });
  }
});
const contextual = { environment: environmentSchema.optional(), evidence: evidenceSchema.optional() };
const literalSchema = z.object({ kind: z.literal('literal'), value: z.union([z.string(), z.number().finite()]), display: z.string().optional(), ...contextual }).strict();
const semanticDefault = kind => z.object({ kind: z.literal(kind), display: z.string().min(1), ...contextual }).strict();
export const defaultSchema = z.array(z.union([literalSchema, ...['inherit', 'derived', 'required', 'none', 'unknown'].map(semanticDefault)])).min(1);
export const expressionPolicySchema = z.enum(['expression', 'constant_only', 'string_literal', 'special_syntax', 'unknown']);
const constraintSchema = z.object({
  kind: z.enum(['one_of', 'mutually_exclusive', 'requires', 'effective_when', 'alias']),
  parameters: z.array(id).min(1),
  description: z.string().optional(),
  ...contextual,
}).strict();
const noteShape = {
  kind: z.enum(['behavior', 'version_change', 'bug', 'warning', 'error', 'compatibility', 'undocumented', 'research', 'deprecated', 'limitation']),
  content: z.string().min(1),
  visibility: z.enum(['public', 'internal']).optional(),
  change: z.enum(['added', 'changed', 'fixed', 'removed', 'deprecated']).optional(),
  at: id.optional(), message: z.string().optional(), condition: z.string().optional(),
  // Explicit correspondence preserves unconverted legacy entries without rendering a migrated entry twice.
  legacy_index: z.number().int().nonnegative().optional(),
  ...contextual,
};
export const noteSchema = z.object(noteShape).strict().superRefine((value, ctx) => {
  if (value.kind === 'research' && value.visibility === 'public') ctx.addIssue({ code: 'custom', path: ['visibility'], message: 'Research is internal. Publish an edited behavior/bug/etc. note after review.' });
  if (value.kind === 'version_change' && !value.change) ctx.addIssue({ code: 'custom', path: ['change'], message: 'version_change requires change.' });
  if (value.kind !== 'version_change' && (value.change || value.at)) ctx.addIssue({ code: 'custom', message: 'change / at belong to version_change.' });
});
const notes = z.array(noteSchema);
const argumentSchema = z.object({
  name: id, type: strings, description: z.string().optional(),
  expression_policy: expressionPolicySchema.optional(),
  // For an incremental migration, retain legacy argument detail in the original parameter entry.
  legacy_index: z.number().int().nonnegative().optional(),
  parameter_type: z.string().optional(), ...contextual,
}).strict();
const variantSchema = z.object({
  environment: environmentSchema,
  evidence: evidenceSchema.optional(),
  type: strings.optional(), return_type: strings.optional(),
  default: defaultSchema.optional(), description: z.string().optional(),
  possible_value: z.array(z.union([z.string(), strings])).optional(),
  expression_policy: expressionPolicySchema.optional(),
  syntax: strings.optional(),
  syntax_kind: z.enum(['nullary', 'function', 'old_style', 'special_form']).optional(),
  arguments: z.array(argumentSchema).optional(),
}).strict();
const additions = {
  ...contextual, expression_policy: expressionPolicySchema.optional(),
  constraints: z.array(constraintSchema).optional(),
  variants: z.array(variantSchema).optional(),
  notes: notes.optional(),
};
export const parameterSchema = z.object({
  parameter: z.string(), type: strings.optional(), value: strings.optional(),
  parameter_type: z.string().optional(), default_value: strings.optional(),
  load_priority: strings.optional(),
  default: defaultSchema.optional(), load_priority_evidence: evidenceSchema.optional(),
  ...additions,
}).passthrough();
const quoteSchema = z.object({
  id: id.optional(), title: z.string(), url: z.string(),
  source_type: z.enum(['official_document', 'official_history', 'community_documentation', 'forum_or_log', 'personal_research', 'source_code', 'archive', 'other']).optional(),
}).passthrough();

export function createDocumentSchema(collection, registry) {
  if (collection === 'lifebars') return z.object({ group: z.string().optional() }).passthrough();
  const key = collection === 'state-controllers' ? 'state' : 'trigger';
  return z.object({
    [key]: z.string(),
    page: z.object({ engine: id.optional(), introduced_in: id.nullable().optional() }).passthrough(),
    parameter: z.array(parameterSchema).optional(),
    quote: z.array(quoteSchema).optional(),
    return_type: strings.optional(),
    syntax_kind: z.enum(['nullary', 'function', 'old_style', 'special_form']).optional(),
    arguments: z.array(argumentSchema).optional(),
    ...additions,
  }).passthrough().superRefine((doc, ctx) => {
    const add = (path, message) => ctx.addIssue({ code: 'custom', path, message });
    const index = versionIndex(registry);
    const sources = new Set();
    for (const [i, quote] of (doc.quote ?? []).entries()) if (quote.id) {
      if (sources.has(quote.id)) add(['quote', i, 'id'], `Duplicate source ID: ${quote.id}`);
      sources.add(quote.id);
    }
    const checkRef = (value, path, groups, engine) => {
      const target = index.get(value);
      if (!target || !groups.includes(target.group)) add(path, `Unknown or inappropriate version ID: ${value}`);
      else if (engine && target.engine !== engine) add(path, `Engine mismatch: ${value} is not ${engine}`);
    };
    if (doc.page.engine) checkRef(doc.page.engine, ['page', 'engine'], ['engines']);
    if (doc.page.introduced_in) checkRef(doc.page.introduced_in, ['page', 'introduced_in'], ['builds'], doc.page.engine);
    const walk = (value, path = [], inheritedEngine = doc.page.engine) => {
      if (!value || typeof value !== 'object') return;
      const engine = value.environment?.engine ?? inheritedEngine;
      if (value.environment) {
        const env = value.environment;
        checkRef(env.engine, [...path, 'environment', 'engine'], ['engines']);
        for (const [i, ref] of (env.runtime ?? []).entries()) checkRef(ref, [...path, 'environment', 'runtime', i], ['families', 'builds'], env.engine);
        for (const [i, ref] of (env.compatibility_profile ?? []).entries()) checkRef(ref, [...path, 'environment', 'compatibility_profile', i], ['compatibility_profiles'], env.engine);
      }
      for (const field of ['evidence', 'load_priority_evidence']) if (value[field]) {
        for (const [i, ref] of (value[field].source_refs ?? []).entries()) if (!sources.has(ref)) add([...path, field, 'source_refs', i], `Unknown source: ${ref}`);
        for (const [i, ref] of (value[field].tested_on ?? []).entries()) checkRef(ref, [...path, field, 'tested_on', i], ['builds'], engine);
      }
      if (value.kind === 'version_change' && value.at) checkRef(value.at, [...path, 'at'], ['builds'], engine);
      if (value.notes) {
        const used = new Set();
        for (const [i, note] of value.notes.entries()) if (note.legacy_index !== undefined) {
          if (!value.version?.[note.legacy_index]) add([...path, 'notes', i, 'legacy_index'], 'No corresponding legacy version entry.');
          if (used.has(note.legacy_index)) add([...path, 'notes', i, 'legacy_index'], 'Legacy entry mapped more than once.');
          used.add(note.legacy_index);
        }
      }
      if (value.arguments) {
        const used = new Set();
        for (const [i, argument] of value.arguments.entries()) if (argument.legacy_index !== undefined) {
          if (!value.parameter?.[argument.legacy_index]) add([...path, 'arguments', i, 'legacy_index'], 'No corresponding legacy parameter.');
          if (used.has(argument.legacy_index)) add([...path, 'arguments', i, 'legacy_index'], 'Legacy argument mapped more than once.');
          used.add(argument.legacy_index);
        }
      }
      if (value.constraints) {
        const names = new Set((doc.parameter ?? []).map(p => p.parameter));
        for (const [i, c] of value.constraints.entries()) for (const [j, name] of c.parameters.entries()) if (!names.has(name)) add([...path, 'constraints', i, 'parameters', j], `Unknown parameter: ${name}`);
      }
      for (const [key, child] of Object.entries(value)) {
        if (Array.isArray(child)) child.forEach((item, i) => walk(item, [...path, key, i], engine));
        else if (child && typeof child === 'object') walk(child, [...path, key], engine);
      }
    };
    walk(doc);
  });
}
