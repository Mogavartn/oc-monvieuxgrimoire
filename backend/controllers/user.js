const bcrypt = require('bcrypt'); // Module pour le hachage sécurisé des mots de passe
const jwt = require('jsonwebtoken'); // Module pour la création et la vérification des tokens JWT
const User = require('../models/User'); // Modèle d'utilisateur pour interagir avec la base de données

// POST => Création de compte
exports.signup = (req, res, next) => {
    bcrypt
        // Appel de la fonction de hachage de bcrypt dans le MDP (qui est "salé" 10 fois)
        .hash(req.body.password, 10)
        // Utilisation du hash pour créer un utilisateur
        .then((hash) => {
            // Création d'une instance du modèle User avec l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            // Enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'Utilisateur créé !' }),
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// POST => Connexion
exports.login = (req, res, next) => {
    // Vérification de l'existence de l'utilisateur dans notre base de données
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 401 (non autorisé)
                return res
                    .status(401)
                    .json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe entré avec le hash de la base de données
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        // Si le mot de passe n'est pas valide, renvoyer une erreur 401 (non autorisé)
                        return res
                            .status(401)
                            .json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si les informations sont valides, nous renvoyons une réponse contenant userId et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' },
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
