import React from 'react';
import { useBestRatedBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './SimilarBooks.module.css';

function SimilarBooks() {
  const { bestRatedBooks } = useBestRatedBooks();

  const SimilarBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.map((elt) => <BookItem key={`book-${elt.id}`} book={elt} size={3} />)
  ) : <h3>Aucune recommendation</h3>;

  return (
    <section className={`content-container ${styles.SimilarBooks}`}>
      <h2>Livres similaires</h2>
      <div className={styles.List}>
        {SimilarBooksContent}
      </div>
    </section>
  );
}

export default SimilarBooks;
