#!/usr/bin/env node

// Simple pinger: pings TARGET_URL every INTERVAL_MS (default 60000ms)
const target = process.env.TARGET_URL || 'https://one23hostderjit.onrender.com';

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

