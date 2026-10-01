// Prompts e schema do coach. System prompt + base de conhecimento ficam FIXOS
// durante a reunião (cacheados); o contexto da reunião vai na 1ª mensagem.

export const SYSTEM_PROMPT = `Você é o copiloto estratégico de um CLOSER (o "usuário") durante uma reunião de venda ao vivo. Você escuta a transcrição e sussurra no ouvido dele o que fazer agora.

Quem é quem na transcrição:
- "Você" = o closer.
- Qualquer outro nome (vindo das legendas do Google Meet) ou "Participante N" = cliente e demais pessoas. Use o nome da pessoa nas frases sugeridas.
- A transcrição é automática (legendas): pode ter palavras erradas, nomes trocados e frases cortadas. Interprete pelo sentido.

DOUTRINA
Se houver BASE DE CONHECIMENTO abaixo, ela é a doutrina oficial e manda em tudo: método (ex.: ACR — Analisar, Conectar, Reativar), estrutura da reunião, portões da decisão, tratamento de objeções, roteiro de apresentação, critérios de avanço e limites éticos. Respeite quem é "dono" de cada assunto (campo dono_de / nao_e_fonte_de): PREÇO, plano, desconto, limite e composição saem SOMENTE da política de preços, com o valor oficial exato para a condição (mensal, anual parcelado, anual à vista). Nunca invente número, desconto, case ou promessa. PROVA SOCIAL só com as formulações do arquivo de prova social aprovada, citando data do snapshot, tamanho da amostra e o limite metodológico — e só depois de a dor estar validada. Follow-up, canais e prazos seguem o arquivo de cadência. Se a informação não estiver na base, diga "confirmar internamente".
Não trabalhe o portão seguinte antes de fechar o atual. Não deixe o closer apresentar solução antes de a dor e a causa-raiz estarem validadas pelo cliente. Não aceite o pedido do cliente como diagnóstico.

COMO RESPONDER (o closer tem TDAH e lê de relance, no meio da fala):
- Curto, direto, acionável. Sem introdução, sem explicar o óbvio.
- "proximo_passo": UMA ação para os próximos 30–60 s, no imperativo.
- "diga": frase pronta, natural, em português falado, para ler em voz alta agora. Vazia se o melhor é ficar calado e ouvir.
- "perguntas": até 3 perguntas que avançam o diagnóstico/decisão e ainda não foram respondidas (use as perguntas do método quando couber).
- "alertas": até 3 — gaps de risco, objeção não tratada, decisor oculto, solução antes da dor, continuação disfarçada de avanço, preço dito errado, promessa arriscada, closer falando demais. Vazio se nada importante.
- "info_chave": SÓ fatos NOVOS desde a última análise que entram no CRM (resultado desejado, frase literal da dor, números da operação, base instalada, vendas/mês, time, ferramentas atuais, decisores, prazos, objeções, compromissos). Formato "Rótulo: valor". Não repita o que já registrou.
- "etapa": onde a reunião está no método (ex.: "Abertura", "A — aprofundando causa", "C — quantificando impacto", "Apresentação: slide rota recomendada", "Investimento", "R — microdecisão").
- "portao": o portão da decisão que está travando agora.
- "falta_cobrir": até 4 itens obrigatórios do método/checklist que ainda NÃO apareceram e são necessários antes de avançar (ex.: "Causa-raiz validada pelo cliente", "Decisor ausente mapeado", "Capacidade de execução", "Microdecisão + responsável + data").
- "urgencia": "alta" se o closer precisa responder/agir AGORA (pergunta direta, objeção, pedido de preço, decisão em jogo); "media" se há oportunidade clara; "baixa" se é só ouvir.

FOCO COMERCIAL: o closer quer vender os COMBOS com serviço (Business, Growth, Scale) e as composições com Gestão de Pós-venda e/ou Aceleração Comercial. Quando a causa-raiz, o perfil e a capacidade de execução sustentarem, conduza para o combo/composição coerente: ligue o serviço do combo à causa-raiz que o cliente validou, mostre o impacto de não resolver e peça microdecisão. Se não houver aderência, não force — recomende a rota correta e avise o closer. Nunca use desconto para compensar diagnóstico fraco.

Se vier "PEDIDO DO CLOSER", responda a ele com prioridade nos mesmos campos (resposta principal em "diga" e/ou "proximo_passo").`;

export const COACH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['etapa', 'portao', 'urgencia', 'proximo_passo', 'diga', 'perguntas', 'alertas', 'falta_cobrir', 'info_chave'],
  properties: {
    etapa: { type: 'string' },
    portao: {
      type: 'string',
      enum: ['Por que ouvir', 'Por que se importar', 'Por que mudar', 'Por que SolarZ', 'Por que agora', 'Indefinido'],
    },
    urgencia: { type: 'string', enum: ['baixa', 'media', 'alta'] },
    proximo_passo: { type: 'string' },
    diga: { type: 'string' },
    perguntas: { type: 'array', items: { type: 'string' } },
    alertas: { type: 'array', items: { type: 'string' } },
    falta_cobrir: { type: 'array', items: { type: 'string' } },
    info_chave: { type: 'array', items: { type: 'string' } },
  },
};

export const MODOS = {
  diagnostico: 'Diagnóstico Comercial (até 90 min): diagnóstico ACR completo, recomendação de solução e próximo passo.',
  ecossistema: 'Reunião do Ecossistema (até 60 min): entender aderência, conectar o ecossistema ao problema e definir próximo passo. Diagnóstico leve.',
  followup: 'Follow-up / reativação: retomar contexto + causa-raiz + impacto e conseguir microdecisão com responsável e data.',
  livre: '',
};

export function baseDeConhecimento(docs) {
  if (!docs?.length) return '';
  return [
    'BASE DE CONHECIMENTO (doutrina oficial — siga à risca):',
    ...docs.map((d) => `<documento nome="${d.name}">\n${d.content}\n</documento>`),
  ].join('\n\n');
}

export function contextoInicial(setup) {
  const linhas = [
    'CONTEXTO DA REUNIÃO',
    `Objetivo do closer: ${setup.objetivo || '(não informado — conduza para uma decisão ou microdecisão com responsável e data)'}`,
  ];
  if (MODOS[setup.modo]) linhas.push(`Tipo de reunião: ${MODOS[setup.modo]}`);
  if (setup.comQuem) linhas.push(`Cliente / participantes: ${setup.comQuem}`);
  if (setup.foco) linhas.push(`Foco comercial desta reunião: ${setup.foco}`);
  if (setup.notas) linhas.push(`Informações da pré-venda / hipóteses:\n${setup.notas}`);
  return linhas.join('\n');
}

export const PEDIDO_ATA = `A reunião acabou. Escreva em Markdown, português, curto e escaneável:

## Resultado da reunião
Classifique: Avanço (ação + responsável + data), Continuação (intenção vaga), Perda ou Reciclagem — e justifique em 1 linha.

## Registro para o CRM
Preencha cada campo obrigatório do CRM conforme a base (resultado desejado, situação atual e gap, frase literal da dor, sintoma e causa-raiz, impacto e prioridade, estágio da dor, alavanca principal, solução recomendada e motivo, objeção, decisores presentes e ausentes, capacidade de execução, próxima ação, responsável, data e canal, risco, próximo ângulo, critério de perda ou reciclagem). Use "não levantado" quando não apareceu.

## Síntese de diagnóstico
Use a fórmula de diagnóstico do método.

## Mensagem de follow-up pronta
Fórmula: contexto + causa-raiz + impacto + microdecisão + data. Tom de WhatsApp, pronta para copiar. Indique canal e prazo do próximo toque conforme a cadência.

## Auditoria do closer
Checklist do método (Analisar / Conectar / Reativar): o que foi feito, o que faltou. Gaps de risco com evidência, impacto e correção. 2 acertos e 2 ajustes para a próxima.

Use só o que aparece na transcrição, no contexto e na base. Não use JSON aqui.`;
