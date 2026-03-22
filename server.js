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
  clients: [
    {id:"c1",n:"Carrefour Chambéry",t:"GMS",ct:"Jean Dupont",ph:"04 79 00 00 01",em:"j.dupont@carrefour.fr",ad:"ZAC Les Landiers, Chambéry",dp:"73 - Savoie",rp:"Gérôme",st:"Référencé",nt:"Chef de rayon réceptif Collection Été",ca:22000,cr:"2024-02-15",bd:"1978-06-24",fn:"Jean"},
    {id:"c2",n:"Le Cellier Savoyard",t:"Caviste",ct:"Marie Bonnet",ph:"04 79 00 00 02",em:"contact@celliersavoyard.fr",ad:"12 rue de Boigne, Chambéry",dp:"73 - Savoie",rp:"Gérôme",st:"Référencé",nt:"Commandes régulières, focus 778",ca:9500,cr:"2023-09-10",bd:"1985-08-15",fn:"Marie"},
    {id:"c3",n:"Hôtel Les Trésoms",t:"CHR",ct:"Paul Lefèvre",ph:"04 50 00 00 03",em:"p.lefevre@tresoms.com",ad:"15 bd Corniche, Annecy",dp:"74 - Haute-Savoie",rp:"Laurent",st:"Négociation",nt:"Carte vins Savoie, dégustation prévue",ca:3200,cr:"2025-01-20",bd:"1972-11-03",fn:"Paul"},
    {id:"c4",n:"Intermarché Albertville",t:"GMS",ct:"Sophie Martin",ph:"04 79 00 00 04",em:"s.martin@itm.fr",ad:"Av. Chasseurs Alpins, Albertville",dp:"73 - Savoie",rp:"Christophe",st:"1er Contact",nt:"Contact salon professionnel",ca:0,cr:"2025-03-01",bd:"1990-05-25",fn:"Sophie"},
    {id:"c5",n:"La Table de l'Ours",t:"CHR",ct:"Antoine Roux",ph:"04 79 00 00 05",em:"a.roux@tableours.fr",ad:"Val d'Isère",dp:"73 - Savoie",rp:"Laurent",st:"Dégustation",nt:"Restaurant étoilé, opportunité premium",ca:0,cr:"2025-02-10",bd:"1980-01-17",fn:"Antoine"},
    {id:"c6",n:"E.Leclerc Grenoble",t:"GMS",ct:"François Blanc",ph:"04 76 00 00 06",em:"f.blanc@leclerc.fr",ad:"CC Grand Place, Grenoble",dp:"38 - Isère",rp:"Christophe",st:"Prospect",nt:"Fort potentiel GMS Isère",ca:0,cr:"2025-03-10",bd:"1988-10-04",fn:"François"},
    {id:"c7",n:"Cave de la Mondeuse",t:"Caviste",ct:"Claire Perret",ph:"04 79 00 00 07",em:"info@cavemondeuse.fr",ad:"Place du Centenaire, Arbin",dp:"73 - Savoie",rp:"Gérôme",st:"Référencé",nt:"Partenaire historique, gamme 778",ca:14800,cr:"2023-03-15",bd:"1975-08-11",fn:"Claire"},
    {id:"c8",n:"Auchan Lyon Part-Dieu",t:"GMS",ct:"Nathalie Girard",ph:"04 72 00 00 08",em:"n.girard@auchan.fr",ad:"Centre Part-Dieu, Lyon",dp:"69 - Rhône",rp:"Laurent",st:"1er Contact",nt:"Test Collection Été, attente siège",ca:0,cr:"2025-02-28",bd:"1983-07-26",fn:"Nathalie"},
  ],
  visits: [
    {id:"v1",cid:"c1",rp:"Gérôme",dt:"2025-03-15",tp:"Suivi",nt:"PLV Collection Été, 2 facing obtenus. RDV 28/03.",rs:"Positif"},
    {id:"v2",cid:"c3",rp:"Laurent",dt:"2025-03-12",tp:"Dégustation",nt:"778 Source + Crémant. Sommelier intéressé.",rs:"Positif"},
    {id:"v3",cid:"c5",rp:"Laurent",dt:"2025-03-10",tp:"Dégustation",nt:"Gamme complète présentée au chef.",rs:"En attente"},
    {id:"v4",cid:"c2",rp:"Gérôme",dt:"2025-03-08",tp:"Commande",nt:"Réassort 778 Abysse x24, Crémant x12.",rs:"Positif"},
    {id:"v5",cid:"c7",rp:"Gérôme",dt:"2025-03-05",tp:"Suivi",nt:"Bonne rotation 778. Discussion Collection Été.",rs:"Positif"},
    {id:"v6",cid:"c4",rp:"Christophe",dt:"2025-03-01",tp:"Prospection",nt:"1er RDV chef de rayon. Bon accueil.",rs:"En attente"},
  ],
  orders: [
    {id:"o1",cid:"c1",dt:"2025-03-01",pr:"Jacquère x48, Roussette x24, Crémant x24",am:3200},
    {id:"o2",cid:"c1",dt:"2025-01-15",pr:"Mondeuse x36, Jacquère x36",am:2800},
    {id:"o3",cid:"c2",dt:"2025-03-08",pr:"778 Abysse x24, Crémant x12",am:1650},
    {id:"o4",cid:"c2",dt:"2025-01-20",pr:"778 Source x24, Corail x12, Abysse x12",am:2100},
    {id:"o5",cid:"c7",dt:"2025-02-15",pr:"778 Source x36, Corail x24, Abysse x36",am:4200},
    {id:"o6",cid:"c7",dt:"2024-11-10",pr:"778 gamme complète x48",am:5800},
    {id:"o7",cid:"c3",dt:"2025-03-14",pr:"Crémant x12, Roussette x6",am:890},
    {id:"o8",cid:"c1",dt:"2024-09-20",pr:"Collection Été test x24",am:1200},
  ]
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
  console.log(`\n  🍇 CRM Maison Philippe Viallet`);
  console.log(`  ➜ http://localhost:${PORT}\n`);
});
 
