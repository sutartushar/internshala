import React from 'react';
import styles from './EmptyState.module.css';
import { BsSearch } from 'react-icons/bs';

export default function EmptyState({ onClear }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.illustration} aria-hidden="true">
        <BsSearch size={64} color="#006BFF" />
      </div>
      <h3 className={styles.heading}>No internships found</h3>
      <p className={styles.body}>
        Try adjusting your filters or search terms to see more results.
      </p>
      <button className={styles.btn} onClick={onClear}>
        Clear all filters
      </button>
    </div>
  );
}
