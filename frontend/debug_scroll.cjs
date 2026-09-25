const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

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

  const targets = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:5173/student' });

  await new Promise(r => setTimeout(r, 2000));

  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.feature-action-btn'));
        const quoteBtn = btns.find(b => b.textContent.includes('Motivational Quotes'));
        if (quoteBtn) quoteBtn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  const debugInfo = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.quotes-scroll-area');
        const before = el.scrollTop;
        el.scrollTop = 500;
        const immediateAfter = el.scrollTop;
        
        el.scrollTo({ top: 500, behavior: 'instant' });
        const instantAfter = el.scrollTop;

        el.scrollBy(0, 500);
        const byAfter = el.scrollTop;

        return {
          before,
          immediateAfter,
          instantAfter,
          byAfter,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollBehavior: window.getComputedStyle(el).scrollBehavior,
          overflowY: window.getComputedStyle(el).overflowY,
          styleText: el.getAttribute('style')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Debug scroll:', debugInfo.result.value);

  // Wait 1 second and check scrollTop
  await new Promise(r => setTimeout(r, 1000));
  const later = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('.quotes-scroll-area').scrollTop`
  });
  console.log('ScrollTop after 1s:', later.result.value);

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
