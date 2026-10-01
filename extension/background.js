// Service worker: abre o painel ao vivo e controla a captura de áudio via documento offscreen.

let meetingTabId = null;

// Clique no ícone: abre (ou traz pra frente) a janela do painel ao vivo,
// ligada à aba atual. O clique também concede activeTab (usado no modo áudio).
chrome.action.onClicked.addListener(async (tab) => {
  const saved = await chrome.storage.session.get(['dashboardWindowId', 'meetingTabId']);
  const { dashboardWindowId } = saved;
  // Clique feito na própria janela do painel não muda a aba da reunião.
  if (tab.windowId !== dashboardWindowId) {
    meetingTabId = tab.id;
    chrome.storage.session.set({ meetingTabId });
  } else {
    meetingTabId = saved.meetingTabId ?? null;
  }
  const url = chrome.runtime.getURL(`dashboard.html?tab=${meetingTabId ?? tab.id}`);
  if (dashboardWindowId != null) {
    try {
      await chrome.windows.update(dashboardWindowId, { focused: true });
      chrome.runtime.sendMessage({ target: 'sidepanel', type: 'set-meet-tab', tabId: meetingTabId }).catch(() => {});
      return;
    } catch { /* janela foi fechada */ }
  }
  const win = await chrome.windows.create({ url, type: 'popup', width: 1280, height: 860, focused: true });
  chrome.storage.session.set({ dashboardWindowId: win.id });
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
        ({ meetingTabId } = await chrome.storage.session.get('meetingTabId'));
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
