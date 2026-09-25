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

  // Inject updated CSS for 4-card window
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      const style = document.createElement('style');
      style.innerHTML = \`
        .quotes-stage-wrapper {
          height: 396px !important;
          max-height: 396px !important;
          min-height: 396px !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .quotes-scroll-area {
          height: 396px !important;
          overflow-y: scroll !important;
          scroll-snap-type: y mandatory !important;
          scroll-behavior: smooth !important;
          padding: 4px 14px 4px 4px !important;
        }
        .quotes-staggered-list {
          gap: 12px !important;
          padding: 0 !important;
        }
        .quote-pill-card {
          height: 86px !important;
          min-height: 86px !important;
          max-height: 86px !important;
          padding: 8px 18px !important;
          width: 65% !important;
          scroll-snap-align: start !important;
          scroll-snap-stop: always !important;
          box-sizing: border-box !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .quote-body {
          font-size: 13px !important;
          line-height: 1.35 !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }
        .quote-speaker {
          font-size: 11.5px !important;
          margin-top: 2px !important;
        }
        .quote-number {
          font-size: 18px !important;
        }
      \`;
      document.head.appendChild(style);
    `
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture initial state (Quotes 1, 2, 3, 4)
  const ss1 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_4cards_step0.png', Buffer.from(ss1.data, 'base64'));
  console.log('Saved test_4cards_step0.png');

  // Step 1: Scroll down by 1 card (98px)
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      document.querySelector('.quotes-scroll-area').scrollTop = 98;
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ss2 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_4cards_step1.png', Buffer.from(ss2.data, 'base64'));
  console.log('Saved test_4cards_step1.png');

  // Step 2: Scroll down by 2 cards (196px)
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      document.querySelector('.quotes-scroll-area').scrollTop = 196;
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ss3 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_4cards_step2.png', Buffer.from(ss3.data, 'base64'));
  console.log('Saved test_4cards_step2.png');

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
