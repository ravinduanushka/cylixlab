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

async function testWheelAt(ws, x, y, label) {
  // reset scroll to 0
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('.quotes-scroll-area').scrollTop = 0`
  });
  await new Promise(r => setTimeout(r, 400));

  await sendCDP(ws, 'Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x, y,
    deltaX: 0,
    deltaY: 300
  });
  await new Promise(r => setTimeout(r, 500));

  const pos = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('.quotes-scroll-area').scrollTop`
  });
  console.log(`Wheel at ${label} (${x}, ${y}) => scrollTop:`, pos.result.value);
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

  // Test wheel at different coordinates:
  // 1. Over Card 1
  await testWheelAt(ws, 400, 250, 'Over Card 1');
  // 2. Over between Card 1 and Card 2 (empty gap or image)
  await testWheelAt(ws, 400, 340, 'Over gap/image');
  // 3. Over Subtitle
  await testWheelAt(ws, 600, 160, 'Over Subtitle');
  // 4. Over left capsule area
  await testWheelAt(ws, 120, 400, 'Over left area');
  // 5. Over right edge
  await testWheelAt(ws, 1100, 400, 'Over right edge');

  edge.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
