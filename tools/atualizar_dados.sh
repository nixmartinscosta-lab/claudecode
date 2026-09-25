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
echo "3/5 IBGE (Censo 2022/2010, PIB, CEMPRE, Censo Agro, PAM) e NASA POWER (irradiação)"
curl -sSL -o "$WORK/cities.json" "https://mapa-mercado.comercialsolarz.tech/data/cities.json"
curl -sS --max-time 600 -o "$WORK/pop.json" "$S/t/4709/n6/all/v/93/p/2022"
curl -sS --max-time 600 -o "$WORK/dom.json" "$S/t/9930/n6/all/v/381/p/2022/c65/95810/c63/73554,95826/c125/6815,121264,2932"
curl -sS --max-time 600 -o "$WORK/pib.json" "$S/t/5938/n6/all/v/37/p/last%201"
curl -sS --max-time 600 -o "$WORK/emp.json" "$S/t/1685/n6/all/v/706/p/last%201"
curl -sS --max-time 600 -o "$WORK/sal.json" "$S/t/1685/n6/all/v/1606,10143,707/p/last%201"
curl -sS --max-time 600 -o "$WORK/pam.json" "$S/t/5457/n6/all/v/215/p/last%201/c782/0"
curl -sS --max-time 600 -o "$WORK/pop10.json" "$S/t/202/n6/all/v/93/p/2010/c2/0/c1/0"
mkdir -p "$WORK/power"
for la in -34 -24 -14 -4; do for lo in -74 -64 -54 -44; do
  curl -sS --retry 2 --max-time 300 -o "$WORK/power/${la}_${lo}.json" "https://power.larc.nasa.gov/api/temporal/climatology/regional?parameters=ALLSKY_SFC_SW_DWN&community=RE&latitude-min=$la&latitude-max=$((la+10))&longitude-min=$lo&longitude-max=$((lo+10))&format=JSON" &
  sleep 2
done; done; wait
for uf in 11 12 13 14 15 16 17 21 22 23 24 25 26 27 28 29 31 32 33 35 41 42 43 50 51 52 53; do
  curl -sS --retry 2 --max-time 280 -o "$WORK/agro/$uf.json" "$S/t/6778/n6/in%20n3%20$uf/v/183/p/all/c829/46302/c309/10969/c218/46502/c12553/46523/c12517/113601/c220/110085" &
  sleep 1
done; wait
echo "3b/5 Receita Federal — empresas de energia solar por município (~6 GB, opcional: pule com SKIP_CNPJ=1)"
[ -n "${SKIP_CNPJ:-}" ] || python3 tools/cnpj_integradores.py
echo "4/5 Agregando ANEEL por município"
awk -F'";"' 'NR>1{k=$4"|"$3; if(!(k in s)){s[k]=1; print k}}' "$WORK/empreendimento-geracao-distribuida.csv" > "$WORK/distcnpj.txt"
python3 - <<'PY'
# tarifa B1 residencial por distribuidora: vigente, ~12 meses antes e ~3 anos antes
import csv,json,os,datetime
W=os.environ['WORK']; today=datetime.date.today().isoformat(); hist={}
f=lambda s: float(s.replace(',','.') or 0)
with open(os.path.join(W,'tar.csv'),encoding='utf-8') as fh:
    for x in csv.DictReader(fh,delimiter=';'):
        if (x['DscBaseTarifaria']=='Tarifa de Aplicação' and x['DscSubGrupo']=='B1' and x['DscModalidadeTarifaria']=='Convencional'
            and x['DscClasse']=='Residencial' and x['DscSubClasse']=='Residencial' and x['DscDetalhe']=='Não se aplica'):
            hist.setdefault(x['NumCNPJDistribuidora'],{})[x['DatInicioVigencia']]=f(x['VlrTUSD'])+f(x['VlrTE'])
T={}
for k,h in hist.items():
    ds=sorted(d for d in h if d<=today)
    if not ds: continue
    c=ds[-1]; y,m,d=c.split('-')
    back=lambda n: [x for x in ds if x<=f"{int(y)-n:04d}-{m}-{d}"]
    p1,p3=back(1),back(3)
    T[k]=[round(h[c],2),c,round(h[p1[-1]],2) if p1 else None,round(h[p3[-1]],2) if p3 else None]
json.dump(T,open(os.path.join(W,'tar2.json'),'w'))
PY
python3 tools/agg_aneel.py
echo "5/5 Gerando HTML"
python3 tools/build.py
