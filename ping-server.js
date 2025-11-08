#!/usr/bin/env node

const http = require('http');

// Hard-coded targets (fill any of these with a URL to enable pinging)
const PING_TARGET_1 = 'https://adadadasdasdas.onrender.com';
const PING_TARGET_2 = 'https://one23hostderjit-1-8s5z.onrender.com';
const PING_TARGET_3 = 'https://freehost228adsahas.onrender.com';
const PING_TARGET_4 = 'https://yeba228teststockpvb-rvb3.onrender.com';
const PING_TARGET_5 = 'https://aimodertelegram.onrender.com';
const PING_TARGET_6 = '';
const PING_TARGET_7 = '';
const PING_TARGET_8 = '';
const PING_TARGET_9 = '';
const PING_TARGET_10 = '';
const PING_TARGET_11 = '';
const PING_TARGET_12 = '';
const PING_TARGET_13 = '';
const PING_TARGET_14 = '';
const PING_TARGET_15 = '';
const PING_TARGET_16 = '';
const PING_TARGET_17 = '';
const PING_TARGET_18 = '';
const PING_TARGET_19 = '';
const PING_TARGET_20 = '';
const PING_TARGET_21 = '';
const PING_TARGET_22 = '';
const PING_TARGET_23 = '';
const PING_TARGET_24 = '';
const PING_TARGET_25 = '';
const PING_TARGET_26 = '';
const PING_TARGET_27 = '';
const PING_TARGET_28 = '';
const PING_TARGET_29 = '';
const PING_TARGET_30 = '';

// Collect explicit hard-coded targets
const explicitPingTargets = [
	PING_TARGET_1,
	PING_TARGET_2,
	PING_TARGET_3,
	PING_TARGET_4,
	PING_TARGET_5,
	PING_TARGET_6,
	PING_TARGET_7,
	PING_TARGET_8,
	PING_TARGET_9,
	PING_TARGET_10,
	PING_TARGET_11,
	PING_TARGET_12,
	PING_TARGET_13,
	PING_TARGET_14,
	PING_TARGET_15,
	PING_TARGET_16,
	PING_TARGET_17,
	PING_TARGET_18,
	PING_TARGET_19,
	PING_TARGET_20,
	PING_TARGET_21,
	PING_TARGET_22,
	PING_TARGET_23,
	PING_TARGET_24,
	PING_TARGET_25,
	PING_TARGET_26,
	PING_TARGET_27,
	PING_TARGET_28,
	PING_TARGET_29,
	PING_TARGET_30,
];
const explicitPingTargetsFiltered = explicitPingTargets.map(s => s.trim()).filter(Boolean);

// Targets: either TARGET_URLS (comma/newline/semicolon separated) or single TARGET_URL or explicit hard-coded targets
const rawTargets = process.env.TARGET_URLS || process.env.TARGET_URL || explicitPingTargetsFiltered.join(',') || 'https://one23hostderjit-1.onrender.com';
const targets = rawTargets.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
if (targets.length === 0) {
	console.error('ERROR: no targets configured (set TARGET_URL or TARGET_URLS or edit PING_TARGET_1..30 in code)');
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












