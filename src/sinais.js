// Sinais instantâneos: falas críticas do cliente reconhecidas localmente, sem esperar a IA.
// Cada sinal segue a doutrina do Mentor 2.0. `ctx` traz o que já se sabe (ficha CRM).

const validou = (crm) => !!(crm.causa_raiz && crm.impacto);

export const SINAIS = [
  {
    id: 'preco',
    re: /quanto (custa|fica|é|seria|sai)|\bpre[cç]o\b|\bvalor(es)?\b|investimento|t[áa] caro|muito caro|or[cç]amento|cabe no (caixa|bolso)|desconto/i,
    gerar: (ctx) => (validou(ctx.crm)
      ? { titulo: 'Travou em preço', nivel: 'alta', dica: 'Ordem da doutrina: quanto cabe no caixa, depois descer de plano, só depois desconto.', diga: 'Quanto cabe no caixa por mês hoje, pra eu te mostrar o caminho certo?', acao: 'precos' }
      : { titulo: 'Pediu preço cedo', nivel: 'alta', dica: 'Causa e impacto ainda não estão validados. Valor agora vira comparação de preço.', diga: 'Já chego no valor. Antes, me ajuda a dimensionar: quanto isso custa pra vocês hoje por mês?', acao: 'precos' }),
  },
  {
    id: 'socio',
    re: /\b(s[óo]ci[oa]|meu marido|minha esposa|diretoria|financeiro|meu chefe|aprovar com)\b/i,
    gerar: () => ({ titulo: 'Decisor oculto', nivel: 'alta', dica: 'Risco obrigatório. Inclua o decisor e marque a conversa de decisão antes de encerrar.', diga: 'Além de você, quem mais precisa estar confortável com essa decisão? Vamos marcar com essa pessoa junto ainda esta semana?' }),
  },
  {
    id: 'continuacao',
    re: /vou pensar|te aviso|a gente se fala|manda (a|uma) proposta|me manda (a proposta|por e-?mail|no whats)|vou ver (isso|aqui|com)|vou analisar|vou testar|depois eu (vejo|te falo)/i,
    gerar: () => ({ titulo: 'Continuação, não avanço', nivel: 'alta', dica: 'Sem checkpoint isso não é avanço. Peça microdecisão, responsável e data.', diga: 'Combinado. Pra não ficar solto: o que precisa ficar claro pra você decidir, e quando a gente conversa de novo? Quinta às 15h funciona?' }),
  },
  {
    id: 'sistema',
    re: /j[áa] (tenho|tem|uso|usa|temos|usamos|trabalho com|trabalha com|trabalhamos com) (um |uma |o |a )?(sistema|crm|ferramenta|plataforma|software|outro)/i,
    gerar: () => ({ titulo: '"Já tenho sistema"', nivel: 'media', dica: 'Investigue uso, adoção, integração e o problema não resolvido. Não ataque o concorrente.', diga: 'Legal. E o que ele ainda não resolve pra vocês hoje?' }),
  },
  {
    id: 'tempo',
    re: /n[ãa]o tenho tempo|sem tempo|muita correria|n[ãa]o d[áa] pra implantar|n[ãa]o tenho gente/i,
    gerar: () => ({ titulo: 'Capacidade de execução', nivel: 'media', dica: 'Descubra quem assume, o que priorizar e se o momento é realista. Não prometa implantação sem esforço.', diga: 'Faz sentido. Se a gente seguir, quem do seu time poderia tocar isso com você?' }),
  },
  {
    id: 'desejo',
    re: /monitoramento|relat[óo]rio|rentabilizar (a |minha )?base|acompanhar as usinas/i,
    gerar: () => ({ titulo: 'Pode ser desejo, não dor', nivel: 'media', dica: 'Desejo pode esperar. Puxe para o resultado e para a via comercial.', diga: 'E isso ajuda em quê no seu resultado: vender mais, reter cliente ou ganhar indicação?' }),
  },
  {
    id: 'aceite',
    re: /pode marcar|t[áa] marcado|fechado\b|combinado\b|vamos fechar|bora fechar|pode mandar o contrato|manda o contrato|pode agendar|d[áa] sim,? (pode|marca)/i,
    gerar: () => ({ titulo: 'Microdecisão aceita', nivel: 'alta', dica: 'Confirme em voz alta responsável, data, horário e canal. Avanço só com os três.', diga: 'Perfeito. Então fica assim: eu te mando o convite agora pra esse horário, com você e quem mais precisa decidir. Certo?' }),
  },
  {
    id: 'compra',
    re: /como (funciona|seria) (a |o )?(implanta|contrat|come[çc])|quando (come[çc]a|daria pra come[çc]ar|consigo come[çc]ar)|qual o pr[óo]ximo passo|como a gente faz pra/i,
    gerar: () => ({ titulo: 'Sinal de compra', nivel: 'alta', dica: 'Peça a microdecisão agora, com responsável e data.', diga: 'Ótimo. Então vamos definir o próximo passo: quem precisa aprovar e até quando a gente fecha essa definição?' }),
  },
];

// Detecta sinais numa fala do cliente. Evita repetir o mesmo sinal em menos de `janelaMs`.
export function detectar(texto, ctx, ultimos, agora = Date.now(), janelaMs = 60000) {
  const achados = [];
  for (const s of SINAIS) {
    if (!s.re.test(texto)) continue;
    if (ultimos[s.id] && agora - ultimos[s.id] < janelaMs) continue;
    ultimos[s.id] = agora;
    achados.push({ id: s.id, ...s.gerar(ctx), fala: texto });
  }
  return achados;
}
