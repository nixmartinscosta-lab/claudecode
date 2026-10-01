// Content script do Google Meet: lê as LEGENDAS ao vivo (com o nome de quem fala)
// e manda pro painel do Mentor. Grátis — não precisa de serviço de transcrição.

(() => {
  if (window.__mentorMeet) return;
  window.__mentorMeet = true;

  let running = false;
  let poll = null;
  // bloco de legenda (elemento) -> { speaker, text, committed, changedAt }
  const blocks = new Map();

  const REGION_SEL = [
    'div[role="region"][aria-label*="egenda" i]', // Legendas
    'div[role="region"][aria-label*="aption" i]', // Captions
    'div[role="region"][aria-label*="ubtítulo" i]',
  ].join(',');

  function send(payload) {
    chrome.runtime.sendMessage({ target: 'sidepanel', source: 'meet', ...payload }).catch(() => {});
  }

  function normalizeSpeaker(name) {
    const n = (name || '').trim();
    if (!n || /^(you|você|voce|tú|tu)$/i.test(n)) return n ? 'Você' : 'Participante';
    return n;
  }

  function findRegion() {
    return document.querySelector(REGION_SEL);
  }

  function tryEnableCaptions() {
    if (findRegion()) return true;
    const btn = [...document.querySelectorAll('button[aria-label]')].find((b) =>
      /(ativar legendas|turn on captions|legendas|captions)/i.test(b.getAttribute('aria-label')) &&
      b.getAttribute('aria-pressed') !== 'true');
    if (btn) { btn.click(); return true; }
    return false;
  }

  // Lê um bloco de legenda: tenta seletores conhecidos e cai numa heurística genérica.
  function readBlock(el) {
    const nameEl = el.querySelector('.NWpY1d, .KcIKyf, .zs7s8d');
    const textEl = el.querySelector('.ygicle, .bh44bd, .iTTPOb');
    if (textEl) return { speaker: nameEl?.textContent, text: textEl.textContent };

    const leaves = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode.textContent.trim();
      if (t) leaves.push({ t, node: walker.currentNode.parentElement });
    }
    if (!leaves.length) return null;
    if (leaves.length === 1) return { speaker: '', text: leaves[0].t };
    const longest = leaves.reduce((a, b) => (b.t.length > a.t.length ? b : a));
    const speaker = leaves.find((l) => l !== longest && l.t.length <= 40)?.t || '';
    return { speaker, text: longest.t };
  }

  function getBlocks(region) {
    const known = region.querySelectorAll('.nMcdL, .TBMuR');
    if (known.length) return [...known];
    // Genérico: filhos do container que tenham texto.
    let container = region;
    while (container.children.length === 1) container = container.children[0];
    return [...container.children].filter((c) => c.textContent.trim());
  }

  function commit(el, info, isFinal) {
    const novo = info.text.slice(info.committed).trim();
    if (!novo) return;
    if (isFinal) info.committed = info.text.length;
    send({ type: 'transcript', speaker: info.speaker, text: novo, isFinal });
  }

  function scan() {
    const now = Date.now();
    const region = findRegion();
    if (region) {
      for (const el of getBlocks(region)) {
        const r = readBlock(el);
        if (!r || !r.text.trim()) continue;
        const text = r.text.replace(/\s+/g, ' ').trim();
        let info = blocks.get(el);
        if (!info) {
          info = { speaker: normalizeSpeaker(r.speaker), text, committed: 0, changedAt: now };
          blocks.set(el, info);
        } else if (info.text !== text) {
          // O Meet às vezes reescreve o começo da frase; se encolheu, recomeça o ponteiro.
          if (!text.startsWith(info.text.slice(0, info.committed))) info.committed = 0;
          info.text = text;
          info.changedAt = now;
        }
      }
    }
    for (const [el, info] of blocks) {
      const gone = !el.isConnected;
      // Fala "parou" há 2s ou o bloco saiu da tela => fecha o trecho.
      if (gone || now - info.changedAt > 2000) commit(el, info, true);
      else commit(el, info, false);
      if (gone) blocks.delete(el);
    }
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.target !== 'meet') return;
    if (msg.type === 'start') {
      running = true;
      blocks.clear();
      const ok = tryEnableCaptions();
      clearInterval(poll);
      poll = setInterval(() => running && scan(), 700);
      setTimeout(() => {
        if (running && !findRegion()) {
          send({ type: 'status', level: 'warn', text: 'Não achei as legendas. Ative no Meet (tecla "c") e deixe o idioma em Português.' });
        }
      }, 4000);
      sendResponse({ ok: true, captions: ok });
    } else if (msg.type === 'stop') {
      running = false;
      clearInterval(poll);
      for (const [el, info] of blocks) commit(el, info, true);
      blocks.clear();
      sendResponse({ ok: true });
    } else if (msg.type === 'ping') {
      sendResponse({ ok: true });
    }
  });
})();
