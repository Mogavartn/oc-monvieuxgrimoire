require('dotenv').config(); // Chargement du fichier .env et de ses variables
const express = require('express'); // Importation du framework Express pour la gestion des routes HTTP
const mongoose = require('mongoose'); // Importation de Mongoose pour la connexion à la base de données MongoDB
const booksRoutes = require('./routes/books'); // Importation des routes liées aux livres
const userRoutes = require('./routes/user'); // Importation des routes liées aux utilisateurs
const path = require('path'); // Importation du module Path pour la gestion des chemins de fichiers

// Validation des variables d'environnement
const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_NAME, FRONTEND_URL } = process.env;
if (!DB_USERNAME || !DB_PASSWORD || !DB_CLUSTER || !FRONTEND_URL) {
    console.error('Erreur: Certaines variables d\'environnement ne sont pas définies');
    process.exit(1);
}

// Connexion à la base de données MongoDB
const dbUri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(dbUri)
    .then(() => console.log('Connexion à MongoDB réussie !')) // Message de succès en cas de connexion réussie
    .catch((error) => console.error('Connexion à MongoDB échouée !', error)); // Message d'erreur en cas de connexion échouée

// Création de l'application Express
const app = express();

// Middleware permettant à Express d'extraire le corps JSON des requêtes POST
app.use(express.json());

app.use((req, res, next) => {
    // Configuration des en-têtes CORS pour autoriser l'accès depuis votre frontend
    const allowedOrigins = [FRONTEND_URL];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Autorisation d'ajouter les en-têtes spécifiés aux requêtes
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    );
    // Autorisation des méthodes HTTP spécifiées dans les en-têtes
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );
    next(); // Appel de la fonction next() pour passer au middleware suivant
});

// Gestion de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement des routeurs pour les livres et les utilisateurs
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // Exportation de l'application Express pour une utilisation dans d'autres parties de l'application