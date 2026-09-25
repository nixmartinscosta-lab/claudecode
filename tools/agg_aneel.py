# Agrega a base de Geração Distribuída da ANEEL por município e por classe de consumo
import csv, json, collections, heapq, os
W=os.environ.get('WORK','.dados')
F=os.path.join(W,'empreendimento-geracao-distribuida.csv')
CLS={'Residencial':0,'Comercial':1,'Rural':2,'Industrial':3}
MOD={'Geracao na propria UC':0,'Auto consumo remoto':1,'Compartilhada':2,'Condomínio':3}
Y0=2012; NY=2026-Y0+1
def tier(kw): return 0 if kw<=5 else 1 if kw<=10 else 2 if kw<=20 else 3 if kw<=75 else 4
def newc(): return dict(n=0,kw=0.0,t=[0]*5,y=[0]*NY,ym=collections.Counter(),ymk=collections.Counter())
dists={}; D=[]; cities={}; maxym=''
with open(F,encoding='utf-8',newline='') as fh:
    r=csv.reader(fh,delimiter=';'); h=next(r); ix={k:i for i,k in enumerate(h)}
    I=lambda k: ix[k]
    iM,iK,iC,iD,iMo,iT,iS,iP,iG,iU,iA,iAN,iN=map(I,['CodMunicipioIbge','MdaPotenciaInstaladaKW','DscClasseConsumo','DthAtualizaCadastralEmpreend','DscModalidadeHabilitado','SigTipoConsumidor','DscSubGrupoTarifario','DscPorte','SigTipoGeracao','QtdUCRecebeCredito','SigAgente','NomAgente','NomTitularEmpreendimento'])
    for row in r:
        try: ib=int(row[iM])
        except: continue
        try: kw=float(row[iK].replace('.','').replace(',','.'))
        except: kw=0.0
        c=cities.get(ib)
        if c is None: c=cities[ib]=dict(cl=[newc() for _ in range(5)],mod=[0]*4,pj=0,ga=0,gak=0.0,mini=0,ucs=0,dist=collections.Counter(),top=[])
        ci=CLS.get(row[iC],4); k=c['cl'][ci]
        k['n']+=1; k['kw']+=kw; k['t'][tier(kw)]+=1
        d=row[iD][:7]
        if len(d)==7:
            yy=min(2026,max(Y0,int(d[:4]))); k['y'][yy-Y0]+=1
            k['ym'][d]+=1; k['ymk'][d]+=kw
            if d>maxym: maxym=d
        mi=MOD.get(row[iMo])
        if mi is not None: c['mod'][mi]+=1
        pj=row[iT]=='PJ'
        if pj: c['pj']+=1
        sub=row[iS]
        if sub.startswith('A'): c['ga']+=1; c['gak']+=kw
        if row[iP].startswith('Mini'): c['mini']+=1
        try: c['ucs']+=int(row[iU] or 1)
        except: c['ucs']+=1
        ag=row[iA]
        if ag not in dists: dists[ag]=len(D); D.append([ag,row[iAN]])
        c['dist'][dists[ag]]+=1
        if pj and kw>=20:
            item=(kw,row[iN].strip(),ci,d[:4],sub,row[iMo][:4])
            if len(c['top'])<8: heapq.heappush(c['top'],item)
            elif kw>c['top'][0][0]: heapq.heapreplace(c['top'],item)
y,m=map(int,maxym.split('-')); months=[]
for i in range(36):
    months.append(f'{y:04d}-{m:02d}'); m-=1
    if m==0: m=12; y-=1
months=months[::-1]
R=lambda v: round(v,1)
out={}
for ib,c in cities.items():
    cl=[]
    for k in c['cl']:
        if not k['n']: cl.append(0); continue
        m=[k['ym'][x] for x in months]; mk=[round(k['ymk'][x]) for x in months]
        cl.append([k['n'],round(k['kw']),k['t'],k['y'],m,mk])
    out[ib]=dict(cl=cl,mod=c['mod'],pj=c['pj'],ga=c['ga'],gak=round(c['gak']),mini=c['mini'],ucs=c['ucs'],
        dist=[[a,b] for a,b in c['dist'].most_common(3)],top=[[t[1][:48],round(t[0]),t[2],t[3],t[4],t[5]] for t in sorted(c['top'],reverse=True)])
json.dump(dict(months=months,y0=Y0,dists=D,asOf=maxym,cities=out),open(os.path.join(W,'aneel.json'),'w'),ensure_ascii=False,separators=(',',':'))
print('ok',maxym,len(out))
