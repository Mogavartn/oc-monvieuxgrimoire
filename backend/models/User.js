const mongoose = require('mongoose'); // Importation du module Mongoose pour la modélisation des données MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Importation du plugin de validation d'unicité pour Mongoose

// Définition du schéma de l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Adresse e-mail de l'utilisateur, unique dans la base de données
    password: { type: String, required: true }, // Mot de passe de l'utilisateur
});

// Utilisation du plugin de validation d'unicité pour le champ email
userSchema.plugin(uniqueValidator);

// Exportation du modèle d'utilisateur pour une utilisation dans d'autres parties de l'application
module.exports = mongoose.model('User', userSchema);
