import { client } from '@/tina/__generated__/client';
import Nav from '@/components/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Certifications from '@/components/sections/Certifications';
import BlogPreview, { type PostNode } from '@/components/sections/BlogPreview';
import Contact from '@/components/sections/Contact';
import type { Metadata } from 'next';
import type { HeroContent } from '@/components/sections/Hero';
import type { AboutContent, Social } from '@/components/sections/About';
import type { CertificationsContent } from '@/components/sections/Certifications';
import type { ContactContent } from '@/components/sections/Contact';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Karan Belani',
  jobTitle: 'Network Security Engineer',
  url: SITE_URL,
  knowsAbout: ['Network Security', 'CCNA', 'CCNP SVPN', 'Routing', 'Switching', 'VPN', 'DMVPN', 'Cisco'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Karan Belani',
  url: SITE_URL,
  description: 'Network Security Engineer writing about routing, switching, VPN security, and network automation.',
  author: { '@type': 'Person', name: 'Karan Belani' },
};

export default async function Home() {
  let posts: PostNode[] = [];
  let hero: HeroContent | null = null;
  let about: AboutContent | null = null;
  let certifications: CertificationsContent | null = null;
  let contact: ContactContent | null = null;
  let socials: Social[] = [];

  try {
    const [postsResult, globalResult] = await Promise.all([
      client.queries.postListQuery(),
      client.queries.globalQuery({ relativePath: 'index.json' }),
    ]);

    const edges = postsResult.data?.postConnection?.edges ?? [];
    for (const edge of edges) {
      const n = edge?.node;
      if (!n) continue;
      posts.push({
        id: n.id,
        title: n.title,
        category: n.category,
        publishedAt: n.publishedAt ?? null,
        readTime: n.readTime ?? null,
        description: n.description ?? null,
        _sys: { filename: n._sys.filename },
      });
      if (posts.length === 3) break;
    }

    const g = globalResult.data?.global;
    if (g) {
      if (g.hero) {
        hero = {
          eyebrow:   g.hero.eyebrow   ?? '',
          tagline1:  g.hero.tagline1  ?? '',
          tagline2:  g.hero.tagline2  ?? '',
          cta1Label: g.hero.cta1Label ?? '',
          cta1Href:  g.hero.cta1Href  ?? '/blogs',
          cta2Label: g.hero.cta2Label ?? '',
          cta2Href:  g.hero.cta2Href  ?? '#contact',
        };
      }
      if (g.about) {
        socials = (g.about.socials ?? []).flatMap(s =>
          s ? [{ name: s.name ?? '', handle: s.handle ?? '', url: s.url ?? '#' }] : []
        );
        about = {
          headingLine1: g.about.headingLine1 ?? '',
          headingLine2: g.about.headingLine2 ?? '',
          bio:          g.about.bio          ?? '',
          stats: (g.about.stats ?? []).flatMap(s =>
            s ? [{ value: s.value ?? '', label: s.label ?? '' }] : []
          ),
          socials,
          resumeUrl: g.about.resumeUrl ?? null,
        };
      }
      if (g.certifications) {
        certifications = {
          items: (g.certifications.items ?? []).flatMap(item =>
            item ? [{
              name:      item.name      ?? '',
              fullName:  item.fullName  ?? '',
              issuer:    item.issuer    ?? '',
              year:      item.year      ?? '',
              image:     item.image     ?? '',
              credlyUrl: item.credlyUrl ?? '',
            }] : []
          ),
        };
      }
      if (g.contact) {
        contact = {
          heading:      g.contact.heading      ?? '',
          intro:        g.contact.intro        ?? '',
          responseTime: g.contact.responseTime ?? '',
        };
      }
    }
  } catch {
    // TinaCMS server unavailable — components fall back to built-in defaults
  }

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <main id="main-content">
        <Hero content={hero} />
        <hr className="section-divider" />
        <About content={about} />
        <Certifications content={certifications} />
        <hr className="section-divider" />
        <BlogPreview posts={posts} />
        <Contact content={contact} socials={socials} />
        <div className="site-footer">
          <div className="footer-inner">
            <span className="footer-copy">© 2025 Karan Belani — Network Engineer</span>
            <div className="footer-links">
              <a href="#about" className="footer-link">About</a>
              <a href="#certifications" className="footer-link">Certs</a>
              <a href="#blog" className="footer-link">Blog</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
