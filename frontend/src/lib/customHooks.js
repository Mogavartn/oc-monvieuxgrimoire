import { useState, useEffect } from 'react';
import { API_ROUTES } from './constants';

export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      try {
        const response = await fetch(API_ROUTES.SIGN_IN);
        const { authenticated, user } = await response.json();
        setConnectedUser(user);
        setAuth(authenticated);
        setUserLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    getUserDetails();
  }, []);

  return { connectedUser, auth, userLoading };
}

export function useBestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState({});

  useEffect(() => {
    async function getRatedBooks() {
      try {
        const response = await fetch(API_ROUTES.BEST_RATED);
        const books = await response.json();
        setBestRatedBooks(books);
      } catch (error) {
        console.error('Error fetching best rated books:', error);
      }
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

export function useAllBooks() {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(API_ROUTES.BOOKS);
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        setAllBooks(data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return { allBooks, loading, error };
}