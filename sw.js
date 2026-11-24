/* ═══════════════════════════════════════════════════════════════
   sw.js  ·  v8 — app shell hors ligne, SDK Firebase en cache,
   APIs d'authentification / Firestore jamais mises en cache.
   ═══════════════════════════════════════════════════════════════ */
const VERSION = '8';
const BASE = new URL('./', self.location);
const SHELL = 'shell-v' + VERSION;
const ASSETS = 'assets-v' + VERSION;
const CDN = 'cdn-v' + VERSION;
const KEEP = [SHELL, ASSETS, CDN];

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './themes.js',
  './app.js',
  './pwa.js',
  './manifest.webmanifest',
  './offline.html'
].map(u => new URL(u, BASE).href);

const CDN_PRECACHE = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
];

const NEVER_CACHE = new Set([
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firestore.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'api.languagetool.org'
]);

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    const shell = await caches.open(SHELL);
    await Promise.all(APP_SHELL.map(function (u) {
      return shell.add(new Request(u, { cache: 'reload' })).catch(function () { return null; });
    }));
    const cdn = await caches.open(CDN);
    await Promise.all(CDN_PRECACHE.map(function (u) {
      return cdn.add(new Request(u, { mode: 'cors', cache: 'reload' })).catch(function () { return null; });
    }));
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => KEEP.indexOf(k) === -1).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (err) { /* ignore */ }
    }
    await self.clients.claim();
    const all = await self.clients.matchAll({ type: 'window' });
    all.forEach(c => c.postMessage({ type: 'SW_READY', version: VERSION }));
  })());
});

self.addEventListener('message', function (event) {
  const type = event.data && event.data.type;
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'CLEAR_CACHES') {
    event.waitUntil((async function () {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    })());
  }
  if (type === 'GET_VERSION' && event.source) {
    event.source.postMessage({ type: 'SW_VERSION', version: VERSION });
  }
});

async function putSafe(cacheName, request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch (err) { /* quota */ }
}

async function navigate(request) {
  try {
    const response = await fetch(request);
    await putSafe(SHELL, new URL('./index.html', BASE).href, response);
    return response;
  } catch (err) {
    const cached = await caches.match(new URL('./index.html', BASE).href)
      || await caches.match(new URL('./', BASE).href)
      || await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match(new URL('./offline.html', BASE).href);
    return offline || new Response('Hors ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const network = fetch(request).then(function (response) {
    putSafe(cacheName, request, response);
    return response;
  }).catch(function () { return null; });
  if (cached) return cached;
  const response = await network;
  if (response) return response;
  const offline = await caches.match(new URL('./offline.html', BASE).href);
  return offline || Response.error();
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    await putSafe(cacheName, request, response);
    return response;
  } catch (err) {
    return Response.error();
  }
}

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;
  let url;
  try { url = new URL(request.url); } catch (err) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (NEVER_CACHE.has(url.hostname)) return;
  if (request.headers.get('range')) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigate(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, ASSETS));
    return;
  }
  if (url.hostname === 'www.gstatic.com' && url.pathname.indexOf('/firebasejs/') === 0) {
    event.respondWith(cacheFirst(request, CDN));
    return;
  }
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, CDN));
  }
});
