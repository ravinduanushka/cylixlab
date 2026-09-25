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

  // Scroll to absolute bottom
  const scrollRes = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const scrollArea = document.querySelector('.quotes-scroll-area');
        scrollArea.scrollTop = 1600;
        return {
          scrollTop: scrollArea.scrollTop,
          scrollHeight: scrollArea.scrollHeight,
          clientHeight: scrollArea.clientHeight
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Scroll to 1600 result:', scrollRes.result.value);

  await new Promise(r => setTimeout(r, 1000));

  const sBottom = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_screenshot_real_bottom.png', Buffer.from(sBottom.data, 'base64'));
  console.log('Saved test_screenshot_real_bottom.png');

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
