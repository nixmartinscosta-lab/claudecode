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
- "urgencia": "alta" se o closer precisa responder/agir AGORA (pergunta direta, obje\xE7\xE3o, pedido de pre\xE7o, decis\xE3o em jogo); "media" se h\xE1 oportunidade clara; "baixa" se \xE9 s\xF3 ouvir.

FOCO COMERCIAL: o closer quer vender os COMBOS com servi\xE7o (Business, Growth, Scale) e as composi\xE7\xF5es com Gest\xE3o de P\xF3s-venda e/ou Acelera\xE7\xE3o Comercial. Quando a causa-raiz, o perfil e a capacidade de execu\xE7\xE3o sustentarem, conduza para o combo/composi\xE7\xE3o coerente: ligue o servi\xE7o do combo \xE0 causa-raiz que o cliente validou, mostre o impacto de n\xE3o resolver e pe\xE7a microdecis\xE3o. Se n\xE3o houver ader\xEAncia, n\xE3o force \u2014 recomende a rota correta e avise o closer. Nunca use desconto para compensar diagn\xF3stico fraco.

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
  async analyze(newLines, pedido) {
    const partes = [];
    if (!this.contents.length) partes.push(contextoInicial(this.setup));
    partes.push(
      newLines.length ? `TRANSCRI\xC7\xC3O NOVA (desde a \xFAltima an\xE1lise):
${newLines.map((l) => `${l.speaker}: ${l.text}`).join("\n")}` : "TRANSCRI\xC7\xC3O NOVA: (nada novo)"
    );
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
var params = new URLSearchParams(location.search);
var state = {
  running: false,
  coach: null,
  source: "meet",
  meetTabId: Number(params.get("tab")) || null,
  lines: [],
  sentUpTo: 0,
  interim: {},
  memoria: [],
  crm: {},
  startedAt: 0,
  tick: null,
  questionTimer: null,
  tokens: { prompt: 0, cached: 0, out: 0 }
};
function steps(id, items) {
  const ol = $(id);
  items.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ol.append(li);
  });
}
steps("movimentos", MOVIMENTOS);
steps("portoes", PORTOES);
function renderCrm() {
  const dl = $("crm");
  dl.innerHTML = "";
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.id = `crm_${k}`;
    dd.textContent = state.crm[k] || "\u2014";
    dd.className = state.crm[k] ? "" : "empty";
    dl.append(dt, dd);
  }
  const n = Object.values(state.crm).filter(Boolean).length;
  $("crmCount").textContent = `${n}/${Object.keys(CRM_CAMPOS).length}`;
}
renderCrm();
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
  $("kbInfo").textContent = docs?.length ? `\u{1F4DA} Base: ${docs.map((d) => d.name.replace(/\.md$/, "")).join(" \xB7 ")}` : "\u26A0 Nenhuma base carregada. Suba seus .md em \u2699 Configura\xE7\xF5es.";
}
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  chrome.storage.local.set({ setup: s });
  return s;
}
$("btnSetup").onclick = () => {
  $("setupBox").hidden = !$("setupBox").hidden;
};
function setStatus(text, level = "") {
  const el = $("status");
  el.hidden = !text;
  el.textContent = text || "";
  el.className = `status ${level}`;
}
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
    memoria: [],
    crm: {},
    startedAt: Date.now(),
    tokens: { prompt: 0, cached: 0, out: 0 }
  });
  $("transcript").innerHTML = "";
  $("memoria").innerHTML = "";
  $("memCount").textContent = "";
  renderCrm();
  $("clienteTop").textContent = setup.comQuem ? `\xB7 ${setup.comQuem}` : "";
  $("setupBox").hidden = true;
  $("proximo").textContent = "Ouvindo\u2026 abra com contexto e combine o objetivo da reuni\xE3o.";
  $("btnStart").hidden = true;
  $("btnStop").hidden = false;
  $("dot").classList.add("on");
  let elapsed = 0;
  state.tick = setInterval(() => {
    const s = Math.floor((Date.now() - state.startedAt) / 1e3);
    $("timer").textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    if (++elapsed >= settings.intervalSec) {
      elapsed = 0;
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
function onTranscript({ source, speaker, text, isFinal }) {
  if (!isFinal) {
    state.interim[speaker] = `${speaker}: ${text}`;
    $("interim").textContent = Object.values(state.interim).filter(Boolean).join("  \xB7  ");
    return;
  }
  state.interim[speaker] = "";
  $("interim").textContent = Object.values(state.interim).filter(Boolean).join("  \xB7  ");
  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    last.el.lastChild.textContent = ` ${last.text}`;
  } else {
    const p = document.createElement("p");
    const b = document.createElement("b");
    b.textContent = `${speaker}:`;
    if (speaker === "Voc\xEA") b.className = "me";
    p.append(b, document.createTextNode(` ${text}`));
    $("transcript").append(p);
    state.lines.push({ speaker, text, source, el: p });
  }
  $("transcript").scrollTop = $("transcript").scrollHeight;
  if (speaker !== "Voc\xEA" && /\?\s*$/.test(text)) {
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
  if (!state.coach || state.coach.busy) return;
  if (!force && !pedido && newWordCount() < 12) return;
  const from = state.sentUpTo;
  const novas = takeNewLines();
  $("btnAjuda").disabled = true;
  $("coach").classList.add("thinking");
  try {
    const res = await state.coach.analyze(novas, pedido);
    if (res) {
      render(res.data);
      trackUsage(res.usage);
    }
  } catch (e) {
    state.sentUpTo = Math.min(from, state.sentUpTo);
    setStatus(`IA: ${e.message}`, "error");
  } finally {
    $("btnAjuda").disabled = false;
    $("coach").classList.remove("thinking");
  }
}
$("btnAjuda").onclick = () => {
  if (!state.coach) {
    setStatus("Clique em \u201C\u25B6 Come\xE7ar\u201D primeiro.", "warn");
    return;
  }
  const pedido = $("pedido").value.trim();
  $("pedido").value = "";
  maybeAnalyze(true, pedido);
};
$("pedido").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("btnAjuda").click();
});
function fillList(id, items) {
  const ul = $(id);
  ul.innerHTML = "";
  (items || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.append(li);
  });
  $(`${id}Box`).hidden = !items?.length;
}
function markSteps(id, items, current, stuck) {
  const idx = items.indexOf(current);
  [...$(id).children].forEach((li, i) => {
    li.className = i === idx ? stuck ? "stuck" : "cur" : i < idx ? "done" : "";
  });
}
function render(d) {
  if (state.running || d) setStatus("");
  $("coach").className = `card now urg-${d.urgencia || "baixa"}`;
  $("proximo").textContent = d.proximo_passo || "Continue ouvindo.";
  $("diga").textContent = d.diga || "";
  $("digaBox").hidden = !d.diga;
  fillList("perguntas", d.perguntas);
  fillList("alertas", d.alertas);
  fillList("falta_cobrir", d.falta_cobrir);
  markSteps("movimentos", MOVIMENTOS, d.movimento, false);
  markSteps("portoes", PORTOES, d.portao, true);
  $("etapa").textContent = d.etapa || "";
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || v === state.crm[k]) continue;
    state.crm[k] = v;
    const dd = $(`crm_${k}`);
    dd.textContent = v;
    dd.className = "";
    void dd.offsetWidth;
    dd.className = "flash";
  }
  $("crmCount").textContent = `${Object.values(state.crm).filter(Boolean).length}/${Object.keys(CRM_CAMPOS).length}`;
  if (d.rota?.solucao) {
    $("rotaSolucao").textContent = d.rota.solucao;
    $("rotaSolucao").classList.remove("muted");
    $("rotaMotivo").textContent = d.rota.motivo || "";
    $("rotaInvest").textContent = d.rota.investimento ? `\u{1F4B0} ${d.rota.investimento}` : "";
  }
  for (const info of d.info_chave || []) {
    if (state.memoria.some((m) => m.toLowerCase() === info.toLowerCase())) continue;
    state.memoria.push(info);
    const li = document.createElement("li");
    li.textContent = info;
    li.className = "flash";
    $("memoria").prepend(li);
  }
  $("memCount").textContent = state.memoria.length ? `(${state.memoria.length})` : "";
}
function trackUsage(u) {
  if (!u) return;
  state.tokens.prompt += u.promptTokenCount || 0;
  state.tokens.cached += u.cachedContentTokenCount || 0;
  state.tokens.out += (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
  const k = (n) => n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : n;
  const t = state.tokens;
  $("custo").textContent = `tokens ${k(t.prompt)} in (${k(t.cached)} cache) \xB7 ${k(t.out)} out`;
}
$("btnCopy").onclick = () => navigator.clipboard.writeText($("diga").textContent);
$("btnCopyAta").onclick = () => navigator.clipboard.writeText(buildMarkdown());
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
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join("\n\n");
  return `${$("ata").textContent}

---

## Transcri\xE7\xE3o completa

${transcricao}
`;
}
export {
  DEFAULTS
};
