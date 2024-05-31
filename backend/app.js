require('dotenv').config(); // Chargement du fichier .env et de ses variables
const express = require('express'); // Importation du framework Express pour la gestion des routes HTTP
const mongoose = require('mongoose'); // Importation de Mongoose pour la connexion à la base de données MongoDB
const booksRoutes = require('./routes/books'); // Importation des routes liées aux livres
const userRoutes = require('./routes/user'); // Importation des routes liées aux utilisateurs
const path = require('path'); // Importation du module Path pour la gestion des chemins de fichiers

// Connexion à la base de données MongoDB
mongoose
    .connect(
        `mongodb+srv://Riiturii:${process.env.DB_PASSWORD}@cluster0.pzqkuge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        { useNewUrlParser: true, useUnifiedTopology: true },
    )
    .then(() => console.log('Connexion à MongoDB réussie !')) // Message de succès en cas de connexion réussie
    .catch(() => console.log('Connexion à MongoDB échouée !')); // Message d'erreur en cas de connexion échouée

// Création de l'application Express
const app = express();

// Middleware permettant à Express d'extraire le corps JSON des requêtes POST
app.use(express.json());

// Middleware gérant les erreurs de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    // Configuration des en-têtes CORS pour autoriser l'accès depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
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
