import { Coach } from './coach.js';

const $ = (id) => document.getElementById(id);
const SETUP_FIELDS = ['modo', 'comQuem', 'objetivo', 'foco', 'notas'];
const DEFAULTS = {
  anthropicKey: '', deepgramKey: '', source: 'meet', model: 'claude-opus-5-5', effort: 'low',
  intervalSec: 30, useMic: true, dgModel: 'nova-2', dgLanguage: 'pt-BR',
};
const FOCO_PADRAO = 'Combos com serviço (Business, Growth, Scale) ou composições com Pós-venda / Aceleração, se a causa-raiz justificar';

const state = {
  running: false,
  coach: null,
  lines: [],        // falas finais [{speaker, text, source}]
  sentUpTo: 0,      // índice da próxima fala ainda não analisada
  interim: {},      // texto parcial por fonte
  memoria: [],
  startedAt: 0,
  tick: null,
  questionTimer: null,
  inputTokens: 0, cachedTokens: 0, outputTokens: 0,
};

// ---------- setup persistido ----------
chrome.storage.local.get(['setup', 'docs']).then(({ setup, docs }) => {
  if (setup) SETUP_FIELDS.forEach((f) => { if (setup[f] != null) $(f).value = setup[f]; });
  if (!$('foco').value) $('foco').value = FOCO_PADRAO;
  showKb(docs);
});
chrome.storage.onChanged.addListener((ch) => { if (ch.docs) showKb(ch.docs.newValue); });
function showKb(docs) {
  $('kbInfo').textContent = docs?.length
    ? `📚 Base carregada: ${docs.length} arquivo(s) — ${docs.map((d) => d.name.replace(/\.md$/, '')).join(', ')}`
    : '⚠ Nenhuma base carregada. Suba seus .md (playbook, preços, ACR…) em ⚙ Configurações.';
}

// Aba da reunião: a ativa desta janela (o painel fica preso a ela).
async function meetingTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}
function readSetup() {
  const s = Object.fromEntries(SETUP_FIELDS.map((f) => [f, $(f).value.trim()]));
  chrome.storage.local.set({ setup: s });
  return s;
}

function setStatus(text, level = '') {
  const el = $('status');
  el.hidden = !text;
  el.textContent = text || '';
  el.className = `status ${level}`;
}

// ---------- iniciar / parar ----------
$('btnStart').onclick = async () => {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULTS), 'docs']);
  const settings = { ...DEFAULTS, ...stored };
  if (!settings.anthropicKey || (settings.source === 'audio' && !settings.deepgramKey)) {
    setStatus('Falta configurar a chave da API. Abrindo configurações…', 'warn');
    chrome.runtime.openOptionsPage();
    return;
  }
  const setup = readSetup();
  $('btnStart').disabled = true;
  try {
    if (settings.source === 'meet') {
      const tab = await meetingTab();
      setStatus('Conectando às legendas do Meet…');
      try {
        if (!tab) throw new Error();
        await chrome.tabs.sendMessage(tab.id, { target: 'meet', type: 'start' });
      } catch {
        throw new Error('Não consegui falar com o Google Meet. Deixe a aba do Meet ativa e recarregue ela (F5) uma vez depois de instalar a extensão.');
      }
      state.meetTabId = tab.id;
      setStatus('Lendo as legendas do Meet. Se não aparecer nada, aperte "c" no Meet.', 'ok');
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
  state.source = settings.source;

  Object.assign(state, {
    running: true, coach: new Coach(settings, setup, stored.docs || []), lines: [], sentUpTo: 0, interim: {},
    memoria: [], startedAt: Date.now(), inputTokens: 0, cachedTokens: 0, outputTokens: 0,
  });
  $('transcript').innerHTML = ''; $('memoria').innerHTML = ''; $('memCount').textContent = '';
  $('ataBox').hidden = true; $('coach').hidden = true;
  $('setupBox').open = false;
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
    const ata = await state.coach.ata(takeNewLines());
    $('ata').textContent = ata;
    $('ataBox').hidden = false;
    $('ataBox').scrollIntoView({ behavior: 'smooth' });
    setStatus('');
  } catch (e) {
    setStatus(`Erro ao gerar ata: ${e.message}`, 'error');
  }
};

// ---------- transcrição chegando do offscreen ----------
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== 'sidepanel') return;
  if (msg.type === 'status') setStatus(msg.text, msg.level);
  if (msg.type === 'transcript' && state.running) onTranscript(msg);
});

function onTranscript({ source, speaker, text, isFinal }) {
  if (!isFinal) {
    state.interim[source] = `${speaker}: ${text}`;
    $('interim').textContent = Object.values(state.interim).join('  ·  ');
    return;
  }
  state.interim[source] = '';
  $('interim').textContent = Object.values(state.interim).filter(Boolean).join('  ·  ');

  // Junta falas seguidas do mesmo locutor.
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
  const box = $('transcript');
  box.scrollTop = box.scrollHeight;

  // Fizeram uma pergunta? Orienta logo, sem esperar o intervalo.
  if (speaker !== 'Você' && /\?\s*$/.test(text)) {
    clearTimeout(state.questionTimer);
    state.questionTimer = setTimeout(() => maybeAnalyze(true), 1500);
  }
}

function takeNewLines() {
  const novas = state.lines.slice(state.sentUpTo).map(({ speaker, text }) => ({ speaker, text }));
  state.sentUpTo = state.lines.length;
  return novas;
}

function newWordCount() {
  return state.lines.slice(state.sentUpTo).reduce((n, l) => n + l.text.split(/\s+/).length, 0);
}

// ---------- análise ----------
async function maybeAnalyze(force = false, pedido = '') {
  if (!state.coach || state.coach.busy) return;
  if (!force && !pedido && newWordCount() < 15) return; // nada relevante novo: não gasta token
  const from = state.sentUpTo;
  const novas = takeNewLines();
  $('btnAjuda').disabled = true;
  try {
    const res = await state.coach.analyze(novas, pedido);
    if (res) { renderCoach(res.data); trackUsage(res.usage); }
  } catch (e) {
    state.sentUpTo = from; // devolve as falas pra próxima tentativa
    setStatus(`IA: ${e.message}`, 'error');
  } finally {
    $('btnAjuda').disabled = false;
  }
}

$('btnAjuda').onclick = () => {
  const pedido = $('pedido').value.trim();
  if (!state.coach) {
    setStatus('Clique em “Começar” primeiro.', 'warn');
    return;
  }
  $('pedido').value = '';
  maybeAnalyze(true, pedido);
};
$('pedido').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnAjuda').click(); });

function fillList(id, items) {
  const ul = $(id);
  ul.innerHTML = '';
  items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
  $(`${id}Box`).hidden = !items.length;
}

function renderCoach(d) {
  $('coach').hidden = false;
  $('coach').className = `card urg-${d.urgencia || 'baixa'}`;
  $('momento').textContent = d.etapa || '';
  $('portao').textContent = d.portao && d.portao !== 'Indefinido' ? `Portão travado: ${d.portao}` : '';
  $('proximo').textContent = d.proximo_passo || 'Continue ouvindo.';
  $('diga').textContent = d.diga || '';
  $('digaBox').hidden = !d.diga;
  fillList('perguntas', d.perguntas || []);
  fillList('alertas', d.alertas || []);
  fillList('falta_cobrir', d.falta_cobrir || []);

  for (const info of d.info_chave || []) {
    if (state.memoria.some((m) => m.toLowerCase() === info.toLowerCase())) continue;
    state.memoria.push(info);
    const li = document.createElement('li');
    li.textContent = info;
    $('memoria').prepend(li);
  }
  $('memCount').textContent = state.memoria.length ? `(${state.memoria.length})` : '';
  if (d.urgencia === 'alta') setStatus('');
}

function trackUsage(u) {
  if (!u) return;
  state.inputTokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0);
  state.cachedTokens += u.cache_read_input_tokens || 0;
  state.outputTokens += u.output_tokens || 0;
  const k = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);
  $('custo').textContent = `tokens: ${k(state.inputTokens)} in · ${k(state.cachedTokens)} cache · ${k(state.outputTokens)} out`;
}

// ---------- copiar / baixar ----------
$('btnCopy').onclick = () => navigator.clipboard.writeText($('diga').textContent);
$('btnCopyAta').onclick = () => navigator.clipboard.writeText(buildMarkdown());
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
