import { useState, useEffect } from 'react';

const API_URL = 'https://internshala.com/hiring/search';


export function useInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchInternships() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        const raw = data?.internships_meta ?? {};
        const normalized = Object.values(raw).map(normalizeInternship);
        setInternships(normalized);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch internships');
          setInternships(getMockInternships());
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInternships();
    return () => controller.abort();
  }, []);

  return { internships, loading, error };
}


function normalizeInternship(raw) {
  return {
    id: raw.id,
    title: raw.title ?? '',
    profile: raw.profile_name ?? '',
    company: raw.company_name ?? '',
    companyLogo: raw.company_logo
      ? `https://internshala-uploads.internshala.com/logo/${raw.company_logo}`
      : null,
    companyUrl: raw.company_url ?? '',
    locations: (raw.location_names ?? []).slice(0, 3),
    isRemote: raw.work_from_home ?? false,
    duration: raw.duration ?? '',
    startDate: raw.start_date ?? '',
    stipend: raw.stipend?.salary ?? 'Unpaid',
    stipendValue: raw.stipend?.salaryValue1 ?? 0,
    postedOn: raw.posted_on ?? '',
    postedByLabel: raw.posted_by_label ?? '',
    deadline: raw.expiring_in ?? '',
    isPremium: raw.is_premium ?? false,
    isPPO: raw.is_ppo ?? false,
    isPartTime: raw.part_time ?? false,
    isInternational: raw.is_international_job ?? false,
    url: raw.url ?? '',
    labels: (raw.labels?.[0]?.label_value ?? []).filter(Boolean),
  };
}

