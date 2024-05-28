const express = require('express'); // Importation du framework Express pour la gestion des routes HTTP
const router = express.Router(); // Création d'un routeur Express pour définir les routes pour les livres

const auth = require('../middleware/auth'); // Middleware d'authentification pour vérifier l'authentification de l'utilisateur
const upload = require('../middleware/upload'); // Middleware de téléchargement de fichiers pour gérer le téléchargement d'images

const booksCtrl = require('../controllers/books'); // Importation du contrôleur des livres pour la logique métier des routes

// Définition des routes pour les livres
router.get('/', booksCtrl.getAllBooks); // Route pour récupérer tous les livres
router.get('/bestrating', booksCtrl.getBestRatedBooks); // Route pour récupérer les livres les mieux notés
router.get('/:id', booksCtrl.getOneBook); // Route pour récupérer un livre spécifique par son ID

router.post('/', auth, upload, booksCtrl.createBook); // Route pour créer un nouveau livre (nécessite une authentification et un téléchargement d'image)
router.post('/:id/rating', auth, booksCtrl.rateBook); // Route pour ajouter une note à un livre (nécessite une authentification)

router.put('/:id', auth, upload, booksCtrl.modifyBook); // Route pour modifier un livre existant (nécessite une authentification et un téléchargement d'image)
router.delete('/:id', auth, booksCtrl.deleteBook); // Route pour supprimer un livre existant (nécessite une authentification)

module.exports = router; // Exportation du routeur pour une utilisation dans d'autres parties de l'application
