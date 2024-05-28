const multer = require('multer'); // Middleware pour la gestion des téléchargements de fichiers
const path = require('path'); // Module pour la manipulation des chemins de fichiers
const fs = require('fs'); // Module pour la manipulation des fichiers

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    // Destination des fichiers téléchargés : le dossier "images"
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Nom des fichiers : nom d'origine avec remplacement des espaces et des points par des underscores, suivi d'un timestamp
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Remplacement des espaces par des underscores
        const extension = MIME_TYPES[file.mimetype]; // Obtention de l'extension du fichier à partir de son type MIME
        callback(null, name + Date.now() + '.' + extension); // Nom du fichier final avec timestamp pour le rendre unique
    },
});

// Middleware pour gérer les téléchargements de fichiers d'image uniquement
module.exports = multer({ storage: storage }).single('image');
