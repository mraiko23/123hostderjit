#!/usr/bin/env node
TARGET_URL = 'https://123hostderjit.onrender.com';
// Simple pinger: pings TARGET_URL every INTERVAL_MS (default 60000ms)
const target = process.TARGET_URL;
if (!target) {
	console.error('ERROR: set TARGET_URL environment variable');
	process.exit(1);
}

const intervalMs = parseInt(process.env.INTERVAL_MS || '60000', 10);
const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10);

async function ping() {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		const res = await fetch(target, { signal: controller.signal });
		clearTimeout(timer);
		console.log(new Date().toISOString(), 'PING', target, '->', res.status);
	} catch (err) {
		const msg = err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || err;
		console.error(new Date().toISOString(), 'PING FAILED', msg);
	}
}

// Run immediately, then every interval
ping();
setInterval(ping, intervalMs);
