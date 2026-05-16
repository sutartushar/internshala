import React from 'react';
import styles from './SearchBar.module.css';
import { BsSearch } from 'react-icons/bs';


export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.heroText}>
        <h1 className={styles.heading}>
          Find Your Perfect <span className={styles.highlight}>Internship</span>
        </h1>
        <p className={styles.subheading}>
          Explore thousands of internships across India's top companies
        </p>
      </div>

      <div className={styles.searchBox}>
        <span className={styles.icon} aria-hidden="true">
          <BsSearch size={18} />
        </span>
        <input
          type="search"
          className={styles.input}
          placeholder="Search by profile, company, or location…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search internships"
        />
        {value && (
          <button
            className={styles.clearBtn}
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
