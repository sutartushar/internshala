import React from 'react';
import styles from './ActiveFilters.module.css';

/**
 * ActiveFilters
 * Shows removable chips for each active filter, plus a "Clear all" option.
 * Rendered above the results list for quick visibility.
 */
export default function ActiveFilters({ filters, onRemove, onClearAll }) {
  const chips = buildChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className={styles.bar} aria-label="Active filters">
      <span className={styles.label}>Active filters:</span>
      <div className={styles.chips}>
        {chips.map((chip) => (
          <button
            key={chip.key}
            className={styles.chip}
            onClick={() => onRemove(chip)}
            aria-label={`Remove filter: ${chip.label}`}
          >
            {chip.label}
            <span className={styles.remove} aria-hidden="true">✕</span>
          </button>
        ))}
      </div>
      <button className={styles.clearAll} onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}

function buildChips(filters) {
  const chips = [];
  filters.profiles.forEach((p) =>  chips.push({ key: `profile:${p}`,   label: p,       type: 'profiles',  value: p }));
  filters.locations.forEach((l) => chips.push({ key: `location:${l}`,  label: l,       type: 'locations', value: l }));
  filters.durations.forEach((d) => chips.push({ key: `duration:${d}`,  label: d,       type: 'durations', value: d }));
  if (filters.stipend !== null)    chips.push({ key: 'stipend',         label: `₹ ${filters.stipend.toLocaleString()}+`, type: 'stipend', value: null });
  return chips;
}
