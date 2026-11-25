// Reine Logik ohne DOM – auch in Node testbar.

export const pad = (n) => String(n).padStart(2, '0');
export const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export const parseISO = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dayDiff = (a, b) => Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);

export const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
export const MS = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
export const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export const WDL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export const fmtLong = (d) => WDL[d.getDay()] + ', ' + d.getDate() + '. ' + MON[d.getMonth()];
export const fmtShort = (d) => WD[d.getDay()] + ' ' + d.getDate() + '. ' + MS[d.getMonth()];
export const fmtDM = (s) => { const d = parseISO(s); return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.'; };
export const euro = (n) => (Math.round((n || 0) * 100) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

// Ostersonntag (Gauß/Meeus)
export function easter(Y) {
  const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Y, mo - 1, da);
}

// Feiertage Hamburg (+ Heiligabend/Silvester/Ostersonntag/Pfingstsonntag als „Festtag“)
export function holidaysHH(Y) {
  const E = easter(Y), o = (n) => addDays(E, n);
  return [
    [new Date(Y, 0, 1), 'Neujahr', 'Feiertag'], [o(-2), 'Karfreitag', 'Feiertag'], [E, 'Ostersonntag', 'Festtag'], [o(1), 'Ostermontag', 'Feiertag'],
    [new Date(Y, 4, 1), 'Tag der Arbeit', 'Feiertag'], [o(39), 'Christi Himmelfahrt', 'Feiertag'], [o(49), 'Pfingstsonntag', 'Festtag'], [o(50), 'Pfingstmontag', 'Feiertag'],
    [new Date(Y, 9, 3), 'Tag der Deutschen Einheit', 'Feiertag'], [new Date(Y, 9, 31), 'Reformationstag', 'Feiertag'],
    [new Date(Y, 11, 24), 'Heiligabend', 'Festtag'], [new Date(Y, 11, 25), '1. Weihnachtstag', 'Feiertag'], [new Date(Y, 11, 26), '2. Weihnachtstag', 'Feiertag'], [new Date(Y, 11, 31), 'Silvester', 'Festtag']
  ].map(([d, name, kind]) => ({ date: iso(d), name, kind }));
}
export function holidayMap(years) { const m = {}; years.forEach(Y => holidaysHH(Y).forEach(h => { m[h.date] = h; })); return m; }

// Tage mit festem Startbild
export function dayImageKey(d) {
  const M = d.getMonth() + 1, D = d.getDate(), dd = dayDiff(easter(d.getFullYear()), d);
  if (M === 1 && D === 1) return 'neujahr';
  if (M === 2 && D === 14) return 'valentin';
  if (M === 5 && D === 1) return 'mai';
  if (dd === 49 || dd === 50) return 'pfingsten';
  if (M === 6 && D === 21) return 'sommer';
  if (M === 10 && D === 3) return 'einheit';
  if (M === 10 && D === 31) return 'reformation';
  if (M === 11 && D === 11) return 'martin';
  if (M === 12 && D === 31) return 'silvester';
  return null;
}

// 1. Advent = 4. Sonntag vor dem 25.12.
export function firstAdvent(Y) { const x = new Date(Y, 11, 24); return addDays(x, -x.getDay() - 21); }
export function adventCount(d) { const a1 = firstAdvent(d.getFullYear()); if (d < a1) return 0; return Math.min(4, Math.floor(dayDiff(a1, d) / 7) + 1); }

const sameMD = (s, d) => { const x = parseISO(s); return x && x.getMonth() === d.getMonth() && x.getDate() === d.getDate(); };

// Welcher Festtag ist heute? (Reihenfolge = Vorrang)
export function occasionFor(d, settings) {
  const st = settings || {};
  if (sameMD(st.bdayF, d)) return 'bdayF';
  if (sameMD(st.bdayP, d)) return 'bdayP';
  if (sameMD(st.together, d)) return 'anniv';
  const M = d.getMonth() + 1, D = d.getDate();
  if (M === 12 && D >= 24 && D <= 26) return 'xmas';
  if (M === 12 && D === 6) return 'nikolaus';
  if (adventCount(d) > 0 && (M === 11 || (M === 12 && D <= 23))) return 'advent';
  const dd = dayDiff(easter(d.getFullYear()), d);
  if (dd === 0 || dd === 1) return 'easter';
  return null;
}

export function nextOccurrence(s, today) {
  const x = parseISO(s); if (!x) return null;
  let n = new Date(today.getFullYear(), x.getMonth(), x.getDate());
  if (dayDiff(today, n) < 0) n = new Date(today.getFullYear() + 1, x.getMonth(), x.getDate());
  return n;
}

export function sinceParts(fromS, today) {
  const f = parseISO(fromS); if (!f) return null;
  let y = today.getFullYear() - f.getFullYear(), mo = today.getMonth() - f.getMonth(), d = today.getDate() - f.getDate();
  if (d < 0) { mo -= 1; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (mo < 0) { y -= 1; mo += 12; }
  return { y, mo, d };
}
export function sinceText(fromS, today) {
  const p = sinceParts(fromS, today); if (!p) return 'Ein Tandem seit … (Datum unter Erinnerungen eintragen)';
  const pl = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  return 'Ein Tandem seit ' + pl(p.y, 'Jahr', 'Jahren') + ', ' + pl(p.mo, 'Monat', 'Monaten') + ' und ' + pl(p.d, 'Tag', 'Tagen');
}

// ---------- Sport ----------
export const weekIndex = (s) => { const d = parseISO(s); const W0 = new Date(2001, 0, 1); return Math.floor(dayDiff(W0, d) / 7); }; // 1.1.2001 = Montag

export function sportStreaks(entries, todayS) {
  const cnt = { f: {}, b: {}, p: {} };
  entries.forEach(e => { const w = weekIndex(e.date); cnt[e.col][w] = (cnt[e.col][w] || 0) + 1; });
  const ok = (who, w) => who === 'b' ? (ok('f', w) && ok('p', w)) : ((cnt[who][w] || 0) + (cnt.b[w] || 0) >= 2);
  const cur = weekIndex(todayS);
  const run = (who) => { let w = ok(who, cur) ? cur : cur - 1, n = 0; while (n < 1000 && ok(who, w)) { n++; w--; } return n; };
  return { f: run('f'), b: run('b'), p: run('p') };
}

export function goodieStatus(entries, redeemed) {
  const r = redeemed || {};
  const res = {};
  ['f', 'b', 'p'].forEach(c => {
    const n = entries.filter(e => e.col === c).length, earned = Math.floor(n / 5);
    res[c] = { n, earned, open: Math.max(0, earned - (r[c] || 0)), prog: n % 5, until: 5 - (n % 5) };
  });
  return res;
}

// ---------- Geld ----------
// shared: [{amount, paidBy:'f'|'p', date}], fixed: [{amount, paidBy}], monthKey 'YYYY-MM'
export function settle(shared, fixed, monthKey) {
  const inMonth = shared.filter(e => (e.date || '').slice(0, 7) === monthKey);
  const all = inMonth.concat((fixed || []).map(f => ({ amount: Number(f.amount) || 0, paidBy: f.paidBy })));
  let paidF = 0, paidP = 0;
  all.forEach(e => { const a = Number(e.amount) || 0; if (e.paidBy === 'p') paidP += a; else paidF += a; });
  const total = paidF + paidP, diff = Math.round(Math.abs(paidF - paidP) / 2 * 100) / 100;
  return { total, paidF, paidP, diff, payer: paidF > paidP ? 'p' : paidP > paidF ? 'f' : null };
}

export const POEMS = [
  "Heut geht das erste Türchen auf,\nder Winter nimmt nun seinen Lauf.\nEin Lichtlein brennt, der Tee ist heiß –\nund draußen wird die Welt bald weiß.",
  "Die Fenster leuchten, warm und klein,\nin jedem wohnt ein Kerzenschein.\nUnd wer vorbeigeht, bleibt kurz stehn\nund freut sich, so ein Licht zu sehn.",
  "Es duftet süß nach Zimt und Stern,\nnach Mandeln und Orangenkern.\nWir backen, naschen, lachen viel –\ndas leere Blech ist unser Ziel.",
  "Der erste Frost malt übers Glas\nganz feine Farne, kühl und blass.\nWir hauchen drauf, ein kleiner Kreis –\ndahinter glitzert alles weiß.",
  "Zwei Mützen, Schal und kalte Nas',\nwir stapfen durch das Wintergras.\nDoch Hand in Hand, da friert man nicht –\nder Atem dampft, das Herz bleibt licht.",
  "Heut Nacht kam leis der Nikolaus,\ner schlich auf Socken durch das Haus.\nDie Stiefel standen blank und still –\njetzt steckt drin mehr, als man je will.",
  "Die Tage kurz, die Nächte lang,\nam Fenster schweigt der Vogelsang.\nDoch drinnen brennt ein warmes Licht,\nund mehr als das braucht's heute nicht.",
  "Ein Glühwein dampft, der Markt ist voll,\ndas Karussell dreht sich ganz toll.\nWir schieben uns durchs bunte Treiben\nund wollen noch ein bisschen bleiben.",
  "Es fällt der Schnee ganz ohne Laut\nauf Dach und Zaun, auf Baum und Kraut.\nDie Welt wird still und weich und weit –\nso klingt die stille Winterzeit.",
  "Wir schreiben Karten, Stück für Stück,\nan alle, die uns schenken Glück.\nEin paar Zeilen, warm und echt –\ndas macht den Advent erst richtig recht.",
  "Der Tannenduft zieht durch den Flur,\nein grüner Zweig, ein Hauch Natur.\nMit Kugeln rot und Bändern fein\nsoll's bald schon richtig festlich sein.",
  "Heut bleibt das Handy mal beiseit',\nwir nehmen uns ganz einfach Zeit:\nEin Spiel, ein Tee, ein Kerzenschein –\nso darf ein Winterabend sein.",
  "Am Dreizehnten, so sagt man gern,\nbringt Lucia Licht von nah und fern.\nDie dunkle Zeit wird hell gemacht –\nein Lichterkranz in tiefer Nacht.",
  "Was schenk ich dir? Ich grüble lang,\nmir wird beim Suchen fast schon bang.\nDoch eines weiß ich, und das ist klar:\nDas schönste Jahr war dieses Jahr.",
  "Die Kerzen brennen, eins, zwei, drei,\nschon ist der halbe Weg vorbei.\nNur noch ein Stückchen bis zum Fest,\ndas uns die Tage zählen lässt.",
  "Ein Schlitten saust den Berg hinab,\nmal schnell, mal langsam, mal ganz knapp.\nWir landen lachend tief im Schnee\nund rufen: Nochmal! Juchhe!",
  "Im Ofen knistert's leis und sacht,\ndie Decke wärmt die ganze Nacht.\nEin Buch, Kakao und du daneben –\nso ließe sich der Winter leben.",
  "Die Sterne stehn so klar und kalt\nhoch über Dach und Feld und Wald.\nUnd einer funkelt extra hell,\nals winkt er uns ganz kurz und schnell.",
  "Papier und Schere, Band und Schleif',\ndas Päckchen wird schon langsam reif.\nGanz heimlich, still, mit roten Ohr'n –\nsonst ist die Überraschung verlor'n.",
  "Heut gehn wir raus, der See ist Eis,\ndie Kufen glänzen silberweiß.\nWir drehen Kreise, Hand in Hand –\nund fallen sanft, ganz elegant.",
  "Heut ist der kürzeste der Tage,\ndoch schlimm ist das nicht, wie ich sage:\nAb morgen wird es Stück für Stück\nein bisschen heller – Licht kommt zurück.",
  "Die Taschen voll, der Zug ist spät,\ndoch egal, wohin die Reise geht:\nWer jetzt zu seinen Liebsten fährt,\ndem ist das Warten alles wert.",
  "Noch einmal schlafen, dann ist's so weit,\ndie Stube glänzt, der Baum bereit.\nWir legen leis die Päckchen hin\nund haben nur noch Fest im Sinn.",
  "Heut ist sie da, die Heil'ge Nacht,\ndie Kerzen sind am Baum entfacht.\nIch wünsch uns Frieden, Ruh und Licht\nund dass das Schönste nie zerbricht."
];
