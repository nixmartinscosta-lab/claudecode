# Mapa de Mercado · Inteligência (SolarZ)

Abra **`mapa-mercado-inteligencia.html`** no navegador (duplo clique) ou hospede em qualquer servidor estático.
Arquivo único (~3 MB) com os dados de 5.570 municípios embutidos e comprimidos. Internet só para o mapa e as fontes.

## Como usar na reunião
1. Escolha **cidade**, **raio** e **perfil do integrador** (Residencial, Empresas, Agro, Investidor/usinas, O&M/limpeza ou Visão geral).
2. Ajuste no topo: **Classes de consumo**, **Ritmo de venda** (média de 3, 6 ou 12 meses) e **Base antiga** (conectadas até 2019–2023).
3. No mapa: arraste o **raio**, filtre **cidades com X+ usinas**, troque a **cor das bolinhas** (score, crescimento, penetração, base antiga, ritmo, irradiação) e clique nas cinzas para incluir.
4. **▶ Apresentar** abre 8 slides em tela cheia (← → para navegar, Esc para sair).
5. **Copiar link** guarda tudo (cidade, raio, perfil, filtros, cidades incluídas/excluídas). **PDF** para enviar depois.

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

## Atualizar os dados (mensal)
```bash
bash tools/atualizar_dados.sh
```
Baixa tudo e regera o HTML a partir de `src/app.html` (precisa de curl, unzip, python3 e ~2 GB livres).
