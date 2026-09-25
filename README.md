# Mapa de Mercado · Inteligência (SolarZ)

Abra **`mapa-mercado-inteligencia.html`** direto no navegador (duplo clique) ou hospede em qualquer servidor estático.
Um arquivo só, com os dados embutidos. Precisa de internet só para o mapa e as fontes.

## O que tem de novo em relação ao mapa atual
- **Raio em km**: escolhe a cidade e a barra de raio puxa sozinha as vizinhas com usinas (filtro de mínimo de usinas). Dá para desmarcar cidade, adicionar pelo mapa (bolinhas cinza) ou pela busca sem acento.
- **Link pronto**: o botão *Copiar link* guarda cidade + raio + seleção. Prepare antes e abra na reunião.
- **01 Resumo para a reunião**: frases prontas com os números. *Copiar resumo* já sai formatado para WhatsApp.
- **02 Idade da base**: usinas por ano; destaque para as de 4+ anos (argumento do cliente órfão).
- **03 Ritmo de novas usinas**: 24 meses ou por ano, média mensal só com meses consolidados (a ANEEL registra com atraso), crescimento 12m e valor do mercado de venda nova.
- **04 Calculadora de receita recorrente**: % da base captada × plano mensal + limpeza.
- **05 Share do integrador**: digite as usinas e vendas/mês dele e veja a fatia da base e do fluxo.
- **06 Espaço de mercado**: penetração em casas próprias (Censo 2022), empresas (CEMPRE) e propriedades rurais (Censo Agro).
- **07 Perfil da base**: classe, potência, PF/PJ, autoconsumo remoto/compartilhada, Grupo A, ticket médio.
- **08 Energia e distribuidora**: geração e economia estimadas, custo de usina parada, tarifa B1 homologada.
- **09 Ranking de oportunidade** e **10 Maiores usinas de empresas** (prospecção de O&M B2B).
- **PDF** para mandar o estudo ao integrador.

## Atualizar os dados (mensal)
```bash
bash tools/atualizar_dados.sh
```
Baixa ANEEL (geração distribuída + tarifas) e IBGE e regera o HTML a partir de `src/app.html`.
