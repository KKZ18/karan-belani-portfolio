'use client';

import { useState, useEffect, useRef } from 'react';

function Arrow({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export type CertItem = {
  name:     string;
  fullName: string;
  issuer:   string;
  year:     string;
  image:    string;
};

export type CertificationsContent = {
  items: CertItem[];
};

const DEFAULTS: CertificationsContent = {
  items: [
    {
      name:     'CCNA',
      fullName: 'Cisco Certified Network Associate',
      issuer:   'Cisco',
      year:     '2023',
      image:    '/certs/ccna.jpg',
    },
    {
      name:     'CCNP SVPN',
      fullName: 'Implementing Secure Solutions with Virtual Private Networks',
      issuer:   'Cisco',
      year:     '2024',
      image:    '/certs/ccnp-svpn.jpg',
    },
  ],
};

function CertModal({ cert, onClose }: { cert: CertItem; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="cert-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.name} certificate`}
    >
      <div className="cert-modal" onClick={e => e.stopPropagation()}>
        <button
          ref={closeRef}
          className="cert-modal-close"
          onClick={onClose}
          aria-label="Close certificate modal"
        >
          ×
        </button>
        <div className="cert-modal-meta">
          <span className="cert-modal-name">{cert.name}</span>
          <span className="cert-modal-issuer">{cert.issuer} · {cert.year}</span>
        </div>
        <div className="cert-modal-img-wrap">
          {imgError ? (
            <div className="cert-modal-placeholder">
              <span>{cert.name}</span>
            </div>
          ) : (
            <img
              src={cert.image}
              alt={`${cert.fullName} certificate`}
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certifications({ content }: { content?: CertificationsContent | null }) {
  const items = content?.items?.length ? content.items : DEFAULTS.items;
  const [modal, setModal] = useState<CertItem | null>(null);

  return (
    <div className="certs-section" id="certifications">
      <div className="section">
        <div className="section-label">Credentials</div>
        <h2 className="section-heading">Certifications.</h2>

        <div className="certs-grid" style={{ marginTop: 40 }}>
          {items.map(cert => (
            <div
              key={cert.name}
              className="cert-card"
              onClick={() => setModal(cert)}
              role="button"
              tabIndex={0}
              aria-label={`View ${cert.name} certificate`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setModal(cert); }}
            >
              <div className="cert-badge-wrap">{cert.name}</div>
              <div>
                <div className="cert-name">{cert.fullName}</div>
                <div className="cert-issuer">{cert.issuer}</div>
              </div>
              <div className="cert-footer">
                <span className="cert-date">{cert.year}</span>
                <span className="cert-verify">View Cert <Arrow size={10} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <CertModal cert={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
