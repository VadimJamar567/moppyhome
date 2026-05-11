// api/cron.js
// Vercel Cron Job — tourne chaque matin à 8h (UTC+2 = 6h UTC)
// Vérifie les tâches expirées, décoche et envoie les notifications FCM

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

// ── Init Firebase Admin (une seule fois) ──
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db          = getFirestore();
const messaging   = getMessaging();

// ── Fréquences en millisecondes ──
const FREQ_MS = {
  J:  1  * 24 * 60 * 60 * 1000,
  S:  7  * 24 * 60 * 60 * 1000,
  M:  30 * 24 * 60 * 60 * 1000,
  T:  90 * 24 * 60 * 60 * 1000,
  A: 365 * 24 * 60 * 60 * 1000,
};

const FREQ_LABELS = { J:'quotidienne', S:'hebdomadaire', M:'mensuelle', T:'trimestrielle', A:'annuelle' };

// ── Messages de notification ──
function getNotifMessage(taskName, freq) {
  return `🏠 "${taskName}" est à refaire (tâche ${FREQ_LABELS[freq]})`;
}

function getCrossNotifMessage(taskName, doneByName, assigneeName) {
  if (assigneeName === 'Vadim') {
    return `🍫 Lorinda a fait ta tâche "${taskName}" — n'oublie pas les chocolats !`;
  } else {
    return `💐 Vadim a fait ta tâche "${taskName}" — pense à le remercier !`;
  }
}

// ── Envoyer une notification FCM ──
async function sendNotification(token, title, body) {
  if (!token) return;
  try {
    await messaging.send({
      token,
      notification: { title, body },
      android: { notification: { sound: 'default' } },
      apns: { payload: { aps: { sound: 'default' } } },
    });
  } catch(e) {
    console.error('FCM error:', e.message);
  }
}

// ── Récupérer les tokens FCM des utilisateurs ──
async function getFCMTokens() {
  const snap = await db.collection('fcmTokens').get();
  const tokens = {};
  snap.docs.forEach(d => {
    const data = d.data();
    tokens[data.email] = data.token;
  });
  return tokens;
}

// ── Déterminer à qui envoyer la notif selon l'assignation ──
function getRecipients(assignee, fcmTokens) {
  const vadimToken   = Object.entries(fcmTokens).find(([email]) => email.includes('vadim'))?.[1];
  const lorindaToken = Object.entries(fcmTokens).find(([email]) => email.includes('lorinda'))?.[1];

  if (assignee === 'V')    return [{ token: vadimToken,   name: 'Vadim' }];
  if (assignee === 'L')    return [{ token: lorindaToken, name: 'Lorinda' }];
  if (assignee === 'both') return [
    { token: vadimToken,   name: 'Vadim' },
    { token: lorindaToken, name: 'Lorinda' },
  ];
  return [];
}

// ── Handler principal ──
export default async function handler(req, res) {
  // Sécurité : vérifier que c'est bien Vercel qui appelle
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now      = Date.now();
    const fcmTokens = await getFCMTokens();

    // Récupérer toutes les pièces
    const piecesSnap = await db
      .collection('households').doc('moppyhome')
      .collection('pieces').get();

    // Récupérer tous les checks
    const checksSnap = await db
      .collection('households').doc('moppyhome')
      .collection('checks').get();

    const checks = {};
    checksSnap.docs.forEach(d => { checks[d.id] = d.data(); });

    const results = { unchecked: 0, notified: 0, errors: 0 };

    // Parcourir toutes les tâches
    for (const pieceDoc of piecesSnap.docs) {
      const piece = pieceDoc.data();
      for (const el of (piece.elements || [])) {
        for (const task of (el.tasks || [])) {
          const check = checks[task.id];

          // Si pas cochée → ignorer (déjà décochée)
          if (!check) continue;

          const elapsed = now - check.doneAt;
          const limit   = FREQ_MS[task.freq];
          if (!limit) continue;

          // Si la fréquence est dépassée → décocher + notifier
          if (elapsed >= limit) {
            try {
              // Décocher dans Firestore
              await db
                .collection('households').doc('moppyhome')
                .collection('checks').doc(task.id).delete();

              results.unchecked++;

              // Envoyer notification aux bonnes personnes
              const recipients = getRecipients(task.assignee, fcmTokens);
              for (const recipient of recipients) {
                await sendNotification(
                  recipient.token,
                  '🏠 MoppyHome',
                  getNotifMessage(task.name, task.freq)
                );
                results.notified++;
              }

            } catch(e) {
              console.error('Erreur tâche', task.id, e.message);
              results.errors++;
            }
          }
        }
      }
    }

    // Traiter les notifications croisées en attente
    const crossSnap = await db.collection('crossNotifications')
      .where('sent', '==', false).get();

    for (const doc of crossSnap.docs) {
      const data = doc.data();
      const recipients = getRecipients(data.assignee, fcmTokens);
      for (const recipient of recipients) {
        await sendNotification(recipient.token, '🏠 MoppyHome', data.message);
      }
      await doc.ref.update({ sent: true });
      results.notified++;
    }

    console.log(`[Cron 8h] Résultats:`, results);
    return res.status(200).json({ ok: true, ...results });

  } catch(e) {
    console.error('[Cron] Erreur générale:', e);
    return res.status(500).json({ error: e.message });
  }
}
