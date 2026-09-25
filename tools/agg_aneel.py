import csv, json, collections, heapq
import os,sys
W=os.environ.get('WORK','.dados')
F=os.path.join(W,'empreendimento-geracao-distribuida.csv')
CLS={'Residencial':0,'Comercial':1,'Rural':2,'Industrial':3}
MOD={'Geracao na propria UC':0,'Auto consumo remoto':1,'Compartilhada':2,'Condomínio':3}
Y0=2012; YEARS=2026-Y0+1
def tier(kw):
    return 0 if kw<=5 else 1 if kw<=10 else 2 if kw<=15 else 3 if kw<=20 else 4
dists={}; D=[]
cities={}
maxym=''
def new():
    return dict(n=0,kw=0.0,c=[0]*5,ck=[0.0]*5,t=[0]*5,tc=[[0]*5 for _ in range(5)],y=[0]*YEARS,yk=[0.0]*YEARS,ym=collections.Counter(),ymk=collections.Counter(),
                mod=[0]*4,pj=0,ga=0,gak=0.0,mini=0,miniK=0.0,ucs=0,dist=collections.Counter(),top=[],solar=0)
with open(F,encoding='utf-8',newline='') as fh:
    r=csv.reader(fh,delimiter=';')
    h=next(r); ix={k:i for i,k in enumerate(h)}
    for row in r:
        try: ib=int(row[ix['CodMunicipioIbge']])
        except: continue
        try: kw=float(row[ix['MdaPotenciaInstaladaKW']].replace('.','').replace(',','.'))
        except: kw=0.0
        c=cities.get(ib)
        if c is None: c=cities[ib]=new()
        c['n']+=1; c['kw']+=kw
        ci=CLS.get(row[ix['DscClasseConsumo']],4)
        c['c'][ci]+=1; c['ck'][ci]+=kw
        ti=tier(kw); c['t'][ti]+=1; c['tc'][ci][ti]+=1
        d=row[ix['DthAtualizaCadastralEmpreend']][:7]
        if len(d)==7:
            yy=int(d[:4])
            if yy<Y0: yy=Y0
            if yy<=2026:
                c['y'][yy-Y0]+=1; c['yk'][yy-Y0]+=kw
            c['ym'][d]+=1; c['ymk'][d]+=kw
            if d>maxym: maxym=d
        mi=MOD.get(row[ix['DscModalidadeHabilitado']])
        if mi is not None: c['mod'][mi]+=1
        if row[ix['SigTipoConsumidor']]=='PJ': 
            c['pj']+=1
        sub=row[ix['DscSubGrupoTarifario']]
        if sub.startswith('A'): c['ga']+=1; c['gak']+=kw
        if row[ix['DscPorte']].startswith('Mini'): c['mini']+=1; c['miniK']+=kw
        if row[ix['SigTipoGeracao']]=='UFV': c['solar']+=1
        try: c['ucs']+=int(row[ix['QtdUCRecebeCredito']] or 1)
        except: c['ucs']+=1
        ag=row[ix['SigAgente']]
        if ag not in dists: dists[ag]=len(D); D.append([ag,row[ix['NomAgente']]])
        c['dist'][dists[ag]]+=1
        if row[ix['SigTipoConsumidor']]=='PJ' and kw>=20:
            nm=row[ix['NomTitularEmpreendimento']].strip()
            item=(kw,nm,ci,d[:4],sub,row[ix['DscModalidadeHabilitado']][:4])
            if len(c['top'])<10: heapq.heappush(c['top'],item)
            elif kw>c['top'][0][0]: heapq.heapreplace(c['top'],item)
print('maxym',maxym,len(cities))
# last 24 months
y,m=map(int,maxym.split('-'))
months=[]
for i in range(36):
    months.append(f'{y:04d}-{m:02d}'); m-=1
    if m==0: m=12;y-=1
months=months[::-1]
out={}
R=lambda v: round(v,1)
for ib,c in cities.items():
    top=sorted(c['top'],reverse=True)
    out[ib]=dict(n=c['n'],kw=R(c['kw']),c=c['c'],ck=[R(v) for v in c['ck']],t=c['t'],tc=c['tc'],y=c['y'],yk=[R(v) for v in c['yk']],
        m=[c['ym'][k] for k in months],mk=[R(c['ymk'][k]) for k in months],mod=c['mod'],pj=c['pj'],ga=c['ga'],gak=R(c['gak']),
        mini=c['mini'],miniK=R(c['miniK']),ucs=c['ucs'],dist=[[k,v] for k,v in c['dist'].most_common(3)],
        top=[[t[1],R(t[0]),t[2],t[3],t[4],t[5]] for t in top])
json.dump(dict(months=months,y0=Y0,dists=D,asOf=maxym,cities=out),open(os.path.join(W,'aneel.json'),'w'),ensure_ascii=False,separators=(',',':'))
