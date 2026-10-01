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
- "temperatura": 0 a 100 \u2014 qu\xE3o perto o integrador est\xE1 de comprar AGORA (dor validada, impacto, decisor, interesse, obje\xE7\xF5es). "temperatura_motivo": o porqu\xEA em at\xE9 8 palavras.
- "destaque": a descoberta mais importante desta an\xE1lise em at\xE9 12 palavras (vai para a linha do tempo). Vazio se nada relevante.
- "urgencia": "alta" se o closer precisa responder/agir AGORA (pergunta direta, obje\xE7\xE3o, pedido de pre\xE7o, decis\xE3o em jogo); "media" se h\xE1 oportunidade clara; "baixa" se \xE9 s\xF3 ouvir.

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
  frases_importantes: list,
  objecoes: { type: "array", items: obj({ objecao: str, contorno: str }) },
  temperatura: { type: "integer", minimum: 0, maximum: 100 },
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
function contextoInicial(setup) {
  const linhas = [
    "CONTEXTO DA REUNI\xC3O",
    `Objetivo do closer: ${setup.objetivo || "(n\xE3o informado \u2014 conduza para uma decis\xE3o ou microdecis\xE3o com respons\xE1vel e data)"}`
  ];
  if (MODOS[setup.modo]) linhas.push(`Tipo de reuni\xE3o: ${MODOS[setup.modo]}`);
  if (setup.comQuem) linhas.push(`Cliente / participantes: ${setup.comQuem}`);
  if (setup.foco) linhas.push(`Foco comercial desta reuni\xE3o: ${setup.foco}`);
  if (setup.notas) linhas.push(`Informa\xE7\xF5es da pr\xE9-venda / hip\xF3teses:
${setup.notas}`);
  return linhas.join("\n");
}
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
Checklist do m\xE9todo (Analisar / Conectar / Reativar): o que foi feito, o que faltou. Gaps de risco com evid\xEAncia, impacto e corre\xE7\xE3o. 2 acertos e 2 ajustes para a pr\xF3xima.

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
  constructor(settings, setup, docs) {
    this.settings = settings;
    this.setup = setup;
    this.system = [SYSTEM_PROMPT, baseDeConhecimento(docs)].filter(Boolean).join("\n\n");
    this.contents = [];
    this.busy = false;
    this.semThinking = false;
    this.semSchema = false;
  }
  body(userText, json) {
    const generationConfig = { maxOutputTokens: 8192 };
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
      const res = await fetch(`${API}/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": this.settings.geminiKey },
        body: JSON.stringify(this.body(userText, json))
      });
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
    if (!this.contents.length) partes.push(contextoInicial(this.setup));
    partes.push(
      newLines.length ? `TRANSCRI\xC7\xC3O NOVA (desde a \xFAltima an\xE1lise):
${newLines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}` : "TRANSCRI\xC7\xC3O NOVA: (nada novo)"
    );
    partes.push(...notas);
    if (pedido) partes.push(`PEDIDO DO CLOSER: ${pedido}`);
    const res = await this.send(partes.join("\n\n"), true);
    if (!res) return null;
    const jsonText = res.text.replace(/^```(?:json)?\s*|\s*```$/g, "");
    try {
      return { data: JSON.parse(jsonText), usage: res.usage };
    } catch {
      throw new Error("Resposta da IA veio em formato inesperado.");
    }
  }
  async ata(restante) {
    const partes = [];
    if (!this.contents.length) partes.push(contextoInicial(this.setup));
    if (restante.length) {
      partes.push(`TRANSCRI\xC7\xC3O FINAL:
${restante.map((l) => `${l.speaker}: ${l.text}`).join("\n")}`);
    }
    partes.push(PEDIDO_ATA);
    while (this.busy) await new Promise((r) => setTimeout(r, 300));
    const res = await this.send(partes.join("\n\n"), false);
    return res?.text || "";
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
var N_CRM = Object.keys(CRM_CAMPOS).length;
var BRANCHES = [
  { k: "resultado", t: "\u{1F3AF} Resultado desejado", c: "#4f46e5" },
  { k: "operacao", t: "\u{1F3ED} Opera\xE7\xE3o hoje", c: "#0891b2" },
  { k: "dor", t: "\u{1F4A2} Dor \u2014 palavras do cliente", c: "#dc2626" },
  { k: "causa", t: "\u{1F50D} Sintoma \u2192 causa-raiz", c: "#9333ea" },
  { k: "impacto", t: "\u{1F4C9} Impacto", c: "#ea580c" },
  { k: "decisores", t: "\u{1F465} Decisores & execu\xE7\xE3o", c: "#0d9488" },
  { k: "objecoes", t: "\u{1F6E1} Obje\xE7\xF5es \u2192 contorno", c: "#d97706" },
  { k: "rota", t: "\u{1F9E9} Rota / combo", c: "#16a34a" },
  { k: "proximos", t: "\u2705 Pr\xF3ximos passos", c: "#2563eb" }
];
var state = {
  running: false,
  coach: null,
  source: "meet",
  meetTabId: Number(new URLSearchParams(location.search).get("tab")) || null,
  lines: [],
  sentUpTo: 0,
  interim: {},
  startedAt: 0,
  tick: null,
  questionTimer: null,
  sinceAnalysis: 0,
  intervalSec: 25,
  lastAt: 0,
  tokens: { prompt: 0, cached: 0, out: 0 },
  crm: {},
  crmLocked: /* @__PURE__ */ new Set(),
  covered: /* @__PURE__ */ new Set(),
  pendingNotes: [],
  memoria: [],
  pinned: /* @__PURE__ */ new Set(),
  map: {},
  collapsed: /* @__PURE__ */ new Set(),
  openObj: [],
  talk: { me: 0, them: 0 },
  qCount: 0,
  talkWarned: false,
  timeline: []
};
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.h);
  toast.h = setTimeout(() => {
    t.hidden = true;
  }, 1600);
}
function copy(text, msg = "Copiado \u2714") {
  navigator.clipboard.writeText(text).then(() => toast(msg));
}
function setStatus(text, level = "") {
  const el2 = $("status");
  el2.hidden = !text;
  el2.textContent = text || "";
  el2.className = `status ${level}`;
}
var fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
var elapsedSec = () => state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1e3) : 0;
var el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
MOVIMENTOS.forEach((t) => $("movimentos").append(el("li", "", t)));
PORTOES.forEach((t) => $("portoes").append(el("li", "", t)));
document.querySelectorAll(".tabs").forEach((bar) => {
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    bar.querySelectorAll(".tab").forEach((b) => {
      b.classList.toggle("active", b === btn);
      $(b.dataset.tab).hidden = b !== btn;
    });
    if (btn.dataset.tab === "tTimeline") $("tlCount").hidden = true;
  });
});
chrome.storage.local.get(["setup", "docs"]).then(({ setup, docs }) => {
  if (setup) SETUP_FIELDS.forEach((f) => {
    if (setup[f] != null) $(f).value = setup[f];
  });
  if (!$("foco").value) $("foco").value = FOCO_PADRAO;
  showKb(docs);
});
chrome.storage.onChanged.addListener((ch) => {
  if (ch.docs) showKb(ch.docs.newValue);
});
function showKb(docs) {
  $("kbInfo").textContent = docs?.length ? `\u{1F4DA} ${docs.length} arquivo(s) na base` : "\u26A0 Suba seus .md em \u2699";
}
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  chrome.storage.local.set({ setup: s });
  return s;
}
$("btnSetup").onclick = () => {
  $("setupBox").hidden = !$("setupBox").hidden;
};
function renderCrm() {
  const dl = $("crm");
  dl.innerHTML = "";
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dt = el("dt", state.crm[k] ? "filled" : "", rotulo);
    const dd = el("dd", "", state.crm[k] || "\u2014");
    dd.id = `crm_${k}`;
    dd.contentEditable = "plaintext-only";
    dd.spellcheck = false;
    dd.classList.toggle("empty", !state.crm[k]);
    dd.classList.toggle("locked", state.crmLocked.has(k));
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
        toast("Ficha corrigida \u2014 o Mentor vai considerar");
      }
      renderCrm();
      updateKpis();
      renderMap();
    });
    dl.append(dt, dd);
  }
}
function addLeaf(k, text, sub = "") {
  text = (text || "").trim();
  if (!text) return false;
  const list2 = state.map[k] ||= [];
  const found = list2.find((l) => l.text.toLowerCase() === text.toLowerCase());
  if (found) {
    if (sub && sub !== found.sub) {
      found.sub = sub;
      found.at = Date.now();
      return true;
    }
    return false;
  }
  list2.push({ text, sub, at: Date.now(), done: false });
  return true;
}
function renderMap() {
  const box = $("mapBranches");
  box.innerHTML = "";
  const now = Date.now();
  for (const b of BRANCHES) {
    const leaves = state.map[b.k] || [];
    const hot = leaves.some((l) => now - l.at < 1e4);
    const br = el("div", `branch${leaves.length ? "" : " empty"}${state.collapsed.has(b.k) ? " collapsed" : ""}${hot ? " hot" : ""}`);
    br.style.setProperty("--c", b.c);
    const h = el("div", "branch-h", b.t);
    h.append(el("span", "cnt", leaves.length ? String(leaves.length) : "\u2014"));
    h.onclick = () => {
      state.collapsed.has(b.k) ? state.collapsed.delete(b.k) : state.collapsed.add(b.k);
      renderMap();
    };
    const ul = el("ul", "leaves");
    [...leaves].reverse().forEach((l) => {
      const li = el("li", `leaf${b.k === "dor" ? " quote" : ""}${l.done ? " done" : ""}`, l.text);
      if (l.sub) li.append(el("span", "sub", l.sub));
      if (now - l.at < 1e4) {
        li.classList.add("flash");
        li.append(el("span", "new", "NOVO"));
      }
      li.title = l.sub ? "Clique para copiar o contorno" : "Clique para copiar";
      li.onclick = () => copy(l.sub || l.text);
      ul.append(li);
    });
    br.append(h, ul);
    box.append(br);
  }
}
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
  if (d.rota?.solucao) addLeaf("rota", d.rota.solucao, d.rota.investimento ? `\u{1F4B0} ${d.rota.investimento}` : "");
  addLeaf("proximos", c.proxima_acao);
  const cliente = ($("comQuem").value.split(/[—-]/)[0] || "").trim();
  $("mapCliente").textContent = cliente || "Integrador";
  renderMap();
}
function updateKpis() {
  const n = Object.values(state.crm).filter(Boolean).length;
  $("diagVal").textContent = `${n}/${N_CRM}`;
  $("diagFill").style.width = `${n / N_CRM * 100}%`;
  $("crmBadge").textContent = `${n}/${N_CRM}`;
  const total = state.talk.me + state.talk.them;
  const me = total ? Math.round(state.talk.me / total * 100) : 0;
  $("talkMe").style.width = `${me}%`;
  $("talkThem").style.width = `${total ? 100 - me : 0}%`;
  $("talkTxt").textContent = total ? `Voc\xEA ${me}% \xB7 Cliente ${100 - me}%` : "Voc\xEA \u2014 \xB7 Cliente \u2014";
  const falandoDemais = total > 150 && me > 55;
  $("talkTxt").closest(".kpi").classList.toggle("alert", falandoDemais);
  if (falandoDemais && !state.talkWarned) {
    state.talkWarned = true;
    toast("Voc\xEA est\xE1 falando mais que o cliente \u2014 pergunte e escute");
  }
  if (!falandoDemais && me < 45) state.talkWarned = false;
  $("qVal").textContent = state.qCount;
}
setInterval(() => {
  if (state.lastAt) {
    const s = Math.floor((Date.now() - state.lastAt) / 1e3);
    $("lastVal").textContent = s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
    $("coachAge").textContent = `atualizado h\xE1 ${s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`}`;
  }
  if (state.running) $("nextInfo").textContent = `pr\xF3xima em ~${Math.max(0, state.intervalSec - state.sinceAnalysis)}s`;
  if (Object.values(state.map).some((l) => l.some((x) => Date.now() - x.at < 11e3 && Date.now() - x.at > 9500))) renderMap();
}, 1e3);
async function findMeetTab() {
  if (state.meetTabId) {
    try {
      return await chrome.tabs.get(state.meetTabId);
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
  Object.assign(state, {
    running: true,
    source: settings.source,
    coach: new Coach(settings, setup, stored.docs || []),
    lines: [],
    sentUpTo: 0,
    interim: {},
    startedAt: Date.now(),
    sinceAnalysis: 0,
    intervalSec: settings.intervalSec,
    lastAt: 0,
    tokens: { prompt: 0, cached: 0, out: 0 },
    crm: {},
    crmLocked: /* @__PURE__ */ new Set(),
    covered: /* @__PURE__ */ new Set(),
    pendingNotes: [],
    memoria: [],
    pinned: /* @__PURE__ */ new Set(),
    map: {},
    openObj: [],
    talk: { me: 0, them: 0 },
    qCount: 0,
    talkWarned: false,
    timeline: []
  });
  $("transcript").innerHTML = "";
  $("timeline").innerHTML = "";
  renderCrm();
  renderMem();
  renderMap();
  updateKpis();
  $("clienteTop").textContent = setup.comQuem || "";
  $("mapCliente").textContent = (setup.comQuem.split(/[—-]/)[0] || "").trim() || "Integrador";
  $("setupBox").hidden = true;
  $("proximo").textContent = "Ouvindo\u2026 abra com contexto, confirme tempo e participantes e combine o objetivo.";
  $("btnStart").hidden = true;
  $("btnStop").hidden = false;
  $("dot").classList.add("on");
  addTimeline("Reuni\xE3o iniciada", "Abertura", "baixa");
  state.tick = setInterval(() => {
    $("timer").textContent = fmt(elapsedSec());
    if (++state.sinceAnalysis >= state.intervalSec) {
      state.sinceAnalysis = 0;
      maybeAnalyze();
    }
  }, 1e3);
};
$("btnStop").onclick = async () => {
  if (!state.running) return;
  state.running = false;
  clearInterval(state.tick);
  clearTimeout(state.questionTimer);
  if (state.source === "meet") {
    await chrome.tabs.sendMessage(state.meetTabId, { target: "meet", type: "stop" }).catch(() => {
    });
  } else {
    await chrome.runtime.sendMessage({ target: "background", type: "stop-capture" });
  }
  $("btnStop").hidden = true;
  $("btnStart").hidden = false;
  $("dot").classList.remove("on");
  setStatus("Gerando a ata final\u2026");
  try {
    $("ata").textContent = await state.coach.ata(takeNewLines());
    $("ataOverlay").hidden = false;
    setStatus("");
  } catch (e) {
    setStatus(`Erro ao gerar ata: ${e.message}`, "error");
  }
};
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== "sidepanel") return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return;
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
  const words = text.split(/\s+/).filter(Boolean).length;
  state.talk[isMe ? "me" : "them"] += words;
  const perguntas = (text.match(/\?/g) || []).length;
  if (isMe) state.qCount += perguntas;
  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    last.el.lastChild.textContent = ` ${last.text}`;
    if (perguntas) last.el.classList.add("q");
  } else {
    const p = el("p", `${isMe ? "me" : "them"}${perguntas && !isMe ? " q" : ""}`);
    p.append(el("b", "", `${speaker}:`), document.createTextNode(` ${text}`));
    p.title = "Clique: o Mentor analisa este trecho";
    const line = { speaker, text, el: p };
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
      trackUsage(res.usage);
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
  const tab = document.querySelector('[data-tab="tTimeline"]');
  if (!tab.classList.contains("active")) {
    const b = $("tlCount");
    b.hidden = false;
    b.textContent = String((Number(b.textContent) || 0) + 1);
  }
}
function render(d, pedido) {
  setStatus("");
  $("coach").closest(".col").scrollTo({ top: 0, behavior: "smooth" });
  const urg = d.urgencia || "baixa";
  $("coach").className = `card hero urg-${urg}`;
  $("urgTag").textContent = urg === "alta" ? "AGIR AGORA" : urg === "media" ? "OPORTUNIDADE" : "AGORA";
  $("proximo").textContent = d.proximo_passo || "Continue ouvindo.";
  $("diga").textContent = d.diga || "";
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
  });
  obj2.forEach((o) => {
    if (!state.openObj.includes(o.objecao)) addTimeline(`Obje\xE7\xE3o: \u201C${o.objecao}\u201D`, "Obje\xE7\xE3o", "alta");
  });
  state.openObj = obj2.map((o) => o.objecao);
  fillList("perguntas", d.perguntas, (li, t) => {
    li.classList.add("used");
    copy(t, "Pergunta copiada \u2714");
  });
  fillList("alertas", d.alertas);
  const falta = (d.falta_cobrir || []).filter((t) => !state.covered.has(t.toLowerCase()));
  fillList("falta_cobrir", falta, (li, t) => {
    li.classList.add("done");
    state.covered.add(t.toLowerCase());
    state.pendingNotes.push(`CLOSER MARCOU COMO COBERTO: ${t}`);
    toast("Marcado como coberto");
  });
  markSteps("movimentos", MOVIMENTOS, d.movimento, false);
  markSteps("portoes", PORTOES, d.portao, true);
  $("etapa").textContent = d.etapa ? `\xB7 ${d.etapa}` : "";
  if (Number.isFinite(d.temperatura)) {
    const t = Math.max(0, Math.min(100, d.temperatura));
    $("tempFill").style.width = `${100 - t}%`;
    $("tempVal").textContent = `${t}\xB0`;
    $("tempMotivo").textContent = d.temperatura_motivo || "";
    $("mapTemp").textContent = `${t}\xB0`;
  }
  const novos = [];
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || state.crmLocked.has(k) || v === state.crm[k]) continue;
    state.crm[k] = v;
    novos.push(k);
  }
  renderCrm();
  novos.forEach((k) => $(`crm_${k}`).classList.add("flash"));
  if (d.rota?.solucao) {
    const mudou = $("rotaSolucao").textContent !== d.rota.solucao;
    $("rotaBox").classList.remove("empty");
    $("rotaSolucao").textContent = d.rota.solucao;
    $("rotaMotivo").textContent = d.rota.motivo || "";
    $("rotaInvest").hidden = !d.rota.investimento;
    $("rotaInvest").textContent = d.rota.investimento ? `\u{1F4B0} ${d.rota.investimento}` : "";
    if (mudou) {
      $("rotaNew").hidden = false;
      setTimeout(() => {
        $("rotaNew").hidden = true;
      }, 1e4);
      $("rotaBox").classList.add("flash");
      setTimeout(() => $("rotaBox").classList.remove("flash"), 3e3);
      addTimeline(`Rota: ${d.rota.solucao}`, "Rota", "media");
    }
  }
  for (const info of [...d.info_chave || [], ...d.frases_importantes || []]) {
    if (state.memoria.some((m) => m.text.toLowerCase() === info.toLowerCase())) continue;
    state.memoria.push({ text: info, at: Date.now() });
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
  const items = [...state.memoria].reverse().sort((a, b) => state.pinned.has(b.text) - state.pinned.has(a.text));
  items.forEach((m) => {
    const li = el("li", state.pinned.has(m.text) ? "pinned" : "");
    if (Date.now() - m.at < 8e3) li.classList.add("flash");
    const pin = el("span", "pin", state.pinned.has(m.text) ? "\u2605" : "\u2606");
    pin.onclick = () => {
      state.pinned.has(m.text) ? state.pinned.delete(m.text) : state.pinned.add(m.text);
      renderMem();
    };
    const txt = el("span", "", m.text);
    txt.onclick = () => copy(m.text);
    li.append(pin, txt);
    ul.append(li);
  });
  $("memCount").hidden = !state.memoria.length;
  $("memCount").textContent = String(state.memoria.length);
}
function trackUsage(u) {
  if (!u) return;
  state.tokens.prompt += u.promptTokenCount || 0;
  state.tokens.cached += u.cachedContentTokenCount || 0;
  state.tokens.out += (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
}
$("digaBox").onclick = () => copy($("diga").textContent, "Frase copiada \u2714");
document.addEventListener("keydown", (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable="plaintext-only"]')) return;
  if (e.key === "/") {
    e.preventDefault();
    $("pedido").focus();
  } else if (e.key.toLowerCase() === "a") $("btnAjuda").click();
  else if (e.key.toLowerCase() === "c" && $("diga").textContent) copy($("diga").textContent, "Frase copiada \u2714");
});
$("btnCopyAta").onclick = () => copy(buildMarkdown(), "Ata copiada \u2714");
$("btnFecharAta").onclick = () => {
  $("ataOverlay").hidden = true;
};
$("btnBaixar").onclick = () => {
  const blob = new Blob([buildMarkdown()], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ata-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:T]/g, "-")}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
};
function buildMarkdown() {
  const mapa = BRANCHES.map((b) => {
    const ls = state.map[b.k] || [];
    return ls.length ? `### ${b.t}
${ls.map((l) => `- ${l.text}${l.sub ? ` \u2192 ${l.sub}` : ""}`).join("\n")}` : "";
  }).filter(Boolean).join("\n\n");
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join("\n\n");
  return `${$("ata").textContent}

---

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
