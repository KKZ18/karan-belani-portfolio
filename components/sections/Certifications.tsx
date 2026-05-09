'use client';

import { useState } from 'react';

function Arrow({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

const CERTS = [
  { abbr: 'CCNA', name: 'Cisco Certified Network Associate', issuer: 'Cisco', date: '2023', cat: 'Cisco' },
  { abbr: 'CCNP\nENT', name: 'CCNP Enterprise', issuer: 'Cisco', date: '2024', cat: 'Cisco' },
  { abbr: 'SEC+', name: 'CompTIA Security+', issuer: 'CompTIA', date: '2023', cat: 'Security' },
  { abbr: 'CyberOps\nAssoc', name: 'Cisco CyberOps Associate', issuer: 'Cisco', date: '2024', cat: 'Security' },
] as const;

const CATS = ['All', 'Cisco', 'Security'] as const;

export default function Certifications() {
  const [filter, setFilter] = useState<string>('All');
  const filtered = filter === 'All' ? CERTS : CERTS.filter(c => c.cat === filter);

  return (
    <div className="certs-section" id="certifications">
      <div className="section">
        <div className="section-label">Credentials</div>
        <h2 className="section-heading">Certifications.</h2>
        <div className="filter-bar">
          {CATS.map(c => (
            <button
              key={c}
              className={`filter-pill${filter === c ? ' active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="certs-grid">
          {filtered.map(c => (
            <div key={c.name} className="cert-card">
              <div className="cert-badge-wrap" style={{ whiteSpace: 'pre-line' }}>{c.abbr}</div>
              <div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-issuer">{c.issuer}</div>
              </div>
              <div className="cert-footer">
                <span className="cert-date">{c.date}</span>
                <span className="cert-verify">Verify <Arrow size={10} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
