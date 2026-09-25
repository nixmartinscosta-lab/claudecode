# Conta empresas de energia solar por município a partir da base pública de CNPJ da Receita Federal
# (espelho: dados-abertos-rf-cnpj.casadosdados.com.br). Gera $WORK/cnpj_agg.json usado pelo build.py.
# Critério: CNPJ ativo, atividade (principal ou secundária) de instalação elétrica/engenharia/material elétrico
# e "solar", "fotovolt", "renovável" etc. no nome fantasia ou razão social.
import zipfile,io,os,re,json,collections,subprocess,sys
W=os.environ.get('WORK','.dados'); D=os.path.join(W,'cnpj'); os.makedirs(D,exist_ok=True)
MES=sys.argv[1] if len(sys.argv)>1 else ''
BASE='https://dados-abertos-rf-cnpj.casadosdados.com.br/arquivos/'
if not MES:
    idx=subprocess.run(['curl','-sSL',BASE],capture_output=True,text=True).stdout
    MES=sorted(re.findall(r'href="(\d{4}-\d{2}-\d{2})/"',idx))[-1]
B=BASE+MES+'/'
files=['Municipios.zip']+[f'Estabelecimentos{i}.zip' for i in range(10)]+[f'Empresas{i}.zip' for i in range(10)]
todo=[f for f in files if not os.path.exists(os.path.join(D,f))]
# baixa 5 em paralelo (bem mais rápido que um por vez)
subprocess.run(['bash','-c','printf "%s\\n" '+' '.join(todo)+f' | xargs -P 5 -I{{}} sh -c \'curl -sSL --retry 5 -o "{D}/{{}}.part" "{B}{{}}" && mv "{D}/{{}}.part" "{D}/{{}}"\''],check=True)
def rows(zpath):
    z=zipfile.ZipFile(zpath)
    for n in z.namelist():
        with z.open(n) as fh:
            for line in io.TextIOWrapper(fh,encoding='latin-1',newline=''):
                yield line.rstrip('\r\n').split('";"')
CN={'4321500','7112000','3321000','4742300','3511501','3511502','4329199','4322302','4751201'}
SOLAR=re.compile(r'SOLAR|FOTOVOLT|\bFV\b|SUNNY|\bSUN\b|FOTON|ENERGIA SOL|ENERGIAS RENOV|ENERGIA RENOV|RENOVAVE',re.I)
mun={r[0].strip('"'):r[1].strip('"') for r in rows(os.path.join(D,'Municipios.zip'))}
keep={}; broad=collections.Counter()
for i in range(10):
    for r in rows(os.path.join(D,f'Estabelecimentos{i}.zip')):
        if len(r)<21 or r[5]!='02': continue
        cp=r[11]; cs=r[12].split(',') if r[12] else []
        if cp=='4321500': broad[(r[20],r[19])]+=1
        if cp in CN or any(c in CN for c in cs): keep[r[0].strip('"')+r[1]]=(r[0].strip('"'),r[4],cp,r[20],r[19],r[10])
    print('estabelecimentos',i,len(keep),flush=True)
bas=set(v[0] for v in keep.values()); razao={}
for i in range(10):
    for r in rows(os.path.join(D,f'Empresas{i}.zip')):
        b=r[0].strip('"')
        if b in bas: razao[b]=r[1]
solar=collections.Counter(); novo=collections.Counter()
ano=MES[:4]; corte=f'{int(ano)-1}{MES[5:7]}01'
for b,fant,cp,m,uf,ini in keep.values():
    if SOLAR.search((fant or '')+' '+razao.get(b,'')):
        solar[(m,uf)]+=1
        if ini>=corte: novo[(m,uf)]+=1
f=lambda c:{f'{a}|{b}':v for (a,b),v in c.items()}
json.dump({'mes':MES,'mun':mun,'solar':f(solar),'solarNew':f(novo),'broad':f(broad)},open(os.path.join(W,'cnpj_agg.json'),'w'),ensure_ascii=False)
print('empresas solares',sum(solar.values()),'abertas 12m',sum(novo.values()),'instaladoras elétricas',sum(broad.values()))
