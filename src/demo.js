// Modo demonstração: uma reunião de EXEMPLO (fictícia) para ver o painel funcionando
// e treinar, sem Meet e sem gastar API. Valores de plano conforme a política de preços.

export const DEMO_SETUP = {
  modo: 'diagnostico',
  origem: 'prevenda',
  comQuem: 'Solar Exemplo (demonstração), Marcos (sócio)',
  objetivo: 'Validar causa-raiz e sair com microdecisão + data',
  foco: 'Combos com serviço, se a causa-raiz justificar',
  notas: 'Exemplo fictício para demonstração.',
};

// [segundos desde o início, quem fala, texto]
export const DEMO_SCRIPT = [
  [2, 'Você', 'Marcos, obrigado pelo tempo. A ideia hoje é entender onde vocês querem chegar e o que está segurando isso. Pode ser?'],
  [7, 'Marcos', 'Pode sim. Na verdade eu vim ver o monitoramento, quero mandar relatório pros clientes.'],
  [12, 'Você', 'Entendi. E hoje vocês estão chegando aonde querem chegar em vendas?'],
  [17, 'Marcos', 'Não. A gente fecha uns 6 projetos por mês e a meta era 12. Lead até chega, mas a proposta demora três dias pra sair.'],
  [24, 'Você', 'E quando a proposta demora, o que acontece com o cliente?'],
  [29, 'Marcos', 'Ele fecha com quem respondeu primeiro. Mês passado perdi uns quatro assim, cada um de uns 25 mil.'],
  [36, 'Marcos', 'E não tem ninguém cobrando os vendedores, cada um faz do seu jeito no WhatsApp.'],
  [43, 'Você', 'Então o relatório resolveria isso ou o ponto é o processo comercial?'],
  [48, 'Marcos', 'Pensando bem, o problema é o comercial. Mas quanto custa isso? Não sei se cabe agora, tá caro tudo.'],
  [56, 'Marcos', 'E eu preciso ver com o meu sócio, o Paulo, ele que cuida do financeiro.'],
  [63, 'Você', 'Faz sentido. Quinta às 15h dá pra gente conversar com o Paulo junto?'],
  [68, 'Marcos', 'Quinta às 15h dá. Pode marcar.'],
];

const base = {
  perguntas: [], alertas: [], falta_cobrir: [], info_chave: [], frases_importantes: [], objecoes: [],
  crm: {}, rota: { solucao: '', motivo: '', investimento: '' },
};
const CAMPOS = ['resultado_desejado', 'situacao_atual', 'dor_literal', 'causa_raiz', 'impacto', 'prioridade', 'alavanca', 'decisores',
  'capacidade_execucao', 'produto', 'motivo', 'objecao', 'canal', 'risco', 'proximo_angulo', 'proximo_passo', 'responsavel', 'data',
  'criterio_perda', 'criterio_reciclagem'];
const crm = (o) => ({ ...Object.fromEntries(CAMPOS.map((k) => [k, ''])), ...o });

// Uma resposta por análise, na ordem.
export const DEMO_ANALISES = [
  { ...base, movimento: 'Abertura', etapa: 'revalidando interesse', portao: 'Por que se importar', estagio_dor: 0, avanco: 'Em andamento', fontes: ['02', '03', '04'], urgencia: 'media',
    proximo_passo: 'Acolha o pedido de monitoramento e investigue o resultado que ele quer.',
    diga: 'Marcos, relatório pro cliente ajuda em quê no seu resultado: vender mais, reter, ganhar indicação?',
    perguntas: ['Você está chegando aonde quer chegar em vendas?', 'O que te fez buscar isso agora?'],
    alertas: ['Pedido de ferramenta não é diagnóstico: monitoramento costuma ser desejo, não dor.'],
    falta_cobrir: ['Resultado desejado', 'Situação atual e gap', 'Decisor'],
    sintese: 'O cliente quer [resultado?], mas hoje está em [situação?]. Ele percebe [dor?], porém a causa prioritária é [causa-raiz?].',
    temperatura: 25, temperatura_motivo: 'curiosidade, dor ainda não apareceu', conducao: 7, conducao_dica: 'Boa abertura; agora investigue o resultado',
    destaque: 'Chegou pedindo monitoramento (desejo, não dor)',
    crm: crm({ situacao_atual: 'Busca monitoramento e relatório para clientes [INFERÊNCIA] desejo, não dor' }) },
  { ...base, movimento: 'Analisar', etapa: 'aprofundando causa', portao: 'Por que se importar', estagio_dor: 2, avanco: 'Em andamento', fontes: ['02', '03'], urgencia: 'alta',
    proximo_passo: 'Aprofunde a demora da proposta: é a causa que mais derruba a meta.',
    diga: 'E quando a proposta demora três dias, o que acontece com esse cliente?',
    perguntas: ['Quantos leads viram proposta por mês?', 'Quem monta a proposta hoje?'],
    alertas: ['Não volte para monitoramento: a dor comercial apareceu.'],
    falta_cobrir: ['Impacto em R$', 'Causa-raiz validada pelo cliente', 'Decisor'],
    info_chave: ['Vendas: 6 projetos/mês', 'Meta: 12 projetos/mês', 'Proposta leva 3 dias'],
    frases_importantes: ['"a proposta demora três dias pra sair"'],
    sintese: 'O cliente quer 12 projetos/mês, mas hoje está em 6. Ele percebe demora na proposta, porém a causa prioritária é [causa-raiz?]. Isso provoca [impacto?].',
    temperatura: 45, temperatura_motivo: 'dor comercial apareceu', conducao: 8, conducao_dica: 'Ótimo: pergunta-mãe trouxe a dor comercial',
    destaque: 'Dor comercial: fecha 6 de uma meta de 12',
    crm: crm({ resultado_desejado: 'Sair de 6 para 12 projetos/mês', situacao_atual: '6 projetos/mês; proposta leva 3 dias', dor_literal: '"a proposta demora três dias pra sair"', alavanca: 'Conversão' }) },
  { ...base, movimento: 'Conectar', etapa: 'validando a síntese', portao: 'Por que mudar', estagio_dor: 3, avanco: 'Em andamento', fontes: ['02', '03'], urgencia: 'alta',
    proximo_passo: 'Devolva a síntese e deixe ele concluir que o problema é o processo comercial.',
    diga: 'Deixa eu ver se entendi: vocês querem 12 por mês, estão em 6, e cada proposta lenta vira venda do concorrente. O que você acha que está por trás disso?',
    perguntas: ['Quem cobra os vendedores hoje?', 'Quanto isso custou no último trimestre?'],
    alertas: ['Deixe o cliente concluir; não afirme por ele.'],
    falta_cobrir: ['Decisor financeiro', 'Capacidade de execução'],
    info_chave: ['Perdeu ~4 vendas no mês passado', 'Ticket médio: ~R$ 25 mil'],
    frases_importantes: ['"perdi uns quatro assim, cada um de uns 25 mil"', '"cada um faz do seu jeito no WhatsApp"'],
    sintese: 'O cliente quer 12 projetos/mês, mas hoje está em 6. Ele percebe demora na proposta, porém a causa prioritária é a falta de processo e gestão comercial. Isso provoca perda de ~R$ 100 mil/mês em vendas. Portanto, a solução é [solução?], desde que [pré-requisitos?].',
    temperatura: 62, temperatura_motivo: 'impacto quantificado pelo próprio cliente', conducao: 8, conducao_dica: 'Impacto veio da boca dele',
    destaque: 'Impacto: ~4 vendas perdidas/mês (~R$ 100 mil)',
    crm: crm({ causa_raiz: 'Sem processo nem gestão comercial (WhatsApp individual, ninguém cobra)', impacto: '~4 vendas/mês perdidas, ~R$ 100 mil [VALIDAR]', prioridade: 'Alta: meta de vendas abaixo do plano' }) },
  { ...base, movimento: 'Investimento', etapa: 'tratando objeção de preço', portao: 'Por que agora', estagio_dor: 3, avanco: 'Continuação', fontes: ['01', '02'], urgencia: 'alta',
    proximo_passo: 'Pergunte quanto cabe no caixa antes de qualquer desconto e traga o sócio para a decisão.',
    diga: 'Marcos, pra eu te mostrar o caminho certo: quanto cabe no caixa por mês hoje?',
    perguntas: ['O Paulo consegue entrar numa conversa esta semana?'],
    alertas: ['Preço travado: caixa, depois descer de plano, só depois desconto.', 'Decisor oculto: Paulo (financeiro).', '"Vou ver com meu sócio" sem checkpoint é continuação.'],
    falta_cobrir: ['Microdecisão + responsável + data'],
    objecoes: [{ objecao: 'Tá caro, não sei se cabe agora', contorno: 'Entendo. Você perdeu uns R$ 100 mil mês passado com proposta lenta. Quanto cabe no caixa por mês hoje, pra eu ajustar a rota sem perder o que resolve a causa?' },
      { objecao: 'Preciso ver com meu sócio', contorno: 'Faz todo sentido. O que o Paulo vai querer ver para decidir? Vamos marcar com ele junto ainda esta semana?' }],
    sintese: 'O cliente quer 12 projetos/mês, mas hoje está em 6. Ele percebe demora na proposta, porém a causa prioritária é a falta de processo e gestão comercial. Isso provoca perda de ~R$ 100 mil/mês. Portanto, a solução é o Growth, desde que [o Paulo valide e o Marcos assuma as reuniões].',
    temperatura: 66, temperatura_motivo: 'objeção de preço e decisor ausente', conducao: 7, conducao_dica: 'Traga o Paulo antes de falar de desconto',
    destaque: 'Objeções: preço e sócio financeiro',
    rota: { solucao: 'Growth (Aceleração Comercial inclusa)', motivo: 'Causa em processo e gestão comercial', investimento: 'Anual parcelado R$ 5.599,20/mês (política)' },
    crm: crm({ decisores: 'Marcos (sócio) presente; Paulo (financeiro) ausente', objecao: 'Preço; precisa do sócio', produto: 'Growth', motivo: 'Causa em processo e gestão comercial' }) },
  { ...base, movimento: 'Reativar', etapa: 'microdecisão fechada', portao: 'Por que agora', estagio_dor: 3, avanco: 'Avanço', fontes: ['02', '05'], urgencia: 'baixa',
    proximo_passo: 'Confirme por escrito: quinta 15h com Marcos e Paulo, pauta e o que o Paulo precisa ver.',
    diga: 'Combinado, quinta às 15h com você e o Paulo. Vou levar o cálculo das vendas perdidas para ele ver.',
    perguntas: [], alertas: [], falta_cobrir: ['Capacidade de execução (quem assume as reuniões)'],
    sintese: 'O cliente quer 12 projetos/mês, mas hoje está em 6. Ele percebe demora na proposta, porém a causa prioritária é a falta de processo e gestão comercial. Isso provoca perda de ~R$ 100 mil/mês. Portanto, a solução é o Growth, desde que o Paulo valide e o Marcos assuma as reuniões.',
    temperatura: 74, temperatura_motivo: 'microdecisão com data e decisor', conducao: 9, conducao_dica: 'Fechou com data, hora e decisor',
    destaque: 'Avanço: quinta 15h com Marcos e Paulo',
    rota: { solucao: 'Growth (Aceleração Comercial inclusa)', motivo: 'Causa em processo e gestão comercial', investimento: 'Anual parcelado R$ 5.599,20/mês (política)' },
    crm: crm({ proximo_passo: 'Reunião de decisão com Marcos e Paulo (Meet)', responsavel: 'Closer', data: 'Quinta 15h', canal: 'Google Meet', proximo_angulo: 'Cálculo das vendas perdidas para o Paulo', criterio_perda: 'Paulo veta e não há gatilho futuro', criterio_reciclagem: 'Revisão orçamentária com data' }) },
];

export const DEMO_ATA = `## 1. Leitura executiva
Diagnóstico Comercial. Marcos chegou pedindo monitoramento, mas a dor é comercial: fecha 6 projetos por mês com meta de 12. Avanço real: reunião de decisão com o sócio marcada.

## 2. Evidências
- "a proposta demora três dias pra sair"
- "perdi uns quatro assim, cada um de uns 25 mil"
- "cada um faz do seu jeito no WhatsApp"
- [INFERÊNCIA] O pedido de monitoramento é desejo, não causa-raiz.

## 3. Mapa ACR
- **Analisar:** resultado, situação e causa levantados. Impacto veio do próprio cliente.
- **Conectar:** síntese validada. Rota Growth pela alavanca de conversão.
- **Reativar:** microdecisão com responsável e data.

## 4. Estágio da dor
**3**: necessidade verbalizada e prioritária ("o problema é o comercial").

## 5. Degrau da decisão
**Por que agora**: travou no caixa e no sócio financeiro.

## 6. Acertos
- Pergunta-mãe trouxe a dor comercial.
- Deixou o cliente quantificar o impacto.

## 7. Falhas e gaps
- Decisor financeiro só apareceu no fim.
- Capacidade de execução não confirmada.

## 8. Saúde e riscos
Avanço real (microdecisão, responsável e data). Risco: Paulo vetar por caixa.

## 9. Rota ou produto
**Growth** (Aceleração Comercial inclusa), pela alavanca de conversão. Investimento conforme a fonte 01 na condição escolhida.

## 10. Plano de 48 horas
- Hoje: enviar confirmação da reunião (closer, WhatsApp).
- Quarta: preparar cálculo das vendas perdidas (closer).

## 11. Cadência e mensagens
Bloqueio: caixa e sócio. Objetivo do toque: confirmar a reunião de quinta.

### Mensagem de follow-up pronta
Marcos, obrigado pela conversa. A meta de 12 projetos trava na proposta lenta e na falta de processo comercial: foram uns 4 projetos perdidos mês passado. Confirmado quinta às 15h com você e o Paulo. Levo o cálculo do impacto pra vocês decidirem o caminho.

## 12. CRM
- **Causa-raiz:** sem processo nem gestão comercial
- **Impacto:** ~4 vendas por mês, ~R$ 100 mil [VALIDAR]
- **Decisor:** Marcos presente; Paulo ausente
- **Capacidade de execução:** [DADO NÃO INFORMADO]
- **Próximo passo:** reunião de decisão
- **Responsável:** closer
- **Data:** quinta 15h

## 13. Decisão
Reunião de decisão com Marcos e Paulo, quinta às 15h, pelo Google Meet. Responsável: closer.

## 14. Fontes consultadas
01, 02, 03, 05 (exemplo).`;

export class DemoCoach {
  constructor() { this.busy = false; this.i = 0; }
  async analyze(_novas, pedido) {
    if (this.busy) return null;
    this.busy = true;
    await new Promise((r) => setTimeout(r, 900)); // simula o tempo de resposta
    this.busy = false;
    if (pedido) {
      // Pedido feito durante a demonstração: resposta de exemplo, sem avançar o roteiro.
      const atual = DEMO_ANALISES[Math.max(0, Math.min(this.i - 1, DEMO_ANALISES.length - 1))];
      return { data: { ...atual, resposta: 'Exemplo: na reunião real o Mentor responde aqui ao seu pedido usando sua base. Ex.: “Growth no anual parcelado fica R$ 5.599,20/mês, com Aceleração Comercial inclusa e implementação isenta.”' } };
    }
    const data = DEMO_ANALISES[Math.min(this.i, DEMO_ANALISES.length - 1)];
    this.i++;
    return { data };
  }
  async ata() { await new Promise((r) => setTimeout(r, 600)); return DEMO_ATA; }
}
