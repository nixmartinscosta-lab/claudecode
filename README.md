# Mentor de Reunião (extensão Chrome + painel ao vivo)

A extensão **captura as legendas do Google Meet em tempo real** e abre um **painel ao vivo em tela cheia** (janela própria, ideal no 2º monitor). O motor é o **Google Gemini** (`gemini-3.5-flash` por padrão), seguindo o *seu* playbook (ACR, portões, política de preços, prova social, cadência…).

No painel você vê, atualizando sozinho:

| Bloco | O que é |
|---|---|
| **AGORA** | 1 ação para os próximos 30–60 s (borda vermelha = responda já) |
| **DIGA** | frase pronta pra falar (botão copiar) |
| **PERGUNTE** | até 3 perguntas que avançam o diagnóstico |
| **⚠ ATENÇÃO** | gaps de risco: preço antes da dor, decisor oculto, continuação disfarçada… |
| **☐ FALTA COBRIR** | itens obrigatórios do método que ainda não apareceram |
| **Movimento / Portões** | barra de progresso: fase da reunião e portão travado (vermelho) |
| **Rota recomendada** | combo/composição + motivo + investimento oficial (só após a dor validada) |
| **Ficha CRM** | os 10 campos obrigatórios preenchendo ao vivo |
| **Memória** | números e fatos captados |
| **Me ajuda AGORA** | pergunta livre (“quanto fica o Growth anual à vista?”) |
| **Encerrar + Ata** | resultado (avanço/continuação/perda), campos do CRM, síntese ACR, **follow-up pronto pro WhatsApp** e auditoria do closer. Baixa em `.md`. |

O foco padrão é **vender combos com serviço (Business, Growth, Scale) e composições**, mas só quando a causa-raiz justifica. O Mentor não força plano sem aderência e não inventa preço nem case.

## Novidades do painel

- **🧠 Mapa mental ao vivo** (centro): integrador no meio; à direita o diagnóstico (resultado → operação → dor → causa-raiz → impacto), à esquerda a decisão (decisores → objeções com contorno → rota/combo → próximos passos). Zoom, arrastar, tela cheia (`M`).
- **🧵 Linha do raciocínio**: a fórmula de diagnóstico do ACR se preenchendo, com as lacunas destacadas.
- **Indicadores**: temperatura do negócio, diagnóstico x/10, tempo de fala, suas perguntas, objeções abertas e **nota de condução** (com a correção mais importante).
- **Preparação**: origem (🆕 lead novo da pré-venda / 🔁 avanço que você marcou) + **dossiê do lead** (arraste `.txt`/`.md`/`.csv` com conversas e registros). Ao começar, o Mentor faz um **briefing** e já monta o mapa com o histórico.
- O Mentor conhece seus gaps (conforto no pós-venda, concluir pelo cliente, antecipar objeção, dois caminhos, fechamento/follow-up) e te corrige ao vivo.

- **Ver demonstração**: simula uma reunião de exemplo completa (sem Meet e sem gastar API) para você ver tudo funcionando e treinar.
- **Histórico**: cada reunião encerrada fica salva no navegador. Na reunião de avanço, digite o nome do lead na Preparação e clique em **+ dossiê** na reunião anterior.
- **Ata formatada** com botão **Copiar follow-up**.
- **Janela estreita**: com a janela do painel estreita (ao lado do Meet), tudo vira uma coluna na ordem de prioridade.

- **Pronto pra reunião**: na Preparação, selos mostram se a chave, a base, o Meet e as legendas estão ok. Durante a reunião, o selo no topo mostra **Ouvindo / Aguardando fala / Legendas off**.
- **Resposta ao seu pedido** em cartão próprio; atalhos rápidos nas teclas **1–7**.
- **Testar chave** nas Configurações valida a chave e o modelo do Gemini na hora.

- **Legibilidade máxima**: todo texto com contraste medido (WCAG AAA ≥ 7:1 no texto principal), sem texto apagado; fontes maiores; **números, R$ e % em marca-texto** em tudo (transcrição, mapa, ficha, respostas).
- **Quadro** (padrão) ou **Mapa**: o Quadro mostra os 9 ramos do mapa em cartões com letra grande; o Mapa mostra as conexões.

- **Preços** (aba ou tecla `P`): tabela da régua de descontos da sua política (base, 4x, 6x, 12x, à vista), com a rota recomendada destacada; clique copia o valor.
- **Retomar reunião**: se a janela do painel fechar no meio, ao abrir de novo aparece **Retomar** com transcrição, mapa, ficha e memória do Mentor.

- **Quanto o plano se paga** (na aba Preços): plano + condição + ticket médio + margem → quantas vendas a mais por mês pagam o investimento, com frase pronta em forma de pergunta. O ticket é preenchido com o que o cliente falou.

- **Correções oficiais** (Configurações): regras com prioridade sobre os arquivos da base (já vem com Start = R$ 1.350).
- **Modo Foco** (botão ou tecla `F`): só AGORA, DIGA, objeção e resposta, em letra grande. `Esc` sai.

- **Doutrina Mentor 2.0** (`src/doutrina.js`): hierarquia de fontes 01 a 08, ACR, 4 degraus da decisão, estágio da dor 0 a 3, avanço × continuação, marcadores de evidência ([INFERÊNCIA], [VALIDAR], [DADO NÃO INFORMADO], [CONTRADIÇÃO DE FONTE]), voz sem travessão. O briefing segue o modo PREPARAR e a ata segue a análise completa em 14 seções.

## Instalar (5 min, uma vez)

1. Baixe esta pasta (Code → Download ZIP) e descompacte.
2. No Chrome, abra `chrome://extensions`, ligue o **Modo do desenvolvedor**, clique em **Carregar sem compactação** e escolha a pasta **`extension/`**.
3. Abra **⚙ Configurações** (clique com o botão direito no ícone da extensão → Opções):
   - cole sua **Gemini API key** ([aistudio.google.com](https://aistudio.google.com) → Get API key);
   - em **Base de conhecimento**, selecione seus `.md` (playbook, preços, ACR, contexto, cadência, prova social, script);
   - **Salvar**.

## Usar em cada reunião

1. Entre no Google Meet e **ative as legendas** (tecla `c`), com o idioma em **Português**.
2. Clique no ícone da extensão (ou `Alt+Shift+M`): abre a janela do painel ao vivo. Deixe ao lado do Meet.
3. Preencha em 30 s: tipo de reunião, cliente, objetivo e o que a pré-venda levantou.
4. **▶ Começar**. O Mentor orienta sozinho a cada 30 s (só se houve fala nova) e **na hora** quando o cliente faz uma pergunta.
5. No fim, **■ Encerrar + Ata**.

> Se instalou a extensão com o Meet já aberto, recarregue a aba do Meet (F5) uma vez.

## Custo

- Transcrição: **grátis** (usa as legendas do próprio Meet).
- IA: cada análise manda só a fala nova; a base de conhecimento repetida é reaproveitada pelo cache implícito do Gemini. O contador de tokens aparece no topo do painel.
- O modelo é configurável (ex.: `gemini-3.5-flash-lite` para gastar menos).

## Outras plataformas (Zoom/Teams no navegador)

Em Configurações → Fonte, escolha **Áudio da aba + microfone via Deepgram**, cole uma chave do [Deepgram](https://deepgram.com) e clique em **Liberar microfone**.

## Para desenvolver

```bash
npm install
npm run build   # gera extension/dashboard.bundle.js a partir de src/
```

- `extension/meet.js`: lê as legendas do Meet (seletores conhecidos + heurística genérica).
- `src/prompts.js`: doutrina do Mentor, schema da resposta e pedido da ata.
- `src/coach.js`: motor Gemini (REST `generateContent`), conversa *append-only*.
- `src/dashboard.js` + `extension/dashboard.html`: painel ao vivo.
- `extension/offscreen.js`: modo áudio (Deepgram).

**Privacidade:** a chave e os `.md` ficam só no `chrome.storage` do seu navegador. Não suba os `.md` internos para o repositório.
