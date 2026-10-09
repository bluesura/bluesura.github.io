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
  // Hiding a legacy table must not erase an explicitly supplied public replacement.
  if (documentation.possible_value !== undefined) resolved.possible_value = documentation.possible_value;
  return resolved;
}

// Match only the common parameter names. Do not normalize semicolons or collapse alternative forms.
const publicParameters = (parameters, anchors = {}) => {
  parameters = parameters.map(parameter => Object.hasOwn(anchors, parameter.parameter)
    ? { ...parameter, anchor_index: anchors[parameter.parameter] } : parameter);
  if (!parameters.some(parameter => parameter.visibility === 'internal')) return parameters;
  // Keep the original anchor ordinals when filtering an internal entry between public entries.
  return parameters.flatMap((parameter, index) => parameter.visibility === 'internal' ? [] : [{ ...parameter, anchor_index: parameter.anchor_index ?? index }]);
};
export function effectiveParameters(content, common = []) {
  const parameters = (content.parameter ?? []).map(documentedParameter);
  if (content.category !== 'state') return publicParameters(parameters, content.documentation?.parameter_anchor_indices);
  for (const shared of common) {
    const matches = parameters.flatMap((parameter, index) => parameter.parameter?.toLowerCase() === shared.parameter.toLowerCase() ? [index] : []);
    if (matches.length > 1) throw new Error(`Duplicate common parameter: ${shared.parameter}`);
    if (matches.length) {
      const index = matches[0];
      parameters[index] = { ...documentedParameter(shared), ...parameters[index] };
    } else parameters.push({ ...documentedParameter(shared) });
  }
  return publicParameters(parameters, content.documentation?.parameter_anchor_indices);
}

export function effectiveArguments(content) {
  const parameters = (content.parameter ?? []).map(documentedParameter);
  if (content.arguments === undefined) return publicParameters(parameters, content.documentation?.parameter_anchor_indices);
  const used = new Set(content.arguments.map(argument => argument.legacy_index).filter(index => index !== undefined));
  const migrated = content.arguments.map(argument => ({
    ...(argument.legacy_index !== undefined ? parameters[argument.legacy_index] : {}),
    ...argument, parameter: argument.name,
  }));
  return publicParameters([...migrated, ...parameters.filter((_, index) => !used.has(index))], content.documentation?.parameter_anchor_indices);
}
