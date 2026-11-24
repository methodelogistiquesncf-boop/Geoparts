/* ═══════════════════════════════════════════════════════════════
   pwa.js  ·  v8 — icônes 100 % data-URI (aucun dossier icons/),
   manifeste publié avec PNG générés, service worker, badge,
   hors ligne, et API de diagnostic.
   ═══════════════════════════════════════════════════════════════ */
export const PWA_VERSION = '8';

const BASE = new URL('./', location.href);
const BADGE_KEY = 'reunionBadge';

const SVG_ANY = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23a8410f'/%3E%3Cstop%20offset='.5'%20stop-color='%23c96a1a'/%3E%3Cstop%20offset='1'%20stop-color='%23e8b34a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='512'%20height='512'%20rx='115'%20fill='url(%23g)'/%3E%3Cg%20fill='%23fff8ef'%3E%3Crect%20x='77'%20y='130'%20width='358'%20height='43'%20rx='21.5'/%3E%3Crect%20x='77'%20y='220'%20width='358'%20height='43'%20rx='21.5'/%3E%3Crect%20x='77'%20y='310'%20width='215'%20height='43'%20rx='21.5'/%3E%3Ccircle%20cx='367'%20cy='331.5'%20r='28.4'/%3E%3C/g%3E%3C/svg%3E";

const SVG_MASK = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23a8410f'/%3E%3Cstop%20offset='.5'%20stop-color='%23c96a1a'/%3E%3Cstop%20offset='1'%20stop-color='%23e8b34a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='512'%20height='512'%20fill='url(%23g)'/%3E%3Cg%20fill='%23fff8ef'%3E%3Crect%20x='108'%20y='150'%20width='296'%20height='35'%20rx='17.5'/%3E%3Crect%20x='108'%20y='223'%20width='296'%20height='35'%20rx='17.5'/%3E%3Crect%20x='108'%20y='296'%20width='178'%20height='35'%20rx='17.5'/%3E%3Ccircle%20cx='348'%20cy='313.5'%20r='23.4'/%3E%3C/g%3E%3C/svg%3E";

const $ = s => document.querySelector(s);
const hide = (s, v) => { const el = $(s); if (el) el.hidden = !!v; };
const html = (s, h) => { const el = $(s); if (el) el.innerHTML = h; };
const txt = (s, v) => { const el = $(s); if (el) el.textContent = v; };

const IC = {
  down: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  globe: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18M3.5 9h17M3.5 15h17"/></svg>',
  sync: '<svg class="ic" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4"/></svg>',
  check: '<svg class="ic" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></svg>'
};

let hooks = null;
let reg = null;
let deferred = null;
let manifestUrl = null;
let iconsOK = false;
let reloading = false;
let updateShown = false;
let pendingIntent = null;
let lastUpdateCheck = 0;
let lastBadge = -1;
let badgeOn = localStorage.getItem(BADGE_KEY) !== '0';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    navigator.standalone === true;
}

function roundedPath(g, x, y, w, h, r) {
  g.beginPath();
  if (typeof g.roundRect === 'function') {
    g.roundRect(x, y, w, h, r);
    return;
  }
  const rad = Math.min(r, w / 2, h / 2);
  g.moveTo(x + rad, y);
  g.arcTo(x + w, y, x + w, y + h, rad);
  g.arcTo(x + w, y + h, x, y + h, rad);
  g.arcTo(x, y + h, x, y, rad);
  g.arcTo(x, y, x + w, y, rad);
  g.closePath();
}

function makeIcon(size, maskable) {
  try {
    const cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    const g = cv.getContext('2d');
    if (!g) return null;

    const grad = g.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#a8410f');
    grad.addColorStop(0.5, '#c96a1a');
    grad.addColorStop(1, '#e8b34a');
    g.fillStyle = grad;
    if (maskable) {
      g.fillRect(0, 0, size, size);
    } else {
      roundedPath(g, 0, 0, size, size, size * 0.225);
      g.fill();
    }

    const halo = g.createRadialGradient(size * 0.28, size * 0.22, 0, size * 0.28, size * 0.22, size * 0.7);
    halo.addColorStop(0, 'rgba(255,255,255,0.22)');
    halo.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = halo;
    if (maskable) {
      g.fillRect(0, 0, size, size);
    } else {
      roundedPath(g, 0, 0, size, size, size * 0.225);
      g.fill();
    }

    const box = size * (maskable ? 0.58 : 0.7);
    const ox = (size - box) / 2;
    const oy = (size - box) / 2;
    const barH = box * 0.12;
    const gap = box * 0.245;
    g.fillStyle = '#fff8ef';
    const widths = [1, 1, 0.6];
    for (let i = 0; i < widths.length; i++) {
      roundedPath(g, ox, oy + box * 0.15 + i * gap, box * widths[i], barH, barH / 2);
      g.fill();
    }
    g.beginPath();
    g.arc(ox + box * 0.81, oy + box * 0.15 + 2 * gap + barH / 2, barH * 0.66, 0, Math.PI * 2);
    g.fill();

    return cv.toDataURL('image/png');
  } catch (err) {
    console.warn('Icône non générée :', err);
    return null;
  }
}

function buildManifest() {
  const p192 = makeIcon(192, false);
  const p512 = makeIcon(512, false);
  const mask = makeIcon(512, true);
  const apple = makeIcon(180, false);
  iconsOK = Boolean(p192 && p512);

  const appleLink = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleLink && apple) appleLink.href = apple;

  const abs = u => new URL(u, BASE).href;
  const icons = [];
  if (p192) icons.push({ src: p192, sizes: '192x192', type: 'image/png', purpose: 'any' });
  if (p512) icons.push({ src: p512, sizes: '512x512', type: 'image/png', purpose: 'any' });
  if (mask) icons.push({ src: mask, sizes: '512x512', type: 'image/png', purpose: 'maskable' });
  icons.push({ src: SVG_ANY, sizes: 'any', type: 'image/svg+xml', purpose: 'any' });
  icons.push({ src: SVG_MASK, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' });

  const shortIcons = p192
    ? [{ src: p192, sizes: '192x192', type: 'image/png' }]
    : [{ src: SVG_ANY, sizes: 'any', type: 'image/svg+xml' }];

  const manifest = {
    id: BASE.href,
    name: 'Suivi Réunion Prestataire — Geoparts',
    short_name: 'Réunion Geoparts',
    description: 'Ordre du jour, priorités, notes et discussions datées pour le suivi bimensuel du prestataire. Synchronisé et utilisable hors ligne.',
    lang: 'fr',
    dir: 'ltr',
    start_url: abs('?source=pwa'),
    scope: BASE.href,
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#f6ecdf',
    theme_color: '#bc5215',
    categories: ['business', 'productivity', 'utilities'],
    icons: icons,
    shortcuts: [
      { name: 'Nouveau point', short_name: 'Nouveau', description: 'Ajouter un point à l’ordre du jour', url: abs('?action=new'), icons: shortIcons },
      { name: 'Points urgents', short_name: 'Urgences', description: 'Priorité haute en tête', url: abs('?view=urgent'), icons: shortIcons },
      { name: 'Vue Tableau', short_name: 'Tableau', description: 'Kanban par statut', url: abs('?view=board'), icons: shortIcons }
    ],
    share_target: {
      action: abs('?share=1'),
      method: 'GET',
      enctype: 'application/x-www-form-urlencoded',
      params: { title: 'title', text: 'text', url: 'url' }
    },
    launch_handler: { client_mode: ['navigate-existing', 'auto'] },
    prefer_related_applications: false
  };

  try {
    if (manifestUrl) URL.revokeObjectURL(manifestUrl);
    manifestUrl = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' }));
    const link = document.querySelector('link[rel="manifest"]');
    if (link) link.href = manifestUrl;
  } catch (err) {
    console.warn('Manifeste dynamique non publié :', err);
    manifestUrl = null;
  }
}

function setBadge(count) {
  const value = Math.max(0, Number(count) || 0);
  if (value === lastBadge) return;
  lastBadge = value;
  try {
    if (!('setAppBadge' in navigator)) return;
    if (badgeOn && value > 0) navigator.setAppBadge(value);
    else navigator.clearAppBadge();
  } catch (err) { /* badge non supporté */ }
}

function setThemeColor(hex) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && hex) meta.setAttribute('content', String(hex).trim());
}

function installVisible() {
  const can = Boolean(deferred) || (isIOS() && !isStandalone());
  hide('#installBtn', !can);
  hide('#installBtnAuth', !can);
  hide('#pwaInstall', !can);
}

async function doInstall() {
  if (isIOS() && !deferred) { hide('#iosModal', false); return; }
  if (!deferred) {
    hooks?.toast('Installation déjà effectuée ou non proposée par ce navigateur.');
    return;
  }
  try {
    deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice && choice.outcome === 'accepted') {
      hooks?.toast('Installation lancée — retrouvez l’app sur votre appareil.');
    }
  } catch (err) { /* refus */ }
  deferred = null;
  installVisible();
  refreshPanel();
}

function showUpdate() {
  if (updateShown || !reg || !reg.waiting) return;
  updateShown = true;
  hooks?.richToast({
    title: 'Nouvelle version prête',
    sub: 'Le cache a été mis à jour en arrière-plan.',
    icon: IC.sync,
    kind: 'update',
    duration: 14000,
    hint: 'Vos données sont conservées · rechargement en un clic',
    actions: [
      { key: 'later', label: 'Plus tard', safe: true },
      { key: 'go', label: 'Recharger', kind: 'go', icon: IC.check }
    ],
    onClose: function (key) {
      updateShown = false;
      if (key !== 'go') return;
      try { reg.waiting.postMessage({ type: 'SKIP_WAITING' }); }
      catch (err) { location.reload(); }
    }
  });
}

async function checkUpdate(manual) {
  if (!reg) {
    if (manual) hooks?.toast('Service worker indisponible sur ce navigateur.', { type: 'err' });
    return;
  }
  lastUpdateCheck = Date.now();
  try {
    await reg.update();
    if (reg.waiting) showUpdate();
    else if (manual) hooks?.toast(reg.installing ? 'Mise à jour en cours de téléchargement…' : 'Vous avez la dernière version.');
  } catch (err) {
    if (manual) hooks?.toast('Vérification impossible hors ligne.', { type: 'err' });
  }
  refreshPanel();
}

async function refreshPanel() {
  const state = $('#pwaState');
  if (state) {
    if (isStandalone()) {
      state.className = 'pwa-state on';
      state.innerHTML = IC.check + '<span>Installée · plein écran</span>';
    } else if (deferred || isIOS()) {
      state.className = 'pwa-state ready';
      state.innerHTML = IC.down + '<span>Prête à être installée</span>';
    } else {
      state.className = 'pwa-state';
      state.innerHTML = IC.globe + '<span>Ouverte dans le navigateur</span>';
    }
  }
  txt('#pwaVersion', 'v' + PWA_VERSION);
  txt('#pwaOffline', reg && reg.active ? (navigator.onLine ? 'prêt · en ligne' : 'prêt · hors ligne') : 'en préparation');
  const badge = $('#pwaBadge');
  if (badge) badge.checked = badgeOn;
  hide('#appBadge', !isStandalone());
  installVisible();

  try {
    const est = await navigator.storage?.estimate?.();
    if (est) {
      const mb = n => (n / 1048576).toFixed(1) + ' Mo';
      txt('#pwaStorage', mb(est.usage || 0) + ' / ' + mb(est.quota || 0));
      const meter = $('#pwaMeter');
      if (meter) meter.style.width = Math.min(100, ((est.usage || 0) / Math.max(1, est.quota || 1)) * 100).toFixed(2) + '%';
    } else {
      txt('#pwaStorage', 'non mesurable');
    }
  } catch (err) {
    txt('#pwaStorage', 'non mesurable');
  }

  try {
    const persisted = await navigator.storage?.persisted?.();
    const btn = $('#pwaPersist');
    if (btn) {
      btn.textContent = persisted ? 'Stockage durable ✓' : 'Stockage durable';
      btn.disabled = Boolean(persisted);
    }
  } catch (err) { /* non supporté */ }
}

async function askPersist() {
  try {
    const ok = await navigator.storage?.persist?.();
    hooks?.toast(
      ok ? 'Stockage marqué durable : le navigateur ne l’évincera pas.'
         : 'Refusé par le navigateur — installez l’app pour renforcer la persistance.',
      { type: ok ? 'ok' : 'err' }
    );
  } catch (err) {
    hooks?.toast('Fonction non disponible ici.', { type: 'err' });
  }
  refreshPanel();
}

function clearCache() {
  hooks?.richToast({
    title: 'Vider le cache ?',
    sub: 'Les fichiers seront retéléchargés. Vos points restent intacts.',
    confirm: true,
    duration: 9000,
    hint: 'Utile après une mise à jour récalcitrante',
    actions: [
      { key: 'cancel', label: 'Annuler', safe: true },
      { key: 'ok', label: 'Vider & recharger', kind: 'ok' }
    ],
    onClose: async function (key) {
      if (key !== 'ok') return;
      try { reg?.active?.postMessage({ type: 'CLEAR_CACHES' }); } catch (err) { /* ignore */ }
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      } catch (err) { /* ignore */ }
      location.reload();
    }
  });
}

function syncConnectivity(notify) {
  const online = navigator.onLine;
  hide('#offlinePill', online);
  hooks?.onConnectivity?.(online);
  if (notify) {
    hooks?.toast(
      online ? 'Connexion rétablie — synchronisation en cours.'
             : 'Hors ligne : vos modifications sont conservées et partiront au retour du réseau.',
      { type: online ? 'ok' : 'err', duration: 5000 }
    );
  }
  refreshPanel();
}

function readIntent() {
  const q = new URLSearchParams(location.search);
  const shared = q.has('share') || q.get('title') || q.get('text') || q.get('url');
  if (shared) {
    pendingIntent = {
      kind: 'share',
      payload: { title: q.get('title') || '', text: q.get('text') || '', url: q.get('url') || '' }
    };
  } else if (q.get('action') === 'new') {
    pendingIntent = { kind: 'new' };
  } else if (q.get('view') === 'board') {
    pendingIntent = { kind: 'board' };
  } else if (q.get('view') === 'urgent') {
    pendingIntent = { kind: 'urgent' };
  }
  if (Array.from(q.keys()).length) {
    try { history.replaceState({}, '', BASE.pathname); } catch (err) { /* ignore */ }
  }
}

export function diagnostics() {
  return [
    {
      label: 'Icônes',
      state: iconsOK ? 'ok' : 'warn',
      detail: iconsOK ? 'PNG 192 · 512 · maskable générés' : 'SVG data-URI utilisées'
    },
    {
      label: 'Manifeste',
      state: manifestUrl ? 'ok' : 'warn',
      detail: manifestUrl ? 'publié · installation possible' : 'statique (fichier seul)'
    },
    {
      label: 'Service worker',
      state: reg && reg.active ? 'ok' : (reg ? 'warn' : 'err'),
      detail: reg && reg.active ? 'actif · hors ligne prêt' : (reg ? 'installation en cours' : 'absent')
    },
    {
      label: 'Réseau',
      state: navigator.onLine ? 'ok' : 'warn',
      detail: navigator.onLine ? 'en ligne' : 'hors ligne · écritures en attente'
    },
    {
      label: 'Installation',
      state: isStandalone() ? 'ok' : 'warn',
      detail: isStandalone() ? 'application installée' : 'ouverte dans le navigateur'
    }
  ];
}

export function initPWA(h) {
  hooks = h || {};
  buildManifest();
  readIntent();
  setThemeColor(getComputedStyle(document.documentElement).getPropertyValue('--surface'));
  syncConnectivity(false);

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    installVisible();
    refreshPanel();
  });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    installVisible();
    refreshPanel();
    hooks?.toast('Application installée. Lancez-la depuis votre écran d’accueil.');
  });
  window.addEventListener('online', () => syncConnectivity(true));
  window.addEventListener('offline', () => syncConnectivity(true));
  try {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', function () {
      installVisible();
      refreshPanel();
    });
  } catch (err) { /* ancien navigateur */ }

  ['#installBtn', '#installBtnAuth', '#pwaInstall'].forEach(function (sel) {
    const el = $(sel);
    if (el) el.addEventListener('click', doInstall);
  });
  const iosClose = $('#iosClose');
  if (iosClose) iosClose.addEventListener('click', () => hide('#iosModal', true));
  const iosModal = $('#iosModal');
  if (iosModal) iosModal.addEventListener('click', e => { if (e.target.id === 'iosModal') hide('#iosModal', true); });
  const up = $('#pwaUpdate');
  if (up) up.addEventListener('click', () => checkUpdate(true));
  const pe = $('#pwaPersist');
  if (pe) pe.addEventListener('click', askPersist);
  const cl = $('#pwaClear');
  if (cl) cl.addEventListener('click', clearCache);
  const bg = $('#pwaBadge');
  if (bg) bg.addEventListener('change', function (e) {
    badgeOn = e.target.checked;
    try { localStorage.setItem(BADGE_KEY, badgeOn ? '1' : '0'); } catch (err) { /* ignore */ }
    lastBadge = -1;
    setBadge(hooks?.badgeCount?.() ?? 0);
    hooks?.toast(badgeOn ? 'Badge activé sur l’icône de l’application.' : 'Badge désactivé.');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#iosModal') && !$('#iosModal').hidden) hide('#iosModal', true);
  });

  if ('serviceWorker' in navigator) {
    const start = async function () {
      try {
        reg = await navigator.serviceWorker.register(new URL('sw.js', BASE).href, {
          scope: './',
          updateViaCache: 'none'
        });
        if (reg.waiting && navigator.serviceWorker.controller) showUpdate();
        reg.addEventListener('updatefound', function () {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
            refreshPanel();
          });
        });
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          if (reloading) return;
          reloading = true;
          location.reload();
        });
        navigator.serviceWorker.addEventListener('message', function (e) {
          if (e.data && e.data.type === 'SW_READY') refreshPanel();
        });
        refreshPanel();
      } catch (err) {
        console.warn('Service worker non enregistré :', err);
        txt('#pwaOffline', 'indisponible');
      }
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && Date.now() - lastUpdateCheck > 900000) checkUpdate(false);
    });
    setInterval(() => checkUpdate(false), 1800000);
  } else {
    txt('#pwaOffline', 'non supporté');
  }

  refreshPanel();

  return {
    setBadge: setBadge,
    setThemeColor: setThemeColor,
    refreshPanel: refreshPanel,
    checkUpdate: checkUpdate,
    diagnostics: diagnostics,
    takeIntent: function () { const i = pendingIntent; pendingIntent = null; return i; },
    version: PWA_VERSION,
    standalone: isStandalone
  };
}
