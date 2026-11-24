/* ═══════════════════════════════════════════════════════════════
   themes.js  ·  v8 — écrit en clair, une instruction par ligne.
   Aucune ligne dense : zéro risque d'erreur de parsing.
   ═══════════════════════════════════════════════════════════════ */

export const THEMES = {
  chaleureux: {
    label: 'Chaleureux',
    mood: 'Terracotta & ambre',
    dark: false,
    sw: ['#bc5215', '#e0a437', '#f6ecdf'],
    v: {
      bg: '#f6ecdf',
      bg2: '#efe0cc',
      surface: '#fffdf8',
      surface2: '#f7efe2',
      ink: '#2e2013',
      soft: '#6d5638',
      muted: '#a1876a',
      border: '#e5d2b8',
      accent: '#bc5215',
      accent2: '#e0a437',
      onAccent: '#fff8ef',
      ok: '#3d7a34',
      okBg: '#e2efd9',
      okBd: '#b9d8a8',
      warn: '#a06a08',
      warnBg: '#fbeecb',
      warnBd: '#ecd28a',
      danger: '#b3362b',
      dangerBg: '#f9e2dd',
      dangerBd: '#eab5ac',
      info: '#2b6f8f',
      infoBg: '#e0edf3',
      infoBd: '#b3d2df',
      todo: '#7a5a34',
      todoBg: '#f3e8d6',
      todoBd: '#ddc49c',
      glowA: 'rgba(188, 82, 21, 0.20)',
      glowB: 'rgba(224, 164, 55, 0.22)',
      glowC: 'rgba(122, 116, 60, 0.14)',
      shadow: '0 2px 10px rgba(96, 58, 20, 0.09)',
      shadowLg: '0 14px 34px rgba(96, 58, 20, 0.16)',
      grain: '0.05',
      scrim: 'rgba(46, 32, 19, 0.42)'
    }
  },

  ocean: {
    label: 'Océan',
    mood: 'Pétrole & bleu électrique',
    dark: false,
    sw: ['#0e6f95', '#1f7ae0', '#e9f2f7'],
    v: {
      bg: '#e9f2f7',
      bg2: '#dcebf3',
      surface: '#ffffff',
      surface2: '#eef6fa',
      ink: '#0f2c3d',
      soft: '#33566b',
      muted: '#6f93a6',
      border: '#c6dce8',
      accent: '#0e6f95',
      accent2: '#1f7ae0',
      onAccent: '#f2fbff',
      ok: '#2c8a55',
      okBg: '#ddf0e4',
      okBd: '#aedcc0',
      warn: '#a06a08',
      warnBg: '#fbeecb',
      warnBd: '#ecd28a',
      danger: '#b3362b',
      dangerBg: '#f9e2dd',
      dangerBd: '#eab5ac',
      info: '#0e6f95',
      infoBg: '#d9ecf5',
      infoBd: '#a9cfe0',
      todo: '#3c5f74',
      todoBg: '#e4eff5',
      todoBd: '#bcd6e3',
      glowA: 'rgba(14, 111, 149, 0.18)',
      glowB: 'rgba(31, 122, 224, 0.16)',
      glowC: 'rgba(23, 162, 166, 0.14)',
      shadow: '0 2px 10px rgba(15, 70, 110, 0.09)',
      shadowLg: '0 14px 34px rgba(15, 70, 110, 0.16)',
      grain: '0.045',
      scrim: 'rgba(15, 44, 61, 0.44)'
    }
  },

  foret: {
    label: 'Forêt',
    mood: 'Mousse & lichen',
    dark: false,
    sw: ['#4c7a2e', '#a3b53c', '#eef2e6'],
    v: {
      bg: '#eef2e6',
      bg2: '#e3ead6',
      surface: '#fdfef9',
      surface2: '#f1f5e8',
      ink: '#22301c',
      soft: '#48603c',
      muted: '#7f9370',
      border: '#cfdcbc',
      accent: '#4c7a2e',
      accent2: '#a3b53c',
      onAccent: '#f6fbee',
      ok: '#3d7a34',
      okBg: '#e2efd9',
      okBd: '#b9d8a8',
      warn: '#a06a08',
      warnBg: '#fbeecb',
      warnBd: '#ecd28a',
      danger: '#b3362b',
      dangerBg: '#f9e2dd',
      dangerBd: '#eab5ac',
      info: '#2b6f8f',
      infoBg: '#e0edf3',
      infoBd: '#b3d2df',
      todo: '#55663f',
      todoBg: '#e9efdb',
      todoBd: '#c8d6a9',
      glowA: 'rgba(76, 122, 46, 0.18)',
      glowB: 'rgba(163, 181, 60, 0.18)',
      glowC: 'rgba(138, 90, 43, 0.12)',
      shadow: '0 2px 10px rgba(50, 80, 30, 0.09)',
      shadowLg: '0 14px 34px rgba(50, 80, 30, 0.16)',
      grain: '0.05',
      scrim: 'rgba(34, 48, 28, 0.44)'
    }
  },

  aurore: {
    label: 'Aurore',
    mood: 'Violet & magenta',
    dark: false,
    sw: ['#6d28d9', '#db2777', '#f4f0fb'],
    v: {
      bg: '#f4f0fb',
      bg2: '#e9e2f7',
      surface: '#ffffff',
      surface2: '#f6f2fd',
      ink: '#241a3d',
      soft: '#4c3d70',
      muted: '#8b7fa8',
      border: '#d9cef0',
      accent: '#6d28d9',
      accent2: '#db2777',
      onAccent: '#fdf7ff',
      ok: '#2f8a5b',
      okBg: '#dcf1e6',
      okBd: '#a9dcc2',
      warn: '#9a6a05',
      warnBg: '#fbedc9',
      warnBd: '#e9d089',
      danger: '#c02b45',
      dangerBg: '#fbe0e5',
      dangerBd: '#eeb2bd',
      info: '#2563a8',
      infoBg: '#dfeaf7',
      infoBd: '#b0cbe8',
      todo: '#5b4a80',
      todoBg: '#ece5f8',
      todoBd: '#cdbdec',
      glowA: 'rgba(109, 40, 217, 0.18)',
      glowB: 'rgba(219, 39, 119, 0.16)',
      glowC: 'rgba(37, 99, 168, 0.12)',
      shadow: '0 2px 10px rgba(60, 30, 110, 0.10)',
      shadowLg: '0 14px 34px rgba(60, 30, 110, 0.18)',
      grain: '0.045',
      scrim: 'rgba(36, 26, 61, 0.46)'
    }
  },

  nuit: {
    label: 'Nuit',
    mood: 'Ambre sur ardoise',
    dark: true,
    sw: ['#e0a35c', '#d4784a', '#13151c'],
    v: {
      bg: '#13151c',
      bg2: '#191c25',
      surface: '#1f232e',
      surface2: '#262b38',
      ink: '#ece6da',
      soft: '#c2b9a8',
      muted: '#8b8577',
      border: '#363d4d',
      accent: '#e0a35c',
      accent2: '#d4784a',
      onAccent: '#241708',
      ok: '#8fd49a',
      okBg: '#1e3323',
      okBd: '#2f5236',
      warn: '#ecc879',
      warnBg: '#3a2f16',
      warnBd: '#5c4a22',
      danger: '#ef9a8c',
      dangerBg: '#3d211d',
      dangerBd: '#63352e',
      info: '#8fc6e0',
      infoBg: '#1c2f3a',
      infoBd: '#2e4d5e',
      todo: '#c2b9a8',
      todoBg: '#2a2f3c',
      todoBd: '#3d4456',
      glowA: 'rgba(224, 163, 92, 0.13)',
      glowB: 'rgba(212, 120, 74, 0.11)',
      glowC: 'rgba(127, 176, 105, 0.08)',
      shadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
      shadowLg: '0 16px 40px rgba(0, 0, 0, 0.55)',
      grain: '0.07',
      scrim: 'rgba(0, 0, 0, 0.6)'
    }
  },

  ardoise: {
    label: 'Ardoise',
    mood: 'Acier & cyan acide',
    dark: true,
    sw: ['#22d3ee', '#a3e635', '#0f1720'],
    v: {
      bg: '#0f1720',
      bg2: '#15202b',
      surface: '#18242f',
      surface2: '#1f2d3a',
      ink: '#e6f0f4',
      soft: '#b3c6d1',
      muted: '#7d94a1',
      border: '#2c3f4e',
      accent: '#22d3ee',
      accent2: '#a3e635',
      onAccent: '#062028',
      ok: '#7ee2a8',
      okBg: '#12321f',
      okBd: '#1f5233',
      warn: '#f2c85c',
      warnBg: '#33290f',
      warnBd: '#54431a',
      danger: '#ff8f80',
      dangerBg: '#3a1c19',
      dangerBd: '#5e2f28',
      info: '#7cc9f5',
      infoBg: '#132c3c',
      infoBd: '#22475e',
      todo: '#b3c6d1',
      todoBg: '#22313d',
      todoBd: '#33475a',
      glowA: 'rgba(34, 211, 238, 0.14)',
      glowB: 'rgba(163, 230, 53, 0.10)',
      glowC: 'rgba(124, 201, 245, 0.09)',
      shadow: '0 2px 12px rgba(0, 0, 0, 0.45)',
      shadowLg: '0 16px 40px rgba(0, 0, 0, 0.6)',
      grain: '0.06',
      scrim: 'rgba(0, 0, 0, 0.62)'
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

function kebab(name) {
  return name.replace(/[A-Z]/g, function (letter) {
    return '-' + letter.toLowerCase();
  });
}

export function getTheme(id) {
  return THEMES[id] || THEMES.chaleureux;
}

export function themeList() {
  return Object.keys(THEMES).map(function (id) {
    return Object.assign({ id: id }, THEMES[id]);
  });
}

export function applyTheme(id) {
  const theme = getTheme(id);
  const entries = Object.entries(theme.v);
  for (const pair of entries) {
    root.style.setProperty('--' + kebab(pair[0]), pair[1]);
  }
  root.dataset.theme = id;
  root.style.colorScheme = theme.dark ? 'dark' : 'light';
  return theme;
}

export function hexToHsl(hex) {
  let raw = String(hex).replace('#', '');
  if (raw.length === 3) {
    raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
  }
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = h / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h, s, l) {
  const sat = s / 100;
  const lig = l / 100;
  const a = sat * Math.min(lig, 1 - lig);
  function channel(n) {
    const k = (n + h / 30) % 12;
    const value = lig - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * value).toString(16).padStart(2, '0');
  }
  return '#' + channel(0) + channel(8) + channel(4);
}

export function applyAccent(hex) {
  if (!hex) {
    const theme = getTheme(root.dataset.theme);
    root.style.setProperty('--accent', theme.v.accent);
    root.style.setProperty('--accent2', theme.v.accent2);
    root.style.setProperty('--on-accent', theme.v.onAccent);
    return;
  }
  const hsl = hexToHsl(hex);
  const hue = (hsl[0] + 26) % 360;
  const sat = Math.min(96, hsl[1] + 6);
  const lig = Math.min(72, hsl[2] + 12);
  const second = hslToHex(hue, sat, lig);
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent2', second);
  root.style.setProperty('--on-accent', hsl[2] > 62 ? '#1a1208' : '#fffaf3');
}

export function applyDensity(mode) {
  root.dataset.density = mode === 'compact' ? 'compact' : 'confort';
}

export function applyFontScale(percent) {
  const value = Math.min(122, Math.max(88, Number(percent) || 100));
  root.style.fontSize = (16 * value / 100).toFixed(2) + 'px';
  return value;
}

export function applyMotion(on) {
  root.dataset.motion = on ? 'on' : 'off';
}

export function applyContrast(on) {
  root.dataset.contrast = on ? 'high' : 'normal';
}

export function applyAllPrefs(prefs) {
  applyTheme(prefs.theme);
  applyAccent(prefs.accent);
  applyDensity(prefs.density);
  applyFontScale(prefs.fontScale);
  applyMotion(prefs.motion);
  applyContrast(prefs.contrast);
}
