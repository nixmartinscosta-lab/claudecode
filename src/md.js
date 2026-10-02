// Markdown simples e seguro (sem innerHTML): títulos, listas, negrito, tabelas,
// marcadores de evidência e números em destaque.

const EV_RE = /(\[(?:INFERÊNCIA|INFERENCIA|VALIDAR|DADO NÃO INFORMADO|DADO NAO INFORMADO|CONTRADIÇÃO DE FONTE|CONTRADICAO DE FONTE)\])/i;
const EV_CLASS = (t) => (/INFER/i.test(t) ? 'ev-inf' : /VALIDAR/i.test(t) ? 'ev-val' : /CONTRADI/i.test(t) ? 'ev-con' : 'ev-dni');
const NUM_RE = /(R\$\s?\d+(?:[.,]\d+)*(?:\s?(?:mil|milhões|milhão|k)\b)?|\d+(?:[.,]\d+)*(?:\s?(?:%|mil\b|milhões\b|milhão\b|k\b))?)/gi;

function text(node, t) {
  t.split(EV_RE).forEach((chunk, j) => {
    if (!chunk) return;
    if (j % 2 === 1) { const s = document.createElement('span'); s.className = `ev ${EV_CLASS(chunk)}`; s.textContent = chunk.slice(1, -1); node.append(s); return; }
    chunk.split(NUM_RE).forEach((part, i) => {
      if (!part) return;
      if (i % 2 === 1) { const m = document.createElement('mark'); m.className = 'num'; m.textContent = part; node.append(m); }
      else node.append(document.createTextNode(part));
    });
  });
}
export function inline(node, t) {
  t.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) { const b = document.createElement('strong'); text(b, part.slice(2, -2)); node.append(b); }
    else if (part) text(node, part);
  });
  return node;
}
const mk = (tag) => document.createElement(tag);
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export function renderMarkdown(box, md) {
  box.innerHTML = '';
  const lines = (md || '').split('\n');
  let ul = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      ul = null;
      const wrap = mk('div'); wrap.style.overflowX = 'auto';
      const t = mk('table'); const tr = mk('tr');
      cells(line).forEach((c) => tr.append(inline(mk('th'), c)));
      const thead = mk('thead'); thead.append(tr); t.append(thead);
      const tb = mk('tbody');
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { const r = mk('tr'); cells(lines[i]).forEach((c) => r.append(inline(mk('td'), c))); tb.append(r); i++; }
      i--; t.append(tb); wrap.append(t); box.append(wrap);
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { ul = null; box.append(inline(mk(m[1].length >= 3 ? 'h4' : 'h3'), m[2])); continue; }
    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) {
      if (!ul) { ul = mk('ul'); box.append(ul); }
      ul.append(inline(mk('li'), line.replace(/^\s*([-*•]|\d+[.)])\s+/, '')));
      continue;
    }
    ul = null;
    if (line.trim() && !/^-{3,}$/.test(line.trim())) box.append(inline(mk('p'), line));
  }
}

// Seção "follow-up" (título com a palavra follow) da resposta.
export function followUp(md) {
  const m = (md || '').match(/#+[^\n]*follow[^\n]*\n([\s\S]*?)(?=\n#+\s|$)/i);
  return m ? m[1].trim() : '';
}
