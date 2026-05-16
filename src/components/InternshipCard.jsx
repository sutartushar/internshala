import React, { useState } from 'react';
import styles from './InternshipCard.module.css';
import { BsGeoAlt, BsCalendar, BsClock, BsCurrencyRupee, BsBookmark, BsBookmarkFill } from 'react-icons/bs';


export default function InternshipCard({ internship }) {
  const [saved, setSaved] = useState(false);

  const {
    title, profile, company, companyLogo,
    locations, isRemote, duration, startDate,
    stipend, postedByLabel, deadline,
    isPremium, isPPO, isPartTime, labels,
    url,
  } = internship;

  const displayLocations = isRemote
    ? ['Work From Home']
    : locations.length > 0
    ? locations
    : ['Multiple Locations'];

  const initials = company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const logoColor = stringToColor(company);

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.logoWrap} style={{ '--logo-color': logoColor }}>
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={company}
              className={styles.logo}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className={styles.logoInitials}>{initials}</span>
          )}
        </div>

        <div className={styles.badges}>
          {isPremium && <span className={styles.badgePremium}>★ Featured</span>}
          {isPPO && <span className={styles.badgePPO}>PPO</span>}
          {isRemote && <span className={styles.badgeWFH}>Remote</span>}
          {isPartTime && <span className={styles.badgePartTime}>Part-time</span>}
        </div>

        <button
          className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? 'Remove from saved' : 'Save internship'}
        >
          {saved ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
        </button>
      </div>

      {/* ── Title & company ── */}
      <div className={styles.titleBlock}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.company}>{company}</p>
      </div>

      {/* ── Meta chips ── */}
      <div className={styles.metaGrid}>
        <MetaItem icon={<BsGeoAlt size={13} />} text={displayLocations.join(', ')} />
        <MetaItem icon={<BsCalendar size={13} />} text={startDate} />
        <MetaItem icon={<BsClock size={13} />} text={duration} />
        <MetaItem icon={<BsCurrencyRupee size={13} />} text={stipend} highlight />
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={`${styles.postedLabel} ${getPostedStyle(postedByLabel)}`}>
            {postedByLabel}
          </span>
          <span className={styles.deadline}>{deadline}</span>
        </div>
        <a
          href={url ? `https://internshala.com/internship/${url}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyBtn}
          aria-label={`Apply for ${title} at ${company}`}
        >
          Apply Now
        </a>
      </div>
    </article>
  );
}


function MetaItem({ icon, text, highlight }) {
  return (
    <div className={`${styles.metaItem} ${highlight ? styles.metaHighlight : ''}`}>
      <span className={styles.metaIcon}>{icon}</span>
      <span className={styles.metaText}>{text}</span>
    </div>
  );
}


function getPostedStyle(label) {
  if (!label) return '';
  if (label.toLowerCase() === 'today') return styles.postedToday;
  if (label.includes('day')) return styles.postedRecent;
  return styles.postedOld;
}

function stringToColor(str) {
  const PALETTE = [
    '#4F46E5', '#0891B2', '#059669', '#D97706',
    '#DC2626', '#7C3AED', '#DB2777', '#0284C7',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

