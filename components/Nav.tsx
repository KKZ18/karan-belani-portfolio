'use client';

import { useState } from 'react';
import Link from 'next/link';

function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '#contact' },
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            Karan<span>.</span>Belani
          </a>

          <ul className="nav-desktop-links">
            {LINKS.map(l =>
              l.href.startsWith('/') ? (
                <li key={l.label}>
                  <Link href={l.href} className="nav-link">{l.label}</Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} className="nav-link">{l.label}</a>
                </li>
              )
            )}
          </ul>

          <a href="#contact" className="nav-cta nav-desktop-cta">Get in Touch</a>

          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: open ? 'rotate(45deg) translate(4px,5px)' : undefined }} />
            <span style={{ opacity: open ? 0 : 1 }} />
            <span style={{ transform: open ? 'rotate(-45deg) translate(4px,-5px)' : undefined }} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {LINKS.map(l =>
          l.href.startsWith('/') ? (
            <Link key={l.label} href={l.href} className="mobile-menu-link" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.href} className="mobile-menu-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          )
        )}
      </div>
    </>
  );
}
