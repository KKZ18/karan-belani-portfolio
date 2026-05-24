import Link from 'next/link';
import NetworkGlobe from '@/components/ui/NetworkGlobe';

function Arrow({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export type HeroContent = {
  eyebrow:   string;
  tagline1:  string;
  tagline2:  string;
  cta1Label: string;
  cta1Href:  string;
  cta2Label: string;
  cta2Href:  string;
};

const DEFAULTS: HeroContent = {
  eyebrow:   'Network Security Engineer',
  tagline1:  'Building and breaking networks.',
  tagline2:  'Writing about both.',
  cta1Label: 'Read Blog',
  cta1Href:  '/blogs',
  cta2Label: 'Get in Touch',
  cta2Href:  '#contact',
};

export default function Hero({ content }: { content?: HeroContent | null }) {
  const c = { ...DEFAULTS, ...content };

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />
      <div className="hero-bg-glow" />
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            {c.eyebrow}
          </div>
          <h1 className="hero-title">
            Karan<br />Belani<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="hero-tagline">
            {c.tagline1}<br />
            <span>{c.tagline2}</span>
          </p>
          <div className="hero-ctas">
            <Link href={c.cta1Href} className="btn-primary">
              {c.cta1Label} <Arrow size={13} />
            </Link>
            <a href={c.cta2Href} className="btn-ghost">{c.cta2Label}</a>
          </div>
        </div>
        <div className="hero-right">
          <NetworkGlobe />
        </div>
      </div>
    </section>
  );
}
