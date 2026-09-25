const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  // wait 2 seconds for Edge to start
  await new Promise(r => setTimeout(r, 2000));

  // Get debug targets
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const targets = JSON.parse(data);
        console.log('Targets:', targets.map(t => ({ title: t.title, url: t.url, ws: t.webSocketDebuggerUrl })));
        edge.kill();
      } catch (e) {
        console.error(e);
        edge.kill();
      }
    });
  }).on('error', (err) => {
    console.error('HTTP error:', err.message);
    edge.kill();
  });
}

main();
