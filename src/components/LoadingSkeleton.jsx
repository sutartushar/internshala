import React from 'react';
import styles from './LoadingSkeleton.module.css';


export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card} style={{ animationDelay: `${i * 60}ms` }}>
          <div className={styles.topRow}>
            <div className={`${styles.shimmer} ${styles.logo}`} />
            <div className={styles.badges}>
              <div className={`${styles.shimmer} ${styles.badgeShim}`} />
              <div className={`${styles.shimmer} ${styles.badgeShim} ${styles.short}`} />
            </div>
          </div>
          <div className={`${styles.shimmer} ${styles.title}`} />
          <div className={`${styles.shimmer} ${styles.subtitle}`} />
          <div className={styles.metaRow}>
            <div className={`${styles.shimmer} ${styles.meta}`} />
            <div className={`${styles.shimmer} ${styles.meta}`} />
          </div>
          <div className={styles.metaRow}>
            <div className={`${styles.shimmer} ${styles.meta}`} />
            <div className={`${styles.shimmer} ${styles.meta}`} />
          </div>
          <div className={styles.footer}>
            <div className={`${styles.shimmer} ${styles.footerLeft}`} />
            <div className={`${styles.shimmer} ${styles.footerBtn}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
