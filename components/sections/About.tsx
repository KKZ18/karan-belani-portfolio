function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export type Social = { name: string; handle: string; url: string };
export type Stat   = { value: string; label: string };

export type AboutContent = {
  headingLine1: string;
  headingLine2: string;
  bio:          string;
  stats:        Stat[];
  socials:      Social[];
  resumeUrl?:   string | null;
};

const DEFAULTS: AboutContent = {
  headingLine1: 'Network Engineer.',
  headingLine2: 'Lifelong learner.',
  bio: "I'm Karan, a Network Engineer focused on building, securing, and troubleshooting real-world networks.",
  stats: [
    { value: '2+',  label: 'Years experience' },
    { value: '4',   label: 'Certifications' },
    { value: '10+', label: 'Articles published' },
    { value: '∞',   label: 'Lab hours' },
  ],
  socials: [
    { name: 'LinkedIn', handle: 'Karan Belani', url: '#' },
  ],
};

export default function About({ content }: { content?: AboutContent | null }) {
  const c = { ...DEFAULTS, ...content };

  return (
    <section id="about">
      <div className="section">
        <div className="section-label">About</div>
        <h2 className="section-heading">
          {c.headingLine1}<br />{c.headingLine2}
        </h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>{c.bio}</p>
            <div className="about-stats">
              {c.stats.map(s => (
                <div key={s.label} className="about-stat">
                  <div className="about-stat-num">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--ink-3)', marginBottom: 14,
            }}>
              Find me online
            </div>
            <div className="about-links">
              {c.socials.map(s => (
                <a
                  key={s.name}
                  href={s.url || '#'}
                  className="about-link"
                  target={s.url && s.url !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <div className="about-link-left">
                    <div className="about-link-dot" />
                    <div>
                      <div className="about-link-name">{s.name}</div>
                      <div className="about-link-handle">{s.handle}</div>
                    </div>
                  </div>
                  <Arrow size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
