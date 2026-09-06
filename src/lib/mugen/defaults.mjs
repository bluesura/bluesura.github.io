export const defaultLabels = { inherit: '継承', derived: '他の設定から決定', required: '必須', none: '既定値なし', unknown: '未確認' };
export function describeDefault(parameter) {
  if (parameter.default !== undefined) return parameter.default.map(item => item.kind === 'literal' ? String(item.value) + (item.display ? ` (${item.display})` : '') : item.display).join(', ');
  return parameter.default_value?.join(', ') ?? '';
}
export function isCnsLiteral(value) {
  // This only recognizes literal tokens, never arithmetic expressions or documentation placeholders.
  const atom = String.raw`(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[a-zA-Z_][a-zA-Z_0-9]*|"(?:[^"\\\r\n]|\\[^\r\n])*")`;
  return new RegExp(`^${atom}(?:\\s*,\\s*${atom})*$`).test(String(value).trim());
}
function singleLine(value) {
  return String(value).replace(/[\r\n]+/g, ' ');
}
export function parameterLine(parameter, content = {}) {
  const name = singleLine(parameter.parameter ?? '');
  const label = describeDefault(parameter);
  const conditional = (content.constraints ?? []).some(c => c.parameters.includes(name)) || parameter.constraints?.length;
  const variantDefault = parameter.variants?.some(v => v.default !== undefined);
  const scopedDefault = parameter.environment || parameter.default?.some(d => d.environment);
  const inactive = name.trimStart().startsWith(';') || parameter.parameter_type === 'instead' || conditional;
  const canonical = parameter.default;
  let value = canonical?.every(item => item.kind === 'literal') ? canonical.map(item => String(item.value)).join(', ') : undefined;
  if (canonical === undefined) value = parameter.default_value?.join(', ');
  const active = !inactive && !variantDefault && !scopedDefault && parameter.parameter_type !== 'required' && value !== undefined && isCnsLiteral(value);
  if (active) return `${name.padEnd(27)}= ${singleLine(value)}`;
  const reason = variantDefault || scopedDefault ? '適用環境を確認' : conditional || inactive ? '代替書式・条件を確認' : parameter.parameter_type === 'required' ? '必須: 値を指定してください' : '省略時';
  // Keep original annotations visible, but never leave an empty/derived assignment active.
  return `; ${name.replace(/^\s*;\s*/, '').padEnd(25)}=        ; ${reason}${label ? `: ${singleLine(label)}` : ': 未確認'}`;
}
export function copyLines(content, parameters) {
  const lines = content.category === 'state' ? [`[State 0, ${content.state}]`, `Type                       = ${content.state}`, 'Trigger1                   = 1'] : [];
  return [...lines, ...parameters.filter(parameter => parameter.parameter).map(parameter => parameterLine(parameter, content))];
}
