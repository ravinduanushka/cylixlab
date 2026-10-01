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
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:5173/student' });
  await new Promise(r => setTimeout(r, 2000));

  // Click on Motivational Quotes
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('.feature-action-btn'));
      const quoteBtn = btns.find(b => b.textContent.includes('Motivational Quotes'));
      if (quoteBtn) quoteBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot at top
  const shot1 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('D:\\cylixlab\\frontend\\quotes_top.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved quotes_top.png');

  // Scroll window down to middle
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 500);
      document.documentElement.scrollTop = 500;
      document.body.scrollTop = 500;
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Take screenshot scrolled down
  const shot2 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('D:\\cylixlab\\frontend\\quotes_scrolled.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved quotes_scrolled.png');

  // Scroll to bottom
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 1500);
      document.documentElement.scrollTop = 1500;
      document.body.scrollTop = 1500;
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const shot3 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('D:\\cylixlab\\frontend\\quotes_bottom.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved quotes_bottom.png');

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
