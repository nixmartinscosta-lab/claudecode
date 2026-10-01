// Conversa com o Claude. A conversa é só-acrescenta (append-only): cada análise
// manda apenas a transcrição NOVA, e o histórico anterior é reaproveitado pelo
// cache de prompt — economiza tokens e o Claude lembra do que já te orientou.

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, COACH_SCHEMA, contextoInicial, baseDeConhecimento, PEDIDO_ATA } from './prompts.js';

const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-1']);

export class Coach {
  constructor(settings, setup, docs) {
    this.settings = settings;
    this.setup = setup;
    // Prompt + base fixos: com cache, a base inteira só é cobrada cheia na 1ª chamada.
    this.system = [{ type: 'text', text: SYSTEM_PROMPT }];
    const kb = baseDeConhecimento(docs);
    if (kb) this.system.push({ type: 'text', text: kb, cache_control: { type: 'ephemeral' } });
    this.messages = [];
    this.busy = false;
    this.client = new Anthropic({
      apiKey: settings.anthropicKey,
      dangerouslyAllowBrowser: true, // uso pessoal: a chave fica só no seu navegador
    });
  }

  buildParams(userText, withSchema) {
    const model = this.settings.model || 'claude-opus-5-5';
    const params = {
      model,
      max_tokens: 16000,
      system: this.system,
      cache_control: { type: 'ephemeral' },
      messages: [...this.messages, { role: 'user', content: userText }],
      output_config: {},
    };
    if (!model.startsWith('claude-haiku')) {
      params.output_config.effort = this.settings.effort || 'low';
    }
    if (withSchema) {
      params.output_config.format = { type: 'json_schema', schema: COACH_SCHEMA };
    }
    if (!Object.keys(params.output_config).length) delete params.output_config;
    if (FALLBACK_MODELS.has(model)) {
      params.betas = ['server-side-fallback-2026-07-01'];
      params.fallbacks = 'default';
    }
    return params;
  }

  async send(userText, withSchema) {
    if (this.busy) return null;
    this.busy = true;
    try {
      const stream = this.client.beta.messages.stream(this.buildParams(userText, withSchema));
      const response = await stream.finalMessage();
      if (response.stop_reason === 'refusal') {
        throw new Error('O modelo recusou esta análise. Tente reformular o pedido.');
      }
      // Guarda a resposta inteira (inclui blocos de thinking) — exigido pra manter o histórico válido.
      this.messages.push({ role: 'user', content: userText });
      this.messages.push({ role: 'assistant', content: response.content });
      const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
      return { text, usage: response.usage };
    } finally {
      this.busy = false;
    }
  }

  // newLines: [{speaker, text}] desde a última análise. pedido: pergunta livre do usuário.
  async analyze(newLines, pedido) {
    const partes = [];
    if (!this.messages.length) partes.push(contextoInicial(this.setup));
    partes.push(
      newLines.length
        ? `TRANSCRIÇÃO NOVA (desde a última análise):\n${newLines.map((l) => `${l.speaker}: ${l.text}`).join('\n')}`
        : 'TRANSCRIÇÃO NOVA: (nada novo)',
    );
    if (pedido) partes.push(`PEDIDO DO CLOSER: ${pedido}`);

    const res = await this.send(partes.join('\n\n'), true);
    if (!res) return null;
    try {
      return { data: JSON.parse(res.text), usage: res.usage };
    } catch {
      throw new Error('Resposta da IA veio em formato inesperado.');
    }
  }

  async ata(restante) {
    const partes = [];
    if (!this.messages.length) partes.push(contextoInicial(this.setup));
    if (restante.length) {
      partes.push(`TRANSCRIÇÃO FINAL:\n${restante.map((l) => `${l.speaker}: ${l.text}`).join('\n')}`);
    }
    partes.push(PEDIDO_ATA);
    // Espera uma análise em andamento terminar.
    while (this.busy) await new Promise((r) => setTimeout(r, 300));
    const res = await this.send(partes.join('\n\n'), false);
    return res?.text || '';
  }
}
