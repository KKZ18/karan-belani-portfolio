import { client } from '@/tina/__generated__/client';
import Nav from '@/components/Nav';
import BlogList, { type BlogPost, type BlogCategory } from '@/components/blog/BlogList';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles on network routing, switching, VPN security, and Cisco lab setups. Notes from a Network Security Engineer.',
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    type: 'website',
    title: 'Blog | Karan Belani',
    description: 'Technical articles on network routing, switching, VPN security, and Cisco lab setups.',
    url: `${SITE_URL}/blogs`,
  },
};

export default async function BlogsPage() {
  let posts: BlogPost[] = [];
  let categories: BlogCategory[] = [];

  try {
    const [postsResult, catsResult] = await Promise.all([
      client.queries.postListQuery(),
      client.queries.categoryListQuery(),
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
    }

    const catEdges = catsResult.data?.categoryConnection?.edges ?? [];
    for (const edge of catEdges) {
      const n = edge?.node;
      if (!n) continue;
      categories.push({
        id: n.id,
        name: n.name,
        _sys: { filename: n._sys.filename },
      });
    }
  } catch {
    // TinaCMS server unavailable at build time
  }

  return (
    <>
      <Nav />
      <main id="main-content" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="section">
          <div className="blogs-page-header">
            <div>
              <div className="section-label">Writing</div>
              <h1 className="section-heading">All Articles.</h1>
            </div>
            <Link href="/#blog" className="view-all" style={{ alignSelf: 'flex-end' }}>
              ← Back to home
            </Link>
          </div>

          <BlogList posts={posts} categories={categories} />
        </div>

        <div className="site-footer">
          <div className="footer-inner">
            <span className="footer-copy">© 2026 Karan Belani — Network Engineer</span>
          </div>
        </div>
      </main>
    </>
  );
}
