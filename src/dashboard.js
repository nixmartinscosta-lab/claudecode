import { Coach } from './coach.js';
import { DemoCoach, DEMO_SETUP, DEMO_SCRIPT } from './demo.js';
import { acharPolitica, lerPrecos } from './precos.js';
import { CRM_CAMPOS, MOVIMENTOS, PORTOES, PEDIDO_BRIEFING } from './prompts.js';

const $ = (id) => document.getElementById(id);
const SETUP_FIELDS = ['modo', 'comQuem', 'objetivo', 'foco', 'notas'];
const DEFAULTS = {
  geminiKey: '', deepgramKey: '', source: 'meet', model: 'gemini-3.5-flash', thinking: 'low',
  intervalSec: 25, useMic: true, dgModel: 'nova-2', dgLanguage: 'pt-BR',
};
const FOCO_PADRAO = 'Combos com serviço (Business, Growth, Scale) ou composições com Pós-venda / Aceleração, se a causa-raiz justificar';
const MODO_NOME = { diagnostico: 'Diagnóstico Comercial', ecossistema: 'Reunião do Ecossistema', followup: 'Follow-up', livre: 'Livre' };
const N_CRM = Object.keys(CRM_CAMPOS).length;
const NEW_MS = 12000;

// Mapa: lado direito = diagnóstico (A do ACR), lado esquerdo = decisão (C/R).
const BRANCHES = {
  resultado: { t: 'Resultado desejado', side: 'right' },
  operacao: { t: 'Operação hoje', side: 'right' },
  dor: { t: 'Dor, nas palavras dele', side: 'right' },
  causa: { t: 'Causa-raiz', side: 'right' },
  impacto: { t: 'Impacto', side: 'right' },
  decisores: { t: 'Decisores e execução', side: 'left' },
  objecoes: { t: 'Objeções e contorno', side: 'left' },
  rota: { t: 'Rota / combo', side: 'left' },
  proximos: { t: 'Próximos passos', side: 'left' },
};
const MAX_LEAVES = 3;

const freshState = () => ({
  running: false, coach: null, source: 'meet', lines: [], sentUpTo: 0, interim: {}, startedAt: 0, tick: null,
  questionTimer: null, sinceAnalysis: 0, intervalSec: 25, lastAt: 0,
  crm: {}, crmLocked: new Set(), covered: new Set(), pendingNotes: [],
  memoria: [], pinned: new Set(), map: {}, collapsed: new Set(), expanded: new Set(), openObj: [], objTotal: 0,
  talk: {}, qTimes: [], talkWarned: false, temp: null, cond: null, drawn: new Set(),
  view: { x: 0, y: 0, s: 1 }, userView: false,
});
const state = { ...freshState(), meetTabId: Number(new URLSearchParams(location.search).get('tab')) || null };

// ================= utilidades =================
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 1700); }
function copy(text, msg = 'Copiado ✔') { navigator.clipboard.writeText(text).then(() => toast(msg)); }
function setStatus(text, level = '') { const s = $('status'); s.hidden = !text; s.textContent = text || ''; s.className = `status ${level}`; }
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const elapsedSec = () => (state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0);
// Anel: fração 0..1 com cor.
function setRing(id, frac, color) {
  const c = $(id); const len = 113.1;
  c.style.strokeDashoffset = String(len * (1 - Math.max(0, Math.min(1, frac))));
  if (color) c.style.stroke = color;
}
function bump(id) { const k = $(id).closest('.kpi'); k.classList.remove('bump'); void k.offsetWidth; k.classList.add('bump'); }
// Escreve o texto destacando números, valores e percentuais (marca-texto).
const NUM_RE = /(R\$\s?\d+(?:[.,]\d+)*(?:\s?(?:mil|milhões|milhão|k)\b)?|\d+(?:[.,]\d+)*(?:\s?(?:%|mil\b|milhões\b|milhão\b|k\b))?)/gi;
function hl(node, text) {
  node.textContent = '';
  String(text ?? '').split(NUM_RE).forEach((part, i) => {
    if (!part) return;
    if (i % 2 === 1) { const m = document.createElement('mark'); m.className = 'num'; m.textContent = part; node.append(m); }
    else node.append(document.createTextNode(part));
  });
  return node;
}
// Como setText, mas com destaque de números; compara pelo texto bruto.
function setRich(id, v) { const e = $(id); if (e.dataset.raw === String(v)) return false; e.dataset.raw = String(v); hl(e, v); return true; }
function setText(id, v) { if ($(id).textContent !== String(v)) { $(id).textContent = v; return true; } return false; }

// ================= montagem =================
MOVIMENTOS.forEach((t) => $('movimentos').append(el('li', '', t)));
PORTOES.forEach((t) => $('portoes').append(el('li', '', t)));

document.querySelectorAll('.tabs').forEach((bar) => bar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab'); if (!btn) return;
  bar.querySelectorAll('.tab').forEach((b) => { b.classList.toggle('active', b === btn); $(b.dataset.tab).hidden = b !== btn; });
  
  if (btn.dataset.tab === 'tTimeline') { $('tlCount').hidden = true; $('tlCount').textContent = ''; }
  $('viewSeg').hidden = btn.dataset.tab !== 'tMapa';
  if (btn.dataset.tab === 'tMapa') requestAnimationFrame(() => { fitIfAuto(); drawLinks(); });
}));

let leadDocs = [];
chrome.storage.local.get(['setup', 'docs', 'leadDocs']).then(({ setup, docs, leadDocs: ld }) => {
  if (setup) SETUP_FIELDS.forEach((f) => { if (setup[f] != null) $(f).value = setup[f]; });
  if (setup?.origem) document.querySelector(`input[name="origem"][value="${setup.origem}"]`).checked = true;
  leadDocs = ld || []; renderLeadFiles();
  if (!$('foco').value) $('foco').value = FOCO_PADRAO;
  $('kbInfo').textContent = docs?.length ? `${docs.length} arquivo(s) na base` : 'Suba seus .md nas configurações';
  showContext();
});
SETUP_FIELDS.forEach((f) => $(f).addEventListener('input', showContext));
// ---- dossiê do lead ----
function renderLeadFiles() {
  const ul = $('leadList'); ul.innerHTML = '';
  leadDocs.forEach((d, i) => {
    const li = el('li');
    li.append(el('span', '', '📄'), el('span', 'fn', d.name), el('span', 'muted', `${Math.max(1, Math.round(d.content.length / 1000))}k`));
    const x = el('span', 'x', '✕'); x.title = 'remover';
    x.onclick = () => { leadDocs.splice(i, 1); saveLead(); };
    li.append(x); ul.append(li);
  });
  $('clearLead').hidden = !leadDocs.length;
}
function saveLead() { chrome.storage.local.set({ leadDocs }); renderLeadFiles(); }
async function addLeadFiles(files) {
  if (!leadDocs.length) chrome.storage.local.set({ leadOwner: $('comQuem').value.trim() });
  for (const f of files) {
    if (f.size > 2_000_000) { toast(`${f.name} é grande demais (máx. 2 MB)`); continue; }
    const content = await f.text();
    const i = leadDocs.findIndex((d) => d.name === f.name);
    if (i >= 0) leadDocs[i] = { name: f.name, content }; else leadDocs.push({ name: f.name, content });
  }
  saveLead(); toast(`📂 Dossiê: ${leadDocs.length} arquivo(s)`);
}
$('pickFiles').onclick = (e) => { e.preventDefault(); $('leadFiles').click(); };
$('leadFiles').onchange = (e) => { addLeadFiles([...e.target.files]); e.target.value = ''; };
$('clearLead').onclick = () => { leadDocs = []; saveLead(); chrome.storage.local.remove('leadOwner'); };
const dz = $('dropZone');
dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('over'); });
dz.addEventListener('dragleave', () => dz.classList.remove('over'));
dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('over'); addLeadFiles([...e.dataTransfer.files]); });

function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  s.origem = document.querySelector('input[name="origem"]:checked').value;
  chrome.storage.local.set({ setup: s });
  return s;
}
function clienteNome() { return ($('comQuem').value.split(/\s[—–-]\s|,/)[0] || '').trim(); }
function showContext() {
  $('ctxObjetivo').textContent = $('objetivo').value.trim() || '—';
  $('ctxFoco').textContent = $('foco').value.trim() || '—';
  $('ctxObjetivo').title = $('objetivo').value; $('ctxFoco').title = $('foco').value;
  $('clienteTop').textContent = $('comQuem').value.trim() || 'Nova reunião';
  $('modoTop').textContent = MODO_NOME[$('modo').value] || '';
  $('mapCliente').textContent = clienteNome() || 'Integrador';
}
$('btnSetup').onclick = () => { $('setupBox').hidden = !$('setupBox').hidden; };
$('btnCollapse').onclick = () => { document.body.classList.add('right-collapsed'); $('btnExpand').hidden = false; requestAnimationFrame(() => { fitIfAuto(); drawLinks(); }); };
$('btnExpand').onclick = () => { document.body.classList.toggle('right-collapsed', false); document.body.classList.toggle('show-right'); $('btnExpand').hidden = !matchMedia('(max-width: 1250px)').matches; requestAnimationFrame(() => { fitIfAuto(); drawLinks(); }); };

// ================= ficha CRM =================
function renderCrm(novos = []) {
  const dl = $('crm'); dl.innerHTML = '';
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dd = state.crm[k] ? hl(el('dd'), state.crm[k]) : el('dd', '', 'ainda não levantado');
    dd.id = `crm_${k}`;
    dd.contentEditable = 'plaintext-only';
    dd.spellcheck = false;
    dd.classList.toggle('empty', !state.crm[k]);
    dd.classList.toggle('locked', state.crmLocked.has(k));
    if (novos.includes(k)) dd.classList.add('flash');
    dd.addEventListener('focus', () => { if (!state.crm[k]) dd.textContent = ''; });
    dd.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); dd.blur(); } });
    dd.addEventListener('blur', () => {
      const v = dd.textContent.trim();
      if (v && v !== state.crm[k]) {
        state.crm[k] = v; state.crmLocked.add(k);
        state.pendingNotes.push(`CLOSER CORRIGIU A FICHA: ${rotulo} = ${v}`);
        toast('Ficha corrigida — o Mentor vai respeitar');
      }
      renderCrm(); updateKpis();
    });
    dl.append(el('dt', state.crm[k] ? 'filled' : '', rotulo), dd);
  }
}

// ================= MAPA MENTAL =================
function addLeaf(k, text, sub = '') {
  text = (text || '').trim(); if (!text) return;
  const list = (state.map[k] ||= []);
  const found = list.find((l) => l.text.toLowerCase() === text.toLowerCase());
  if (found) { if (sub && sub !== found.sub) { found.sub = sub; found.at = Date.now(); } return; }
  list.push({ text, sub, at: Date.now(), done: false });
}

function renderMap() {
  const now = Date.now();
  $('mapLeft').innerHTML = ''; $('mapRight').innerHTML = '';
  for (const [k, b] of Object.entries(BRANCHES)) {
    const leaves = [...(state.map[k] || [])].reverse(); // mais novos primeiro
    const hot = leaves.some((l) => now - l.at < NEW_MS);
    const br = el('div', `branch${leaves.length ? '' : ' empty'}${state.collapsed.has(k) ? ' collapsed' : ''}${hot ? ' hot' : ''}`);
    br.dataset.k = k;
    br.style.setProperty('--c', `var(--b-${k})`);
    const node = el('div', 'branch-node', b.t);
    node.append(el('span', 'cnt', String(leaves.length)));
    node.title = 'Clique para recolher/abrir';
    node.onclick = () => { state.collapsed.has(k) ? state.collapsed.delete(k) : state.collapsed.add(k); renderMap(); };
    const ul = el('ul', 'leaves');
    const limit = state.expanded.has(k) ? leaves.length : MAX_LEAVES;
    leaves.slice(0, limit).forEach((l, i) => {
      const li = hl(el('li', `leaf${k === 'dor' ? ' quote' : ''}${l.done ? ' done' : ''}${now - l.at < NEW_MS ? ' isnew' : ''}`), l.text);
      li.dataset.key = `${k}:${l.text}`;
      if (l.sub) li.append(hl(el('span', 'sub'), l.sub));
      li.title = `${l.text}${l.sub ? `\n↳ ${l.sub}` : ''}\n\nclique = copiar · duplo clique = aprofundar`;
      li.onclick = () => copy(l.sub || l.text);
      li.ondblclick = () => maybeAnalyze(true, `Aprofunde este ponto do mapa e me diga como usar agora: "${l.text}"`);
      ul.append(li);
    });
    if (leaves.length > MAX_LEAVES) {
      const more = el('li', 'more', state.expanded.has(k) ? 'mostrar menos' : `+${leaves.length - MAX_LEAVES} itens`);
      more.onclick = () => { state.expanded.has(k) ? state.expanded.delete(k) : state.expanded.add(k); renderMap(); };
      ul.append(more);
    }
    br.append(node, ul);
    $(b.side === 'left' ? 'mapLeft' : 'mapRight').append(br);
  }
  renderQuadro();
  requestAnimationFrame(() => { fitIfAuto(); drawLinks(); });
}

// Quadro: os mesmos ramos em cartões com letra grande (ordem da linha do ACR).
const QUADRO_ORDEM = ['resultado', 'operacao', 'dor', 'causa', 'impacto', 'decisores', 'objecoes', 'rota', 'proximos'];
function renderQuadro() {
  const box = $('quadro'); box.innerHTML = '';
  const now = Date.now();
  for (const k of QUADRO_ORDEM) {
    const leaves = [...(state.map[k] || [])].reverse();
    const card = el('section', `qcard ${k}${leaves.length ? '' : ' empty'}${leaves.some((l) => now - l.at < NEW_MS) ? ' hot' : ''}`);
    card.style.setProperty('--c', `var(--b-${k})`);
    const head = el('div', 'qhead', BRANCHES[k].t);
    head.append(el('span', 'cnt', String(leaves.length)));
    card.append(head);
    if (!leaves.length) card.append(el('div', 'qempty', 'ainda não apareceu'));
    else {
      const ul = el('ul');
      leaves.forEach((l) => {
        const li = hl(el('li', `${l.done ? 'done' : ''}${now - l.at < NEW_MS ? ' isnew' : ''}`), l.text);
        if (l.sub) li.append(hl(el('span', 'sub'), l.sub));
        li.title = 'clique = copiar · duplo clique = aprofundar';
        li.onclick = () => copy(l.sub || l.text);
        li.ondblclick = () => maybeAnalyze(true, `Aprofunde este ponto do mapa e me diga como usar agora: "${l.text}"`);
        ul.append(li);
      });
      card.append(ul);
    }
    box.append(card);
  }
}

// Alterna Quadro / Mapa (lembra a escolha).
function setMapView(v) {
  state.mapView = v;
  document.querySelectorAll('#viewSeg button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
  $('quadro').hidden = v !== 'quadro';
  $('mapViewport').hidden = v !== 'mapa';
  document.querySelector('.map-legend').hidden = v !== 'mapa';
  chrome.storage.local.set({ mapView: v });
  if (v === 'mapa') requestAnimationFrame(() => { fit(); drawLinks(); });
}
document.querySelectorAll('#viewSeg button').forEach((b) => { b.onclick = () => setMapView(b.dataset.v); });
chrome.storage.local.get('mapView').then(({ mapView }) => setMapView(mapView || 'quadro'));

// Liga raiz → ramos → folhas com curvas (coordenadas do palco, sem o zoom).
function drawLinks() {
  const stage = $('mapStage'); const svg = $('mapSvg');
  if (!stage.offsetWidth) return;
  const sr = stage.getBoundingClientRect(); const s = state.view.s;
  const box = (e) => { const r = e.getBoundingClientRect(); return { l: (r.left - sr.left) / s, r: (r.right - sr.left) / s, t: (r.top - sr.top) / s, b: (r.bottom - sr.top) / s }; };
  const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * 0.5; return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`; };
  svg.setAttribute('width', stage.offsetWidth); svg.setAttribute('height', stage.offsetHeight);
  svg.innerHTML = '';
  const root = box($('mapRoot')); const ry = (root.t + root.b) / 2;
  const add = (d, color, cls, key) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.setAttribute('stroke', color);
    p.setAttribute('class', `${cls}${state.drawn.has(key) ? '' : ' draw'}`);
    state.drawn.add(key);
    svg.append(p);
  };
  document.querySelectorAll('.branch').forEach((br) => {
    const k = br.dataset.k; const left = BRANCHES[k].side === 'left';
    const color = getComputedStyle(br).getPropertyValue('--c').trim() || '#888';
    const nb = box(br.querySelector('.branch-node')); const ny = (nb.t + nb.b) / 2;
    add(left ? curve(root.l, ry, nb.r, ny) : curve(root.r, ry, nb.l, ny), color, 'branchline', `b:${k}`);
    if (br.classList.contains('collapsed')) return;
    br.querySelectorAll('.leaf').forEach((lf) => {
      const lb = box(lf); const ly = (lb.t + lb.b) / 2;
      add(left ? curve(nb.l, ny, lb.r, ly) : curve(nb.r, ny, lb.l, ly), color, 'leafline', `l:${lf.dataset.key}`);
    });
  });
}

// ---- zoom e arraste ----
function applyView() {
  const v = state.view;
  $('mapStage').style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
}
function fit() {
  const vp = $('mapViewport'); const st = $('mapStage');
  if (!vp.clientWidth || !st.offsetWidth) return;
  const s = Math.min(vp.clientWidth / st.offsetWidth, vp.clientHeight / st.offsetHeight, 1.15);
  state.view = { s, x: (vp.clientWidth - st.offsetWidth * s) / 2, y: Math.max(0, (vp.clientHeight - st.offsetHeight * s) / 2) };
  applyView();
}
function fitIfAuto() { if (!state.userView) fit(); }
function zoomAt(f, cx, cy) {
  const v = state.view; const s = Math.max(0.3, Math.min(2.5, v.s * f));
  v.x = cx - ((cx - v.x) * s) / v.s; v.y = cy - ((cy - v.y) * s) / v.s; v.s = s;
  state.userView = true; applyView();
}
const vp = $('mapViewport');
vp.addEventListener('wheel', (e) => { e.preventDefault(); const r = vp.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
vp.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.leaf, .branch-node, .more')) return;
  const start = { x: e.clientX, y: e.clientY, vx: state.view.x, vy: state.view.y };
  vp.classList.add('dragging'); vp.setPointerCapture(e.pointerId);
  const move = (ev) => { state.view.x = start.vx + ev.clientX - start.x; state.view.y = start.vy + ev.clientY - start.y; state.userView = true; applyView(); };
  const up = () => { vp.classList.remove('dragging'); vp.removeEventListener('pointermove', move); vp.removeEventListener('pointerup', up); };
  vp.addEventListener('pointermove', move); vp.addEventListener('pointerup', up);
});
$('zoomIn').onclick = () => zoomAt(1.2, vp.clientWidth / 2, vp.clientHeight / 2);
$('zoomOut').onclick = () => zoomAt(1 / 1.2, vp.clientWidth / 2, vp.clientHeight / 2);
$('zoomFit').onclick = () => { state.userView = false; fit(); };
$('mapFull').onclick = toggleMapFull;
function toggleMapFull() {
  document.body.classList.toggle('map-full');
  $('mapFull').textContent = document.body.classList.contains('map-full') ? '⤡' : '⤢';
  requestAnimationFrame(() => { state.userView = false; fit(); drawLinks(); });
}
const ro = new ResizeObserver(() => { fitIfAuto(); drawLinks(); });
ro.observe(vp); ro.observe($('mapStage'));

function updateMapFrom(d) {
  const c = d.crm || {};
  addLeaf('resultado', c.resultado_desejado);
  addLeaf('operacao', c.situacao_atual);
  if (c.alavanca) addLeaf('operacao', `Alavanca: ${c.alavanca}`);
  (d.info_chave || []).forEach((i) => addLeaf('operacao', i));
  (d.frases_importantes || []).forEach((f) => addLeaf('dor', f));
  addLeaf('dor', c.dor_literal);
  addLeaf('causa', c.causa_raiz);
  addLeaf('impacto', c.impacto);
  addLeaf('decisores', c.decisores);
  if (c.capacidade_execucao) addLeaf('decisores', `Execução: ${c.capacidade_execucao}`);
  const abertas = (d.objecoes || []).map((o) => o.objecao.toLowerCase());
  (d.objecoes || []).forEach((o) => addLeaf('objecoes', o.objecao, o.contorno));
  (state.map.objecoes || []).forEach((l) => { l.done = !abertas.includes(l.text.toLowerCase()); });
  if (d.rota?.solucao) addLeaf('rota', d.rota.solucao, d.rota.investimento ? d.rota.investimento : '');
  addLeaf('proximos', c.proxima_acao);
  renderMap();
}

// ================= indicadores =================
function updateKpis() {
  const n = Object.values(state.crm).filter(Boolean).length;
  if (setText('diagVal', `${n}/${N_CRM}`) && n) bump('diagVal');
  setRing('diagRing', n / N_CRM, n >= 8 ? 'var(--ok)' : 'var(--primary)');
  $('diagRingVal').textContent = `${Math.round((n / N_CRM) * 100)}%`;
  $('crmBadge').textContent = `${n}/${N_CRM}`;
  const faltam = Object.entries(CRM_CAMPOS).filter(([k]) => !state.crm[k]).map(([, v]) => v.split(/[(/]/)[0].trim());
  $('diagFalta').textContent = faltam.length ? `falta: ${faltam.slice(0, 3).join(', ')}${faltam.length > 3 ? '…' : ''}` : 'completo ✔';

  const me = state.talk['Você'] || 0;
  const total = Object.values(state.talk).reduce((a, b) => a + b, 0);
  const pct = total ? Math.round((me / total) * 100) : 0;
  $('talkMe').style.width = `${pct}%`; $('talkThem').style.width = `${total ? 100 - pct : 0}%`;
  $('talkTxt').textContent = total ? `${pct}% · ${100 - pct}%` : '—';
  const demais = total > 150 && pct > 55;
  $('talkTxt').closest('.kpi').classList.toggle('alert', demais);
  if (demais && !state.talkWarned) { state.talkWarned = true; toast('🎙 Você está falando mais que o cliente — pergunte e escute'); }
  if (pct < 45) state.talkWarned = false;

  if (setText('qVal', state.qTimes.length) && state.qTimes.length) bump('qVal');
  // perguntas por minuto, últimos 10 min
  const spark = $('qSpark'); spark.innerHTML = '';
  const nowS = elapsedSec(); const buckets = Array(10).fill(0);
  state.qTimes.forEach((t) => { const i = 9 - Math.floor((nowS - t) / 60); if (i >= 0 && i < 10) buckets[i]++; });
  const mx = Math.max(1, ...buckets);
  buckets.forEach((b) => { const i = el('i'); i.style.height = `${(b / mx) * 100}%`; spark.append(i); });

  if (setText('objVal', state.openObj.length) && state.openObj.length) bump('objVal');
  $('objSub').textContent = `abertas · ${state.objTotal} no total`;
  $('objVal').closest('.kpi').classList.toggle('alert', state.openObj.length > 0);

  // participantes
  const sp = $('speakers'); sp.innerHTML = '';
  Object.entries(state.talk).sort((a, b) => b[1] - a[1]).forEach(([name, w]) => {
    const c = el('span', 'spk', name); c.append(el('i', '', `${total ? Math.round((w / total) * 100) : 0}%`)); sp.append(c);
  });
}

setInterval(() => {
  if (state.lastAt) {
    const s = Math.floor((Date.now() - state.lastAt) / 1000);
    const txt = s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
    $('coachAge').textContent = `atualizado há ${txt} ·`;
  }
  if (state.running) $('nextInfo').textContent = state.coach?.busy ? 'analisando…' : state.source === 'demo' ? '' : `próxima em ~${Math.max(0, state.intervalSec - state.sinceAnalysis)}s`;
  // tira o "NOVO" quando expira
  if (Object.values(state.map).some((ls) => ls.some((l) => { const a = Date.now() - l.at; return a >= NEW_MS && a < NEW_MS + 1000; }))) renderMap();
}, 1000);

// ================= prontidão e sinal =================
async function checkReady() {
  if (state.running) return;
  const st = await chrome.storage.local.get(['geminiKey', 'docs', 'source']);
  const items = [];
  items.push(st.geminiKey ? ['ok', 'Chave do Gemini'] : ['bad', 'Falta a chave do Gemini', 'options']);
  items.push(st.docs?.length ? ['ok', `Base: ${st.docs.length} arquivo(s)`] : ['warn', 'Base vazia (suba os .md)', 'options']);
  if ((st.source || 'meet') === 'meet') {
    let tab = null;
    try { tab = await findMeetTab(); } catch {}
    if (!tab) items.push(['warn', 'Abra a sala no Google Meet']);
    else {
      items.push(['ok', 'Meet aberto']);
      let probe = null;
      try { probe = await chrome.tabs.sendMessage(tab.id, { target: 'meet', type: 'ping' }); } catch {}
      if (!probe) items.push(['warn', 'Legendas: conecto ao começar']);
      else items.push(probe.captions ? ['ok', 'Legendas ligadas'] : ['warn', 'Ligue as legendas (tecla c)']);
    }
  } else items.push(['ok', 'Fonte: áudio (Deepgram)']);
  const box = $('ready'); box.innerHTML = '';
  items.forEach(([lvl, txt, act]) => {
    const c = el(act ? 'button' : 'span', `rd rd-${lvl}`, txt);
    if (act === 'options') c.onclick = () => chrome.runtime.openOptionsPage();
    box.append(c);
  });
}
checkReady();
setInterval(checkReady, 4000);
chrome.storage.onChanged.addListener(() => checkReady());

function updateSignal() {
  const pill = $('sigPill');
  if (!state.running) { pill.hidden = true; return; }
  pill.hidden = false;
  const now = Date.now();
  const desde = Math.floor((now - (state.lastSignalAt || state.startedAt)) / 1000);
  let lvl = 'ok'; let txt = 'Ouvindo';
  if (state.source === 'meet' && state.captionsOn === false) { lvl = 'bad'; txt = 'Legendas off (tecla c)'; }
  else if (!state.lastSignalAt && desde >= 10) { lvl = 'warn'; txt = 'Aguardando fala…'; }
  else if (desde >= 20) { lvl = 'warn'; txt = `Sem fala há ${desde}s`; }
  pill.className = `sigpill sig-${lvl}`;
  $('sigTxt').textContent = txt;
}
setInterval(updateSignal, 1000);
// Durante a reunião no Meet, confere se as legendas continuam ligadas.
setInterval(async () => {
  if (!state.running || state.source !== 'meet' || !state.meetTabId) return;
  try { const r = await chrome.tabs.sendMessage(state.meetTabId, { target: 'meet', type: 'ping' }); state.captionsOn = !!r?.captions; }
  catch { state.captionsOn = null; }
}, 4000);

// ================= iniciar / parar =================
const isMeet = (t) => /^https:\/\/meet\.google\.com\//.test(t?.url || t?.pendingUrl || '');
async function findMeetTab() {
  if (state.meetTabId) {
    try { const t = await chrome.tabs.get(state.meetTabId); if (isMeet(t)) return t; } catch {}
  }
  const tabs = await chrome.tabs.query({ url: 'https://meet.google.com/*' });
  return tabs.find((t) => /meet\.google\.com\/[a-z]{3}-/.test(t.url)) || tabs[0];
}

$('btnStart').onclick = async () => {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULTS), 'docs']);
  const settings = { ...DEFAULTS, ...stored };
  if (!settings.geminiKey || (settings.source === 'audio' && !settings.deepgramKey)) {
    setStatus('Falta a chave do Gemini. Abrindo Configurações…', 'warn');
    chrome.runtime.openOptionsPage();
    return;
  }
  const setup = readSetup();
  // Dossiê carregado para outro lead? Evita misturar contexto de clientes.
  const { leadOwner } = await chrome.storage.local.get('leadOwner');
  if (leadDocs.length && leadOwner && setup.comQuem && leadOwner !== setup.comQuem
      && !confirm(`O dossiê carregado foi adicionado para “${leadOwner}”.\nUsar esses arquivos com “${setup.comQuem}”?\n\nOK = usar · Cancelar = começar sem dossiê`)) {
    leadDocs = []; saveLead(); chrome.storage.local.remove('leadOwner');
  }
  $('btnStart').disabled = true;
  const ok = await startCapture(settings);
  $('btnStart').disabled = false;
  if (!ok) return;

  beginSession(settings, setup, new Coach(settings, setup, stored.docs || [], leadDocs), settings.source);
};


$('btnStop').onclick = async () => {
  if (!state.running) return;
  clearInterval(state.tick); clearTimeout(state.questionTimer);
  $('btnStop').disabled = true;
  if (state.source === 'meet') await chrome.tabs.sendMessage(state.meetTabId, { target: 'meet', type: 'stop' }).catch(() => {});
  else if (state.source === 'audio') await chrome.runtime.sendMessage({ target: 'background', type: 'stop-capture' });
  await new Promise((r) => setTimeout(r, 600)); // recebe as últimas falas antes de fechar
  state.running = false;
  $('btnStop').disabled = false;
  $('btnStop').hidden = true; $('btnStart').hidden = false; $('btnDemo').hidden = false; $('dot').classList.remove('on'); $('livePill').classList.remove('on'); $('liveTag').textContent = 'ENCERRADA';
  setStatus('Gerando a ata final…');
  try {
    state.ataMd = await state.coach.ata(takeNewLines());
    renderAta(state.ataMd);
    $('ataOverlay').hidden = false;
    if (state.source !== 'demo') saveHistory();
    chrome.storage.local.remove('sessao');
    setStatus(leadDocs.length ? '📂 O dossiê deste lead continua carregado — em Preparação, “limpar dossiê” antes do próximo lead.' : '', 'warn');
  } catch (e) { setStatus(`Erro ao gerar ata: ${e.message}`, 'error'); }
};

// Liga a fonte da conversa (legendas do Meet ou áudio). Retorna false se falhar.
async function startCapture(settings) {
  try {
    if (settings.source === 'meet') {
      const tab = await findMeetTab();
      if (!tab) throw new Error('Não achei nenhuma aba do Google Meet aberta. Entre na sala e tente de novo.');
      state.meetTabId = tab.id;
      try {
        await chrome.tabs.sendMessage(tab.id, { target: 'meet', type: 'start' });
      } catch {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['meet.js'] });
        await chrome.tabs.sendMessage(tab.id, { target: 'meet', type: 'start' });
      }
      setStatus('Lendo as legendas do Meet. Se nada aparecer, aperte "c" no Meet (legendas em Português).', 'ok');
    } else {
      setStatus('Conectando ao áudio da reunião…');
      const res = await chrome.runtime.sendMessage({ target: 'background', type: 'start-capture', settings });
      if (res?.error) throw new Error(`${res.error} (Dica: vá na aba da reunião e clique no ícone da extensão.)`);
    }
  } catch (e) {
    setStatus(e.message, 'error');
    return false;
  }
  return true;
}

// Começa a sessão (reunião real ou demonstração) com o painel zerado.
function beginSession(settings, setup, coach, source) {
  const meetTabId = state.meetTabId;
  Object.assign(state, freshState(), {
    meetTabId, running: true, source, coach, setup,
    startedAt: Date.now(), intervalSec: source === 'demo' ? 9999 : settings.intervalSec,
  });
  $('transcript').innerHTML = ''; $('timeline').innerHTML = '';
  // limpa o que sobrou da reunião anterior
  $('rotaMini').classList.add('empty'); $('rotaSolucao').textContent = 'aguardando dor validada'; $('rotaInvest').hidden = true;
  $('mapRota').textContent = ''; $('mapTemp').textContent = ''; $('objBox').hidden = true; $('alertasBox').hidden = true;
  $('perguntasBox').hidden = true; $('falta_cobrirBox').hidden = true; $('digaBox').hidden = true;
  ['tempVal', 'condVal'].forEach((id) => { $(id).textContent = '—'; });
  ['tempMotivo', 'condDica', 'tempTrend', 'condTrend', 'etapa'].forEach((id) => { $(id).textContent = ''; });
  ['tempRing', 'condRing', 'diagRing'].forEach((r) => setRing(r, 0)); ['tempRingVal', 'condRingVal'].forEach((r) => { $(r).textContent = '—'; }); $('tempBand').textContent = ''; $('tempBand').className = 'band';
  [...$('movimentos').children, ...$('portoes').children].forEach((li) => { li.className = ''; });
  $('sintese').textContent = 'Aguardando a conversa…';
  $('ansBox').hidden = true;
  renderCrm(); renderMem(); renderMap(); updateKpis(); showContext();
  $('setupBox').hidden = true;
  $('proximo').textContent = 'Ouvindo… abra com contexto, confirme tempo e participantes e combine o objetivo.';
  $('btnStart').hidden = true; $('btnDemo').hidden = true; $('btnStop').hidden = false; $('dot').classList.add('on'); $('livePill').classList.add('on'); $('liveTag').textContent = 'AO VIVO';
  addTimeline(setup.origem === 'avanco' ? 'Reunião de avanço iniciada' : 'Reunião iniciada (lead novo)', 'Abertura', 'baixa');
  // Com dossiê ou notas: briefing imediato, o mapa já começa preenchido.
  if (source !== 'demo' && !state.quiet && (leadDocs.length || setup.notas)) {
    $('proximo').textContent = 'Lendo o dossiê do lead e montando o briefing…';
    maybeAnalyze(true, PEDIDO_BRIEFING);
  }

  state.tick = setInterval(() => {
    $('timer').textContent = fmt(elapsedSec());
    if (++state.sinceAnalysis >= state.intervalSec) { state.sinceAnalysis = 0; maybeAnalyze(); }
  }, 1000);
}

// ================= demonstração =================
let demoTimers = [];
let demoSavedInputs = null;
$('btnDemo').onclick = () => {
  if (state.running) return;
  demoSavedInputs = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value]));
  SETUP_FIELDS.forEach((f) => { $(f).value = DEMO_SETUP[f] || ''; });
  showContext();
  beginSession({ ...DEFAULTS }, { ...DEMO_SETUP }, new DemoCoach(), 'demo');
  setStatus('Demonstração com uma reunião fictícia. Nada é enviado ao Gemini.', 'ok');
  $('liveTag').textContent = 'DEMONSTRAÇÃO';
  const analisarEm = new Set([3, 5, 7, 9, 11]); // índice da fala após a qual o Mentor analisa
  DEMO_SCRIPT.forEach(([seg, speaker, text], i) => {
    demoTimers.push(setTimeout(() => {
      if (!state.running || state.source !== 'demo') return;
      onTranscript({ speaker, text, isFinal: true });
      if (analisarEm.has(i)) setTimeout(() => maybeAnalyze(true), 400);
    }, seg * 1000));
  });
  const fim = DEMO_SCRIPT[DEMO_SCRIPT.length - 1][0] + 4;
  demoTimers.push(setTimeout(() => { if (state.source === 'demo' && state.running) setStatus('Demonstração concluída. Clique em “Encerrar + Ata” para ver a ata.', 'ok'); }, fim * 1000));
};
function endDemo() {
  demoTimers.forEach(clearTimeout); demoTimers = [];
  if (demoSavedInputs) { SETUP_FIELDS.forEach((f) => { $(f).value = demoSavedInputs[f]; }); demoSavedInputs = null; showContext(); }
}

// ================= transcrição =================
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== 'sidepanel') return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return;
  if (msg.type === 'set-meet-tab' && !state.running && msg.tabId) { state.meetTabId = msg.tabId; return; }
  if (msg.type === 'status') setStatus(msg.text, msg.level);
  if (msg.type === 'transcript' && state.running) onTranscript(msg);
});

function onTranscript({ speaker, text, isFinal }) {
  state.lastSignalAt = Date.now();
  if (!isFinal) {
    state.interim[speaker] = `${speaker}: ${text}`;
    $('interim').textContent = Object.values(state.interim).filter(Boolean).join('  ·  ');
    return;
  }
  state.interim[speaker] = '';
  $('interim').textContent = Object.values(state.interim).filter(Boolean).join('  ·  ');
  const isMe = speaker === 'Você';
  state.talk[speaker] = (state.talk[speaker] || 0) + text.split(/\s+/).filter(Boolean).length;
  const perguntas = (text.match(/\?/g) || []).length;
  if (isMe) for (let i = 0; i < perguntas; i++) state.qTimes.push(elapsedSec());

  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    hl(last.el.querySelector('.tx'), last.text);
    if (perguntas && !isMe) last.el.classList.add('q');
  } else {
    const p = el('p', `${isMe ? 'me' : 'them'}${perguntas && !isMe ? ' q' : ''}`);
    p.append(el('b', '', `${speaker}: `), hl(el('span', 'tx'), text));
    const line = { speaker, text, el: p };
    p.title = 'Clique: o Mentor analisa este trecho';
    p.onclick = () => maybeAnalyze(true, `Analise esta fala e me diga como usar agora: "${line.speaker}: ${line.text}"`);
    $('transcript').append(p);
    state.lines.push(line);
  }
  $('transcript').scrollTop = $('transcript').scrollHeight;
  updateKpis();
  clearTimeout(state.snapT); state.snapT = setTimeout(saveSnapshot, 3000);
  if (!isMe && perguntas) { clearTimeout(state.questionTimer); state.questionTimer = setTimeout(() => maybeAnalyze(true), 1200); }
}

function takeNewLines() {
  const novas = state.lines.slice(state.sentUpTo).map(({ speaker, text }) => ({ speaker, text }));
  state.sentUpTo = state.lines.length;
  return novas;
}
const newWordCount = () => state.lines.slice(state.sentUpTo).reduce((n, l) => n + l.text.split(/\s+/).length, 0);

// ================= análise =================
async function maybeAnalyze(force = false, pedido = '') {
  if (!state.coach) { setStatus('Clique em “▶ Começar” primeiro.', 'warn'); return; }
  if (state.coach.busy) { if (pedido) toast('Aguarde, analisando…'); return; }
  if (!force && !pedido && newWordCount() < 12 && !state.pendingNotes.length) return;
  const from = state.sentUpTo;
  const novas = takeNewLines();
  const notas = state.pendingNotes.splice(0);
  state.sinceAnalysis = 0;
  $('btnAjuda').disabled = true; $('coach').classList.add('thinking');
  try {
    const res = await state.coach.analyze(novas, pedido, notas);
    if (res) { state.lastData = res.data; render(res.data, pedido); state.lastAt = Date.now(); saveSnapshot(); }
  } catch (e) {
    state.sentUpTo = Math.min(from, state.sentUpTo);
    state.pendingNotes.unshift(...notas);
    setStatus(`IA: ${e.message}`, 'error');
  } finally {
    $('btnAjuda').disabled = false; $('coach').classList.remove('thinking');
  }
}
$('btnAjuda').onclick = () => { const p = $('pedido').value.trim(); $('pedido').value = ''; maybeAnalyze(true, p); };
$('pedido').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnAjuda').click(); });
document.querySelectorAll('.chip[data-q]').forEach((b) => { b.onclick = () => maybeAnalyze(true, b.dataset.q); });

// ================= render =================
function fillList(id, items, onClick) {
  const ul = $(id); ul.innerHTML = '';
  (items || []).forEach((t) => { const li = el('li', '', t); if (onClick) li.onclick = () => onClick(li, t); ul.append(li); });
  $(`${id}Box`).hidden = !items?.length;
}
function markSteps(id, items, current, stuck) {
  const idx = items.indexOf(current); if (idx < 0) return;
  [...$(id).children].forEach((li, i) => { li.className = i === idx ? (stuck ? 'stuck' : 'cur') : i < idx ? 'done' : ''; });
}
function addTimeline(text, mov, urg, t = fmt(elapsedSec())) {
  if (state.quiet) return;
  (state.timeline ||= []).push({ text, mov, urg, t });
  const li = el('li', urg);
  li.append(el('span', 't', t), el('span', 'm', mov || ''), el('div', 'd', text));
  $('timeline').prepend(li);
  if (!document.querySelector('[data-tab="tTimeline"]').classList.contains('active')) {
    const b = $('tlCount'); b.hidden = false; b.textContent = String((Number(b.textContent) || 0) + 1);
  }
}
function renderSintese(txt) {
  if (!txt) return;
  const p = $('sintese'); p.innerHTML = '';
  txt.split(/(\[[^\]]*\])/).forEach((part) => {
    if (/^\[.*\]$/.test(part)) p.append(el('mark', 'gap', part.slice(1, -1)));
    else if (part) { const sp = el('span'); hl(sp, part); p.append(sp); }
  });
  const box = $('threadBox'); box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
}
function animate(id) { const e = $(id); e.classList.remove('enter'); void e.offsetWidth; e.classList.add('enter'); }

function pedidoLabel(p) {
  if (p === PEDIDO_BRIEFING) return 'Briefing do lead';
  const m = p.match(/^Analise esta fala[^"]*"(.*)"$/s); if (m) return `Análise da fala: ${m[1]}`;
  const a = p.match(/^Aprofunde este ponto[^"]*"(.*)"$/s); if (a) return `Aprofundar: ${a[1]}`;
  return p;
}
function render(d, pedido) {
  setStatus('');
  if (pedido && d.resposta) {
    $('ansQ').textContent = pedidoLabel(pedido);
    hl($('ansA'), d.resposta);
    $('ansBox').hidden = false; animate('ansA');
  }
  $('coach').closest('.col').scrollTo({ top: 0, behavior: 'smooth' });
  const urg = d.urgencia || 'baixa';
  $('coach').className = `card hero urg-${urg}`;
  $('urgTag').textContent = urg === 'alta' ? 'AGIR AGORA' : urg === 'media' ? 'OPORTUNIDADE' : 'AGORA';
  if (setRich('proximo', d.proximo_passo || 'Continue ouvindo.')) animate('proximo');
  if (setRich('diga', d.diga || '')) animate('digaBox');
  $('digaBox').hidden = !d.diga;

  // Objeções
  const obj = d.objecoes || [];
  $('objBox').hidden = !obj.length; $('objList').innerHTML = '';
  obj.forEach((o) => {
    const item = el('div', 'obj-item'); const a = hl(el('div', 'obj-a'), o.contorno);
    a.onclick = () => copy(o.contorno, 'Contorno copiado ✔');
    item.append(el('div', 'obj-q', `“${o.objecao}”`), a); $('objList').append(item);
    if (!state.openObj.includes(o.objecao)) { state.objTotal++; addTimeline(`Objeção: “${o.objecao}”`, 'Objeção', 'alta'); }
  });
  state.openObj = obj.map((o) => o.objecao);

  fillList('alertas', d.alertas);
  fillList('perguntas', d.perguntas, (li, t) => { li.classList.add('used'); copy(t, 'Pergunta copiada ✔'); });
  fillList('falta_cobrir', (d.falta_cobrir || []).filter((t) => !state.covered.has(t.toLowerCase())), (li, t) => {
    li.classList.add('done'); state.covered.add(t.toLowerCase());
    state.pendingNotes.push(`CLOSER MARCOU COMO COBERTO: ${t}`); toast('✔ Marcado como coberto');
  });

  markSteps('movimentos', MOVIMENTOS, d.movimento, false);
  markSteps('portoes', PORTOES, d.portao, true);
  $('etapa').textContent = d.etapa || '';
  renderSintese(d.sintese);

  // Temperatura com tendência
  if (Number.isFinite(d.temperatura)) {
    const t = Math.max(0, Math.min(100, Math.round(d.temperatura)));
    const prev = state.temp;
    const faixa = t >= 70 ? 'quente' : t >= 40 ? 'morno' : 'frio';
    setRing('tempRing', t / 100, faixa === 'quente' ? 'var(--danger)' : faixa === 'morno' ? 'var(--warn)' : 'var(--cold)');
    $('tempBand').textContent = faixa === 'quente' ? 'quente' : faixa === 'morno' ? 'morno' : 'frio';
    $('tempBand').className = `band ${faixa}`;
    if (setText('tempVal', `${t}°`)) bump('tempVal');
    $('tempRingVal').textContent = t;
    $('tempMotivo').textContent = d.temperatura_motivo || ''; $('tempMotivo').title = d.temperatura_motivo || '';
    $('tempTrend').textContent = prev == null || prev === t ? '' : t > prev ? `▲ +${t - prev}` : `▼ ${t - prev}`;
    $('tempTrend').className = `trend ${prev != null && t > prev ? 'up' : 'down'}`;
    $('mapTemp').textContent = `${t}°`;
    state.temp = t;
  }

  // Condução
  if (Number.isFinite(d.conducao)) {
    const c = Math.max(0, Math.min(10, Math.round(d.conducao)));
    const prev = state.cond;
    if (setText('condVal', `${c}/10`)) bump('condVal');
    $('condRingVal').textContent = c;
    $('condTrend').textContent = prev == null || prev === c ? '' : c > prev ? `▲ +${c - prev}` : `▼ ${c - prev}`;
    $('condTrend').className = `trend ${prev != null && c > prev ? 'up' : 'down'}`;
    $('condDica').textContent = d.conducao_dica || ''; $('condDica').title = d.conducao_dica || '';
    $('condVal').closest('.kpi').classList.toggle('alert', c < 6);
    setRing('condRing', c / 10, c >= 8 ? 'var(--ok)' : c >= 6 ? 'var(--primary)' : 'var(--warn)');
    state.cond = c;
  }

  // Ficha CRM
  const novos = [];
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || state.crmLocked.has(k) || v === state.crm[k]) continue;
    state.crm[k] = v; novos.push(k);
  }
  renderCrm(novos);

  // Rota
  if (d.rota?.solucao) {
    const mudou = $('rotaSolucao').textContent !== d.rota.solucao;
    $('rotaMini').classList.remove('empty');
    $('rotaSolucao').textContent = d.rota.solucao; $('rotaSolucao').title = d.rota.motivo || '';
    $('rotaInvest').hidden = !d.rota.investimento; $('rotaInvest').textContent = d.rota.investimento ? d.rota.investimento : '';
    $('mapRota').textContent = d.rota.solucao;
    if (mudou) {
      $('rotaNew').hidden = false; setTimeout(() => { $('rotaNew').hidden = true; }, NEW_MS);
      addTimeline(`Rota: ${d.rota.solucao}`, 'Rota', 'media');
    }
  }

  for (const info of [...(d.info_chave || []), ...(d.frases_importantes || [])]) {
    if (!state.memoria.some((m) => m.text.toLowerCase() === info.toLowerCase())) state.memoria.push({ text: info, at: Date.now() });
  }
  renderMem();
  if (d.rota?.solucao) renderPrecos();
  updateMapFrom(d);
  updateKpis();
  if (d.destaque) addTimeline(d.destaque, d.movimento, urg);
  else if (pedido) addTimeline(`Você pediu: ${pedido.slice(0, 80)}`, 'Pedido', 'baixa');
}

function renderMem() {
  const ul = $('memoria'); ul.innerHTML = '';
  [...state.memoria].reverse().sort((a, b) => state.pinned.has(b.text) - state.pinned.has(a.text)).forEach((m) => {
    const li = el('li', state.pinned.has(m.text) ? 'pinned' : '');
    if (Date.now() - m.at < 8000) li.classList.add('flash');
    const pin = el('span', 'pin', state.pinned.has(m.text) ? '★' : '☆');
    pin.onclick = (e) => { e.stopPropagation(); state.pinned.has(m.text) ? state.pinned.delete(m.text) : state.pinned.add(m.text); renderMem(); };
    li.onclick = () => copy(m.text);
    li.append(pin, hl(el('span'), m.text)); ul.append(li);
  });
  $('memCount').hidden = !state.memoria.length; $('memCount').textContent = String(state.memoria.length);
}

// ================= ata formatada =================
function inline(el, text) {
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) el.append(Object.assign(document.createElement('strong'), { textContent: part.slice(2, -2) }));
    else if (part) el.append(document.createTextNode(part));
  });
}
function renderAta(md) {
  const box = $('ata'); box.innerHTML = '';
  let ul = null;
  for (const raw of (md || '').split('\n')) {
    const line = raw.trimEnd();
    if (/^#{1,4}\s/.test(line)) { ul = null; const h = el('h3'); inline(h, line.replace(/^#+\s*/, '')); box.append(h); continue; }
    if (/^\s*[-*•]\s+/.test(line)) { if (!ul) { ul = el('ul'); box.append(ul); } const li = el('li'); inline(li, line.replace(/^\s*[-*•]\s+/, '')); ul.append(li); continue; }
    ul = null;
    if (line.trim()) { const p = el('p'); inline(p, line); box.append(p); }
  }
  $('btnCopyFollow').hidden = !followUp(md);
}
// Extrai a seção "follow-up" da ata.
function followUp(md) {
  const m = (md || '').match(/#+[^\n]*follow[^\n]*\n([\s\S]*?)(?=\n#+\s|$)/i);
  return m ? m[1].trim() : '';
}
$('btnCopyFollow').onclick = () => copy(followUp(state.ataMd), 'Follow-up copiado ✔');

// ================= histórico de reuniões =================
const normName = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s[—–-]\s|,/)[0].trim();
async function saveHistory() {
  const { historico = [] } = await chrome.storage.local.get('historico');
  historico.unshift({
    id: Date.now(), cliente: state.setup?.comQuem || 'Sem nome', data: new Date().toISOString(),
    origem: state.setup?.origem, md: buildMarkdown(),
  });
  await chrome.storage.local.set({ historico: historico.slice(0, 40) });
  renderHistory();
}
async function renderHistory() {
  const { historico = [] } = await chrome.storage.local.get('historico');
  const alvo = normName($('comQuem').value);
  const lista = alvo ? historico.filter((h) => normName(h.cliente) === alvo || normName(h.cliente).includes(alvo)) : historico.slice(0, 3);
  const ul = $('histList'); ul.innerHTML = '';
  lista.slice(0, 6).forEach((h) => {
    const li = el('li');
    const d = new Date(h.data);
    li.append(el('span', 'hist-date', d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })), el('span', 'fn', h.cliente));
    const add = el('button', 'mini', '+ dossiê');
    add.title = 'Usar a ata e o mapa desta reunião como contexto';
    add.onclick = () => {
      const name = `reuniao-${d.toISOString().slice(0, 10)}.md`;
      if (!leadDocs.some((x) => x.name === name)) {
        if (!leadDocs.length) chrome.storage.local.set({ leadOwner: $('comQuem').value.trim() });
        leadDocs.push({ name, content: h.md }); saveLead();
      }
      toast('Reunião anterior adicionada ao dossiê');
    };
    li.append(add); ul.append(li);
  });
  $('histTitle').textContent = alvo ? `Reuniões anteriores com ${$('comQuem').value.split(/\s[—–-]\s|,/)[0].trim()}` : 'Últimas reuniões';
  $('histBox').hidden = !lista.length;
}
$('comQuem').addEventListener('input', () => { clearTimeout(renderHistory.h); renderHistory.h = setTimeout(renderHistory, 300); });
renderHistory();

$('ansA').onclick = () => copy($('ansA').textContent, 'Resposta copiada ✔');
$('ansClose').onclick = () => { $('ansBox').hidden = true; };

// Teclas 1–7 acionam os atalhos rápidos.
const quickChips = [...document.querySelectorAll('.chip[data-q]')];
quickChips.forEach((c, i) => { if (i < 9) { const k = el('kbd', 'chipkey', String(i + 1)); c.prepend(k); } });

// ================= tabela de preços =================
let precos = { grupos: [], condicoes: [] };
const COND_CURTA = { 'Condição de lançamento': 'Base', '4 meses em 4x': '4x', '4 meses à vista': '4 à vista', '6 meses em 6x': '6x', '6 meses à vista': '6 à vista', '12 meses em 12x': '12x', '12 meses à vista': '12 à vista' };
async function loadPrecos() {
  const { docs = [] } = await chrome.storage.local.get('docs');
  precos = lerPrecos(acharPolitica(docs));
  renderPrecos();
}
let renderPrecos = function () {
  const box = $('precosBox'); box.innerHTML = '';
  if (!precos.grupos.length) { box.append(el('p', 'qempty', 'Não encontrei a tabela de preços na base. Suba a política de preços (.md) nas Configurações.')); return; }
  const rota = (state.lastData?.rota?.solucao || '').toLowerCase();
  const casa = (nome) => rota && nome.toLowerCase().split(' + ').every((p) => rota.includes(p.toLowerCase()));
  // Destaca só a correspondência mais específica (ex.: "Gestão de Pós-venda + Connect", não "Connect").
  const todos = precos.grupos.flatMap((g) => g.itens.map((i) => i.nome)).filter(casa);
  const maior = Math.max(0, ...todos.map((n) => n.split(' + ').length));
  const recomendado = (nome) => casa(nome) && nome.split(' + ').length === maior;
  const wrap = el('div', 'ptable-wrap'); const t = el('table', 'ptable');
  const thead = el('thead'); const hr = el('tr');
  hr.append(el('th', '', 'Plano / composição'), ...precos.condicoes.map((c) => { const th = el('th', '', COND_CURTA[c] || c); th.title = c; return th; }));
  thead.append(hr); t.append(thead);
  const tb = el('tbody');
  for (const g of precos.grupos) {
    const gr = el('tr', 'pgroup'); const gt = el('td', '', g.nome); gt.colSpan = precos.condicoes.length + 1; gr.append(gt); tb.append(gr);
    for (const it of g.itens) {
      const tr = el('tr', recomendado(it.nome) ? 'prec' : '');
      const nome = el('td', 'pname', it.nome);
      if (recomendado(it.nome)) nome.append(el('span', 'ptag', 'rota'));
      tr.append(nome);
      precos.condicoes.forEach((c) => {
        const v = it.cond[c] || '—';
        const td = el('td', 'pval', v.replace(/^R\$\s*/, ''));
        td.title = `${it.nome} — ${c}: ${v} (clique para copiar)`;
        if (it.cond[c]) td.onclick = () => copy(`${it.nome} — ${c}: ${v}/mês`, 'Valor copiado ✔');
        tr.append(td);
      });
      tb.append(tr);
    }
  }
  t.append(tb); wrap.append(t); box.append(wrap);
  box.append(el('p', 'pnote', 'Valores mensais (R$) da régua de descontos da sua política. Não acumule descontos. Clique num valor para copiar.'));
};
loadPrecos();
chrome.storage.onChanged.addListener((ch) => { if (ch.docs) loadPrecos(); });

// ---- calculadora: quantas vendas a mais pagam o plano ----
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
function toNum(txt) {
  if (!txt) return NaN;
  const t = String(txt).toLowerCase();
  const m = t.match(/(\d+(?:[.,]\d+)*)\s*(mil|k)?/); if (!m) return NaN;
  let n = m[1];
  n = /,\d{1,2}$/.test(n) ? n.replace(/\./g, '').replace(',', '.') : n.replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.');
  return parseFloat(n) * (m[2] ? 1000 : 1);
}
function fillCalcOptions() {
  const sp = $('cPlano'); const sc = $('cCond');
  const atual = sp.value;
  sp.innerHTML = ''; sc.innerHTML = '';
  precos.grupos.forEach((g) => { const og = document.createElement('optgroup'); og.label = g.nome; g.itens.forEach((i) => og.append(new Option(i.nome, i.nome))); sp.append(og); });
  precos.condicoes.forEach((c) => sc.append(new Option(c, c)));
  if (precos.condicoes.includes('12 meses em 12x')) sc.value = '12 meses em 12x';
  const rec = document.querySelector('.ptable tr.prec .pname')?.firstChild?.textContent;
  sp.value = rec || atual || (precos.grupos.flatMap((g) => g.itens).find((i) => /growth/i.test(i.nome))?.nome) || sp.value;
}
// Puxa o ticket médio que o cliente falou (memória/ficha), se o campo estiver vazio.
function autoTicket() {
  if ($('cTicket').value.trim()) return;
  const fontes = [...state.memoria.map((m) => m.text), ...Object.values(state.crm)];
  for (const f of fontes) { const m = f.match(/ticket[^\d]*?(R\$\s*)?(\d[\d.,]*\s*(mil|k)?)/i); if (m) { $('cTicket').value = m[2].trim(); break; } }
}
function calc() {
  const out = $('calcOut'); out.innerHTML = '';
  const item = precos.grupos.flatMap((g) => g.itens).find((i) => i.nome === $('cPlano').value);
  const valor = toNum(item?.cond[$('cCond').value]);
  const ticket = toNum($('cTicket').value); const margem = toNum($('cMargem').value) / 100;
  if (!item || !valor) { out.append(el('p', 'qempty', 'Escolha um plano e a condição.')); return; }
  if (!ticket || !margem) { out.append(el('p', 'qempty', `${item.nome} (${$('cCond').value}): ${brl(valor)}/mês. Informe o ticket médio e a margem para ver quantas vendas pagam o plano.`)); return; }
  const lucro = ticket * margem; const vendas = Math.max(1, Math.ceil(valor / lucro));
  const big = el('div', 'calc-big');
  big.append(el('span', 'calc-n', String(vendas)), el('span', 'calc-l', vendas === 1 ? 'venda a mais por mês paga o plano' : 'vendas a mais por mês pagam o plano'));
  const det = hl(el('p', 'calc-det'), `Cada venda deixa ${brl(lucro)} (ticket ${brl(ticket)} × margem ${Math.round(margem * 100)}%). ${item.nome}, ${$('cCond').value}: ${brl(valor)}/mês.`);
  const frase = `Com o seu ticket, ${vendas === 1 ? '1 venda a mais por mês' : `${vendas} vendas a mais por mês`} já cobrem o investimento. Quantas vendas vocês deixaram passar no último mês?`;
  const say = hl(el('div', 'calc-say'), frase); say.title = 'Clique para copiar'; say.onclick = () => copy(frase, 'Frase copiada ✔');
  out.append(big, det, say);
}
['cPlano', 'cCond', 'cTicket', 'cMargem'].forEach((id) => $(id).addEventListener('input', calc));
const _renderPrecos = renderPrecos;
renderPrecos = function () { _renderPrecos(); fillCalcOptions(); autoTicket(); calc(); };

// ================= retomar reunião =================
function saveSnapshot() {
  if (!state.running || state.source === 'demo') return;
  chrome.storage.local.set({ sessao: {
    savedAt: Date.now(), setup: state.setup, source: state.source, meetTabId: state.meetTabId, startedAt: state.startedAt,
    lines: state.lines.map(({ speaker, text }) => ({ speaker, text })), map: state.map, crm: state.crm,
    crmLocked: [...state.crmLocked], covered: [...state.covered], memoria: state.memoria, pinned: [...state.pinned],
    objTotal: state.objTotal, talk: state.talk, qTimes: state.qTimes, temp: state.temp, cond: state.cond,
    timeline: state.timeline || [], lastData: state.lastData || null, contents: state.coach?.contents || [],
  } });
}
async function offerResume() {
  const { sessao } = await chrome.storage.local.get('sessao');
  if (!sessao || Date.now() - sessao.savedAt > 3 * 3600e3) { if (sessao) chrome.storage.local.remove('sessao'); return; }
  const min = Math.max(1, Math.round((Date.now() - sessao.savedAt) / 60000));
  $('resumeTxt').textContent = `Reunião com ${sessao.setup?.comQuem || 'o lead'} ficou aberta (há ${min} min, ${fmt(Math.floor((sessao.savedAt - sessao.startedAt) / 1000))} de conversa).`;
  $('resumeBox').hidden = false;
  $('btnResume').onclick = () => resumeSession(sessao);
  $('btnDiscard').onclick = () => { chrome.storage.local.remove('sessao'); $('resumeBox').hidden = true; };
}
async function resumeSession(snap) {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULTS), 'docs']);
  const settings = { ...DEFAULTS, ...stored, source: snap.source };
  if (snap.meetTabId) state.meetTabId = snap.meetTabId;
  $('btnResume').disabled = true;
  const ok = await startCapture(settings);
  $('btnResume').disabled = false;
  if (!ok) return;
  SETUP_FIELDS.forEach((f) => { if (snap.setup?.[f] != null) $(f).value = snap.setup[f]; });
  const coach = new Coach(settings, snap.setup, stored.docs || [], leadDocs);
  coach.contents = snap.contents || [];
  state.quiet = true;
  beginSession(settings, snap.setup, coach, snap.source);
  // reconstrói a conversa e os dados
  snap.lines.forEach((l) => onTranscript({ speaker: l.speaker, text: l.text, isFinal: true }));
  clearTimeout(state.questionTimer);
  Object.assign(state, {
    startedAt: snap.startedAt, sentUpTo: state.lines.length, map: snap.map || {}, crm: snap.crm || {},
    crmLocked: new Set(snap.crmLocked), covered: new Set(snap.covered), memoria: snap.memoria || [], pinned: new Set(snap.pinned),
    objTotal: snap.objTotal || 0, talk: snap.talk || {}, qTimes: snap.qTimes || [], timeline: snap.timeline || [], lastData: snap.lastData,
  });
  $('timeline').innerHTML = '';
  if (snap.lastData) { state.openObj = (snap.lastData.objecoes || []).map((o) => o.objecao); render(snap.lastData, ''); }
  state.temp = snap.temp; state.cond = snap.cond;
  state.quiet = false;
  state.timeline.forEach((e) => { const li = el('li', e.urg); li.append(el('span', 't', e.t), el('span', 'm', e.mov || ''), el('div', 'd', e.text)); $('timeline').prepend(li); });
  renderCrm(); renderMem(); renderMap(); updateKpis(); showContext();
  addTimeline('Reunião retomada', 'Retomada', 'media');
  $('resumeBox').hidden = true;
  setStatus('Reunião retomada. O Mentor lembra de tudo que foi analisado até aqui.', 'ok');
  saveSnapshot();
}
offerResume();

// ================= atalhos =================
$('digaBox').onclick = () => copy($('diga').textContent, 'Frase copiada ✔');
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable="plaintext-only"]')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return; // não atrapalha Ctrl+C, Ctrl+A etc.
  const k = e.key.toLowerCase();
  if (e.key === '/') { e.preventDefault(); $('pedido').focus(); }
  else if (k === 'a') $('btnAjuda').click();
  else if (k === 'c' && $('diga').textContent) copy($('diga').textContent, 'Frase copiada ✔');
  else if (k === 'm') toggleMapFull();
  else if (k === 'p') document.querySelector('[data-tab="tPrecos"]').click();
  else if (/^[1-9]$/.test(e.key) && quickChips[Number(e.key) - 1]) quickChips[Number(e.key) - 1].click();
  else if (e.key === 'Escape' && document.body.classList.contains('map-full')) toggleMapFull();
});

$('btnCopyAta').onclick = () => copy(buildMarkdown(), 'Ata copiada ✔');
$('btnFecharAta').onclick = () => { $('ataOverlay').hidden = true; if (state.source === 'demo') { endDemo(); setStatus(''); } };
$('btnBaixar').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([buildMarkdown()], { type: 'text/markdown' }));
  a.download = `ata-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.md`;
  a.click(); URL.revokeObjectURL(a.href);
};
function buildMarkdown() {
  const mapa = Object.entries(BRANCHES).map(([k, b]) => {
    const ls = state.map[k] || [];
    return ls.length ? `### ${b.t}\n${ls.map((l) => `- ${l.text}${l.sub ? ` → ${l.sub}` : ''}`).join('\n')}` : '';
  }).filter(Boolean).join('\n\n');
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join('\n\n');
  return `${state.ataMd || ''}\n\n---\n\n## Linha do raciocínio\n\n${$('sintese').textContent}\n\n## Mapa da reunião\n\n${mapa}\n\n---\n\n## Transcrição completa\n\n${transcricao}\n`;
}

renderCrm(); renderMap(); updateKpis();
