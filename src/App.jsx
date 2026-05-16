import React, { useState, useMemo, useCallback } from 'react';
import styles from './App.module.css';
import { BsFilter } from 'react-icons/bs';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import InternshipCard from './components/InternshipCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';

import { useInternships } from './hooks/useInternships';
import { filterInternships, extractFilterOptions } from './utils/filterInternships';

const INITIAL_FILTERS = {
  profiles:  [],
  locations: [],
  durations: [],
  stipend:   null,
};

export default function App() {
  const { internships, loading, error } = useInternships();
  const [filters, setFilters]           = useState(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortBy, setSortBy]             = useState('recent');
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const filterOptions = useMemo(
    () => extractFilterOptions(internships),
    [internships]
  );
  const filtered = useMemo(() => {
    let results = filterInternships(internships, filters, searchQuery);
    if (sortBy === 'stipend') {
      results = [...results].sort((a, b) => b.stipendValue - a.stipendValue);
    } else if (sortBy === 'recent') {
      results = [...results].sort((a, b) => b.id - a.id);
    }

    return results;
  }, [internships, filters, searchQuery, sortBy]);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
  }, []);


  return (
    <div className={styles.appRoot}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <main className={styles.main} id="internships">
        <div className={styles.container}>
          {/* ── Results header ── */}
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>
              {loading ? (
                <div className={styles.countShimmer} />
              ) : (
                <h2 className={styles.countText}>
                  <span className={styles.countNum}>{filtered.length}</span>{' '}
                  internship{filtered.length !== 1 ? 's' : ''} found
                </h2>
              )}
            </div>

            <div className={styles.headerActions}>
              {/* Sort dropdown */}
              <div className={styles.sortWrap}>
                <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
                <select
                  id="sort-select"
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most recent</option>
                  <option value="stipend">Highest stipend</option>
                </select>
              </div>

              {/* Mobile filter toggle */}
              <button
                className={styles.filterToggle}
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle filters"
                aria-expanded={sidebarOpen}
              >
                <BsFilter size={18} />
                Filters
                {hasActiveFilters && <span className={styles.filterDot} />}
              </button>
            </div>
          </div>

     
          {error && !loading && (
            <div className={styles.errorBanner} role="alert">
              <span>⚠ Could not reach the Internshala API – showing demo data instead.</span>
            </div>
          )}

          {/* ── Layout: sidebar + cards ── */}
          <div className={styles.layout}>
            {/* Sidebar filter panel */}
            <div
              className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
            >
              {/* Mobile overlay backdrop */}
              <div
                className={styles.backdrop}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <div className={styles.sidebarInner}>
                {sidebarOpen && (
                  <button
                    className={styles.closeSidebar}
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close filters"
                  >
                    ✕ Close
                  </button>
                )}
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  options={filterOptions}
                  onClear={() => setFilters(INITIAL_FILTERS)}
                />
              </div>
            </div>

            {/* Results grid */}
            <section className={styles.results} aria-label="Internship listings">
              {loading ? (
                <LoadingSkeleton count={6} />
              ) : filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <div className={styles.grid}>
                  {filtered.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

