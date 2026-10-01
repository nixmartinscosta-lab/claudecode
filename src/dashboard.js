import { Coach } from './coach.js';
import { CRM_CAMPOS, MOVIMENTOS, PORTOES } from './prompts.js';

const $ = (id) => document.getElementById(id);
const SETUP_FIELDS = ['modo', 'comQuem', 'objetivo', 'foco', 'notas'];
export const DEFAULTS = {
  geminiKey: '', deepgramKey: '', source: 'meet', model: 'gemini-3.5-flash', thinking: 'low',
  intervalSec: 25, useMic: true, dgModel: 'nova-2', dgLanguage: 'pt-BR',
};
const FOCO_PADRAO = 'Combos com serviço (Business, Growth, Scale) ou composições com Pós-venda / Aceleração, se a causa-raiz justificar';
const params = new URLSearchParams(location.search);

const state = {
  running: false, coach: null, source: 'meet', meetTabId: Number(params.get('tab')) || null,
  lines: [], sentUpTo: 0, interim: {}, memoria: [], crm: {},
  startedAt: 0, tick: null, questionTimer: null, tokens: { prompt: 0, cached: 0, out: 0 },
};

// ---------- montagem inicial ----------
function steps(id, items) {
  const ol = $(id);
  items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ol.append(li); });
}
steps('movimentos', MOVIMENTOS);
steps('portoes', PORTOES);

function renderCrm() {
  const dl = $('crm');
  dl.innerHTML = '';
  for (const [k, rotulo] of Object.entries(CRM_CAMPOS)) {
    const dt = document.createElement('dt');
    dt.textContent = rotulo;
    const dd = document.createElement('dd');
    dd.id = `crm_${k}`;
    dd.textContent = state.crm[k] || '—';
    dd.className = state.crm[k] ? '' : 'empty';
    dl.append(dt, dd);
  }
  const n = Object.values(state.crm).filter(Boolean).length;
  $('crmCount').textContent = `${n}/${Object.keys(CRM_CAMPOS).length}`;
}
renderCrm();

chrome.storage.local.get(['setup', 'docs']).then(({ setup, docs }) => {
  if (setup) SETUP_FIELDS.forEach((f) => { if (setup[f] != null) $(f).value = setup[f]; });
  if (!$('foco').value) $('foco').value = FOCO_PADRAO;
  showKb(docs);
});
chrome.storage.onChanged.addListener((ch) => { if (ch.docs) showKb(ch.docs.newValue); });
function showKb(docs) {
  $('kbInfo').textContent = docs?.length
    ? `📚 Base: ${docs.map((d) => d.name.replace(/\.md$/, '')).join(' · ')}`
    : '⚠ Nenhuma base carregada. Suba seus .md em ⚙ Configurações.';
}
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  chrome.storage.local.set({ setup: s });
  return s;
}
$('btnSetup').onclick = () => { $('setupBox').hidden = !$('setupBox').hidden; };

function setStatus(text, level = '') {
  const el = $('status');
  el.hidden = !text;
  el.textContent = text || '';
  el.className = `status ${level}`;
}

// Acha a aba do Meet: a que abriu o painel, ou a primeira aba do Meet aberta.
async function findMeetTab() {
  if (state.meetTabId) {
    try { return await chrome.tabs.get(state.meetTabId); } catch {}
  }
  const tabs = await chrome.tabs.query({ url: 'https://meet.google.com/*' });
  return tabs.find((t) => /meet\.google\.com\/[a-z]{3}-/.test(t.url)) || tabs[0];
}

// ---------- iniciar / parar ----------
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
        // Aba aberta antes de instalar/atualizar a extensão: injeta o leitor agora.
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
    lines: [], sentUpTo: 0, interim: {}, memoria: [], crm: {}, startedAt: Date.now(),
    tokens: { prompt: 0, cached: 0, out: 0 },
  });
  $('transcript').innerHTML = ''; $('memoria').innerHTML = ''; $('memCount').textContent = '';
  renderCrm();
  $('clienteTop').textContent = setup.comQuem ? `· ${setup.comQuem}` : '';
  $('setupBox').hidden = true;
  $('proximo').textContent = 'Ouvindo… abra com contexto e combine o objetivo da reunião.';
  $('btnStart').hidden = true; $('btnStop').hidden = false; $('dot').classList.add('on');

  let elapsed = 0;
  state.tick = setInterval(() => {
    const s = Math.floor((Date.now() - state.startedAt) / 1000);
    $('timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    if (++elapsed >= settings.intervalSec) { elapsed = 0; maybeAnalyze(); }
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

// ---------- transcrição chegando ----------
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target !== 'sidepanel') return;
  if (sender.tab && state.meetTabId && sender.tab.id !== state.meetTabId) return; // outra aba do Meet
  if (msg.type === 'status') setStatus(msg.text, msg.level);
  if (msg.type === 'transcript' && state.running) onTranscript(msg);
});

function onTranscript({ source, speaker, text, isFinal }) {
  if (!isFinal) {
    state.interim[speaker] = `${speaker}: ${text}`;
    $('interim').textContent = Object.values(state.interim).filter(Boolean).join('  ·  ');
    return;
  }
  state.interim[speaker] = '';
  $('interim').textContent = Object.values(state.interim).filter(Boolean).join('  ·  ');

  const last = state.lines[state.lines.length - 1];
  if (last && last.speaker === speaker && state.lines.length > state.sentUpTo) {
    last.text += ` ${text}`;
    last.el.lastChild.textContent = ` ${last.text}`;
  } else {
    const p = document.createElement('p');
    const b = document.createElement('b');
    b.textContent = `${speaker}:`;
    if (speaker === 'Você') b.className = 'me';
    p.append(b, document.createTextNode(` ${text}`));
    $('transcript').append(p);
    state.lines.push({ speaker, text, source, el: p });
  }
  $('transcript').scrollTop = $('transcript').scrollHeight;

  // O integrador fez uma pergunta? Orienta já, sem esperar o intervalo.
  if (speaker !== 'Você' && /\?\s*$/.test(text)) {
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

// ---------- análise ----------
async function maybeAnalyze(force = false, pedido = '') {
  if (!state.coach || state.coach.busy) return;
  if (!force && !pedido && newWordCount() < 12) return; // nada novo relevante: não gasta
  const from = state.sentUpTo;
  const novas = takeNewLines();
  $('btnAjuda').disabled = true;
  $('coach').classList.add('thinking');
  try {
    const res = await state.coach.analyze(novas, pedido);
    if (res) { render(res.data); trackUsage(res.usage); }
  } catch (e) {
    state.sentUpTo = Math.min(from, state.sentUpTo); // devolve as falas pra próxima tentativa
    setStatus(`IA: ${e.message}`, 'error');
  } finally {
    $('btnAjuda').disabled = false;
    $('coach').classList.remove('thinking');
  }
}

$('btnAjuda').onclick = () => {
  if (!state.coach) { setStatus('Clique em “▶ Começar” primeiro.', 'warn'); return; }
  const pedido = $('pedido').value.trim();
  $('pedido').value = '';
  maybeAnalyze(true, pedido);
};
$('pedido').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnAjuda').click(); });

// ---------- render ----------
function fillList(id, items) {
  const ul = $(id);
  ul.innerHTML = '';
  (items || []).forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
  $(`${id}Box`).hidden = !items?.length;
}

function markSteps(id, items, current, stuck) {
  const idx = items.indexOf(current);
  [...$(id).children].forEach((li, i) => {
    li.className = i === idx ? (stuck ? 'stuck' : 'cur') : i < idx ? 'done' : '';
  });
}

function render(d) {
  if (state.running || d) setStatus('');
  $('coach').className = `card now urg-${d.urgencia || 'baixa'}`;
  $('proximo').textContent = d.proximo_passo || 'Continue ouvindo.';
  $('diga').textContent = d.diga || '';
  $('digaBox').hidden = !d.diga;
  fillList('perguntas', d.perguntas);
  fillList('alertas', d.alertas);
  fillList('falta_cobrir', d.falta_cobrir);
  markSteps('movimentos', MOVIMENTOS, d.movimento, false);
  markSteps('portoes', PORTOES, d.portao, true);
  $('etapa').textContent = d.etapa || '';

  // Ficha CRM: só sobrescreve campos que vieram preenchidos.
  for (const [k, v] of Object.entries(d.crm || {})) {
    if (!v || !(k in CRM_CAMPOS) || v === state.crm[k]) continue;
    state.crm[k] = v;
    const dd = $(`crm_${k}`);
    dd.textContent = v;
    dd.className = '';
    void dd.offsetWidth; // reinicia a animação
    dd.className = 'flash';
  }
  $('crmCount').textContent = `${Object.values(state.crm).filter(Boolean).length}/${Object.keys(CRM_CAMPOS).length}`;

  if (d.rota?.solucao) {
    $('rotaSolucao').textContent = d.rota.solucao;
    $('rotaSolucao').classList.remove('muted');
    $('rotaMotivo').textContent = d.rota.motivo || '';
    $('rotaInvest').textContent = d.rota.investimento ? `💰 ${d.rota.investimento}` : '';
  }

  for (const info of d.info_chave || []) {
    if (state.memoria.some((m) => m.toLowerCase() === info.toLowerCase())) continue;
    state.memoria.push(info);
    const li = document.createElement('li');
    li.textContent = info;
    li.className = 'flash';
    $('memoria').prepend(li);
  }
  $('memCount').textContent = state.memoria.length ? `(${state.memoria.length})` : '';
}

function trackUsage(u) {
  if (!u) return;
  state.tokens.prompt += u.promptTokenCount || 0;
  state.tokens.cached += u.cachedContentTokenCount || 0;
  state.tokens.out += (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
  const k = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);
  const t = state.tokens;
  $('custo').textContent = `tokens ${k(t.prompt)} in (${k(t.cached)} cache) · ${k(t.out)} out`;
}

// ---------- copiar / baixar ----------
$('btnCopy').onclick = () => navigator.clipboard.writeText($('diga').textContent);
$('btnCopyAta').onclick = () => navigator.clipboard.writeText(buildMarkdown());
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
  const transcricao = state.lines.map((l) => `**${l.speaker}:** ${l.text}`).join('\n\n');
  return `${$('ata').textContent}\n\n---\n\n## Transcrição completa\n\n${transcricao}\n`;
}
