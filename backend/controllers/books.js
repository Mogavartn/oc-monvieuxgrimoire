const fs = require('fs'); // Module pour interagir avec le système de fichiers
const sharp = require('sharp'); // Module pour manipuler les images
const Book = require('../models/Book'); // Importation du modèle de livre

// Logique métier - Contrôleur

// POST => Enregistrement d'un livre
exports.createBook = (req, res, next) => {
    // Conversion de la requête en un objet JSON
    const bookObject = JSON.parse(req.body.book);
    // Suppression des champs potentiellement indésirables
    delete bookObject._id; // Supprime le faux _id envoyé par le front
    delete bookObject._userId; // Supprime _userId, qui ne peut être totalement fiable

    // Chemin du fichier image téléchargée
    const inputFilePath = req.file.path;
    // Nouveau chemin du fichier image transformée
    const outputFilePath = `${req.file.path.split('.')[0]}.webp`;

    // Utilisation de sharp pour redimensionner et convertir l'image
    sharp(inputFilePath)
        .resize(463, 595) // Redimensionne l'image à une taille spécifique
        .toFormat('webp') // Convertit l'image en format WebP
        .toFile(outputFilePath) // Enregistre l'image convertie
        .then(() => {
            // Suppression de l'image originale non redimensionnée
            fs.unlink(inputFilePath, (err) => {
                if (err) console.log(err); // Gestion des erreurs potentielles
            });

            // Création d'une instance du modèle Book avec l'image transformée
            const book = new Book({
                ...bookObject, // Utilisation de tous les autres champs du livre
                userId: req.auth.userId, // Attribution de l'ID de l'utilisateur connecté
                imageUrl: `${req.protocol}://${req.get('host')}/images/${outputFilePath.split('/').pop()}`, // Construction de l'URL de l'image
                averageRating: bookObject.ratings[0].grade, // Attribution de la note moyenne initiale du livre
            });

            // Enregistrement du livre dans la base de données MongoDB
            book.save()
                .then(() => {
                    // Réponse avec un statut 201 (Créé) et un message de succès
                    res.status(201).json({ message: 'Livre enregistré !' });
                })
                .catch((error) => {
                    // Gestion des erreurs de sauvegarde dans la base de données
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            // Gestion des erreurs liées au traitement de l'image
            res.status(500).json({
                error: "Erreur lors du traitement de l'image",
            });
        });
};

// GET => Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
    // Recherche du livre dans la base de données par son ID
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Si le livre est trouvé, le renvoyer en tant que réponse
            if (book) {
                res.status(200).json(book);
            } else {
                // Si aucun livre n'est trouvé avec l'ID spécifié, renvoyer une erreur 404
                res.status(404).json({ message: 'Livre non trouvé!' });
            }
        })
        .catch((error) => {
            // Gestion des erreurs lors de la recherche du livre
            res.status(500).json({ error });
        });
};

// PUT => Modification d'un livre existant
exports.modifyBook = (req, res, next) => {
    // Stockage de la requête en JSON dans une constante
    // (ici, nous recevons soit un élément form-data, soit des données JSON, selon si le fichier image a été modifié ou non)
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book), // Utilisation des données du formulaire si le fichier image a été modifié
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Nouvelle URL de l'image
          }
        : { ...req.body }; // Utilisation des données JSON si le fichier image n'a pas été modifié
    // Suppression de _userId auquel on ne peut faire confiance
    delete bookObject._userId;
    // Récupération du livre existant à modifier
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérification si le livre existe
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé!' });
            }
            // Le livre ne peut être mis à jour que par le créateur de sa fiche
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé!' });
            } else {
                // Séparation du nom du fichier image existant
                const filename = book.imageUrl.split('/images/')[1];
                // Si l'image a été modifiée, on supprime l'ancienne
                req.file &&
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) console.log(err);
                    });
                // Mise à jour du livre
                Book.updateOne(
                    { _id: req.params.id }, // Filtre pour trouver le livre à modifier
                    { ...bookObject, _id: req.params.id }, // Nouvelles données du livre
                )
                    .then(() =>
                        res.status(200).json({ message: 'Livre modifié!' }),
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            // Gestion des erreurs lors de la recherche du livre
            res.status(400).json({ error });
        });
};

// DELETE => Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    // Recherche du livre à supprimer dans la base de données par son ID
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérifie si le livre existe
            if (!book) {
                // Si le livre n'existe pas, renvoyer une erreur 404
                return res.status(404).json({ message: 'Livre non trouvé!' });
            }
            // Vérifie si l'utilisateur actuel est autorisé à supprimer le livre
            if (book.userId != req.auth.userId) {
                // Si l'utilisateur n'est pas autorisé, renvoyer une erreur 401 (Non autorisé)
                return res.status(401).json({ message: 'Non autorisé!' });
            }
            // Séparation du nom du fichier image
            const filename = book.imageUrl.split('/images/')[1];
            // Suppression du fichier image associé au livre
            fs.unlink(`images/${filename}`, () => {
                // Suppression du livre de la base de données
                Book.deleteOne({ _id: req.params.id })
                    .then(() => {
                        // Renvoyer une réponse indiquant que le livre a été supprimé avec succès
                        res.status(200).json({
                            message: 'Livre supprimé !',
                        });
                    })
                    .catch((error) => {
                        // Gestion des erreurs lors de la suppression du livre dans la base de données
                        res.status(500).json({ error });
                    });
            });
        })
        .catch((error) => {
            // Gestion des erreurs lors de la recherche du livre dans la base de données
            res.status(500).json({ error });
        });
};

// GET => Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    // Recherche de tous les livres dans la base de données
    Book.find()
        .then((books) => {
            // Renvoi de la liste des livres sous forme de réponse JSON avec un statut 200 (OK)
            res.status(200).json(books);
        })
        .catch((error) => {
            // Gestion des erreurs en cas d'échec de la recherche des livres
            res.status(400).json({ error });
        });
};

// POST => Ajout d'une note à un livre
exports.rateBook = (req, res, next) => {
    const userId = req.auth.userId; // Récupère l'ID de l'utilisateur à partir de l'authentification
    const bookId = req.params.id; // Récupère l'ID du livre à partir des paramètres de la requête
    const grade = req.body.rating; // Récupère la note (grade) à partir du corps de la requête

    // Validation de la note (grade) pour s'assurer qu'elle est un nombre et est dans une plage valide
    if (typeof grade !== 'number' || grade < 0 || grade > 5) {
        return res
            .status(400)
            .json({ error: 'La note doit être un nombre entre 0 et 5.' });
    }
    // Logique pour ajouter la note au livre en utilisant l'ID de l'utilisateur récupéré
Book.findOne({ _id: bookId })
.then((book) => {
    if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé!' });
    }
    // Vérifiez si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find(
        (rating) => rating.userId === userId,
    );
    if (existingRating) {
        return res
            .status(400)
            .json({ error: 'Vous avez déjà noté ce livre!' });
    }
    // Ajoutez la nouvelle note
    const newRating = { userId, grade };
    book.ratings.push(newRating);
    // Recalcule la note moyenne
    const totalRating = book.ratings.reduce(
        (acc, rating) => acc + rating.grade,
        0,
    ); // Calcule le total des notes
    book.averageRating = parseFloat((totalRating / book.ratings.length).toFixed(1)); // Calcule la moyenne des notes et l'arrondit à une décimale
    // Sauvegarde le livre avec la nouvelle note ajoutée et la note moyenne recalculée
    book.save()
        .then((savedBook) => {
            res.status(200).json(savedBook); // Répond avec le livre sauvegardé
        })
        .catch((error) => {
            res.status(500).json({
                error: 'Erreur lors de la sauvegarde du livre.',
            }); // Gère les erreurs de sauvegarde
        });
})
.catch((error) => {
    res.status(500).json({
        error: 'Erreur lors de la recherche du livre.',
    }); // Gère les erreurs de recherche du livre
});
};

// GET => Récupération des livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
    Book.find() // Trouve tous les livres dans la base de données
        .sort({ averageRating: -1 }) // Trie par note moyenne décroissante
        .limit(3) // Limite le résultat aux 3 livres ayant les meilleures notes moyennes
        .then((books) => res.status(200).json(books)) // Envoie les livres triés en réponse avec un statut 200
        .catch((error) => res.status(400).json({ error })); // Gère les erreurs et envoie un message d'erreur avec un statut 400
};
