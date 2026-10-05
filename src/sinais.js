// Sinais instantâneos: falas críticas do cliente reconhecidas localmente, sem esperar a IA.
// Cada sinal segue a doutrina do Mentor 2.0. `ctx` traz o que já se sabe (ficha CRM).

const validou = (crm) => !!(crm.causa_raiz && crm.impacto);

export const SINAIS = [
  {
    id: 'preco',
    // Só pedido/objeção de preço da SolarZ. "Agregar valor", "briga de preço" ou o orçamento
    // que o integrador faz pro cliente dele não contam.
    re: /\bquanto ([ée] que )?(custa|fica|[ée]|seria|sai|vai ficar|vai sair)\b|qua(l|is) (seria |[ée] )?(o |os )?(valor|pre[cç]o|investimento)(?! que (eu|a gente))|(t[áa]|muito|bem|meio|ficou|ficando) caro\b|(t[áa]|muito|bem) puxado|pesado (pra|para) mim|(tem|teria|rola|consegue|faz|me d[áa]) (um |algum )?desconto|baixar (teu|seu|esse|um pouco (o|esse)) (valor|pre[cç]o)|menor valor|contraproposta|minha proposta [ée]|cabe no (meu )?(caixa|bolso|or[cç]amento)|fora do (meu )?or[cç]amento|valor que voc[êe] (t[áa] )?(me )?cobr|esse valor (de|que)/i,
    gerar: (ctx) => (validou(ctx.crm)
      ? { titulo: 'Travou em preço', nivel: 'alta', dica: 'Ordem da doutrina: quanto cabe no caixa, depois descer de plano, só depois desconto.', diga: 'Quanto cabe no caixa por mês hoje, pra eu te mostrar o caminho certo?', acao: 'precos' }
      : { titulo: 'Pediu preço cedo', nivel: 'alta', dica: 'Causa e impacto ainda não estão validados. Valor agora vira comparação de preço.', diga: 'Já chego no valor. Antes, me ajuda a dimensionar: quanto isso custa pra vocês hoje por mês?', acao: 'precos' }),
  },
  {
    id: 'socio',
    re: /(?<!nem |n[ãa]o [ée] |n[ãa]o tenho )\b(s[óo]ci[oa]|meu marido|minha esposa|diretoria|meu chefe|aprovar com|ver com (o|a) (meu|minha)?)\b/i,
    janela: 300000,
    gerar: () => ({ titulo: 'Decisor oculto', nivel: 'alta', dica: 'Risco obrigatório. Inclua o decisor e marque a conversa de decisão antes de encerrar.', diga: 'Além de você, quem mais precisa estar confortável com essa decisão? Vamos marcar com essa pessoa junto ainda esta semana?' }),
  },
  {
    id: 'continuacao',
    re: /vou pensar|te aviso|a gente se fala|manda (a|uma) proposta|me manda (a proposta|por e-?mail|no whats)|vou ver (isso|aqui|com)|vou analisar|vou digerir|vou testar|depois eu (vejo|te falo)|stand ?by|m[êe]s que vem|pr[óo]ximo m[êe]s|mais (um|uns) m[êe]s|mais pra frente|n[ãa]o [ée] o momento|agora n[ãa]o d[áa]|deixa(r)? pra depois/i,
    gerar: () => ({ titulo: 'Continuação, não avanço', nivel: 'alta', dica: 'Sem checkpoint isso não é avanço. Peça microdecisão, responsável e data.', diga: 'Combinado. Pra não ficar solto: o que precisa ficar claro pra você decidir, e quando a gente conversa de novo? Quinta às 15h funciona?' }),
  },
  {
    id: 'sistema',
    re: /j[áa] (tenho|tem|uso|usa|temos|usamos|trabalho com|trabalha com|trabalhamos com) (um |uma |o |a )?(sistema|crm|ferramenta|plataforma|software|outro)|(pago|uso|usamos|tenho|temos) (um |o |uma )?(crm|software|sistema)\b|j[áa] tem integrado/i,
    janela: 300000,
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
    janela: 600000,
    pular: (ctx) => !!(ctx.crm.dor_literal || ctx.crm.causa_raiz), // dor já achada: desejo não é mais o assunto
    gerar: () => ({ titulo: 'Pode ser desejo, não dor', nivel: 'media', dica: 'Desejo pode esperar. Puxe para o resultado e para a via comercial.', diga: 'E isso ajuda em quê no seu resultado: vender mais, reter cliente ou ganhar indicação?' }),
  },
  {
    id: 'aceite',
    // Só aceite explícito. "Quase fechado" ou "se der certo, tá fechado" não é microdecisão.
    re: /pode marcar|t[áa] marcado|(^|[.!,] ?)(ent[ãa]o )?(t[áa] )?(fechado|combinado)[.!]?$|fica combinado|vamos fechar (ent[ãa]o|hoje|agora)|bora fechar|pode mandar o contrato|manda o contrato|pode agendar|d[áa] sim,? (pode|marca)/i,
    gerar: () => ({ titulo: 'Microdecisão aceita', nivel: 'alta', dica: 'Confirme em voz alta responsável, data, horário e canal. Avanço só com os três.', diga: 'Perfeito. Então fica assim: eu te mando o convite agora pra esse horário, com você e quem mais precisa decidir. Certo?' }),
  },
  {
    id: 'compra',
    re: /como (funciona|seria) (a |o )?(implanta|contrat|come[çc])|quando (a gente )?(come[çc]a|daria pra come[çc]ar|consigo come[çc]ar)\b|qual o pr[óo]ximo passo|como a gente faz pra|(vou|posso|j[áa]) (te )?(fazer|programar|mandar) o pagamento|fa[çc]o o pagamento|programa[çc][ãa]o de pagamento|me manda o (pix|boleto|link)|como (eu )?(pago|fa[çc]o o pagamento)|quero (fazer|fechar) o (anual|plano)/i,
    gerar: () => ({ titulo: 'Sinal de compra', nivel: 'alta', dica: 'Peça a microdecisão agora, com responsável e data.', diga: 'Ótimo. Então vamos definir o próximo passo: quem precisa aprovar e até quando a gente fecha essa definição?' }),
  },
];

// Detecta sinais numa fala do cliente. Evita repetir o mesmo sinal em menos de `janelaMs`.
export function detectar(texto, ctx, ultimos, agora = Date.now(), janelaMs = 60000) {
  const achados = [];
  for (const s of SINAIS) {
    if (!s.re.test(texto) || s.pular?.(ctx)) continue;
    if (ultimos[s.id] && agora - ultimos[s.id] < (s.janela || janelaMs)) continue;
    ultimos[s.id] = agora;
    achados.push({ id: s.id, ...s.gerar(ctx), fala: texto });
  }
  return achados;
}
