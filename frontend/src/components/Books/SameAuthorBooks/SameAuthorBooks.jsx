import React from 'react';
import { useBestRatedBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './SameAuthorBooks.module.css';

function SameAuthorBooks() {
  const { bestRatedBooks } = useBestRatedBooks();

  const SameAuthorBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.map((elt) => <BookItem key={`book-${elt.id}`} book={elt} size={3} />)
  ) : <h3>Aucune recommendation</h3>;

  return (
    <section className={`content-container ${styles.SameAuthorBooks}`}>
      <h2>Du même auteur</h2>
      <div className={styles.List}>
        {SameAuthorBooksContent}
      </div>
    </section>
  );
}

export default SameAuthorBooks;
