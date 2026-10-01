// src/prompts.js
var SYSTEM_PROMPT = `Voc\xEA \xE9 o copiloto estrat\xE9gico de um CLOSER (o "usu\xE1rio") durante uma reuni\xE3o de venda ao vivo. Voc\xEA escuta a transcri\xE7\xE3o e sussurra no ouvido dele o que fazer agora.

Quem \xE9 quem na transcri\xE7\xE3o:
- "Voc\xEA" = o closer.
- Qualquer outro nome (vindo das legendas do Google Meet) ou "Participante N" = cliente e demais pessoas. Use o nome da pessoa nas frases sugeridas.
- A transcri\xE7\xE3o \xE9 autom\xE1tica (legendas): pode ter palavras erradas, nomes trocados e frases cortadas. Interprete pelo sentido.

DOUTRINA
Se houver BASE DE CONHECIMENTO abaixo, ela \xE9 a doutrina oficial e manda em tudo: m\xE9todo (ex.: ACR \u2014 Analisar, Conectar, Reativar), estrutura da reuni\xE3o, port\xF5es da decis\xE3o, tratamento de obje\xE7\xF5es, roteiro de apresenta\xE7\xE3o, crit\xE9rios de avan\xE7o e limites \xE9ticos. Respeite quem \xE9 "dono" de cada assunto (campo dono_de / nao_e_fonte_de): PRE\xC7O, plano, desconto, limite e composi\xE7\xE3o saem SOMENTE da pol\xEDtica de pre\xE7os, com o valor oficial exato para a condi\xE7\xE3o (mensal, anual parcelado, anual \xE0 vista). Nunca invente n\xFAmero, desconto, case ou promessa. PROVA SOCIAL s\xF3 com as formula\xE7\xF5es do arquivo de prova social aprovada, citando data do snapshot, tamanho da amostra e o limite metodol\xF3gico \u2014 e s\xF3 depois de a dor estar validada. Follow-up, canais e prazos seguem o arquivo de cad\xEAncia. Se a informa\xE7\xE3o n\xE3o estiver na base, diga "confirmar internamente".
N\xE3o trabalhe o port\xE3o seguinte antes de fechar o atual. N\xE3o deixe o closer apresentar solu\xE7\xE3o antes de a dor e a causa-raiz estarem validadas pelo cliente. N\xE3o aceite o pedido do cliente como diagn\xF3stico.

COMO RESPONDER (o closer tem TDAH e l\xEA de relance, no meio da fala):
- Curto, direto, acion\xE1vel. Sem introdu\xE7\xE3o, sem explicar o \xF3bvio.
- "proximo_passo": UMA a\xE7\xE3o para os pr\xF3ximos 30\u201360 s, no imperativo.
- "diga": frase pronta, natural, em portugu\xEAs falado, para ler em voz alta agora. Vazia se o melhor \xE9 ficar calado e ouvir.
- "perguntas": at\xE9 3 perguntas que avan\xE7am o diagn\xF3stico/decis\xE3o e ainda n\xE3o foram respondidas (use as perguntas do m\xE9todo quando couber).
- "alertas": at\xE9 3 \u2014 gaps de risco, obje\xE7\xE3o n\xE3o tratada, decisor oculto, solu\xE7\xE3o antes da dor, continua\xE7\xE3o disfar\xE7ada de avan\xE7o, pre\xE7o dito errado, promessa arriscada, closer falando demais. Vazio se nada importante.
- "info_chave": S\xD3 fatos NOVOS desde a \xFAltima an\xE1lise que valem anotar e n\xE3o cabem na ficha CRM (n\xFAmeros da opera\xE7\xE3o, base instalada, vendas/m\xEAs, time, ferramentas atuais, prazos). Formato "R\xF3tulo: valor". N\xE3o repita.
- "crm": ficha do CRM sendo preenchida ao vivo. Preencha SOMENTE os campos que ganharam informa\xE7\xE3o nova ou melhor nesta an\xE1lise; os demais, string vazia (o painel guarda o que j\xE1 foi preenchido). "dor_literal" \xE9 a frase do cliente entre aspas. "proxima_acao" inclui respons\xE1vel e data quando houver.
- "rota": a solu\xE7\xE3o que voc\xEA recomenda NESTE momento (combo, composi\xE7\xE3o ou plano), o motivo ligado \xE0 causa-raiz e o investimento oficial da pol\xEDtica de pre\xE7os para a condi\xE7\xE3o mais prov\xE1vel. Deixe tudo vazio enquanto a dor/causa-raiz n\xE3o estiver validada \u2014 n\xE3o antecipe solu\xE7\xE3o.
- "movimento": fase atual da reuni\xE3o.
- "etapa": detalhe da fase em poucas palavras (ex.: "aprofundando causa", "quantificando impacto", "slide rota recomendada", "pedindo microdecis\xE3o").
- "portao": o port\xE3o da decis\xE3o que est\xE1 travando agora.
- "falta_cobrir": at\xE9 4 itens obrigat\xF3rios do m\xE9todo/checklist que ainda N\xC3O apareceram e s\xE3o necess\xE1rios antes de avan\xE7ar (ex.: "Causa-raiz validada pelo cliente", "Decisor ausente mapeado", "Capacidade de execu\xE7\xE3o", "Microdecis\xE3o + respons\xE1vel + data").
- "frases_importantes": frases LITERAIS NOVAS do integrador que valem ouro (dor, desejo, n\xFAmero, crit\xE9rio, sinal de compra), entre aspas, curtas. S\xF3 as novas desde a \xFAltima an\xE1lise.
- "objecoes": as obje\xE7\xF5es do integrador que est\xE3o ABERTAS agora (ainda n\xE3o contornadas). Para cada uma: "objecao" (curta, nas palavras dele) e "contorno" (frase pronta para falar j\xE1, seguindo o tratamento de obje\xE7\xF5es do playbook \u2014 voltar \xE0 causa-raiz/impacto, nunca desconto para compensar diagn\xF3stico fraco). Lista vazia se n\xE3o h\xE1 obje\xE7\xE3o aberta.
- "sintese": a f\xF3rmula de diagn\xF3stico do m\xE9todo preenchida com o que j\xE1 se sabe: "O cliente quer [resultado], mas hoje est\xE1 em [situa\xE7\xE3o]. Ele percebe [dor], por\xE9m a causa priorit\xE1ria \xE9 [causa-raiz]. Isso provoca [impacto]. Portanto, a solu\xE7\xE3o \xE9 [solu\xE7\xE3o], desde que [pr\xE9-requisitos]." Onde ainda n\xE3o h\xE1 informa\xE7\xE3o, mantenha o marcador entre colchetes, ex.: "[causa-raiz?]". Curta.
- "temperatura": 0 a 100 \u2014 qu\xE3o perto o integrador est\xE1 de comprar AGORA (dor validada, impacto, decisor, interesse, obje\xE7\xF5es). "temperatura_motivo": o porqu\xEA em at\xE9 8 palavras.
- "destaque": a descoberta mais importante desta an\xE1lise em at\xE9 12 palavras (vai para a linha do tempo). Vazio se nada relevante.
- "conducao": nota 0\u201310 de como o closer est\xE1 conduzindo AT\xC9 AGORA segundo o m\xE9todo e os gaps acima (escuta, perguntas, cliente concluindo, rota \xFAnica, fechamento com data). "conducao_dica": a corre\xE7\xE3o mais importante em at\xE9 10 palavras.
- "urgencia": "alta" se o closer precisa responder/agir AGORA (pergunta direta, obje\xE7\xE3o, pedido de pre\xE7o, decis\xE3o em jogo); "media" se h\xE1 oportunidade clara; "baixa" se \xE9 s\xF3 ouvir.

ROTEAMENTO (siga o playbook; confirme limites e valores SEMPRE na pol\xEDtica de pre\xE7os):
- Eleja UMA alavanca principal (volume, qualifica\xE7\xE3o, convers\xE3o, ticket, margem, capacidade, base instalada). O porte define capacidade; a causa-raiz define a camada de solu\xE7\xE3o. Ferramenta organiza; servi\xE7o acompanha mudan\xE7a e execu\xE7\xE3o.
- Causa em processo, gest\xE3o, previsibilidade ou execu\xE7\xE3o COMERCIAL \u2192 Growth (ou Acelera\xE7\xE3o acoplada a Start/Connect/Core).
- Base instalada \xE9 a maior alavanca E o comercial est\xE1 saud\xE1vel \u2192 Business (ou Gest\xE3o de P\xF3s-venda acoplada).
- Comercial e base precisam de interven\xE7\xE3o ao mesmo tempo \u2192 Scale (ou composi\xE7\xE3o com os dois servi\xE7os).
- S\xF3 organiza\xE7\xE3o de tecnologia/atendimento \u2192 Lite/Start; ferramenta em crescimento com padroniza\xE7\xE3o \u2192 Connect/Core.
- N\xE3o force p\xF3s-venda como solu\xE7\xE3o principal quando a venda nova est\xE1 abaixo da meta; n\xE3o force comercial quando o gargalo \xE9 entrega.
- Ao apresentar investimento: rota recomendada, investimento vigente, o que est\xE1 inclu\xEDdo, condi\xE7\xE3o relevante (anual parcelado/\xE0 vista, implementa\xE7\xE3o isenta em combos e anuais) e pr\xF3ximo passo. Uma rota com for\xE7a \u2014 nunca dois caminhos com o mesmo peso; a alternativa s\xF3 entra se uma restri\xE7\xE3o mudar.
- Restri\xE7\xE3o de dinheiro: descubra se o bloqueio \xE9 caixa, prioridade ou d\xFAvida de retorno. Se for real, ajuste a rota explicando o que deixa de ser resolvido ("vender o mesmo plano de forma diferente"); downsell n\xE3o \xE9 derrota.

OBJE\xC7\xD5ES (contorno = seguir o playbook):
- "Est\xE1 caro / sem budget": valide sem concordar, descubra se \xE9 caixa, prioridade ou retorno, retome causa e impacto, condi\xE7\xF5es oficiais, ajuste a rota se a restri\xE7\xE3o for real.
- "J\xE1 tenho sistema": investigue uso, integra\xE7\xE3o, ado\xE7\xE3o, visibilidade e o problema n\xE3o resolvido; n\xE3o ataque o concorrente.
- "Sem tempo para implantar": trate capacidade de execu\xE7\xE3o (quem assume, o que priorizar).
- "Preciso pensar / falar com s\xF3cio": o que exatamente precisa ser pensado, qual crit\xE9rio falta; inclua o decisor e marque a conversa de decis\xE3o ANTES de encerrar.
- "Quero testar": o que o teste precisa provar \u2014 hip\xF3tese, prazo, respons\xE1vel, crit\xE9rio.
- "S\xF3 queria a ferramenta": n\xE3o recuse a porta; entenda o problema por tr\xE1s; se ferramenta resolve, recomende ferramenta.

GAPS DESTE CLOSER (apontados pela gestora \u2014 vigie e corrija AO VIVO, via "alertas" e "diga"):
1. Conforto no p\xF3s-venda e pr\xE9-julgamento de bolso: ele tende a ir para p\xF3s-venda e a supor que o cliente n\xE3o pode pagar Growth. Voc\xEA n\xE3o sabe o que vai vender at\xE9 fazer o diagn\xF3stico. Sempre investigue a via comercial (pergunta-m\xE3e: "Voc\xEA est\xE1 chegando aonde quer chegar? Quer vender mais ou est\xE1 satisfeito com o tamanho atual?"). Quem decide se consegue investir \xE9 o cliente.
2. Dor x desejo: dor COMERCIAL = perde dinheiro todo dia (urg\xEAncia). P\xF3s-venda = deixa de ganhar (adi\xE1vel). Monitoramento/relat\xF3rio pedidos pelo cliente costumam ser DESEJO \u2014 desejo pode esperar. Reposicione para o que gera receita.
3. Concluir pelo cliente: ele costuma afirmar a conclus\xE3o ("no fim voc\xEA quer dinheiro, n\xE9?"). A conclus\xE3o tem que vir do cliente. Em "diga", prefira PERGUNTAS que levem o cliente a concluir, com exemplos de op\xE7\xF5es ("\xE9 para gerar proposta mais r\xE1pido, organizar o processo para achar gargalos, ter dados para decidir?"). Se ele concluir pelo cliente, alerte.
4. N\xE3o antecipar obje\xE7\xE3o que o cliente n\xE3o levantou.
5. Fechamento fraco e follow-up: nunca deixe a reuni\xE3o acabar sem microdecis\xE3o com respons\xE1vel e DATA/HORA concreta, considerando a agenda que o cliente mencionar. "Manda a proposta" sem checkpoint \xE9 continua\xE7\xE3o.
6. Ao vender Acelera\xE7\xE3o/Growth, deixe claro que exige comprometimento do cliente (reuni\xF5es, planejamento, cobrar o time).
7. Condu\xE7\xE3o: conduza com perguntas e escuta; se ele estiver falando demais, monologando ou apresentando antes da dor validada, alerte.

FOCO COMERCIAL: o closer quer vender os COMBOS com servi\xE7o (Business, Growth, Scale) e as composi\xE7\xF5es com Gest\xE3o de P\xF3s-venda e/ou Acelera\xE7\xE3o Comercial. Quando a causa-raiz, o perfil e a capacidade de execu\xE7\xE3o sustentarem, conduza para o combo/composi\xE7\xE3o coerente: ligue o servi\xE7o do combo \xE0 causa-raiz que o cliente validou, mostre o impacto de n\xE3o resolver e pe\xE7a microdecis\xE3o. Se n\xE3o houver ader\xEAncia, n\xE3o force \u2014 recomende a rota correta e avise o closer. Nunca use desconto para compensar diagn\xF3stico fraco.

Se vier "CLOSER MARCOU COMO COBERTO", n\xE3o repita esses itens em falta_cobrir. Se vier "CLOSER CORRIGIU A FICHA", trate esses valores como verdade e n\xE3o os sobrescreva.

Se vier "PEDIDO DO CLOSER", responda a ele com prioridade nos mesmos campos (resposta principal em "diga" e/ou "proximo_passo").`;
var CRM_CAMPOS = {
  resultado_desejado: "Resultado desejado",
  situacao_atual: "Situa\xE7\xE3o atual / gap",
  dor_literal: "Dor (frase literal)",
  causa_raiz: "Sintoma \u2192 causa-raiz",
  impacto: "Impacto e prioridade",
  alavanca: "Alavanca principal",
  decisores: "Decisores (presentes / ausentes)",
  capacidade_execucao: "Capacidade de execu\xE7\xE3o",
  objecao: "Obje\xE7\xE3o",
  proxima_acao: "Pr\xF3xima a\xE7\xE3o (respons\xE1vel + data)"
};
var MOVIMENTOS = ["Abertura", "Analisar", "Conectar", "Apresenta\xE7\xE3o", "Investimento", "Reativar"];
var PORTOES = ["Por que ouvir", "Por que se importar", "Por que mudar", "Por que SolarZ", "Por que agora"];
var str = { type: "string" };
var list = { type: "array", items: str };
var obj = (props) => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(props),
  properties: props
});
var COACH_SCHEMA = obj({
  movimento: { type: "string", enum: MOVIMENTOS },
  etapa: str,
  portao: { type: "string", enum: [...PORTOES, "Indefinido"] },
  urgencia: { type: "string", enum: ["baixa", "media", "alta"] },
  sintese: str,
  frases_importantes: list,
  objecoes: { type: "array", items: obj({ objecao: str, contorno: str }) },
  temperatura: { type: "integer", minimum: 0, maximum: 100 },
  conducao: { type: "integer", minimum: 0, maximum: 10 },
  conducao_dica: str,
  temperatura_motivo: str,
  destaque: str,
  proximo_passo: str,
  diga: str,
  perguntas: list,
  alertas: list,
  falta_cobrir: list,
  info_chave: list,
  crm: obj(Object.fromEntries(Object.keys(CRM_CAMPOS).map((k) => [k, str]))),
  rota: obj({ solucao: str, motivo: str, investimento: str })
});
var MODOS = {
  diagnostico: "Diagn\xF3stico Comercial (at\xE9 90 min): diagn\xF3stico ACR completo, recomenda\xE7\xE3o de solu\xE7\xE3o e pr\xF3ximo passo.",
  ecossistema: "Reuni\xE3o do Ecossistema (at\xE9 60 min): entender ader\xEAncia, conectar o ecossistema ao problema e definir pr\xF3ximo passo. Diagn\xF3stico leve.",
  followup: "Follow-up / reativa\xE7\xE3o: retomar contexto + causa-raiz + impacto e conseguir microdecis\xE3o com respons\xE1vel e data.",
  livre: ""
};
function baseDeConhecimento(docs) {
  if (!docs?.length) return "";
  return [
    "BASE DE CONHECIMENTO (doutrina oficial \u2014 siga \xE0 risca):",
    ...docs.map((d) => `<documento nome="${d.name}">
${d.content}
</documento>`)
  ].join("\n\n");
}
var ORIGENS = {
  prevenda: 'Lead NOVO, reuni\xE3o marcada pela pr\xE9-venda. Primeiro contato do closer: revalide interesse (port\xE3o "Por que ouvir") e conduza o diagn\xF3stico desde o in\xEDcio.',
  avanco: "Reuni\xE3o de AVAN\xC7O marcada pelo pr\xF3prio closer para continuar uma negocia\xE7\xE3o. Retome de onde parou (contexto + causa-raiz + impacto), n\xE3o refa\xE7a o diagn\xF3stico do zero, trate o bloqueio atual e busque microdecis\xE3o com respons\xE1vel e data."
};
function contextoInicial(setup, leadDocs2 = []) {
  const linhas = [
    "CONTEXTO DA REUNI\xC3O",
    `Origem: ${ORIGENS[setup.origem] || ORIGENS.prevenda}`,
    `Objetivo do closer: ${setup.objetivo || "(n\xE3o informado \u2014 conduza para uma decis\xE3o ou microdecis\xE3o com respons\xE1vel e data)"}`
  ];
  if (MODOS[setup.modo]) linhas.push(`Tipo de reuni\xE3o: ${MODOS[setup.modo]}`);
  if (setup.comQuem) linhas.push(`Cliente / participantes: ${setup.comQuem}`);
  if (setup.foco) linhas.push(`Foco comercial desta reuni\xE3o: ${setup.foco}`);
  if (setup.notas) linhas.push(`Informa\xE7\xF5es da pr\xE9-venda / hip\xF3teses:
${setup.notas}`);
  if (leadDocs2.length) {
    linhas.push(
      "DOSSI\xCA DO LEAD (conversas, registros e hist\xF3rico \u2014 use para entender perfil, contexto, o que j\xE1 foi dito, obje\xE7\xF5es anteriores e compromissos; preencha o mapa e a ficha com o que j\xE1 se sabe, marcando que veio do hist\xF3rico):",
      ...leadDocs2.map((d) => `<arquivo nome="${d.name}">
${d.content}
</arquivo>`)
    );
  }
  return linhas.join("\n");
}
var PEDIDO_BRIEFING = 'BRIEFING INICIAL (a reuni\xE3o est\xE1 come\xE7ando, ainda sem fala relevante): com base no contexto e no dossi\xEA, preencha a ficha CRM e o mapa com o que J\xC1 se sabe do lead, monte a linha do racioc\xEDnio com as lacunas, diga em "proximo_passo" como abrir a reuni\xE3o e em "diga" a frase de abertura personalizada; em "perguntas" as 3 primeiras perguntas para fechar as lacunas; em "alertas" riscos vindos do hist\xF3rico (obje\xE7\xF5es anteriores, decisor oculto, promessas feitas). Em "destaque" resuma o perfil do lead em 12 palavras.';
var PEDIDO_ATA = `A reuni\xE3o acabou. Escreva em Markdown, portugu\xEAs, curto e escane\xE1vel:

## Resultado da reuni\xE3o
Classifique: Avan\xE7o (a\xE7\xE3o + respons\xE1vel + data), Continua\xE7\xE3o (inten\xE7\xE3o vaga), Perda ou Reciclagem \u2014 e justifique em 1 linha.

## Registro para o CRM
Preencha cada campo obrigat\xF3rio do CRM conforme a base (resultado desejado, situa\xE7\xE3o atual e gap, frase literal da dor, sintoma e causa-raiz, impacto e prioridade, est\xE1gio da dor, alavanca principal, solu\xE7\xE3o recomendada e motivo, obje\xE7\xE3o, decisores presentes e ausentes, capacidade de execu\xE7\xE3o, pr\xF3xima a\xE7\xE3o, respons\xE1vel, data e canal, risco, pr\xF3ximo \xE2ngulo, crit\xE9rio de perda ou reciclagem). Use "n\xE3o levantado" quando n\xE3o apareceu.

## S\xEDntese de diagn\xF3stico
Use a f\xF3rmula de diagn\xF3stico do m\xE9todo.

## Mensagem de follow-up pronta
F\xF3rmula: contexto + causa-raiz + impacto + microdecis\xE3o + data. Tom de WhatsApp, pronta para copiar. Indique canal e prazo do pr\xF3ximo toque conforme a cad\xEAncia.

## Auditoria do closer
Checklist do m\xE9todo (Analisar / Conectar / Reativar): o que foi feito, o que faltou. Avalie tamb\xE9m os gaps conhecidos deste closer (conforto no p\xF3s-venda, concluir pelo cliente, antecipar obje\xE7\xE3o, dois caminhos, fechamento e follow-up) com evid\xEAncia da transcri\xE7\xE3o. Nota de condu\xE7\xE3o 0\u201310. Gaps de risco com evid\xEAncia, impacto e corre\xE7\xE3o. 2 acertos e 2 ajustes para a pr\xF3xima.

Use s\xF3 o que aparece na transcri\xE7\xE3o, no contexto e na base. N\xE3o use JSON aqui.`;

// src/coach.js
var API = "https://generativelanguage.googleapis.com/v1beta/models";
function limparSchema(s) {
  if (Array.isArray(s)) return s.map(limparSchema);
  if (s && typeof s === "object") {
    const o = {};
    for (const [k, v] of Object.entries(s)) if (k !== "additionalProperties") o[k] = limparSchema(v);
    return o;
  }
  return s;
}
var SCHEMA = limparSchema(COACH_SCHEMA);
var Coach = class {
  constructor(settings, setup, docs, leadDocs2 = []) {
    this.leadDocs = leadDocs2;
    this.settings = settings;
    this.setup = setup;
    this.system = [SYSTEM_PROMPT, baseDeConhecimento(docs)].filter(Boolean).join("\n\n");
    this.contents = [];
    this.busy = false;
    this.semThinking = false;
    this.semSchema = false;
  }
  body(userText, json) {
    const generationConfig = { maxOutputTokens: 16384 };
    if (json) {
      generationConfig.responseMimeType = "application/json";
      if (!this.semSchema) generationConfig.responseJsonSchema = SCHEMA;
    }
    if (!this.semThinking && this.settings.thinking) {
      generationConfig.thinkingConfig = { thinkingLevel: this.settings.thinking };
    }
    let system = this.system;
    if (json && this.semSchema) system += `

Responda SOMENTE com JSON neste schema:
${JSON.stringify(SCHEMA)}`;
    return {
      systemInstruction: { parts: [{ text: system }] },
      contents: [...this.contents, { role: "user", parts: [{ text: userText }] }],
      generationConfig
    };
  }
  async call(userText, json) {
    const model = this.settings.model || "gemini-3.5-flash";
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      let res;
      try {
        res = await fetch(`${API}/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": this.settings.geminiKey },
          body: JSON.stringify(this.body(userText, json))
        });
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data;
      const msg = data.error?.message || `HTTP ${res.status}`;
      if (res.status === 400 && /thinking/i.test(msg) && !this.semThinking) {
        this.semThinking = true;
        continue;
      }
      if (res.status === 400 && /schema/i.test(msg) && !this.semSchema) {
        this.semSchema = true;
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      throw new Error(msg);
    }
    throw new Error("Gemini indispon\xEDvel no momento, tentando de novo na pr\xF3xima an\xE1lise.");
  }
  async send(userText, json) {
    if (this.busy) return null;
    this.busy = true;
    try {
      const data = await this.call(userText, json);
      const cand = data.candidates?.[0];
      if (!cand?.content?.parts) {
        throw new Error(`Gemini n\xE3o respondeu (${cand?.finishReason || data.promptFeedback?.blockReason || "sem conte\xFAdo"}).`);
      }
      this.contents.push({ role: "user", parts: [{ text: userText }] });
      this.contents.push(cand.content);
      const text = cand.content.parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("");
      return { text, usage: data.usageMetadata };
    } finally {
      this.busy = false;
    }
  }
  // newLines: [{speaker, text}] desde a última análise. pedido: pergunta livre do closer.
  async analyze(newLines, pedido, notas = []) {
    const partes = [];
    if (!this.contents.length) partes.push(contextoInicial(this.setup, this.leadDocs));
    partes.push(
      newLines.length ? `TRANSCRI\xC7\xC3O NOVA (desde a \xFAltima an\xE1lise):
${newLines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}` : "TRANSCRI\xC7\xC3O NOVA: (nada novo)"
    );
    partes.push(...notas);
    if (pedido) partes.push(`PEDIDO DO CLOSER: ${pedido}`);
    const res = await this.send(partes.join("\n\n"), true);
    if (!res) return null;
    const t = res.text;
    const jsonText = t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1);
    try {
      return { data: JSON.parse(jsonText), usage: res.usage };
    } catch {
      throw new Error("Resposta da IA veio em formato inesperado.");
    }
  }
  async ata(restante) {
    const partes = [];
    if (!this.contents.length) partes.push(contextoInicial(this.setup, this.leadDocs));
    if (restante.length) {
      partes.push(`TRANSCRI\xC7\xC3O FINAL:
${restante.map((l) => `${l.speaker}: ${l.text}`).join("\n")}`);
    }
    partes.push(PEDIDO_ATA);
    let res = null;
    while (!res) {
      while (this.busy) await new Promise((r) => setTimeout(r, 300));
      res = await this.send(partes.join("\n\n"), false);
    }
    return res.text;
  }
};

// src/demo.js
var DEMO_SETUP = {
  modo: "diagnostico",
  origem: "prevenda",
  comQuem: "Solar Exemplo (demonstra\xE7\xE3o) \u2014 Marcos (s\xF3cio)",
  objetivo: "Validar causa-raiz e sair com microdecis\xE3o + data",
  foco: "Combos com servi\xE7o, se a causa-raiz justificar",
  notas: "Exemplo fict\xEDcio para demonstra\xE7\xE3o."
};
var DEMO_SCRIPT = [
  [2, "Voc\xEA", "Marcos, obrigado pelo tempo. A ideia hoje \xE9 entender onde voc\xEAs querem chegar e o que est\xE1 segurando isso. Pode ser?"],
  [7, "Marcos", "Pode sim. Na verdade eu vim ver o monitoramento, quero mandar relat\xF3rio pros clientes."],
  [12, "Voc\xEA", "Entendi. E hoje voc\xEAs est\xE3o chegando aonde querem chegar em vendas?"],
  [17, "Marcos", "N\xE3o. A gente fecha uns 6 projetos por m\xEAs e a meta era 12. Lead at\xE9 chega, mas a proposta demora tr\xEAs dias pra sair."],
  [24, "Voc\xEA", "E quando a proposta demora, o que acontece com o cliente?"],
  [29, "Marcos", "Ele fecha com quem respondeu primeiro. M\xEAs passado perdi uns quatro assim, cada um de uns 25 mil."],
  [36, "Marcos", "E n\xE3o tem ningu\xE9m cobrando os vendedores, cada um faz do seu jeito no WhatsApp."],
  [43, "Voc\xEA", "Ent\xE3o o relat\xF3rio resolveria isso ou o ponto \xE9 o processo comercial?"],
  [48, "Marcos", "Pensando bem, o problema \xE9 o comercial. Mas quanto custa isso? N\xE3o sei se cabe agora, t\xE1 caro tudo."],
  [56, "Marcos", "E eu preciso ver com o meu s\xF3cio, o Paulo, ele que cuida do financeiro."],
  [63, "Voc\xEA", "Faz sentido. Quinta \xE0s 15h d\xE1 pra gente conversar com o Paulo junto?"],
  [68, "Marcos", "Quinta \xE0s 15h d\xE1. Pode marcar."]
];
var base = {
  perguntas: [],
  alertas: [],
  falta_cobrir: [],
  info_chave: [],
  frases_importantes: [],
  objecoes: [],
  crm: {},
  rota: { solucao: "", motivo: "", investimento: "" }
};
var crm = (o) => ({
  resultado_desejado: "",
  situacao_atual: "",
  dor_literal: "",
  causa_raiz: "",
  impacto: "",
  alavanca: "",
  decisores: "",
  capacidade_execucao: "",
  objecao: "",
  proxima_acao: "",
  ...o
});
var DEMO_ANALISES = [
  {
    ...base,
    movimento: "Abertura",
    etapa: "revalidando interesse",
    portao: "Por que ouvir",
    urgencia: "media",
    proximo_passo: "Acolha o pedido de monitoramento e investigue o resultado que ele quer.",
    diga: "Marcos, relat\xF3rio pro cliente ajuda em qu\xEA no seu resultado: vender mais, reter, ganhar indica\xE7\xE3o?",
    perguntas: ["Voc\xEA est\xE1 chegando aonde quer chegar em vendas?", "O que te fez buscar isso agora?"],
    alertas: ["Pedido de ferramenta n\xE3o \xE9 diagn\xF3stico: monitoramento costuma ser desejo, n\xE3o dor."],
    falta_cobrir: ["Resultado desejado", "Situa\xE7\xE3o atual e gap", "Decisor"],
    sintese: "O cliente quer [resultado?], mas hoje est\xE1 em [situa\xE7\xE3o?]. Ele percebe [dor?], por\xE9m a causa priorit\xE1ria \xE9 [causa-raiz?].",
    temperatura: 25,
    temperatura_motivo: "curiosidade, dor ainda n\xE3o apareceu",
    conducao: 7,
    conducao_dica: "Boa abertura; agora investigue o resultado",
    destaque: "Chegou pedindo monitoramento (desejo, n\xE3o dor)",
    crm: crm({ situacao_atual: "Busca monitoramento e relat\xF3rio para clientes" })
  },
  {
    ...base,
    movimento: "Analisar",
    etapa: "aprofundando causa",
    portao: "Por que se importar",
    urgencia: "alta",
    proximo_passo: "Aprofunde a demora da proposta: \xE9 a causa que mais derruba a meta.",
    diga: "E quando a proposta demora tr\xEAs dias, o que acontece com esse cliente?",
    perguntas: ["Quantos leads viram proposta por m\xEAs?", "Quem monta a proposta hoje?"],
    alertas: ["N\xE3o volte para monitoramento: a dor comercial apareceu."],
    falta_cobrir: ["Impacto em R$", "Causa-raiz validada pelo cliente", "Decisor"],
    info_chave: ["Vendas: 6 projetos/m\xEAs", "Meta: 12 projetos/m\xEAs", "Proposta leva 3 dias"],
    frases_importantes: ['"a proposta demora tr\xEAs dias pra sair"'],
    sintese: "O cliente quer 12 projetos/m\xEAs, mas hoje est\xE1 em 6. Ele percebe demora na proposta, por\xE9m a causa priorit\xE1ria \xE9 [causa-raiz?]. Isso provoca [impacto?].",
    temperatura: 45,
    temperatura_motivo: "dor comercial apareceu",
    conducao: 8,
    conducao_dica: "\xD3timo: pergunta-m\xE3e trouxe a dor comercial",
    destaque: "Dor comercial: fecha 6 de uma meta de 12",
    crm: crm({ resultado_desejado: "Sair de 6 para 12 projetos/m\xEAs", situacao_atual: "6 projetos/m\xEAs; proposta leva 3 dias", dor_literal: '"a proposta demora tr\xEAs dias pra sair"', alavanca: "Convers\xE3o" })
  },
  {
    ...base,
    movimento: "Conectar",
    etapa: "validando a s\xEDntese",
    portao: "Por que mudar",
    urgencia: "alta",
    proximo_passo: "Devolva a s\xEDntese e deixe ele concluir que o problema \xE9 o processo comercial.",
    diga: "Deixa eu ver se entendi: voc\xEAs querem 12 por m\xEAs, est\xE3o em 6, e cada proposta lenta vira venda do concorrente. O que voc\xEA acha que est\xE1 por tr\xE1s disso?",
    perguntas: ["Quem cobra os vendedores hoje?", "Quanto isso custou no \xFAltimo trimestre?"],
    alertas: ["Deixe o cliente concluir; n\xE3o afirme por ele."],
    falta_cobrir: ["Decisor financeiro", "Capacidade de execu\xE7\xE3o"],
    info_chave: ["Perdeu ~4 vendas no m\xEAs passado", "Ticket m\xE9dio: ~R$ 25 mil"],
    frases_importantes: ['"perdi uns quatro assim, cada um de uns 25 mil"', '"cada um faz do seu jeito no WhatsApp"'],
    sintese: "O cliente quer 12 projetos/m\xEAs, mas hoje est\xE1 em 6. Ele percebe demora na proposta, por\xE9m a causa priorit\xE1ria \xE9 a falta de processo e gest\xE3o comercial. Isso provoca perda de ~R$ 100 mil/m\xEAs em vendas. Portanto, a solu\xE7\xE3o \xE9 [solu\xE7\xE3o?], desde que [pr\xE9-requisitos?].",
    temperatura: 62,
    temperatura_motivo: "impacto quantificado pelo pr\xF3prio cliente",
    conducao: 8,
    conducao_dica: "Impacto veio da boca dele",
    destaque: "Impacto: ~4 vendas perdidas/m\xEAs (~R$ 100 mil)",
    crm: crm({ causa_raiz: "Sem processo nem gest\xE3o comercial (WhatsApp individual, ningu\xE9m cobra)", impacto: "~4 vendas/m\xEAs perdidas, ~R$ 100 mil" })
  },
  {
    ...base,
    movimento: "Investimento",
    etapa: "tratando obje\xE7\xE3o de pre\xE7o",
    portao: "Por que agora",
    urgencia: "alta",
    proximo_passo: "Descubra se o bloqueio \xE9 caixa, prioridade ou retorno; traga o s\xF3cio para a decis\xE3o.",
    diga: "Marcos, antes do valor: o que pesa mais pra voc\xEA, o caixa deste m\xEAs ou a d\xFAvida se vai retornar?",
    perguntas: ["O Paulo consegue entrar numa conversa esta semana?"],
    alertas: ["N\xE3o ofere\xE7a desconto para compensar.", "Decisor oculto: Paulo (financeiro)."],
    falta_cobrir: ["Microdecis\xE3o + respons\xE1vel + data"],
    objecoes: [
      { objecao: "T\xE1 caro, n\xE3o sei se cabe agora", contorno: "Entendo. Voc\xEA perdeu uns R$ 100 mil m\xEAs passado com proposta lenta. O que pesa mais: o caixa deste m\xEAs ou a d\xFAvida se vai retornar?" },
      { objecao: "Preciso ver com meu s\xF3cio", contorno: "Faz todo sentido. O que o Paulo vai querer ver para decidir? Vamos marcar com ele junto ainda esta semana?" }
    ],
    sintese: "O cliente quer 12 projetos/m\xEAs, mas hoje est\xE1 em 6. Ele percebe demora na proposta, por\xE9m a causa priorit\xE1ria \xE9 a falta de processo e gest\xE3o comercial. Isso provoca perda de ~R$ 100 mil/m\xEAs. Portanto, a solu\xE7\xE3o \xE9 o Growth, desde que [o Paulo valide e o Marcos assuma as reuni\xF5es].",
    temperatura: 66,
    temperatura_motivo: "obje\xE7\xE3o de pre\xE7o e decisor ausente",
    conducao: 7,
    conducao_dica: "Traga o Paulo antes de falar de desconto",
    destaque: "Obje\xE7\xF5es: pre\xE7o e s\xF3cio financeiro",
    rota: { solucao: "Growth (Acelera\xE7\xE3o Comercial inclusa)", motivo: "Causa em processo e gest\xE3o comercial", investimento: "Anual parcelado R$ 5.599,20/m\xEAs (pol\xEDtica)" },
    crm: crm({ decisores: "Marcos (s\xF3cio) presente; Paulo (financeiro) ausente", objecao: "Pre\xE7o / precisa do s\xF3cio" })
  },
  {
    ...base,
    movimento: "Reativar",
    etapa: "microdecis\xE3o fechada",
    portao: "Por que agora",
    urgencia: "baixa",
    proximo_passo: "Confirme por escrito: quinta 15h com Marcos e Paulo, pauta e o que o Paulo precisa ver.",
    diga: "Combinado, quinta \xE0s 15h com voc\xEA e o Paulo. Vou levar o c\xE1lculo das vendas perdidas para ele ver.",
    perguntas: [],
    alertas: [],
    falta_cobrir: ["Capacidade de execu\xE7\xE3o (quem assume as reuni\xF5es)"],
    sintese: "O cliente quer 12 projetos/m\xEAs, mas hoje est\xE1 em 6. Ele percebe demora na proposta, por\xE9m a causa priorit\xE1ria \xE9 a falta de processo e gest\xE3o comercial. Isso provoca perda de ~R$ 100 mil/m\xEAs. Portanto, a solu\xE7\xE3o \xE9 o Growth, desde que o Paulo valide e o Marcos assuma as reuni\xF5es.",
    temperatura: 74,
    temperatura_motivo: "microdecis\xE3o com data e decisor",
    conducao: 9,
    conducao_dica: "Fechou com data, hora e decisor",
    destaque: "Avan\xE7o: quinta 15h com Marcos e Paulo",
    rota: { solucao: "Growth (Acelera\xE7\xE3o Comercial inclusa)", motivo: "Causa em processo e gest\xE3o comercial", investimento: "Anual parcelado R$ 5.599,20/m\xEAs (pol\xEDtica)" },
    crm: crm({ proxima_acao: "Reuni\xE3o de decis\xE3o quinta 15h \u2014 Marcos + Paulo (respons\xE1vel: closer)" })
  }
];
var DEMO_ATA = `## Resultado da reuni\xE3o
**Avan\xE7o** \u2014 reuni\xE3o de decis\xE3o marcada para quinta \xE0s 15h com Marcos e Paulo.

## Registro para o CRM
- **Resultado desejado:** sair de 6 para 12 projetos/m\xEAs
- **Frase literal da dor:** "a proposta demora tr\xEAs dias pra sair"
- **Causa-raiz:** sem processo nem gest\xE3o comercial
- **Impacto:** ~4 vendas/m\xEAs perdidas (~R$ 100 mil)
- **Solu\xE7\xE3o recomendada:** Growth (Acelera\xE7\xE3o Comercial inclusa)
- **Decisores:** Marcos presente; Paulo (financeiro) ausente
- **Pr\xF3xima a\xE7\xE3o:** quinta 15h, Marcos + Paulo

## Mensagem de follow-up pronta
Marcos, obrigado pela conversa! Ficou claro que a meta de 12 projetos/m\xEAs est\xE1 travando na velocidade da proposta e na falta de processo comercial (foram ~4 vendas perdidas no m\xEAs passado). Confirmado quinta \xE0s 15h com voc\xEA e o Paulo: levo o c\xE1lculo do impacto e o plano do Growth para voc\xEAs decidirem. At\xE9 l\xE1!

## Auditoria do closer
- **Acertos:** usou a pergunta-m\xE3e e chegou na dor comercial; deixou o cliente quantificar o impacto.
- **Ajustes:** antecipe o decisor financeiro logo na abertura; confirme a capacidade de execu\xE7\xE3o.
- **Nota de condu\xE7\xE3o:** 8/10`;
var DemoCoach = class {
  constructor() {
    this.busy = false;
    this.i = 0;
  }
  async analyze() {
    if (this.busy) return null;
    this.busy = true;
    await new Promise((r) => setTimeout(r, 900));
    this.busy = false;
    const data = DEMO_ANALISES[Math.min(this.i, DEMO_ANALISES.length - 1)];
    this.i++;
    return { data };
  }
  async ata() {
    await new Promise((r) => setTimeout(r, 600));
    return DEMO_ATA;
  }
};

// src/dashboard.js
var $ = (id) => document.getElementById(id);
var SETUP_FIELDS = ["modo", "comQuem", "objetivo", "foco", "notas"];
var DEFAULTS = {
  geminiKey: "",
  deepgramKey: "",
  source: "meet",
  model: "gemini-3.5-flash",
  thinking: "low",
  intervalSec: 25,
  useMic: true,
  dgModel: "nova-2",
  dgLanguage: "pt-BR"
};
var FOCO_PADRAO = "Combos com servi\xE7o (Business, Growth, Scale) ou composi\xE7\xF5es com P\xF3s-venda / Acelera\xE7\xE3o, se a causa-raiz justificar";
var MODO_NOME = { diagnostico: "Diagn\xF3stico Comercial", ecossistema: "Reuni\xE3o do Ecossistema", followup: "Follow-up", livre: "Livre" };
var N_CRM = Object.keys(CRM_CAMPOS).length;
var NEW_MS = 12e3;
var BRANCHES = {
  resultado: { t: "Resultado desejado", side: "right" },
  operacao: { t: "Opera\xE7\xE3o hoje", side: "right" },
  dor: { t: "Dor, nas palavras dele", side: "right" },
  causa: { t: "Causa-raiz", side: "right" },
  impacto: { t: "Impacto", side: "right" },
  decisores: { t: "Decisores e execu\xE7\xE3o", side: "left" },
  objecoes: { t: "Obje\xE7\xF5es e contorno", side: "left" },
  rota: { t: "Rota / combo", side: "left" },
  proximos: { t: "Pr\xF3ximos passos", side: "left" }
};
var MAX_LEAVES = 3;
var freshState = () => ({
  running: false,
  coach: null,
  source: "meet",
  lines: [],
  sentUpTo: 0,
  interim: {},
  startedAt: 0,
  tick: null,
  questionTimer: null,
  sinceAnalysis: 0,
  intervalSec: 25,
  lastAt: 0,
  crm: {},
  crmLocked: /* @__PURE__ */ new Set(),
  covered: /* @__PURE__ */ new Set(),
  pendingNotes: [],
  memoria: [],
  pinned: /* @__PURE__ */ new Set(),
  map: {},
  collapsed: /* @__PURE__ */ new Set(),
  expanded: /* @__PURE__ */ new Set(),
  openObj: [],
  objTotal: 0,
  talk: {},
  qTimes: [],
  talkWarned: false,
  temp: null,
  cond: null,
  drawn: /* @__PURE__ */ new Set(),
  view: { x: 0, y: 0, s: 1 },
  userView: false
});
var state = { ...freshState(), meetTabId: Number(new URLSearchParams(location.search).get("tab")) || null };
var el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.h);
  toast.h = setTimeout(() => {
    t.hidden = true;
  }, 1700);
}
function copy(text, msg = "Copiado \u2714") {
  navigator.clipboard.writeText(text).then(() => toast(msg));
}
function setStatus(text, level = "") {
  const s = $("status");
  s.hidden = !text;
  s.textContent = text || "";
  s.className = `status ${level}`;
}
var fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
var elapsedSec = () => state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1e3) : 0;
function setRing(id, frac, color) {
  const c = $(id);
  const len = 113.1;
  c.style.strokeDashoffset = String(len * (1 - Math.max(0, Math.min(1, frac))));
  if (color) c.style.stroke = color;
}
function bump(id) {
  const k = $(id).closest(".kpi");
  k.classList.remove("bump");
  void k.offsetWidth;
  k.classList.add("bump");
}
function setText(id, v) {
  if ($(id).textContent !== String(v)) {
    $(id).textContent = v;
    return true;
  }
  return false;
}
MOVIMENTOS.forEach((t) => $("movimentos").append(el("li", "", t)));
PORTOES.forEach((t) => $("portoes").append(el("li", "", t)));
document.querySelectorAll(".tabs").forEach((bar) => bar.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  bar.querySelectorAll(".tab").forEach((b) => {
    b.classList.toggle("active", b === btn);
    $(b.dataset.tab).hidden = b !== btn;
  });
  if (btn.dataset.tab === "tTimeline") {
    $("tlCount").hidden = true;
    $("tlCount").textContent = "";
  }
  if (btn.dataset.tab === "tMapa") requestAnimationFrame(() => {
    fitIfAuto();
    drawLinks();
  });
}));
var leadDocs = [];
chrome.storage.local.get(["setup", "docs", "leadDocs"]).then(({ setup, docs, leadDocs: ld }) => {
  if (setup) SETUP_FIELDS.forEach((f) => {
    if (setup[f] != null) $(f).value = setup[f];
  });
  if (setup?.origem) document.querySelector(`input[name="origem"][value="${setup.origem}"]`).checked = true;
  leadDocs = ld || [];
  renderLeadFiles();
  if (!$("foco").value) $("foco").value = FOCO_PADRAO;
  $("kbInfo").textContent = docs?.length ? `${docs.length} arquivo(s) na base` : "Suba seus .md nas configura\xE7\xF5es";
  showContext();
});
SETUP_FIELDS.forEach((f) => $(f).addEventListener("input", showContext));
function renderLeadFiles() {
  const ul = $("leadList");
  ul.innerHTML = "";
  leadDocs.forEach((d, i) => {
    const li = el("li");
    li.append(el("span", "", "\u{1F4C4}"), el("span", "fn", d.name), el("span", "muted", `${Math.max(1, Math.round(d.content.length / 1e3))}k`));
    const x = el("span", "x", "\u2715");
    x.title = "remover";
    x.onclick = () => {
      leadDocs.splice(i, 1);
      saveLead();
    };
    li.append(x);
    ul.append(li);
  });
  $("clearLead").hidden = !leadDocs.length;
}
function saveLead() {
  chrome.storage.local.set({ leadDocs });
  renderLeadFiles();
}
async function addLeadFiles(files) {
  if (!leadDocs.length) chrome.storage.local.set({ leadOwner: $("comQuem").value.trim() });
  for (const f of files) {
    if (f.size > 2e6) {
      toast(`${f.name} \xE9 grande demais (m\xE1x. 2 MB)`);
      continue;
    }
    const content = await f.text();
    const i = leadDocs.findIndex((d) => d.name === f.name);
    if (i >= 0) leadDocs[i] = { name: f.name, content };
    else leadDocs.push({ name: f.name, content });
  }
  saveLead();
  toast(`\u{1F4C2} Dossi\xEA: ${leadDocs.length} arquivo(s)`);
}
$("pickFiles").onclick = (e) => {
  e.preventDefault();
  $("leadFiles").click();
};
$("leadFiles").onchange = (e) => {
  addLeadFiles([...e.target.files]);
  e.target.value = "";
};
$("clearLead").onclick = () => {
  leadDocs = [];
  saveLead();
  chrome.storage.local.remove("leadOwner");
};
var dz = $("dropZone");
dz.addEventListener("dragover", (e) => {
  e.preventDefault();
  dz.classList.add("over");
});
dz.addEventListener("dragleave", () => dz.classList.remove("over"));
dz.addEventListener("drop", (e) => {
  e.preventDefault();
  dz.classList.remove("over");
  addLeadFiles([...e.dataTransfer.files]);
});
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  s.origem = document.querySelector('input[name="origem"]:checked').value;
  chrome.storage.local.set({ setup: s });
  return s;
}
function clienteNome() {
  return ($("comQuem").value.split(/\s[—–-]\s|,/)[0] || "").trim();
}
function showContext() {
  $("ctxObjetivo").textContent = $("objetivo").value.trim() || "\u2014";
  $("ctxFoco").textContent = $("foco").value.trim() || "\u2014";
  $("ctxObjetivo").title = $("objetivo").value;
  $("ctxFoco").title = $("foco").value;
  $("clienteTop").textContent = $("comQuem").value.trim() || "Nova reuni\xE3o";
  $("modoTop").textContent = MODO_NOME[$("modo").value] || "";
  $("mapCliente").textContent = clienteNome() || "Integrador";
}
$("btnSetup").onclick = () => {
  $("setupBox").hidden = !$("setupBox").hidden;
};
$("btnCollapse").onclick = () => {
  document.body.classList.add("right-collapsed");
  $("btnExpand").hidden = false;
  requestAnimationFrame(() => {
    fitIfAuto();
    drawLinks();
  });
};
$("btnExpand").onclick = () => {
  document.body.classList.toggle("right-collapsed", false);
  document.body.classList.toggle("show-right");
  $("btnExpand").hidden = !matchMedia("(max-width: 1250px)").matches;
  requestAnimationFrame(() => {
    fitIfAuto();
    drawLinks();
  });
};
function renderCrm(novos = []) {
  const dl = $("crm");
  dl.innerHTML = "";
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dd = el("dd", "", state.crm[k] || "\u2014");
    dd.id = `crm_${k}`;
    dd.contentEditable = "plaintext-only";
    dd.spellcheck = false;
    dd.classList.toggle("empty", !state.crm[k]);
    dd.classList.toggle("locked", state.crmLocked.has(k));
    if (novos.includes(k)) dd.classList.add("flash");
    dd.addEventListener("focus", () => {
      if (!state.crm[k]) dd.textContent = "";
    });
    dd.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        dd.blur();
      }
    });
    dd.addEventListener("blur", () => {
      const v = dd.textContent.trim();
      if (v && v !== state.crm[k]) {
        state.crm[k] = v;
        state.crmLocked.add(k);
        state.pendingNotes.push(`CLOSER CORRIGIU A FICHA: ${rotulo} = ${v}`);
        toast("Ficha corrigida \u2014 o Mentor vai respeitar");
      }
      renderCrm();
      updateKpis();
    });
    dl.append(el("dt", state.crm[k] ? "filled" : "", rotulo), dd);
  }
}
function addLeaf(k, text, sub = "") {
  text = (text || "").trim();
  if (!text) return;
  const list2 = state.map[k] ||= [];
  const found = list2.find((l) => l.text.toLowerCase() === text.toLowerCase());
  if (found) {
    if (sub && sub !== found.sub) {
      found.sub = sub;
      found.at = Date.now();
    }
    return;
  }
  list2.push({ text, sub, at: Date.now(), done: false });
}
function renderMap() {
  const now = Date.now();
  $("mapLeft").innerHTML = "";
  $("mapRight").innerHTML = "";
  for (const [k, b] of Object.entries(BRANCHES)) {
    const leaves = [...state.map[k] || []].reverse();
    const hot = leaves.some((l) => now - l.at < NEW_MS);
    const br = el("div", `branch${leaves.length ? "" : " empty"}${state.collapsed.has(k) ? " collapsed" : ""}${hot ? " hot" : ""}`);
    br.dataset.k = k;
    br.style.setProperty("--c", `var(--b-${k})`);
    const node = el("div", "branch-node", b.t);
    node.append(el("span", "cnt", String(leaves.length)));
    node.title = "Clique para recolher/abrir";
    node.onclick = () => {
      state.collapsed.has(k) ? state.collapsed.delete(k) : state.collapsed.add(k);
      renderMap();
    };
    const ul = el("ul", "leaves");
    const limit = state.expanded.has(k) ? leaves.length : MAX_LEAVES;
    leaves.slice(0, limit).forEach((l, i) => {
      const li = el("li", `leaf${k === "dor" ? " quote" : ""}${l.done ? " done" : ""}${now - l.at < NEW_MS ? " isnew" : ""}`, l.text);
      li.dataset.key = `${k}:${l.text}`;
      if (l.sub) li.append(el("span", "sub", l.sub));
      li.title = `${l.text}${l.sub ? `
\u21B3 ${l.sub}` : ""}

clique = copiar \xB7 duplo clique = aprofundar`;
      li.onclick = () => copy(l.sub || l.text);
      li.ondblclick = () => maybeAnalyze(true, `Aprofunde este ponto do mapa e me diga como usar agora: "${l.text}"`);
      ul.append(li);
    });
    if (leaves.length > MAX_LEAVES) {
      const more = el("li", "more", state.expanded.has(k) ? "mostrar menos" : `+${leaves.length - MAX_LEAVES} itens`);
      more.onclick = () => {
        state.expanded.has(k) ? state.expanded.delete(k) : state.expanded.add(k);
        renderMap();
      };
      ul.append(more);
    }
    br.append(node, ul);
    $(b.side === "left" ? "mapLeft" : "mapRight").append(br);
  }
  requestAnimationFrame(() => {
    fitIfAuto();
    drawLinks();
  });
}
function drawLinks() {
  const stage = $("mapStage");
  const svg = $("mapSvg");
  if (!stage.offsetWidth) return;
  const sr = stage.getBoundingClientRect();
  const s = state.view.s;
  const box = (e) => {
    const r = e.getBoundingClientRect();
    return { l: (r.left - sr.left) / s, r: (r.right - sr.left) / s, t: (r.top - sr.top) / s, b: (r.bottom - sr.top) / s };
  };
  const curve = (x1, y1, x2, y2) => {
    const dx = (x2 - x1) * 0.5;
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  };
  svg.setAttribute("width", stage.offsetWidth);
  svg.setAttribute("height", stage.offsetHeight);
  svg.innerHTML = "";
  const root = box($("mapRoot"));
  const ry = (root.t + root.b) / 2;
  const add = (d, color, cls, key) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("stroke", color);
    p.setAttribute("class", `${cls}${state.drawn.has(key) ? "" : " draw"}`);
    state.drawn.add(key);
    svg.append(p);
  };
  document.querySelectorAll(".branch").forEach((br) => {
    const k = br.dataset.k;
    const left = BRANCHES[k].side === "left";
    const color = getComputedStyle(br).getPropertyValue("--c").trim() || "#888";
    const nb = box(br.querySelector(".branch-node"));
    const ny = (nb.t + nb.b) / 2;
    add(left ? curve(root.l, ry, nb.r, ny) : curve(root.r, ry, nb.l, ny), color, "branchline", `b:${k}`);
    if (br.classList.contains("collapsed")) return;
    br.querySelectorAll(".leaf").forEach((lf) => {
      const lb = box(lf);
      const ly = (lb.t + lb.b) / 2;
      add(left ? curve(nb.l, ny, lb.r, ly) : curve(nb.r, ny, lb.l, ly), color, "leafline", `l:${lf.dataset.key}`);
    });
  });
}
function applyView() {
  const v = state.view;
  $("mapStage").style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
}
function fit() {
  const vp2 = $("mapViewport");
  const st = $("mapStage");
  if (!vp2.clientWidth || !st.offsetWidth) return;
  const s = Math.min(vp2.clientWidth / st.offsetWidth, vp2.clientHeight / st.offsetHeight, 1.15);
  state.view = { s, x: (vp2.clientWidth - st.offsetWidth * s) / 2, y: Math.max(0, (vp2.clientHeight - st.offsetHeight * s) / 2) };
  applyView();
}
function fitIfAuto() {
  if (!state.userView) fit();
}
function zoomAt(f, cx, cy) {
  const v = state.view;
  const s = Math.max(0.3, Math.min(2.5, v.s * f));
  v.x = cx - (cx - v.x) * s / v.s;
  v.y = cy - (cy - v.y) * s / v.s;
  v.s = s;
  state.userView = true;
  applyView();
}
var vp = $("mapViewport");
vp.addEventListener("wheel", (e) => {
  e.preventDefault();
  const r = vp.getBoundingClientRect();
  zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - r.left, e.clientY - r.top);
}, { passive: false });
vp.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".leaf, .branch-node, .more")) return;
  const start = { x: e.clientX, y: e.clientY, vx: state.view.x, vy: state.view.y };
  vp.classList.add("dragging");
  vp.setPointerCapture(e.pointerId);
  const move = (ev) => {
    state.view.x = start.vx + ev.clientX - start.x;
    state.view.y = start.vy + ev.clientY - start.y;
    state.userView = true;
    applyView();
  };
  const up = () => {
    vp.classList.remove("dragging");
    vp.removeEventListener("pointermove", move);
    vp.removeEventListener("pointerup", up);
  };
  vp.addEventListener("pointermove", move);
  vp.addEventListener("pointerup", up);
});
$("zoomIn").onclick = () => zoomAt(1.2, vp.clientWidth / 2, vp.clientHeight / 2);
$("zoomOut").onclick = () => zoomAt(1 / 1.2, vp.clientWidth / 2, vp.clientHeight / 2);
$("zoomFit").onclick = () => {
  state.userView = false;
  fit();
};
$("mapFull").onclick = toggleMapFull;
function toggleMapFull() {
  document.body.classList.toggle("map-full");
  $("mapFull").textContent = document.body.classList.contains("map-full") ? "\u2921" : "\u2922";
  requestAnimationFrame(() => {
    state.userView = false;
    fit();
    drawLinks();
  });
}
var ro = new ResizeObserver(() => {
  fitIfAuto();
  drawLinks();
});
ro.observe(vp);
ro.observe($("mapStage"));
function updateMapFrom(d) {
  const c = d.crm || {};
  addLeaf("resultado", c.resultado_desejado);
  addLeaf("operacao", c.situacao_atual);
  if (c.alavanca) addLeaf("operacao", `Alavanca: ${c.alavanca}`);
  (d.info_chave || []).forEach((i) => addLeaf("operacao", i));
  (d.frases_importantes || []).forEach((f) => addLeaf("dor", f));
  addLeaf("dor", c.dor_literal);
  addLeaf("causa", c.causa_raiz);
  addLeaf("impacto", c.impacto);
  addLeaf("decisores", c.decisores);
  if (c.capacidade_execucao) addLeaf("decisores", `Execu\xE7\xE3o: ${c.capacidade_execucao}`);
  const abertas = (d.objecoes || []).map((o) => o.objecao.toLowerCase());
  (d.objecoes || []).forEach((o) => addLeaf("objecoes", o.objecao, o.contorno));
  (state.map.objecoes || []).forEach((l) => {
    l.done = !abertas.includes(l.text.toLowerCase());
  });
  if (d.rota?.solucao) addLeaf("rota", d.rota.solucao, d.rota.investimento ? d.rota.investimento : "");
  addLeaf("proximos", c.proxima_acao);
  renderMap();
}
function updateKpis() {
  const n = Object.values(state.crm).filter(Boolean).length;
  if (setText("diagVal", `${n}/${N_CRM}`) && n) bump("diagVal");
  setRing("diagRing", n / N_CRM, n >= 8 ? "var(--ok)" : "var(--primary)");
  $("diagRingVal").textContent = `${Math.round(n / N_CRM * 100)}%`;
  $("crmBadge").textContent = `${n}/${N_CRM}`;
  const faltam = Object.entries(CRM_CAMPOS).filter(([k]) => !state.crm[k]).map(([, v]) => v.split(/[(/]/)[0].trim());
  $("diagFalta").textContent = faltam.length ? `falta: ${faltam.slice(0, 3).join(", ")}${faltam.length > 3 ? "\u2026" : ""}` : "completo \u2714";
  const me = state.talk["Voc\xEA"] || 0;
  const total = Object.values(state.talk).reduce((a, b) => a + b, 0);
  const pct = total ? Math.round(me / total * 100) : 0;
  $("talkMe").style.width = `${pct}%`;
  $("talkThem").style.width = `${total ? 100 - pct : 0}%`;
  $("talkTxt").textContent = total ? `${pct}% \xB7 ${100 - pct}%` : "\u2014";
  const demais = total > 150 && pct > 55;
  $("talkTxt").closest(".kpi").classList.toggle("alert", demais);
  if (demais && !state.talkWarned) {
    state.talkWarned = true;
    toast("\u{1F399} Voc\xEA est\xE1 falando mais que o cliente \u2014 pergunte e escute");
  }
  if (pct < 45) state.talkWarned = false;
  if (setText("qVal", state.qTimes.length) && state.qTimes.length) bump("qVal");
  const spark = $("qSpark");
  spark.innerHTML = "";
  const nowS = elapsedSec();
  const buckets = Array(10).fill(0);
  state.qTimes.forEach((t) => {
    const i = 9 - Math.floor((nowS - t) / 60);
    if (i >= 0 && i < 10) buckets[i]++;
  });
  const mx = Math.max(1, ...buckets);
  buckets.forEach((b) => {
    const i = el("i");
    i.style.height = `${b / mx * 100}%`;
    spark.append(i);
  });
  if (setText("objVal", state.openObj.length) && state.openObj.length) bump("objVal");
  $("objSub").textContent = `abertas \xB7 ${state.objTotal} no total`;
  $("objVal").closest(".kpi").classList.toggle("alert", state.openObj.length > 0);
  const sp = $("speakers");
  sp.innerHTML = "";
  Object.entries(state.talk).sort((a, b) => b[1] - a[1]).forEach(([name, w]) => {
    const c = el("span", "spk", name);
    c.append(el("i", "", `${total ? Math.round(w / total * 100) : 0}%`));
    sp.append(c);
  });
}
setInterval(() => {
  if (state.lastAt) {
    const s = Math.floor((Date.now() - state.lastAt) / 1e3);
    const txt = s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
    $("coachAge").textContent = `atualizado h\xE1 ${txt} \xB7`;
  }
  if (state.running) $("nextInfo").textContent = state.coach?.busy ? "analisando\u2026" : state.source === "demo" ? "" : `pr\xF3xima em ~${Math.max(0, state.intervalSec - state.sinceAnalysis)}s`;
  if (Object.values(state.map).some((ls) => ls.some((l) => {
    const a = Date.now() - l.at;
    return a >= NEW_MS && a < NEW_MS + 1e3;
  }))) renderMap();
}, 1e3);
var isMeet = (t) => /^https:\/\/meet\.google\.com\//.test(t?.url || t?.pendingUrl || "");
async function findMeetTab() {
  if (state.meetTabId) {
    try {
      const t = await chrome.tabs.get(state.meetTabId);
      if (isMeet(t)) return t;
    } catch {
    }
  }
  const tabs = await chrome.tabs.query({ url: "https://meet.google.com/*" });
  return tabs.find((t) => /meet\.google\.com\/[a-z]{3}-/.test(t.url)) || tabs[0];
}
$("btnStart").onclick = async () => {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULTS), "docs"]);
  const settings = { ...DEFAULTS, ...stored };
  if (!settings.geminiKey || settings.source === "audio" && !settings.deepgramKey) {
    setStatus("Falta a chave do Gemini. Abrindo Configura\xE7\xF5es\u2026", "warn");
    chrome.runtime.openOptionsPage();
    return;
  }
  const setup = readSetup();
  const { leadOwner } = await chrome.storage.local.get("leadOwner");
  if (leadDocs.length && leadOwner && setup.comQuem && leadOwner !== setup.comQuem && !confirm(`O dossi\xEA carregado foi adicionado para \u201C${leadOwner}\u201D.
Usar esses arquivos com \u201C${setup.comQuem}\u201D?

OK = usar \xB7 Cancelar = come\xE7ar sem dossi\xEA`)) {
    leadDocs = [];
    saveLead();
    chrome.storage.local.remove("leadOwner");
  }
  $("btnStart").disabled = true;
  try {
    if (settings.source === "meet") {
      const tab = await findMeetTab();
      if (!tab) throw new Error("N\xE3o achei nenhuma aba do Google Meet aberta. Entre na sala e tente de novo.");
      state.meetTabId = tab.id;
      try {
        await chrome.tabs.sendMessage(tab.id, { target: "meet", type: "start" });
      } catch {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["meet.js"] });
        await chrome.tabs.sendMessage(tab.id, { target: "meet", type: "start" });
      }
      setStatus('Lendo as legendas do Meet. Se nada aparecer, aperte "c" no Meet (legendas em Portugu\xEAs).', "ok");
    } else {
      setStatus("Conectando ao \xE1udio da reuni\xE3o\u2026");
      const res = await chrome.runtime.sendMessage({ target: "background", type: "start-capture", settings });
      if (res?.error) throw new Error(`${res.error} (Dica: v\xE1 na aba da reuni\xE3o e clique no \xEDcone da extens\xE3o.)`);
    }
  } catch (e) {
    setStatus(e.message, "error");
    $("btnStart").disabled = false;
    return;
  }
  $("btnStart").disabled = false;
  beginSession(settings, setup, new Coach(settings, setup, stored.docs || [], leadDocs), settings.source);
};
$("btnStop").onclick = async () => {
  if (!state.running) return;
  clearInterval(state.tick);
  clearTimeout(state.questionTimer);
  $("btnStop").disabled = true;
  if (state.source === "meet") await chrome.tabs.sendMessage(state.meetTabId, { target: "meet", type: "stop" }).catch(() => {
  });
  else if (state.source === "audio") await chrome.runtime.sendMessage({ target: "background", type: "stop-capture" });
  await new Promise((r) => setTimeout(r, 600));
  state.running = false;
  $("btnStop").disabled = false;
  $("btnStop").hidden = true;
  $("btnStart").hidden = false;
  $("btnDemo").hidden = false;
  $("dot").classList.remove("on");
  $("livePill").classList.remove("on");
  $("liveTag").textContent = "ENCERRADA";
  setStatus("Gerando a ata final\u2026");
  try {
    state.ataMd = await state.coach.ata(takeNewLines());
    renderAta(state.ataMd);
    $("ataOverlay").hidden = false;
    if (state.source !== "demo") saveHistory();
    setStatus(leadDocs.length ? "\u{1F4C2} O dossi\xEA deste lead continua carregado \u2014 em Prepara\xE7\xE3o, \u201Climpar dossi\xEA\u201D antes do pr\xF3ximo lead." : "", "warn");
  } catch (e) {
    setStatus(`Erro ao gerar ata: ${e.message}`, "error");
  }
};
function beginSession(settings, setup, coach, source) {
  const meetTabId = state.meetTabId;
  Object.assign(state, freshState(), {
    meetTabId,
    running: true,
    source,
    coach,
    setup,
    startedAt: Date.now(),
    intervalSec: source === "demo" ? 9999 : settings.intervalSec
  });
  $("transcript").innerHTML = "";
  $("timeline").innerHTML = "";
  $("rotaMini").classList.add("empty");
  $("rotaSolucao").textContent = "aguardando dor validada";
  $("rotaInvest").hidden = true;
  $("mapRota").textContent = "";
  $("mapTemp").textContent = "";
  $("objBox").hidden = true;
  $("alertasBox").hidden = true;
  $("perguntasBox").hidden = true;
  $("falta_cobrirBox").hidden = true;
  $("digaBox").hidden = true;
  ["tempVal", "condVal"].forEach((id) => {
    $(id).textContent = "\u2014";
  });
  ["tempMotivo", "condDica", "tempTrend", "condTrend", "etapa"].forEach((id) => {
    $(id).textContent = "";
  });
  ["tempRing", "condRing", "diagRing"].forEach((r) => setRing(r, 0));
  ["tempRingVal", "condRingVal"].forEach((r) => {
    $(r).textContent = "\u2014";
  });
  $("tempBand").textContent = "";
  $("tempBand").className = "band";
  [...$("movimentos").children, ...$("portoes").children].forEach((li) => {
    li.className = "";
  });
  $("sintese").textContent = "Aguardando a conversa\u2026";
  renderCrm();
  renderMem();
  renderMap();
  updateKpis();
  showContext();
  $("setupBox").hidden = true;
  $("proximo").textContent = "Ouvindo\u2026 abra com contexto, confirme tempo e participantes e combine o objetivo.";
  $("btnStart").hidden = true;
  $("btnDemo").hidden = true;
  $("btnStop").hidden = false;
  $("dot").classList.add("on");
  $("livePill").classList.add("on");
  $("liveTag").textContent = "AO VIVO";
  addTimeline(setup.origem === "avanco" ? "Reuni\xE3o de avan\xE7o iniciada" : "Reuni\xE3o iniciada (lead novo)", "Abertura", "baixa");
  if (source !== "demo" && (leadDocs.length || setup.notas)) {
    $("proximo").textContent = "Lendo o dossi\xEA do lead e montando o briefing\u2026";
    maybeAnalyze(true, PEDIDO_BRIEFING);
  }
  state.tick = setInterval(() => {
    $("timer").textContent = fmt(elapsedSec());
    if (++state.sinceAnalysis >= state.intervalSec) {
      state.sinceAnalysis = 0;
      maybeAnalyze();
    }
  }, 1e3);
}
var demoTimers = [];
var demoSavedInputs = null;
$("btnDemo").onclick = () => {
  if (state.running) return;
  demoSavedInputs = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value]));
  SETUP_FIELDS.forEach((f) => {
    $(f).value = DEMO_SETUP[f] || "";
  });
  showContext();
  beginSession({ ...DEFAULTS }, { ...DEMO_SETUP }, new DemoCoach(), "demo");
  setStatus("Demonstra\xE7\xE3o com uma reuni\xE3o fict\xEDcia. Nada \xE9 enviado ao Gemini.", "ok");
  $("liveTag").textContent = "DEMONSTRA\xC7\xC3O";
  const analisarEm = /* @__PURE__ */ new Set([3, 5, 7, 9, 11]);
  DEMO_SCRIPT.forEach(([seg, speaker, text], i) => {
    demoTimers.push(setTimeout(() => {
      if (!state.running || state.source !== "demo") return;
      onTranscript({ speaker, text, isFinal: true });
      if (analisarEm.has(i)) setTimeout(() => maybeAnalyze(true), 400);
    }, seg * 1e3));
  });
  const fim = DEMO_SCRIPT[DEMO_SCRIPT.length - 1][0] + 4;
  demoTimers.push(setTimeout(() => {
    if (state.source === "demo" && state.running) setStatus("Demonstra\xE7\xE3o conclu\xEDda. Clique em \u201CEncerrar + Ata\u201D para ver a ata.", "ok");
  }, fim * 1e3));
};
function endDemo() {
  demoTimers.forEach(clearTimeout);
  demoTimers = [];
  if (demoSavedInputs) {
    SETUP_FIELDS.forEach((f) => {
      $(f).value = demoSavedInputs[f];
    });
    demoSavedInputs = null;
    showContext();
  }
}
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== "sidepanel") return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return;
  if (msg.type === "set-meet-tab" && !state.running && msg.tabId) {
    state.meetTabId = msg.tabId;
    return;
  }
  if (msg.type === "status") setStatus(msg.text, msg.level);
  if (msg.type === "transcript" && state.running) onTranscript(msg);
});
function onTranscript({ speaker, text, isFinal }) {
  if (!isFinal) {
    state.interim[speaker] = `${speaker}: ${text}`;
    $("interim").textContent = Object.values(state.interim).filter(Boolean).join("  \xB7  ");
    return;
  }
  state.interim[speaker] = "";
  $("interim").textContent = Object.values(state.interim).filter(Boolean).join("  \xB7  ");
  const isMe = speaker === "Voc\xEA";
  state.talk[speaker] = (state.talk[speaker] || 0) + text.split(/\s+/).filter(Boolean).length;
  const perguntas = (text.match(/\?/g) || []).length;
  if (isMe) for (let i = 0; i < perguntas; i++) state.qTimes.push(elapsedSec());
  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    last.el.lastChild.textContent = ` ${last.text}`;
    if (perguntas && !isMe) last.el.classList.add("q");
  } else {
    const p = el("p", `${isMe ? "me" : "them"}${perguntas && !isMe ? " q" : ""}`);
    p.append(el("b", "", `${speaker}:`), document.createTextNode(` ${text}`));
    const line = { speaker, text, el: p };
    p.title = "Clique: o Mentor analisa este trecho";
    p.onclick = () => maybeAnalyze(true, `Analise esta fala e me diga como usar agora: "${line.speaker}: ${line.text}"`);
    $("transcript").append(p);
    state.lines.push(line);
  }
  $("transcript").scrollTop = $("transcript").scrollHeight;
  updateKpis();
  if (!isMe && perguntas) {
    clearTimeout(state.questionTimer);
    state.questionTimer = setTimeout(() => maybeAnalyze(true), 1200);
  }
}
function takeNewLines() {
  const novas = state.lines.slice(state.sentUpTo).map(({ speaker, text }) => ({ speaker, text }));
  state.sentUpTo = state.lines.length;
  return novas;
}
var newWordCount = () => state.lines.slice(state.sentUpTo).reduce((n, l) => n + l.text.split(/\s+/).length, 0);
async function maybeAnalyze(force = false, pedido = "") {
  if (!state.coach) {
    setStatus("Clique em \u201C\u25B6 Come\xE7ar\u201D primeiro.", "warn");
    return;
  }
  if (state.coach.busy) {
    if (pedido) toast("Aguarde, analisando\u2026");
    return;
  }
  if (!force && !pedido && newWordCount() < 12 && !state.pendingNotes.length) return;
  const from = state.sentUpTo;
  const novas = takeNewLines();
  const notas = state.pendingNotes.splice(0);
  state.sinceAnalysis = 0;
  $("btnAjuda").disabled = true;
  $("coach").classList.add("thinking");
  try {
    const res = await state.coach.analyze(novas, pedido, notas);
    if (res) {
      render(res.data, pedido);
      state.lastAt = Date.now();
    }
  } catch (e) {
    state.sentUpTo = Math.min(from, state.sentUpTo);
    state.pendingNotes.unshift(...notas);
    setStatus(`IA: ${e.message}`, "error");
  } finally {
    $("btnAjuda").disabled = false;
    $("coach").classList.remove("thinking");
  }
}
$("btnAjuda").onclick = () => {
  const p = $("pedido").value.trim();
  $("pedido").value = "";
  maybeAnalyze(true, p);
};
$("pedido").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("btnAjuda").click();
});
document.querySelectorAll(".chip[data-q]").forEach((b) => {
  b.onclick = () => maybeAnalyze(true, b.dataset.q);
});
function fillList(id, items, onClick) {
  const ul = $(id);
  ul.innerHTML = "";
  (items || []).forEach((t) => {
    const li = el("li", "", t);
    if (onClick) li.onclick = () => onClick(li, t);
    ul.append(li);
  });
  $(`${id}Box`).hidden = !items?.length;
}
function markSteps(id, items, current, stuck) {
  const idx = items.indexOf(current);
  if (idx < 0) return;
  [...$(id).children].forEach((li, i) => {
    li.className = i === idx ? stuck ? "stuck" : "cur" : i < idx ? "done" : "";
  });
}
function addTimeline(text, mov, urg) {
  const li = el("li", urg);
  li.append(el("span", "t", fmt(elapsedSec())), el("span", "m", mov || ""), el("div", "d", text));
  $("timeline").prepend(li);
  if (!document.querySelector('[data-tab="tTimeline"]').classList.contains("active")) {
    const b = $("tlCount");
    b.hidden = false;
    b.textContent = String((Number(b.textContent) || 0) + 1);
  }
}
function renderSintese(txt) {
  if (!txt) return;
  const p = $("sintese");
  p.innerHTML = "";
  txt.split(/(\[[^\]]*\])/).forEach((part) => p.append(/^\[.*\]$/.test(part) ? el("mark", "", part.slice(1, -1)) : document.createTextNode(part)));
  const box = $("threadBox");
  box.classList.remove("flash");
  void box.offsetWidth;
  box.classList.add("flash");
}
function animate(id) {
  const e = $(id);
  e.classList.remove("enter");
  void e.offsetWidth;
  e.classList.add("enter");
}
function render(d, pedido) {
  setStatus("");
  $("coach").closest(".col").scrollTo({ top: 0, behavior: "smooth" });
  const urg = d.urgencia || "baixa";
  $("coach").className = `card hero urg-${urg}`;
  $("urgTag").textContent = urg === "alta" ? "AGIR AGORA" : urg === "media" ? "OPORTUNIDADE" : "AGORA";
  if (setText("proximo", d.proximo_passo || "Continue ouvindo.")) animate("proximo");
  if (setText("diga", d.diga || "")) animate("digaBox");
  $("digaBox").hidden = !d.diga;
  const obj2 = d.objecoes || [];
  $("objBox").hidden = !obj2.length;
  $("objList").innerHTML = "";
  obj2.forEach((o) => {
    const item = el("div", "obj-item");
    const a = el("div", "obj-a", o.contorno);
    a.onclick = () => copy(o.contorno, "Contorno copiado \u2714");
    item.append(el("div", "obj-q", `\u201C${o.objecao}\u201D`), a);
    $("objList").append(item);
    if (!state.openObj.includes(o.objecao)) {
      state.objTotal++;
      addTimeline(`Obje\xE7\xE3o: \u201C${o.objecao}\u201D`, "Obje\xE7\xE3o", "alta");
    }
  });
  state.openObj = obj2.map((o) => o.objecao);
  fillList("alertas", d.alertas);
  fillList("perguntas", d.perguntas, (li, t) => {
    li.classList.add("used");
    copy(t, "Pergunta copiada \u2714");
  });
  fillList("falta_cobrir", (d.falta_cobrir || []).filter((t) => !state.covered.has(t.toLowerCase())), (li, t) => {
    li.classList.add("done");
    state.covered.add(t.toLowerCase());
    state.pendingNotes.push(`CLOSER MARCOU COMO COBERTO: ${t}`);
    toast("\u2714 Marcado como coberto");
  });
  markSteps("movimentos", MOVIMENTOS, d.movimento, false);
  markSteps("portoes", PORTOES, d.portao, true);
  $("etapa").textContent = d.etapa || "";
  renderSintese(d.sintese);
  if (Number.isFinite(d.temperatura)) {
    const t = Math.max(0, Math.min(100, Math.round(d.temperatura)));
    const prev = state.temp;
    const faixa = t >= 70 ? "quente" : t >= 40 ? "morno" : "frio";
    setRing("tempRing", t / 100, faixa === "quente" ? "var(--danger)" : faixa === "morno" ? "var(--warn)" : "var(--cold)");
    $("tempBand").textContent = faixa === "quente" ? "quente" : faixa === "morno" ? "morno" : "frio";
    $("tempBand").className = `band ${faixa}`;
    if (setText("tempVal", `${t}\xB0`)) bump("tempVal");
    $("tempRingVal").textContent = t;
    $("tempMotivo").textContent = d.temperatura_motivo || "";
    $("tempMotivo").title = d.temperatura_motivo || "";
    $("tempTrend").textContent = prev == null || prev === t ? "" : t > prev ? `\u25B2 +${t - prev}` : `\u25BC ${t - prev}`;
    $("tempTrend").className = `trend ${prev != null && t > prev ? "up" : "down"}`;
    $("mapTemp").textContent = `${t}\xB0`;
    state.temp = t;
  }
  if (Number.isFinite(d.conducao)) {
    const c = Math.max(0, Math.min(10, Math.round(d.conducao)));
    const prev = state.cond;
    if (setText("condVal", `${c}/10`)) bump("condVal");
    $("condRingVal").textContent = c;
    $("condTrend").textContent = prev == null || prev === c ? "" : c > prev ? `\u25B2 +${c - prev}` : `\u25BC ${c - prev}`;
    $("condTrend").className = `trend ${prev != null && c > prev ? "up" : "down"}`;
    $("condDica").textContent = d.conducao_dica || "";
    $("condDica").title = d.conducao_dica || "";
    $("condVal").closest(".kpi").classList.toggle("alert", c < 6);
    setRing("condRing", c / 10, c >= 8 ? "var(--ok)" : c >= 6 ? "var(--primary)" : "var(--warn)");
    state.cond = c;
  }
  const novos = [];
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || state.crmLocked.has(k) || v === state.crm[k]) continue;
    state.crm[k] = v;
    novos.push(k);
  }
  renderCrm(novos);
  if (d.rota?.solucao) {
    const mudou = $("rotaSolucao").textContent !== d.rota.solucao;
    $("rotaMini").classList.remove("empty");
    $("rotaSolucao").textContent = d.rota.solucao;
    $("rotaSolucao").title = d.rota.motivo || "";
    $("rotaInvest").hidden = !d.rota.investimento;
    $("rotaInvest").textContent = d.rota.investimento ? d.rota.investimento : "";
    $("mapRota").textContent = d.rota.solucao;
    if (mudou) {
      $("rotaNew").hidden = false;
      setTimeout(() => {
        $("rotaNew").hidden = true;
      }, NEW_MS);
      addTimeline(`Rota: ${d.rota.solucao}`, "Rota", "media");
    }
  }
  for (const info of [...d.info_chave || [], ...d.frases_importantes || []]) {
    if (!state.memoria.some((m) => m.text.toLowerCase() === info.toLowerCase())) state.memoria.push({ text: info, at: Date.now() });
  }
  renderMem();
  updateMapFrom(d);
  updateKpis();
  if (d.destaque) addTimeline(d.destaque, d.movimento, urg);
  else if (pedido) addTimeline(`Voc\xEA pediu: ${pedido.slice(0, 80)}`, "Pedido", "baixa");
}
function renderMem() {
  const ul = $("memoria");
  ul.innerHTML = "";
  [...state.memoria].reverse().sort((a, b) => state.pinned.has(b.text) - state.pinned.has(a.text)).forEach((m) => {
    const li = el("li", state.pinned.has(m.text) ? "pinned" : "");
    if (Date.now() - m.at < 8e3) li.classList.add("flash");
    const pin = el("span", "pin", state.pinned.has(m.text) ? "\u2605" : "\u2606");
    pin.onclick = (e) => {
      e.stopPropagation();
      state.pinned.has(m.text) ? state.pinned.delete(m.text) : state.pinned.add(m.text);
      renderMem();
    };
    li.onclick = () => copy(m.text);
    li.append(pin, el("span", "", m.text));
    ul.append(li);
  });
  $("memCount").hidden = !state.memoria.length;
  $("memCount").textContent = String(state.memoria.length);
}
function inline(el2, text) {
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) el2.append(Object.assign(document.createElement("strong"), { textContent: part.slice(2, -2) }));
    else if (part) el2.append(document.createTextNode(part));
  });
}
function renderAta(md) {
  const box = $("ata");
  box.innerHTML = "";
  let ul = null;
  for (const raw of (md || "").split("\n")) {
    const line = raw.trimEnd();
    if (/^#{1,4}\s/.test(line)) {
      ul = null;
      const h = el("h3");
      inline(h, line.replace(/^#+\s*/, ""));
      box.append(h);
      continue;
    }
    if (/^\s*[-*•]\s+/.test(line)) {
      if (!ul) {
        ul = el("ul");
        box.append(ul);
      }
      const li = el("li");
      inline(li, line.replace(/^\s*[-*•]\s+/, ""));
      ul.append(li);
      continue;
    }
    ul = null;
    if (line.trim()) {
      const p = el("p");
      inline(p, line);
      box.append(p);
    }
  }
  $("btnCopyFollow").hidden = !followUp(md);
}
function followUp(md) {
  const m = (md || "").match(/#+[^\n]*follow[^\n]*\n([\s\S]*?)(?=\n#+\s|$)/i);
  return m ? m[1].trim() : "";
}
$("btnCopyFollow").onclick = () => copy(followUp(state.ataMd), "Follow-up copiado \u2714");
var normName = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s[—–-]\s|,/)[0].trim();
async function saveHistory() {
  const { historico = [] } = await chrome.storage.local.get("historico");
  historico.unshift({
    id: Date.now(),
    cliente: state.setup?.comQuem || "Sem nome",
    data: (/* @__PURE__ */ new Date()).toISOString(),
    origem: state.setup?.origem,
    md: buildMarkdown()
  });
  await chrome.storage.local.set({ historico: historico.slice(0, 40) });
  renderHistory();
}
async function renderHistory() {
  const { historico = [] } = await chrome.storage.local.get("historico");
  const alvo = normName($("comQuem").value);
  const lista = alvo ? historico.filter((h) => normName(h.cliente) === alvo || normName(h.cliente).includes(alvo)) : historico.slice(0, 3);
  const ul = $("histList");
  ul.innerHTML = "";
  lista.slice(0, 6).forEach((h) => {
    const li = el("li");
    const d = new Date(h.data);
    li.append(el("span", "hist-date", d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })), el("span", "fn", h.cliente));
    const add = el("button", "mini", "+ dossi\xEA");
    add.title = "Usar a ata e o mapa desta reuni\xE3o como contexto";
    add.onclick = () => {
      const name = `reuniao-${d.toISOString().slice(0, 10)}.md`;
      if (!leadDocs.some((x) => x.name === name)) {
        if (!leadDocs.length) chrome.storage.local.set({ leadOwner: $("comQuem").value.trim() });
        leadDocs.push({ name, content: h.md });
        saveLead();
      }
      toast("Reuni\xE3o anterior adicionada ao dossi\xEA");
    };
    li.append(add);
    ul.append(li);
  });
  $("histTitle").textContent = alvo ? `Reuni\xF5es anteriores com ${$("comQuem").value.split(/\s[—–-]\s|,/)[0].trim()}` : "\xDAltimas reuni\xF5es";
  $("histBox").hidden = !lista.length;
}
$("comQuem").addEventListener("input", () => {
  clearTimeout(renderHistory.h);
  renderHistory.h = setTimeout(renderHistory, 300);
});
renderHistory();
$("digaBox").onclick = () => copy($("diga").textContent, "Frase copiada \u2714");
document.addEventListener("keydown", (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable="plaintext-only"]')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (e.key === "/") {
    e.preventDefault();
    $("pedido").focus();
  } else if (k === "a") $("btnAjuda").click();
  else if (k === "c" && $("diga").textContent) copy($("diga").textContent, "Frase copiada \u2714");
  else if (k === "m") toggleMapFull();
  else if (e.key === "Escape" && document.body.classList.contains("map-full")) toggleMapFull();
});
$("btnCopyAta").onclick = () => copy(buildMarkdown(), "Ata copiada \u2714");
$("btnFecharAta").onclick = () => {
  $("ataOverlay").hidden = true;
  if (state.source === "demo") {
    endDemo();
    setStatus("");
  }
};
$("btnBaixar").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([buildMarkdown()], { type: "text/markdown" }));
  a.download = `ata-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:T]/g, "-")}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
};
function buildMarkdown() {
  const mapa = Object.entries(BRANCHES).map(([k, b]) => {
    const ls = state.map[k] || [];
    return ls.length ? `### ${b.t}
${ls.map((l) => `- ${l.text}${l.sub ? ` \u2192 ${l.sub}` : ""}`).join("\n")}` : "";
  }).filter(Boolean).join("\n\n");
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join("\n\n");
  return `${state.ataMd || ""}

---

## Linha do racioc\xEDnio

${$("sintese").textContent}

## Mapa da reuni\xE3o

${mapa}

---

## Transcri\xE7\xE3o completa

${transcricao}
`;
}
renderCrm();
renderMap();
updateKpis();
