const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Données initiales
const SEED = {
  reps: ["Gérôme","Laurent","Christophe","David","Doriane"],
  clients: [],
  visits: [],
  orders: []
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch(e) { console.error('Erreur lecture:', e); }
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
  return SEED;
}

function saveDataFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/data', (req, res) => {
  try {
    saveDataFile(req.body);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reset', (req, res) => {
  saveDataFile(SEED);
  res.json(SEED);
});

// Fallback: serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🍇 CRM Maison Viallet`);
  console.log(`  ➜ http://localhost:${PORT}\n`);
});
