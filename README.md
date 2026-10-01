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
