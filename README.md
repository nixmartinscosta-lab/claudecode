# Mapa de Mercado · Inteligência (SolarZ)

Abra **`mapa-mercado-inteligencia.html`** no navegador (duplo clique) ou hospede em qualquer servidor estático.
Arquivo único (~3 MB) com os dados de 5.570 municípios embutidos e comprimidos. Internet só para o mapa e as fontes.

## Como usar na reunião
**Tela do cliente** (a que você compartilha): só dados visuais, sem roteiro interno.
1. Escolha **cidade**, **raio** e **perfil do integrador**.
2. Topo: **Perfil**, **Classes**, **Ritmo de venda** (3/6/12 meses) e **Base antiga** (até 2019–2023).
3. Mapa: raio, “cidades com X+ usinas”, cor por métrica; clique nas cidades cinza para incluir. Etiquetas abaixo do mapa tiram/incluem cidades com um clique.
4. **▶ Apresentar**: 8 slides em tela cheia (← →, Esc).
5. **⋯ Mais**: painel do closer, copiar link, PDF, nova consulta.

**Painel do closer** (⋯ Mais → Painel do closer): abre numa **aba separada** — não compartilhe. Tem roteiro com os números da região, perguntas de diagnóstico, fatia do integrador, objeções e respostas, cola de números, lista de empresas e botões para copiar (WhatsApp/Excel). Acompanha automaticamente o que você muda na tela do cliente. No Meet, compartilhe **só a aba** do cliente.

## Estrutura da tela (v5)
Cada linha tem: **capítulo** (Diagnóstico · Mercado · Venda nova · Pós-venda · Estratégia), **frase-resumo**, **💡 como ler** em linguagem simples, número em destaque à esquerda e gráfico à direita.
- **Termômetro do mercado**: veredito honesto (ainda tem mercado / disputado / demanda limitada) com 4 medidores: demanda, espaço livre, concorrência e base para pós-venda.
- **Sua empresa no mercado** (aparece quando o closer liga no painel): participação na base e nas vendas, comparação com a média por empresa, funil de leads e teste de **meta realista** (sugere o raio que comporta a meta).
- **O que ainda dá pra vender**: mercado de venda de kit em R$ por segmento + o que o mercado vendeu nos últimos 12 meses.
- **Concorrência**: empresas de energia solar ativas por cidade (Receita Federal), usinas e vendas por empresa.
- **Onde atacar**: score com os **pontos de cada critério** em colunas e barra empilhada.
- **Mapa**: municípios pintados pela métrica (malha IBGE), bolhas = nº de usinas, nomes das principais cidades.

## O que o perfil muda
| Perfil | Classes | Espaço de mercado | Plano sugerido | Ordem das seções |
|---|---|---|---|---|
| Visão geral | todas | casas próprias sem solar | R$ 35 | geral → base → venda → receita → alvos → monitoramento |
| Residencial | residencial | casas próprias sem solar | R$ 35 | geral → venda → base → … |
| Empresas | comercial + industrial | empresas sem solar | R$ 120 | geral → onde atacar → base → … |
| Agro | rural | propriedades rurais sem solar | R$ 80 | geral → venda → base → onde atacar → … |
| Investidor / usinas | todas (destaque remoto/compartilhada/mini) | — | R$ 250 | geral → monitoramento → onde atacar → … |
| O&M / limpeza | todas (score pesa base antiga) | mercado de limpeza/ano | R$ 35 | geral → base → monitoramento → … |

## Fontes
- **ANEEL**: Empreendimentos de Geração Distribuída (base, classe, potência, data, modalidade, PJ, Grupo A, distribuidora) e Tarifas Homologadas (B1 atual, 12 meses e 3 anos atrás).
- **IBGE**: Censo 2022 (população, domicílios, casas próprias), Censo 2010 (crescimento), PIB dos Municípios, CEMPRE (empresas, salário médio), Censo Agro 2017, PAM (valor da produção agrícola).
- **NASA POWER**: irradiação solar média por coordenada (grade de 1°).
- **Receita Federal (CNPJ)**: empresas com CNPJ ativo e “solar” no nome em atividades de instalação elétrica/engenharia/material elétrico (espelho Casa dos Dados). Estimativa: nem todo integrador usa “solar” no nome.
- **IBGE malhas**: contorno dos municípios, carregado no navegador (precisa de internet).

## Atualizar os dados (mensal)
```bash
bash tools/atualizar_dados.sh
```
Baixa tudo e regera o HTML a partir de `src/app.html` (precisa de curl, unzip, python3 e ~2 GB livres).
