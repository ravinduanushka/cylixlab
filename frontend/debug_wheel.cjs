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

  // Click Motivational Quotes button
  const clickRes = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button, .feature-action-btn'));
        const quoteBtn = btns.find(b => b.textContent && b.textContent.includes('Motivational Quotes'));
        if (quoteBtn) {
          quoteBtn.click();
          return 'Clicked quote button';
        }
        return 'Not found. Btns: ' + btns.map(b => b.textContent.trim()).filter(Boolean).join(' | ');
      })()
    `
  });
  console.log('Click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const pageState = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        return {
          h1: document.querySelector('h1') ? document.querySelector('h1').textContent : null,
          hasQuotesView: !!document.querySelector('.quotes-content-wrapper')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Page state:', pageState.result.value);

  // Find the exact bounding rect of quote cards and scroll area
  const rects = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const scrollArea = document.querySelector('.quotes-scroll-area');
        const card1 = document.querySelector('.quote-pill-card');
        const img = document.querySelector('.quotes-bg-img');
        const subtitle = document.querySelector('.quotes-main-subtitle');
        const toPlain = (r) => r ? ({ x: r.x, y: r.y, width: r.width, height: r.height }) : null;
        return {
          scrollArea: toPlain(scrollArea ? scrollArea.getBoundingClientRect() : null),
          card1: toPlain(card1 ? card1.getBoundingClientRect() : null),
          img: toPlain(img ? img.getBoundingClientRect() : null),
          subtitle: toPlain(subtitle ? subtitle.getBoundingClientRect() : null),
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Rects:', JSON.stringify(rects.result.value, null, 2));

  // Simulate mouse wheel over Card 1
  const card1 = rects.result.value.card1;
  const wheelX = Math.round(card1.x + card1.width / 2);
  const wheelY = Math.round(card1.y + card1.height / 2);

  console.log('Sending mouse wheel at', wheelX, wheelY);
  await sendCDP(ws, 'Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: wheelX,
    y: wheelY,
    deltaX: 0,
    deltaY: 300
  });

  await new Promise(r => setTimeout(r, 800));

  const pos1 = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('.quotes-scroll-area').scrollTop`
  });
  console.log('ScrollTop after wheel on card1:', pos1.result.value);

  // Send multiple wheel ticks downwards
  for (let i = 0; i < 5; i++) {
    await sendCDP(ws, 'Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: wheelX,
      y: wheelY,
      deltaX: 0,
      deltaY: 200
    });
    await new Promise(r => setTimeout(r, 100));
  }

  await new Promise(r => setTimeout(r, 1000));

  const pos2 = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('.quotes-scroll-area').scrollTop`
  });
  console.log('ScrollTop after 5 ticks:', pos2.result.value);

  const screenshot = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:\\cylixlab\\frontend\\test_real_wheel_scroll.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved test_real_wheel_scroll.png');

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
