// ============================================================
// FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAgpZQE7Nyik7q3Gff-KoY4YbbbL25oawE",
  authDomain: "moppyhome-cfc28.firebaseapp.com",
  projectId: "moppyhome-cfc28",
  storageBucket: "moppyhome-cfc28.firebasestorage.app",
  messagingSenderId: "821029349668",
  appId: "1:821029349668:web:7f1206b2079f59df4eabb1"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// ============================================================
// PROFILS UTILISATEURS CONNUS
// Associe un email à un profil affiché dans l'app
// ============================================================
const USER_PROFILES = {
  // Remplis avec vos vrais emails après création des comptes
  // ex: 'vadim@gmail.com': { name: 'Vadim', avatar: 'V', color: '#2f54eb' }
  'vadim': { name: 'Vadim',   avatar: 'V', color: '#2f54eb' },
  'lorinda': { name: 'Lorinda', avatar: 'L', color: '#eb2f96' },
};

function getProfile(email) {
  if (!email) return { name: '?', avatar: '?', color: '#888' };
  const key = Object.keys(USER_PROFILES).find(k => email.toLowerCase().includes(k));
  return key ? USER_PROFILES[key] : { name: email.split('@')[0], avatar: email[0].toUpperCase(), color: '#2f54eb' };
}

// ============================================================
// FRÉQUENCES
// ============================================================
const FREQ_LABELS = { J:'Quotidien', S:'Hebdo', M:'Mensuel', T:'Trimestriel', A:'Annuel' };
const FREQ_DAYS   = { J:1, S:7, M:30, T:90, A:365 };

// ============================================================
// DONNÉES PAR DÉFAUT (chargées au 1er lancement)
// ============================================================
const DEFAULT_DATA = [
  { id:'cuisine', name:'Cuisine', icon:'🍳', elements:[
    { id:'frigo', name:'Frigo', tasks:[
      { id:'t1',  name:'Nettoyer les clayettes et bacs', freq:'M', assignee:'both' },
      { id:'t2',  name:'Vider et dégivrer', freq:'T', assignee:'both' },
      { id:'t3',  name:'Nettoyer les joints', freq:'M', assignee:'both' },
      { id:'t4',  name:'Essuyer les parois intérieures', freq:'M', assignee:'both' },
      { id:'t5',  name:'Nettoyer la façade extérieure', freq:'S', assignee:'both' },
      { id:'t6',  name:'Purger les condensats', freq:'T', assignee:'both' },
      { id:'t7',  name:'Vérifier dates limite produits', freq:'S', assignee:'both' },
    ]},
    { id:'congelateur', name:'Congélateur', tasks:[
      { id:'t8',  name:'Dégivrer', freq:'T', assignee:'both' },
      { id:'t9',  name:'Nettoyer les parois', freq:'T', assignee:'both' },
      { id:'t10', name:'Vérifier contenu / étiquettes', freq:'M', assignee:'both' },
      { id:'t11', name:'Nettoyer la façade', freq:'S', assignee:'both' },
    ]},
    { id:'four', name:'Four', tasks:[
      { id:'t12', name:'Nettoyer le fond et les grilles', freq:'M', assignee:'both' },
      { id:'t13', name:'Dégraisser la porte vitrée', freq:'S', assignee:'both' },
      { id:'t14', name:'Nettoyer le joint de porte', freq:'M', assignee:'both' },
      { id:'t15', name:'Pyrolyse / nettoyage vapeur', freq:'T', assignee:'both' },
    ]},
    { id:'plaques', name:'Plaques / induction', tasks:[
      { id:'t16', name:'Essuyer après chaque usage', freq:'J', assignee:'both' },
      { id:'t17', name:'Détartrer / dégraisser en profondeur', freq:'S', assignee:'both' },
    ]},
    { id:'hotte', name:'Hotte', tasks:[
      { id:'t18', name:'Nettoyer les filtres à graisse', freq:'M', assignee:'both' },
      { id:'t19', name:'Remplacer filtre à charbon', freq:'A', assignee:'both' },
      { id:'t20', name:'Nettoyer la façade extérieure', freq:'S', assignee:'both' },
    ]},
    { id:'microondes', name:'Micro-ondes', tasks:[
      { id:'t21', name:"Nettoyer l'intérieur", freq:'S', assignee:'both' },
      { id:'t22', name:'Nettoyer le plateau tournant', freq:'S', assignee:'both' },
    ]},
    { id:'lavevaisselle', name:'Lave-vaisselle', tasks:[
      { id:'t23', name:'Nettoyer le filtre fond de cuve', freq:'M', assignee:'both' },
      { id:'t24', name:'Détartrage (produit spécial)', freq:'M', assignee:'both' },
      { id:'t25', name:'Nettoyer les joints de porte', freq:'M', assignee:'both' },
    ]},
    { id:'evier', name:'Évier et robinetterie', tasks:[
      { id:'t26', name:"Rincer et nettoyer l'évier", freq:'J', assignee:'both' },
      { id:'t27', name:'Détartrer robinet et bec', freq:'M', assignee:'both' },
      { id:'t28', name:'Nettoyer la crépine / bonde', freq:'S', assignee:'both' },
    ]},
    { id:'plan', name:'Plan de travail', tasks:[
      { id:'t29', name:'Essuyer après cuisine', freq:'J', assignee:'both' },
      { id:'t30', name:'Désinfecter en profondeur', freq:'S', assignee:'both' },
    ]},
    { id:'solcuisine', name:'Sol', tasks:[
      { id:'t31', name:'Balayer / aspirer', freq:'J', assignee:'both' },
      { id:'t32', name:'Laver le sol', freq:'S', assignee:'both' },
    ]},
  ]},
  { id:'sdb', name:'Salle de bain', icon:'🚿', elements:[
    { id:'douche', name:'Douche / baignoire', tasks:[
      { id:'t33', name:'Rincer après usage', freq:'J', assignee:'both' },
      { id:'t34', name:'Nettoyer et désinfecter', freq:'S', assignee:'both' },
      { id:'t35', name:'Détartrer les parois', freq:'M', assignee:'both' },
      { id:'t36', name:'Nettoyer la bonde / siphon', freq:'M', assignee:'both' },
      { id:'t37', name:'Traiter les joints (anti-moisissure)', freq:'T', assignee:'both' },
    ]},
    { id:'lavasdb', name:'Lavabo', tasks:[
      { id:'t38', name:'Rincer et essuyer', freq:'J', assignee:'both' },
      { id:'t39', name:'Nettoyer et désinfecter', freq:'S', assignee:'both' },
      { id:'t40', name:'Détartrer robinet et bec', freq:'M', assignee:'both' },
    ]},
    { id:'toilettes', name:'Toilettes', tasks:[
      { id:'t41', name:'Nettoyer cuvette et siège', freq:'J', assignee:'both' },
      { id:'t42', name:'Détartrer la cuvette', freq:'S', assignee:'both' },
      { id:'t43', name:"Nettoyer l'abattant", freq:'S', assignee:'both' },
      { id:'t44', name:'Nettoyer derrière la cuvette', freq:'S', assignee:'both' },
    ]},
    { id:'miroirsdb', name:'Miroir', tasks:[
      { id:'t45', name:'Nettoyer les traces de vapeur', freq:'S', assignee:'both' },
    ]},
    { id:'solsdb', name:'Sol', tasks:[
      { id:'t46', name:'Balayer / aspirer', freq:'S', assignee:'both' },
      { id:'t47', name:'Laver et désinfecter', freq:'S', assignee:'both' },
    ]},
  ]},
  { id:'chambre', name:'Chambre', icon:'🛏️', elements:[
    { id:'literie', name:'Literie', tasks:[
      { id:'t48', name:'Faire le lit', freq:'J', assignee:'both' },
      { id:'t49', name:'Changer les draps', freq:'S', assignee:'both' },
      { id:'t50', name:'Laver oreillers', freq:'M', assignee:'both' },
      { id:'t51', name:'Laver couette', freq:'T', assignee:'both' },
      { id:'t52', name:'Retourner le matelas', freq:'T', assignee:'both' },
      { id:'t53', name:'Aspirer le matelas', freq:'M', assignee:'both' },
    ]},
    { id:'mobilier', name:'Mobilier', tasks:[
      { id:'t54', name:'Dépoussiérer surfaces', freq:'S', assignee:'both' },
      { id:'t55', name:'Nettoyer le dessous du lit', freq:'M', assignee:'both' },
    ]},
    { id:'solchambre', name:'Sol', tasks:[
      { id:'t56', name:'Aspirer', freq:'S', assignee:'both' },
      { id:'t57', name:'Passer la serpillière', freq:'S', assignee:'both' },
    ]},
  ]},
  { id:'salon', name:'Salon / séjour', icon:'🛋️', elements:[
    { id:'canape', name:'Canapé', tasks:[
      { id:'t58', name:'Dépoussiérer et aspirer', freq:'S', assignee:'both' },
      { id:'t59', name:'Laver les housses', freq:'M', assignee:'both' },
      { id:'t60', name:'Retourner les coussins', freq:'S', assignee:'both' },
    ]},
    { id:'tv', name:'TV et électronique', tasks:[
      { id:'t61', name:'Dépoussiérer les écrans', freq:'S', assignee:'both' },
      { id:'t62', name:'Nettoyer télécommandes', freq:'M', assignee:'both' },
    ]},
    { id:'solsalon', name:'Sol', tasks:[
      { id:'t63', name:'Aspirer', freq:'S', assignee:'both' },
      { id:'t64', name:'Laver le sol', freq:'S', assignee:'both' },
    ]},
  ]},
  { id:'entree', name:'Entrée / couloir', icon:'🚪', elements:[
    { id:'porteentree', name:"Porte d'entrée", tasks:[
      { id:'t65', name:'Nettoyer la poignée (désinfecter)', freq:'S', assignee:'both' },
      { id:'t66', name:'Nettoyer le seuil', freq:'S', assignee:'both' },
    ]},
    { id:'solentree', name:'Sol', tasks:[
      { id:'t67', name:'Aspirer / balayer', freq:'J', assignee:'both' },
      { id:'t68', name:'Laver', freq:'S', assignee:'both' },
    ]},
  ]},
  { id:'buanderie', name:'Buanderie / cellier', icon:'🫧', elements:[
    { id:'lavelinges', name:'Lave-linge', tasks:[
      { id:'t69', name:'Nettoyer le bac à lessive', freq:'M', assignee:'both' },
      { id:'t70', name:'Nettoyer le filtre de pompe', freq:'M', assignee:'both' },
      { id:'t71', name:'Lancer cycle nettoyage à vide', freq:'M', assignee:'both' },
      { id:'t72', name:'Nettoyer les joints de hublot', freq:'M', assignee:'both' },
    ]},
    { id:'sechelinges', name:'Sèche-linge', tasks:[
      { id:'t73', name:'Vider le filtre à charpie', freq:'J', assignee:'both' },
      { id:'t74', name:'Nettoyer le condenseur', freq:'M', assignee:'both' },
      { id:'t75', name:"Vider le bac à eau", freq:'J', assignee:'both' },
    ]},
  ]},
  { id:'exterieur', name:'Extérieur / terrasse', icon:'🌿', elements:[
    { id:'terrasse', name:'Terrasse / balcon', tasks:[
      { id:'t76', name:'Balayer', freq:'S', assignee:'both' },
      { id:'t77', name:'Laver le sol', freq:'M', assignee:'both' },
      { id:'t78', name:'Nettoyer les chaises et tables', freq:'M', assignee:'both' },
    ]},
    { id:'jardin', name:'Jardin / abords', tasks:[
      { id:'t79', name:'Tondre', freq:'S', assignee:'both' },
      { id:'t80', name:'Désherber', freq:'S', assignee:'both' },
      { id:'t81', name:'Tailler haies', freq:'T', assignee:'both' },
    ]},
  ]},
  { id:'transversal', name:'Maison entière', icon:'🏠', elements:[
    { id:'poussiere', name:'Poussière générale', tasks:[
      { id:'t82', name:'Dépoussiérer radiateurs', freq:'M', assignee:'both' },
      { id:'t83', name:'Dépoussiérer plinthes', freq:'M', assignee:'both' },
      { id:'t84', name:'Nettoyer les bouches de VMC', freq:'T', assignee:'both' },
    ]},
    { id:'poubelles', name:'Poubelles', tasks:[
      { id:'t85', name:'Vider les poubelles', freq:'J', assignee:'both' },
      { id:'t86', name:'Nettoyer et désinfecter les poubelles', freq:'S', assignee:'both' },
      { id:'t87', name:'Sortir les bacs (collecte)', freq:'S', assignee:'both' },
    ]},
    { id:'securite', name:'Sécurité', tasks:[
      { id:'t88', name:'Tester détecteur fumée', freq:'M', assignee:'both' },
      { id:'t89', name:'Remplacer piles détecteurs', freq:'A', assignee:'both' },
      { id:'t90', name:'Contrôle chaudière annuel', freq:'A', assignee:'both' },
    ]},
  ]},
];

// ============================================================
// STATE LOCAL (UI uniquement — données viennent de Firestore)
// ============================================================
let currentUser = null;   // objet Firebase Auth
let pieces      = [];     // données locales (miroir Firestore)
let checks      = {};     // miroir Firestore checks
let unsubPieces = null;   // listener Firestore pièces
let unsubChecks = null;   // listener Firestore checks

let ui = {
  activeFilter: '',
  searchQ: '',
  freqFilter: '',
  viewMode: 'todo',   // 'todo' = à faire | 'all' = tout | 'upcoming' = à venir
  collapsed: {},
};

// ============================================================
// AUTH — CONNEXION / INSCRIPTION
// ============================================================
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    initApp();
  } else {
    currentUser = null;
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
    unsubscribeAll();
  }
});

async function login() {
  const email = document.getElementById('authEmail').value.trim();
  const pass  = document.getElementById('authPassword').value;
  setAuthError('');
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch(e) {
    setAuthError(friendlyAuthError(e.code));
  }
}

async function register() {
  const email = document.getElementById('authEmail').value.trim();
  const pass  = document.getElementById('authPassword').value;
  setAuthError('');
  if (pass.length < 6) { setAuthError('Mot de passe : 6 caractères minimum'); return; }
  try {
    await auth.createUserWithEmailAndPassword(email, pass);
  } catch(e) {
    setAuthError(friendlyAuthError(e.code));
  }
}

async function logout() {
  await auth.signOut();
}

function setAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.classList.toggle('hidden', !msg);
}

function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found': 'Aucun compte avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/too-many-requests': 'Trop de tentatives. Réessaie plus tard.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  };
  return map[code] || 'Erreur : ' + code;
}

function unsubscribeAll() {
  if (unsubPieces) { unsubPieces(); unsubPieces = null; }
  if (unsubChecks) { unsubChecks(); unsubChecks = null; }
}

// ============================================================
// FIRESTORE — RÉFÉRENCE UNIQUE
// ============================================================
const HOUSEHOLD = () => db.collection('households').doc('moppyhome');
const PIECES    = () => HOUSEHOLD().collection('pieces');
const CHECKS    = () => HOUSEHOLD().collection('checks');

// ============================================================
// INIT APP
// ============================================================
async function initApp() {
  updateUserUI();

  // Initialiser les données si premier lancement
  const snap = await HOUSEHOLD().get();
  if (!snap.exists) {
    await HOUSEHOLD().set({ createdAt: Date.now() });
    const batch = db.batch();
    DEFAULT_DATA.forEach((piece, i) => {
      batch.set(PIECES().doc(piece.id), { ...piece, order: i });
    });
    await batch.commit();
    // Cocher toutes les tâches par défaut
    await checkAllTasksByDefault();
  }

  // Écoute temps réel — pièces
  unsubPieces = PIECES().onSnapshot(snap => {
    pieces = snap.docs.map(d => d.data()).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    console.log('[onSnapshot] pièces reçues:', pieces.length, pieces.map(p => p.name + '(' + (p.elements||[]).length + 'el)'));
    buildFilters();
    buildViewModeBar();
    render();
  }, err => {
    console.error('[onSnapshot] erreur pièces:', err);
    toast('Erreur synchro : ' + err.message);
  });

  // Écoute temps réel — checks
  unsubChecks = CHECKS().onSnapshot(snap => {
    checks = {};
    snap.docs.forEach(d => { checks[d.id] = d.data(); });
    render();
  });

  // Events UI
  document.getElementById('searchInput').addEventListener('input', e => {
    ui.searchQ = e.target.value; render();
  });
  document.getElementById('freqSelect').addEventListener('change', e => {
    ui.freqFilter = e.target.value; render();
  });

  buildViewModeBar();

  // Notifications
  initNotifications();

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

async function savePiece(piece) {
  const { _ref, ...data } = piece;
  await PIECES().doc(piece.id).set(data, { merge: false });
  // Mettre à jour le cache local immédiatement
  const idx = pieces.findIndex(p => p.id === piece.id);
  if (idx !== -1) {
    pieces[idx] = { ...pieces[idx], ...data };
  } else {
    pieces.push({ ...data });
  }
  buildFilters();
  buildViewModeBar();
  render();
}

async function updatePieceElements(pieceId, elements) {
  try {
    await PIECES().doc(pieceId).update({ elements });
    // Mettre à jour le cache local immédiatement sans attendre onSnapshot
    const idx = pieces.findIndex(p => p.id === pieceId);
    if (idx !== -1) {
      pieces[idx] = { ...pieces[idx], elements };
      render();
    }
  } catch(e) {
    console.error('[Firestore] updatePieceElements ERREUR:', e.code, e.message);
    toast('Erreur : ' + e.message);
    throw e;
  }
}

async function deletePieceDoc(pieceId) {
  await PIECES().doc(pieceId).delete();
}

async function saveCheck(taskId, data) {
  if (data === null) {
    await CHECKS().doc(taskId).delete();
  } else {
    await CHECKS().doc(taskId).set(data);
  }
}

// ============================================================
// INIT — COCHER TOUTES LES TÂCHES PAR DÉFAUT
// ============================================================
async function checkAllTasksByDefault() {
  const batch = [];
  const now = Date.now();
  DEFAULT_DATA.forEach(piece => {
    piece.elements.forEach(el => {
      el.tasks.forEach(task => {
        batch.push(CHECKS().doc(task.id).set({
          doneAt: now,
          doneBy: 'system',
          doneByName: 'Initialisation',
        }));
      });
    });
  });
  await Promise.all(batch);
}

// ============================================================
// ACTIONS
// ============================================================
async function markTaskDone(pieceId, elId, taskId) {
  const piece   = pieces.find(p => p.id === pieceId);
  const el      = piece?.elements.find(e => e.id === elId);
  const task    = el?.tasks.find(t => t.id === taskId);
  const profile = getProfile(currentUser.email);
  const now     = Date.now();

  // Feedback visuel immédiat
  const row = document.querySelector(`[data-task-id="${taskId}"]`);
  if (row) {
    row.classList.add('task-completing');
    setTimeout(() => row.classList.remove('task-completing'), 600);
  }
  toast('✓ Fait !');

  // Enregistrer le check (repart toujours de maintenant)
  await saveCheck(taskId, {
    doneAt:     now,
    doneBy:     currentUser.email,
    doneByName: profile.name,
  });

  if (!task) return;

  // Notif croisée si mauvais assigné
  const userKey = currentUser.email.toLowerCase().includes('lorinda') ? 'L' : 'V';
  if (task.assignee !== 'both' && task.assignee !== userKey) {
    const msg = task.assignee === 'V'
      ? `🍫 ${profile.name} a fait ta tâche "${task.name}" — n'oublie pas les chocolats !`
      : `💐 ${profile.name} a fait ta tâche "${task.name}" — pense à le remercier !`;
    await db.collection('crossNotifications').add({
      message:    msg,
      assignee:   task.assignee,
      taskName:   task.name,
      doneBy:     currentUser.email,
      doneByName: profile.name,
      createdAt:  now,
      sent:       false,
    });
  }

  // Événement calendrier pour tâches hebdo et +
  if (task.freq !== 'J') {
    await createCalendarEvent(piece, el, task);
  }

  // Vérifier si toutes les tâches sont maintenant à jour → feux d'artifice
  setTimeout(() => checkAllDone(), 500);
}

// Gardé pour compatibilité (plus utilisé en tap normal)
async function toggleTask(pieceId, elId, taskId) {
  await markTaskDone(pieceId, elId, taskId);
}

async function toggleCollapse(id) {
  // true = fermé, undefined/false = ouvert
  ui.collapsed[id] = !ui.collapsed[id];
  render();
}

function setFilter(id) {
  ui.activeFilter = id;
  buildFilters(); render();
}

async function deletePiece(pieceId) {
  await deletePieceDoc(pieceId);
  if (ui.activeFilter === pieceId) ui.activeFilter = '';
  buildFilters(); toast('Pièce supprimée');
}

async function deleteElement(pieceId, elId) {
  const piece = pieces.find(p => p.id === pieceId);
  if (!piece) return;
  const newElements = (piece.elements||[]).filter(e => e.id !== elId);
  await updatePieceElements(pieceId, newElements);
  toast('Élément supprimé');
}

async function deleteTask(pieceId, elId, taskId) {
  const piece = pieces.find(p => p.id === pieceId);
  if (!piece) return;
  const newElements = (piece.elements||[]).map(el => {
    if (el.id !== elId) return el;
    return { ...el, tasks: (el.tasks||[]).filter(t => t.id !== taskId) };
  });
  await updatePieceElements(pieceId, newElements);
  await saveCheck(taskId, null);
  toast('Tâche supprimée');
}

// ============================================================
// UTILS
// ============================================================
function uid() { return '_' + Math.random().toString(36).substr(2, 9); }
function daysSince(ts) { if (!ts) return null; return Math.floor((Date.now() - ts) / 86400000); }

// Une tâche est "à faire" si pas de check OU si le check est expiré
function isTodo(task) {
  const c = checks[task.id];
  if (!c) return true;
  return daysSince(c.doneAt) >= FREQ_DAYS[task.freq];
}

// Jours restants avant que la tâche soit à refaire
function daysUntilDue(task) {
  const c = checks[task.id];
  if (!c) return 0;
  const elapsed = daysSince(c.doneAt);
  return Math.max(0, FREQ_DAYS[task.freq] - elapsed);
}

// Depuis combien de temps la tâche est à faire
function todoSinceText(task) {
  const c = checks[task.id];
  if (!c) return "À faire (jamais faite)";
  const overdue = daysSince(c.doneAt) - FREQ_DAYS[task.freq];
  if (overdue <= 0) return '';
  if (overdue === 0) return "À faire depuis aujourd'hui";
  if (overdue === 1) return 'À faire depuis hier';
  return `À faire depuis ${overdue} jour${overdue > 1 ? 's' : ''}`;
}

// Texte "fait il y a X" pour le mode "tout"
function doneText(task) {
  const c = checks[task.id];
  if (!c) return '';
  const days = daysSince(c.doneAt);
  const by = c.doneByName || c.doneBy;
  if (days === 0) return `Fait aujourd'hui par ${by}`;
  if (days === 1) return `Fait hier par ${by}`;
  return `Fait il y a ${days}j par ${by}`;
}

// Texte "dans X jours" pour le mode "à venir"
function upcomingText(task) {
  const days = daysUntilDue(task);
  if (days === 0) return "À faire aujourd'hui";
  if (days === 1) return "Dans 1 jour";
  return `Dans ${days} jours`;
}

// Vérifier si toutes les tâches sont faites → feux d'artifice
function checkAllDone() {
  let hasTodo = false;
  pieces.forEach(piece => {
    (piece.elements||[]).forEach(el => {
      (el.tasks||[]).forEach(task => {
        if (isTodo(task)) hasTodo = true;
      });
    });
  });
  if (!hasTodo) showCelebration();
}

// ============================================================
// RENDER
// ============================================================
function render() {
  const q         = ui.searchQ.toLowerCase();
  const freqF     = ui.freqFilter;
  const activeRoom = ui.activeFilter;
  const mode      = ui.viewMode; // 'todo' | 'all' | 'upcoming'

  // Collecter toutes les tâches à afficher
  let allTasks = [];
  pieces.forEach(piece => {
    if (activeRoom && activeRoom !== piece.id) return;
    (piece.elements||[]).forEach(el => {
      (el.tasks||[]).forEach(task => {
        if (freqF && task.freq !== freqF) return;
        if (q && !task.name.toLowerCase().includes(q) && !el.name.toLowerCase().includes(q) && !piece.name.toLowerCase().includes(q)) return;
        allTasks.push({ piece, el, task });
      });
    });
  });

  const totalCount = allTasks.length;
  const doneCount  = allTasks.filter(({task}) => !isTodo(task)).length;
  const todoCount  = allTasks.filter(({task}) => isTodo(task)).length;

  // Filtrer selon le mode
  let filtered = allTasks;
  if (mode === 'todo') {
    filtered = allTasks.filter(({task}) => isTodo(task));
    // Trier par ancienneté (plus longtemps à faire en premier)
    filtered.sort((a, b) => {
      const daysA = daysSince(checks[a.task.id]?.doneAt) ?? 9999;
      const daysB = daysSince(checks[b.task.id]?.doneAt) ?? 9999;
      return daysB - daysA;
    });
  } else if (mode === 'upcoming') {
    filtered = allTasks.filter(({task}) => !isTodo(task));
    // Trier par échéance la plus proche en premier
    filtered.sort((a, b) => daysUntilDue(a.task) - daysUntilDue(b.task));
  }

  // Mode "tout" → grouper par pièce comme avant
  // Modes 'todo' et 'upcoming' → liste plate triée
  let html = '';

  if (mode === 'all') {
    // Grouper par pièce
    const byPiece = {};
    filtered.forEach(({piece, el, task}) => {
      if (!byPiece[piece.id]) byPiece[piece.id] = { piece, els: {} };
      if (!byPiece[piece.id].els[el.id]) byPiece[piece.id].els[el.id] = { el, tasks: [] };
      byPiece[piece.id].els[el.id].tasks.push(task);
    });

    Object.values(byPiece).forEach(({ piece, els }) => {
      let pieceHtml = '';
      let pieceTotal = 0, pieceDone = 0;

      Object.values(els).forEach(({ el, tasks }) => {
        let elHtml = '';
        tasks.forEach(task => {
          const todo = isTodo(task);
          pieceTotal++;
          if (!todo) pieceDone++;
          elHtml += renderTaskRow(piece, el, task, 'all');
        });
        pieceHtml += `<div class="element-group">
          <div class="element-label">
            <span class="element-label-text">${el.name}</span>
            <div class="element-actions">
              <button class="btn-icon sm" onclick="openAddTask('${piece.id}','${el.id}')">+ tâche</button>
              <button class="btn-icon danger" onclick="deleteElement('${piece.id}','${el.id}')">✕</button>
            </div>
          </div>
          ${elHtml}
        </div>`;
      });

      // Ajouter éléments sans tâches visibles
      (piece.elements||[]).forEach(el => {
        if (byPiece[piece.id]?.els[el.id]) return;
        pieceHtml += `<div class="element-group">
          <div class="element-label">
            <span class="element-label-text">${el.name}</span>
            <div class="element-actions">
              <button class="btn-icon sm" onclick="openAddTask('${piece.id}','${el.id}')">+ tâche</button>
              <button class="btn-icon danger" onclick="deleteElement('${piece.id}','${el.id}')">✕</button>
            </div>
          </div>
          <div style="padding:0.5rem 1rem;font-size:0.75rem;color:var(--text3)">Aucune tâche</div>
        </div>`;
      });

      const pct    = pieceTotal > 0 ? Math.round((pieceDone / pieceTotal) * 100) : 0;
      const isOpen = !ui.collapsed[piece.id];
      html += `<div class="piece-card">
        <div class="piece-header" onclick="toggleCollapse('${piece.id}')">
          <div class="piece-icon-wrap">${piece.icon}</div>
          <span class="piece-name">${piece.name}</span>
          <div class="piece-actions">
            <span class="piece-count">${pieceDone}/${pieceTotal}</span>
            <button class="btn-icon" onclick="event.stopPropagation();openAddElement('${piece.id}')">+</button>
            <button class="btn-icon danger" onclick="event.stopPropagation();deletePiece('${piece.id}')">✕</button>
            <span class="piece-chevron${isOpen ? ' open' : ''}">⌄</span>
          </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${isOpen ? pieceHtml : ''}
      </div>`;
    });

  } else if (mode === 'todo' && filtered.length === 0) {
    // Tout est fait !
    html = renderAllDoneScreen();

  } else if (mode === 'all' && filtered.length === 0) {
    // Pièce sélectionnée mais sans tâches — afficher quand même la structure
    const piece = pieces.find(p => p.id === activeRoom);
    if (piece) {
      let pieceHtml = '';
      (piece.elements||[]).forEach(el => {
        pieceHtml += `<div class="element-group">
          <div class="element-label">
            <span class="element-label-text">${el.name}</span>
            <div class="element-actions">
              <button class="btn-icon sm" onclick="openAddTask('${piece.id}','${el.id}')">+ tâche</button>
              <button class="btn-icon danger" onclick="deleteElement('${piece.id}','${el.id}')">✕</button>
            </div>
          </div>
          <div style="padding:0.5rem 1rem;font-size:0.75rem;color:var(--text3)">Aucune tâche</div>
        </div>`;
      });
      html = `<div class="piece-card">
        <div class="piece-header" onclick="toggleCollapse('${piece.id}')">
          <div class="piece-icon-wrap">${piece.icon}</div>
          <span class="piece-name">${piece.name}</span>
          <div class="piece-actions">
            <span class="piece-count">0/0</span>
            <button class="btn-icon" onclick="event.stopPropagation();openAddElement('${piece.id}')">+</button>
            <button class="btn-icon danger" onclick="event.stopPropagation();deletePiece('${piece.id}')">✕</button>
            <span class="piece-chevron open">⌄</span>
          </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
        ${pieceHtml || '<div style="padding:1rem;font-size:0.8rem;color:var(--text3)">Aucun élément — clique + pour en ajouter</div>'}
      </div>`;
    } else {
      html = '<div class="empty">Aucune tâche trouvée</div>';
    }

  } else {
    // Liste plate pour todo et upcoming
    filtered.forEach(({piece, el, task}) => {
      html += renderTaskRow(piece, el, task, mode);
    });
  }

  const scrollY = window.scrollY;
  document.getElementById('root').innerHTML = html || '<div class="empty">Aucune tâche trouvée</div>';
  document.getElementById('statTotal').textContent = totalCount;
  document.getElementById('statDone').textContent  = doneCount;
  document.getElementById('statLate').textContent  = todoCount;
  window.scrollTo(0, scrollY);
}

function renderTaskRow(piece, el, task, mode) {
  const todo           = isTodo(task);
  const assigneeClass  = task.assignee === 'both' ? 'assignee-both' : `assignee-${task.assignee}`;
  const assigneeLabel  = task.assignee === 'both' ? '★' : task.assignee;
  let meta = '';
  if (mode === 'todo')     meta = todoSinceText(task);
  else if (mode === 'upcoming') meta = upcomingText(task);
  else meta = doneText(task);

  return `<div class="task-row${todo ? '' : ' done'}" data-task-id="${task.id}" onclick="markTaskDone('${piece.id}','${el.id}','${task.id}')">
    <div class="task-check"><span class="task-check-icon">✓</span></div>
    <div class="task-info">
      <div class="task-name">${task.name}</div>
      ${meta ? `<div class="task-meta">${meta}</div>` : ''}
      <div class="task-piece-label">${piece.name} · ${el.name}</div>
    </div>
    <div class="task-right">
      <span class="freq-badge freq-${task.freq}">${FREQ_LABELS[task.freq]}</span>
      <span class="assignee-badge ${assigneeClass}">${assigneeLabel}</span>
      <button class="btn-icon" onclick="event.stopPropagation();openEditTask('${piece.id}','${el.id}','${task.id}')" title="Modifier">✎</button>
      <button class="btn-icon danger" onclick="event.stopPropagation();deleteTask('${piece.id}','${el.id}','${task.id}')" title="Supprimer">✕</button>
    </div>
  </div>`;
}

function renderAllDoneScreen() {
  return `<div class="all-done-screen">
    <div class="fireworks" id="fireworks"></div>
    <div class="all-done-emoji">🎉</div>
    <h2 class="all-done-title">Tout est à jour !</h2>
    <p class="all-done-sub">Bravo, vous avez tout géré. Profitez de votre soirée !</p>
    <button class="btn btn-primary" style="max-width:280px;margin:0 auto" onclick="setViewMode('upcoming')">
      📅 À faire prochainement
    </button>
  </div>`;
}

function buildFilters() {
  const bar = document.getElementById('filterBar');
  // Filtres de pièces
  let html = `<button class="filter-pill${!ui.activeFilter ? ' active' : ''}" onclick="setFilter('')">Tout</button>`;
  pieces.forEach(p => {
    html += `<button class="filter-pill${ui.activeFilter === p.id ? ' active' : ''}" onclick="setFilter('${p.id}')">${p.name}</button>`;
  });
  bar.innerHTML = html;
}

function setViewMode(mode) {
  ui.viewMode = mode;
  // Mettre à jour les boutons de vue
  document.querySelectorAll('.view-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  render();
}

function buildViewModeBar() {
  const bar = document.getElementById('viewModeBar');
  if (!bar) return;
  // Ne regénérer que si nécessaire (évite les flashs)
  const current = bar.querySelector('.active')?.dataset?.mode;
  if (current === ui.viewMode && bar.children.length === 3) return;
  bar.innerHTML = `
    <button class="view-btn${ui.viewMode === 'todo' ? ' active' : ''}" data-mode="todo" onclick="setViewMode('todo')">À faire</button>
    <button class="view-btn${ui.viewMode === 'all' ? ' active' : ''}" data-mode="all" onclick="setViewMode('all')">Tout</button>
    <button class="view-btn${ui.viewMode === 'upcoming' ? ' active' : ''}" data-mode="upcoming" onclick="setViewMode('upcoming')">À venir</button>
  `;
}

function updateUserUI() {
  if (!currentUser) return;
  const profile = getProfile(currentUser.email);
  const avatar = document.getElementById('userAvatar');
  const name   = document.getElementById('userName');
  avatar.textContent = profile.avatar;
  avatar.className = `user-avatar`;
  avatar.style.background = profile.color;
  avatar.style.color = '#fff';
  name.textContent = profile.name;
}

// ============================================================
// NOTIFICATIONS + GOOGLE CALENDAR
// ============================================================
async function initNotifications() {
  const perm = Notification?.permission;
  if (perm === 'granted') {
    await registerFCMToken();
  } else if (perm === 'default') {
    setTimeout(() => {
      document.getElementById('notifBanner').classList.remove('hidden');
    }, 1500);
  }
  // Sur iOS, même si permission accordée, montrer le bouton si pas de token encore
  checkTokenRegistered();
}

async function checkTokenRegistered() {
  if (!currentUser) return;
  const snap = await db.collection('fcmTokens').doc(currentUser.uid).get();
  if (!snap.exists) {
    // Pas encore de token — montrer la bannière pour forcer l'enregistrement
    document.getElementById('notifBanner').classList.remove('hidden');
  }
}

async function requestNotifPermission() {
  document.getElementById('notifBanner').classList.add('hidden');
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    await registerFCMToken();
    toast('🔔 Notifications activées !');
  } else {
    toast('Notifications refusées');
  }
}

function dismissNotifBanner() {
  document.getElementById('notifBanner').classList.add('hidden');
}

async function registerFCMToken() {
  try {
    if (!('Notification' in window)) {
      toast('Les notifications ne sont pas supportées sur ce navigateur');
      return;
    }
    const messaging = firebase.messaging();
    const token = await messaging.getToken({
      vapidKey: 'BCFBZIEkMQO3TWd_5_YGNcd7GkAxy17jrzjQ-D-8XZl4J4CBHiDQUg_rGr-kvkk2qWTiCglGlKQSWtEpGBMTXVE',
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });
    if (token && currentUser) {
      await db.collection('fcmTokens').doc(currentUser.uid).set({
        token,
        email: currentUser.email,
        updatedAt: Date.now(),
      });
      console.log('[FCM] Token enregistré avec succès');
      document.getElementById('notifBanner').classList.add('hidden');
      toast('🔔 Notifications activées !');
    } else {
      console.warn('[FCM] Pas de token obtenu');
      toast("Impossible d'activer les notifications");
    }
  } catch(e) {
    console.warn('[FCM] Erreur:', e.message);
    toast('Erreur notifications : ' + e.message);
  }
}

/**
 * Crée un événement Google Calendar pour les tâches hebdo et +
 * Nécessite que l'utilisateur soit connecté avec Google OAuth (étape 3)
 * Pour l'instant : stocke l'événement en attente dans Firestore
 */
async function createCalendarEvent(piece, el, task) {
  try {
    const FREQ_DAYS_CAL = { S:7, M:30, T:90, A:365 };
    const daysToAdd = FREQ_DAYS_CAL[task.freq] || 7;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const event = {
      summary:     `🏠 ${piece.name} · ${task.name}`,
      description: `Tâche ménagère — ${el.name} — Fréquence : ${FREQ_LABELS[task.freq]}`,
      date:        nextDateStr,  // prochaine échéance
      freq:        task.freq,
      taskId:      task.id,
      doneBy:      currentUser.email,
      doneByName:  getProfile(currentUser.email).name,
      assignee:    task.assignee,
      createdAt:   Date.now(),
      status:      'pending',
    };
    await db.collection('calendarEvents').add(event);
  } catch(e) {
    console.warn('Calendar event error:', e);
  }
}

// ============================================================
// CÉLÉBRATION — FEUX D'ARTIFICE
// ============================================================
function showCelebration() {
  // Lancer les feux d'artifice via canvas
  const existing = document.getElementById('celebrationCanvas');
  if (existing) existing.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'celebrationCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#2f54eb','#eb2f96','#52c41a','#fa8c16','#fadb14','#f5222d'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 3,
      life: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.12; // gravité
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    const alive = particles.filter(p => p.life > 0);
    if (alive.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// ============================================================
// MODALS
// ============================================================
let _modal = {};

function openModal(title, fields, onSave) {
  _modal.onSave = onSave;
  _modal.values = {}; // stockage live des valeurs
  fields.forEach(f => { _modal.values[f.id] = f.value || ''; });

  document.getElementById('modalTitle').textContent = title;
  const container = document.getElementById('modalFields');
  container.innerHTML = '';

  fields.forEach(f => {
    const div = document.createElement('div');
    div.className = 'modal-field';
    div.innerHTML = `<label>${f.label}</label>`;

    if (f.type === 'select') {
      const sel = document.createElement('select');
      sel.id = 'mf_' + f.id;
      f.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.v; opt.textContent = o.l;
        if (o.v === f.value) opt.selected = true;
        sel.appendChild(opt);
      });
      // Stocker la valeur en live
      sel.addEventListener('change', () => { _modal.values[f.id] = sel.value; });
      div.appendChild(sel);
    } else if (f.type === 'emoji') {
      div.innerHTML += renderEmojiPicker(f.value);
    } else if (f.type === 'assignee') {
      _modal.assignee = f.value;
      div.innerHTML += `<div class="assignee-toggle">
        <button class="assignee-btn${f.value==='V'?' active-V':''}" id="mf_assign_V" onclick="setAssignee('V')">V — Vadim</button>
        <button class="assignee-btn${f.value==='L'?' active-L':''}" id="mf_assign_L" onclick="setAssignee('L')">L — Lorinda</button>
        <button class="assignee-btn${f.value==='both'?' active-both':''}" id="mf_assign_both" onclick="setAssignee('both')">Tous les deux</button>
      </div>`;
    } else {
      const inp = document.createElement('input');
      inp.id = 'mf_' + f.id;
      inp.type = f.type || 'text';
      inp.value = f.value || '';
      inp.placeholder = f.placeholder || '';
      // Stocker la valeur en live à chaque frappe
      inp.addEventListener('input', () => { _modal.values[f.id] = inp.value.trim(); });
      inp.addEventListener('change', () => { _modal.values[f.id] = inp.value.trim(); });
      div.appendChild(inp);
    }
    container.appendChild(div);
  });

  document.getElementById('modalOverlay').classList.add('open');
}

function setAssignee(val) {
  _modal.assignee = val;
  ['V','L','both'].forEach(v => {
    const btn = document.getElementById('mf_assign_'+v);
    if (btn) btn.className = 'assignee-btn' + (v===val ? ` active-${v}` : '');
  });
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
async function saveModal() {
  if (!_modal.onSave) { closeModal(); return; }
  // Snapshot des valeurs AVANT tout
  const savedValues = { ..._modal.values };
  const savedAssignee = _modal.assignee;
  const savedEmoji = _selectedEmoji;
  const fn = _modal.onSave;
  // Fermer la modal immédiatement (plus de problème DOM)
  closeModal();
  try {
    // Restaurer les valeurs snapshotées pour que getField() les trouve
    _modal.values = savedValues;
    _modal.assignee = savedAssignee;
    _selectedEmoji = savedEmoji;
    await fn();
  } catch(e) {
    console.error('saveModal error:', e);
    toast('Erreur : ' + e.message);
  }
}
function getField(id) { return (_modal.values && _modal.values[id] !== undefined) ? _modal.values[id] : (document.getElementById('mf_'+id)?.value.trim() || ''); }

function openAddPiece() {
  openModal('Nouvelle pièce', [
    { id:'name', label:'Nom de la pièce', placeholder:'ex: Garage' },
    { id:'icon', label:'Icône', type:'emoji', value:'🏠' },
  ], async () => {
    const name = getField('name');
    if (!name) return;
    const piece = { id: uid(), name, icon: getSelectedEmoji(), elements:[], order: pieces.length };
    await savePiece(piece);
    toast('Pièce ajoutée');
  });
}

function openAddElement(pieceId) {
  openModal('Nouvel élément', [
    { id:'name', label:"Nom de l'élément", placeholder:'ex: Cheminée' },
  ], async () => {
    const name = getField('name');
    if (!name) return;
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;
    const newElements = [...(piece.elements||[]), { id: uid(), name, tasks:[] }];
    await updatePieceElements(pieceId, newElements);
    toast('Élément ajouté');
  });
}

function openAddTask(pieceId, elId) {
  _modal.assignee = 'both';
  openModal('Nouvelle tâche', [
    { id:'name', label:'Description', placeholder:'ex: Nettoyer les vitres' },
    { id:'freq', label:'Fréquence', type:'select', value:'S', options:[
      {v:'J',l:'Quotidien'},{v:'S',l:'Hebdomadaire'},{v:'M',l:'Mensuel'},{v:'T',l:'Trimestriel'},{v:'A',l:'Annuel'}
    ]},
    { id:'assignee', label:'Assigné à', type:'assignee', value:'both' },
  ], async () => {
    const name = getField('name');
    const freq = getField('freq') || 'S';
    const assignee = _modal.assignee || 'both';
    if (!name) return;
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;
    const newElements = (piece.elements||[]).map(el => {
      if (el.id !== elId) return el;
      return { ...el, tasks: [...(el.tasks||[]), { id: uid(), name, freq, assignee }] };
    });
    await updatePieceElements(pieceId, newElements);
    toast('Tâche ajoutée');
  });
}

function openEditTask(pieceId, elId, taskId) {
  const piece = pieces.find(p => p.id === pieceId);
  const el = piece?.elements.find(e => e.id === elId);
  const task = el?.tasks.find(t => t.id === taskId);
  if (!task) return;
  _modal.assignee = task.assignee;
  openModal('Modifier la tâche', [
    { id:'name', label:'Description', value: task.name },
    { id:'freq', label:'Fréquence', type:'select', value: task.freq, options:[
      {v:'J',l:'Quotidien'},{v:'S',l:'Hebdomadaire'},{v:'M',l:'Mensuel'},{v:'T',l:'Trimestriel'},{v:'A',l:'Annuel'}
    ]},
    { id:'assignee', label:'Assigné à', type:'assignee', value: task.assignee },
  ], async () => {
    const name = getField('name');
    if (!name) return;
    task.name = name;
    task.freq = getField('freq') || task.freq;
    task.assignee = _modal.assignee || task.assignee;
    const newElements = (piece.elements||[]).map(el => {
      if (el.id !== elId) return el;
      return { ...el, tasks: (el.tasks||[]).map(t => t.id !== taskId ? t : task) };
    });
    await updatePieceElements(pieceId, newElements);
    toast('Tâche modifiée');
  });
}

// ============================================================
// TOAST
// ============================================================
let _toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ============================================================
// CSS AUTH (injecté dynamiquement)
// ============================================================
const authStyles = `
.auth-screen { position:fixed; inset:0; z-index:1000; display:flex; align-items:center; justify-content:center; background:var(--bg); padding:1.5rem; } .auth-screen.hidden { display:none !important; } #appScreen.hidden { display:none !important; }
.auth-card { width:100%; max-width:380px; background:var(--bg2); border-radius:var(--radius); padding:2rem 1.5rem; box-shadow:var(--shadow-lg); border:1px solid var(--border); }
.auth-logo { font-size:2.5rem; text-align:center; margin-bottom:0.75rem; }
.auth-title { font-family:'Nunito',sans-serif; font-size:1.6rem; font-weight:800; text-align:center; margin-bottom:0.25rem; }
.auth-title span { color:var(--accent); }
.auth-sub { text-align:center; color:var(--text3); font-size:0.85rem; margin-bottom:1.75rem; }
.auth-form { display:flex; flex-direction:column; gap:0.75rem; }
.auth-error { background:var(--danger-light); color:var(--danger); border-radius:var(--radius-xs); padding:0.6rem 0.875rem; font-size:0.8rem; font-weight:600; }
`;
const styleEl = document.createElement('style');
styleEl.textContent = authStyles;
document.head.appendChild(styleEl);

// ============================================================
// EMOJI PICKER
// ============================================================
const ROOM_EMOJIS = [
  '🍳','🥘','🍽️','🔪','🥗',
  '🚿','🛁','🪥','🧼','🚽',
  '🛏️','😴','🌙','🛋️','🪑',
  '🚪','🏠','🏡','🪟','🪞',
  '🖥️','💻','🖨️','📚','🗂️',
  '🫧','👕','🧺','🧹','🪣',
  '🌿','🌳','🌻','🌱','🚗',
  '🔧','🪚','🔨','⚙️','🪛',
  '📦','🗄️','🪤','🧲','💡',
  '🎮','📺','🎵','🎨','🏋️',
];

let _selectedEmoji = '🏠';

function renderEmojiPicker(currentEmoji) {
  _selectedEmoji = currentEmoji || '🏠';
  return `
    <div class="emoji-preview" id="emojiPreview">${_selectedEmoji}</div>
    <div class="emoji-grid" id="emojiGrid">
      ${ROOM_EMOJIS.map(e => `
        <button class="emoji-btn${e === _selectedEmoji ? ' selected' : ''}"
          onclick="selectEmoji('${e}')">${e}</button>
      `).join('')}
    </div>`;
}

function selectEmoji(e) {
  _selectedEmoji = e;
  document.getElementById('emojiPreview').textContent = e;
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent === e);
  });
}

function getSelectedEmoji() { return _selectedEmoji; }

// Ajouter les styles emoji au CSS injecté
const emojiStyles = `
.emoji-preview { font-size:2.5rem; text-align:center; margin-bottom:0.75rem; padding:0.5rem; background:var(--bg3); border-radius:var(--radius-sm); border:1.5px solid var(--border); }
.emoji-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; max-height:180px; overflow-y:auto; padding:4px; }
.emoji-btn { font-size:1.4rem; padding:6px; border-radius:var(--radius-xs); border:1.5px solid transparent; background:var(--bg3); cursor:pointer; transition:all 0.15s; aspect-ratio:1; display:flex; align-items:center; justify-content:center; }
.emoji-btn:hover { background:var(--accent-light); border-color:var(--accent); transform:scale(1.1); }
.emoji-btn.selected { background:var(--accent-light); border-color:var(--accent); }
`;
const emojiStyleEl = document.createElement('style');
emojiStyleEl.textContent = emojiStyles;
document.head.appendChild(emojiStyleEl);
