// Service worker: abre o painel lateral e controla a captura de áudio via documento offscreen.

let meetingTabId = null;

// Clique no ícone = abre o painel E concede activeTab na aba da reunião (necessário pro tabCapture).
// sidePanel.open PRECISA ser a primeira chamada (sem await antes), senão o Chrome
// perde o "gesto do usuário" e o painel não abre.
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id }).catch((e) => console.error('sidePanel.open', e));
  meetingTabId = tab.id;
  chrome.storage.session.set({ meetingTabId, meetingTabTitle: tab.title || '' });
});

// Selo "ON" no ícone quando a extensão está ativa numa aba do Meet.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.target === 'background' && msg.type === 'meet-ready' && sender.tab) {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#16a34a' });
  }
});

async function ensureOffscreen() {
  const existing = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
  if (existing.length) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Capturar áudio da aba da reunião e do microfone para transcrição.',
  });
}

async function closeOffscreen() {
  const existing = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
  if (existing.length) await chrome.offscreen.closeDocument();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== 'background') return;

  (async () => {
    try {
      if (msg.type === 'start-capture') {
        if (meetingTabId == null) {
          ({ meetingTabId } = await chrome.storage.session.get('meetingTabId'));
        }
        if (meetingTabId == null) {
          throw new Error('Clique no ícone da extensão estando na aba da reunião.');
        }
        const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: meetingTabId });
        await ensureOffscreen();
        const res = await chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'start',
          streamId,
          settings: msg.settings,
        });
        if (res?.error) throw new Error(res.error);
        sendResponse({ ok: true });
      } else if (msg.type === 'stop-capture') {
        await chrome.runtime.sendMessage({ target: 'offscreen', type: 'stop' }).catch(() => {});
        await closeOffscreen();
        sendResponse({ ok: true });
      }
    } catch (e) {
      sendResponse({ error: e.message || String(e) });
    }
  })();
  return true; // resposta assíncrona
});
