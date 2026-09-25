const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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

  await new Promise(r => setTimeout(r, 2000));

  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('.feature-action-btn'));
      const quoteBtn = btns.find(b => b.textContent.includes('Motivational Quotes'));
      if (quoteBtn) quoteBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Send 30 wheel ticks downward over the middle of the cards
  for (let i = 0; i < 30; i++) {
    await sendCDP(ws, 'Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 600,
      y: 400,
      deltaX: 0,
      deltaY: 200
    });
    await new Promise(r => setTimeout(r, 50));
  }

  await new Promise(r => setTimeout(r, 1500));

  const scrollInfo = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.quotes-scroll-area');
        const cards = Array.from(document.querySelectorAll('.quote-pill-card'));
        const visibleCards = cards.map(c => {
          const rect = c.getBoundingClientRect();
          const parentRect = el.getBoundingClientRect();
          const isVisible = rect.bottom > parentRect.top && rect.top < parentRect.bottom;
          return {
            num: c.querySelector('.quote-number').textContent,
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            isVisible
          };
        }).filter(c => c.isVisible);

        return {
          scrollTop: el.scrollTop,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          maxScroll: el.scrollHeight - el.clientHeight,
          visibleCards
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Scroll info at end of 30 wheel events:', JSON.stringify(scrollInfo.result.value, null, 2));

  const ss = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_max_wheel_scroll.png', Buffer.from(ss.data, 'base64'));

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
