// Datenschicht mit zwei Backends: "local" (Demo, localStorage) und "live" (Firebase).
// Gemeinsame Daten:  households/tandem/<name>/<id>
// Private Daten:     users/<uid>/<name>/<id>
// Einzel-Dokumente:  households/tandem/meta/<name>
import { firebaseConfig } from './firebase-config.js';

const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
export const isDemo = !firebaseConfig.apiKey || firebaseConfig.apiKey.indexOf('DEIN_') === 0;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ---------------- Demo / localStorage ----------------
function localBackend() {
  const subs = [];
  let who = localStorage.getItem('tandem:demoWho') || 'f';
  const scope = (priv) => priv ? 'user-' + who : 'shared';
  const key = (name, priv) => 'tandem:' + scope(priv) + ':' + name;
  const read = (name, priv) => { try { return JSON.parse(localStorage.getItem(key(name, priv)) || '{}'); } catch (e) { return {}; } };
  const write = (name, priv, obj) => {
    try { localStorage.setItem(key(name, priv), JSON.stringify(obj)); }
    catch (e) { alert('Der Speicher auf diesem Gerät ist voll. Bitte ein kleineres Foto wählen.'); throw e; }
    emit(name, priv);
  };
  const emit = (name, priv) => subs.filter(s => s.name === name && s.priv === priv).forEach(fire);
  const fire = (s) => {
    const o = read(s.name, s.priv);
    if (s.doc) s.cb(o.__doc || null);
    else s.cb(Object.keys(o).map(id => Object.assign({ id }, o[id])));
  };
  window.addEventListener('storage', () => subs.forEach(fire));
  return {
    mode: 'demo',
    getWho: () => who,
    setWho: (w) => { who = w; localStorage.setItem('tandem:demoWho', w); subs.filter(s => s.priv).forEach(fire); },
    watch(name, cb, opt = {}) { const s = { name, cb, priv: !!opt.priv }; subs.push(s); fire(s); },
    watchDoc(name, cb, opt = {}) { const s = { name, cb, priv: !!opt.priv, doc: true }; subs.push(s); fire(s); },
    async add(name, data, opt = {}) { const o = read(name, !!opt.priv); const id = uid(); o[id] = data; write(name, !!opt.priv, o); return id; },
    async set(name, id, data, opt = {}) { const o = read(name, !!opt.priv); o[id] = opt.merge ? Object.assign({}, o[id] || {}, data) : data; write(name, !!opt.priv, o); },
    async update(name, id, patch, opt = {}) { const o = read(name, !!opt.priv); o[id] = Object.assign({}, o[id] || {}, patch); write(name, !!opt.priv, o); },
    async remove(name, id, opt = {}) { const o = read(name, !!opt.priv); delete o[id]; write(name, !!opt.priv, o); },
    async setDoc(name, data, opt = {}) { const o = read(name, !!opt.priv); o.__doc = Object.assign({}, o.__doc || {}, data); write(name, !!opt.priv, o); }
  };
}

// ---------------- Live / Firebase ----------------
async function liveBackend(onAuth) {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  let db;
  try { db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); }
  catch (e) { db = F.getFirestore(app); }
  let user = null, who = null, unsubs = [];
  const col = (name, priv) => priv ? F.collection(db, 'users', user.uid, name) : F.collection(db, 'households', 'tandem', name);
  const metaRef = (name, priv) => priv ? F.doc(db, 'users', user.uid, 'meta', name) : F.doc(db, 'households', 'tandem', 'meta', name);
  const api = {
    mode: 'live',
    getWho: () => who,
    async setWho(w) { who = w; await F.setDoc(F.doc(db, 'users', user.uid), { who: w }, { merge: true }); },
    async login(email, pw) { await A.signInWithEmailAndPassword(auth, email, pw); },
    async logout() { unsubs.forEach(u => u()); unsubs = []; await A.signOut(auth); },
    watch(name, cb, opt = {}) { unsubs.push(F.onSnapshot(col(name, opt.priv), snap => cb(snap.docs.map(d => Object.assign({ id: d.id }, d.data()))), err => console.warn(name, err))); },
    watchDoc(name, cb, opt = {}) { unsubs.push(F.onSnapshot(metaRef(name, opt.priv), snap => cb(snap.exists() ? snap.data() : null), err => console.warn(name, err))); },
    async add(name, data, opt = {}) { const r = await F.addDoc(col(name, opt.priv), data); return r.id; },
    async set(name, id, data, opt = {}) { await F.setDoc(F.doc(col(name, opt.priv), id), data, { merge: !!opt.merge }); },
    async update(name, id, patch, opt = {}) { await F.setDoc(F.doc(col(name, opt.priv), id), patch, { merge: true }); },
    async remove(name, id, opt = {}) { await F.deleteDoc(F.doc(col(name, opt.priv), id)); },
    async setDoc(name, data, opt = {}) { await F.setDoc(metaRef(name, opt.priv), data, { merge: true }); }
  };
  A.onAuthStateChanged(auth, async (u) => {
    user = u; who = null;
    if (u) { try { const p = await F.getDoc(F.doc(db, 'users', u.uid)); who = p.exists() ? (p.data().who || null) : null; } catch (e) { console.warn(e); } }
    const KNOWN = { 'IpfJkNVQN6ZeOw9O3J37KJHlzkb2': 'f', 'G28hfCG0FxXkeBxKuuRtoP3wqL62': 'p' };
    if (u && KNOWN[u.uid] && who !== KNOWN[u.uid]) { who = KNOWN[u.uid]; try { await F.setDoc(F.doc(db, 'users', u.uid), { who }, { merge: true }); } catch (e) { console.warn(e); } }
    onAuth(!!u, who);
  });
  return api;
}

export async function initStore(onAuth) {
  if (isDemo) { const b = localBackend(); setTimeout(() => onAuth(true, b.getWho()), 0); return b; }
  return liveBackend(onAuth);
}
