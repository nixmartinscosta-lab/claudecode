// Lê a tabela de preços da política (seção da régua de descontos) dos .md da base.
// Estrutura esperada: "# Grupo" → "## Plano" → "Valor-base: **R$ X**" → "- Condição: **R$ Y**".

export function acharPolitica(docs = []) {
  return docs.find((d) => /preco|preço|politica|política/i.test(d.name) && /Valor-base/i.test(d.content))
    || docs.find((d) => /Valor-base/i.test(d.content));
}

export function lerPrecos(doc) {
  if (!doc) return { grupos: [], condicoes: [] };
  const grupos = [];
  const condicoes = [];
  let grupo = null;
  let item = null;
  // Só entra item com Valor-base (marca da tabela oficial) e com condições.
  const fechaItem = () => { if (item && item.base && Object.keys(item.cond).length) grupo.itens.push(item); item = null; };
  for (const raw of doc.content.split('\n')) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^#\s+(.+)$/))) {
      fechaItem();
      grupo = { nome: m[1].replace(/\*/g, '').trim(), itens: [] };
      grupos.push(grupo);
    } else if ((m = line.match(/^##\s+(.+)$/))) {
      fechaItem();
      if (grupo) item = { nome: m[1].replace(/\*/g, '').trim(), base: '', cond: {} };
    } else if (item && (m = line.match(/^Valor-base:\s*\**\s*(R\$\s*[\d.,]+)/i))) {
      item.base = m[1];
    } else if (item && (m = line.match(/^[-*]\s*([^:]+):\s*\**\s*(R\$\s*[\d.,]+)/))) {
      item.cond[m[1].trim()] = m[2];
    }
  }
  fechaItem();
  const validos = grupos.filter((g) => g.itens.length);
  validos.forEach((g) => g.itens.forEach((i) => Object.keys(i.cond).forEach((c) => { if (!condicoes.includes(c)) condicoes.push(c); })));
  return { grupos: validos, condicoes };
}
