import { effectiveParameters, effectiveArguments } from './parameters.mjs';

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
  return {
    ...content,
    parameter: content.category === 'trigger' ? effectiveArguments(content) : effectiveParameters(content, common),
    resolvedNotes: effectiveNotes(content),
  };
}
