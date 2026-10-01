import { Coach } from './coach.js';
import { CRM_CAMPOS, MOVIMENTOS, PORTOES } from './prompts.js';

const $ = (id) => document.getElementById(id);
const SETUP_FIELDS = ['modo', 'comQuem', 'objetivo', 'foco', 'notas'];
const DEFAULTS = {
  geminiKey: '', deepgramKey: '', source: 'meet', model: 'gemini-3.5-flash', thinking: 'low',
  intervalSec: 25, useMic: true, dgModel: 'nova-2', dgLanguage: 'pt-BR',
};
const FOCO_PADRAO = 'Combos com serviço (Business, Growth, Scale) ou composições com Pós-venda / Aceleração, se a causa-raiz justificar';
const N_CRM = Object.keys(CRM_CAMPOS).length;

// Ramos do mapa mental, na ordem da linha do ACR.
const BRANCHES = [
  { k: 'resultado', t: '🎯 Resultado desejado', c: '#4f46e5' },
  { k: 'operacao', t: '🏭 Operação hoje', c: '#0891b2' },
  { k: 'dor', t: '💢 Dor — palavras do cliente', c: '#dc2626' },
  { k: 'causa', t: '🔍 Sintoma → causa-raiz', c: '#9333ea' },
  { k: 'impacto', t: '📉 Impacto', c: '#ea580c' },
  { k: 'decisores', t: '👥 Decisores & execução', c: '#0d9488' },
  { k: 'objecoes', t: '🛡 Objeções → contorno', c: '#d97706' },
  { k: 'rota', t: '🧩 Rota / combo', c: '#16a34a' },
  { k: 'proximos', t: '✅ Próximos passos', c: '#2563eb' },
];

const state = {
  running: false, coach: null, source: 'meet', meetTabId: Number(new URLSearchParams(location.search).get('tab')) || null,
  lines: [], sentUpTo: 0, interim: {}, startedAt: 0, tick: null, questionTimer: null, sinceAnalysis: 0, intervalSec: 25,
  lastAt: 0, tokens: { prompt: 0, cached: 0, out: 0 },
  crm: {}, crmLocked: new Set(), covered: new Set(), pendingNotes: [],
  memoria: [], pinned: new Set(), map: {}, collapsed: new Set(), openObj: [],
  talk: { me: 0, them: 0 }, qCount: 0, talkWarned: false, timeline: [],
};

// ================= utilidades =================
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 1600);
}
function copy(text, msg = 'Copiado ✔') { navigator.clipboard.writeText(text).then(() => toast(msg)); }
function setStatus(text, level = '') {
  const el = $('status'); el.hidden = !text; el.textContent = text || ''; el.className = `status ${level}`;
}
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const elapsedSec = () => (state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

// ================= montagem =================
MOVIMENTOS.forEach((t) => $('movimentos').append(el('li', '', t)));
PORTOES.forEach((t) => $('portoes').append(el('li', '', t)));

// Abas genéricas.
document.querySelectorAll('.tabs').forEach((bar) => {
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab'); if (!btn) return;
    bar.querySelectorAll('.tab').forEach((b) => {
      b.classList.toggle('active', b === btn);
      $(b.dataset.tab).hidden = b !== btn;
    });
    if (btn.dataset.tab === 'tTimeline') $('tlCount').hidden = true;
  });
});

chrome.storage.local.get(['setup', 'docs']).then(({ setup, docs }) => {
  if (setup) SETUP_FIELDS.forEach((f) => { if (setup[f] != null) $(f).value = setup[f]; });
  if (!$('foco').value) $('foco').value = FOCO_PADRAO;
  showKb(docs);
});
chrome.storage.onChanged.addListener((ch) => { if (ch.docs) showKb(ch.docs.newValue); });
function showKb(docs) {
  $('kbInfo').textContent = docs?.length ? `📚 ${docs.length} arquivo(s) na base` : '⚠ Suba seus .md em ⚙';
}
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  chrome.storage.local.set({ setup: s });
  return s;
}
$('btnSetup').onclick = () => { $('setupBox').hidden = !$('setupBox').hidden; };

// ================= ficha CRM (editável) =================
function renderCrm() {
  const dl = $('crm'); dl.innerHTML = '';
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dt = el('dt', state.crm[k] ? 'filled' : '', rotulo);
    const dd = el('dd', '', state.crm[k] || '—');
    dd.id = `crm_${k}`;
    dd.contentEditable = 'plaintext-only';
    dd.spellcheck = false;
    dd.classList.toggle('empty', !state.crm[k]);
    dd.classList.toggle('locked', state.crmLocked.has(k));
    dd.addEventListener('focus', () => { if (!state.crm[k]) dd.textContent = ''; });
    dd.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); dd.blur(); } });
    dd.addEventListener('blur', () => {
      const v = dd.textContent.trim();
      if (v && v !== state.crm[k]) {
        state.crm[k] = v;
        state.crmLocked.add(k);
        state.pendingNotes.push(`CLOSER CORRIGIU A FICHA: ${rotulo} = ${v}`);
        toast('Ficha corrigida — o Mentor vai considerar');
      }
      renderCrm(); updateKpis(); renderMap();
    });
    dl.append(dt, dd);
  }
}

// ================= mapa mental =================
function addLeaf(k, text, sub = '') {
  text = (text || '').trim(); if (!text) return false;
  const list = (state.map[k] ||= []);
  const found = list.find((l) => l.text.toLowerCase() === text.toLowerCase());
  if (found) { if (sub && sub !== found.sub) { found.sub = sub; found.at = Date.now(); return true; } return false; }
  list.push({ text, sub, at: Date.now(), done: false });
  return true;
}

function renderMap() {
  const box = $('mapBranches'); box.innerHTML = '';
  const now = Date.now();
  for (const b of BRANCHES) {
    const leaves = state.map[b.k] || [];
    const hot = leaves.some((l) => now - l.at < 10000);
    const br = el('div', `branch${leaves.length ? '' : ' empty'}${state.collapsed.has(b.k) ? ' collapsed' : ''}${hot ? ' hot' : ''}`);
    br.style.setProperty('--c', b.c);
    const h = el('div', 'branch-h', b.t);
    h.append(el('span', 'cnt', leaves.length ? String(leaves.length) : '—'));
    h.onclick = () => { state.collapsed.has(b.k) ? state.collapsed.delete(b.k) : state.collapsed.add(b.k); renderMap(); };
    const ul = el('ul', 'leaves');
    // Mais recentes primeiro.
    [...leaves].reverse().forEach((l) => {
      const li = el('li', `leaf${b.k === 'dor' ? ' quote' : ''}${l.done ? ' done' : ''}`, l.text);
      if (l.sub) li.append(el('span', 'sub', l.sub));
      if (now - l.at < 10000) { li.classList.add('flash'); li.append(el('span', 'new', 'NOVO')); }
      li.title = l.sub ? 'Clique para copiar o contorno' : 'Clique para copiar';
      li.onclick = () => copy(l.sub || l.text);
      ul.append(li);
    });
    br.append(h, ul);
    box.append(br);
  }
}

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
  if (d.rota?.solucao) addLeaf('rota', d.rota.solucao, d.rota.investimento ? `💰 ${d.rota.investimento}` : '');
  addLeaf('proximos', c.proxima_acao);
  const cliente = ($('comQuem').value.split(/[—-]/)[0] || '').trim();
  $('mapCliente').textContent = cliente || 'Integrador';
  renderMap();
}

// ================= indicadores =================
function updateKpis() {
  const n = Object.values(state.crm).filter(Boolean).length;
  $('diagVal').textContent = `${n}/${N_CRM}`;
  $('diagFill').style.width = `${(n / N_CRM) * 100}%`;
  $('crmBadge').textContent = `${n}/${N_CRM}`;

  const total = state.talk.me + state.talk.them;
  const me = total ? Math.round((state.talk.me / total) * 100) : 0;
  $('talkMe').style.width = `${me}%`;
  $('talkThem').style.width = `${total ? 100 - me : 0}%`;
  $('talkTxt').textContent = total ? `Você ${me}% · Cliente ${100 - me}%` : 'Você — · Cliente —';
  const falandoDemais = total > 150 && me > 55;
  $('talkTxt').closest('.kpi').classList.toggle('alert', falandoDemais);
  if (falandoDemais && !state.talkWarned) { state.talkWarned = true; toast('Você está falando mais que o cliente — pergunte e escute'); }
  if (!falandoDemais && me < 45) state.talkWarned = false;
  $('qVal').textContent = state.qCount;
}

setInterval(() => {
  if (state.lastAt) {
    const s = Math.floor((Date.now() - state.lastAt) / 1000);
    $('lastVal').textContent = s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`;
    $('coachAge').textContent = `atualizado há ${s < 60 ? `${s}s` : `${Math.floor(s / 60)}min`}`;
  }
  if (state.running) $('nextInfo').textContent = `próxima em ~${Math.max(0, state.intervalSec - state.sinceAnalysis)}s`;
  if (Object.values(state.map).some((l) => l.some((x) => Date.now() - x.at < 11000 && Date.now() - x.at > 9500))) renderMap();
}, 1000);

// ================= iniciar / parar =================
async function findMeetTab() {
  if (state.meetTabId) { try { return await chrome.tabs.get(state.meetTabId); } catch {} }
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

  Object.assign(state, {
    running: true, source: settings.source, coach: new Coach(settings, setup, stored.docs || []),
    lines: [], sentUpTo: 0, interim: {}, startedAt: Date.now(), sinceAnalysis: 0, intervalSec: settings.intervalSec,
    lastAt: 0, tokens: { prompt: 0, cached: 0, out: 0 }, crm: {}, crmLocked: new Set(), covered: new Set(),
    pendingNotes: [], memoria: [], pinned: new Set(), map: {}, openObj: [], talk: { me: 0, them: 0 }, qCount: 0,
    talkWarned: false, timeline: [],
  });
  $('transcript').innerHTML = ''; $('timeline').innerHTML = '';
  renderCrm(); renderMem(); renderMap(); updateKpis();
  $('clienteTop').textContent = setup.comQuem || '';
  $('mapCliente').textContent = (setup.comQuem.split(/[—-]/)[0] || '').trim() || 'Integrador';
  $('setupBox').hidden = true;
  $('proximo').textContent = 'Ouvindo… abra com contexto, confirme tempo e participantes e combine o objetivo.';
  $('btnStart').hidden = true; $('btnStop').hidden = false; $('dot').classList.add('on');
  addTimeline('Reunião iniciada', 'Abertura', 'baixa');

  state.tick = setInterval(() => {
    $('timer').textContent = fmt(elapsedSec());
    if (++state.sinceAnalysis >= state.intervalSec) { state.sinceAnalysis = 0; maybeAnalyze(); }
  }, 1000);
};

$('btnStop').onclick = async () => {
  if (!state.running) return;
  state.running = false;
  clearInterval(state.tick); clearTimeout(state.questionTimer);
  if (state.source === 'meet') {
    await chrome.tabs.sendMessage(state.meetTabId, { target: 'meet', type: 'stop' }).catch(() => {});
  } else {
    await chrome.runtime.sendMessage({ target: 'background', type: 'stop-capture' });
  }
  $('btnStop').hidden = true; $('btnStart').hidden = false; $('dot').classList.remove('on');
  setStatus('Gerando a ata final…');
  try {
    $('ata').textContent = await state.coach.ata(takeNewLines());
    $('ataOverlay').hidden = false;
    setStatus('');
  } catch (e) {
    setStatus(`Erro ao gerar ata: ${e.message}`, 'error');
  }
};

// ================= transcrição =================
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== 'sidepanel') return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return;
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
  const words = text.split(/\s+/).filter(Boolean).length;
  state.talk[isMe ? 'me' : 'them'] += words;
  const perguntas = (text.match(/\?/g) || []).length;
  if (isMe) state.qCount += perguntas;

  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    last.el.lastChild.textContent = ` ${last.text}`;
    if (perguntas) last.el.classList.add('q');
  } else {
    const p = el('p', `${isMe ? 'me' : 'them'}${perguntas && !isMe ? ' q' : ''}`);
    p.append(el('b', '', `${speaker}:`), document.createTextNode(` ${text}`));
    p.title = 'Clique: o Mentor analisa este trecho';
    const line = { speaker, text, el: p };
    p.onclick = () => maybeAnalyze(true, `Analise esta fala e me diga como usar agora: "${line.speaker}: ${line.text}"`);
    $('transcript').append(p);
    state.lines.push(line);
  }
  $('transcript').scrollTop = $('transcript').scrollHeight;
  updateKpis();

  if (!isMe && perguntas) {
    clearTimeout(state.questionTimer);
    state.questionTimer = setTimeout(() => maybeAnalyze(true), 1200);
  }
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
  $('btnAjuda').disabled = true;
  $('coach').classList.add('thinking');
  try {
    const res = await state.coach.analyze(novas, pedido, notas);
    if (res) { render(res.data, pedido); trackUsage(res.usage); state.lastAt = Date.now(); }
  } catch (e) {
    state.sentUpTo = Math.min(from, state.sentUpTo);
    state.pendingNotes.unshift(...notas);
    setStatus(`IA: ${e.message}`, 'error');
  } finally {
    $('btnAjuda').disabled = false;
    $('coach').classList.remove('thinking');
  }
}

$('btnAjuda').onclick = () => { const p = $('pedido').value.trim(); $('pedido').value = ''; maybeAnalyze(true, p); };
$('pedido').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnAjuda').click(); });
document.querySelectorAll('.chip[data-q]').forEach((b) => { b.onclick = () => maybeAnalyze(true, b.dataset.q); });

// ================= render =================
function fillList(id, items, onClick) {
  const ul = $(id); ul.innerHTML = '';
  (items || []).forEach((t) => {
    const li = el('li', '', t);
    if (onClick) li.onclick = () => onClick(li, t);
    ul.append(li);
  });
  $(`${id}Box`).hidden = !items?.length;
}

function markSteps(id, items, current, stuck) {
  const idx = items.indexOf(current);
  if (idx < 0) return;
  [...$(id).children].forEach((li, i) => { li.className = i === idx ? (stuck ? 'stuck' : 'cur') : i < idx ? 'done' : ''; });
}

function addTimeline(text, mov, urg) {
  const li = el('li', urg);
  li.append(el('span', 't', fmt(elapsedSec())), el('span', 'm', mov || ''), el('div', 'd', text));
  $('timeline').prepend(li);
  const tab = document.querySelector('[data-tab="tTimeline"]');
  if (!tab.classList.contains('active')) {
    const b = $('tlCount'); b.hidden = false; b.textContent = String((Number(b.textContent) || 0) + 1);
  }
}

function render(d, pedido) {
  setStatus('');
  $('coach').closest('.col').scrollTo({ top: 0, behavior: 'smooth' });
  // AGORA
  const urg = d.urgencia || 'baixa';
  $('coach').className = `card hero urg-${urg}`;
  $('urgTag').textContent = urg === 'alta' ? 'AGIR AGORA' : urg === 'media' ? 'OPORTUNIDADE' : 'AGORA';
  $('proximo').textContent = d.proximo_passo || 'Continue ouvindo.';
  $('diga').textContent = d.diga || '';
  $('digaBox').hidden = !d.diga;

  // Objeções abertas
  const obj = d.objecoes || [];
  $('objBox').hidden = !obj.length;
  $('objList').innerHTML = '';
  obj.forEach((o) => {
    const item = el('div', 'obj-item');
    const a = el('div', 'obj-a', o.contorno);
    a.onclick = () => copy(o.contorno, 'Contorno copiado ✔');
    item.append(el('div', 'obj-q', `“${o.objecao}”`), a);
    $('objList').append(item);
  });
  obj.forEach((o) => { if (!state.openObj.includes(o.objecao)) addTimeline(`Objeção: “${o.objecao}”`, 'Objeção', 'alta'); });
  state.openObj = obj.map((o) => o.objecao);

  fillList('perguntas', d.perguntas, (li, t) => { li.classList.add('used'); copy(t, 'Pergunta copiada ✔'); });
  fillList('alertas', d.alertas);
  const falta = (d.falta_cobrir || []).filter((t) => !state.covered.has(t.toLowerCase()));
  fillList('falta_cobrir', falta, (li, t) => {
    li.classList.add('done');
    state.covered.add(t.toLowerCase());
    state.pendingNotes.push(`CLOSER MARCOU COMO COBERTO: ${t}`);
    toast('Marcado como coberto');
  });

  // Trilhos
  markSteps('movimentos', MOVIMENTOS, d.movimento, false);
  markSteps('portoes', PORTOES, d.portao, true);
  $('etapa').textContent = d.etapa ? `· ${d.etapa}` : '';

  // Temperatura
  if (Number.isFinite(d.temperatura)) {
    const t = Math.max(0, Math.min(100, d.temperatura));
    $('tempFill').style.width = `${100 - t}%`;
    $('tempVal').textContent = `${t}°`;
    $('tempMotivo').textContent = d.temperatura_motivo || '';
    $('mapTemp').textContent = `${t}°`;
  }

  // Ficha CRM (respeita campos corrigidos pelo closer)
  const novos = [];
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || state.crmLocked.has(k) || v === state.crm[k]) continue;
    state.crm[k] = v; novos.push(k);
  }
  renderCrm();
  novos.forEach((k) => $(`crm_${k}`).classList.add('flash'));

  // Rota
  if (d.rota?.solucao) {
    const mudou = $('rotaSolucao').textContent !== d.rota.solucao;
    $('rotaBox').classList.remove('empty');
    $('rotaSolucao').textContent = d.rota.solucao;
    $('rotaMotivo').textContent = d.rota.motivo || '';
    $('rotaInvest').hidden = !d.rota.investimento;
    $('rotaInvest').textContent = d.rota.investimento ? `💰 ${d.rota.investimento}` : '';
    if (mudou) {
      $('rotaNew').hidden = false; setTimeout(() => { $('rotaNew').hidden = true; }, 10000);
      $('rotaBox').classList.add('flash'); setTimeout(() => $('rotaBox').classList.remove('flash'), 3000);
      addTimeline(`Rota: ${d.rota.solucao}`, 'Rota', 'media');
    }
  }

  // Memória
  for (const info of [...(d.info_chave || []), ...(d.frases_importantes || [])]) {
    if (state.memoria.some((m) => m.text.toLowerCase() === info.toLowerCase())) continue;
    state.memoria.push({ text: info, at: Date.now() });
  }
  renderMem();

  updateMapFrom(d);
  updateKpis();
  if (d.destaque) addTimeline(d.destaque, d.movimento, urg);
  else if (pedido) addTimeline(`Você pediu: ${pedido.slice(0, 80)}`, 'Pedido', 'baixa');
}

function renderMem() {
  const ul = $('memoria'); ul.innerHTML = '';
  const items = [...state.memoria].reverse().sort((a, b) => state.pinned.has(b.text) - state.pinned.has(a.text));
  items.forEach((m) => {
    const li = el('li', state.pinned.has(m.text) ? 'pinned' : '');
    if (Date.now() - m.at < 8000) li.classList.add('flash');
    const pin = el('span', 'pin', state.pinned.has(m.text) ? '★' : '☆');
    pin.onclick = () => { state.pinned.has(m.text) ? state.pinned.delete(m.text) : state.pinned.add(m.text); renderMem(); };
    const txt = el('span', '', m.text);
    txt.onclick = () => copy(m.text);
    li.append(pin, txt);
    ul.append(li);
  });
  $('memCount').hidden = !state.memoria.length;
  $('memCount').textContent = String(state.memoria.length);
}

function trackUsage(u) {
  if (!u) return;
  state.tokens.prompt += u.promptTokenCount || 0;
  state.tokens.cached += u.cachedContentTokenCount || 0;
  state.tokens.out += (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
}

// ================= atalhos e cópia =================
$('digaBox').onclick = () => copy($('diga').textContent, 'Frase copiada ✔');
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable="plaintext-only"]')) return;
  if (e.key === '/') { e.preventDefault(); $('pedido').focus(); }
  else if (e.key.toLowerCase() === 'a') $('btnAjuda').click();
  else if (e.key.toLowerCase() === 'c' && $('diga').textContent) copy($('diga').textContent, 'Frase copiada ✔');
});

$('btnCopyAta').onclick = () => copy(buildMarkdown(), 'Ata copiada ✔');
$('btnFecharAta').onclick = () => { $('ataOverlay').hidden = true; };
$('btnBaixar').onclick = () => {
  const blob = new Blob([buildMarkdown()], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ata-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
};
function buildMarkdown() {
  const mapa = BRANCHES.map((b) => {
    const ls = state.map[b.k] || [];
    return ls.length ? `### ${b.t}\n${ls.map((l) => `- ${l.text}${l.sub ? ` → ${l.sub}` : ''}`).join('\n')}` : '';
  }).filter(Boolean).join('\n\n');
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join('\n\n');
  return `${$('ata').textContent}\n\n---\n\n## Mapa da reunião\n\n${mapa}\n\n---\n\n## Transcrição completa\n\n${transcricao}\n`;
}

renderCrm(); renderMap(); updateKpis();
