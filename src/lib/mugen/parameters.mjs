// Build a display view without changing the retained legacy text or copying evidence into the view fields.
function documentedParameter(parameter) {
  const { documentation, ...fields } = parameter;
  if (!documentation) return parameter;
  const resolved = {
    ...fields,
    ...(documentation.value !== undefined ? { value: documentation.value } : {}),
    ...(documentation.type !== undefined ? { type: documentation.type } : {}),
    ...(documentation.description !== undefined ? { description: documentation.description } : {}),
    ...(documentation.parameter_type !== undefined ? { parameter_type: documentation.parameter_type } : {}),
  };
  for (const field of documentation.hide_legacy ?? []) delete resolved[field];
  return resolved;
}

// Match only the common parameter names. Do not normalize semicolons or collapse alternative forms.
const publicParameters = parameters => {
  if (!parameters.some(parameter => parameter.visibility === 'internal')) return parameters;
  // Keep the original anchor ordinals when filtering an internal entry between public entries.
  return parameters.flatMap((parameter, index) => parameter.visibility === 'internal' ? [] : [{ ...parameter, anchor_index: index }]);
};
export function effectiveParameters(content, common = []) {
  const parameters = (content.parameter ?? []).map(documentedParameter);
  if (content.category !== 'state') return publicParameters(parameters);
  for (const shared of common) {
    const matches = parameters.flatMap((parameter, index) => parameter.parameter?.toLowerCase() === shared.parameter.toLowerCase() ? [index] : []);
    if (matches.length > 1) throw new Error(`Duplicate common parameter: ${shared.parameter}`);
    if (matches.length) {
      const index = matches[0];
      parameters[index] = { ...documentedParameter(shared), ...parameters[index] };
    } else parameters.push({ ...documentedParameter(shared) });
  }
  return publicParameters(parameters);
}

export function effectiveArguments(content) {
  const parameters = (content.parameter ?? []).map(documentedParameter);
  if (content.arguments === undefined) return publicParameters(parameters);
  const used = new Set(content.arguments.map(argument => argument.legacy_index).filter(index => index !== undefined));
  const migrated = content.arguments.map(argument => ({
    ...(argument.legacy_index !== undefined ? parameters[argument.legacy_index] : {}),
    ...argument, parameter: argument.name,
  }));
  return publicParameters([...migrated, ...parameters.filter((_, index) => !used.has(index))]);
}
