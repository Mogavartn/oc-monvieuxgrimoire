const http = require('http'); // Importation du module HTTP Node.js pour créer un serveur HTTP
const app = require('./app'); // Importation de l'application Express définie dans le fichier app.js

// Fonction pour normaliser le port en un nombre entier ou une chaîne
const normalizePort = (val) => {
    const port = parseInt(val, 10); // Conversion de la valeur en nombre entier

    if (isNaN(port)) {
        return val; // Retourne la valeur telle quelle si ce n'est pas un nombre
    }
    if (port >= 0) {
        return port; // Retourne le port s'il est valide
    }
    return false; // Retourne faux pour les valeurs de port non valides
};

// Définition du port sur lequel l'application Express tourne
const port = normalizePort(process.env.PORT || '4000'); // Utilisation du port défini dans les variables d'environnement ou 4000 par défaut

// Attribution du port à l'application Express
app.set('port', port);

// Fonction de gestion des erreurs liées au serveur
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error; // Lance une exception si l'erreur ne concerne pas la fonction listen()
    }
    const address = server.address(); // Adresse du serveur
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Formate l'adresse du serveur pour l'affichage
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.'); // Affiche un message si l'accès au port nécessite des privilèges élevés
            process.exit(1); // Quitte le processus avec un code d'erreur
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.'); // Affiche un message si le port est déjà utilisé
            process.exit(1); // Quitte le processus avec un code d'erreur
            break;
        default:
            throw error; // Lance une exception pour les autres erreurs
    }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// Gestionnaire d'événements pour les erreurs et les écoutes du serveur
server.on('error', errorHandler); // Écoute les erreurs et exécute le gestionnaire d'erreurs défini ci-dessus
server.on('listening', () => {
    // Événement de démarrage d'écoute du serveur
    const address = server.address(); // Adresse du serveur
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Formate l'adresse du serveur pour l'affichage
    console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute sur le port spécifié
});

// Le serveur écoute soit le port par défaut, soit le port 4000
server.listen(port); // Mise en écoute du serveur sur le port spécifié
