#!/usr/bin/env bash
# Atualiza os dados (ANEEL + IBGE) e regera mapa-mercado-inteligencia.html
# Uso: bash tools/atualizar_dados.sh   (precisa de curl, unzip e python3; ~2 GB livres)
set -euo pipefail
cd "$(dirname "$0")/.."
export WORK="${WORK:-.dados}"; mkdir -p "$WORK/agro"
S=https://apisidra.ibge.gov.br/values
echo "1/5 ANEEL — geração distribuída (~110 MB zip)"
curl -sSL --retry 3 -o "$WORK/gd.zip" "https://dadosabertos.aneel.gov.br/dataset/5e0fafd2-21b9-4d5b-b622-40438d40aba2/resource/b1bd71e7-d0ad-4214-9053-cbd58e9564a7/download/empreendimento-geracao-distribuida.csv"
unzip -o -q "$WORK/gd.zip" -d "$WORK" && rm "$WORK/gd.zip"
echo "2/5 ANEEL — tarifas homologadas"
curl -sSL --retry 3 -o "$WORK/tar.csv" "https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/fcf2906c-7c32-4b9b-a637-054e7a5234f4/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv"
echo "3/5 IBGE — municípios, Censo 2022, PIB, CEMPRE, Censo Agro"
curl -sSL -o "$WORK/cities.json" "https://mapa-mercado.comercialsolarz.tech/data/cities.json"
curl -sS --max-time 600 -o "$WORK/pop.json" "$S/t/4709/n6/all/v/93/p/2022"
curl -sS --max-time 600 -o "$WORK/dom.json" "$S/t/9930/n6/all/v/381/p/2022/c65/95810/c63/73554,95826/c125/6815,121264,2932"
curl -sS --max-time 600 -o "$WORK/pib.json" "$S/t/5938/n6/all/v/37/p/last%201"
curl -sS --max-time 600 -o "$WORK/emp.json" "$S/t/1685/n6/all/v/706/p/last%201"
for uf in 11 12 13 14 15 16 17 21 22 23 24 25 26 27 28 29 31 32 33 35 41 42 43 50 51 52 53; do
  curl -sS --retry 2 --max-time 280 -o "$WORK/agro/$uf.json" "$S/t/6778/n6/in%20n3%20$uf/v/183/p/all/c829/46302/c309/10969/c218/46502/c12553/46523/c12517/113601/c220/110085" &
  sleep 1
done; wait
echo "4/5 Agregando ANEEL por município"
awk -F'";"' 'NR>1{k=$4"|"$3; if(!(k in s)){s[k]=1; print k}}' "$WORK/empreendimento-geracao-distribuida.csv" > "$WORK/distcnpj.txt"
python3 - <<'PY'
import csv,json,os,datetime
W=os.environ['WORK']; today=datetime.date.today().isoformat(); best={}
f=lambda s: float(s.replace(',','.') or 0)
with open(os.path.join(W,'tar.csv'),encoding='utf-8') as fh:
    for x in csv.DictReader(fh,delimiter=';'):
        if (x['DscBaseTarifaria']=='Tarifa de Aplicação' and x['DscSubGrupo']=='B1' and x['DscModalidadeTarifaria']=='Convencional'
            and x['DscClasse']=='Residencial' and x['DscSubClasse']=='Residencial' and x['DscDetalhe']=='Não se aplica' and x['DatFimVigencia']>=today):
            k=x['NumCNPJDistribuidora']
            if k not in best or x['DatInicioVigencia']>best[k]['DatInicioVigencia']: best[k]=x
json.dump({k:[round(f(v['VlrTUSD'])+f(v['VlrTE']),2),round(f(v['VlrTUSD']),2),v['SigAgente'],v['DatInicioVigencia']] for k,v in best.items()},open(os.path.join(W,'tar.json'),'w'),ensure_ascii=False)
PY
python3 tools/agg_aneel.py
echo "5/5 Gerando HTML"
python3 tools/build.py
