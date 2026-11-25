import { initStore, isDemo } from './store.js';
import * as L from './logic.js';

// ---------------------------------------------------------------- Grundlagen
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const A = (f) => '' + f;
const NAME = { f: 'Fabian', p: 'Lena', b: 'Gemeinsam' };
const COL = { f: '#C4243B', p: '#F2B8C2', b: '#2A2422', h: '#2E5E45' };
const ACC = {
  f: { fill: '#C4243B', on: '#FFFFFF', txt: '#B01F34', soft: '#F9E3E6' },
  p: { fill: '#F2B8C2', on: '#5A1F2B', txt: '#A8475F', soft: '#FBEAED' }
};
const TOPS = ['top-nuernberg', 'top-seerosen', 'top-gasse', 'top-sonnenblumen', 'top-cafe', 'top-sternennacht', 'top-hafen', 'top-wanderer', 'top-garten', 'top-blau'];
const TOPPOS = { 'top-nuernberg': 'center 60%', 'top-gasse': 'center 60%', 'top-sonnenblumen': 'center 30%', 'top-cafe': 'center 60%', 'top-wanderer': 'center 40%', 'top-blau': 'center 40%' };
const DAYIMG = {
  neujahr: ['d-neujahr', 'Neujahr'], valentin: ['d-valentin', 'Valentinstag'], mai: ['d-mai', 'Maifeiertag'], pfingsten: ['d-pfingsten', 'Pfingsten'],
  sommer: ['d-sommer', 'Sommeranfang'], einheit: ['d-einheit', 'Tag der Deutschen Einheit'], reformation: ['d-reformation', 'Reformationstag', 296],
  martin: ['d-martin', 'St. Martin'], silvester: ['d-silvester', 'Silvester']
};
const ICON = {
  check: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  smile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1 1.5 2.2 2.2 3.5 2.2s2.5-.7 3.5-2.2M9 9.5h.01M15 9.5h.01"/></svg>',
  star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/></svg>',
  flame: (fill) => '<svg width="15" height="15" viewBox="0 0 24 24" fill="' + fill + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/></svg>',
  lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  photo: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B5A55" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  logo: '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="11" cy="15" r="8" fill="none" stroke="#C4243B" stroke-width="3"/><circle cx="19" cy="15" r="8" fill="none" stroke="#F2B8C2" stroke-width="3"/></svg>'
};
const NAV = [
  ['start', 'Start', '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'],
  ['cal', 'Kalender', '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'],
  ['list', 'Listen', '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'],
  ['money', 'Geld', '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>'],
  ['sport', 'Sport', '<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>'],
  ['diary', 'Tagebuch', '<path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z"/><path d="M5 18a2 2 0 0 1 2-2h11M9 8h5"/>']
];

let store;
const S = {
  who: null, tab: 'start', sub: null, ready: false,
  d: { events: [], todos: [], shop: [], expenses: [], fixed: [], sport: [], recipes: [], dates: [], trips: [], messages: [], reminders: [], photos: [], diary: [], notes: [], wishes: [], pexpenses: [] },
  settings: {}, photo: null,
  ui: { calView: 'month', calOff: 0, filter: 'all', listTab: 'todo', mOff: 0, spEdit: false, doorOpen: false, msgOpen: false, recipe: null, dateIdea: null, trip: null },
  topImg: TOPS[Math.floor(Math.random() * TOPS.length)]
};
const today = () => { const o = localStorage.getItem('tandem:simDate'); return o ? L.parseISO(o) : new Date(); };
const tISO = () => L.iso(today());
const other = () => S.who === 'f' ? 'p' : 'f';
const me = () => NAME[S.who];
const them = () => NAME[other()];
const set = (k, v) => { if (typeof k === 'object') Object.assign(S.ui, k); else S.ui[k] = v; render(); };

// ---------------------------------------------------------------- Start
async function boot() {
  store = await initStore((loggedIn, who) => {
    if (!loggedIn) return showLogin();
    hideGate();
    if (!who) return showWhoPicker();
    startSession(who);
  });
}

function startSession(who) {
  S.who = who;
  applyAccent();
  if (!S.ready) {
    S.ready = true;
    ['events', 'todos', 'shop', 'expenses', 'fixed', 'sport', 'recipes', 'dates', 'trips', 'messages', 'reminders', 'photos'].forEach(n => store.watch(n, (arr) => { S.d[n] = arr; render(); }));
    ['diary', 'notes', 'wishes', 'pexpenses'].forEach(n => store.watch(n, (arr) => { S.d[n] = arr; render(); }, { priv: true }));
    store.watchDoc('settings', (doc) => { S.settings = doc || {}; render(); startFx(); });
    store.watchDoc('photo', (doc) => { S.photo = doc; render(); });
    setTimeout(cleanupMessages, 3000);
  }
  render();
}

function applyAccent() {
  const a = ACC[S.who || 'f'], r = document.documentElement.style;
  r.setProperty('--acc', a.fill); r.setProperty('--acc-on', a.on); r.setProperty('--acc-txt', a.txt); r.setProperty('--acc-soft', a.soft);
}

// ---------------------------------------------------------------- Login (nur Live-Modus)
function showLogin(err) {
  const g = $('#gate'); g.className = 'show';
  g.innerHTML = '<div class="in stack"><div class="brand">' + ICON.logo + 'Tandem</div><p class="muted">Melde dich mit deinem Tandem-Konto an.</p>' +
    '<form id="loginForm" class="stack"><label class="field">E-Mail<input name="email" type="email" autocomplete="username" required></label>' +
    '<label class="field">Passwort<input name="pw" type="password" autocomplete="current-password" required></label>' +
    (err ? '<div class="err">' + esc(err) + '</div>' : '') + '<button class="btn" type="submit">Anmelden</button></form></div>';
  $('#loginForm').onsubmit = async (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    try { await store.login(f.get('email').trim(), f.get('pw')); } catch (x) { showLogin('Anmeldung fehlgeschlagen. Stimmen E-Mail und Passwort?'); }
  };
}
function showWhoPicker() {
  const g = $('#gate'); g.className = 'show';
  g.innerHTML = '<div class="in stack"><div class="brand">' + ICON.logo + 'Tandem</div><div class="h1">Wer bist du?</div><p class="muted">Das fragt Tandem nur einmal.</p>' +
    '<button class="btn" style="background:#C4243B;color:#fff" data-pick="f">Ich bin Fabian</button><button class="btn" style="background:#F2B8C2;color:#5A1F2B" data-pick="p">Ich bin Lena</button></div>';
  g.querySelectorAll('[data-pick]').forEach(b => b.onclick = async () => { await store.setWho(b.dataset.pick); hideGate(); startSession(b.dataset.pick); });
}
function hideGate() { const g = $('#gate'); g.className = ''; g.innerHTML = ''; }

// ---------------------------------------------------------------- Rendern
let rq = false;
function render() { if (rq) return; rq = true; requestAnimationFrame(() => { rq = false; doRender(); }); }
function doRender() {
  if (!S.who) return;
  const main = $('#main');
  // Eingaben sichern
  const keep = {}; let focus = null, selS = null, selE = null;
  main.querySelectorAll('[data-keep]').forEach(el => { keep[el.dataset.keep] = el.value; });
  const ae = document.activeElement;
  if (ae && ae.dataset && ae.dataset.keep && main.contains(ae)) { focus = ae.dataset.keep; try { selS = ae.selectionStart; selE = ae.selectionEnd; } catch (e) {} }
  const st = main.scrollTop;
  $('#top').innerHTML = viewTop();
  main.innerHTML = viewMain();
  $('#nav').innerHTML = NAV.map(n => '<button data-a="tab" data-v="' + n[0] + '" class="' + (S.tab === n[0] ? 'on' : '') + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + n[2] + '</svg>' + n[1] + '</button>').join('');
  main.querySelectorAll('[data-keep]').forEach(el => { if (keep[el.dataset.keep] != null) el.value = keep[el.dataset.keep]; });
  if (focus) { const el = main.querySelector('[data-keep="' + focus + '"]'); if (el) { el.focus(); try { el.setSelectionRange(selS, selE); } catch (e) {} } }
  main.scrollTop = st;
}

function viewTop() {
  const right = isDemo
    ? '<div class="seg-pill" aria-label="Ansicht wechseln"><button data-a="demoWho" data-v="f" class="' + (S.who === 'f' ? 'on' : '') + '">Fabian</button><button data-a="demoWho" data-v="p" class="' + (S.who === 'p' ? 'on' : '') + '">Lena</button></div>'
    : '<span class="who-chip">' + me() + '</span>';
  return '<div class="brand">' + ICON.logo + 'Tandem</div>' + right;
}

function viewMain() {
  if (S.tab === 'start') return S.sub ? viewSub() : viewStart();
  if (S.tab === 'cal') return viewCal();
  if (S.tab === 'list') return viewList();
  if (S.tab === 'money') return viewMoney();
  if (S.tab === 'sport') return viewSport();
  if (S.tab === 'diary') return viewDiary();
  return '';
}

// ---------------------------------------------------------------- Festtage
function computeTheme() {
  const d = today(), occ = L.occasionFor(d, S.settings);
  if (!occ) return null;
  const st = S.settings, D = d.getDate();
  const togetherD = L.parseISO(st.together);
  if (occ === 'bdayF' || occ === 'bdayP') {
    const w = occ === 'bdayF' ? 'f' : 'p', mine = S.who === w, n = NAME[w];
    return { occ, img: w === 'f' ? 'geburtstag-fabian' : 'geburtstag-lena', kicker: mine ? 'Heute ist dein Tag' : 'Heute ist ' + n + 's Tag',
      title: mine ? 'Alles Gute, ' + n + '!' : n + ' hat Geburtstag', sub: mine ? 'Lass dich heute feiern' : 'Zeit für die Überraschung', gift: !mine, fx: 'balloons', parts: 'confetti' };
  }
  if (occ === 'anniv') {
    const yrs = togetherD ? d.getFullYear() - togetherD.getFullYear() : 0;
    return { occ, img: 'jahrestag', kicker: 'Seit dem ' + togetherD.getDate() + '. ' + L.MON[togetherD.getMonth()] + ' ' + togetherD.getFullYear(), title: yrs + (yrs === 1 ? ' Jahr' : ' Jahre') + ' Tandem',
      sub: 'Auf viele weitere Kilometer', extra: L.dayDiff(togetherD, d).toLocaleString('de-DE') + ' Tage zusammen', parts: 'hearts' };
  }
  if (occ === 'xmas') {
    const yr = d.getFullYear(), n = togetherD ? yr - togetherD.getFullYear() + ((togetherD.getMonth() === 11 && togetherD.getDate() > 24) ? 0 : 1) : 0;
    return { occ, img: 'weihnachten', kicker: D === 24 ? 'Heiligabend' : D + '. Dezember', title: 'Frohe Weihnachten', sub: 'Schöne Feiertage',
      extra: n > 0 ? 'Euer ' + n + '. Weihnachten zusammen' : '', door: D === 24 ? 24 : 0, lit: 4, fx: 'lights', parts: 'snow' };
  }
  if (occ === 'nikolaus') {
    return { occ, img: 'd-nikolaus', pos: 'center 30%', kicker: 'Nikolaus · 6. Dezember', title: 'Frohen Nikolaus', sub: 'Noch ' + (24 - D) + ' Tage bis Heiligabend', door: 6, lit: L.adventCount(d), fx: 'snow', parts: 'snow' };
  }
  if (occ === 'advent') {
    const M = d.getMonth() + 1;
    return { occ, img: 'advent', pos: 'center 55%', kicker: 'Adventszeit · ' + D + '. ' + L.MON[d.getMonth()], title: 'Schöne Adventszeit',
      sub: 'Noch ' + L.dayDiff(d, new Date(d.getFullYear(), 11, 24)) + ' Tage bis Heiligabend', door: M === 12 ? D : 0, lit: L.adventCount(d), fx: 'snow', parts: 'snow' };
  }
  if (occ === 'easter') {
    const mon = L.dayDiff(L.easter(d.getFullYear()), d) === 1;
    return { occ, img: 'ostern', pos: 'center top', kicker: mon ? 'Ostermontag' : 'Ostersonntag', title: 'Frohe Ostern', sub: 'Wer findet mehr Eier?', fx: 'flowers' };
  }
  return null;
}

const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
function particlesHTML(kind) {
  if (kind === 'snow') return Array.from({ length: 30 }, (_, i) => '<span style="position:absolute;top:-12px;left:' + Math.round(rnd(i + 1) * 100) + '%;width:' + (3 + Math.round(rnd(i + 7) * 3)) + 'px;height:' + (3 + Math.round(rnd(i + 7) * 3)) + 'px;border-radius:50%;background:#fff;opacity:' + (0.6 + rnd(i + 5) * 0.4).toFixed(2) + ';animation:fall ' + (7 + rnd(i + 9) * 7).toFixed(1) + 's linear infinite;animation-delay:-' + (rnd(i + 11) * 14).toFixed(1) + 's"></span>').join('');
  if (kind === 'confetti') { const c = ['#C4243B', '#F2B8C2', '#E8C468', '#fff', '#B9C8EC']; return Array.from({ length: 28 }, (_, i) => '<span style="position:absolute;top:-12px;left:' + Math.round(rnd(i + 1) * 100) + '%;width:' + (5 + Math.round(rnd(i + 7) * 4)) + 'px;height:' + (8 + Math.round(rnd(i + 3) * 6)) + 'px;border-radius:2px;background:' + c[i % c.length] + ';animation:fall ' + (4 + rnd(i + 9) * 4).toFixed(1) + 's linear infinite;animation-delay:-' + (rnd(i + 11) * 8).toFixed(1) + 's"></span>').join(''); }
  if (kind === 'hearts') { const c = ['#C4243B', '#F2B8C2', '#E8C468']; return Array.from({ length: 14 }, (_, i) => { const w = 10 + Math.round(rnd(i + 6) * 10); return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" style="position:absolute;top:' + Math.round(rnd(i + 2) * 85) + '%;left:' + Math.round(rnd(i + 4) * 92) + '%;animation:tw ' + (1.8 + rnd(i + 8) * 2).toFixed(1) + 's ease-in-out infinite;animation-delay:-' + (rnd(i + 10) * 3).toFixed(1) + 's"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 5 6.6 5c2 0 3.6 1.1 5.4 3 1.8-1.9 3.4-3 5.4-3 3.4 0 5.6 3.3 4.1 6.8C19.5 16.4 12 21 12 21z" fill="' + c[i % 3] + '"/></svg>'; }).join(''); }
  return '';
}

// Effekt-Ebene über dem ganzen Bildschirm, einmal pro Start, verblasst ab 30 s, weg nach 60 s
let fxStarted = false;
function startFx() {
  if (fxStarted || !S.who) return;
  const th = computeTheme(); fxStarted = true;
  if (!th || !th.fx) return;
  const fx = $('#fx'); let h = '';
  if (th.fx === 'snow') h = Array.from({ length: 70 }, (_, i) => '<span style="position:absolute;top:0;left:' + Math.round(rnd(i + 61) * 100) + '%;width:' + (3 + Math.round(rnd(i + 71) * 4)) + 'px;height:' + (3 + Math.round(rnd(i + 71) * 4)) + 'px;border-radius:50%;background:#fff;box-shadow:0 0 3px rgba(120,140,160,.6);animation:snowAll ' + (2.6 + rnd(i + 81) * 2.4).toFixed(1) + 's linear ' + (rnd(i + 91) * 2.5).toFixed(1) + 's infinite"></span>').join('');
  if (th.fx === 'flowers') { const c = ['#F2B8C2', '#FFFFFF', '#B9C8EC', '#F7D8E0', '#D7B4E8']; h = Array.from({ length: 16 }, (_, i) => { const w = 18 + Math.round(rnd(i + 101) * 20); return '<svg viewBox="0 0 40 40" width="' + w + '" height="' + w + '" style="position:absolute;left:-50px;top:' + Math.round(rnd(i + 111) * 70) + '%;--dx:' + (Math.round(window.innerWidth) + 100) + 'px;--dy:' + (Math.round(rnd(i + 131) * 260) - 60) + 'px;opacity:0;animation:drift ' + (5 + rnd(i + 141) * 3).toFixed(1) + 's ease-in-out ' + (rnd(i + 151) * 2.5).toFixed(1) + 's forwards"><g fill="' + c[i % 5] + '"><ellipse cx="20" cy="9" rx="6" ry="9"/><ellipse cx="20" cy="31" rx="6" ry="9"/><ellipse cx="9" cy="20" rx="9" ry="6"/><ellipse cx="31" cy="20" rx="9" ry="6"/></g><circle cx="20" cy="20" r="5" fill="#F3C64B"/></svg>'; }).join(''); }
  if (th.fx === 'balloons') { const c = ['#C4243B', '#F2B8C2', '#E8C468', '#B9C8EC', '#9CC5A1', '#D7B4E8']; h = Array.from({ length: 8 }, (_, i) => { const w = 46 + Math.round(rnd(i + 21) * 22); return '<button class="balloon" data-pop="1" aria-label="Ballon platzen lassen" style="left:' + Math.round(4 + rnd(i + 31) * 78) + '%;animation:rise ' + (6 + rnd(i + 41) * 3).toFixed(1) + 's ease-in ' + (rnd(i + 51) * 1.8).toFixed(1) + 's forwards"><svg viewBox="0 0 60 110" width="' + w + '" height="' + Math.round(w * 110 / 60) + '" aria-hidden="true"><path d="M30 72c-4 14 6 22 0 38" fill="none" stroke="#9A8F87" stroke-width="1.2"/><ellipse cx="30" cy="34" rx="26" ry="32" fill="' + c[i % 6] + '"/><path d="M26 66h8l-4 6z" fill="' + c[i % 6] + '"/><ellipse cx="21" cy="22" rx="6" ry="10" fill="#fff" opacity=".35"/></svg></button>'; }).join(''); }
  if (th.fx === 'lights') {
    const W = window.innerWidth, cols = ['#FF5B5B', '#FFD45C', '#7FD38A', '#6FB6FF', '#FF9BD0'];
    h = [[12, 92], [150, 230], [300, 380]].map((sd, k) => {
      const y0 = sd[0], c = sd[1] * 2 - y0, y1 = y0 + 14;
      let b = ''; for (let j = 0; j < 14; j++) { const t = (j + .5) / 14, x = (1 - t) * (1 - t) * -10 + 2 * (1 - t) * t * W / 2 + t * t * (W + 10), y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * c + t * t * y1, col = cols[(j + k) % 5];
        b += '<rect x="' + (x - 2.5).toFixed(0) + '" y="' + y.toFixed(0) + '" width="5" height="6" rx="1" fill="#3A3A32"/><circle cx="' + x.toFixed(0) + '" cy="' + (y + 10).toFixed(0) + '" r="11" fill="' + col + '" opacity=".25" style="animation:tw ' + (1 + rnd(j + k * 20) * 1.6).toFixed(1) + 's ease-in-out infinite"/><ellipse cx="' + x.toFixed(0) + '" cy="' + (y + 10).toFixed(0) + '" rx="4.5" ry="6.5" fill="' + col + '"/>'; }
      return '<svg viewBox="0 0 ' + W + ' 900" width="' + W + '" height="900" style="position:absolute;left:0;top:env(safe-area-inset-top)"><path d="M-10 ' + y0 + ' Q' + W / 2 + ' ' + c + ' ' + (W + 10) + ' ' + y1 + '" fill="none" stroke="#2F3A2C" stroke-width="2"/>' + b + '</svg>';
    }).join('');
  }
  fx.innerHTML = '<div class="layer">' + h + '</div>';
  setTimeout(() => { fx.innerHTML = ''; }, 61000);
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-pop]'); if (!b) return;
  const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.3, cols = ['#C4243B', '#F2B8C2', '#E8C468', '#B9C8EC', '#9CC5A1'];
  b.style.visibility = 'hidden';
  const layer = $('#fx .layer'); if (!layer) return;
  for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2, d = 40 + Math.random() * 40, s = document.createElement('span');
    s.style.cssText = 'position:absolute;left:' + cx + 'px;top:' + cy + 'px;width:7px;height:7px;border-radius:' + (j % 2 ? '50%' : '2px') + ';background:' + cols[j % 5] + ';--dx:' + Math.round(Math.cos(a) * d) + 'px;--dy:' + Math.round(Math.sin(a) * d) + 'px;animation:burst .9s ease-out forwards';
    layer.appendChild(s); }
});

// ---------------------------------------------------------------- Startseite
function greeting() {
  const h = new Date().getHours(), n = me();
  return h < 11 ? 'Guten Morgen, ' + n + '!' : h < 17 ? 'Moin ' + n + '!' : h < 22 ? 'Schönen Abend, ' + n + '!' : 'Gute Nacht, ' + n + '!';
}

function viewStart() {
  const d = today(), th = computeTheme();
  let h = '<div class="stack">';
  if (th) {
    h += '<div class="festcard"><img src="' + A(th.img + '.jpg') + '" alt="" style="object-position:' + (th.pos || 'center') + '"><div class="particles">' + particlesHTML(th.parts) + '</div></div>';
    h += '<div style="padding:2px 4px 0"><div class="kicker">' + esc(th.kicker) + '</div><div class="ftitle">' + esc(th.title) + '</div><div class="fsub">' + esc(th.sub) + '</div>' +
      (th.extra ? '<div class="pill">' + esc(th.extra) + '</div>' : '') +
      (th.gift ? '<div><button class="chip" style="margin-top:12px" data-a="sub" data-v="notes">Zur Wunschliste ›</button></div>' : '') + '</div>';
    if (th.door) h += viewAdvent(th);
  } else {
    const key = L.dayImageKey(d), di = key ? DAYIMG[key] : null, img = di ? di[0] : S.topImg;
    h += '<div class="hero" style="height:' + (di && di[2] ? di[2] : 380) + 'px"><img src="' + A(img + '.jpg') + '" alt="" style="object-position:' + (TOPPOS[img] || 'center') + '">' + (di ? '<span class="tag">' + di[1] + '</span>' : '') + '</div>';
    h += '<div style="padding:0 4px"><div class="small muted">' + L.fmtLong(d) + '</div><div style="font-size:26px;font-weight:800;letter-spacing:-.5px">' + esc(greeting()) + '</div></div>';
  }
  h += viewBoard();
  // Countdowns
  const trip = nextTrip(), ann = L.nextOccurrence(S.settings.together, d);
  h += '<div class="grid2"><button class="cd" data-a="sub" data-v="trips"><span class="small muted">Nächster Urlaub</span>' +
    (trip ? '<span class="big">' + L.dayDiff(d, L.parseISO(trip.start)) + ' Tage</span><span class="t15" style="font-weight:700">' + esc(trip.name) + '</span>' : '<span class="big">–</span><span class="t15" style="font-weight:700">Noch nichts geplant</span>') +
    '<span style="font-size:12px" class="muted">' + (trip ? 'Infos ansehen ›' : 'Urlaub anlegen ›') + '</span></button>' +
    '<button class="cd" data-a="sub" data-v="remind"><span class="small muted">Jahrestag</span>' +
    (ann ? '<span class="big">' + L.dayDiff(d, ann) + ' Tage</span><span class="t15" style="font-weight:700">' + ann.getDate() + '. ' + L.MON[ann.getMonth()] + '</span><span style="font-size:12px" class="muted">' + (ann.getFullYear() - L.parseISO(S.settings.together).getFullYear()) + ' Jahre Tandem</span>'
      : '<span class="big">–</span><span class="t15" style="font-weight:700">Datum fehlt</span><span style="font-size:12px" class="muted">Unter Erinnerungen eintragen</span>') + '</button></div>';
  h += '<div class="grid4">' + [['cook', 'tile-koch', 'Kochbuch'], ['dates', 'tile-date', 'Date-Ideen'], ['notes', 'tile-notiz', 'Notizen'], ['remind', 'tile-erinn', 'Erinnerungen']]
    .map(t => '<button class="tile" data-a="sub" data-v="' + t[0] + '"><img src="' + A(t[1] + '.jpg') + '" alt="">' + t[2] + '</button>').join('') + '</div>';
  // Als Nächstes
  const nx = nextUp();
  h += '<div class="card"><div style="font-size:15px;font-weight:700;margin-bottom:4px">Als Nächstes</div>' +
    (nx.length ? nx.map(e => '<div class="row" style="padding:8px 0"><div class="bar" style="background:' + e.bar + '"></div><div style="flex:1"><div class="t15">' + esc(e.t) + '</div><div class="small muted">' + esc(e.when) + '</div></div></div>').join('') : '<div class="empty">Nichts geplant – genießt den Tag.</div>') + '</div>';
  // Foto der Woche
  const pl = photoList();
  h += '<button class="frame" data-a="photo" aria-label="Fotos der Woche verwalten"><span class="inner">' + (pl.length ? pl.map((p, i) => '<img class="sl' + (i === (S.slide % pl.length) ? ' on' : '') + '" src="' + p.data + '" alt="Foto der Woche" style="' + photoStyle(p) + '">').join('') :
    ICON.photo + '<span style="font-size:14px;font-weight:700;color:#4A3D39">Foto der Woche</span><span style="font-size:11px;color:#6B5A55">Tippen zum Hochladen</span>') + '</span><img class="f" src="' + A('rahmen.png') + '" alt=""></button>';
  h += '<div class="since">' + esc(L.sinceText(S.settings.together, d)) + '</div></div>';
  return h;
}

function viewAdvent(th) {
  const lit = th.lit || 0, door = th.door, open = S.ui.doorOpen;
  let h = '<div class="adventrow"><div class="candles" aria-label="' + lit + ' von 4 Adventskerzen brennen">' +
    [1, 2, 3, 4].map(n => '<div class="candle"><img src="' + A(n <= lit ? 'kerze-an.jpg' : 'kerze-aus.jpg') + '" alt="" class="' + (n <= lit ? 'lit' : '') + '"><span class="num">' + n + '.</span></div>').join('') + '</div>' +
    '<button class="door ' + (open ? 'open' : '') + '" data-a="door" aria-label="Türchen ' + door + (open ? ' schließen' : ' öffnen') + '"><span class="box"><img src="' + A('tuer-innen.jpg') + '" alt=""><img class="front" src="' + A('tuer' + ((door - 1) % 3 + 1) + '.jpg') + '" alt=""><span class="snow">' + particlesHTML('snow').slice(0, 2400) + '</span></span><span class="num" style="display:block;text-align:center;margin-top:6px">' + door + '</span></button></div>';
  if (open) h += '<div class="poem"><div style="display:flex;justify-content:space-between;gap:8px"><span class="kicker" style="color:#B01F34">Türchen ' + door + '</span><span style="font-size:11px;color:#9A8F87">verschwindet nach 3 Minuten</span></div><div class="txt">' + esc(L.POEMS[door - 1]) + '</div></div>';
  return h;
}

function viewBoard() {
  const t = tISO(), tm = L.iso(L.addDays(today(), 1));
  const inc = S.d.messages.find(m => m.from === other() && m.forDate === t);
  const mine = S.d.messages.find(m => m.from === S.who && m.forDate === t);
  const next = S.d.messages.find(m => m.from === S.who && m.forDate === tm);
  const RN = { heart: 'Herz', smile: 'Lachen', star: 'Stern' };
  let h = '<div class="tafel"><div class="chalk-label">Nachricht des Tages · von ' + them() + '</div>';
  h += inc ? '<div class="chalk-msg">' + esc(inc.text) + '</div>' : '<div class="chalk-msg" style="font-size:20px;opacity:.75">Heute noch keine Nachricht von ' + them() + '.</div>';
  if (inc) h += '<div class="row" style="gap:8px;margin-top:12px">' + ['heart', 'smile', 'star'].map(k => '<button class="react ' + (inc.reaction === k ? 'on' : '') + '" data-a="react" data-id="' + inc.id + '" data-v="' + k + '" aria-label="Mit ' + RN[k] + ' reagieren">' + ICON[k] + '</button>').join('') +
    '<span class="chalk-label" style="margin-left:4px">' + (inc.reaction ? them() + ' sieht deine Reaktion' : 'Reagieren') + '</span></div>';
  if (mine && mine.reaction) h += '<div class="chalk-label" style="margin-top:10px">' + them() + ' hat auf deine Nachricht mit ' + RN[mine.reaction] + ' reagiert</div>';
  if (!S.ui.msgOpen) h += '<button class="chalk-btn" data-a="msgOpen">' + (next ? 'Nachricht für morgen angeheftet · ändern' : '+ Nachricht für morgen schreiben') + '</button>';
  else h += '<form data-form="msg" style="margin-top:12px"><label class="chalk-label">Nachricht für ' + them() + ' – erscheint morgen<textarea class="chalk-area" name="text" data-keep="msg" maxlength="120" rows="3" placeholder="Schreib etwas Nettes …">' + esc(next ? next.text : '') + '</textarea></label>' +
    '<div class="row" style="justify-content:space-between;margin-top:8px"><span class="chalk-label" id="msgCount">' + (next ? next.text.length : 0) + ' / 120 Zeichen</span><span class="row" style="gap:8px"><button type="button" class="chalk-save" style="background:transparent;color:#F4F1EA;border:1.5px solid rgba(244,241,234,.5)" data-a="msgClose">Abbrechen</button><button class="chalk-save" type="submit">Anheften</button></span></div></form>';
  return h + '</div>';
}

function nextTrip() {
  const t = tISO();
  return S.d.trips.filter(x => x.start && x.start >= t).sort((a, b) => a.start < b.start ? -1 : 1)[0] || null;
}
function nextUp() {
  const t = tISO(), d = today(), res = [];
  S.d.events.filter(e => e.date >= t).sort((a, b) => (a.date + (a.time || '')) < (b.date + (b.time || '')) ? -1 : 1).slice(0, 3)
    .forEach(e => res.push({ t: e.title, when: (e.date === t ? 'Heute' : L.fmtShort(L.parseISO(e.date))) + (e.time ? ' · ' + e.time : ''), bar: COL[e.who] || COL.b, k: e.date + (e.time || '') }));
  S.d.todos.filter(x => !x.done && x.due && (x.who === S.who || x.who === 'b')).sort((a, b) => a.due < b.due ? -1 : 1).slice(0, 2)
    .forEach(x => res.push({ t: x.title, when: 'To-Do · ' + (x.due === t ? 'heute' : x.due < t ? 'überfällig' : L.fmtShort(L.parseISO(x.due))), bar: COL[x.who], k: x.due }));
  return res.sort((a, b) => a.k < b.k ? -1 : 1).slice(0, 4);
}

async function cleanupMessages() {
  const t = tISO();
  for (const m of S.d.messages) if (m.from === S.who && m.forDate < t) { try { await store.remove('messages', m.id); } catch (e) {} }
}

// ---------------------------------------------------------------- Unterseiten
function viewSub() {
  const back = '<button class="back" data-a="sub" data-v="">‹ Start</button>';
  const s = S.sub;
  if (s === 'cook') return '<div class="stack">' + back + viewCook() + '</div>';
  if (s === 'dates') return '<div class="stack">' + back + viewDates() + '</div>';
  if (s === 'notes') return '<div class="stack">' + back + viewNotes() + '</div>';
  if (s === 'remind') return '<div class="stack">' + back + viewRemind() + '</div>';
  if (s === 'trips') return '<div class="stack">' + back + viewTrips() + '</div>';
  return viewStart();
}

function viewCook() {
  const rs = S.d.recipes.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  const pick = rs.find(r => r.id === S.ui.recipe);
  let h = '<div class="h1">Kochbuch</div>';
  if (rs.length) h += '<button class="btn" data-a="randRecipe">Zufälliges Gericht</button>';
  if (pick) h += '<div style="background:var(--acc-soft);border:2px solid var(--acc);border-radius:18px;padding:16px"><div class="kicker" style="color:var(--ink)">Heute gibt es</div><div style="font-size:22px;font-weight:800;margin-top:4px">' + esc(pick.title) + '</div><div style="font-size:14px;margin-top:2px">' + esc(pick.info || '') + '</div>' +
    ((pick.ingredients || '').trim() ? '<button class="btn small" style="margin-top:12px" data-a="toShop" data-id="' + pick.id + '">Zutaten auf die Einkaufsliste</button>' : '') + '</div>';
  h += rs.length ? rs.map(r => '<button class="card" style="width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center" data-a="editRecipe" data-id="' + r.id + '"><span><span style="display:block;font-size:16px;font-weight:700">' + esc(r.title) + '</span><span class="small muted">' + esc(r.info || '') + '</span></span><span class="small muted">' + esc(NAME[r.by] || '') + '</span></button>').join('')
    : '<div class="empty">Noch keine Rezepte. Legt euer erstes an!</div>';
  return h + '<button class="btn-add" data-a="editRecipe">+ Rezept</button>';
}
function viewDates() {
  const ds = S.d.dates, pick = ds.find(x => x.id === S.ui.dateIdea);
  let h = '<div class="h1">Date-Ideen</div>';
  if (ds.length) h += '<button class="btn" data-a="randDate">Überrasch uns</button>';
  if (pick) h += '<div style="background:var(--acc-soft);border:2px solid var(--acc);border-radius:18px;padding:16px"><div class="kicker" style="color:var(--ink)">Wie wär\'s mit</div><div style="font-size:22px;font-weight:800;margin-top:4px">' + esc(pick.title) + '</div><div style="font-size:14px;margin-top:2px">' + esc(pick.desc || '') + '</div></div>';
  h += ds.length ? ds.map(x => '<button class="card" style="width:100%;text-align:left" data-a="editDate" data-id="' + x.id + '"><span style="display:block;font-size:16px;font-weight:700">' + esc(x.title) + '</span><span class="small muted">' + esc(x.desc || '') + '</span></button>').join('') : '<div class="empty">Noch keine Ideen gesammelt.</div>';
  return h + '<button class="btn-add" data-a="editDate">+ Idee</button>';
}
function viewNotes() {
  let h = '<div class="h1">Persönliche Notizen</div><div class="row small muted" style="gap:8px">' + ICON.lock + 'Nur du siehst diese Seite</div>';
  h += S.d.notes.length ? S.d.notes.map(n => '<button class="card" style="width:100%;text-align:left" data-a="editNote" data-id="' + n.id + '"><span style="display:block;font-size:16px;font-weight:700">' + esc(n.title) + '</span><span style="display:block;font-size:14px;color:#5E544D;margin-top:2px;line-height:1.45;white-space:pre-line">' + esc(n.text || '') + '</span></button>').join('') : '<div class="empty">Noch keine Notizen.</div>';
  h += '<button class="btn-add" data-a="editNote">+ Notiz</button>';
  h += '<div style="font-size:18px;font-weight:800;margin-top:22px">Wunschliste für ' + them() + '</div>';
  h += S.d.wishes.length ? S.d.wishes.map(n => '<button class="card" style="width:100%;text-align:left" data-a="editWish" data-id="' + n.id + '"><span style="display:block;font-size:16px;font-weight:700">' + esc(n.title) + '</span><span class="small muted">' + esc(n.note || '') + '</span></button>').join('') : '<div class="empty">Noch keine Geschenkideen.</div>';
  return h + '<button class="btn-add" data-a="editWish">+ Geschenkidee</button>';
}
function viewRemind() {
  const d = today(), st = S.settings, items = [];
  const tr = nextTrip(); if (tr) items.push({ t: 'Urlaub ' + tr.name, d: L.parseISO(tr.start), sub: 'trips' });
  if (st.together) { const n = L.nextOccurrence(st.together, d); items.push({ t: 'Jahrestag', d: n, note: (n.getFullYear() - L.parseISO(st.together).getFullYear()) + ' Jahre' }); }
  if (st.bdayF) items.push({ t: 'Geburtstag Fabian', d: L.nextOccurrence(st.bdayF, d) });
  if (st.bdayP) items.push({ t: 'Geburtstag Lena', d: L.nextOccurrence(st.bdayP, d) });
  S.d.reminders.forEach(r => { const x = L.parseISO(r.date); if (x && L.dayDiff(d, x) >= 0) items.push({ t: r.title, d: x, id: r.id }); });
  items.sort((a, b) => a.d - b.d);
  let h = '<div class="h1">Erinnerungen</div><div class="small muted">Besondere Tage mit Countdown</div>';
  h += items.length ? items.map(i => '<button class="card row" style="width:100%;text-align:left;gap:14px" ' + (i.id ? 'data-a="editReminder" data-id="' + i.id + '"' : i.sub ? 'data-a="sub" data-v="' + i.sub + '"' : 'data-a="noop"') + '><span style="width:58px;height:58px;flex:none;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--acc);color:var(--acc-on)"><span style="font-size:22px;font-weight:800;line-height:1">' + L.dayDiff(d, i.d) + '</span><span style="font-size:11px;font-weight:700">Tage</span></span><span style="flex:1"><span style="display:block;font-size:16px;font-weight:700">' + esc(i.t) + '</span><span class="small muted">' + i.d.getDate() + '. ' + L.MON[i.d.getMonth()] + ' ' + i.d.getFullYear() + (i.note ? ' · ' + i.note : '') + '</span></span></button>').join('') : '<div class="empty">Noch keine Erinnerungen.</div>';
  h += '<button class="btn-add" data-a="editReminder">+ Erinnerung mit Countdown</button>';
  h += '<div style="font-size:18px;font-weight:800;margin-top:22px">Besondere Tage</div><div class="small muted">Könnt ihr jederzeit ändern</div><div class="card">' +
    [['together', 'Zusammen seit'], ['bdayF', 'Geburtstag Fabian'], ['bdayP', 'Geburtstag Lena']].map(([k, l]) => '<label class="row" style="justify-content:space-between;padding:8px 0;font-size:15px;font-weight:600">' + l + '<input type="date" data-setting="' + k + '" value="' + esc(st[k] || '') + '" style="font-size:16px;border:1px solid #DCCFBF;border-radius:10px;padding:8px 10px;min-height:40px;background:#FBF7F1"></label>').join('') + '</div>';
  h += '<div style="font-size:18px;font-weight:800;margin-top:22px">Zum Testen</div><div class="card stack"><div class="small muted">Tut so, als wäre heute ein anderer Tag – nur auf diesem Gerät. Praktisch, um Advent, Ostern oder Geburtstage vorab anzuschauen.</div>' +
    '<label class="field">Datum simulieren<input type="date" data-a="noop" id="simDate" value="' + esc(localStorage.getItem('tandem:simDate') || '') + '"></label><div class="row"><button class="btn small" data-a="simSet">Übernehmen</button><button class="btn small ghost" data-a="simReset">Zurück zu heute</button></div></div>';
  if (!isDemo) h += '<button class="btn ghost" style="margin-top:22px" data-a="logout">Abmelden</button>';
  return h;
}
function viewTrips() {
  const t = tISO(), all = S.d.trips.slice();
  const up = all.filter(x => (x.end || x.start || '') >= t).sort((a, b) => a.start < b.start ? -1 : 1);
  const past = all.filter(x => (x.end || x.start || '') < t).sort((a, b) => a.start > b.start ? -1 : 1);
  const cur = all.find(x => x.id === S.ui.trip) || up[0] || past[0];
  let h = '<div class="h1">Urlaube</div>';
  if (cur) {
    const isPast = (cur.end || cur.start) < t, days = L.dayDiff(today(), L.parseISO(cur.start));
    h += '<button style="width:100%;text-align:left;border:none;border-radius:20px;padding:18px;' + (isPast ? 'background:#EFE8DE;color:var(--ink)' : 'background:var(--acc);color:var(--acc-on)') + '" data-a="editTrip" data-id="' + cur.id + '"><span style="display:block;font-size:13px;opacity:.85">' + (isPast ? 'Im Archiv' : 'Geplanter Urlaub') + '</span><span style="display:block;font-size:30px;font-weight:800">' + esc(cur.name) + '</span><span style="display:block;font-size:14px;margin-top:2px">' + L.fmtDM(cur.start) + (cur.end ? ' – ' + L.fmtDM(cur.end) + cur.end.slice(0, 4) : '') + (!isPast && days >= 0 ? ' · noch ' + days + ' Tage' : '') + '</span><span style="display:block;font-size:12px;margin-top:6px;opacity:.8">Bearbeiten ›</span></button>';
    const info = (cur.info || '').split('\n').filter(x => x.trim());
    h += '<div class="card">' + (info.length ? info.map(l => { const i = l.indexOf(':'); return '<div class="row" style="justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--soft-line);font-size:15px"><span class="muted">' + esc(i > 0 ? l.slice(0, i) : '') + '</span><span style="font-weight:600;text-align:right">' + esc(i > 0 ? l.slice(i + 1).trim() : l) + '</span></div>'; }).join('') : '<div class="empty">Noch keine Infos – über „Bearbeiten“ eintragen.</div>') + '</div>';
    const pack = cur.pack || [];
    h += '<div style="font-size:18px;font-weight:800">Packliste</div><div class="notepad">' + pack.map((p, i) => '<button class="item" data-a="packToggle" data-id="' + cur.id + '" data-v="' + i + '"><span class="pbox" style="color:#3C5577">' + (p.done ? ICON.check : '') + '</span><span class="ptext ' + (p.done ? 'done' : '') + '">' + esc(p.t) + '</span></button>').join('') +
      '<form class="padd" data-form="packAdd" data-id="' + cur.id + '"><input name="t" data-keep="pack" placeholder="+ einpacken …" enterkeyhint="done"></form></div>';
  } else h += '<div class="empty">Noch kein Urlaub angelegt.</div>';
  if (up.length) h += '<div style="font-size:18px;font-weight:800;margin-top:10px">Geplante Urlaube</div>' + up.map(x => tripBtn(x, cur)).join('');
  h += '<button class="btn-add" data-a="editTrip">+ Urlaub hinzufügen</button>';
  if (past.length) h += '<div style="font-size:18px;font-weight:800;margin-top:10px">Archiv</div>' + past.map(x => tripBtn(x, cur)).join('');
  return h;
}
const tripBtn = (x, cur) => '<button data-a="pickTrip" data-id="' + x.id + '" style="width:100%;display:flex;justify-content:space-between;align-items:center;min-height:52px;padding:0 16px;border-radius:14px;font-size:16px;font-weight:700;' + (cur && x.id === cur.id ? 'border:none;background:var(--acc);color:var(--acc-on)' : 'border:1px solid var(--line);background:#fff;color:var(--ink)') + '"><span>' + esc(x.name) + '</span><span style="font-size:13px;opacity:.8">' + L.MS[L.parseISO(x.start).getMonth()] + ' ' + x.start.slice(0, 4) + '</span></button>';

// ---------------------------------------------------------------- Kalender
function viewCal() {
  const d0 = today(), t = tISO(), u = S.ui, flt = u.filter;
  const years = [d0.getFullYear() - 1, d0.getFullYear(), d0.getFullYear() + 1, d0.getFullYear() + 2];
  const hol = L.holidayMap(years);
  const keep = (e) => e.who === 'b' || flt === 'all' || (flt === 'me' ? e.who === S.who : e.who !== S.who);
  const evs = S.d.events.filter(keep).sort((a, b) => (a.date + (a.time || '')) < (b.date + (b.time || '')) ? -1 : 1);
  const evOn = (k) => evs.filter(e => e.date === k);
  const holRow = (k) => hol[k] ? [{ title: hol[k].name, time: hol[k].kind, hol: true }] : [];
  const evRow = (e) => '<button class="row" style="width:100%;background:none;border:none;padding:10px 0;border-bottom:1px solid var(--soft-line);text-align:left" ' + (e.hol ? 'data-a="noop"' : 'data-a="editEvent" data-id="' + e.id + '"') + '><span class="bar" style="background:' + (e.hol ? COL.h : COL[e.who] || COL.b) + '"></span><span style="flex:1"><span class="t15" style="display:block">' + esc(e.title) + '</span><span class="small muted">' + esc(e.when || '') + '</span></span></button>';
  let title, body = '';
  if (u.calView === 'week') {
    const mon = L.addDays(d0, -((d0.getDay() + 6) % 7) + u.calOff * 7), sun = L.addDays(mon, 6);
    title = mon.getDate() + '. ' + (mon.getMonth() === sun.getMonth() ? '' : L.MS[mon.getMonth()] + ' ') + '– ' + sun.getDate() + '. ' + L.MS[sun.getMonth()];
    body = '<div class="card" style="padding:4px 16px">' + Array.from({ length: 7 }, (_, i) => {
      const dt = L.addDays(mon, i), k = L.iso(dt), items = holRow(k).concat(evOn(k)), cls = k === t ? 'today' : hol[k] ? 'hol' : '';
      return '<div class="row" style="gap:14px;padding:12px 0;border-bottom:1px solid var(--soft-line);align-items:flex-start"><button class="wdlabel ' + cls + '" style="border:none" data-a="newEvent" data-v="' + k + '"><div style="font-size:12px;font-weight:700">' + L.WD[dt.getDay()] + '</div><div style="font-size:20px;font-weight:800">' + dt.getDate() + '</div></button><div style="flex:1;display:flex;flex-direction:column;gap:8px;justify-content:center;min-height:48px">' +
        (items.length ? items.map(e => '<button class="row" style="gap:10px;background:none;border:none;padding:0;text-align:left" ' + (e.hol ? 'data-a="noop"' : 'data-a="editEvent" data-id="' + e.id + '"') + '><span class="bar" style="height:30px;background:' + (e.hol ? COL.h : COL[e.who] || COL.b) + '"></span><span><span class="t15" style="display:block">' + esc(e.title) + '</span><span class="small muted">' + esc(e.time || 'ganztägig') + '</span></span></button>').join('') : '<div style="font-size:14px;color:#9A8F87">Nichts geplant</div>') + '</div></div>';
    }).join('') + '</div>';
  } else {
    const first = new Date(d0.getFullYear(), d0.getMonth() + u.calOff, 1), y = first.getFullYear(), mo = first.getMonth();
    title = L.MON[mo] + ' ' + y;
    const lead = (first.getDay() + 6) % 7, dim = new Date(y, mo + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<div class="cell"></div>';
    for (let dd = 1; dd <= dim; dd++) {
      const k = L.iso(new Date(y, mo, dd)), cls = k === t ? 'today' : hol[k] ? 'hol' : '';
      cells += '<button class="cell" data-a="newEvent" data-v="' + k + '"><span class="n ' + cls + '">' + dd + '</span><span class="dots">' + evOn(k).slice(0, 3).map(e => '<i style="background:' + (COL[e.who] || COL.b) + '"></i>').join('') + '</span></button>';
    }
    body = '<div class="card" style="padding:12px"><div class="calhead"><div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div></div><div class="calgrid">' + cells + '</div></div>' +
      '<div class="legend"><span><i style="background:#C4243B"></i>Fabian</span><span><i style="background:#F2B8C2"></i>Lena</span><span><i style="background:#2A2422"></i>Gemeinsam</span><span><i style="background:#2E5E45"></i>Feiertag</span></div>';
    const from = u.calOff === 0 ? t : L.iso(first), mk = y + '-' + L.pad(mo + 1);
    const list = [];
    Object.keys(hol).filter(k => k.slice(0, 7) === mk && k >= from).forEach(k => list.push({ k, title: hol[k].name, when: L.fmtShort(L.parseISO(k)) + ' · ' + hol[k].kind, hol: true }));
    evs.filter(e => e.date.slice(0, 7) === mk && e.date >= from).forEach(e => list.push(Object.assign({ k: e.date + (e.time || '') }, e, { when: (e.date === t ? 'Heute' : L.fmtShort(L.parseISO(e.date))) + (e.time ? ' · ' + e.time : '') })));
    list.sort((a, b) => a.k < b.k ? -1 : 1);
    body += '<div class="card" style="padding:4px 16px">' + (list.length ? list.map(evRow).join('') : '<div class="empty" style="padding:12px 0">Noch keine Termine in diesem Monat</div>') + '</div>';
  }
  const fl = [['all', 'Alle'], ['me', 'Meine'], ['other', them() + 's']];
  return '<div class="stack"><div class="row" style="justify-content:space-between"><button class="circle-btn" data-a="calNav" data-v="-1" aria-label="Zurück">‹</button><div class="fell" style="font-size:24px;text-align:center">' + title + '</div><button class="circle-btn" data-a="calNav" data-v="1" aria-label="Weiter">›</button></div>' +
    '<div class="row" style="gap:10px"><div class="seg" style="flex:1"><button class="' + (u.calView !== 'week' ? 'on' : '') + '" data-a="calView" data-v="month">Monat</button><button class="' + (u.calView === 'week' ? 'on' : '') + '" data-a="calView" data-v="week">Woche</button></div><button class="btn small" data-a="newEvent" data-v="' + t + '">+ Termin</button></div>' +
    '<div class="row" style="gap:8px;flex-wrap:wrap"><span class="small muted" style="font-weight:600">Zeigen:</span>' + fl.map(f => '<button class="chip ' + (flt === f[0] ? 'on' : '') + '" data-a="calFilter" data-v="' + f[0] + '">' + f[1] + '</button>').join('') +
    (u.calOff ? '<button class="chip" style="margin-left:auto;background:none;color:var(--acc-txt)" data-a="calToday">Heute</button>' : '') + '</div>' + body + '</div>';
}

// ---------------------------------------------------------------- Listen
function viewList() {
  const u = S.ui, t = tISO();
  let h = '<div class="stack"><div class="seg"><button class="' + (u.listTab === 'todo' ? 'on' : '') + '" data-a="listTab" data-v="todo">To-Dos und Erinnerungen</button><button class="' + (u.listTab === 'shop' ? 'on' : '') + '" data-a="listTab" data-v="shop">Einkauf</button></div>';
  if (u.listTab === 'todo') {
    const todos = S.d.todos.slice().sort((a, b) => (a.done - b.done) || ((a.due || '9') < (b.due || '9') ? -1 : 1));
    const lbl = (w) => w === 'b' ? 'Gemeinsam' : w === S.who ? 'Für dich' : 'Für ' + NAME[w];
    const ring = (w) => w === 'f' ? '#E8687A' : w === 'p' ? '#F2B8C2' : 'rgba(244,241,234,.7)';
    h += '<div class="board">' + (todos.length ? todos.map(x => '<div class="item"><button class="cbox ' + (x.done ? 'on' : '') + '" style="color:#F4F1EA" data-a="todoToggle" data-id="' + x.id + '" aria-label="abhaken">' + (x.done ? ICON.check : '') + '</button><button style="flex:1;display:flex;flex-direction:column;gap:2px;background:none;border:none;padding:0;text-align:left" data-a="editTodo" data-id="' + x.id + '"><span class="ctext ' + (x.done ? 'done' : '') + '">' + esc(x.title) + '</span><span class="cdue">' + (x.due ? (x.due === t ? 'Heute' : x.due < t && !x.done ? 'Überfällig · ' + L.fmtShort(L.parseISO(x.due)) : L.fmtShort(L.parseISO(x.due))) : 'ohne Datum') + '</span></button><span class="cchip" style="border-color:' + ring(x.who) + '">' + lbl(x.who) + '</span></div>').join('')
      : '<div class="ctext" style="padding:14px 0;opacity:.7">Alles erledigt!</div>') + '</div>';
    h += '<button class="btn-add" data-a="editTodo">+ To-Do oder Erinnerung</button>';
    if (todos.some(x => x.done)) h += '<button class="chip" data-a="clearTodos">Erledigte entfernen</button>';
  } else {
    const items = S.d.shop.slice().sort((a, b) => (a.done - b.done) || ((a.at || 0) - (b.at || 0)));
    h += '<div class="notepad"><div class="ttl">Einkaufszettel</div>' + items.map(x => '<button class="item" data-a="shopToggle" data-id="' + x.id + '"><span class="pbox" style="color:#3C5577">' + (x.done ? ICON.check : '') + '</span><span class="ptext ' + (x.done ? 'done' : '') + '">' + esc(x.title) + '</span><span style="width:8px;height:8px;border-radius:4px;background:' + (COL[x.who] || COL.b) + '"></span></button>').join('') +
      '<form class="padd" data-form="shopAdd"><input name="t" data-keep="shop" placeholder="+ aufschreiben …" enterkeyhint="done" autocomplete="off"><button class="chip" type="submit">+</button></form></div>';
    if (items.some(x => x.done)) h += '<button class="chip" data-a="clearShop">Erledigte entfernen</button>';
  }
  return h + '</div>';
}

// ---------------------------------------------------------------- Geld
function viewMoney() {
  const d0 = today(), md = new Date(d0.getFullYear(), d0.getMonth() + S.ui.mOff, 1), mk = md.getFullYear() + '-' + L.pad(md.getMonth() + 1);
  const shared = S.d.expenses, fixed = S.d.fixed, res = L.settle(shared, fixed, mk);
  const priv = S.d.pexpenses.filter(e => (e.date || '').slice(0, 7) === mk);
  const privSum = priv.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const settleTxt = !res.payer || res.diff === 0 ? 'Alles ausgeglichen' : (res.payer === S.who ? 'Du überweist ' + NAME[other()] + ' ' + L.euro(res.diff) : NAME[res.payer] + ' überweist dir ' + L.euro(res.diff));
  const entries = shared.filter(e => (e.date || '').slice(0, 7) === mk).map(e => Object.assign({ kind: 'shared' }, e)).concat(priv.map(e => Object.assign({ kind: 'priv' }, e))).sort((a, b) => a.date > b.date ? -1 : 1);
  let h = '<div class="money stack"><div class="row" style="justify-content:space-between"><button class="circle-btn" data-a="mNav" data-v="-1" aria-label="Vorheriger Monat">‹</button><div style="text-align:center"><div style="font-size:13px;letter-spacing:2px;text-transform:uppercase" class="lbl">Kassenbuch</div><div style="font-size:24px">' + L.MON[md.getMonth()] + ' ' + md.getFullYear() + '</div></div><button class="circle-btn" data-a="mNav" data-v="1" aria-label="Nächster Monat">›</button></div>';
  h += '<div class="box" style="border:2px solid rgba(244,241,234,.7)"><div class="lbl">Gemeinsam ausgegeben</div><div style="font-size:34px">' + L.euro(res.total) + '</div><div class="row lbl" style="gap:16px;flex-wrap:wrap;margin-top:6px"><span>Fabian zahlte ' + L.euro(res.paidF) + '</span><span>Lena zahlte ' + L.euro(res.paidP) + '</span></div></div>';
  h += '<div class="grid2"><div class="box"><div class="lbl">Abrechnung</div><div style="font-size:16px;margin-top:4px;line-height:1.35">' + settleTxt + '</div></div><div class="box"><div class="lbl">Deine privaten Ausgaben</div><div style="font-size:22px;margin-top:4px">' + L.euro(privSum) + '</div><div class="lbl" style="font-size:12px">nur für dich sichtbar</div></div></div>';
  h += '<div class="box"><div style="font-size:16px;margin-bottom:6px">Fixkosten · automatisch jeden Monat</div>' + (fixed.length ? fixed.map(f => '<button class="row-e" data-a="editFixed" data-id="' + f.id + '"><span style="flex:1">' + esc(f.title) + '<span class="lbl" style="font-size:12px"> · ' + NAME[f.paidBy] + '</span></span><span>' + L.euro(f.amount) + '</span></button>').join('') : '<div class="lbl">Noch keine Fixkosten.</div>') +
    '<button class="chalk-add" style="margin-top:10px;min-height:44px;font-size:15px" data-a="editFixed">+ Fixkosten</button></div>';
  h += '<div class="box"><div style="font-size:16px;margin-bottom:6px">Ausgaben im ' + L.MON[md.getMonth()] + '</div>' + (entries.length ? entries.map(e => '<button class="row-e" data-a="editExpense" data-id="' + e.id + '" data-v="' + e.kind + '"><span style="width:5px;height:30px;border-radius:3px;background:' + (e.kind === 'priv' ? '#9A8F87' : COL[e.paidBy]) + '"></span><span style="flex:1"><span style="display:block">' + esc(e.desc || 'Ausgabe') + '</span><span class="lbl" style="font-size:12px">' + (e.kind === 'priv' ? 'Privat' : 'Geteilt · ' + NAME[e.paidBy]) + ' · ' + L.fmtDM(e.date) + '</span></span><span>' + L.euro(e.amount) + '</span></button>').join('') : '<div class="lbl">Noch keine Ausgaben in diesem Monat.</div>') + '</div>';
  return h + '<button class="chalk-add" data-a="editExpense">+ Ausgabe eintragen</button></div>';
}

// ---------------------------------------------------------------- Sport
function viewSport() {
  const st = S.settings, red = st.spRed || {}, conf = st.spConf || {}, names = Object.assign({ f: 'Goodie', b: 'Goodie', p: 'Goodie' }, st.goodieNames || {});
  const entries = S.d.sport, gs = L.goodieStatus(entries, red), streak = L.sportStreaks(entries, tISO()), edit = S.ui.spEdit;
  const cols = [['f', 'Fabian', '#C4243B'], ['b', 'Wir', '#2B3A55'], ['p', 'Lena', '#C76A80']];
  const total = (red.f || 0) + (red.b || 0) + (red.p || 0);
  let h = '<div class="stack"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><div class="row" style="gap:10px;flex-wrap:wrap"><span class="fell" style="font-size:28px">Sport-Liste</span><button class="chip ' + (edit ? 'on' : '') + '" data-a="spEdit">' + (edit ? 'Fertig' : 'Bearbeiten') + '</button></div>' +
    '<div class="small muted" style="margin-top:2px;line-height:1.4;font-size:14px">Alle 5 Einträge gibt es ein Goodie vom anderen.<br>Flamme: mind. 2× Sport pro Woche<br>(allein oder gemeinsam).</div></div>' +
    '<div class="counter"><div style="font-size:22px;font-weight:800;line-height:1;color:#2B3A55">' + total + '</div><div style="font-size:11px;font-weight:700;margin-top:3px" class="muted">Goodies<br>eingelöst</div></div></div>';
  h += '<button class="btn" data-a="addSport">+ Training eintragen</button>';
  if (edit) h += '<div class="card stack"><div style="font-size:15px;font-weight:700">Goodies benennen</div>' + cols.map(c => '<label class="field" style="color:' + c[2] + '">Goodie für ' + (c[0] === 'b' ? 'uns beide' : c[1]) + '<input data-goodie="' + c[0] + '" maxlength="40" value="' + esc(names[c[0]] === 'Goodie' ? '' : names[c[0]]) + '" placeholder="Kochen für dich"></label>').join('') + '<div class="small muted">Einträge löschen: auf das × neben dem Eintrag tippen.</div></div>';
  h += '<div class="sheetp">' + cols.map(([k, n, c]) => {
    const g = gs[k], list = entries.filter(e => e.col === k).sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0), N = list.length;
    let goodie;
    if (g.open > 0) {
      let label, active;
      if (k === 'b') { const mineC = conf[S.who], otherC = conf[other()]; label = mineC ? 'warte auf ' + them() : otherC ? them() + ' hat bestätigt' : 'eingelöst? bestätigen'; active = !mineC; }
      else { active = k === S.who; label = active ? 'erhalten? abhaken' : 'du schuldest ' + NAME[k]; }
      goodie = '<button class="gbtn" data-a="redeem" data-v="' + k + '" style="' + (active ? 'border:none;background:' + c + ';color:#fff' : 'border:1.5px dashed ' + c + ';background:transparent;color:' + c) + '"><span style="display:block;font-size:10px;font-weight:700;line-height:1.25;opacity:.9">' + label + '</span><span style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;font-weight:800;line-height:1.3;margin-top:2px;overflow-wrap:anywhere">' + esc(names[k]) + (g.open > 1 ? ' (' + g.open + '×)' : '') + '</span></button>';
    } else goodie = '<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:2px;padding:0 4px;text-align:center;color:' + c + '"><span style="font-size:11px;font-weight:700;line-height:1.3">Goodie in ' + g.until + '× Training</span><span style="font-family:Caveat,cursive;font-size:18px;font-weight:700;line-height:1.35;padding-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">' + esc(names[k]) + '</span></div>';
    const sk = streak[k];
    return '<div class="spcol"><div class="sphead"><div class="fell" style="font-size:19px;color:' + c + '">' + n + '</div><div style="display:flex;gap:4px">' + [0, 1, 2, 3, 4].map(i => '<span style="width:9px;height:9px;border-radius:5px;border:1.5px solid ' + c + ';background:' + (i < g.prog ? c : 'transparent') + '"></span>').join('') + '</div></div>' +
      '<div class="spgoodie">' + goodie + '</div><div class="spstreak" style="color:' + (sk ? '#C9661A' : '#9A8F87') + '">' + ICON.flame(sk ? '#F5B83D' : 'none') + (sk ? sk + (sk === 1 ? ' Woche' : ' Wochen') : 'noch kein Streak') + '</div>' +
      (N ? list.map((e, j) => '<div class="spentry"><span class="p">' + esc(e.place) + '</span><span style="font-size:11px" class="muted">' + L.fmtDM(e.date) + ((N - j) % 5 === 0 ? ' · Goodie' : '') + '</span>' + (edit ? '<button class="spdel" data-a="delSport" data-id="' + e.id + '" aria-label="Eintrag löschen">×</button>' : '') + '</div>').join('') : '<div class="spentry"><span style="font-family:Caveat,cursive;font-size:18px;color:#9A8F87">noch leer</span></div>') + '</div>';
  }).join('') + '</div></div>';
  return h;
}

// ---------------------------------------------------------------- Tagebuch
function viewDiary() {
  const t = tISO(), todayE = S.d.diary.find(e => e.id === t), past = S.d.diary.filter(e => e.id !== t).sort((a, b) => a.id < b.id ? 1 : -1);
  let h = '<div class="stack"><div class="leather"><div><div class="fell" style="font-size:30px">Tagebuch</div><div class="fell" style="font-style:italic;font-size:15px;opacity:.85;margin-top:2px">von ' + me() + ' · nur du kannst es lesen</div></div></div>';
  if (!todayE || S.ui.diaryEdit) {
    const v = todayE || {};
    h += '<form class="paper stack" data-form="diary"><div style="font-size:16px">Heute, ' + today().getDate() + '. ' + L.MON[today().getMonth()] + '</div>' +
      '<label style="display:block;font-size:15px">Dafür bin ich dankbar<textarea class="lined" name="g" data-keep="dg" rows="3" placeholder="Der Kaffee heute Morgen">' + esc(v.g || '') + '</textarea></label>' +
      '<label style="display:block;font-size:15px;color:#2E7D4F">Highlight des Tages<textarea class="lined" name="h" data-keep="dh" rows="3" placeholder="Was war heute richtig gut?">' + esc(v.h || '') + '</textarea></label>' +
      '<label style="display:block;font-size:15px;color:#8A5A2B">Lowlight des Tages<textarea class="lined" name="l" data-keep="dl" rows="3" placeholder="Was war heute schwierig?">' + esc(v.l || '') + '</textarea></label>' +
      '<button class="btn" type="submit" style="font-family:Manrope,sans-serif">Eintrag speichern</button></form>';
  } else {
    h += '<div style="background:var(--acc-soft);border:2px solid var(--acc);border-radius:18px;padding:16px"><div class="kicker" style="color:var(--ink)">Heute erledigt</div>' + diaryLines(todayE) + '<div class="row" style="justify-content:space-between;margin-top:8px"><span class="small muted">Morgen kannst du wieder schreiben.</span><button class="chip" data-a="diaryEdit">Ändern</button></div></div>';
  }
  h += '<div style="font-size:18px;font-weight:800;margin-top:8px">Frühere Tage</div>';
  h += past.length ? past.map(e => '<div class="paper"><div style="font-size:13px;color:var(--acc-txt);font-family:Manrope,sans-serif;font-weight:700">' + L.fmtLong(L.parseISO(e.id)) + '</div>' + diaryLines(e) + '</div>').join('') : '<div class="empty">Hier erscheinen deine früheren Einträge.</div>';
  return h + '</div>';
}
const diaryLines = (e) => [['Dankbar', e.g], ['Highlight', e.h], ['Lowlight', e.l]].map(([k, v]) => '<div style="font-size:15px;line-height:1.5;margin-top:4px"><b>' + k + ':</b> ' + esc(v || '–') + '</div>').join('');

// ---------------------------------------------------------------- Sheet (Formulare)
let sheetSave = null, sheetDel = null;
function photoList() {
  const l = (S.d.photos || []).filter(p => p.data).sort((a, b) => (a.at || 0) - (b.at || 0));
  if (!l.length && S.photo && S.photo.data) return [Object.assign({ id: '__legacy' }, S.photo)];
  return l;
}
function photoStyle(p) {
  const z = Math.max(1, Math.min(3, +p.zoom || 1)), x = isFinite(+p.x) ? +p.x : 50, y = isFinite(+p.y) ? +p.y : 50;
  return 'object-position:' + x + '% ' + y + '%;transform:scale(' + z + ');transform-origin:' + x + '% ' + y + '%';
}
S.slide = 0;
setInterval(() => {
  const imgs = document.querySelectorAll('.frame .inner img.sl'); if (imgs.length < 2) return;
  S.slide = (S.slide + 1) % imgs.length; imgs.forEach((im, i) => im.classList.toggle('on', i === S.slide));
}, 6000);
function openPhotos() {
  const pl = photoList().filter(p => p.id !== '__legacy');
  const rows = pl.map(p => '<div class="card stack" data-pid="' + p.id + '"><div class="ph-prev"><img src="' + p.data + '" alt="" style="' + photoStyle(p) + '"></div>' +
    '<label class="field">Zoom<input type="range" min="1" max="3" step="0.05" name="zoom_' + p.id + '" value="' + (p.zoom || 1) + '"></label>' +
    '<label class="field">Links ↔ Rechts<input type="range" min="0" max="100" step="1" name="x_' + p.id + '" value="' + (isFinite(+p.x) ? p.x : 50) + '"></label>' +
    '<label class="field">Oben ↕ Unten<input type="range" min="0" max="100" step="1" name="y_' + p.id + '" value="' + (isFinite(+p.y) ? p.y : 50) + '"></label>' +
    '<button type="button" class="btn ghost small" style="color:#A32D2D" data-a="photoDel" data-id="' + p.id + '">Foto entfernen</button></div>').join('');
  openSheet('Fotos der Woche', '<div class="small muted">Mehrere Fotos laufen als Diashow (alle 6 Sekunden). Mit Zoom und den Reglern legst du den Ausschnitt fest.</div>' +
    '<button type="button" class="btn" data-a="photoAdd">+ Fotos hinzufügen</button>' + (rows || '<div class="small muted">Noch keine Fotos.</div>'),
    async (f) => { for (const p of pl) { const z = +f['zoom_' + p.id], x = +f['x_' + p.id], y = +f['y_' + p.id]; if (z !== (+p.zoom || 1) || x !== (isFinite(+p.x) ? +p.x : 50) || y !== (isFinite(+p.y) ? +p.y : 50)) await store.update('photos', p.id, { zoom: z, x, y }); } });
  document.querySelectorAll('#sheet [data-pid]').forEach(card => {
    const img = card.querySelector('.ph-prev img'), id = card.dataset.pid;
    const upd = () => { img.setAttribute('style', photoStyle({ zoom: card.querySelector('[name=zoom_' + id + ']').value, x: card.querySelector('[name=x_' + id + ']').value, y: card.querySelector('[name=y_' + id + ']').value })); };
    card.querySelectorAll('input[type=range]').forEach(r => r.addEventListener('input', upd));
  });
}
function openSheet(title, fields, onSave, onDel) {
  sheetSave = onSave; sheetDel = onDel || null;
  const el = $('#sheet'); el.className = 'show';
  el.innerHTML = '<div class="bg" data-a="sheetClose"></div><div class="panel" role="dialog" aria-label="' + esc(title) + '"><form id="sheetForm"><div class="row" style="justify-content:space-between"><div style="font-size:20px;font-weight:800">' + esc(title) + '</div><button type="button" class="chip" data-a="sheetClose">Schließen</button></div>' + fields +
    '<button class="btn" type="submit">Speichern</button>' + (onDel ? '<button type="button" class="btn ghost" style="color:#A32D2D" data-a="sheetDel">Löschen</button>' : '') + '</form></div>';
  $('#sheetForm').onsubmit = async (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target).entries()); try { const r = await sheetSave(f); if (r !== false) closeSheet(); } catch (x) { alert('Speichern hat nicht geklappt: ' + x.message); } };
  const first = el.querySelector('input,textarea'); if (first && !first.value && first.type !== 'date') setTimeout(() => first.focus(), 250);
}
function closeSheet() { const el = $('#sheet'); el.className = ''; el.innerHTML = ''; sheetSave = sheetDel = null; }
const fText = (name, label, val, ph, extra) => '<label class="field">' + label + '<input name="' + name + '" value="' + esc(val || '') + '" placeholder="' + esc(ph || '') + '" ' + (extra || '') + '></label>';
const fArea = (name, label, val, ph) => '<label class="field">' + label + '<textarea name="' + name + '" placeholder="' + esc(ph || '') + '">' + esc(val || '') + '</textarea></label>';
const fDate = (name, label, val, extra) => '<label class="field">' + label + '<input type="date" name="' + name + '" value="' + esc(val || '') + '" ' + (extra || '') + '></label>';
const fSel = (name, label, val, opts) => '<label class="field">' + label + '<select name="' + name + '">' + opts.map(o => '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></label>';
const whoOpts = () => [[S.who, 'Für mich (' + me() + ')'], [other(), 'Für ' + them()], ['b', 'Gemeinsam']];
const num = (v) => Number(String(v || '').replace(/\./g, '').replace(',', '.')) || 0;

// ---------------------------------------------------------------- Aktionen
const ACT = {
  noop() {},
  tab(v) { S.tab = v; S.sub = null; closeSheet(); render(); $('#main').scrollTop = 0; },
  sub(v) { S.sub = v || null; S.tab = 'start'; render(); $('#main').scrollTop = 0; },
  demoWho(v) { store.setWho(v); S.who = v; applyAccent(); S.ui.msgOpen = false; render(); },
  logout() { if (confirm('Wirklich abmelden?')) store.logout().then(() => location.reload()); },
  door() {
    clearTimeout(ACT._doorT);
    if (S.ui.doorOpen) return set('doorOpen', false);
    set('doorOpen', true); ACT._doorT = setTimeout(() => set('doorOpen', false), 180000);
  },
  react(v, el) { store.update('messages', el.dataset.id, { reaction: v }); },
  msgOpen() { set('msgOpen', true); setTimeout(() => { const t = document.querySelector('[data-keep="msg"]'); if (t) t.focus(); }, 50); },
  msgClose() { set('msgOpen', false); },
  photo() { openPhotos(); },
  photoAdd() { $('#photoInput').click(); },
  async photoDel(id) { if (!confirm('Dieses Foto entfernen?')) return; await store.remove('photos', id); closeSheet(); setTimeout(openPhotos, 300); },
  calNav(v) { set('calOff', S.ui.calOff + Number(v)); },
  calView(v) { set({ calView: v, calOff: 0 }); },
  calFilter(v) { set('filter', v); },
  calToday() { set('calOff', 0); },
  newEvent(v) { eventSheet(null, v); },
  editEvent(id) { eventSheet(S.d.events.find(e => e.id === id)); },
  listTab(v) { set('listTab', v); },
  todoToggle(id) { const x = S.d.todos.find(t => t.id === id); if (x) store.update('todos', id, { done: !x.done }); },
  editTodo(id) {
    const x = id ? S.d.todos.find(t => t.id === id) : null;
    openSheet(x ? 'To-Do bearbeiten' : 'Neues To-Do', fText('title', 'Was ist zu tun?', x && x.title, 'Müll rausbringen', 'required') + fDate('due', 'Fällig am (optional)', x && x.due) + fSel('who', 'Für wen?', x ? x.who : S.who, whoOpts()),
      (f) => { if (!f.title.trim()) return false; const d = { title: f.title.trim(), due: f.due || '', who: f.who }; return x ? store.update('todos', x.id, d) : store.add('todos', Object.assign(d, { done: false, by: S.who, at: Date.now() })); },
      x ? () => store.remove('todos', x.id) : null);
  },
  clearTodos() { S.d.todos.filter(x => x.done).forEach(x => store.remove('todos', x.id)); },
  shopToggle(id) { const x = S.d.shop.find(t => t.id === id); if (x) store.update('shop', id, { done: !x.done }); },
  clearShop() { S.d.shop.filter(x => x.done).forEach(x => store.remove('shop', x.id)); },
  mNav(v) { set('mOff', S.ui.mOff + Number(v)); },
  editFixed(id) {
    const x = id ? S.d.fixed.find(t => t.id === id) : null;
    openSheet(x ? 'Fixkosten bearbeiten' : 'Neue Fixkosten', fText('title', 'Wofür?', x && x.title, 'Miete', 'required') + fText('amount', 'Betrag pro Monat (€)', x ? String(x.amount).replace('.', ',') : '', '820,00', 'inputmode="decimal" required') + fSel('paidBy', 'Wer zahlt?', x ? x.paidBy : S.who, [['f', 'Fabian'], ['p', 'Lena']]),
      (f) => { const d = { title: f.title.trim(), amount: num(f.amount), paidBy: f.paidBy }; return x ? store.update('fixed', x.id, d) : store.add('fixed', d); },
      x ? () => store.remove('fixed', x.id) : null);
  },
  editExpense(_, el) {
    const id = el && el.dataset.id, kind = el && el.dataset.v, x = id ? (kind === 'priv' ? S.d.pexpenses : S.d.expenses).find(t => t.id === id) : null;
    openSheet(x ? 'Ausgabe bearbeiten' : 'Neue Ausgabe', fText('amount', 'Betrag (€)', x ? String(x.amount).replace('.', ',') : '', '24,90', 'inputmode="decimal" required') + fText('desc', 'Wofür?', x && x.desc, 'Rewe') + fDate('date', 'Datum', x ? x.date : tISO(), 'required') +
      (x ? '<input type="hidden" name="kind" value="' + kind + '">' : fSel('kind', 'Art', 'shared', [['shared', 'Geteilt (für uns beide)'], ['priv', 'Privat (nur für mich sichtbar)']])) +
      (kind === 'priv' ? '' : fSel('paidBy', 'Wer hat bezahlt? (nur bei geteilt)', x ? x.paidBy : S.who, [['f', 'Fabian'], ['p', 'Lena']])),
      (f) => { const d = { amount: num(f.amount), desc: (f.desc || '').trim(), date: f.date };
        if (f.kind === 'priv') return x ? store.update('pexpenses', x.id, d, { priv: true }) : store.add('pexpenses', d, { priv: true });
        d.paidBy = f.paidBy || S.who; return x ? store.update('expenses', x.id, d) : store.add('expenses', d); },
      x ? () => store.remove(kind === 'priv' ? 'pexpenses' : 'expenses', x.id, { priv: kind === 'priv' }) : null);
  },
  spEdit() { set('spEdit', !S.ui.spEdit); },
  addSport() {
    const places = Array.from(new Set(S.d.sport.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(e => e.place))).slice(0, 6);
    openSheet('Training eintragen', fSel('col', 'Wer?', S.who, [['f', 'Fabian'], ['b', 'Wir (gemeinsam)'], ['p', 'Lena']]) + fDate('date', 'Datum', tISO(), 'required') + fText('place', 'Wo wart ihr?', '', 'Evo', 'required id="spPlace"') +
      (places.length ? '<div class="row" style="gap:8px;flex-wrap:wrap">' + places.map(p => '<button type="button" class="chip" data-a="fillPlace" data-v="' + esc(p) + '">' + esc(p) + '</button>').join('') + '</div>' : ''),
      (f) => { if (!f.place.trim()) return false; return store.add('sport', { col: f.col, date: f.date, place: f.place.trim(), by: S.who }); });
  },
  fillPlace(v) { const i = $('#spPlace'); if (i) i.value = v; },
  delSport(id) { if (confirm('Eintrag löschen?')) store.remove('sport', id); },
  redeem(k) {
    const st = S.settings, red = Object.assign({ f: 0, b: 0, p: 0 }, st.spRed || {});
    if (k !== 'b') { if (k !== S.who) return; red[k] = (red[k] || 0) + 1; store.setDoc('settings', { spRed: red }); return; }
    const conf = Object.assign({}, st.spConf || {}); conf[S.who] = true;
    if (conf.f && conf.p) { red.b = (red.b || 0) + 1; store.setDoc('settings', { spRed: red, spConf: { f: false, p: false } }); }
    else store.setDoc('settings', { spConf: conf });
  },
  diaryEdit() { set('diaryEdit', true); },
  randRecipe() { const r = S.d.recipes; if (r.length) set('recipe', r[Math.floor(Math.random() * r.length)].id); },
  toShop(id) {
    const r = S.d.recipes.find(x => x.id === id); if (!r) return;
    const lines = (r.ingredients || '').split('\n').map(x => x.trim()).filter(Boolean);
    lines.forEach((l, i) => store.add('shop', { title: l, who: S.who, done: false, at: Date.now() + i }));
    alert(lines.length + ' Zutaten stehen jetzt auf dem Einkaufszettel.');
  },
  editRecipe(id) {
    const x = id ? S.d.recipes.find(t => t.id === id) : null;
    openSheet(x ? 'Rezept' : 'Neues Rezept', fText('title', 'Name', x && x.title, 'Pasta mit Tomatensoße', 'required') + fText('info', 'Kurzinfo', x && x.info, '20 Min · einfach') + fArea('ingredients', 'Zutaten (eine pro Zeile)', x && x.ingredients, 'Nudeln\nTomaten\nKnoblauch') + fArea('steps', 'Zubereitung', x && x.steps, ''),
      (f) => { const d = { title: f.title.trim(), info: f.info.trim(), ingredients: f.ingredients, steps: f.steps }; return x ? store.update('recipes', x.id, d) : store.add('recipes', Object.assign(d, { by: S.who })); },
      x ? () => store.remove('recipes', x.id) : null);
  },
  randDate() { const r = S.d.dates; if (r.length) set('dateIdea', r[Math.floor(Math.random() * r.length)].id); },
  editDate(id) {
    const x = id ? S.d.dates.find(t => t.id === id) : null;
    openSheet(x ? 'Date-Idee' : 'Neue Date-Idee', fText('title', 'Idee', x && x.title, 'Picknick im Park', 'required') + fText('desc', 'Details', x && x.desc, 'Decke, Snacks, Musik'),
      (f) => { const d = { title: f.title.trim(), desc: f.desc.trim() }; return x ? store.update('dates', x.id, d) : store.add('dates', d); }, x ? () => store.remove('dates', x.id) : null);
  },
  editNote(id) {
    const x = id ? S.d.notes.find(t => t.id === id) : null;
    openSheet(x ? 'Notiz' : 'Neue Notiz', fText('title', 'Titel', x && x.title, 'Ideen für den Jahrestag', 'required') + fArea('text', 'Notiz', x && x.text, ''),
      (f) => { const d = { title: f.title.trim(), text: f.text }; return x ? store.update('notes', x.id, d, { priv: true }) : store.add('notes', d, { priv: true }); }, x ? () => store.remove('notes', x.id, { priv: true }) : null);
  },
  editWish(id) {
    const x = id ? S.d.wishes.find(t => t.id === id) : null;
    openSheet(x ? 'Geschenkidee' : 'Neue Geschenkidee', fText('title', 'Idee', x && x.title, 'Konzertkarten', 'required') + fText('note', 'Notiz / Preis', x && x.note, ''),
      (f) => { const d = { title: f.title.trim(), note: f.note.trim() }; return x ? store.update('wishes', x.id, d, { priv: true }) : store.add('wishes', d, { priv: true }); }, x ? () => store.remove('wishes', x.id, { priv: true }) : null);
  },
  editReminder(id) {
    const x = id ? S.d.reminders.find(t => t.id === id) : null;
    openSheet(x ? 'Erinnerung' : 'Neue Erinnerung', fText('title', 'Was?', x && x.title, 'Konzert', 'required') + fDate('date', 'Datum', x && x.date, 'required'),
      (f) => { const d = { title: f.title.trim(), date: f.date }; return x ? store.update('reminders', x.id, d) : store.add('reminders', d); }, x ? () => store.remove('reminders', x.id) : null);
  },
  simSet() { const v = $('#simDate').value; if (v) { localStorage.setItem('tandem:simDate', v); location.reload(); } },
  simReset() { localStorage.removeItem('tandem:simDate'); location.reload(); },
  pickTrip(id) { set('trip', id); $('#main').scrollTop = 0; },
  editTrip(id) {
    const x = id ? S.d.trips.find(t => t.id === id) : null;
    openSheet(x ? 'Urlaub bearbeiten' : 'Neuer Urlaub', fText('name', 'Wohin?', x && x.name, 'Ostsee', 'required') + fDate('start', 'Von', x && x.start, 'required') + fDate('end', 'Bis', x && x.end) + fArea('info', 'Infos (eine pro Zeile, z. B. „Unterkunft: …“)', x ? x.info : 'Unterkunft: \nAnreise: \nBudget: \nGebucht von: ', ''),
      async (f) => { const d = { name: f.name.trim(), start: f.start, end: f.end || f.start, info: f.info }; if (x) return store.update('trips', x.id, d); const nid = await store.add('trips', Object.assign(d, { pack: [] })); S.ui.trip = nid; },
      x ? () => store.remove('trips', x.id) : null);
  },
  packToggle(_, el) { const id = el.dataset.id; const tr = S.d.trips.find(t => t.id === id); if (!tr) return; const p = (tr.pack || []).slice(), i = Number(el.dataset.v); p[i] = Object.assign({}, p[i], { done: !p[i].done }); store.update('trips', id, { pack: p }); },
  sheetClose() { closeSheet(); },
  async sheetDel() { if (sheetDel && confirm('Wirklich löschen?')) { await sheetDel(); closeSheet(); } }
};

function eventSheet(x, date) {
  openSheet(x ? 'Termin bearbeiten' : 'Neuer Termin', fText('title', 'Was?', x && x.title, 'Zahnarzt', 'required') + fDate('date', 'Datum', x ? x.date : date, 'required') +
    '<label class="field">Uhrzeit (optional)<input type="time" name="time" value="' + esc(x ? x.time || '' : '') + '"></label>' + fSel('who', 'Für wen?', x ? x.who : S.who, whoOpts()),
    (f) => { if (!f.title.trim()) return false; const d = { title: f.title.trim(), date: f.date, time: f.time || '', who: f.who }; return x ? store.update('events', x.id, d) : store.add('events', Object.assign(d, { by: S.who })); },
    x ? () => store.remove('events', x.id) : null);
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const fn = ACT[t.dataset.a]; if (!fn) return;
  if (t.tagName === 'BUTTON' && t.type !== 'submit') e.preventDefault();
  fn(t.dataset.v != null ? t.dataset.v : t.dataset.id, t, e);
});
document.addEventListener('submit', async (e) => {
  const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault();
  const data = Object.fromEntries(new FormData(f).entries()), k = f.dataset.form;
  if (k === 'shopAdd') { const v = (data.t || '').trim(); if (!v) return; f.querySelector('input').value = ''; await store.add('shop', { title: v, who: S.who, done: false, at: Date.now() }); f.querySelector('input').focus(); }
  if (k === 'packAdd') { const v = (data.t || '').trim(); if (!v) return; const tr = S.d.trips.find(x => x.id === f.dataset.id); f.querySelector('input').value = ''; await store.update('trips', tr.id, { pack: (tr.pack || []).concat([{ t: v, done: false }]) }); }
  if (k === 'msg') { const v = (data.text || '').trim().slice(0, 120); const tm = L.iso(L.addDays(today(), 1)); if (v) await store.set('messages', S.who + '_' + tm, { from: S.who, forDate: tm, text: v, reaction: null }); else await store.remove('messages', S.who + '_' + tm).catch(() => {}); S.ui.msgOpen = false; render(); }
  if (k === 'diary') { await store.set('diary', tISO(), { g: data.g || '', h: data.h || '', l: data.l || '', at: Date.now() }, { priv: true }); S.ui.diaryEdit = false; render(); }
});
document.addEventListener('input', (e) => {
  if (e.target.dataset && e.target.dataset.keep === 'msg') { const c = $('#msgCount'); if (c) c.textContent = e.target.value.length + ' / 120 Zeichen'; }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset && el.dataset.setting) store.setDoc('settings', { [el.dataset.setting]: el.value });
  if (el.dataset && el.dataset.goodie) { const n = Object.assign({}, S.settings.goodieNames || {}); n[el.dataset.goodie] = el.value.trim() || 'Goodie'; store.setDoc('settings', { goodieNames: n }); }
});

// Foto der Woche: verkleinern und als JPEG-Text speichern (≤ 900 KB)
$('#photoInput').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []); e.target.value = ''; if (!files.length) return;
  let ok = 0;
  for (const file of files) {
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
      let max = 1200, q = 0.8, data = '';
      for (let k = 0; k < 8; k++) {
        const sc = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        data = c.toDataURL('image/jpeg', q); if (data.length <= 900000) break;
        q = Math.max(0.5, q - 0.1); if (q === 0.5) max = Math.round(max * 0.8);
      }
      await store.add('photos', { data, by: S.who, at: Date.now(), zoom: 1, x: 50, y: 50 }); ok++;
    } catch (x) { console.warn(x); }
  }
  if (!ok) alert('Die Fotos konnten nicht geladen werden.');
  closeSheet(); setTimeout(openPhotos, 400);
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
boot();
