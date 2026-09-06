// Match only the common parameter names. Do not normalize semicolons or collapse alternative forms.
export function effectiveParameters(content, common = []) {
  const parameters = [...(content.parameter ?? [])];
  if (content.category !== 'state') return parameters;
  for (const shared of common) {
    const matches = parameters.flatMap((parameter, index) => parameter.parameter?.toLowerCase() === shared.parameter.toLowerCase() ? [index] : []);
    if (matches.length > 1) throw new Error(`Duplicate common parameter: ${shared.parameter}`);
    if (matches.length) {
      const index = matches[0];
      parameters[index] = { ...shared, ...parameters[index] };
    } else parameters.push({ ...shared });
  }
  return parameters;
}

export function effectiveArguments(content) {
  if (content.arguments === undefined) return content.parameter ?? [];
  const used = new Set(content.arguments.map(argument => argument.legacy_index).filter(index => index !== undefined));
  const migrated = content.arguments.map(argument => ({
    ...(argument.legacy_index !== undefined ? content.parameter?.[argument.legacy_index] : {}),
    ...argument, parameter: argument.name,
  }));
  return [...migrated, ...(content.parameter ?? []).filter((_, index) => !used.has(index))];
}
