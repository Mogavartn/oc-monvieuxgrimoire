import React from 'react';
import PropTypes from 'prop-types';
import { useAllBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './SameAuthorBooks.module.css';

function SameAuthorBooks({ author }) {
  const { allBooks, loading, error } = useAllBooks();

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

  const sameAuthorBooks = allBooks.filter((book) => book.author === author).slice(0, 3);

  const sameAuthorBooksContent = sameAuthorBooks.length > 0 ? (
    sameAuthorBooks.map((book) => (
      // eslint-disable-next-line no-underscore-dangle
      <BookItem key={`book-${book.id || book._id}`} book={book} size={3} />
    ))
  ) : <h3>Aucun livre du même auteur</h3>;

  return (
    <section className={`content-container ${styles.SameAuthorBooks}`}>
      <h2>Du même auteur</h2>
      <div className={styles.List}>
        {sameAuthorBooksContent}
      </div>
    </section>
  );
}

SameAuthorBooks.propTypes = {
  author: PropTypes.string.isRequired,
};

export default SameAuthorBooks;
