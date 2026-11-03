const CACHE = 'bloom-demo-v1';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png',
 'fonts/plus-jakarta-sans-latin-400-normal.woff2', 'fonts/plus-jakarta-sans-latin-500-normal.woff2', 'fonts/plus-jakarta-sans-latin-600-normal.woff2', 'fonts/plus-jakarta-sans-latin-700-normal.woff2',
 'fonts/playfair-display-latin-500-normal.woff2', 'fonts/playfair-display-latin-600-normal.woff2', 'fonts/playfair-display-latin-500-italic.woff2', 'fonts/playfair-display-latin-600-italic.woff2', 'fonts/allura-latin-400-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bloom-demo-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
 const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
 if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html'))); return; }
 e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
});
