# Junta ANEEL (aneel.json) + IBGE + tarifas e gera o HTML final a partir de src/app.html
import json,glob,statistics,os
W=os.environ.get('WORK','.dados'); J=lambda f: os.path.join(W,f)
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A=json.load(open(J('aneel.json')))
cities=json.load(open(J('cities.json')))
def sidra(f,filt=None):
    d=json.load(open(f))[1:]; out={}
    for r in d:
        if filt and not filt(r): continue
        try: v=float(r['V'])
        except: continue
        out[int(r['D1C'])]=out.get(int(r['D1C']),0)+v
    return out
pop=sidra(J('pop.json')); pib=sidra(J('pib.json')); emp=sidra(J('emp.json'))
domT=sidra(J('dom.json'),lambda r:r['D5N']=='Total' and r['D6N']=='Total')
casaP=sidra(J('dom.json'),lambda r:r['D5N']=='Próprio de algum morador' and r['D6N'] in('Casa','Casa de vila ou em condomínio'))
casaT=sidra(J('dom.json'),lambda r:r['D5N']=='Total' and r['D6N'] in('Casa','Casa de vila ou em condomínio'))
agro={}
for f in glob.glob(J('agro/*.json')):
    for r in json.load(open(f))[1:]:
        if all(r.get(k,'Total')=='Total' for k in ('D5N',)) :
            try: agro[int(r['D1C'])]=agro.get(int(r['D1C']),0)+float(r['V'])
            except: pass
print('agro',len(agro), agro.get(3550308), 'casaP SP',casaP.get(3550308),casaT.get(3550308),domT.get(3550308))
# distributor tariffs by CNPJ
T=json.load(open(J('tar.json')))
cn={}
for l in open(J('distcnpj.txt')):
    s,c=l.strip().split('|'); cn[s]=c
dists=[]
for sig,name in A['dists']:
    t=T.get(cn.get(sig,''))
    dists.append([sig,name.title().replace(' S.A','').replace(' S/A','')[:60], t[0] if t else None])
# stable end month (national)
months=A['months']; tot=[0]*len(months)
for c in A['cities'].values():
    for i,v in enumerate(c['m']): tot[i]+=v
stable=len(months)-1
for i in range(len(months)-1,6,-1):
    if tot[i] >= 0.9*statistics.median(tot[i-6:i]): stable=i; break
print('national',list(zip(months,tot))[-8:],'stable',months[stable])
rows=[]
for ib,name,uf,lat,lon in cities:
    a=A['cities'].get(str(ib))
    base=[ib,name,uf,lat,lon,int(pop.get(ib,0)),int(domT.get(ib,0)),int(casaT.get(ib,0)),int(casaP.get(ib,0)),int(pib.get(ib,0)),int(emp.get(ib,0)),int(agro.get(ib,0))]
    if a:
        base.append([a['n'],round(a['kw']),a['c'],[round(x) for x in a['ck']],a['t'],a['y'],a['m'],[round(x) for x in a['mk']],a['mod'],a['pj'],a['ga'],round(a['gak']),a['mini'],a['ucs'],a['dist'][:2],
                     [[t[0][:48],round(t[1]),t[2],t[3],t[4],t[5]] for t in a['top'][:6]]])
    else: base.append(None)
    rows.append(base)
out=dict(asOf=A['asOf'],gen=__import__('datetime').date.today().isoformat(),months=months,stable=stable,y0=A['y0'],dists=dists,rows=rows)
s=json.dumps(out,ensure_ascii=False,separators=(',',':'))
t=open(os.path.join(ROOT,'src','app.html'),encoding='utf-8').read()
open(os.path.join(ROOT,'mapa-mercado-inteligencia.html'),'w',encoding='utf-8').write(t.replace('__DATA__',s.replace('</','<\\/')))
print('ok',len(s))
