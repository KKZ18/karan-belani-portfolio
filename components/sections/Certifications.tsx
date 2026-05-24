'use client';

function Arrow({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export type CertItem = {
  name:      string;
  fullName:  string;
  issuer:    string;
  year:      string;
  image:     string;
  credlyUrl?: string;
};

export type CertificationsContent = {
  items: CertItem[];
};

const DEFAULTS: CertificationsContent = {
  items: [
    {
      name:      'CCNA',
      fullName:  'Cisco Certified Network Associate',
      issuer:    'Cisco',
      year:      '2023',
      image:     '/uploads/icon/ccna-cert-logo.png',
      credlyUrl: 'https://www.credly.com/badges/eaa4d037-803a-4d65-9454-e91658a012c6/public_url',
    },
    {
      name:      'CCNP SCOR',
      fullName:  'Implementing and Operating Cisco Security Core Technologies',
      issuer:    'Cisco',
      year:      '2024',
      image:     '/uploads/icon/ccnp-scor-cert-logo.png',
      credlyUrl: 'https://www.credly.com/badges/153e3076-b0a9-4dd2-b2ab-7c2d9b2cc456/public_url',
    },
  ],
};

export default function Certifications({ content }: { content?: CertificationsContent | null }) {
  const items = content?.items?.length ? content.items : DEFAULTS.items;

  return (
    <div className="certs-section" id="certifications">
      <div className="section">
        <div className="section-label">Credentials</div>
        <h2 className="section-heading">Certifications.</h2>

        <div className="certs-grid" style={{ marginTop: 40 }}>
          {items.map(cert => (
            <a
              key={cert.name}
              className="cert-card"
              href={cert.credlyUrl || '#'}
              target={cert.credlyUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={`View ${cert.name} certificate on Credly`}
            >
              <div className="cert-badge-wrap">
                {cert.image ? (
                  <img src={cert.image} alt={cert.name} />
                ) : (
                  cert.name
                )}
              </div>
              <div>
                <div className="cert-name">{cert.fullName}</div>
                <div className="cert-issuer">{cert.issuer}</div>
              </div>
              <div className="cert-footer">
                <span className="cert-date">{cert.year}</span>
                <span className="cert-verify">View Cert <Arrow size={10} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
