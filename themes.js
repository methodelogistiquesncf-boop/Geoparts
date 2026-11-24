/* ═══════════════════════════════════════════════════════════════
   themes.js  ·  Moteur de thèmes — v8
   Écrit en instructions courtes et séparées : aucune expression
   imbriquée fragile, aucun risque de "missing ) after argument list".
   ═══════════════════════════════════════════════════════════════ */

export const THEMES = {
  chaleureux: {
    label: 'Chaleureux',
    mood: 'Terracotta & ambre',
    dark: false,
    sw: ['#bc5215', '#e0a437', '#f6ecdf'],
    v: {
      bg: '#f6ecdf', bg2: '#efe0cc', surface: '#fffdf8', surface2: '#f7efe2',
      ink: '#2e2013', soft: '#6d5638', muted: '#a1876a', border: '#e5d2b8',
      accent: '#bc5215', accent2: '#e0a437', onAccent: '#fff8ef',
      ok: '#3d7a34', okBg: '#e2efd9', okBd: '#b9d8a8',
      warn: '#a06a08', warnBg: '#fbeecb', warnBd: '#ecd28a',
      danger: '#b3362b', dangerBg: '#f9e2dd', dangerBd: '#eab5ac',
      info: '#2b6f8f', infoBg: '#e0edf3', infoBd: '#b3d2df',
      todo: '#7a5a34', todoBg: '#f3e8d6', todoBd: '#ddc49c',
      glowA: 'rgba(188,82,21,.20)', glowB: 'rgba(224,164,55,.22)', glowC: 'rgba(122,116,60,.14)',
      shadow: '0 2px 10px rgba(96,58,20,.09)', shadowLg: '0 14px 34px rgba(96,58,20,.16)',
      grain: '.05', scrim: 'rgba(46,32,19,.42)'
    }
  },
  ocean: {
    label: 'Océan',
    mood: 'Pétrole & bleu électrique',
    dark: false,
    sw: ['#0e6f95', '#1f7ae0', '#e9f2f7'],
    v: {
      bg: '#e9f2f7', bg2: '#dcebf3', surface: '#ffffff', surface2: '#eef6fa',
      ink: '#0f2c3d', soft: '#33566b', muted: '#6f93a6', border: '#c6dce8',
      accent: '#0e6f95', accent2: '#1f7ae0', onAccent: '#f2fbff',
      ok: '#2c8a55', okBg: '#ddf0e4', okBd: '#aedcc0',
      warn: '#a06a08', warnBg: '#fbeecb', warnBd: '#ecd28a',
      danger: '#b3362b', dangerBg: '#f9e2dd', dangerBd: '#eab5ac',
      info: '#0e6f95', infoBg: '#d9ecf5', infoBd: '#a9cfe0',
      todo: '#3c5f74', todoBg: '#e4eff5', todoBd: '#bcd6e3',
      glowA: 'rgba(14,111,149,.18)', glowB: 'rgba(31,122,224,.16)', glowC: 'rgba(23,162,166,.14)',
      shadow: '0 2px 10px rgba(15,70,110,.09)', shadowLg: '0 14px 34px rgba(15,70,110,.16)',
      grain: '.045', scrim: 'rgba(15,44,61,.44)'
    }
  },
  foret: {
    label: 'Forêt',
    mood: 'Mousse & lichen',
    dark: false,
    sw: ['#4c7a2e', '#a3b53c', '#eef2e6'],
    v: {
      bg: '#eef2e6', bg2: '#e3ead6', surface: '#fdfef9', surface2: '#f1f5e8',
      ink: '#22301c', soft: '#48603c', muted: '#7f9370', border: '#cfdcbc',
      accent: '#4c7a2e', accent2: '#a3b53c', onAccent: '#f6fbee',
      ok: '#3d7a34', okBg: '#e2efd9', okBd: '#b9d8a8',
      warn: '#a06a08', warnBg: '#fbeecb', warnBd: '#ecd28a',
      danger: '#b3362b', dangerBg: '#f9e2dd', dangerBd: '#eab5ac',
      info: '#2b6f8f', infoBg: '#e0edf3', infoBd: '#b3d2df',
      todo: '#55663f', todoBg: '#e9efdb', todoBd: '#c8d6a9',
      glowA: 'rgba(76,122,46,.18)', glowB: 'rgba(163,181,60,.18)', glowC: 'rgba(138,90,43,.12)',
      shadow: '0 2px 10px rgba(50,80,30,.09)', shadowLg: '0 14px 34px rgba(50,80,30,.16)',
      grain: '.05', scrim: 'rgba(34,48,28,.44)'
    }
  },
  aurore: {
    label: 'Aurore',
    mood: 'Violet & magenta',
    dark: false,
    sw: ['#6d28d9', '#db2777', '#f4f0fb'],
    v: {
      bg: '#f4f0fb', bg2: '#e9e2f7', surface: '#ffffff', surface2: '#f6f2fd',
      ink: '#241a3d', soft: '#4c3d70', muted: '#8b7fa8', border: '#d9cef0',
      accent: '#6d28d9', accent2: '#db2777', onAccent: '#fdf7ff',
      ok: '#2f8a5b', okBg: '#dcf1e6', okBd: '#a9dcc2',
      warn: '#9a6a05', warnBg: '#fbedc9', warnBd: '#e9d089',
      danger: '#c02b45', dangerBg: '#fbe0e5', dangerBd: '#eeb2bd',
      info: '#2563a8', infoBg: '#dfeaf7', infoBd: '#b0cbe8',
      todo: '#5b4a80', todoBg: '#ece5f8', todoBd: '#cdbdec',
      glowA: 'rgba(109,40,217,.18)', glowB: 'rgba(219,39,119,.16)', glowC: 'rgba(37,99,168,.12)',
      shadow: '0 2px 10px rgba(60,30,110,.10)', shadowLg: '0 14px 34px rgba(60,30,110,.18)',
      grain: '.045', scrim: 'rgba(36,26,61,.46)'
    }
  },
  nuit: {
    label: 'Nuit',
    mood: 'Ambre sur ardoise',
    dark: true,
    sw: ['#e0a35c', '#d4784a', '#13151c'],
    v: {
      bg: '#13151c', bg2: '#191c25', surface: '#1f232e', surface2: '#262b38',
      ink: '#ece6da', soft: '#c2b9a8', muted: '#8b8577', border: '#363d4d',
      accent: '#e0a35c', accent2: '#d4784a', onAccent: '#241708',
      ok: '#8fd49a', okBg: '#1e3323', okBd: '#2f5236',
      warn: '#ecc879', warnBg: '#3a2f16', warnBd: '#5c4a22',
      danger: '#ef9a8c', dangerBg: '#3d211d', dangerBd: '#63352e',
      info: '#8fc6e0', infoBg: '#1c2f3a', infoBd: '#2e4d5e',
      todo: '#c2b9a8', todoBg: '#2a2f3c', todoBd: '#3d4456',
      glowA: 'rgba(224,163,92,.13)', glowB: 'rgba(212,120,74,.11)', glowC: 'rgba(127,176,105,.08)',
      shadow: '0 2px 12px rgba(0,0,0,.4)', shadowLg: '0 16px 40px rgba(0,0,0,.55)',
      grain: '.07', scrim: 'rgba(0,0,0,.6)'
    }
  },
  ardoise: {
    label: 'Ardoise',
    mood: 'Acier & cyan acide',
    dark: true,
    sw: ['#22d3ee', '#a3e635', '#0f1720'],
    v: {
      bg: '#0f1720', bg2: '#15202b', surface: '#18242f', surface2: '#1f2d3a',
      ink: '#e6f0f4', soft: '#b3c6d1', muted: '#7d94a1', border: '#2c3f4e',
      accent: '#22d3ee', accent2: '#a3e635', onAccent: '#062028',
      ok: '#7ee2a8', okBg: '#12321f', okBd: '#1f5233',
      warn: '#f2c85c', warnBg: '#33290f', warnBd: '#54431a',
      danger: '#ff8f80', dangerBg: '#3a1c19', dangerBd: '#5e2f28',
      info: '#7cc9f5', infoBg: '#132c3c', infoBd: '#22475e',
      todo: '#b3c6d1', todoBg: '#22313d', todoBd: '#33475a',
      glowA: 'rgba(34,211,238,.14)', glowB: 'rgba(163,230,53,.10)', glowC: 'rgba(124,201,245,.09)',
      shadow: '0 2px 12px rgba(0,0,0,.45)', shadowLg: '0 16px 40px rgba(0,0,0,.6)',
      grain: '.06', scrim: 'rgba(0,0,0,.62)'
    }
  }
};

export const DEFAULT_PREFS = {
  theme: 'chaleureux',
  accent: '',
  density: 'confort',
  fontScale: 100,
  motion: true,
  contrast: false,
  autoCorrect: true,
  view: 'list'
};

const root = document.documentElement;

function kebab(key) {
  return key.replace(/[A-Z]/g, function (letter) {
    return '-' + letter.toLowerCase();
  });
}

export function getTheme(id) {
  if (THEMES[id]) return THEMES[id];
  return THEMES.chaleureux;
}

export function themeList() {
  const out = [];
  const ids = Object.keys(THEMES);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const t = THEMES[id];
    out.push({ id: id, label: t.label, mood: t.mood, dark: t.dark, sw: t.sw, v: t.v });
  }
  return out;
}

export function applyTheme(id) {
  const theme = getTheme(id);
  const keys = Object.keys(theme.v);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    root.style.setProperty('--' + kebab(key), theme.v[key]);
  }
  root.dataset.theme = id;
  root.style.colorScheme = theme.dark ? 'dark' : 'light';
  return theme;
}

export function hexToHsl(hex) {
  let c = String(hex || '').replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) return [0, 0, 0];
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    if (l > 0.5) {
      s = d / (2 - max - min);
    } else {
      s = d / (max + min);
    }
    if (max === r) {
      h = (g - b) / d;
      if (g < b) h = h + 6;
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = h / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function channelValue(n, h, a, l) {
  let k = (n + h / 30) % 12;
  if (k < 0) k = k + 12;
  const left = k - 3;
  const right = 9 - k;
  let v = left;
  if (right < v) v = right;
  if (v > 1) v = 1;
  if (v < -1) v = -1;
  return l - a * v;
}

function byteToHex(x) {
  let n = Math.round(255 * x);
  if (n < 0) n = 0;
  if (n > 255) n = 255;
  let s = n.toString(16);
  if (s.length < 2) s = '0' + s;
  return s;
}

export function hslToHex(h, s, l) {
  const ss = s / 100;
  const ll = l / 100;
  const limit = Math.min(ll, 1 - ll);
  const a = ss * limit;
  const r = channelValue(0, h, a, ll);
  const g = channelValue(8, h, a, ll);
  const b = channelValue(4, h, a, ll);
  return '#' + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

function shiftHue(hex) {
  const hsl = hexToHsl(hex);
  let h = hsl[0] + 26;
  h = h % 360;
  let s = hsl[1] + 6;
  if (s > 96) s = 96;
  let l = hsl[2] + 12;
  if (l > 72) l = 72;
  return hslToHex(h, s, l);
}

export function applyAccent(hex) {
  if (!hex) {
    const theme = getTheme(root.dataset.theme);
    root.style.setProperty('--accent', theme.v.accent);
    root.style.setProperty('--accent2', theme.v.accent2);
    root.style.setProperty('--on-accent', theme.v.onAccent);
    return;
  }
  const second = shiftHue(hex);
  const hsl = hexToHsl(hex);
  const onAccent = hsl[2] > 62 ? '#1a1208' : '#fffaf3';
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent2', second);
  root.style.setProperty('--on-accent', onAccent);
}

export function applyDensity(mode) {
  root.dataset.density = mode === 'compact' ? 'compact' : 'confort';
}

export function applyFontScale(pct) {
  let p = Number(pct);
  if (!p) p = 100;
  if (p < 88) p = 88;
  if (p > 122) p = 122;
  const px = (16 * p) / 100;
  root.style.fontSize = px.toFixed(2) + 'px';
  return p;
}

export function applyMotion(on) {
  root.dataset.motion = on ? 'on' : 'off';
}

export function applyContrast(on) {
  root.dataset.contrast = on ? 'high' : 'normal';
}

export function applyAllPrefs(prefs) {
  const p = prefs || DEFAULT_PREFS;
  applyTheme(p.theme);
  applyAccent(p.accent);
  applyDensity(p.density);
  applyFontScale(p.fontScale);
  applyMotion(p.motion);
  applyContrast(p.contrast);
}
