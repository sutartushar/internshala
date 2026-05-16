/**
 * filterInternships
 * Applies all active filters to the internship list in the frontend.
 * This is pure filtering logic – no API calls made.
 *
 * @param {Array}  internships  - Full list of normalised internship objects
 * @param {Object} filters      - Active filter state
 * @param {string} searchQuery  - Free-text search string
 * @returns {Array} filtered list
 */
export function filterInternships(internships, filters, searchQuery) {
  return internships.filter((item) => {
    // --- Free-text search ---
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const haystack = [item.title, item.profile, item.company, ...item.locations]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // --- Profile filter ---
    if (filters.profiles.length > 0) {
      const match = filters.profiles.some((p) =>
        item.profile.toLowerCase().includes(p.toLowerCase())
      );
      if (!match) return false;
    }

    // --- Location filter (supports "Work From Home") ---
    if (filters.locations.length > 0) {
      const wfhSelected = filters.locations.includes('Work From Home');
      const cityFilters = filters.locations.filter((l) => l !== 'Work From Home');

      const locationMatch =
        (wfhSelected && item.isRemote) ||
        cityFilters.some((loc) =>
          item.locations.some((l) => l.toLowerCase().includes(loc.toLowerCase()))
        );

      if (!locationMatch) return false;
    }

    // --- Duration filter (stored as "X Months" strings) ---
    if (filters.durations.length > 0) {
      const months = parseDurationMonths(item.duration);
      const match = filters.durations.some((d) => {
        const range = DURATION_RANGES[d];
        if (!range) return false;
        return months >= range.min && months <= range.max;
      });
      if (!match) return false;
    }

    // --- Stipend filter ---
    if (filters.stipend !== null) {
      if (item.stipendValue < filters.stipend) return false;
    }

    return true;
  });
}

/** Parse "3 Months" → 3, "1 Month" → 1, handles edge cases */
function parseDurationMonths(duration) {
  if (!duration) return 0;
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export const DURATION_RANGES = {
  '1 Month':    { min: 1, max: 1 },
  '2 Months':   { min: 2, max: 2 },
  '3 Months':   { min: 3, max: 3 },
  '4-6 Months': { min: 4, max: 6 },
  '6+ Months':  { min: 7, max: 99 },
};

export const STIPEND_OPTIONS = [
  { label: '₹ 2,000+',  value: 2000 },
  { label: '₹ 5,000+',  value: 5000 },
  { label: '₹ 10,000+', value: 10000 },
  { label: '₹ 20,000+', value: 20000 },
  { label: '₹ 40,000+', value: 40000 },
];

/**
 * Extract unique values for filter chips from the fetched internship list.
 */
export function extractFilterOptions(internships) {
  const profiles  = new Set();
  const locations = new Set(['Work From Home']);

  internships.forEach((item) => {
    if (item.profile) profiles.add(item.profile);
    item.locations.forEach((l) => locations.add(l));
  });

  return {
    profiles:  Array.from(profiles).sort(),
    locations: Array.from(locations).sort(),
  };
}
