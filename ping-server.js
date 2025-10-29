#!/usr/bin/env node

const http = require('http');

// Targets: either TARGET_URLS (comma/newline/semicolon separated) or single TARGET_URL
const rawTargets = process.env.TARGET_URLS || process.env.TARGET_URL || 'https://one23hostderjit.onrender.com';
const targets = rawTargets.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
if (targets.length === 0) {
	console.error('ERROR: no targets configured (set TARGET_URL or TARGET_URLS)');
	process.exit(1);
}

const intervalMs = parseInt(process.env.INTERVAL_MS || '60000', 10);
const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10);

async function pingOne(target) {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		const res = await fetch(target, { signal: controller.signal });
		clearTimeout(timer);
		console.log(new Date().toISOString(), 'PING', target, '->', res.status);
		return { target, ok: true, status: res.status };
	} catch (err) {
		const msg = err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || err;
		console.error(new Date().toISOString(), 'PING FAILED', target, msg);
		return { target, ok: false, error: String(msg) };
	}
}

async function pingAll() {
	console.log(new Date().toISOString(), 'START PING', targets.length, 'targets');
	const results = await Promise.allSettled(targets.map(t => pingOne(t)));
	const summary = results.map(r => (r.status === 'fulfilled' ? r.value : { ok: false, error: String(r.reason) }));
	const successCount = summary.filter(s => s.ok).length;
	console.log(new Date().toISOString(), 'PING SUMMARY', `${successCount}/${targets.length} successful`);
}

// Run immediately, then every interval
pingAll();
setInterval(pingAll, intervalMs);

// Start a small HTTP server if PORT is provided so Render (or other hosts) can perform health checks
const portEnv = process.env.PORT || process.env.RENDER_PORT;
const port = portEnv ? Number(portEnv) : 0;
if (port > 0) {
	const server = http.createServer((req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('ok');
	});
	server.listen(port, '0.0.0.0', () => {
		console.log(new Date().toISOString(), `HTTP keep-alive server listening on port ${port}`);
	});
} else {
	console.log('No PORT provided, not starting HTTP keep-alive server. Set PORT env var to enable.');
}

