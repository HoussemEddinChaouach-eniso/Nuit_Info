import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://houssemeddinechaouach_db_user:0000@cluster0.biy0h0h.mongodb.net/nird?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch((err) => console.error('Erreur de connexion MongoDB:', err));

// Schéma Etablissement avec PC
const etablissementSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  adresse: { type: String },
  ville: { type: String },
  codePostal: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  description: { type: String },
  // Nouveau: Gestion des PC
  pcWindows: { type: Number, default: 0 },
  pcLinux: { type: Number, default: 0 },
  contact: {
    email: { type: String },
    telephone: { type: String },
    siteWeb: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Etablissement = mongoose.model('Etablissement', etablissementSchema);

// Routes API
app.get('/api/etablissements', async (req, res) => {
  try {
    const etablissements = await Etablissement.find();
    res.json(etablissements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

app.get('/api/etablissements/:id', async (req, res) => {
  try {
    const etablissement = await Etablissement.findById(req.params.id);
    if (!etablissement) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }
    res.json(etablissement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

app.post('/api/etablissements', async (req, res) => {
  try {
    const nouvelEtablissement = new Etablissement(req.body);
    const saved = await nouvelEtablissement.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error });
  }
});

app.put('/api/etablissements/:id', async (req, res) => {
  try {
    const updated = await Etablissement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error });
  }
});

// Route pour convertir un PC Windows en Linux
app.patch('/api/etablissements/:id/convert-pc', async (req, res) => {
  try {
    const etablissement = await Etablissement.findById(req.params.id);
    if (!etablissement) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }
    
    if (etablissement.pcWindows > 0) {
      etablissement.pcWindows -= 1;
      etablissement.pcLinux += 1;
      etablissement.updatedAt = new Date();
      await etablissement.save();
      res.json(etablissement);
    } else {
      res.status(400).json({ message: 'Aucun PC Windows à convertir' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

app.delete('/api/etablissements/:id', async (req, res) => {
  try {
    await Etablissement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Établissement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});