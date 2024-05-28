const express = require('express'); // Importation du framework Express pour la gestion des routes HTTP
const router = express.Router(); // Création d'un routeur Express pour définir les routes pour les utilisateurs

const userCtrl = require('../controllers/user'); // Importation du contrôleur des utilisateurs pour la logique métier des routes

// Définition des routes pour les utilisateurs
router.post('/signup', userCtrl.signup); // Route pour la création d'un nouveau compte utilisateur
router.post('/login', userCtrl.login); // Route pour la connexion d'un utilisateur existant

module.exports = router; // Exportation du routeur pour une utilisation dans d'autres parties de l'application
