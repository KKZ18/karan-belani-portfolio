import { client } from '@/tina/__generated__/client';
import Nav from '@/components/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Certifications from '@/components/sections/Certifications';
import BlogPreview, { type PostNode } from '@/components/sections/BlogPreview';
import Contact from '@/components/sections/Contact';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let posts: PostNode[] = [];

  try {
    const result = await client.queries.postListQuery();
    const edges = result.data?.postConnection?.edges ?? [];
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
  } catch {
    // TinaCMS server unavailable at build time
  }

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <hr className="section-divider" />
        <About />
        <Certifications />
        <hr className="section-divider" />
        <BlogPreview posts={posts} />
        <Contact />
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
