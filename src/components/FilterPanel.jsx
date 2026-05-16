import React, { useState } from 'react';
import styles from './FilterPanel.module.css';
import { DURATION_RANGES, STIPEND_OPTIONS } from '../utils/filterInternships';
import { BsBriefcase, BsGeoAlt, BsClock, BsCurrencyRupee, BsChevronDown } from 'react-icons/bs';

export default function FilterPanel({ filters, onChange, options, onClear }) {
  return (
    <aside className={styles.panel} aria-label="Filter internships">
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters(filters) && (
          <button className={styles.clearAll} onClick={onClear} aria-label="Clear all filters">
            Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Profile"
        icon={<BsBriefcase size={14} />}
        count={filters.profiles.length}
      >
        <CheckboxGroup
          items={options.profiles}
          selected={filters.profiles}
          onChange={(val) => toggleArrayFilter(filters, onChange, 'profiles', val)}
        />
      </FilterSection>

      <FilterSection
        title="Location"
        icon={<BsGeoAlt size={14} />}
        count={filters.locations.length}
      >
        <CheckboxGroup
          items={options.locations}
          selected={filters.locations}
          onChange={(val) => toggleArrayFilter(filters, onChange, 'locations', val)}
        />
      </FilterSection>

      <FilterSection
        title="Duration"
        icon={<BsClock size={14} />}
        count={filters.durations.length}
      >
        <CheckboxGroup
          items={Object.keys(DURATION_RANGES)}
          selected={filters.durations}
          onChange={(val) => toggleArrayFilter(filters, onChange, 'durations', val)}
        />
      </FilterSection>

      <FilterSection
        title="Minimum Stipend"
        icon={<BsCurrencyRupee size={14} />}
        count={filters.stipend !== null ? 1 : 0}
      >
        <StipendSelector
          value={filters.stipend}
          onChange={(val) => onChange({ ...filters, stipend: val })}
        />
      </FilterSection>
    </aside>
  );
}


function FilterSection({ title, icon, count, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>{icon}</span>
          {title}
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}>
          <BsChevronDown size={14} />
        </span>
      </button>

      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

function CheckboxGroup({ items, selected, onChange }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 6);

  return (
    <div className={styles.checkboxGroup}>
      {visible.map((item) => {
        const checked = selected.includes(item);
        return (
          <label key={item} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={checked}
              onChange={() => onChange(item)}
              aria-label={item}
            />
            <span className={styles.checkboxCustom} />
            <span className={styles.checkboxText}>{item}</span>
          </label>
        );
      })}

      {items.length > 6 && (
        <button
          className={styles.showMore}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? '− Show less' : `+ ${items.length - 6} more`}
        </button>
      )}
    </div>
  );
}

function StipendSelector({ value, onChange }) {
  return (
    <div className={styles.stipendOptions}>
      {STIPEND_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            className={`${styles.stipendChip} ${active ? styles.stipendActive : ''}`}
            onClick={() => onChange(active ? null : opt.value)}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}


function toggleArrayFilter(filters, onChange, key, value) {
  const current = filters[key];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  onChange({ ...filters, [key]: next });
}

function hasActiveFilters(filters) {
  return (
    filters.profiles.length > 0 ||
    filters.locations.length > 0 ||
    filters.durations.length > 0 ||
    filters.stipend !== null
  );
}


