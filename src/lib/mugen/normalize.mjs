import { effectiveParameters, effectiveArguments } from './parameters.mjs';

// Publication is an editorial decision, independent of evidence status.
export const isPublicNote = note => note.kind !== 'research' && note.visibility !== 'internal';
export const publicNotes = content => effectiveNotes(content).filter(isPublicNote);
export const effectiveDescription = content => content.documentation?.description ?? content.description;
export const effectivePageCategory = content => content.documentation?.page_category ?? content.page?.category?.[1];
export const publicImages = content => (content.images ?? []).filter(image => image.visibility !== 'internal');
export const publicCodeSamples = content => (content.code_sample ?? []).filter(sample => sample.visibility !== 'internal');
export const publicQandA = content => (content.qanda ?? []).filter(item => item.visibility !== 'internal');

export function effectiveNotes(content) {
  const notes = content.notes ?? [];
  const mapped = new Map(notes.filter(note => note.legacy_index !== undefined).map(note => [note.legacy_index, note]));
  const legacy = (content.version ?? []).map((entry, index) => {
    const note = mapped.get(index);
    return note ? { ...note, legacy: entry } : { content: entry.content, legacy: entry };
  });
  return [...legacy, ...notes.filter(note => note.legacy_index === undefined)];
}
export function normalizeDocument(content, common = []) {
  const { documentation, ...fields } = content;
  const pageCategory = effectivePageCategory(content);
  const page = documentation?.page_category
    ? { ...fields.page, category: [...(fields.page?.category ?? []).slice(0, 1), pageCategory] }
    : fields.page;
  return {
    ...fields,
    ...(fields.page !== undefined ? { page } : {}),
    description: effectiveDescription(content),
    ...(content.images !== undefined ? { images: publicImages(content) } : {}),
    ...(content.code_sample !== undefined ? { code_sample: publicCodeSamples(content) } : {}),
    ...(content.qanda !== undefined ? { qanda: publicQandA(content) } : {}),
    parameter: content.category === 'trigger' ? effectiveArguments(content) : effectiveParameters(content, common),
    resolvedNotes: effectiveNotes(content),
  };
}
