import { client } from '@/tina/__generated__/client';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import PostBody from '@/components/blog/PostBody';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';

const CATEGORY_LABELS: Record<string, string> = {
  'routing-switching': 'Routing & Switching',
  'network-security': 'Network Security',
  labs: 'Labs',
  'ccnp-svpn': 'CCNP SVPN',
  ccna: 'CCNA',
  CCNP_SISE: 'CCNP SISE',
};

const CATEGORY_TAG_CLASS: Record<string, string> = {
  'routing-switching': 'tag-routing',
  'network-security': 'tag-security',
  labs: 'tag-labs',
  'ccnp-svpn': 'tag-security',
  ccna: 'tag-routing',
  CCNP_SISE: 'tag-security',
};

function categoryLabel(slug: string) { return CATEGORY_LABELS[slug] ?? slug; }
function tagClass(slug: string) { return CATEGORY_TAG_CLASS[slug] ?? 'tag-routing'; }

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function Arrow({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

type RelatedPost = {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  _sys: { filename: string };
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await client.queries.postQuery({ relativePath: `${slug}.mdx` });
    const post = result.data?.post;
    if (!post) return {};
    const url = `${SITE_URL}/blogs/${slug}`;
    return {
      title: post.title,
      description: post.description ?? undefined,
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.description ?? undefined,
        url,
        publishedTime: post.publishedAt ?? undefined,
        authors: ['Karan Belani'],
        tags: [post.category],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description ?? undefined,
      },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const result = await client.queries.postListQuery();
    return (result.data?.postConnection?.edges ?? []).flatMap(e =>
      e?.node ? [{ slug: e.node._sys.filename }] : []
    );
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  type PostData = {
    title: string;
    category: string;
    publishedAt?: string | null;
    readTime?: string | null;
    description?: string | null;
    body?: unknown;
  };

  let post: PostData | null = null;
  let related: RelatedPost[] = [];

  try {
    const [postResult, allPostsResult] = await Promise.all([
      client.queries.postQuery({ relativePath: `${slug}.mdx` }),
      client.queries.postListQuery(),
    ]);

    const p = postResult.data?.post;
    if (!p) notFound();

    post = {
      title: p.title,
      category: p.category,
      publishedAt: p.publishedAt ?? null,
      readTime: p.readTime ?? null,
      description: p.description ?? null,
      body: p.body,
    };

    const allEdges = allPostsResult.data?.postConnection?.edges ?? [];
    related = allEdges
      .flatMap(e =>
        e?.node
          ? [{
              id: e.node.id,
              title: e.node.title,
              category: e.node.category,
              description: e.node.description ?? null,
              _sys: { filename: e.node._sys.filename },
            }]
          : []
      )
      .filter(p => p.category === post!.category && p._sys.filename !== slug)
      .slice(0, 3);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    author: { '@type': 'Person', name: 'Karan Belani', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Karan Belani', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blogs/${slug}` },
    keywords: post.category,
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <main id="main-content" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="section post-section">
          <Link href="/blogs" className="post-back">← All posts</Link>

          <header className="post-header">
            <span className={`blog-tag ${tagClass(post.category)}`}>
              {categoryLabel(post.category)}
            </span>
            <h1 className="post-title">{post.title}</h1>
            <div className="blog-meta" style={{ marginBottom: 0 }}>
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.publishedAt && post.readTime && <span>·</span>}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
            {post.description && (
              <p className="post-description">{post.description}</p>
            )}
          </header>

          <PostBody content={post.body} />

          {related.length > 0 && (
            <aside className="post-related">
              <div className="section-label">More from this category</div>
              <div className="post-related-grid">
                {related.map(p => (
                  <Link key={p.id} href={`/blogs/${p._sys.filename}`} className="blog-card">
                    <span className={`blog-tag ${tagClass(p.category)}`}>
                      {categoryLabel(p.category)}
                    </span>
                    <div className="blog-title" style={{ fontSize: '1rem' }}>{p.title}</div>
                    {p.description && <div className="blog-desc">{p.description}</div>}
                    <div className="blogs-post-read">Read <Arrow size={11} /></div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>

        <div className="site-footer">
          <div className="footer-inner">
            <span className="footer-copy">© 2025 Karan Belani — Network Engineer</span>
            <div className="footer-links">
              <a href="/#about" className="footer-link">About</a>
              <a href="/#certifications" className="footer-link">Certs</a>
              <Link href="/blogs" className="footer-link">Blog</Link>
              <a href="/#contact" className="footer-link">Contact</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
