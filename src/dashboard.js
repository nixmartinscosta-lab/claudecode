import { Coach } from './coach.js';
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
const MAX_LEAVES = 4;

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
function setText(id, v) { if ($(id).textContent !== String(v)) { $(id).textContent = v; return true; } return false; }

// ================= montagem =================
MOVIMENTOS.forEach((t) => $('movimentos').append(el('li', '', t)));
PORTOES.forEach((t) => $('portoes').append(el('li', '', t)));

document.querySelectorAll('.tabs').forEach((bar) => bar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab'); if (!btn) return;
  bar.querySelectorAll('.tab').forEach((b) => { b.classList.toggle('active', b === btn); $(b.dataset.tab).hidden = b !== btn; });
  
  if (btn.dataset.tab === 'tTimeline') { $('tlCount').hidden = true; $('tlCount').textContent = ''; }
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
    const dd = el('dd', '', state.crm[k] || '—');
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
      const li = el('li', `leaf${k === 'dor' ? ' quote' : ''}${l.done ? ' done' : ''}${now - l.at < NEW_MS ? ' isnew' : ''}`, l.text);
      li.dataset.key = `${k}:${l.text}`;
      if (l.sub) li.append(el('span', 'sub', l.sub));
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
  requestAnimationFrame(() => { fitIfAuto(); drawLinks(); });
}

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
  const faltam = Object.entries(CRM_CAMPOS).filter(([k]) => !state.crm[k]).map(([, v]) => v.split(' ')[0]);
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
  if (state.running) $('nextInfo').textContent = state.coach?.busy ? 'analisando…' : `próxima em ~${Math.max(0, state.intervalSec - state.sinceAnalysis)}s`;
  // tira o "NOVO" quando expira
  if (Object.values(state.map).some((ls) => ls.some((l) => { const a = Date.now() - l.at; return a >= NEW_MS && a < NEW_MS + 1000; }))) renderMap();
}, 1000);

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
    $('btnStart').disabled = false;
    return;
  }
  $('btnStart').disabled = false;

  const meetTabId = state.meetTabId;
  Object.assign(state, freshState(), {
    meetTabId, running: true, source: settings.source, coach: new Coach(settings, setup, stored.docs || [], leadDocs),
    startedAt: Date.now(), intervalSec: settings.intervalSec,
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
  renderCrm(); renderMem(); renderMap(); updateKpis(); showContext();
  $('setupBox').hidden = true;
  $('proximo').textContent = 'Ouvindo… abra com contexto, confirme tempo e participantes e combine o objetivo.';
  $('btnStart').hidden = true; $('btnStop').hidden = false; $('dot').classList.add('on'); $('livePill').classList.add('on'); $('liveTag').textContent = 'AO VIVO';
  addTimeline(setup.origem === 'avanco' ? 'Reunião de avanço iniciada' : 'Reunião iniciada (lead novo)', 'Abertura', 'baixa');
  // Com dossiê ou notas: briefing imediato, o mapa já começa preenchido.
  if (leadDocs.length || setup.notas) {
    $('proximo').textContent = 'Lendo o dossiê do lead e montando o briefing…';
    maybeAnalyze(true, PEDIDO_BRIEFING);
  }

  state.tick = setInterval(() => {
    $('timer').textContent = fmt(elapsedSec());
    if (++state.sinceAnalysis >= state.intervalSec) { state.sinceAnalysis = 0; maybeAnalyze(); }
  }, 1000);
};

$('btnStop').onclick = async () => {
  if (!state.running) return;
  clearInterval(state.tick); clearTimeout(state.questionTimer);
  $('btnStop').disabled = true;
  if (state.source === 'meet') await chrome.tabs.sendMessage(state.meetTabId, { target: 'meet', type: 'stop' }).catch(() => {});
  else await chrome.runtime.sendMessage({ target: 'background', type: 'stop-capture' });
  await new Promise((r) => setTimeout(r, 600)); // recebe as últimas falas antes de fechar
  state.running = false;
  $('btnStop').disabled = false;
  $('btnStop').hidden = true; $('btnStart').hidden = false; $('dot').classList.remove('on'); $('livePill').classList.remove('on'); $('liveTag').textContent = 'ENCERRADA';
  setStatus('Gerando a ata final…');
  try {
    $('ata').textContent = await state.coach.ata(takeNewLines());
    $('ataOverlay').hidden = false;
    setStatus(leadDocs.length ? '📂 O dossiê deste lead continua carregado — em Preparação, “limpar dossiê” antes do próximo lead.' : '', 'warn');
  } catch (e) { setStatus(`Erro ao gerar ata: ${e.message}`, 'error'); }
};

// ================= transcrição =================
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== 'sidepanel') return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return;
  if (msg.type === 'set-meet-tab' && !state.running && msg.tabId) { state.meetTabId = msg.tabId; return; }
  if (msg.type === 'status') setStatus(msg.text, msg.level);
  if (msg.type === 'transcript' && state.running) onTranscript(msg);
});

function onTranscript({ speaker, text, isFinal }) {
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
    last.el.lastChild.textContent = ` ${last.text}`;
    if (perguntas && !isMe) last.el.classList.add('q');
  } else {
    const p = el('p', `${isMe ? 'me' : 'them'}${perguntas && !isMe ? ' q' : ''}`);
    p.append(el('b', '', `${speaker}:`), document.createTextNode(` ${text}`));
    const line = { speaker, text, el: p };
    p.title = 'Clique: o Mentor analisa este trecho';
    p.onclick = () => maybeAnalyze(true, `Analise esta fala e me diga como usar agora: "${line.speaker}: ${line.text}"`);
    $('transcript').append(p);
    state.lines.push(line);
  }
  $('transcript').scrollTop = $('transcript').scrollHeight;
  updateKpis();
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
    if (res) { render(res.data, pedido); state.lastAt = Date.now(); }
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
function addTimeline(text, mov, urg) {
  const li = el('li', urg);
  li.append(el('span', 't', fmt(elapsedSec())), el('span', 'm', mov || ''), el('div', 'd', text));
  $('timeline').prepend(li);
  if (!document.querySelector('[data-tab="tTimeline"]').classList.contains('active')) {
    const b = $('tlCount'); b.hidden = false; b.textContent = String((Number(b.textContent) || 0) + 1);
  }
}
function renderSintese(txt) {
  if (!txt) return;
  const p = $('sintese'); p.innerHTML = '';
  txt.split(/(\[[^\]]*\])/).forEach((part) => p.append(/^\[.*\]$/.test(part) ? el('mark', '', part.slice(1, -1)) : document.createTextNode(part)));
  const box = $('threadBox'); box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
}
function animate(id) { const e = $(id); e.classList.remove('enter'); void e.offsetWidth; e.classList.add('enter'); }

function render(d, pedido) {
  setStatus('');
  $('coach').closest('.col').scrollTo({ top: 0, behavior: 'smooth' });
  const urg = d.urgencia || 'baixa';
  $('coach').className = `card hero urg-${urg}`;
  $('urgTag').textContent = urg === 'alta' ? 'AGIR AGORA' : urg === 'media' ? 'OPORTUNIDADE' : 'AGORA';
  if (setText('proximo', d.proximo_passo || 'Continue ouvindo.')) animate('proximo');
  if (setText('diga', d.diga || '')) animate('digaBox');
  $('digaBox').hidden = !d.diga;

  // Objeções
  const obj = d.objecoes || [];
  $('objBox').hidden = !obj.length; $('objList').innerHTML = '';
  obj.forEach((o) => {
    const item = el('div', 'obj-item'); const a = el('div', 'obj-a', o.contorno);
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
    li.append(pin, el('span', '', m.text)); ul.append(li);
  });
  $('memCount').hidden = !state.memoria.length; $('memCount').textContent = String(state.memoria.length);
}

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
  else if (e.key === 'Escape' && document.body.classList.contains('map-full')) toggleMapFull();
});

$('btnCopyAta').onclick = () => copy(buildMarkdown(), 'Ata copiada ✔');
$('btnFecharAta').onclick = () => { $('ataOverlay').hidden = true; };
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
  return `${$('ata').textContent}\n\n---\n\n## Linha do raciocínio\n\n${$('sintese').textContent}\n\n## Mapa da reunião\n\n${mapa}\n\n---\n\n## Transcrição completa\n\n${transcricao}\n`;
}

renderCrm(); renderMap(); updateKpis();
