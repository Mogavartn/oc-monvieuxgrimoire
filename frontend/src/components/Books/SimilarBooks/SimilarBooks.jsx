import React from 'react';
import PropTypes from 'prop-types';
import { useAllBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './SimilarBooks.module.css';

function SimilarBooks({ genre }) {
  const { allBooks, loading, error } = useAllBooks();

  // Log pour vérifier les valeurs
  console.log('All books:', allBooks);
  console.log('Genre:', genre);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        Error loading books:
        {error.message}
      </p>
    );
  }

  const similarBooks = allBooks.filter((book) => book.genre === genre).slice(0, 3);

  // Log pour vérifier les livres similaires trouvés
  console.log('Similar books:', similarBooks);

  const similarBooksContent = similarBooks.length > 0 ? (
    similarBooks.map((book) => (
      // eslint-disable-next-line no-underscore-dangle
      <BookItem key={`book-${book.id || book._id}`} book={book} size={3} />
    ))
  ) : <h3>Aucun livre similaire</h3>;

  return (
    <section className={`content-container ${styles.SimilarBooks}`}>
      <h2>Livres similaires</h2>
      <div className={styles.List}>
        {similarBooksContent}
      </div>
    </section>
  );
}

SimilarBooks.propTypes = {
  genre: PropTypes.string.isRequired,
};

export default SimilarBooks;
