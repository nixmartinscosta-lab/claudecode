const DEFAULTS = {
  anthropicKey: '', deepgramKey: '', source: 'meet', model: 'claude-opus-5-5', effort: 'low',
  intervalSec: 30, useMic: true, dgModel: 'nova-2', dgLanguage: 'pt-BR',
};
const $ = (id) => document.getElementById(id);
let docs = [];

async function load() {
  const s = { ...DEFAULTS, ...(await chrome.storage.local.get([...Object.keys(DEFAULTS), 'docs'])) };
  for (const k of Object.keys(DEFAULTS)) {
    if (typeof DEFAULTS[k] === 'boolean') $(k).checked = s[k];
    else $(k).value = s[k];
  }
  docs = s.docs || [];
  renderDocs();
  toggleAudio();
}

function toggleAudio() {
  $('audioOpts').hidden = $('source').value !== 'audio';
}
$('source').onchange = toggleAudio;

function renderDocs() {
  const box = $('docs');
  box.innerHTML = '';
  docs.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'doc';
    const name = document.createElement('span');
    name.textContent = `📄 ${d.name}`;
    const size = document.createElement('span');
    size.className = 'muted small';
    size.textContent = `${Math.round(d.content.length / 1000)}k caracteres`;
    const spacer = document.createElement('span');
    spacer.className = 'spacer';
    const del = document.createElement('button');
    del.className = 'mini';
    del.textContent = 'remover';
    del.onclick = async () => { docs.splice(i, 1); await chrome.storage.local.set({ docs }); renderDocs(); };
    row.append(name, size, spacer, del);
    box.append(row);
  });
  const chars = docs.reduce((n, d) => n + d.content.length, 0);
  $('kbSize').textContent = docs.length
    ? `≈ ${Math.round(chars / 3.5 / 1000)}k tokens. Vai em cache: só a 1ª análise de cada reunião paga a base inteira.`
    : '';
}

$('files').onchange = async (e) => {
  for (const f of e.target.files) {
    const content = await f.text();
    const i = docs.findIndex((d) => d.name === f.name);
    if (i >= 0) docs[i] = { name: f.name, content };
    else docs.push({ name: f.name, content });
  }
  docs.sort((a, b) => a.name.localeCompare(b.name)); // ordem estável = cache estável
  await chrome.storage.local.set({ docs });
  e.target.value = '';
  renderDocs();
};

$('btnMic').onclick = async () => {
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach((t) => t.stop());
    $('micStatus').textContent = '✔ Microfone liberado';
  } catch {
    $('micStatus').textContent = '✖ Bloqueado — libere no cadeado da barra de endereço';
  }
};

$('btnSave').onclick = async () => {
  const out = {};
  for (const k of Object.keys(DEFAULTS)) {
    if (typeof DEFAULTS[k] === 'boolean') out[k] = $(k).checked;
    else if (typeof DEFAULTS[k] === 'number') out[k] = Math.max(10, Number($(k).value) || DEFAULTS[k]);
    else out[k] = $(k).value.trim();
  }
  await chrome.storage.local.set(out);
  $('saved').textContent = '✔ Salvo';
  setTimeout(() => { $('saved').textContent = ''; }, 2000);
};

load();
