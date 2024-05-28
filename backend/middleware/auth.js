const jwt = require('jsonwebtoken'); // Module pour la création et la vérification des tokens JWT

// Middleware d'authentification
module.exports = (req, res, next) => {
    try {
        // Extraction du token du header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extraction de l'ID de l'utilisateur qui est maintenant authentifié
        const userId = decodedToken.userId;
        // Attribution de l'ID de l'utilisateur à la propriété "auth" de l'objet "req"
        req.auth = {
            userId: userId,
        };
        // Appel du prochain middleware
        next();
    } catch (error) {
        // Gestion des erreurs d'authentification
        res.status(401).json({ error });
    }
};