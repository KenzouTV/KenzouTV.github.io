import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const {
  MINESTRATOR_API_KEY,
  MINESTRATOR_SERVER_ID,
  FIREBASE_SERVICE_ACCOUNT_JSON,
  ADMIN_EMAIL,
  ALLOWED_ORIGIN,
  PORT
} = process.env;

if (!MINESTRATOR_API_KEY || !MINESTRATOR_SERVER_ID || !FIREBASE_SERVICE_ACCOUNT_JSON || !ADMIN_EMAIL) {
  console.error("Variables d'environnement manquantes — voir README.md");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON))
});

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN || "*" }));

const MINESTRATOR_BASE = "https://mine.sttr.io";

async function minestratorFetch(path, options = {}) {
  const res = await fetch(MINESTRATOR_BASE + path, {
    ...options,
    headers: {
      "Authorization": `Bearer ${MINESTRATOR_API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MineStrator API ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * GET /uptime
 * Public (pas besoin d'être connecté) : renvoie depuis quand le serveur
 * est en ligne, calculé à partir de l'uptime renvoyé par MineStrator.
 */
app.get("/uptime", async (req, res) => {
  try {
    const data = await minestratorFetch(`/server/${MINESTRATOR_SERVER_ID}/live`);
    const stats = data?.api?.data?.stats;

    if (stats && stats.state === "online") {
      const onlineSince = new Date(Date.now() - stats.uptime.total_seconds * 1000).toISOString();
      res.json({ onlineSince, players: stats.players || null });
    } else {
      res.json({ onlineSince: null, players: null });
    }
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "minestrator_unreachable" });
  }
});

/**
 * POST /start
 * Protégé : vérifie le token Firebase envoyé par le site, et n'autorise
 * l'action que si l'email correspond à ADMIN_EMAIL.
 */
app.post("/start", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "missing_token" });

    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "not_admin" });
    }

    await minestratorFetch(`/server/${MINESTRATOR_SERVER_ID}/poweraction`, {
      method: "PUT",
      body: JSON.stringify({ poweraction: "start" })
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "start_failed" });
  }
});

app.get("/", (req, res) => res.send("ZouPlay backend en ligne."));

app.listen(PORT || 3000, () => console.log("ZouPlay backend démarré sur le port " + (PORT || 3000)));
