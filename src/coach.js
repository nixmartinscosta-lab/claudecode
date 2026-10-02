// Motor de IA: Google Gemini (REST generateContent).
// A conversa é só-acrescenta: cada análise manda apenas a fala NOVA. Como o
// começo (instrução + base de conhecimento + histórico) se repete, o Gemini
// reaproveita via cache implícito — mais rápido e mais barato.

import { SYSTEM_PROMPT, COACH_SCHEMA, contextoInicial, baseDeConhecimento, correcoesOficiais, PEDIDO_ATA } from './prompts.js';

const API = 'https://generativelanguage.googleapis.com/v1beta/models';

// O Gemini não precisa de additionalProperties; remove pra máxima compatibilidade.
function limparSchema(s) {
  if (Array.isArray(s)) return s.map(limparSchema);
  if (s && typeof s === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(s)) if (k !== 'additionalProperties') o[k] = limparSchema(v);
    return o;
  }
  return s;
}
const SCHEMA = limparSchema(COACH_SCHEMA);

export class Coach {
  constructor(settings, setup, docs, leadDocs = []) {
    this.leadDocs = leadDocs;
    this.settings = settings;
    this.setup = setup;
    this.system = [SYSTEM_PROMPT, correcoesOficiais(settings.correcoes), baseDeConhecimento(docs)].filter(Boolean).join('\n\n');
    this.contents = [];
    this.busy = false;
    this.semThinking = false; // vira true se o modelo não aceitar thinkingConfig
    this.semSchema = false;   // vira true se o modelo não aceitar responseJsonSchema
  }

  body(userText, json) {
    const generationConfig = { maxOutputTokens: 16384 };
    if (json) {
      generationConfig.responseMimeType = 'application/json';
      if (!this.semSchema) generationConfig.responseJsonSchema = SCHEMA;
    }
    if (!this.semThinking && this.settings.thinking) {
      generationConfig.thinkingConfig = { thinkingLevel: this.settings.thinking };
    }
    let system = this.system;
    if (json && this.semSchema) system += `\n\nResponda SOMENTE com JSON neste schema:\n${JSON.stringify(SCHEMA)}`;
    return {
      systemInstruction: { parts: [{ text: system }] },
      contents: [...this.contents, { role: 'user', parts: [{ text: userText }] }],
      generationConfig,
    };
  }

  async call(userText, json) {
    const model = this.settings.model || 'gemini-3.5-flash';
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      let res;
      try {
        res = await fetch(`${API}/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': this.settings.geminiKey },
          body: JSON.stringify(this.body(userText, json)),
        });
      } catch {
        // Internet oscilou: espera e tenta de novo.
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data;
      const msg = data.error?.message || `HTTP ${res.status}`;
      // Campo não suportado por este modelo: tira e tenta de novo.
      if (res.status === 400 && /thinking/i.test(msg) && !this.semThinking) { this.semThinking = true; continue; }
      if (res.status === 400 && /schema/i.test(msg) && !this.semSchema) { this.semSchema = true; continue; }
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 1500)); continue; }
      throw new Error(msg);
    }
    throw new Error('Gemini indisponível no momento, tentando de novo na próxima análise.');
  }

  async send(userText, json) {
    if (this.busy) return null;
    this.busy = true;
    try {
      const data = await this.call(userText, json);
      const cand = data.candidates?.[0];
      if (!cand?.content?.parts) {
        throw new Error(`Gemini não respondeu (${cand?.finishReason || data.promptFeedback?.blockReason || 'sem conteúdo'}).`);
      }
      // Guarda a resposta inteira (inclui assinaturas de pensamento) — exigido no multi-turno.
      this.contents.push({ role: 'user', parts: [{ text: userText }] });
      this.contents.push(cand.content);
      const text = cand.content.parts.filter((p) => p.text && !p.thought).map((p) => p.text).join('');
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
      newLines.length
        ? `TRANSCRIÇÃO NOVA (desde a última análise):\n${newLines.map((l) => `${l.speaker}: ${l.text}`).join('\n')}`
        : 'TRANSCRIÇÃO NOVA: (nada novo)',
    );
    partes.push(...notas);
    if (pedido) partes.push(`PEDIDO DO CLOSER: ${pedido}`);

    const res = await this.send(partes.join('\n\n'), true);
    if (!res) return null;
    // Tolera cercas ``` e texto em volta do JSON.
    const t = res.text;
    const jsonText = t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1);
    try {
      return { data: JSON.parse(jsonText), usage: res.usage };
    } catch {
      throw new Error('Resposta da IA veio em formato inesperado.');
    }
  }

  async ata(restante) {
    const partes = [];
    if (!this.contents.length) partes.push(contextoInicial(this.setup, this.leadDocs));
    if (restante.length) {
      partes.push(`TRANSCRIÇÃO FINAL:\n${restante.map((l) => `${l.speaker}: ${l.text}`).join('\n')}`);
    }
    partes.push(PEDIDO_ATA);
    let res = null;
    while (!res) {
      while (this.busy) await new Promise((r) => setTimeout(r, 300));
      res = await this.send(partes.join('\n\n'), false); // null = outra chamada pegou a vez
    }
    return res.text;
  }
}
