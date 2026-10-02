import { Coach } from './coach.js';
import { DOUTRINA } from './doutrina.js';
import { MODOS_ESTUDIO, baseDeConhecimento, correcoesOficiais } from './prompts.js';
import { renderMarkdown, followUp } from './md.js';

const $ = (id) => document.getElementById(id);
const DEFAULTS = { geminiKey: '', model: 'gemini-3.5-flash', thinking: 'low', correcoes: '' };
let modo = 'analisar';
let arquivos = [];
let resultado = '';

function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 1800); }
function setStatus(text, level = '') { const s = $('status'); s.hidden = !text; s.textContent = text || ''; s.className = `status ${level}`; }
function copy(t, msg) { navigator.clipboard.writeText(t).then(() => toast(msg)).catch(() => toast('Não consegui copiar; selecione o texto.')); }

// ---- modos ----
Object.entries(MODOS_ESTUDIO).forEach(([k, m]) => {
  const b = document.createElement('button');
  b.className = 'modo'; b.dataset.k = k; b.setAttribute('role', 'radio');
  const dot = document.createElement('span'); dot.className = 'dot2';
  const nome = document.createElement('b'); nome.textContent = m.nome;
  const d = document.createElement('span'); d.className = 'd'; d.textContent = m.desc;
  b.append(dot, nome, d);
  b.onclick = () => setModo(k);
  $('modos').append(b);
});
function setModo(k) {
  modo = k;
  document.querySelectorAll('.modo').forEach((b) => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  $('materialHint').textContent = MODOS_ESTUDIO[k].material;
  try { localStorage.setItem('estudioModo', k); } catch {}
}
let inicial = 'analisar';
try { inicial = localStorage.getItem('estudioModo') || inicial; } catch {}
const hashModo = location.hash.slice(1);
setModo(MODOS_ESTUDIO[hashModo] ? hashModo : MODOS_ESTUDIO[inicial] ? inicial : 'analisar');

chrome.storage.local.get('docs').then(({ docs }) => {
  $('kbInfo').textContent = docs?.length ? `base: ${docs.length} arquivo(s)` : 'sem base: suba os .md nas Configurações';
});

// ---- arquivos ----
function renderFiles() {
  const ul = $('fileList'); ul.innerHTML = '';
  arquivos.forEach((f, i) => {
    const li = document.createElement('li');
    const n = document.createElement('span'); n.className = 'fn'; n.textContent = f.name;
    const x = document.createElement('span'); x.className = 'x'; x.textContent = '✕'; x.title = 'remover';
    x.onclick = () => { arquivos.splice(i, 1); renderFiles(); };
    li.append(n, x); ul.append(li);
  });
}
async function addFiles(list) {
  for (const f of list) {
    if (f.size > 3_000_000) { toast(`${f.name} é grande demais (máx. 3 MB)`); continue; }
    arquivos.push({ name: f.name, content: await f.text() });
  }
  renderFiles();
}
$('pickFiles').onclick = (e) => { e.preventDefault(); $('files').click(); };
$('files').onchange = (e) => { addFiles([...e.target.files]); e.target.value = ''; };
const dz = $('dropZone');
dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('over'); });
dz.addEventListener('dragleave', () => dz.classList.remove('over'));
dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('over'); addFiles([...e.dataTransfer.files]); });

// ---- gerar ----
$('btnGerar').onclick = async () => {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULTS), 'docs']);
  const settings = { ...DEFAULTS, ...stored };
  if (!settings.geminiKey) { setStatus('Falta a chave do Gemini. Abra as Configurações (⚙).', 'warn'); return; }
  const material = $('material').value.trim();
  if (!material && !arquivos.length) { setStatus('Cole o material ou envie um arquivo.', 'warn'); return; }
  setStatus('');
  const coach = new Coach(settings, {}, stored.docs || []);
  // Fora da reunião: só a doutrina, as correções e a base (sem o modo ao vivo).
  coach.system = [DOUTRINA, correcoesOficiais(settings.correcoes), baseDeConhecimento(stored.docs || [])].filter(Boolean).join('\n\n');
  const partes = [
    MODOS_ESTUDIO[modo].pedido,
    'Escreva em português, curto e escaneável, sem travessões. Comece pelo material enviado.',
    $('lead').value.trim() ? `Lead / integrador: ${$('lead').value.trim()}` : '',
    'MATERIAL ENVIADO PELO USUÁRIO:',
    material ? `<texto_colado>\n${material}\n</texto_colado>` : '',
    ...arquivos.map((f) => `<arquivo nome="${f.name}">\n${f.content}\n</arquivo>`),
  ].filter(Boolean);
  $('btnGerar').disabled = true;
  $('out').innerHTML = '<p class="es-wait">Analisando com a sua doutrina e a base…</p>';
  try {
    const res = await coach.send(partes.join('\n\n'), false);
    resultado = res?.text || '';
    renderMarkdown($('out'), resultado || 'O Gemini não retornou texto. Tente de novo.');
    const u = res?.usage;
    $('custo').textContent = u ? `${Math.round((u.promptTokenCount || 0) / 1000)}k tokens de entrada` : '';
    ['btnCopy', 'btnBaixar', 'btnDossie'].forEach((id) => { $(id).disabled = !resultado; });
    $('btnFollow').hidden = !followUp(resultado);
  } catch (e) {
    $('out').innerHTML = '';
    setStatus(`Gemini: ${e.message}`, 'error');
  } finally {
    $('btnGerar').disabled = false;
  }
};

// ---- ações ----
$('btnCopy').onclick = () => copy(resultado, 'Resultado copiado ✔');
$('btnFollow').onclick = () => copy(followUp(resultado), 'Follow-up copiado ✔');
$('btnBaixar').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([resultado], { type: 'text/markdown' }));
  const nome = ($('lead').value.trim() || 'lead').toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
  a.download = `${modo}-${nome}-${new Date().toISOString().slice(0, 10)}.md`;
  a.click(); URL.revokeObjectURL(a.href);
};
// Manda o resultado para o dossiê do lead usado no painel ao vivo.
$('btnDossie').onclick = async () => {
  const { leadDocs = [], leadOwner } = await chrome.storage.local.get(['leadDocs', 'leadOwner']);
  const name = `${modo}-${new Date().toISOString().slice(0, 10)}.md`;
  const i = leadDocs.findIndex((d) => d.name === name);
  if (i >= 0) leadDocs[i] = { name, content: resultado }; else leadDocs.push({ name, content: resultado });
  const set = { leadDocs };
  if (!leadOwner && $('lead').value.trim()) set.leadOwner = $('lead').value.trim();
  await chrome.storage.local.set(set);
  if ($('lead').value.trim()) {
    const { setup = {} } = await chrome.storage.local.get('setup');
    await chrome.storage.local.set({ setup: { ...setup, comQuem: setup.comQuem || $('lead').value.trim() } });
  }
  toast('Enviado ao dossiê do lead. Aparece na Preparação do painel.');
};
