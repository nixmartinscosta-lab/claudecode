// Documento offscreen: pega o áudio da aba (os outros) + microfone (você)
// e manda cada um pra transcrição em tempo real no Deepgram.

let session = null;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== 'offscreen') return;
  if (msg.type === 'start') {
    start(msg.streamId, msg.settings).then(
      () => sendResponse({ ok: true }),
      (e) => sendResponse({ error: e.message || String(e) }),
    );
    return true;
  }
  if (msg.type === 'stop') {
    stop();
    sendResponse({ ok: true });
  }
});

function emit(payload) {
  chrome.runtime.sendMessage({ target: 'sidepanel', ...payload }).catch(() => {});
}

async function start(streamId, settings) {
  stop();
  if (!settings.deepgramKey) throw new Error('Configure a chave do Deepgram nas opções.');

  const tabStream = await navigator.mediaDevices.getUserMedia({
    audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId } },
    video: false,
  });

  // tabCapture silencia a aba: devolve o som pros seus fones.
  const ctx = new AudioContext();
  ctx.createMediaStreamSource(tabStream).connect(ctx.destination);

  session = { ctx, streams: [tabStream], sockets: [], recorders: [], timers: [] };
  openChannel(tabStream, 'tab', settings, true);

  if (settings.useMic) {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      session.streams.push(micStream);
      openChannel(micStream, 'mic', settings, false);
    } catch (e) {
      emit({ type: 'status', level: 'warn', text: 'Microfone bloqueado — abra as Opções e clique em "Liberar microfone". Seguindo só com o áudio da reunião.' });
    }
  }
}

function openChannel(stream, source, settings, diarize) {
  const params = new URLSearchParams({
    model: settings.dgModel || 'nova-2',
    language: settings.dgLanguage || 'pt-BR',
    punctuate: 'true',
    smart_format: 'true',
    interim_results: 'true',
    endpointing: '400',
    diarize: String(diarize),
  });
  const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?${params}`, ['token', settings.deepgramKey]);
  const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
  session.sockets.push(ws);
  session.recorders.push(recorder);

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data);
  };

  ws.onopen = () => {
    recorder.start(250);
    emit({ type: 'status', level: 'ok', text: source === 'tab' ? 'Ouvindo a reunião…' : 'Ouvindo seu microfone…' });
    // Mantém a conexão viva em silêncios longos.
    session.timers.push(setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'KeepAlive' }));
    }, 8000));
  };

  ws.onmessage = (ev) => {
    let data;
    try { data = JSON.parse(ev.data); } catch { return; }
    if (data.type !== 'Results') return;
    const alt = data.channel?.alternatives?.[0];
    const text = alt?.transcript?.trim();
    if (!text) return;
    let speaker = source === 'mic' ? 'Você' : 'Participante';
    if (source === 'tab' && alt.words?.length && alt.words[0].speaker != null) {
      speaker = `Participante ${alt.words[0].speaker + 1}`;
    }
    emit({ type: 'transcript', source, speaker, text, isFinal: !!data.is_final });
  };

  ws.onerror = () => emit({ type: 'status', level: 'error', text: `Erro na transcrição (${source}). Confira a chave do Deepgram.` });
  ws.onclose = (ev) => {
    if (ev.code !== 1000 && session) {
      emit({ type: 'status', level: 'error', text: `Transcrição (${source}) caiu: ${ev.reason || ev.code}` });
    }
  };
}

function stop() {
  if (!session) return;
  const s = session;
  session = null;
  s.timers.forEach(clearInterval);
  s.recorders.forEach((r) => { try { r.state !== 'inactive' && r.stop(); } catch {} });
  s.sockets.forEach((ws) => {
    try {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'CloseStream' }));
      ws.close(1000);
    } catch {}
  });
  s.streams.forEach((st) => st.getTracks().forEach((t) => t.stop()));
  s.ctx.close().catch(() => {});
}
