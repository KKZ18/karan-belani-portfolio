import Link from 'next/link';
import NetworkGlobe from '@/components/ui/NetworkGlobe';

function Arrow({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />
      <div className="hero-bg-glow" />
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            Network Security Engineer
          </div>
          <h1 className="hero-title">
            Karan<br />Belani<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="hero-tagline">
            Building and breaking networks.<br />
            <span>Writing about both.</span>
          </p>
          <div className="hero-ctas">
            <Link href="/blogs" className="btn-primary">
              Read Blog <Arrow size={13} />
            </Link>
            <a href="#contact" className="btn-ghost">Get in Touch</a>
          </div>
        </div>
        <div className="hero-right">
          <NetworkGlobe />
        </div>
      </div>
      <div className="hero-scroll">
        <div className="hero-scroll-bar" />
        Scroll
      </div>
    </section>
  );
}
