import { useState, useEffect } from 'react';
import { getAuthenticatedUser, getBestRatedBooks } from './common';

// eslint-disable-next-line import/prefer-default-export
export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuth(authenticated);
      setUserLoading(false);
    }
    getUserDetails();
  }, []);

  return { connectedUser, auth, userLoading };
}

export function useBestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState({});

  useEffect(() => {
    async function getRatedBooks() {
      const books = await getBestRatedBooks();
      setBestRatedBooks(books);
    }
    getRatedBooks();
  }, []);

  return { bestRatedBooks };
}

export function useFilePreview(file) {
  const fileInput = file[0] ?? [];
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (file && file[0]?.length > 0) {
      const newUrl = URL.createObjectURL(file[0][0]);

      if (newUrl !== imgSrc) {
        setImgSrc(newUrl);
      }
    }
  }, [fileInput[0]?.name]);

  return [imgSrc, setImgSrc];
}

// Définition du hook personnalisé useAllBooks
export function useAllBooks() {
// Déclaration des états pour stocker les livres, le statut de chargement et les erreurs éventuelles
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour effectuer un effet secondaire (appel API) lors du montage du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer les livres depuis l'API
    async function fetchBooks() {
      try {
        // Effectue une requête GET à l'API pour récupérer les livres
        const response = await fetch('http://localhost:4000/api/books');
        // Récupère la réponse en tant que texte
        const text = await response.text();
        console.log('API response text:', text);
        // Parse seulement si le texte n'est pas vide
        const data = text ? JSON.parse(text) : [];
        setAllBooks(data);
      } catch (err) {
        // Gestion des erreurs de parsing JSON et autres erreurs
        console.error('Error parsing JSON:', err);
        setError(err);
      } finally {
        // Mise à jour de l'état de chargement à false, qu'il y ait une erreur ou non
        setLoading(false);
      }
    }
    // Appel de la fonction pour récupérer les livres
    fetchBooks();
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois après le montage
  // Retourne les livres, l'état de chargement et les erreurs
  return { allBooks, loading, error };
}
