# Junta ANEEL (aneel.json) + IBGE + NASA POWER + tarifas e gera o HTML final a partir de src/app.html
import json,glob,statistics,os,gzip,base64,datetime,math
W=os.environ.get('WORK','.dados'); J=lambda f: os.path.join(W,f)
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A=json.load(open(J('aneel.json')))
cities=json.load(open(J('cities.json')))
def sidra(f,filt=None):
    out={}
    for r in json.load(open(J(f)))[1:]:
        if filt and not filt(r): continue
        try: v=float(r['V'])
        except: continue
        out[int(r['D1C'])]=out.get(int(r['D1C']),0)+v
    return out
pop=sidra('pop.json'); pop10=sidra('pop10.json'); pib=sidra('pib.json'); emp=sidra('emp.json'); pam=sidra('pam.json')
sal=sidra('sal.json',lambda r:r['D2C']=='10143'); ocup=sidra('sal.json',lambda r:r['D2C']=='707')
domT=sidra('dom.json',lambda r:r['D5N']=='Total' and r['D6N']=='Total')
casaP=sidra('dom.json',lambda r:r['D5N']=='Próprio de algum morador' and r['D6N'] in('Casa','Casa de vila ou em condomínio'))
casaT=sidra('dom.json',lambda r:r['D5N']=='Total' and r['D6N'] in('Casa','Casa de vila ou em condomínio'))
agro={}
for f in glob.glob(J('agro/*.json')):
    for r in json.load(open(f))[1:]:
        try: agro[int(r['D1C'])]=agro.get(int(r['D1C']),0)+float(r['V'])
        except: pass
# irradiação global horizontal média anual (kWh/m²/dia) — NASA POWER, grade de 1°
grid={}
for f in glob.glob(J('power/*.json')):
    for ft in json.load(open(f)).get('features',[]):
        lo,la=ft['geometry']['coordinates'][:2]; v=ft['properties']['parameter']['ALLSKY_SFC_SW_DWN']
        if v['ANN']>0: grid[(round(la*2)/2,round(lo*2)/2)]=(v['ANN'],min(v[m] for m in ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']))
def irr(la,lo):
    best=None;bd=9
    for (gla,glo),v in grid.items():
        if abs(gla-la)>1.5 or abs(glo-lo)>1.5: continue
        d=(gla-la)**2+(glo-lo)**2
        if d<bd: bd=d;best=v
    return best or (5.0,4.0)
# tarifas B1 residencial: atual, ~12 meses antes, ~3 anos antes
T=json.load(open(J('tar2.json')))
cn={}
for l in open(J('distcnpj.txt')):
    s,c=l.strip().split('|'); cn[s]=c
dists=[]
for sig,name in A['dists']:
    t=T.get(cn.get(sig,''))
    dists.append([sig,name.title().replace(' S.A','').replace(' S/A','').rstrip('. ')[:60]]+(t if t else [None,None,None,None]))
months=A['months']; tot=[0]*len(months)
for c in A['cities'].values():
    for k in c['cl']:
        if k:
            for i,v in enumerate(k[4]): tot[i]+=v
stable=len(months)-1
for i in range(len(months)-1,6,-1):
    if tot[i] >= 0.9*statistics.median(tot[i-6:i]): stable=i; break
rows=[]
for ib,name,uf,lat,lon in cities:
    a=A['cities'].get(str(ib)); hs=irr(lat,lon)
    base=[ib,name,uf,lat,lon,int(pop.get(ib,0)),int(pop10.get(ib,0)),int(domT.get(ib,0)),int(casaT.get(ib,0)),int(casaP.get(ib,0)),
          int(pib.get(ib,0)),int(emp.get(ib,0)),round(sal.get(ib,0)),int(ocup.get(ib,0)),int(agro.get(ib,0)),int(pam.get(ib,0)),round(hs[0],2),round(hs[1],2)]
    base.append([a['cl'],a['mod'],a['pj'],a['ga'],a['gak'],a['mini'],a['ucs'],a['dist'][:2],a['top']] if a else None)
    rows.append(base)
out=dict(asOf=A['asOf'],gen=datetime.date.today().isoformat(),months=months,stable=stable,y0=A['y0'],dists=dists,rows=rows)
s=json.dumps(out,ensure_ascii=False,separators=(',',':')).encode('utf-8')
b64=base64.b64encode(gzip.compress(s,9)).decode()
t=open(os.path.join(ROOT,'src','app.html'),encoding='utf-8').read()
open(os.path.join(ROOT,'mapa-mercado-inteligencia.html'),'w',encoding='utf-8').write(t.replace('__DATA__',b64))
print('stable',months[stable],'json',len(s),'gz64',len(b64),'grid',len(grid))
