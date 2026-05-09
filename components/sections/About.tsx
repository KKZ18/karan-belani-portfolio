function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

const STATS = [
  ['2+', 'Years experience'],
  ['4', 'Certifications'],
  ['10+', 'Articles published'],
  ['∞', 'Lab hours'],
] as const;

const SOCIALS = [
  { name: 'LinkedIn', handle: 'Karan Belani' },
  { name: 'GitHub', handle: '@karanbelani' },
  { name: 'Twitter / X', handle: '@kbelani' },
] as const;

export default function About() {
  return (
    <section id="about">
      <div className="section">
        <div className="section-label">About</div>
        <h2 className="section-heading">
          Network Engineer.<br />Lifelong learner.
        </h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I&apos;m Karan, a Network Engineer focused on building, securing, and troubleshooting
              real-world networks. I work with technologies like routing, switching, VPNs, and
              network security across enterprise environments. This blog is where I share hands-on
              labs, configurations, and practical insights from my daily work — no theory overload,
              just real networking.
            </p>
            <div className="about-stats">
              {STATS.map(([num, label]) => (
                <div key={label} className="about-stat">
                  <div className="about-stat-num">{num}</div>
                  <div className="about-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--ink-3)', marginBottom: 14,
            }}>
              Find me online
            </div>
            <div className="about-links">
              {SOCIALS.map(s => (
                <a key={s.name} href="#" className="about-link">
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
            <button className="resume-btn">
              Download Resume <Arrow size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
