'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '#contact' },
] as const;

function SunIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="nav-theme-toggle" style={{ width: 36, height: 36 }} />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      className="nav-theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

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

          <ThemeToggle />

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
