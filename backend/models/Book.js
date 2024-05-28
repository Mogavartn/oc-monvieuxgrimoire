const mongoose = require('mongoose'); // Importation du module Mongoose pour la modélisation des données MongoDB

// Définition du schéma du livre
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Identifiant de l'utilisateur associé au livre
    title: { type: String, required: true }, // Titre du livre
    author: { type: String, required: true }, // Auteur du livre
    year: { type: Number, required: true }, // Année de publication du livre
    genre: { type: String, required: true }, // Genre du livre
    imageUrl: { type: String, required: true }, // URL de l'image du livre
    ratings: [
        // Tableau des évaluations du livre, chaque élément contient l'identifiant de l'utilisateur et la note attribuée
        {
            userId: { type: String }, // Identifiant de l'utilisateur ayant donné la note
            grade: { type: Number }, // Note attribuée au livre par cet utilisateur
        },
    ],
    averageRating: { type: Number }, // Note moyenne du livre basée sur les évaluations
});

// Exportation du modèle de livre pour une utilisation dans d'autres parties de l'application
module.exports = mongoose.model('Book', bookSchema);
