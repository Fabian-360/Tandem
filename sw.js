// Tandem Service Worker – speichert die App für die Offline-Nutzung.
// Nach Änderungen an der App die Versionsnummer erhöhen.
const VERSION = 'tandem-v6';
const FILES = [
  './',
  'advent.jpg',
  'd-einheit.jpg',
  'd-mai.jpg',
  'd-martin.jpg',
  'd-neujahr.jpg',
  'd-nikolaus.jpg',
  'd-pfingsten.jpg',
  'd-reformation.jpg',
  'd-silvester.jpg',
  'd-sommer.jpg',
  'd-valentin.jpg',
  'geburtstag-fabian.jpg',
  'geburtstag-lena.jpg',
  'jahrestag.jpg',
  'kerze-an.jpg',
  'kerze-aus.jpg',
  'ostern.jpg',
  'rahmen.png',
  'tafel.jpg',
  'tile-date.jpg',
  'tile-erinn.jpg',
  'tile-koch.jpg',
  'tile-notiz.jpg',
  'top-blau.jpg',
  'top-cafe.jpg',
  'top-garten.jpg',
  'top-gasse.jpg',
  'top-hafen.jpg',
  'top-nuernberg.jpg',
  'top-seerosen.jpg',
  'top-sonnenblumen.jpg',
  'top-sternennacht.jpg',
  'top-wanderer.jpg',
  'tuer-innen.jpg',
  'tuer1.jpg',
  'tuer2.jpg',
  'tuer3.jpg',
  'weihnachten.jpg',
  'app.css',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'index.html',
  'app.js',
  'firebase-config.js',
  'logic.js',
  'store.js',
  'manifest.webmanifest',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'tandem-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Firebase/Firestore nie cachen – das macht Firebase selbst
  if (/firestore|googleapis\.com\/identitytoolkit|securetoken|firebaseinstallations/.test(u.href)) return;
  if (u.host === 'fonts.googleapis.com' || u.host === 'fonts.gstatic.com' || u.host === 'www.gstatic.com') {
    e.respondWith(caches.open('tandem-fonts').then(async c => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }));
    return;
  }
  if (u.origin === location.origin) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() => caches.match('./index.html'))));
  }
});
