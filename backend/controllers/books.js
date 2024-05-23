const fs = require('fs');
const sharp = require('sharp');
const Book = require('../models/Book');

// Logique métier - Contrôleur

// POST => Enregistrement d'un livre
exports.createBook = (req, res, next) => {
    // Stockage de la requête sous forme de JSON dans une constante (requête sous la forme form-data à l'origine)
    const bookObject = JSON.parse(req.body.book);
    // Suppression du faux _id envoyé par le front
    delete bookObject._id;
    // Suppression de _userId auquel on ne peut faire confiance
    delete bookObject._userId;

    // Chemin du fichier image téléchargé
    const inputFilePath = req.file.path;
    // Nouveau chemin du fichier image transformé
    const outputFilePath = `${req.file.path.split('.')[0]}.webp`;

    // Utilisation de sharp pour redimensionner et convertir l'image
    sharp(inputFilePath)
        .resize(463, 595)
        .toFormat('webp')
        .toFile(outputFilePath)
        .then(() => {
            // Suppression de l'image originale non redimensionnée
            fs.unlink(inputFilePath, (err) => {
                if (err) console.log(err);
            });

            // Création d'une instance du modèle Book avec l'image transformée
            const book = new Book({
                ...bookObject,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${outputFilePath.split('/').pop()}`,
            });

            // Enregistrement dans la base de données
            book.save()
                .then(() => {
                    res.status(201).json({ message: 'Livre enregistré !' });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            res.status(500).json({
                error: "Erreur lors du traitement de l'image",
            });
        });
};

// GET => Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

// PUT => Modification d'un livre existant
exports.modifyBook = (req, res, next) => {
    // Stockage de la requête en JSON dans une constante
    // (ici, nous recevons soit un élément form-data, soit des données JSON, selon si le fichier image a été modifié ou non)
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
        : { ...req.body };
    // Suppression de _userId auquel on ne peut faire confiance
    delete bookObject._userId;
    // Récupération du livre existant à modifier
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Le livre ne peut être mis à jour que par le créateur de sa fiche
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
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
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id },
                )
                    .then(() =>
                        res.status(200).json({ message: 'Livre modifié!' }),
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// DELETE => Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    // Récupération du livre à supprimer
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Le livre ne peut être supprimé que par le créateur de sa fiche
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                // Séparation du nom du fichier image
                const filename = book.imageUrl.split('/images/')[1];
                // Suppression du fichier image puis suppression du livre dans la base de données dans la callback
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Livre supprimé !',
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// GET => Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    // Renvoie un tableau contenant tous les Books de la base de données
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};
