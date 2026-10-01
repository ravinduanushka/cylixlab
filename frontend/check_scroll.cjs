const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      const resp = JSON.parse(event.data);
      if (resp.id === id) {
        ws.removeEventListener('message', handler);
        if (resp.error) reject(resp.error);
        else resolve(resp.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function main() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const targets = await new Promise(res => {
    http.get('http://127.0.0.1:9222/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    });
  });

  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:5173/student' });
  await new Promise(r => setTimeout(r, 1500));

  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('.feature-action-btn'));
      const quoteBtn = btns.find(b => b.textContent.includes('Motivational Quotes'));
      if (quoteBtn) quoteBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const scrollInfo = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const page = document.querySelector('.student-dashboard-page');
        const doc = document.documentElement;
        const body = document.body;
        return JSON.stringify({
          page: { scrollHeight: page.scrollHeight, clientHeight: page.clientHeight, overflowY: getComputedStyle(page).overflowY },
          doc: { scrollHeight: doc.scrollHeight, clientHeight: doc.clientHeight, overflowY: getComputedStyle(doc).overflowY },
          body: { scrollHeight: body.scrollHeight, clientHeight: body.clientHeight, overflowY: getComputedStyle(body).overflowY }
        }, null, 2);
      })()
    `
  });

  console.log('Scroll Info:', scrollInfo.result.value);
  edge.kill();
}
main().catch(console.error);
