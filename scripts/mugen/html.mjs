import { parse, serializeOuter } from 'parse5';

export function attr(node, name) {
  return node.attrs?.find(attribute => attribute.name === name)?.value;
}
export function findAll(node, predicate) {
  return [ ...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => findAll(child, predicate)) ];
}
export function textContent(node) {
  if (node.nodeName === '#text') return node.value;
  if (['script', 'style'].includes(node.tagName)) return '';
  return (node.childNodes ?? []).map(textContent).join('');
}
export const compactText = node => textContent(node).replace(/\s+/g, ' ').trim();
export function readArticle(html) {
  const document = parse(html);
  const main = findAll(document, n => attr(n, 'id') === 'main-inner')[0];
  if (!main) throw new Error('Missing #main-inner');
  const section = id => findAll(main, n => attr(n, 'id') === id)[0];
  const code = section('DefaultParameter');
  return {
    html: serializeOuter(main),
    text: compactText(main),
    sections: findAll(main, n => n.tagName === 'section' && attr(n, 'id')).map(n => attr(n, 'id')),
    links: findAll(main, n => n.tagName === 'a').map(n => ({ text: compactText(n), href: attr(n, 'href') ?? '' })),
    media: findAll(main, n => ['img', 'source', 'iframe'].includes(n.tagName)).map(n => attr(n, 'src')),
    code: code ? findAll(code, n => n.tagName === 'li').map(n => textContent(n).trim()) : [],
  };
}
